/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import { useMemo, useRef, useState, useEffect } from 'react';
import { Rams, initial as blankRams } from "../../rams";
import { generateRams } from './gpt';

/* -------------------- Wizard Config -------------------- */

type StepKey =
  | 'title'
  | 'client'
  | 'location'
  | 'prepared_by'
  | 'scope'
  | 'activities'
  | 'duration'
  | 'confirm';

type WizardState = {
  title: string;
  client: string;
  location: string;
  prepared_by: string;
  scope: string;
  activities: string[];
  duration: string;
};

const DEFAULTS: WizardState = {
  title: 'Conveyor System Upgrade – Leeds Manufacturing Plant',
  client: 'Nestlé UK',
  location: 'Seacroft Factory, Leeds',
  prepared_by: 'ALFA Industrial Services Ltd',
  scope:
    'Removal of old conveyor sections, fabrication and installation of new stainless-steel conveyor lines, alignment, electrical tie-in, and commissioning.',
  activities: [
    'hot works (MIG/TIG welding)',
    'working at height (MEWPs)',
    'manual handling of conveyor frames',
    'electrical lock-out/tag-out',
    'final inspection/testing',
  ],
  duration: '5 days – to be completed during planned factory shutdown.',
};

const STEPS: { key: StepKey; prompt: string; placeholder?: string }[] = [
  { key: 'title', prompt: 'What is the project title?', placeholder: DEFAULTS.title },
  { key: 'client', prompt: 'Who is the client?', placeholder: DEFAULTS.client },
  { key: 'location', prompt: 'Where is the location?', placeholder: DEFAULTS.location },
  { key: 'prepared_by', prompt: 'Who prepared the RAMS?', placeholder: DEFAULTS.prepared_by },
  { key: 'scope', prompt: 'Give me a concise scope of works.', placeholder: DEFAULTS.scope },
  {
    key: 'activities',
    prompt: 'List the key activities (comma or new line separated).',
    placeholder: DEFAULTS.activities.join(', '),
  },
  {
    key: 'duration',
    prompt: 'What’s the project duration/constraints?',
    placeholder: DEFAULTS.duration,
  },
  { key: 'confirm', prompt: 'All set! Review and generate?' },
];

/* -------------------- AI Prompt Builder -------------------- */

function buildPrompt(s: WizardState) {
  const acts = s.activities.map((a) => a.trim()).filter(Boolean);
  const activitiesLine =
    acts.length > 0
      ? `Activities include: ${acts.join(', ')}.`
      : 'Activities include: general site preparation and installation.';

  return `
You are a RAMS generator. Produce a single JSON object that matches EXACTLY this TypeScript schema (no additional fields, no comments):

interface Rams {
  project: {
    title: string;
    location: string;
    client: string;
    prepared_by: string;
    date: string;
    review_date?: string;
    author?: string;
    scope?: string;
  };
  activities: string[];
  responsibilities: { role: string; description: string }[];
  materials_equipment: { pipes?: string[]; fittings?: string[]; tools?: string[]; ppe?: string[] };
  health_safety?: string[];
  procedure?: { step: string; details: string[] }[];
  ppe?: { item: string; standard?: string; type?: string }[];
  risk_assessment?: {
    activity: string;
    hazard: string;
    likelihood: number;
    severity: number;
    risk: number;
    who: string[];
    controls: string;
    residual_likelihood?: number;
    residual_severity?: number;
    residual_risk?: number;
    residual_who?: string[];
    monitoring?: string;
  }[];
  hazard_register?: {
    hazard: string;
    harm: string;
    existing_controls: string;
    further_action: string;
    action_by: string;
  }[];
  emergency_plan?: {
    site_contacts?: { name: string; role?: string; phone?: string }[];
    hospital?: { name?: string; address?: string; phone?: string };
    muster_point?: string;
    rescue_plans?: {
      scenario: string;
      method?: string;
      equipment?: string;
      designated_rescuer?: string;
    }[];
  };
}

CONTEXT:
- Project Title: ${s.title}
- Client: ${s.client}
- Location: ${s.location}
- Prepared By: ${s.prepared_by}
- Scope: ${s.scope}
- ${activitiesLine}
- Duration/Constraints: ${s.duration}

RULES:
1. Infer all missing fields logically from scope & activities.
2. If uncertain, still include that key with an empty string or empty array — never omit it.
3. Use concise British English and UK HSE terminology.
4. Date = today (YYYY-MM-DD), review_date = +30 days, author = initials (e.g., "T. Humphries").
5. Return ONLY the JSON.`;
}

