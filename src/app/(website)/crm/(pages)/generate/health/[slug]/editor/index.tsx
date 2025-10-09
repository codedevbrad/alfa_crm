/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Rams } from "../rams";

import RamsPdf from "../pdf/v1";
import RamsPdfClassic from "../pdf/v2";

const PDFViewer = dynamic(() => import("../pdf/viewer"), { ssr: false });

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



const stepDefs = [
  { key: "project", label: "Project" },
  { key: "activities", label: "Activities" },
  { key: "responsibilities", label: "Responsibilities" },
  { key: "materials", label: "Materials & Equipment" },
  { key: "ppe", label: "Required PPE" },
  { key: "hs", label: "Health & Safety" },
  { key: "procedure", label: "Procedure" },

  // NEW
  { key: "hazards", label: "Hazards & Controls" },
  { key: "emergency", label: "Emergency & Rescue" },

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

  useEffect(() => {
    setRams(generatedRams);
  }, [generatedRams]);
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

        {stepDefs[stepIdx].key === "hazards" && <StepHazards rams={rams} setRams={setRams} />}


        {stepDefs[stepIdx].key === "emergency" && <StepEmergency rams={rams} setRams={setRams} />}


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
    <div className="w-full gap-8">
      <ArrayTable
        title="Health & Safety"
        values={rams.health_safety ?? []}
        onChange={(vals) =>
          setRams((v: Rams) => ({ ...v, health_safety: vals }))
        }
      />
    </div>
  );
}

