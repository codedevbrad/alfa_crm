"use client";

import * as React from "react";
import { RAMS_ACTIVITIES } from "./activities";

// ShadCN UI
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// Icons
import { Check, Plus, X, Sparkles } from "lucide-react";

// Your utils
import { SectionTable, updateArray } from "./utils";
import { Rams } from "../rams";
import { TableCell } from "@/components/ui/table";

type Props = {
  rams: Rams;
  setRams: React.Dispatch<React.SetStateAction<Rams>>;
};

export default function StepActivities({ rams, setRams }: Props) {
  const activities = rams.activities ?? [];
  const groups = React.useMemo(() => Object.keys(RAMS_ACTIVITIES), []);
  const [open, setOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState(groups[0] ?? "");
  const [query, setQuery] = React.useState("");

  const addActivity = (label: string) => {
    setRams((prev) => {
      const next = new Set([...(prev.activities ?? []), label].map((s) => s.trim()).filter(Boolean));
      return { ...prev, activities: Array.from(next) };
    });
  };

  const removeActivity = (label: string) => {
    setRams((prev) => ({
      ...prev,
      activities: (prev.activities ?? []).filter((a) => a !== label),
    }));
  };

  const clearAll = () => setRams((prev) => ({ ...prev, activities: [] }));
  const isSelected = (label: string) => (activities ?? []).includes(label);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return RAMS_ACTIVITIES[activeTab] ?? [];
    return (RAMS_ACTIVITIES[activeTab] ?? []).filter((l) => l.toLowerCase().includes(q));
  }, [activeTab, query]);

  return (
    <section className="space-y-4">
      {/* Top bar */}
      <div className="flex flex-wrap items-center gap-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-to-tr from-indigo-600 via-fuchsia-600 to-rose-500 text-white shadow-lg hover:opacity-95">
              <Sparkles className="h-4 w-4" />
              Choose from library
            </Button>
          </DialogTrigger>

          <DialogContent
  // was: className="w-full p-0 overflow-hidden border-0"
  className="
    p-0 overflow-hidden border-0
    w-[92vw]                /* fill most of the viewport width */
    sm:max-w-2xl            /* ~672px */
    md:max-w-3xl            /* ~768px */
    lg:max-w-4xl            /* ~896px */
    xl:max-w-[1100px]       /* roomy on big screens */
    rounded-2xl
  "
  aria-describedby={undefined}
>

            {/* Gradient Header */}
            <DialogHeader className="p-5 text-white"
              style={{
                background:
                  "radial-gradient(1200px 400px at 80% -10%, rgba(255,255,255,0.18), transparent), linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #f43f5e 100%)",
              }}>
              <DialogTitle className="text-white">Select Activities</DialogTitle>
              <DialogDescription className="text-white/90">
                Pick activities by category. Selected items are disabled with a checkmark.
              </DialogDescription>
            </DialogHeader>

            {/* Controls */}
            <div className="p-4">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Search activities…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="bg-background"
                />
                <Button variant="secondary" onClick={clearAll}>Clear all</Button>
                <div className="ml-auto text-sm text-muted-foreground">
                  Selected: <span className="font-medium">{activities.length}</span>
                </div>
              </div>

              {/* Category Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-3">
                <TabsList className="w-full overflow-x-auto justify-start flex-wrap h-full">
                  {groups.map((g) => (
                    <TabsTrigger key={g} value={g} className="text-xs whitespace-nowrap">
                      {g}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {groups.map((g) => (
                  <TabsContent key={g} value={g} className="mt-3">
                    <div className="text-xs text-muted-foreground mb-2">
                      {RAMS_ACTIVITIES[g].length} options
                    </div>
                    <Separator />
                    <ScrollArea className="h-[360px] mt-3 pr-1">
                      <div className="grid gap-2">
                        {(g === activeTab ? filtered : RAMS_ACTIVITIES[g]).map((label) => {
                          const selected = isSelected(label);
                          return (
                            <button
                              key={label}
                              disabled={selected}
                              onClick={() => addActivity(label)}
                              className={[
                                "w-full text-left rounded-lg border px-3 py-2 transition-all",
                                "hover:border-primary/50 hover:bg-primary/5",
                                selected
                                  ? "opacity-60 cursor-not-allowed relative"
                                  : "cursor-pointer",
                              ].join(" ")}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm">{label}</span>
                                {selected && (
                                  <span className="inline-flex items-center gap-1 text-primary text-xs">
                                    <Check className="h-4 w-4" /> Selected
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                ))}
              </Tabs>
            </div>

            {/* Footer */}
            <div className="px-4 pb-4">
              {activities.length > 0 && (
                <div className="flex flex-wrap gap-2 flex-col">
                  <h2 className="text-md  ml-1"> Selected: </h2>
                  <div className="flex flex-wrap gap-2 flex-row mb-5">
                      {activities.map((a) => (
                        <Badge key={a} variant="secondary" className="flex items-center gap-1">
                          <span>{a}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0"
                            onClick={() => removeActivity(a)}
                            title="Remove"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                  </div>
                
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <div className="ml-auto text-sm text-muted-foreground">
          Selected: <span className="font-medium">{activities.length}</span>
        </div>
      </div>

      {/* Editable table (your original UX) */}
      <SectionTable
        title="Activities"
        headers={["Activity", ""]}
        rows={(activities ?? []).map((a) => [a])}
        renderRow={(rowIdx) => (
          <>
            <TableCell>
              <Input
                value={activities[rowIdx] ?? ""}
                placeholder="e.g. Pipe cutting and beveling"
                onChange={(e) =>
                  setRams((v: Rams) => ({
                    ...v,
                    activities: updateArray(v.activities ?? [], rowIdx, e.target.value),
                  }))
                }
              />
            </TableCell>

            <TableCell className="w-28">
              <Button
                variant="ghost"
                onClick={() =>
                  setRams((v: Rams) => ({
                    ...v,
                    activities: (v.activities ?? []).filter((_, i) => i !== rowIdx),
                  }))
                }
              >
                Remove
              </Button>
            </TableCell>
          </>
        )}
        onAdd={() => setRams((v: Rams) => ({ ...v, activities: [...(v.activities ?? []), ""] }))}
      />
    </section>
  );
}
