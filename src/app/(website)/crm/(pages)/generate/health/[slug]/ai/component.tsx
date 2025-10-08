/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import { useMemo, useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Rams } from "../rams";
import { generateRams } from '../gpt';

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

/** Contextual hints to help users answer each step well */
const HINTS: Record<Exclude<StepKey, 'confirm'>, { title: string; bullets: string[] }> = {
  title: {
    title: 'Tip: Clear, specific title',
    bullets: [
      'Include the asset/system + area (e.g., “Conveyor System Upgrade – Line 3”).',
      'Optional: phase or shutdown window if relevant.',
    ],
  },
  client: {
    title: 'Tip: Who is the end client/site owner',
    bullets: [
      'Company or facility name (e.g., “Nestlé UK”, “P&G Thurrock Plant”).',
      'You can include a department if helpful (e.g., “Facilities”).',
    ],
  },
  location: {
    title: 'Tip: Exact work location',
    bullets: [
      'Site + building/area/floor (e.g., “Seacroft Factory, Leeds – Line 3, Mezzanine”).',
      'If multiple areas, list the primary one or add “multiple areas on request”.',
    ],
  },
  prepared_by: {
    title: 'Tip: Who is authoring the RAMS',
    bullets: [
      'Your company name (and team if needed).',
      'This maps to project.prepared_by in the RAMS object.',
    ],
  },
  scope: {
    title: 'Tip: Concise scope (verbs + objects)',
    bullets: [
      'Use action verbs: remove, fabricate, install, tie-in, test, commission.',
      'Include key standards/permits if critical (e.g., BS EN, hot work permit).',
      '1–3 sentences max—practical and specific.',
    ],
  },
  activities: {
    title: 'Tip: Core activities list',
    bullets: [
      'Short phrases, separated by commas or new lines.',
      'Examples: “hot works (MIG/TIG)”, “MEWP work”, “manual handling”, “LOTO”, “hydrotest”.',
      'These feed the RAMS activities and risk assessment generation.',
    ],
  },
  duration: {
    title: 'Tip: Duration & constraints',
    bullets: [
      'How long + when (e.g., “5 days during planned shutdown”).',
      'Add constraints: “night shifts”, “access via MEWPs”, “weekend only”.',
    ],
  },
};

function buildPrompt(s: WizardState) {
  const acts = s.activities.map((a) => a.trim()).filter(Boolean);
  const activitiesLine =
    acts.length > 0
      ? `Activities include: ${acts.join(', ')}.`
      : 'Activities include: general site preparation and installation.';
  return [
    `Project Title: ${s.title}`,
    `Client: ${s.client}`,
    `Location: ${s.location}`,
    `Prepared By: ${s.prepared_by}`,
    `Scope: ${s.scope}`,
    activitiesLine,
    `Project duration: ${s.duration}`,
    `All works to comply with UK HSE guidelines and site safety standards.`,
  ].join('  \n');
}

