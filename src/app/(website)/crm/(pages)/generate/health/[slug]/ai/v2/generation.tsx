/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { generateRamsAction } from "./action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface RamsChatBotProps {
  updateRams: (data: any) => void;
}

interface Message {
  sender: "bot" | "user";
  text: string;
}

const initialRams = {
  project: {
    title: "Pipework Installation – Boiler Room Upgrade, Manchester Hospital",
    location: "Central Energy Centre, Manchester",
    client: "NHS Manchester Estates Division",
    prepared_by: "ALFA Industrial Services Ltd",
    date: "2025-10-09",
    review_date: "2025-11-09",
    author: "T. Humphries",
    scope: "Removal of existing carbon steel pipework and installation of new stainless-steel lines feeding the main boiler system. Includes cutting, welding, pressure testing, insulation reinstatement, and commissioning during a planned shutdown.",
  },

  activities: [
    "cutting and welding stainless steel pipework",
    "pressure testing with water",
    "working at height from podium steps",
    "isolating and locking out existing lines",
    "handling and positioning pipe sections",
    "applying insulation and labelling",
    "final inspection and commissioning"
  ],

  responsibilities: [
    { role: "Project Manager", description: "Overall responsibility for delivery and compliance with client and HSE requirements." },
    { role: "Site Supervisor", description: "Day-to-day management of operatives and coordination with hospital maintenance." },
    { role: "Lead Welder/Fitter", description: "Carry out fabrication, alignment and welding tasks safely and to specification." },
    { role: "Health & Safety Officer", description: "Monitor site conditions, conduct toolbox talks, ensure safe systems of work." },
    { role: "Operatives", description: "Follow RAMS, report hazards, use PPE correctly, and maintain housekeeping." }
  ],

  materials_equipment: {
    pipes: ["stainless steel SCH40 2\"–4\" pipe", "elbows and reducers"],
    fittings: ["stainless steel couplings", "flanges", "PTFE gaskets"],
    tools: ["MIG/TIG welding sets", "pipe stands", "portable bandsaw", "chain hoist", "MEWP"],
    ppe: ["helmet", "welding gauntlets", "eye protection", "ear defenders", "safety boots"]
  },

  health_safety: [
    "Follow site induction and hospital safety protocols.",
    "Use appropriate PPE for welding, cutting, and handling hot materials.",
    "Ensure LOTO procedures are followed on existing lines.",
    "Keep walkways and access routes clear at all times.",
    "Maintain ventilation in enclosed areas during welding.",
    "Report any incidents, near misses or unsafe acts immediately.",
    "Fire extinguishers and first aid kits to be available near work area."
  ],

  procedure: [
    {
      step: "Preparation",
      details: [
        "Review drawings, permits, and safety documentation.",
        "Confirm isolation of existing pipework (LOTO in place).",
        "Inspect work area and establish barriers and signage.",
        "Set up welding screens and fire watch if required."
      ],
    },
    {
      step: "Installation",
      details: [
        "Cut and prepare new stainless-steel pipe sections to size.",
        "Align and tack weld new sections ensuring level and support.",
        "Complete full welds using approved TIG process.",
        "Pressure test with water to specified pressure.",
        "Drain and dry pipework before insulating and labelling."
      ],
    },
    {
      step: "Inspection & Handover",
      details: [
        "Carry out visual inspection of all welds and connections.",
        "Remove all tools, waste and barriers.",
        "Sign off permits and provide documentation to client representative.",
        "Confirm area returned to safe operational condition."
      ]
    }
  ],

  ppe: [
    { item: "Safety helmet", standard: "EN397", type: "Head protection" },
    { item: "Welding gauntlets", standard: "EN12477", type: "Hand protection" },
    { item: "Protective overalls", standard: "EN ISO 11611", type: "Welding apparel" },
    { item: "Safety boots (S3)", standard: "EN ISO 20345", type: "Foot protection" },
    { item: "Safety glasses", standard: "EN166", type: "Eye protection" },
    { item: "Hearing protection", standard: "EN352", type: "Ear defenders" },
    { item: "High-visibility vest", standard: "EN20471", type: "Visibility" },
    { item: "FFP3 respirator", standard: "EN149", type: "Respiratory protection" }
  ],

  risk_assessment: [
    {
      activity: "Hot works (welding and cutting)",
      hazard: "Fire, burns, fumes, and eye injury",
      likelihood: 3,
      severity: 4,
      risk: 12,
      who: ["A", "B"],
      controls:
        "Hot work permit in place, fire watch assigned, welding screens erected, ventilation maintained, PPE worn.",
      residual_likelihood: 1,
      residual_severity: 3,
      residual_risk: 3,
      monitoring: "Supervisor inspections and fire watch logs."
    },
    {
      activity: "Manual handling of pipework",
      hazard: "Back strain or crush injuries",
      likelihood: 3,
      severity: 3,
      risk: 9,
      who: ["A"],
      controls:
        "Team lifting, use of pipe stands and hoists, avoid twisting motions, training in manual handling.",
      residual_likelihood: 1,
      residual_severity: 3,
      residual_risk: 3,
      monitoring: "Toolbox talks and supervisor checks."
    },
    {
      activity: "Working at height on podium steps",
      hazard: "Falls or dropped objects",
      likelihood: 2,
      severity: 5,
      risk: 10,
      who: ["A", "C"],
      controls:
        "Use podium steps with handrails, maintain three points of contact, secure tools, no overreaching.",
      residual_likelihood: 1,
      residual_severity: 3,
      residual_risk: 3,
      monitoring: "Daily visual inspections."
    }
  ],

  hazard_register: [
    {
      hazard: "Hot works and welding",
      harm: "Burns, fire, smoke inhalation",
      existing_controls: "Hot work permit, fire watch, fire extinguisher nearby",
      further_action: "Review fire watch positioning weekly",
      action_by: "Site Supervisor"
    },
    {
      hazard: "Manual handling",
      harm: "Back or limb strain",
      existing_controls: "Use mechanical aids and team lifts",
      further_action: "Refresh manual handling training",
      action_by: "Project Manager"
    },
    {
      hazard: "Working at height",
      harm: "Falls causing serious injury",
      existing_controls: "Use podium steps and fall prevention",
      further_action: "Ensure inspection tags on access equipment",
      action_by: "H&S Officer"
    },
    {
      hazard: "Slips and trips",
      harm: "Minor to moderate injury",
      existing_controls: "Keep area tidy, remove waste regularly",
      further_action: "Monitor housekeeping daily",
      action_by: "Operatives"
    },
    {
      hazard: "Electric tools and cables",
      harm: "Electric shock or trip hazard",
      existing_controls: "PAT tested tools, avoid trailing leads",
      further_action: "Use cable covers if across walkways",
      action_by: "Site Supervisor"
    }
  ],

  emergency_plan: {
    site_contacts: [
      { name: "John Smith", role: "Site Supervisor", phone: "07801 111111" },
      { name: "Laura Green", role: "Client Shift Supervisor", phone: "07802 222222" },
      { name: "Mark Lewis", role: "First Aider", phone: "07803 333333" },
      { name: "Security Desk", role: "Hospital Security", phone: "0161 123 4567" }
    ],
    hospital: {
      name: "Manchester Royal Infirmary",
      address: "Oxford Road, Manchester M13 9WL",
      phone: "0161 276 1234"
    },
    muster_point: "Main staff car park north side, by security gatehouse.",
    rescue_plans: [
      {
        scenario: "Rescue from MEWP or height",
        method: "Lower platform using ground controls or rescue ladder.",
        equipment: "Rescue kit, harness, fall-arrest lanyard.",
        designated_rescuer: "Trained MEWP Operator / Supervisor"
      }
    ]
  }
}


