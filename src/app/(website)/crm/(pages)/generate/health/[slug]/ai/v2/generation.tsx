/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import { generateRamsAction } from "./action";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Bot,
  Send,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  AlertTriangle
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface RamsChatBotProps {
  updateRams: (data: any) => void;
}

/** Tiny helper for animated typing dots */
function TypingDots() {
  return (
    <span className="inline-flex w-5 justify-between">
      <span className="h-1 w-1 rounded-full bg-current animate-[pulse_1s_ease-in-out_infinite]" />
      <span className="h-1 w-1 rounded-full bg-current animate-[pulse_1s_0.15s_ease-in-out_infinite]" />
      <span className="h-1 w-1 rounded-full bg-current animate-[pulse_1s_0.3s_ease-in-out_infinite]" />
    </span>
  );
}

type Message = {
  sender: "bot" | "user";
  text: string;
};

const STEPS: { key: string; question: string; placeholder?: string }[] = [
  { key: "title",        question: "What’s the project title?",         placeholder: "e.g. Process Pipework Install – Line B" },
  { key: "location",     question: "Where is the project located?",      placeholder: "e.g. P&G Thurrock, Hedley Ave, RM20 4AL" },
  { key: "client",       question: "Who’s the client?",                  placeholder: "e.g. Procter & Gamble" },
  { key: "prepared_by",  question: "Who prepared this RAMS?",            placeholder: "e.g. T. Humphries" },
  { key: "date",         question: "What’s the RAMS date? (DD-MM-YYYY)", placeholder: "e.g. 11-04-2025" },
  { key: "review_date",  question: "What’s the review date? (DD-MM-YYYY, optional — type N/A to skip)", placeholder: "e.g. 11-04-2025" },
  { key: "scope",        question: "Briefly describe the project scope.", placeholder: "e.g. Install, fit, and weld mild & stainless pipework…" },
];

