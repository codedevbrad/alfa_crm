// activities.ts
// ---------------------------------------------
// Single source of truth for RAMS activities.
// Import this wherever you need selectable activities.
// ---------------------------------------------

export const RAMS_ACTIVITIES: Record<string, string[]> = {
  "General Site & Preparation": [
    "Site induction and safety briefing",
    "Review drawings and specifications",
    "Deliveries and offloading",
    "Material storage and inspection",
    "Work area setup and segregation",
    "Pre-use inspection of tools and equipment",
    "Isolation and LOTO (lock-out/tag-out)",
    "Install pipe supports and brackets",
  ],
  "Mechanical & Pipefitting": [
    "Measure and mark pipe runs",
    "Pipe cutting and beveling",
    "Pipe threading",
    "Pipe fitting and alignment",
    "Fit flanges, valves and reducers",
    "Tack and final fit-up",
    "Hydrostatic / pneumatic testing (by others)",
    "Punch-list and snag rectification",
  ],
  "Hot Work": [
    "TIG welding (stainless steel)",
    "MIG / MMA welding (mild steel)",
    "Oxy-fuel cutting",
    "Grinding and dressing welds",
    "Hot work permit & fire watch",
  ],
  "Tools & Equipment": [
    "Use of hand tools",
    "Use of power tools (grinders, drills, saws)",
    "Portable Appliance Testing (PAT) compliance",
    "Use of lifting accessories (slings, chain blocks)",
    "Use of cranes / forklifts (with banksman)",
  ],
  "Manual Handling & Ergonomics": [
    "Single-person lifts (assessed)",
    "Team lifts and coordination",
    "Use of trolleys / mechanical aids",
    "Repetitive tasks and micro-breaks",
    "Posture management and rotation",
  ],
  "Access & Work at Height": [
    "Scaffold access / tower scaffold",
    "Ladder use (for access only)",
    "Operate MEWP (scissor/cherry picker)",
    "Wear and inspect fall arrest / harness",
    "MEWP emergency rescue plan",
  ],
  "Hazardous Environments": [
    "COSHH-compliant handling of gases/consumables",
    "Work near live services (electrical/steam/process)",
    "Hot work near flammables",
    "Confined space entry (separate RAMS)",
  ],
  "Environmental & Housekeeping": [
    "Waste segregation and disposal",
    "Spill prevention and response",
    "Noise management (>85 dB: hearing protection)",
    "Dust/fume extraction and ventilation",
    "End-of-shift cleanup and demobilisation",
  ],
  "Emergency Procedures": [
    "Fire alarm/evacuation and muster",
    "First aid / incident reporting",
    "Spill response (oil/fuel/chemical)",
    "Stop work and make safe",
  ],
};

// Optional flat list if you ever want it:
export const ALL_RAMS_ACTIVITIES: string[] = Object.values(RAMS_ACTIVITIES).flat();