function StepProcedure({ rams, setRams }: { rams: Rams; setRams: any }) {
  const steps = rams.procedure ?? [];

  const addStep = () =>
    setRams((v: Rams) => ({
      ...v,
      procedure: [...(v.procedure ?? []), { step: "", details: [""] }],
    }));

  const updateStepTitle = (i: number, val: string) =>
    setRams((v: Rams) => {
      const next = [...(v.procedure ?? [])];
      next[i] = { ...next[i], step: val };
      return { ...v, procedure: next };
    });

  const updateStepDetails = (i: number, details: string[]) =>
    setRams((v: Rams) => {
      const next = [...(v.procedure ?? [])];
      next[i] = { ...next[i], details };
      return { ...v, procedure: next };
    });

  const removeStep = (i: number) =>
    setRams((v: Rams) => ({
      ...v,
      procedure: (v.procedure ?? []).filter((_, idx) => idx !== i),
    }));

  const duplicateStep = (i: number) =>
    setRams((v: Rams) => {
      const next = [...(v.procedure ?? [])];
      const copy = { ...next[i], details: [...(next[i].details ?? [])] };
      next.splice(i + 1, 0, copy);
      return { ...v, procedure: next };
    });

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">Procedure</h2>
        <Button onClick={addStep}>Add step</Button>
      </div>

      {steps.length === 0 ? (
        <p className="text-sm text-muted-foreground">No steps yet. Click “Add step”.</p>
      ) : null}

      <div className="space-y-4">
        {steps.map((s, i) => (
          <div key={i} className="rounded-md border p-4 space-y-4">
            {/* Step header */}
            <div className="flex items-center justify-between gap-3">
              <div className="w-full">
                <div className="text-sm font-medium">Step title</div>
                <Input
                  value={s.step}
                  placeholder={`e.g., ${i === 0 ? "Preparation" : i === 1 ? "Fitting" : "Inspection / Testing"}`}
                  onChange={(e) => updateStepTitle(i, e.target.value)}
                />
              </div>
              <div className="shrink-0 flex gap-2">
                <Button variant="secondary" onClick={() => duplicateStep(i)}>
                  Duplicate
                </Button>
                <Button variant="ghost" onClick={() => removeStep(i)}>
                  Remove
                </Button>
              </div>
            </div>

            {/* Step details (bullet list) */}
            <ArrayTable
              title="Details"
              values={s.details ?? []}
              onChange={(vals) => updateStepDetails(i, vals)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function StepHazards({ rams, setRams }: { rams: Rams; setRams: any }) {
  const rows = rams.hazard_register ?? [];

  const add = () =>
    setRams((v: Rams) => ({
      ...v,
      hazard_register: [
        ...(v.hazard_register ?? []),
        { hazard: "", harm: "", existing_controls: "", further_action: "", action_by: "" },
      ],
    }));

  const update = (i: number, field: keyof NonNullable<Rams["hazard_register"]>[number], val: string) =>
    setRams((v: Rams) => {
      const next = [...(v.hazard_register ?? [])];
      next[i] = { ...next[i], [field]: val };
      return { ...v, hazard_register: next };
    });

  const remove = (i: number) =>
    setRams((v: Rams) => ({
      ...v,
      hazard_register: (v.hazard_register ?? []).filter((_, idx) => idx !== i),
    }));

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">Hazards & Controls</h2>
        <Button onClick={add}>Add row</Button>
      </div>

      <Table className="border rounded-md">
        <TableHeader>
          <TableRow>
            <TableHead>What are the hazards?</TableHead>
            <TableHead>Who might be harmed and how?</TableHead>
            <TableHead>What are we already doing?</TableHead>
            <TableHead>What further action is necessary?</TableHead>
            <TableHead className="w-40">Action by whom?</TableHead>
            <TableHead className="w-24"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(rows ?? []).map((r, i) => (
            <TableRow key={i}>
              <TableCell>
                <Textarea rows={3} value={r.hazard}
                  onChange={(e) => update(i, "hazard", e.target.value)} />
              </TableCell>
              <TableCell>
                <Textarea rows={3} value={r.harm}
                  onChange={(e) => update(i, "harm", e.target.value)} />
              </TableCell>
              <TableCell>
                <Textarea rows={3} value={r.existing_controls}
                  onChange={(e) => update(i, "existing_controls", e.target.value)} />
              </TableCell>
              <TableCell>
                <Textarea rows={3} value={r.further_action}
                  onChange={(e) => update(i, "further_action", e.target.value)} />
              </TableCell>
              <TableCell>
                <Input value={r.action_by}
                  onChange={(e) => update(i, "action_by", e.target.value)} />
              </TableCell>
              <TableCell>
                <Button variant="ghost" onClick={() => remove(i)}>Remove</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <p className="text-xs text-muted-foreground">
        Tip: keep “Action by whom?” specific (e.g., “ALFA Supervisor”, “Client E&I”).
      </p>
    </section>
  );
}

function StepEmergency({ rams, setRams }: { rams: Rams; setRams: any }) {
  const plan = rams.emergency_plan ?? {};

  const setPlan = (patch: Partial<NonNullable<Rams["emergency_plan"]>>) =>
    setRams((v: Rams) => ({ ...v, emergency_plan: { ...(v.emergency_plan ?? {}), ...patch } }));

  /* Contacts */
  const contacts = plan.site_contacts ?? [];
  const addContact = () => setPlan({ site_contacts: [...contacts, { name: "", role: "", phone: "" }] });
  const updateContact = (i: number, field: "name" | "role" | "phone", val: string) => {
    const next = [...contacts];
    next[i] = { ...next[i], [field]: val };
    setPlan({ site_contacts: next });
  };
  const removeContact = (i: number) =>
    setPlan({ site_contacts: contacts.filter((_, idx) => idx !== i) });

  /* Rescue plans */
  const rescues = plan.rescue_plans ?? [];
  const addRescue = () => setPlan({ rescue_plans: [...rescues, { scenario: "", method: "", equipment: "", designated_rescuer: "" }] });
  const updateRescue = (i: number, field: "scenario" | "method" | "equipment" | "designated_rescuer", val: string) => {
    const next = [...rescues];
    next[i] = { ...next[i], [field]: val };
    setPlan({ rescue_plans: next });
  };
  const removeRescue = (i: number) =>
    setPlan({ rescue_plans: rescues.filter((_, idx) => idx !== i) });

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-medium">Emergency & Rescue</h2>

      {/* Site contacts */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Site Emergency Contacts</h3>
          <Button onClick={addContact}>Add contact</Button>
        </div>
        <Table className="border rounded-md">
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3">Name</TableHead>
              <TableHead className="w-1/3">Role</TableHead>
              <TableHead className="w-1/3">Phone</TableHead>
              <TableHead className="w-24"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((c, i) => (
              <TableRow key={i}>
                <TableCell><Input value={c.name} onChange={(e) => updateContact(i, "name", e.target.value)} /></TableCell>
                <TableCell><Input value={c.role ?? ""} onChange={(e) => updateContact(i, "role", e.target.value)} /></TableCell>
                <TableCell><Input value={c.phone ?? ""} onChange={(e) => updateContact(i, "phone", e.target.value)} /></TableCell>
                <TableCell><Button variant="ghost" onClick={() => removeContact(i)}>Remove</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      {/* Hospital + Muster */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Nearest Hospital</h3>
          <Input placeholder="Name" value={plan.hospital?.name ?? ""} onChange={(e) => setPlan({ hospital: { ...(plan.hospital ?? {}), name: e.target.value } })} />
          <Input placeholder="Address" value={plan.hospital?.address ?? ""} onChange={(e) => setPlan({ hospital: { ...(plan.hospital ?? {}), address: e.target.value } })} />
          <Input placeholder="Phone" value={plan.hospital?.phone ?? ""} onChange={(e) => setPlan({ hospital: { ...(plan.hospital ?? {}), phone: e.target.value } })} />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Muster Point</h3>
          <Input placeholder="Description / location" value={plan.muster_point ?? ""} onChange={(e) => setPlan({ muster_point: e.target.value })} />
        </div>
      </section>

      {/* Rescue plans */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Rescue Plan(s)</h3>
          <Button onClick={addRescue}>Add rescue plan</Button>
        </div>
        <Table className="border rounded-md">
          <TableHeader>
            <TableRow>
              <TableHead className="w-40">Scenario</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Equipment</TableHead>
              <TableHead className="w-56">Designated rescuer</TableHead>
              <TableHead className="w-24"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rescues.map((r, i) => (
              <TableRow key={i}>
                <TableCell><Input value={r.scenario} onChange={(e) => updateRescue(i, "scenario", e.target.value)} /></TableCell>
                <TableCell><Textarea rows={2} value={r.method ?? ""} onChange={(e) => updateRescue(i, "method", e.target.value)} /></TableCell>
                <TableCell><Textarea rows={2} value={r.equipment ?? ""} onChange={(e) => updateRescue(i, "equipment", e.target.value)} /></TableCell>
                <TableCell><Input value={r.designated_rescuer ?? ""} onChange={(e) => updateRescue(i, "designated_rescuer", e.target.value)} /></TableCell>
                <TableCell><Button variant="ghost" onClick={() => removeRescue(i)}>Remove</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </section>
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
