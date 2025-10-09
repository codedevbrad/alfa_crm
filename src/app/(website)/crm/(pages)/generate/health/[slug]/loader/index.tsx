/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle2, Copy, Loader2 } from "lucide-react";
import { useState } from "react";
import { initial, type Rams } from "../rams";
import { cn } from "@/lib/utils";

import{ systemPrompt } from "../ai/v2/prompt";
interface RamsImporterModalProps {
  updateRams: (rams: Rams) => void;
}

export default function RamsImporterModal({ updateRams }: RamsImporterModalProps) {
  const [open, setOpen] = useState(false);
  const [raw, setRaw] = useState("");
  const [parsed, setParsed] = useState<Rams | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  function tryParseInput(input: string) {
    try {
      // try JSON first
      return JSON.parse(input);
    } catch {
      try {
        // try plain JS (object literal)
        // eslint-disable-next-line no-new-func
        return new Function(`return (${input})`)();
      } catch {
        throw new Error("Invalid JSON or JS object syntax.");
      }
    }
  }

  function validateRams(obj: any): obj is Rams {
    if (typeof obj !== "object" || !obj) return false;
    if (!obj.project || typeof obj.project !== "object") return false;
    const required = ["title", "location", "client", "prepared_by", "date"];
    for (const key of required) {
      if (typeof obj.project[key] !== "string") return false;
    }
    if (!Array.isArray(obj.activities)) return false;
    if (!Array.isArray(obj.responsibilities)) return false;
    if (!obj.materials_equipment || typeof obj.materials_equipment !== "object") return false;
    if (!Array.isArray(obj.risk_assessment)) return false;
    return true;
  }

  function handleValidate() {
    setError(null);
    setValid(false);
    setParsed(null);

    try {
      const obj = tryParseInput(raw);
      if (validateRams(obj)) {
        setParsed(obj);
        setValid(true);
      } else {
        setError("❌ Object structure doesn’t match the RAMS schema.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to parse input.");
    }
  }

  async function handleLoad() {
    if (!parsed) return;
    setLoading(true);
    try {
      const merged = { ...initial, ...parsed } as Rams;
      updateRams(merged);
      setError(null);
      setValid(false);
      setParsed(null);
      setRaw("");
      setOpen(false);
    } catch (err: any) {
      setError("Failed to load RAMS object.");
    } finally {
      setLoading(false);
    }
  }

  function handleCopyPrompt() {
    navigator.clipboard.writeText(systemPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">📥 Import RAMS Object</Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import RAMS Object</DialogTitle>
          <DialogDescription>
            Paste a JSON or JS object that matches your RAMS schema. You can also copy the ChatGPT prompt below to generate one.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* ChatGPT prompt helper */}
          <div className="bg-muted border rounded-md p-3 text-sm relative">
            <p className="font-medium mb-1">💬 ChatGPT Prompt Helper</p>
            <Textarea
              readOnly
              value={systemPrompt}
              className="text-xs font-mono bg-muted resize-none border-none focus-visible:ring-0 h-28"
              wordLimit={20000}
            />
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-2 right-2"
              onClick={handleCopyPrompt}
            >
              <Copy className="w-4 h-4 mr-1" />
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>

          {/* Paste zone */}
          <div>
            <p className="text-sm mb-1 font-medium">Paste your RAMS object:</p>
            <Textarea
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              placeholder={`Paste JSON or JS object here...`}
              className="font-mono text-xs h-44"
            wordLimit={20000}
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={handleValidate}>
              Validate
            </Button>

            {valid && parsed && (
              <Button onClick={handleLoad} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading…
                  </>
                ) : (
                  "✅ Load into RAMS"
                )}
              </Button>
            )}
          </div>

          {/* Status messages */}
          <div className={cn("text-sm mt-1 min-h-[1.5rem]")}>
            {error && (
              <div className="flex items-center text-red-600 gap-1">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}
            {valid && !error && parsed && (
              <div className="flex items-center text-green-600 gap-1">
                <CheckCircle2 className="w-4 h-4" /> Valid RAMS object detected!
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