export default function RamsChatBot({ updateRams }: RamsChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "👋 Hi! Let's build your RAMS together. What's the project title?" },
  ]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const steps = [
    { key: "title", question: "What's the project title?" },
    { key: "location", question: "Where is the project located?" },
    { key: "client", question: "Who's the client?" },
    { key: "prepared_by", question: "Who prepared this RAMS?" },
    { key: "scope", question: "Briefly describe the project scope." },
  ];

  const currentStep = steps.find((s) => !(s.key in answers));

  async function handleSend() {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setInput("");

    if (currentStep) {
      const updatedAnswers = { ...answers, [currentStep.key]: userMsg };
      setAnswers(updatedAnswers);

      const nextStep = steps.find((s) => !(s.key in updatedAnswers));
      if (nextStep) {
        setMessages((prev) => [...prev, { sender: "bot", text: nextStep.question }]);
      } else {
        // all questions answered — generate the RAMS
        await generateRams(updatedAnswers);
      }
    }
  }

  async function generateRams(data: Record<string, string>) {
    setLoading(true);
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: "🧠 Generating your RAMS object..." },
    ]);

    try {
      const aiRams = await generateRamsAction({
        title: data.title,
        client: data.client,
        location: data.location,
        prepared_by: data.prepared_by,
        scope: data.scope,
      });

      // ✅ merge user answers into AI result so those values always match user input
      const mergedRams = {
        ...aiRams,
        project: {
          ...aiRams.project,
          title: data.title || aiRams.project.title,
          location: data.location || aiRams.project.location,
          client: data.client || aiRams.project.client,
          prepared_by: data.prepared_by || aiRams.project.prepared_by,
          scope: data.scope || aiRams.project.scope,
        },
      };

      console.log("✅ Final RAMS object:", mergedRams);
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

  return (
    <div className="w-full max-w-md mx-auto border rounded-lg p-4 flex flex-col gap-3 bg-background">
      <div className="h-[400px] overflow-y-auto space-y-2 p-2 border rounded-md bg-muted">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-2 rounded-lg text-sm ${
              m.sender === "bot"
                ? "bg-secondary text-secondary-foreground self-start"
                : "bg-primary text-primary-foreground self-end ml-auto"
            } w-fit max-w-[85%]`}
          >
            {m.text}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" /> Generating…
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Input
          placeholder="Type your answer..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={loading}
        />
        <Button onClick={handleSend} disabled={loading}>
          Send
        </Button>
      </div>
    </div>
  );
}