/* --- tiny UI helpers (bubbles) --- */
function ChatBubble({ role, children }: { role: 'bot' | 'user'; children: React.ReactNode }) {
  const isUser = role === 'user';
  return (
    <div className={`mb-3 flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className="flex items-end gap-2 max-w-[85%]">
        {!isUser && (
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs select-none">
            🤖
          </div>
        )}
        <div
          className={`relative rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap shadow-sm
          ${isUser ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white border rounded-bl-sm'}
        `}>
          {children}
          {isUser ? (
            <span
              className="absolute -right-2 bottom-0 w-0 h-0
              border-t-8 border-t-transparent border-l-8 border-l-blue-600 border-b-8 border-b-transparent"
            />
          ) : (
            <span
              className="absolute -left-2 bottom-0 w-0 h-0
              border-t-8 border-t-transparent border-r-8 border-r-white border-b-8 border-b-transparent"
            />
          )}
        </div>
        {isUser && (
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs select-none">
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
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs select-none">
          🤖
        </div>
        <div className="relative bg-white border rounded-bl-sm rounded-2xl px-3 py-2 text-sm shadow-sm">
          <div className="flex gap-1">
            <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:120ms]" />
            <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:240ms]" />
          </div>
          <span
            className="absolute -left-2 bottom-0 w-0 h-0
              border-t-8 border-t-transparent border-r-8 border-r-white border-b-8 border-b-transparent"
          />
        </div>
      </div>
    </div>
  );
}

/* --- Collapsible config --- */
const PERSIST_COLLAPSE = false; // set to true if you want it to remember

export default function RamsChatWizard({ updateRams }: { updateRams?: (r: Rams) => void }) {
  const [state, setState] = useState<WizardState>({ ...DEFAULTS });
  const [stepIndex, setStepIndex] = useState(0);
  const [input, setInput] = useState(''); // inputs are empty; placeholders only
  const [messages, setMessages] = useState<{ role: 'bot' | 'user'; text: string }[]>(
    [{ role: 'bot', text: STEPS[0].prompt }]
  );
  const [typing, setTyping] = useState(false);

  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rams, setRams] = useState<Rams | null>(null);

  // Collapsible state
  const [collapsed, setCollapsed] = useState<boolean>(false);

  // Load/persist collapsed state (optional)
  useEffect(() => {
    if (!PERSIST_COLLAPSE) return;
    const raw = window.localStorage.getItem('ramsWizardCollapsed');
    if (raw != null) setCollapsed(raw === 'true');
  }, []);
  useEffect(() => {
    if (!PERSIST_COLLAPSE) return;
    window.localStorage.setItem('ramsWizardCollapsed', String(collapsed));
  }, [collapsed]);

  const containerRef = useRef<HTMLDivElement>(null);
  const TYPING_MS = 450;

  // keep inputs empty on step change
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

    // Update state; if blank, keep existing defaults
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
          { role: 'bot', text: "Here's what I’ll send to the RAMS generator. You can edit any step or hit Generate:" },
          { role: 'bot', text: '---\n' + preview + '\n---' },
        ]);
      }
    }, TYPING_MS);
  };

  const onBack = () => {
    if (stepIndex === 0) return;
    setMessages((m) => {
      const copy = [...m];
      if (copy.length >= 2) copy.splice(copy.length - 2, 2);
      return copy.length ? copy : [{ role: 'bot', text: STEPS[0].prompt }];
    });
    setStepIndex((i) => Math.max(0, i - 1));
  };

  const promptString = useMemo(() => buildPrompt(state), [state]);

  const onGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const data = await generateRams({ prompt: promptString });
      setRams(data);
      updateRams?.(data);
      setMessages((m) => [...m, { role: 'bot', text: 'RAMS generated. Preview below 👇' }]);
      setCollapsed(true); // auto-collapse after success
    } catch (e: any) {
      setError(e?.message || 'Failed to generate RAMS');
      setMessages((m) => [...m, { role: 'bot', text: 'Something went wrong generating RAMS.' }]);
    } finally {
      setGenerating(false);
    }
  };

  const step = STEPS[stepIndex];

  // Small collapsed summary line
  const summary = `${state.title || 'Untitled'} — ${state.client || 'Client'}`;

  const hint = step.key !== 'confirm' ? HINTS[step.key] : undefined;

  return (
    <div className="w-full border rounded-md bg-white my-4">
      {/* Header with toggle */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold truncate">Generate RAMS (Chat Wizard)</h2>
          {/* Collapsed summary */}
          {collapsed && (
            <p className="text-xs text-gray-500 mt-1 truncate">
              {summary}
            </p>
          )}
        </div>
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="inline-flex items-center gap-2 px-2 py-1 rounded-md border bg-white hover:bg-gray-50"
          aria-expanded={!collapsed}
          aria-controls="rams-wizard-body"
        >
          <span className="text-sm">{collapsed ? 'Open' : 'Collapse'}</span>
          <svg
            className={`h-4 w-4 transition-transform ${collapsed ? '' : 'rotate-180'}`}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Collapsible body */}
      <div
        id="rams-wizard-body"
        className={`transition-[grid-template-rows] duration-300 ease-out grid ${
          collapsed ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-4">
            {/* Chat window */}
            <div ref={containerRef} className="mt-2 h-72 overflow-y-auto rounded-md border bg-gray-50 p-3">
              {messages.map((m, i) => (
                <ChatBubble key={i} role={m.role}>{m.text}</ChatBubble>
              ))}
              {typing && <TypingBubble />}
            </div>

            {/* Input for the current step (hidden at confirm) */}
            {step.key !== 'confirm' && (
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

                {/* Contextual hint block */}
                {hint && (
                  <div className="mt-2 text-xs text-gray-600 bg-gray-50 border rounded-md p-2">
                    <div className="font-medium">{hint.title}</div>
                    <ul className="list-disc ml-5 mt-1 space-y-0.5">
                      {hint.bullets.map((b, idx) => (
                        <li key={idx}>{b}</li>
                      ))}
                    </ul>
                    {/* Quick fill helper */}
                    {STEPS[stepIndex].placeholder && (
                      <button
                        type="button"
                        onClick={() => setInput(STEPS[stepIndex].placeholder || '')}
                        className="mt-2 inline-flex items-center text-blue-600 hover:underline"
                      >
                        Use example
                      </button>
                    )}
                  </div>
                )}

                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={onBack}
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

            {/* Confirm + Generate */}
            {step.key === 'confirm' && (
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
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