/* -------------------- Safe AI Wrapper -------------------- */

async function generateRamsSafe(prompt: string) {
  try {
    const raw = await generateRams({ prompt });
    const rams: Rams = typeof raw === 'string' ? JSON.parse(raw) : raw;

    const missing: string[] = [];
    function check(obj: any, path: string[] = []) {
      if (obj == null) {
        missing.push(path.join('.'));
        return;
      }
      if (Array.isArray(obj)) {
        if (obj.length === 0) missing.push(path.join('.'));
        else obj.forEach((v, i) => check(v, [...path, `[${i}]`]));
      } else if (typeof obj === 'object') {
        for (const [k, v] of Object.entries(obj)) check(v, [...path, k]);
      } else if (typeof obj === 'string' && obj.trim() === '') {
        missing.push(path.join('.'));
      }
    }
    check(rams);
    const grouped = Array.from(
      new Set(missing.map((m) => m.replace(/\.\[\d+\]\..*/, '')))
    );

    return { rams, missing: grouped };
  } catch (err) {
    console.error('AI generation error:', err);
    return { rams: blankRams, missing: ['!failed_to_generate'] };
  }
}

/* -------------------- UI Helpers -------------------- */

function ChatBubble({ role, children }: { role: 'bot' | 'user'; children: React.ReactNode }) {
  const isUser = role === 'user';
  return (
    <div className={`mb-3 flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className="flex items-end gap-2 max-w-[85%]">
        {!isUser && (
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs">
            🤖
          </div>
        )}
        <div
          className={`relative rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap shadow-sm ${
            isUser ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white border rounded-bl-sm'
          }`}
        >
          {children}
        </div>
        {isUser && (
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs">
            🧑
          </div>
        )}
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="mb-3 flex justify-start">
      <div className="flex items-end gap-2 max-w-[85%]">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs">
          🤖
        </div>
        <div className="relative bg-white border rounded-bl-sm rounded-2xl px-3 py-2 text-sm shadow-sm">
          <div className="flex gap-1">
            <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:120ms]" />
            <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:240ms]" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------- Main Component -------------------- */

export default function RamsChatWizard({ updateRams }: { updateRams?: (r: Rams) => void }) {
  const [state, setState] = useState<WizardState>({ ...DEFAULTS });
  const [stepIndex, setStepIndex] = useState(0);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'bot' | 'user'; text: string }[]>([
    { role: 'bot', text: STEPS[0].prompt },
  ]);
  const [typing, setTyping] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rams, setRams] = useState<Rams | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const TYPING_MS = 400;

  useEffect(() => setInput(''), [stepIndex]);
  useEffect(() => {
    containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing, rams, collapsed]);

  const onNext = () => {
    const step = STEPS[stepIndex];
    const value = input.trim();

    if (step.key !== 'confirm') {
      setMessages((m) => [...m, { role: 'user', text: value || '(skipped)' }]);
    }

    switch (step.key) {
      case 'title': setState((s) => ({ ...s, title: value || s.title })); break;
      case 'client': setState((s) => ({ ...s, client: value || s.client })); break;
      case 'location': setState((s) => ({ ...s, location: value || s.location })); break;
      case 'prepared_by': setState((s) => ({ ...s, prepared_by: value || s.prepared_by })); break;
      case 'scope': setState((s) => ({ ...s, scope: value || s.scope })); break;
      case 'activities': {
        const parsed = value.length === 0
          ? state.activities
          : (value.includes('\n') ? value.split('\n') : value.split(','));
        const activities = parsed.map((x) => x.trim()).filter(Boolean);
        setState((s) => ({ ...s, activities: activities.length ? activities : s.activities }));
        break;
      }
      case 'duration': setState((s) => ({ ...s, duration: value || s.duration })); break;
    }

    const next = Math.min(stepIndex + 1, STEPS.length - 1);
    setStepIndex(next);
    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      if (STEPS[next].key !== 'confirm') {
        setMessages((m) => [...m, { role: 'bot', text: STEPS[next].prompt }]);
      } else {
        const preview = buildPrompt({ ...state });
        setMessages((m) => [
          ...m,
          { role: 'bot', text: "Here's what I’ll send to the generator:" },
          { role: 'bot', text: '---\n' + preview + '\n---' },
        ]);
      }
    }, TYPING_MS);
  };

  const promptString = useMemo(() => buildPrompt(state), [state]);

  const onGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const { rams: data, missing } = await generateRamsSafe(promptString);
      setRams(data);
      updateRams?.(data);

      if (missing.length && !missing.includes('!failed_to_generate')) {
        console.warn('⚠️ Missing sections:', missing);
        setMessages((m) => [
          ...m,
          { role: 'bot', text: 'RAMS generated, but some parts are incomplete 👇' },
          { role: 'bot', text: 'Missing: ' + missing.join(', ') },
        ]);
      } else if (missing.includes('!failed_to_generate')) {
        setMessages((m) => [...m, { role: 'bot', text: '❌ Failed to generate valid JSON.' }]);
      } else {
        setMessages((m) => [...m, { role: 'bot', text: '✅ RAMS generated successfully!' }]);
      }

      setCollapsed(true);
    } catch (e: any) {
      setError(e?.message || 'Failed to generate RAMS');
      setMessages((m) => [...m, { role: 'bot', text: 'Something went wrong generating RAMS.' }]);
    } finally {
      setGenerating(false);
    }
  };

  const step = STEPS[stepIndex];
  const summary = `${state.title || 'Untitled'} — ${state.client || 'Client'}`;

  return (
    <div className="w-full border rounded-md bg-white my-4">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div>
          <h2 className="text-lg font-semibold truncate">Generate RAMS (AI Builder)</h2>
          {collapsed && <p className="text-xs text-gray-500 mt-1 truncate">{summary}</p>}
        </div>
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="inline-flex items-center gap-2 px-2 py-1 rounded-md border bg-white hover:bg-gray-50"
        >
          <span className="text-sm">{collapsed ? 'Open' : 'Collapse'}</span>
          <svg
            className={`h-4 w-4 transition-transform ${collapsed ? '' : 'rotate-180'}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div
        className={`transition-[grid-template-rows] duration-300 ease-out grid ${
          collapsed ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-4">
            <div
              ref={containerRef}
              className="mt-2 h-72 overflow-y-auto rounded-md border bg-gray-50 p-3"
            >
              {messages.map((m, i) => (
                <ChatBubble key={i} role={m.role}>
                  {m.text}
                </ChatBubble>
              ))}
              {typing && <TypingBubble />}
            </div>

            {step.key === 'confirm' ? (
              <div className="mt-4">
                <div className="rounded-md border bg-gray-50 p-3 text-sm whitespace-pre-wrap">
                  {buildPrompt(state)}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() => setStepIndex(0)}
                    className="px-3 py-2 border rounded-md bg-white hover:bg-gray-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={onGenerate}
                    disabled={generating}
                    className="px-3 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
                  >
                    {generating ? 'Generating…' : 'Generate RAMS'}
                  </button>
                  {error && <span className="text-sm text-red-600">{error}</span>}
                </div>
              </div>
            ) : (
              <div className="mt-3">
                {step.key === 'scope' || step.key === 'activities' ? (
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full h-24 p-2 border rounded-md"
                    placeholder={step.placeholder}
                  />
                ) : (
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    placeholder={step.placeholder}
                  />
                )}
                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() => setStepIndex(Math.max(0, stepIndex - 1))}
                    className="px-3 py-2 border rounded-md bg-white hover:bg-gray-100"
                    disabled={stepIndex === 0}
                  >
                    Back
                  </button>
                  <button
                    onClick={onNext}
                    className="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {step.key === 'duration' ? 'Review' : 'Next'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
