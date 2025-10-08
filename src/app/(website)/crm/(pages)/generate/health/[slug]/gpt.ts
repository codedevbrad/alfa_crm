/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { OpenAI } from 'openai';
import { initial, type Rams } from './rams';

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

export async function generateRams({ prompt, locale = 'UK', seed, disabled = false }: Args): Promise<Rams> {
  if (disabled) return initial;
  if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is not set');

  const system = `
You are an expert Health & Safety advisor creating RAMS (Risk Assessment and Method Statement).
Return ONLY strict JSON matching the TypeScript interface below (no markdown fences, no extra keys).
Rules:
- UK terminology unless locale="US".
- Likelihood/Severity are integers 1–5.
- risk = likelihood × severity.
- residual_risk = residual_likelihood × residual_severity (when provided).
- Dates in YYYY-MM-DD.
TypeScript interface (shape to follow exactly):

interface Rams {
  project: {
    title: string; location: string; client: string; prepared_by: string; date: string;
    review_date?: string; author?: string; scope?: string;
  };
  activities: string[];
  responsibilities: { role: string; description: string }[];
  materials_equipment: {
    pipes?: string[]; fittings?: string[]; tools?: string[]; ppe?: string[];
  };
  health_safety?: { hazards?: string[]; controls?: string[] };
  procedure?: { preparation?: string[]; fitting?: string[]; inspection?: string[] };
  environment?: { waste_management?: string; spill_prevention?: string; noise_control?: string };
  emergency?: { fire?: string; accident?: string; spill?: string };
  ppe?: { item: string; standard?: string; type?: string }[];
  risk_assessment?: {
    activity: string; hazard: string; likelihood: number; severity: number; risk: number;
    who: string[]; controls: string; residual_likelihood?: number; residual_severity?: number;
    residual_risk?: number; residual_who?: string[]; monitoring?: string;
  }[];
}
`.trim();

  // Give the model the BASE it should follow, and ask it to update relevant fields.
  const user = `
Locale: ${locale}
Base object to use (update values where relevant, keep the same keys/shape):
${JSON.stringify(initial)}

Now generate a COMPLETE Rams JSON object for this project.
${prompt ? `Project context: ${prompt}` : 'Create a realistic industrial pipework/fabrication project.'}
Ensure arrays are non-empty where appropriate and include at least 5 risk_assessment entries covering key hazards for the scope.
`.trim();

  try {
    const resp = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.25,
      response_format: { type: 'json_object' }, // force JSON
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      ...(typeof seed === 'number' ? ({ seed } as any) : {}),
    });

    console.log('OpenAI GPT response:', JSON.stringify(resp, null, 2));

    const raw = resp.choices?.[0]?.message?.content ?? '';
    const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/```$/i, '');
    const modelObj = JSON.parse(cleaned) as Partial<Rams>;

    // Merge onto your initial so no keys go missing
    const json = deepMerge<Rams>(initial, modelObj);

    // Fix dates
    json.project.date = asISO(json.project.date);
    if (json.project.review_date) json.project.review_date = asISO(json.project.review_date);

    // Ensure arrays exist
    json.activities ??= [];
    json.responsibilities ??= [];
    json.materials_equipment ??= {};
    json.risk_assessment ??= [];

    // Recompute risk fields & normalise "who"
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

    if (!json?.project?.title) throw new Error('Model returned RAMS without project.title');
    return json;
  } catch (err: any) {
    console.error('generateRams error:', err?.message || err);
    // fall back to your initial (not an undefined dummy)
    return initial;
  }
}
