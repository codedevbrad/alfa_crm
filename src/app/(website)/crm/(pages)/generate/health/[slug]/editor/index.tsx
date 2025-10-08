/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Rams, initial } from "../rams";

import RamsPdf from "../pdf/v1";
import RamsPdfClassic from "../pdf/v2";

/* PDF Viewer (no SSR) */
const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((m) => m.PDFViewer),
  { ssr: false }
);

/* ---------- shadcn/ui ---------- */
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";

/* ---------- Small reusable UI ---------- */

function LabeledInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="text-sm font-medium">{label}</div>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function SectionTable({
  title,
  headers,
  rows,
  renderRow,
  onAdd,
}: {
  title: string;
  headers: string[];
  rows: any[][];
  renderRow: (rowIdx: number) => React.ReactNode;
  onAdd: () => void;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">{title}</h2>
        <Button onClick={onAdd}>Add row</Button>
      </div>
      <Table className="border rounded-md">
        <TableHeader>
          <TableRow>
            {headers.map((h, i) => (
              <TableHead key={i}>{h}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((_, i) => (
            <TableRow key={i}>{renderRow(i)}</TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}

function ArrayTable({
  title,
  values,
  onChange,
}: {
  title: string;
  values: string[];
  onChange: (vals: string[]) => void;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{title}</h3>
        <Button onClick={() => onChange([...(values ?? []), ""])}>Add</Button>
      </div>
      <Table className="border rounded-md">
        <TableHeader>
          <TableRow>
            <TableHead>Value</TableHead>
            <TableHead className="w-28"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(values ?? []).map((val, i) => (
            <TableRow key={i}>
              <TableCell>
                <Input
                  value={val}
                  onChange={(e) => {
                    const next = [...values];
                    next[i] = e.target.value;
                    onChange(next);
                  }}
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  onClick={() => onChange(values.filter((_, idx) => idx !== i))}
                >
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}



/* ---------- Wizard Steps ---------- */

const stepDefs = [
  { key: "project", label: "Project" },
  { key: "activities", label: "Activities" },
  { key: "responsibilities", label: "Responsibilities" },
  { key: "materials", label: "Materials & Equipment" },
  { key: "ppe", label: "Required PPE" },
  { key: "hs", label: "Health & Safety" },
  { key: "procedure", label: "Procedure" },
  { key: "risk", label: "Risk Assessment" },
  { key: "preview", label: "Preview & Download" },
] as const;
 


export default function RamsEditable({  generatedRams }: { generatedRams?: Rams }) {
  const [rams, setRams] = useState<Rams>(generatedRams);
  const [stepIdx, setStepIdx] = useState(0);
  const fileName = useMemo(() => `${slugify(rams.project.title)}__${rams.project.date}.pdf`, [rams.project.title]);

  const progressValue = ((stepIdx + 1) / stepDefs.length) * 100;

  const goNext = () => setStepIdx((i) => Math.min(i + 1, stepDefs.length - 1));
  const goPrev = () => setStepIdx((i) => Math.max(i - 1, 0));
  const gotoStep = (i: number) => setStepIdx(i);

  return (
    <main className="w-full">


      {/* Header */}
      <header className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">RAMS Builder</h1>
            <p className="text-sm text-muted-foreground">
              Step {stepIdx + 1} of {stepDefs.length}
            </p>
          </div>

          {stepDefs[stepIdx].key === "preview" ? (
            <Button variant="outline" onClick={() => handleDownload(rams, fileName)}>
              Download PDF
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => gotoStep(stepDefs.length - 1)}>
                Skip to Preview
              </Button>
              <Button variant="secondary" onClick={goNext}>
                Next
              </Button>
            </div>
          )}
        </div>

        {/* Stepper */}
        <div className="space-y-2 mb-4">
          <Progress value={progressValue} className="h-2" />
          <div className="flex flex-wrap gap-2">
            {stepDefs.map((s, i) => {
              const active = i === stepIdx;
              const complete = i < stepIdx;
              return (
                <button
                  key={s.key}
                  onClick={() => gotoStep(i)}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 border text-sm transition ${
                    active
                      ? "border-primary text-primary bg-primary/5"
                      : complete
                        ? "border-green-300 text-green-700 bg-green-50"
                        : "border-gray-200 text-gray-600 bg-white hover:bg-gray-50"
                  }`}
                >
                  <span
                    className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : complete
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="whitespace-nowrap">{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Step body */}
      <section className="space-y-8">
        {stepDefs[stepIdx].key === "project" && <StepProject rams={rams} setRams={setRams} />}

        {stepDefs[stepIdx].key === "activities" && <StepActivities rams={rams} setRams={setRams} />}

        {stepDefs[stepIdx].key === "responsibilities" && (
          <StepResponsibilities rams={rams} setRams={setRams} />
        )}

        {stepDefs[stepIdx].key === "materials" && <StepMaterials rams={rams} setRams={setRams} />}

        {stepDefs[stepIdx].key === "ppe" && <StepPpe rams={rams} setRams={setRams} />}

        {stepDefs[stepIdx].key === "hs" && <StepHS rams={rams} setRams={setRams} />}

        {stepDefs[stepIdx].key === "procedure" && <StepProcedure rams={rams} setRams={setRams} />}

        {stepDefs[stepIdx].key === "risk" && <StepRisk rams={rams} setRams={setRams} />}

        {stepDefs[stepIdx].key === "preview" && <StepPreview rams={rams} fileName={fileName} />}

        {/* Nav */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={goPrev} disabled={stepIdx === 0}>
            Back
          </Button>
          {stepDefs[stepIdx].key === "preview" ? (
            <Button onClick={() => handleDownload(rams, fileName)}>Download PDF</Button>
          ) : (
            <Button onClick={goNext}>Next</Button>
          )}
        </div>
      </section>
    </main>
  );
}

/* ---------- Step Components ---------- */

function StepProject({ rams, setRams }: { rams: Rams; setRams: any }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-medium">Project</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <LabeledInput label="Title" value={rams.project.title} onChange={(v) => setProj("title", v, setRams)} />
        <LabeledInput label="Client" value={rams.project.client} onChange={(v) => setProj("client", v, setRams)} />
        <LabeledInput label="Location" value={rams.project.location} onChange={(v) => setProj("location", v, setRams)} />
        <LabeledInput label="Prepared By" value={rams.project.prepared_by} onChange={(v) => setProj("prepared_by", v, setRams)} />
        <LabeledInput label="Date" value={rams.project.date} onChange={(v) => setProj("date", v, setRams)} />
        <LabeledInput label="Review Date" value={rams.project.review_date ?? ""} onChange={(v) => setProj("review_date", v, setRams)} />
        <LabeledInput label="Author" value={rams.project.author ?? ""} onChange={(v) => setProj("author", v, setRams)} />
      </div>

      {/* NEW: Scope of works (full width) */}
      <div className="space-y-1.5">
        <div className="text-sm font-medium">Scope of works</div>
        <Textarea
          rows={4}
          value={rams.project.scope ?? ""}
          onChange={(e) => setProj("scope", e.target.value, setRams)}
          placeholder="High-level summary of what is included in this RAMS (e.g., installation, tie-ins, testing, commissioning, exclusions)…"
        />
        <p className="text-xs text-muted-foreground">Appears as part of the project overview.</p>
      </div>
    </section>
  );
}

function StepActivities({ rams, setRams }: { rams: Rams; setRams: any }) {
  return (
    <SectionTable
      title="Activities"
      headers={["Activity", ""]}
      rows={(rams.activities ?? []).map((a) => [a])}
      renderRow={(rowIdx) => (
        <>
          <TableCell>
            <Input
              value={rams.activities[rowIdx] ?? ""}
              onChange={(e) =>
                setRams((v: Rams) => ({ ...v, activities: updateArray(v.activities, rowIdx, e.target.value) }))
              }
            />
          </TableCell>
          <TableCell className="w-28">
            <Button
              variant="ghost"
              onClick={() =>
                setRams((v: Rams) => ({ ...v, activities: (v.activities ?? []).filter((_, i) => i !== rowIdx) }))
              }
            >
              Remove
            </Button>
          </TableCell>
        </>
      )}
      onAdd={() => setRams((v: Rams) => ({ ...v, activities: [...(v.activities ?? []), ""] }))}
    />
  );
}

function StepResponsibilities({ rams, setRams }: { rams: Rams; setRams: any }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">Responsibilities</h2>
        <Button
          onClick={() =>
            setRams((v: Rams) => ({
              ...v,
              responsibilities: [...(v.responsibilities ?? []), { role: "", description: "" }],
            }))
          }
        >
          Add row
        </Button>
      </div>
      <Table className="border rounded-md">
        <TableHeader>
          <TableRow>
            <TableHead className="w-56">Role</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-28"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(rams.responsibilities ?? []).map((row, i) => (
            <TableRow key={i}>
              <TableCell>
                <Input
                  value={row.role}
                  onChange={(e) => {
                    const next = [...(rams.responsibilities ?? [])];
                    next[i] = { ...next[i], role: e.target.value };
                    setRams((v: Rams) => ({ ...v, responsibilities: next }));
                  }}
                />
              </TableCell>
              <TableCell>
                <Input
                  value={row.description}
                  onChange={(e) => {
                    const next = [...(rams.responsibilities ?? [])];
                    next[i] = { ...next[i], description: e.target.value };
                    setRams((v: Rams) => ({ ...v, responsibilities: next }));
                  }}
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  onClick={() =>
                    setRams((v: Rams) => ({
                      ...v,
                      responsibilities: (v.responsibilities ?? []).filter((_, idx) => idx !== i),
                    }))
                  }
                >
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}

function StepMaterials({ rams, setRams }: { rams: Rams; setRams: any }) {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <ArrayTable
        title="Pipes"
        values={rams.materials_equipment.pipes ?? []}
        onChange={(vals) =>
          setRams((v: Rams) => ({ ...v, materials_equipment: { ...v.materials_equipment, pipes: vals } }))
        }
      />
      <ArrayTable
        title="Fittings"
        values={rams.materials_equipment.fittings ?? []}
        onChange={(vals) =>
          setRams((v: Rams) => ({ ...v, materials_equipment: { ...v.materials_equipment, fittings: vals } }))
        }
      />
      <ArrayTable
        title="Tools"
        values={rams.materials_equipment.tools ?? []}
        onChange={(vals) =>
          setRams((v: Rams) => ({ ...v, materials_equipment: { ...v.materials_equipment, tools: vals } }))
        }
      />
      <ArrayTable
        title="PPE (list)"
        values={rams.materials_equipment.ppe ?? []}
        onChange={(vals) =>
          setRams((v: Rams) => ({ ...v, materials_equipment: { ...v.materials_equipment, ppe: vals } }))
        }
      />
    </div>
  );
}

function StepPpe({ rams, setRams }: { rams: Rams; setRams: any }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">Required PPE</h2>
        <Button
          onClick={() =>
            setRams((v: Rams) => ({
              ...v,
              ppe: [...(v.ppe ?? []), { item: "", standard: "", type: "" }],
            }))
          }
        >
          Add item
        </Button>
      </div>
      <Table className="border rounded-md">
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3">Item</TableHead>
            <TableHead className="w-1/3">Standard</TableHead>
            <TableHead className="w-1/3">Type</TableHead>
            <TableHead className="w-24"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(rams.ppe ?? []).map((p, i) => (
            <TableRow key={i}>
              <TableCell>
                <Input
                  value={p.item}
                  onChange={(e) => {
                    const next = [...(rams.ppe ?? [])];
                    next[i] = { ...next[i], item: e.target.value };
                    setRams((v: Rams) => ({ ...v, ppe: next }));
                  }}
                />
              </TableCell>
              <TableCell>
                <Input
                  value={p.standard ?? ""}
                  onChange={(e) => {
                    const next = [...(rams.ppe ?? [])];
                    next[i] = { ...next[i], standard: e.target.value };
                    setRams((v: Rams) => ({ ...v, ppe: next }));
                  }}
                />
              </TableCell>
              <TableCell>
                <Input
                  value={p.type ?? ""}
                  onChange={(e) => {
                    const next = [...(rams.ppe ?? [])];
                    next[i] = { ...next[i], type: e.target.value };
                    setRams((v: Rams) => ({ ...v, ppe: next }));
                  }}
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  onClick={() =>
                    setRams((v: Rams) => ({ ...v, ppe: (v.ppe ?? []).filter((_, idx) => idx !== i) }))
                  }
                >
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}

function StepHS({ rams, setRams }: { rams: Rams; setRams: any }) {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <ArrayTable
        title="Health & Safety — Hazards"
        values={rams.health_safety?.hazards ?? []}
        onChange={(vals) =>
          setRams((v: Rams) => ({ ...v, health_safety: { ...(v.health_safety ?? {}), hazards: vals } }))
        }
      />
      <ArrayTable
        title="Health & Safety — Controls"
        values={rams.health_safety?.controls ?? []}
        onChange={(vals) =>
          setRams((v: Rams) => ({ ...v, health_safety: { ...(v.health_safety ?? {}), controls: vals } }))
        }
      />
    </div>
  );
}

function StepProcedure({ rams, setRams }: { rams: Rams; setRams: any }) {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      <ArrayTable
        title="Procedure — Preparation"
        values={rams.procedure?.preparation ?? []}
        onChange={(vals) =>
          setRams((v: Rams) => ({ ...v, procedure: { ...(v.procedure ?? {}), preparation: vals } }))
        }
      />
      <ArrayTable
        title="Procedure — Fitting"
        values={rams.procedure?.fitting ?? []}
        onChange={(vals) =>
          setRams((v: Rams) => ({ ...v, procedure: { ...(v.procedure ?? {}), fitting: vals } }))
        }
      />
      <ArrayTable
        title="Procedure — Inspection"
        values={rams.procedure?.inspection ?? []}
        onChange={(vals) =>
          setRams((v: Rams) => ({ ...v, procedure: { ...(v.procedure ?? {}), inspection: vals } }))
        }
      />
    </div>
  );
}

function StepRisk({ rams, setRams }: { rams: Rams; setRams: any }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">Risk Assessment</h2>
        <Button
          onClick={() =>
            setRams((v: Rams) => ({
              ...v,
              risk_assessment: [
                ...(v.risk_assessment ?? []),
                {
                  activity: "",
                  hazard: "",
                  likelihood: 1,
                  severity: 1,
                  risk: 1,
                  who: [],
                  controls: "",
                  residual_likelihood: 1,
                  residual_severity: 1,
                  residual_risk: 1,
                  residual_who: [],
                  monitoring: "",
                },
              ],
            }))
          }
        >
          Add row
        </Button>
      </div>

      <div className="space-y-4">
        {(rams.risk_assessment ?? []).map((row, i) => (
          <div key={i} className="rounded-md border p-4 space-y-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
              <div className="grid md:grid-cols-2 gap-3 w-full">
                <div className="min-w-0">
                  <div className="text-sm font-medium">Activity</div>
                  <Input
                    className="min-w-0"
                    value={row.activity}
                    onChange={(e) => mutRA(i, { activity: e.target.value }, setRams)}
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium">Hazard</div>
                  <Input
                    className="min-w-0"
                    value={row.hazard}
                    onChange={(e) => mutRA(i, { hazard: e.target.value }, setRams)}
                  />
                </div>
              </div>

              {/* quick badges & actions */}
              <div className="flex items-center gap-2 md:self-start">
                <Badge className={`px-2 ${bandColor(row.risk)} whitespace-nowrap`}>R {row.risk}</Badge>
                <Badge className={`px-2 ${bandColor(row.residual_risk ?? undefined)} whitespace-nowrap`}>
                  R′ {row.residual_risk ?? "-"}
                </Badge>
                <Button
                  variant="secondary"
                  onClick={() =>
                    setRams((v: Rams) => {
                      const rows = [...(v.risk_assessment ?? [])];
                      const copy = { ...rows[i] };
                      rows.splice(i + 1, 0, copy);
                      return { ...v, risk_assessment: rows };
                    })
                  }
                >
                  Duplicate
                </Button>
                <Button
                  variant="ghost"
                  onClick={() =>
                    setRams((v: Rams) => ({
                      ...v,
                      risk_assessment: (v.risk_assessment ?? []).filter((_, idx) => idx !== i),
                    }))
                  }
                >
                  Remove
                </Button>
              </div>
            </div>

            {/* Pre-control */}
            <div className="grid md:grid-cols-4 gap-3 items-end">
              <div>
                <div className="text-sm font-medium">L</div>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  value={row.likelihood}
                  onChange={(e) => mutRA(i, { likelihood: num(e.target.value) }, setRams)}
                />
              </div>
              <div>
                <div className="text-sm font-medium">S</div>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  value={row.severity}
                  onChange={(e) => mutRA(i, { severity: num(e.target.value) }, setRams)}
                />
              </div>
              <div>
                <div className="text-sm font-medium">R</div>
                <Badge className={`w-full justify-center ${bandColor(row.risk)}`}>{row.risk}</Badge>
              </div>
              <div className="md:col-span-1">
                <div className="text-sm font-medium">Who (comma)</div>
                <Input
                  className="min-w-0"
                  value={row.who.join(", ")}
                  onChange={(e) => mutRA(i, { who: splitComma(e.target.value) }, setRams)}
                />
              </div>

              <div className="md:col-span-4">
                <div className="text-sm font-medium">Preventive & control measures</div>
                <Textarea rows={2} value={row.controls} onChange={(e) => mutRA(i, { controls: e.target.value }, setRams)} />
              </div>
            </div>

            <Separator />

            {/* Post-control */}
            <Accordion type="single" collapsible>
              <AccordionItem value="post">
                <AccordionTrigger className="text-sm">Post-control (residual)</AccordionTrigger>
                <AccordionContent className="pt-3">
                  <div className="grid md:grid-cols-5 gap-3 items-end">
                    <div>
                      <div className="text-sm font-medium">L′</div>
                      <Input
                        type="number"
                        min={1}
                        max={5}
                        value={row.residual_likelihood ?? ""}
                        onChange={(e) => mutRA(i, { residual_likelihood: emptyToUndef(e.target.value) }, setRams)}
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium">S′</div>
                      <Input
                        type="number"
                        min={1}
                        max={5}
                        value={row.residual_severity ?? ""}
                        onChange={(e) => mutRA(i, { residual_severity: emptyToUndef(e.target.value) }, setRams)}
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium">R′</div>
                      <Badge className={`w-full justify-center ${bandColor(row.residual_risk ?? undefined)}`}>
                        {row.residual_risk ?? "-"}
                      </Badge>
                    </div>
                    <div className="md:col-span-2">
                      <div className="text-sm font-medium">Who′ (comma)</div>
                      <Input
                        className="min-w-0"
                        value={(row.residual_who ?? []).join(", ")}
                        onChange={(e) => mutRA(i, { residual_who: splitComma(e.target.value) }, setRams)}
                      />
                    </div>

                    <div className="md:col-span-5">
                      <div className="text-sm font-medium">Monitoring arrangements</div>
                      <Textarea rows={2} value={row.monitoring ?? ""} onChange={(e) => mutRA(i, { monitoring: e.target.value }, setRams)} />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Tips: R = L × S. Residual R′ = L′ × S′. Use comma-separated lists for “Who” fields.
      </p>
    </section>
  );
}

function StepPreview({ rams, fileName }: { rams: Rams; fileName: string }) {
  const [viewMode, setViewMode] = useState<'v1' | 'v2'>('v2');
  const isClassic = viewMode === 'v2';

  // Create the selected <Document> once per mode/rams change
  const doc = useMemo(() => {
    return isClassic ? <RamsPdfClassic rams={rams} /> : <RamsPdf rams={rams} />;
  }, [isClassic, rams]);

  return (
    <section className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-xl font-medium">Preview & Download</h2>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Style:</span>
            <div className="inline-flex rounded-md border bg-white p-1">
              <button
                type="button"
                onClick={() => setViewMode('v1')}
                className={`px-3 py-1.5 text-sm rounded transition ${
                  viewMode === 'v1' ? 'bg-primary text-white' : 'hover:bg-gray-50'
                }`}
              >
                Modern
              </button>
              <button
                type="button"
                onClick={() => setViewMode('v2')}
                className={`px-3 py-1.5 text-sm rounded transition ${
                  viewMode === 'v2' ? 'bg-primary text-white' : 'hover:bg-gray-50'
                }`}
              >
                Classic
              </button>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() =>
              handleDownload(rams, fileNameWithStyle(fileName, viewMode), viewMode)
            }
          >
            Download {isClassic ? '(Classic)' : '(Modern)'}
          </Button>
        </div>
      </div>

      <div className="min-h-[70vh] border rounded-md overflow-hidden">
        {/* KEY IS IMPORTANT: force remount when switching */}
        <PDFViewer key={viewMode} width="100%" height="800px">
          {doc}
        </PDFViewer>
      </div>
    </section>
  );
}

// helpers (same as before)
type PdfViewMode = 'v1' | 'v2';

function fileNameWithStyle(base: string, mode: PdfViewMode) {
  const idx = base.toLowerCase().lastIndexOf('.pdf');
  if (idx > -1) return `${base.slice(0, idx)}__${mode}${base.slice(idx)}`;
  return `${base}__${mode}.pdf`;
}

// async function handleDownload(rams: Rams, fileName: string, mode: PdfViewMode) {
//   const { pdf } = await import('@react-pdf/renderer');
//   const element = mode === 'v2' ? <RamsPdfClassic rams={rams} /> : <RamsPdf rams={rams} />;
//   const blob = await pdf(element).toBlob();
//   const url = URL.createObjectURL(blob);
//   const a = document.createElement('a');
//   a.href = url;
//   a.download = fileName;
//   document.body.appendChild(a);
//   a.click();
//   a.remove();
//   URL.revokeObjectURL(url);
// }



/* ---------- Helpers ---------- */

function bandColor(n?: number) {
  if (typeof n !== "number") return "bg-slate-100 text-slate-700";
  if (n <= 5) return "bg-green-100 text-green-800";
  if (n <= 12) return "bg-yellow-100 text-yellow-800";
  return "bg-red-100 text-red-800";
}


async function handleDownload(rams: Rams, fileName: string) {
  const { pdf } = await import("@react-pdf/renderer"); // only runs in browser
  const blob = await pdf(<RamsPdf rams={rams} />).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}


function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}


function num(v: string) {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : 0;
}


function splitComma(v: string) {
  return v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}


function emptyToUndef(v: string) {
  return v.trim() === "" ? undefined : num(v);
}


// Mutate one risk-assessment row (auto-calc R = L × S, R′ = L′ × S′)
function mutRA(
  index: number,
  patch: Partial<Rams["risk_assessment"][number]>,
  setRams: React.Dispatch<React.SetStateAction<Rams>>
) {
  setRams((prev) => {
    const rows = [...(prev.risk_assessment ?? [])];
    const merged = { ...rows[index], ...patch };

    // pre-control calc
    const L = ("likelihood" in patch ? patch.likelihood : merged.likelihood) as number | undefined;
    const S = ("severity" in patch ? patch.severity : merged.severity) as number | undefined;
    if ("likelihood" in patch || "severity" in patch) {
      if (typeof L === "number" && typeof S === "number") merged.risk = L * S;
    }

    // post-control calc (R′)
    const Lp = ("residual_likelihood" in patch ? patch.residual_likelihood : merged.residual_likelihood) as number | undefined;
    const Sp = ("residual_severity" in patch ? patch.residual_severity : merged.residual_severity) as number | undefined;
    if ("residual_likelihood" in patch || "residual_severity" in patch) {
      merged.residual_risk = typeof Lp === "number" && typeof Sp === "number" ? Lp * Sp : undefined;
    }

    rows[index] = merged;
    return { ...prev, risk_assessment: rows };
  });
}

function setProj<K extends keyof Rams["project"]>(
  key: K,
  val: Rams["project"][K],
  setRams: React.Dispatch<React.SetStateAction<Rams>>
) {
  setRams((v) => ({ ...v, project: { ...v.project, [key]: val } }));
}

function updateArray(arr: string[] | undefined, i: number, val: string) {
  const next = [...(arr ?? [])];
  next[i] = val;
  return next;
}
