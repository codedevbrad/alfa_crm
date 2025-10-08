/* ---------- Types ---------- */

export interface Rams {
  project: {
    title: string;
    location: string;
    client: string;
    prepared_by: string;
    date: string;
    review_date?: string;
    author?: string;
    scope?: string;               // <-- NEW
  };
  activities: string[];
  responsibilities: { role: string; description: string }[];
  materials_equipment: {
    pipes?: string[];
    fittings?: string[];
    tools?: string[];
    ppe?: string[];
  };
  health_safety?: { hazards?: string[]; controls?: string[] };
  procedure?: { preparation?: string[]; fitting?: string[]; inspection?: string[] };
  environment?: { waste_management?: string; spill_prevention?: string; noise_control?: string };
  emergency?: { fire?: string; accident?: string; spill?: string };
  ppe?: { item: string; standard?: string; type?: string }[];
  risk_assessment?: {
    activity: string;
    hazard: string;

    // pre-control
    likelihood: number; // L
    severity: number; // S
    risk: number; // R = L × S (auto)
    who: string[]; // exposed before controls
    controls: string; // preventive & control measures

    // post-control (residual)
    residual_likelihood?: number; // L′
    residual_severity?: number; // S′
    residual_risk?: number; // R′ = L′ × S′ (auto)
    residual_who?: string[]; // who after controls
    monitoring?: string; // monitoring arrangements
  }[];
}

/* ---------- Seed Data ---------- */

export const initial: Rams = {
  project: {
    title: "Beads Construction Project at Northfield and Southfield",
    location: "P&G Thurrock Plant, Thurrock, UK",
    client: "P&G",
    prepared_by: "ALFA Industrial Services Ltd",
    date: "2024-09-11",
    review_date: "2024-10-11",
    author: "T. Humphries",
    scope:
      "Installation and tie-in of process pipework, associated supports, testing and commissioning within live facility. Includes hot works, isolation/lockout coordination, and housekeeping.", // <-- NEW
  },
  activities: ["HOT WORK – TIG WELDING", "USE OF POWER TOOLS", "USE OF HAND TOOLS"],
  responsibilities: [
    { role: "Project Manager", description: "Oversee project and ensure safety/standards" },
    { role: "Site Supervisor", description: "Ensure day-to-day safe operations" },
    { role: "Pipefitters & Welders", description: "Carry out pipefitting/welding" },
    { role: "Health & Safety Officer", description: "Maintain risk assessments and protocols" },
  ],
  materials_equipment: {
    pipes: ["stainless steel", "mild steel"],
    fittings: ["flanges", "elbows", "tees", "reducers"],
    tools: ["TIG welder", "pipe cutters", "threading machine", "clamps"],
    ppe: ["hard hats (EN397)", "safety boots (S3)", "hi-vis (EN20471)", "FFP3", "gloves"],
  },
  health_safety: {
    hazards: ["fire/explosion", "asphyxiation", "falls from height", "electrocution"],
    controls: ["hot work permits", "MEWP rescue plan", "pre-use inspections", "training"],
  },
  procedure: {
    preparation: ["site induction", "review drawings", "material storage"],
    fitting: ["cut & bevel", "align with clamps", "weld"],
    inspection: ["third-party testing", "sign-off"],
  },
  environment: {
    waste_management: "Dispose per site policy",
    spill_prevention: "Spill trays for oil/fuel",
    noise_control: "Hearing protection >85dB",
  },
  emergency: {
    fire: "Evacuate to muster point",
    accident: "Report to supervisor",
    spill: "Use on-site spill kits",
  },
  ppe: [
    { item: "Respirator", standard: "FFP3" },
    { item: "Safety Harness", standard: "Fall Restraint" },
    { item: "Welding Helmet", standard: "Shade 9-13" },
    { item: "Gloves", type: "Nitrile" },
    { item: "Boots", standard: "S3" },
    { item: "Hard Hat", standard: "EN397" },
    { item: "Hi-Vis Vest", standard: "EN20471" },
  ],
  risk_assessment: [
    {
      activity: "Draining water from dye line",
      hazard: "Water contact with machinery",
      likelihood: 5,
      severity: 3,
      risk: 15,
      who: ["A", "B", "C"],
      controls: "Drain to pre-agreed location; use hose",
      residual_likelihood: 1,
      residual_severity: 3,
      residual_risk: 3,
      residual_who: ["A", "B", "C"],
      monitoring: "Client to monitor during drain down",
    },
    {
      activity: "Slips, trips, falls",
      hazard: "Trailing cables / poorly stored materials",
      likelihood: 3,
      severity: 3,
      risk: 9,
      who: ["A", "B", "C"],
      controls: "Tidy cables; store spools safely",
      residual_likelihood: 1,
      residual_severity: 3,
      residual_risk: 3,
      residual_who: ["A", "B", "C"],
      monitoring: "Monitor housekeeping during site safety inspections",
    },
  ],
};