export default function RamsChatBotPopover({ updateRams }: RamsChatBotProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "👋 Hi! Let’s build your RAMS together. What’s the project title?" },
  ]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [thinking, setThinking] = useState(false);

  // ScrollArea container ref (we'll find the Radix viewport inside)
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const currentStep = useMemo(
    () => STEPS.find((s) => !(s.key in answers)),
    [answers]
  );

  // Auto-scroll to bottom on new messages/thinking/loading/open changes
  useEffect(() => {
    const root = scrollContainerRef.current;
    if (!root) return;
    const viewport = root.querySelector(
      "[data-radix-scroll-area-viewport]"
    ) as HTMLDivElement | null;
    if (!viewport) return;
    viewport.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" });
  }, [messages, loading, thinking, open]);

  function reset() {
    setMessages([{ sender: "bot", text: "👋 Hi! Let’s build your RAMS together. What’s the project title?" }]);
    setAnswers({});
    setInput("");
    setLoading(false);
    setThinking(false);
  }

  async function handleSend() {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setInput("");

    if (currentStep) {
      const updated = { ...answers, [currentStep.key]: userMsg };
      setAnswers(updated);

      const next = STEPS.find((s) => !(s.key in updated));
      if (next) {
        setThinking(true);
        setTimeout(() => {
          setThinking(false);
          setMessages((prev) => [...prev, { sender: "bot", text: next.question }]);
        }, 350);
      } else {
        await generateRams(updated);
      }
    }
  }

  async function generateRams(data: Record<string, string>) {
    setLoading(true);
    // Echo the overwrite disclaimer right before generation
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: "⚠️ Heads up: generating will overwrite your existing editor content." },
      { sender: "bot", text: "🧠 Generating your RAMS object…" },
    ]);

    try {
      // Call your server action (keep its expected args)
      const aiRams = await generateRamsAction({
        title: data.title,
        client: data.client,
        location: data.location,
        prepared_by: data.prepared_by,
        scope: data.scope,
      });

      // Normalise optional review_date ("N/A" -> undefined)
      const normalizedReview = (data.review_date || "").trim().toLowerCase();
      const reviewDateValue =
        normalizedReview === "n/a" || normalizedReview === "na" || normalizedReview === "none"
          ? undefined
          : data.review_date;

      // Merge user-provided values back into RAMS.project
      const mergedRams = {
        ...aiRams,
        project: {
          ...aiRams.project,
          title: data.title || aiRams.project?.title,
          location: data.location || aiRams.project?.location,
          client: data.client || aiRams.project?.client,
          prepared_by: data.prepared_by || aiRams.project?.prepared_by,
          scope: data.scope || aiRams.project?.scope,
          date: data.date || aiRams.project?.date,
          review_date: reviewDateValue ?? aiRams.project?.review_date,
        },
      };

      updateRams(mergedRams);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "✅ RAMS object generated and sent to your form!" },
      ]);
    } catch (err) {
      console.error("❌ RAMS generation error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "❌ Error generating RAMS. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const progress = ((Object.keys(answers).length / STEPS.length) * 100).toFixed(0);

  return (
    <div className="z-50">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            size="lg"
            className="shadow-xl rounded-full px-5 gap-2 transition-all hover:scale-105
              bg-gradient-to-tr from-indigo-600 via-fuchsia-600 to-rose-500 text-white"
            aria-label="Open RAMS Chatbot"
          >
            <Sparkles className="h-4 w-4" />
            RAMS AI
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="end"
          sideOffset={12}
          className="w-[380px] p-0 overflow-hidden rounded-2xl shadow-2xl border-0"
        >
          {/* Header with gradient */}
          <div
            className="relative p-4 text-white"
            style={{
              background:
                "radial-gradient(1200px 400px at 80% -10%, rgba(255,255,255,0.25), transparent), linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #f43f5e 100%)",
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-medium leading-none">RAMS Assistant</div>
                  <div className="text-xs opacity-90">Guided AI generation</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {Object.keys(answers).length === STEPS.length ? (
                  <Badge className="bg-white/20 text-white hover:bg-white/30">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Ready
                  </Badge>
                ) : (
                  <Badge className="bg-white/20 text-white hover:bg-white/30">
                    {progress}% complete
                  </Badge>
                )}
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-white/20 text-white hover:bg-white/30"
                  onClick={reset}
                  title="Restart"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Overwrite disclaimer (persistent) */}
          <div className="p-3 pt-3">
            <Alert className="border-amber-300/60 bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-900/50">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="text-sm">Important</AlertTitle>
              <AlertDescription className="text-xs leading-relaxed">
                Generating with RAMS AI will <span className="font-semibold">overwrite</span> the existing content in your editor
                (previous entries will be cleared).
              </AlertDescription>
            </Alert>
          </div>

          {/* Messages */}
          <div className="px-3 pb-3">
            <ScrollArea className="h-[320px]" ref={scrollContainerRef}>
              <div className="space-y-2 pr-2">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`max-w-[85%] w-fit rounded-2xl px-3 py-2 text-sm shadow-sm ${
                      m.sender === "bot"
                        ? "bg-muted text-foreground"
                        : "bg-primary text-primary-foreground ml-auto"
                    }`}
                  >
                    {m.text}
                  </div>
                ))}

                {thinking && (
                  <div className="max-w-[85%] w-fit rounded-2xl px-3 py-2 text-sm bg-muted text-foreground shadow-sm">
                    <TypingDots />
                  </div>
                )}

                {loading && (
                  <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating…
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          <Separator />

          {/* Input Bar */}
          <div className="p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <div className="flex flex-col w-full">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                  placeholder={currentStep?.placeholder || "Type your answer…"}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  className="bg-background"
                />
                <Button type="submit" disabled={loading || !input.trim()} className="gap-1 mt-2 self-end">
                  <Send className="h-4 w-4" />
                  Send
                </Button>
              </div>
            </form>

            {currentStep?.key === "scope" && (
              <div className="mt-2 text-[11px] text-muted-foreground">
                Tip: mention metal type, process (cut/fit/weld), testing, access, permits.
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
