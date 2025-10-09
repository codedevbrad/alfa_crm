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
    scope?: string;
  };
  activities: string[];
  responsibilities: { role: string; description: string }[];
  materials_equipment: {
    pipes?: string[];
    fittings?: string[];
    tools?: string[];
    ppe?: string[];
  };

  /** Simple H&S bullet points (kept) */
  health_safety?: string[];

  /** Procedure is now an ordered list of titled steps with bullets */
  procedure?: { step: string; details: string[] }[];

  /** Structured PPE (kept) */
  ppe?: { item: string; standard?: string; type?: string }[];

  /** Full risk rows (kept) */
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

  /** NEW: screenshot-style “hazards table” */
  hazard_register?: {
    hazard: string;                 // “What are the hazards?”
    harm: string;                   // “Who might be harmed and how?”
    existing_controls: string;      // “What are we already doing?”
    further_action: string;         // “What further action is necessary?”
    action_by: string;              // “Action by whom?”
  }[];

  /** NEW: Emergency & Rescue arrangements */
  emergency_plan?: {
    site_contacts?: { name: string; role?: string; phone?: string }[];
    hospital?: { name?: string; address?: string; phone?: string };
    muster_point?: string;

    /** One or more rescue scenarios (MEWP, confined space, etc.) */
    rescue_plans?: {
      scenario: string;             // e.g. "MEWP", "Confined Space"
      method?: string;              // how rescue is done
      equipment?: string;           // tripod, winch, harness, etc.
      designated_rescuer?: string;  // team/name/role
    }[];
  };
}

/* ---------- Seed Data ---------- */

export const initial: Rams = {
  project: {
    title: "",
    location: "",
    client: "",
    prepared_by: "",
    date: "",
    review_date: "",
    author: "",
    scope: "",
  },

  activities: [""],

  responsibilities: [
    { role: "", description: "" }, 
  ],

  materials_equipment: {
    pipes: [""],
    fittings: [""],
    tools: [""],
    ppe: [""],
  },

  health_safety: [
    "",
  ],

  procedure: [
    {
      step: "",
      details: [
        "",
        "",
      ],
    },
    {
      step: "",
      details: ["", "", ""],
    },
  ],

  ppe: [
    { item: "", standard: "" },
  ],

  risk_assessment: [
    {
      activity: "",
      hazard: "",
      likelihood: 0,
      severity: 0,
      risk: 0,
      who: [],
      controls: "",
      residual_likelihood: 1,
      residual_severity: 3,
      residual_risk: 3,
      residual_who: [""],
      monitoring: "",
    },
  ],

  /* NEW: hazards table, like your screenshot */
  hazard_register: [],

  /* NEW: Emergency & Rescue plan */
  emergency_plan: {
    site_contacts: [
      { name: "", role: "", phone: "" },
    ],
    hospital: {
      name: "",
      address: "",
      phone: "",
    },
    muster_point: "",
    rescue_plans: [
      {
        scenario: "",
        method: "",
        equipment: "",
        designated_rescuer: "",
      },
    ]
  },
};
