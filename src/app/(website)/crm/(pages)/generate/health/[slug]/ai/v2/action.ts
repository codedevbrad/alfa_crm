/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { OpenAI } from 'openai';
import { initial, type Rams } from '../../rams';
import {  systemPrompt } from './prompt';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type Args = { prompt?: string; locale?: 'UK' | 'US'; seed?: number; disabled?: boolean };

/* --- small helpers --- */
const asISO = (d?: string) =>
  d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : new Date().toISOString().slice(0, 10);

const clamp = (n: unknown) => Math.min(5, Math.max(1, Number(n) || 1));

function deepMerge<T>(base: T, patch: Partial<T>): T {
  if (patch == null) return base;
  if (Array.isArray(base)) return (patch as any) ?? (base as any);
  if (typeof base === 'object' && base) {
    const out: any = Array.isArray(base) ? [] : { ...base };
    for (const k of new Set([...Object.keys(base as any), ...Object.keys(patch as any)])) {
      const b: any = (base as any)[k];
      const p: any = (patch as any)[k];
      if (p === undefined) out[k] = b;
      else if (b && typeof b === 'object' && !Array.isArray(b) && p && typeof p === 'object' && !Array.isArray(p)) {
        out[k] = deepMerge(b, p);
      } else {
        out[k] = p;
      }
    }
    return out;
  }
  return (patch as T) ?? base;
}



/* --- MAIN GENERATOR --- */

export async function generateRamsAction({
  prompt,
  locale = 'UK',
  seed,
  disabled = false,
}: Args): Promise<Rams> {
  if (disabled) return initial;
  if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is not set');


  const user = `
Locale: ${locale}
Base RAMS structure (update all values where relevant):
${JSON.stringify(initial)}

Now generate a COMPLETE Rams JSON object using this context:
${prompt ?? 'Generic UK industrial fabrication project.'}

Ensure all key fields are populated. Avoid empty arrays. Output pure JSON.
`.trim();

  try {
    const resp = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.3,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: user },
      ],
      ...(typeof seed === 'number' ? ({ seed } as any) : {}),
    });

    const raw = resp.choices?.[0]?.message?.content ?? '';
    const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/```$/i, '');
    const modelObj = JSON.parse(cleaned) as Partial<Rams>;

    // Merge model output onto default initial
    const json = deepMerge<Rams>(initial, modelObj);

    // Fix dates
    json.project.date = asISO(json.project.date);
    if (json.project.review_date) json.project.review_date = asISO(json.project.review_date);

    // Ensure arrays exist
    json.activities ??= [];
    json.responsibilities ??= [];
    json.materials_equipment ??= {};
    json.risk_assessment ??= [];

    // Normalize risk fields
    json.risk_assessment = json.risk_assessment.map((r) => {
      const L = clamp(r.likelihood);
      const S = clamp(r.severity);
      const R = L * S;
      const Lp = r.residual_likelihood != null ? clamp(r.residual_likelihood) : undefined;
      const Sp = r.residual_severity != null ? clamp(r.residual_severity) : undefined;
      const Rp = Lp != null && Sp != null ? Lp * Sp : undefined;
      return {
        ...r,
        likelihood: L,
        severity: S,
        risk: R,
        residual_likelihood: Lp,
        residual_severity: Sp,
        residual_risk: Rp,
        who: Array.isArray(r.who) ? r.who : [],
      };
    });

    if (!json.project.title) throw new Error('Model returned RAMS without project title');
    return json;
  } catch (err: any) {
    console.error('❌ RAMS generation error:', err?.message || err);
    return initial;
  }
}
