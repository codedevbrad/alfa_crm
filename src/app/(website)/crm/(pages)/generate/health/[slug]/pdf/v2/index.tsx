"use client";

import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { Rams } from "../../rams";
import PdfHeader from "../header";


/* ---------------- Styles: Traditional Tables ---------------- */


const styles = StyleSheet.create({

   page: { padding: 32, fontSize: 10, color: "#111827" },

  /* offset main content so it clears the fixed header */
  content: { marginTop: 86 },  // match your header height

  /* Headings */
  h1: { fontSize: 16, marginBottom: 8, fontWeight: 700 },
  h2: { fontSize: 12, marginTop: 16, marginBottom: 8, fontWeight: 700 },
  label: { fontSize: 9, color: "#4B5563" },

  /* Classic Table */
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderStyle: "solid",
    borderRadius: 4,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#CBD5E1",
    borderStyle: "solid",
    alignItems: "stretch",
  },
  rowLast: { flexDirection: "row", alignItems: "stretch" },

  // Header text style reused in header cells
  thText: {
    backgroundColor: "#F3F6FA",
    fontSize: 10,
    fontWeight: 700,
  },

  // Label cell (fixed width, no shrink)
  tdLabel: {
    flexBasis: 140,
    flexGrow: 0,
    flexShrink: 0,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRightWidth: 1,
    borderRightColor: "#CBD5E1",
    borderStyle: "solid",
    justifyContent: "center",
  },

  // Details cell (take remaining width, allow wrap)
  tdDetails: {
    flexBasis: 0,
    flexGrow: 1,
    flexShrink: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    justifyContent: "center",
  },

  // Text inside cells
  cellText: {
    fontSize: 10,
    lineHeight: 1.35,
  },
  th: {
    flexGrow: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: "#F3F6FA",
    fontSize: 10,
    fontWeight: 700,
    borderRightWidth: 1,
    borderRightColor: "#CBD5E1",
    borderStyle: "solid",
  },
  thLast: {
    flexGrow: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: "#F3F6FA",
    fontSize: 10,
    fontWeight: 700,
  },
  td: {
    flexGrow: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 10,
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
    borderStyle: "solid",
  },
  tdLast: {
    flexGrow: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 10,
  },
  zebra: { backgroundColor: "#FAFBFD" },

  /* Column helpers (risk table) */
  colActivity: { flexBasis: 120, flexGrow: 2 },
  colHazard: { flexBasis: 120, flexGrow: 2 },
  colNum: { flexBasis: 28, flexGrow: 0, textAlign: "center" },
  colRisk: { flexBasis: 32, flexGrow: 0, textAlign: "center" },
  colWho: { flexBasis: 100, flexGrow: 1 },
  colControls: { flexBasis: 170, flexGrow: 3 },
  colResidual: { flexBasis: 40, flexGrow: 0, textAlign: "center" },

  /* Legend */
  card: {
    borderWidth: 1, borderColor: "#CBD5E1", borderStyle: "solid",
    borderRadius: 4, padding: 8, marginTop: 6,
  },
  legendTitle: { fontSize: 10, fontWeight: 700, marginBottom: 4 },
  legendRow: { flexDirection: "row", marginTop: 4 },
  legendItem: { flexDirection: "row", alignItems: "center", flexGrow: 1, marginRight: 8 },
  legendNum: {
    minWidth: 16, textAlign: "center",
    borderWidth: 1, borderStyle: "solid", borderColor: "#CBD5E1",
    backgroundColor: "#EEF2F7",
    borderRadius: 10,
    paddingVertical: 1, paddingHorizontal: 4,
    fontSize: 9, marginRight: 6,
  },
  legendText: { fontSize: 9, color: "#374151", lineHeight: 1.3 },
  pill: {
    borderWidth: 1, borderStyle: "solid",
    borderRadius: 10,
    paddingVertical: 2, paddingHorizontal: 6,
    fontSize: 9, marginRight: 6,
  },
  pillGreen: { backgroundColor: "#D1FAE5", borderColor: "#10B981" },
  pillAmber: { backgroundColor: "#FEF3C7", borderColor: "#F59E0B" },
  pillRed: { backgroundColor: "#FECACA", borderColor: "#EF4444" },

  lCellLow:   { backgroundColor: "#E8F7EF" }, // 1–2 (green-ish)
  lCellMed:   { backgroundColor: "#FFF4D6" }, // 3–4 (amber-ish)
  lCellHigh:  { backgroundColor: "#FFE2E2" }, // 5 (red-ish)

  sCellLow:   { backgroundColor: "#E8F7EF" },
  sCellMed:   { backgroundColor: "#FFF4D6" },
  sCellHigh:  { backgroundColor: "#FFE2E2" },

  // optional: make numbers centered & bold for readability
  numText: { textAlign: "center", fontWeight: 700 },

   riskLow: {
    backgroundColor: "#D1FAE5", // green
    borderColor: "#10B981",
    borderWidth: 0.5,
  },
  riskMedium: {
    backgroundColor: "#FEF3C7", // yellow
    borderColor: "#F59E0B",
    borderWidth: 0.5,
  },
  riskHigh: {
    backgroundColor: "#FECACA", // red
    borderColor: "#EF4444",
    borderWidth: 0.5,
  },
  riskText: {
    textAlign: "center",
    fontWeight: 700,
  },
});



/* Legend reused */
function RiskLegend() {
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.legendTitle}>Who</Text>
        <Text style={styles.label}>Operative=A · Other Employees=B · Others/Public=C</Text>
      </View>

      <Text style={styles.legendTitle}>Likelihood (L)</Text>
      <View style={styles.legendRow}>
        <View style={styles.legendItem}><Text style={styles.legendNum}>1</Text><Text style={styles.legendText}>Very unlikely</Text></View>
        <View style={styles.legendItem}><Text style={styles.legendNum}>2</Text><Text style={styles.legendText}>Unlikely</Text></View>
        <View style={styles.legendItem}><Text style={styles.legendNum}>3</Text><Text style={styles.legendText}>Likely</Text></View>
        <View style={styles.legendItem}><Text style={styles.legendNum}>4</Text><Text style={styles.legendText}>Very likely</Text></View>
        <View style={styles.legendItem}><Text style={styles.legendNum}>5</Text><Text style={styles.legendText}>Almost certain</Text></View>
      </View>

      <Text style={[styles.legendTitle, { marginTop: 8 }]}>Severity (S)</Text>
      <View style={styles.legendRow}>
        <View style={styles.legendItem}><Text style={styles.legendNum}>1</Text><Text style={styles.legendText}>First aid required</Text></View>
        <View style={styles.legendItem}><Text style={styles.legendNum}>2</Text><Text style={styles.legendText}>Minor injury or illness</Text></View>
        <View style={styles.legendItem}><Text style={styles.legendNum}>3</Text><Text style={styles.legendText}>RIDDOR injury / illness</Text></View>
        <View style={styles.legendItem}><Text style={styles.legendNum}>4</Text><Text style={styles.legendText}>Major injury / illness</Text></View>
        <View style={styles.legendItem}><Text style={styles.legendNum}>5</Text><Text style={styles.legendText}>Fatal or disabling</Text></View>
      </View>

      <Text style={[styles.legendTitle, { marginTop: 10 }]}>Risk (R = L × S)</Text>
      <View style={styles.legendRow}><Text style={[styles.pill, styles.pillGreen]}>1–5 Low</Text><Text style={styles.legendText}>No further action.</Text></View>
      <View style={styles.legendRow}><Text style={[styles.pill, styles.pillAmber]}>6–12 Medium</Text><Text style={styles.legendText}>Introduce further controls / monitoring.</Text></View>
      <View style={styles.legendRow}><Text style={[styles.pill, styles.pillRed]}>13–25 High</Text><Text style={styles.legendText}>Stop process until risk reduced.</Text></View>
    </View>
  );
}
 

/* ---------------- Classic “boxed” tables ---------------- */

function KeyDetailsTable({ rams }: { rams: Rams }) {
  const rows = [
    ["Project Title", rams.project.title],
    ["Client", rams.project.client],
    ["Location", rams.project.location],
    ["Prepared By", rams.project.prepared_by],
    [
      "Date",
      rams.project.date +
        (rams.project.review_date ? `  (Review: ${rams.project.review_date})` : ""),
    ],
    ...(rams.project.scope ? [["Scope", rams.project.scope]] : []),
  ] as [string, string][];

  return (
    <View style={styles.table}>
      {/* header */}
      <View style={styles.row}>
        <View style={[styles.tdLabel]}>
          <Text style={styles.thText}>Field</Text>
        </View>
        <View style={[styles.tdDetails]}>
          <Text style={styles.thText}>Details</Text>
        </View>
      </View>

      {rows.map(([label, value], i) => (
        <View
          key={label}
          style={[
            i === rows.length - 1 ? styles.rowLast : styles.row,
            i % 2 ? styles.zebra : null,
          ]}
        >
          <View style={styles.tdLabel}>
            <Text style={styles.cellText}>{label}</Text>
          </View>
          <View style={styles.tdDetails}>
            <Text style={styles.cellText}>{value}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}


function SimpleListTable({ title, items }: { title: string; items: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <>
      <Text style={styles.h2}>{title}</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={styles.thLast}>Item</Text>
        </View>
        {items.map((x, i) => (
          <View key={i} style={[i === items.length - 1 ? styles.rowLast : styles.row, i % 2 ? styles.zebra : null]}>
            <Text style={styles.tdLast}>• {x}</Text>
          </View>
        ))}
      </View>
    </>
  );
}

/* Materials & Equipment table with separate columns */
function MaterialsTable({ rams }: { rams: Rams }) {
  const { materials_equipment: m } = rams;
  const entries = [
    ["Pipes", (m.pipes ?? []).join(", ")],
    ["Fittings", (m.fittings ?? []).join(", ")],
    ["Tools", (m.tools ?? []).join(", ")],
    ["PPE", m.ppe ? m.ppe.join(", ") : ""],
  ].filter(([, v]) => v && v.length) as [string, string][];

  if (!entries.length) return null;

  return (
    <>
      <Text style={styles.h2}>Materials & Equipment</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={[styles.th, { flexBasis: 120, flexGrow: 0 }]}>Type</Text>
          <Text style={[styles.thLast, { flexGrow: 1 }]}>Details</Text>
        </View>
        {entries.map(([label, value], i) => (
          <View key={label} style={[i === entries.length - 1 ? styles.rowLast : styles.row, i % 2 ? styles.zebra : null]}>
            <Text style={[styles.td, { flexBasis: 120, flexGrow: 0 }]}>{label}</Text>
            <Text style={[styles.tdLast, { flexGrow: 1 }]}>{value}</Text>
          </View>
        ))}
      </View>
    </>
  );
}

/* Detailed PPE (structured) */
function DetailedPPETable({ rams }: { rams: Rams }) {
  const list = rams.ppe ?? [];
  if (!list.length) return null;

  return (
    <>
      <Text style={styles.h2}>Required PPE</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={[styles.th, { flexBasis: 160, flexGrow: 0 }]}>Item</Text>
          <Text style={[styles.th, { flexBasis: 120, flexGrow: 0 }]}>Standard</Text>
          <Text style={styles.thLast}>Type/Notes</Text>
        </View>
        {list.map((p, i) => (
          <View key={i} style={[i === list.length - 1 ? styles.rowLast : styles.row, i % 2 ? styles.zebra : null]}>
            <Text style={[styles.td, { flexBasis: 160, flexGrow: 0 }]}>{p.item}</Text>
            <Text style={[styles.td, { flexBasis: 120, flexGrow: 0 }]}>{p.standard || "-"}</Text>
            <Text style={styles.tdLast}>{p.type || "-"}</Text>
          </View>
        ))}
      </View>
    </>
  );
}


/* Procedure table: dynamic rows from { step, details[] } */
function ProcedureTable({ rams }: { rams: Rams }) {
  const steps = rams.procedure ?? [];
  if (!steps.length) return null;

  return (
    <>
      <Text style={styles.h2}>Procedure</Text>
      <View style={styles.table}>
        {/* Header */}
        <View style={styles.row}>
          <Text style={[styles.th, { flexBasis: 180, flexGrow: 0 }]}>Step</Text>
          <Text style={styles.thLast}>Details</Text>
        </View>

        {/* Rows */}
        {steps.map((s, i) => (
          <View
            key={i}
            style={[
              i === steps.length - 1 ? styles.rowLast : styles.row,
              i % 2 ? styles.zebra : null,
            ]}
          >
            <Text style={[styles.td, { flexBasis: 180, flexGrow: 0 }]}>
              {s.step || `Step ${i + 1}`}
            </Text>
            <View style={styles.tdLast}>
              {s.details?.length
                ? s.details.map((d, j) => <Text key={j}>• {d}</Text>)
                : <Text>-</Text>}
            </View>
          </View>
        ))}
      </View>
    </>
  );
}



/* new, polished stylesheet */
const hazardStyles = StyleSheet.create({
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderStyle: "solid",
    borderRadius: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "stretch",
    borderBottomWidth: 1,
    borderBottomColor: "#CBD5E1",
    borderStyle: "solid",
  },
  rowLast: {
    flexDirection: "row",
    alignItems: "stretch",
  },

  /* --- Headers --- */
  th: {
    backgroundColor: "#F3F6FA",
    borderRightWidth: 1,
    borderRightColor: "#CBD5E1",
    borderStyle: "solid",
    paddingVertical: 6,
    paddingHorizontal: 6,
    justifyContent: "center",
  },
  thLast: {
    backgroundColor: "#F3F6FA",
    paddingVertical: 6,
    paddingHorizontal: 6,
    justifyContent: "center",
  },
  thText: {
    fontSize: 8.5,
    fontWeight: 700,
    textAlign: "center",
    lineHeight: 1.3,
  },

  /* --- Body cells --- */
  td: {
    paddingVertical: 5,
    paddingHorizontal: 6,
    fontSize: 9,
    lineHeight: 1.35,
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
    borderStyle: "solid",
    flexShrink: 1,
    flexBasis: 0,
    minWidth: 0,
    textAlign: "left",
  },
  tdLast: {
    paddingVertical: 5,
    paddingHorizontal: 6,
    fontSize: 9,
    lineHeight: 1.35,
    flexShrink: 1,
    flexBasis: 0,
    minWidth: 0,
    textAlign: "left",
  },

  /* --- Column ratios --- */
  colHazard: { flexGrow: 2.2 },
  colHarm: { flexGrow: 2.2 },
  colExisting: { flexGrow: 1.8 },
  colFurther: { flexGrow: 2.5 },
  colWho: { flexGrow: 1 },

  zebra: { backgroundColor: "#FAFBFD" },
});


export function HazardRegisterTable({ rams }: { rams: Rams }) {
  const rows = rams.hazard_register ?? [];
  if (!rows.length) return null;

  return (
    <>
      <Text
        style={{
          fontSize: 12,
          marginTop: 16,
          marginBottom: 8,
          fontWeight: 700,
          textTransform: "none",
        }}
      >
        hazards & controls
      </Text>

      <View style={hazardStyles.table}>
        {/* --- Header Row --- */}
        <View style={hazardStyles.row}>
          <View style={[hazardStyles.th, hazardStyles.colHazard]}>
            <Text style={hazardStyles.thText}>potential hazard </Text>
          </View>
          <View style={[hazardStyles.th, hazardStyles.colHarm]}>
            <Text style={hazardStyles.thText}>potential harm </Text>
          </View>
          <View style={[hazardStyles.th, hazardStyles.colExisting]}>
            <Text style={hazardStyles.thText}> existing controls </Text>
          </View>
          <View style={[hazardStyles.th, hazardStyles.colFurther]}>
            <Text style={hazardStyles.thText}> further action to take </Text>
          </View>
          <View style={[hazardStyles.thLast, hazardStyles.colWho]}>
            <Text style={hazardStyles.thText}>action by?</Text>
          </View>
        </View>

        {/* --- Body Rows --- */}
        {rows.map((r, i) => {
          const isLast = i === rows.length - 1;
          const zebra = i % 2 ? hazardStyles.zebra : null;
          return (
            <View
              key={i}
              style={[isLast ? hazardStyles.rowLast : hazardStyles.row, zebra]}
            >
              <Text style={[hazardStyles.td, hazardStyles.colHazard]} wrap>
                {r.hazard}
              </Text>
              <Text style={[hazardStyles.td, hazardStyles.colHarm]} wrap>
                {r.harm}
              </Text>
              <Text style={[hazardStyles.td, hazardStyles.colExisting]} wrap>
                {r.existing_controls}
              </Text>
              <Text style={[hazardStyles.td, hazardStyles.colFurther]} wrap>
                {r.further_action}
              </Text>
              <Text style={[hazardStyles.tdLast, hazardStyles.colWho]} wrap>
                {r.action_by}
              </Text>
            </View>
          );
        })}
      </View>
    </>
  );
}

const rescueStyles = StyleSheet.create({
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderStyle: "solid",
    borderRadius: 4,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#CBD5E1",
    borderStyle: "solid",
  },
  rowLast: {
    flexDirection: "row",
  },

  /* header cell container (lets text wrap) */
  thCell: {
    flexBasis: 0,
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 0,
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: "#F3F6FA",
    borderRightWidth: 1,
    borderRightColor: "#CBD5E1",
    borderStyle: "solid",
    justifyContent: "center",
  },
  thCellLast: { borderRightWidth: 0 },

  /* header text */
  thText: {
    fontSize: 8.5,
    lineHeight: 1.25,
    fontWeight: 700,
  },

  /* body cell container */
  tdCell: {
    flexBasis: 0,
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 0,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
    borderStyle: "solid",
    justifyContent: "flex-start",
  },
  tdCellLast: { borderRightWidth: 0 },

  /* body text */
  tdText: {
    fontSize: 9.5,
    lineHeight: 1.28,
  },

  /* zebra alt row */
  zebra: { backgroundColor: "#FAFBFD" },

  /* column width balance (tweak to taste) */
  colScenario: { flexGrow: 0.9 },
  colMethod:   { flexGrow: 1.2 },
  colEquip:    { flexGrow: 1.0 },
  colRescuer:  { flexGrow: 0.7 }, // narrower
});



/* Emergency & Rescue (contacts, hospital, muster, rescue plans, fire watch) */
function EmergencyRescueTable({ rams }: { rams: Rams }) {
  const p = rams.emergency_plan;
  if (!p) return null;

  const hasContacts = (p.site_contacts ?? []).length > 0;
  const hasRescues = (p.rescue_plans ?? []).length > 0;
  const hasHospital = p.hospital && (p.hospital.name || p.hospital.address || p.hospital.phone);
  const hasMuster = !!p.muster_point;

  if (!hasContacts && !hasRescues && !hasHospital && !hasMuster && !hasFireWatch) return null;

  return (
    <>
      <Text style={styles.h2}>Emergency & Rescue Arrangements</Text>

      {/* Contacts */}
      {hasContacts ? (
        <View style={[styles.table, { marginVertical: 8 }]}>
          <View style={styles.row}>
            <Text style={[styles.th, { flexBasis: 160, flexGrow: 0 }]}>Name</Text>
            <Text style={[styles.th, { flexBasis: 140, flexGrow: 0 }]}>Role</Text>
            <Text style={styles.thLast}>Phone</Text>
          </View>
          {p.site_contacts!.map((c, i) => (
            <View
              key={i}
              style={[
                i === p.site_contacts!.length - 1 ? styles.rowLast : styles.row,
                i % 2 ? styles.zebra : null,
              ]}
            >
              <Text style={[styles.td, { flexBasis: 160, flexGrow: 0 }]}>{c.name}</Text>
              <Text style={[styles.td, { flexBasis: 140, flexGrow: 0 }]}>{c.role || "-"}</Text>
              <Text style={styles.tdLast}>{c.phone || "-"}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {/* Hospital + Muster point (two-row card-like tables) */}
      {(hasHospital || hasMuster) ? (
        <View style={[styles.table, { marginVertical: 8 }]}>
          <View style={styles.row}>
            <Text style={[styles.th, { flexBasis: 160, flexGrow: 0 }]}>Nearest Hospital</Text>
            <Text style={styles.thLast}>Details</Text>
          </View>
          {hasHospital ? (
            <View style={styles.row}>
              <Text style={[styles.td, { flexBasis: 160, flexGrow: 0 }]}>Hospital</Text>
              <View style={styles.tdLast}>
                <Text>{p.hospital?.name || "-"}</Text>
                <Text>{p.hospital?.address || ""}</Text>
                <Text>{p.hospital?.phone || ""}</Text>
              </View>
            </View>
          ) : null}
          {hasMuster ? (
            <View style={styles.rowLast}>
              <Text style={[styles.td, { flexBasis: 160, flexGrow: 0 }]}>Muster Point</Text>
              <Text style={styles.tdLast}>{p.muster_point}</Text>
            </View>
          ) : null}
        </View>
      ) : null}

     {/* Rescue plans */}
{hasRescues ? (
  <View style={[rescueStyles.table, { marginVertical: 8 }]}>
    {/* header */}
    <View style={rescueStyles.row}>
      <View style={[rescueStyles.thCell, rescueStyles.colScenario]}>
        <Text style={rescueStyles.thText} wrap maxLines={2}>scenario</Text>
      </View>
      <View style={[rescueStyles.thCell, rescueStyles.colMethod]}>
        <Text style={rescueStyles.thText} wrap maxLines={2}>method</Text>
      </View>
      <View style={[rescueStyles.thCell, rescueStyles.colEquip]}>
        <Text style={rescueStyles.thText} wrap maxLines={2}>equipment</Text>
      </View>
      <View style={[rescueStyles.thCell, rescueStyles.colRescuer, rescueStyles.thCellLast]}>
        <Text style={rescueStyles.thText} wrap maxLines={2}>designated rescuer</Text>
      </View>
    </View>

    {/* rows */}
    {p.rescue_plans!.map((r, i) => (
      <View
        key={i}
        style={[
          i === p.rescue_plans!.length - 1 ? rescueStyles.rowLast : rescueStyles.row,
          i % 2 ? rescueStyles.zebra : null,
        ]}
      >
        <View style={[rescueStyles.tdCell, rescueStyles.colScenario]}>
          <Text style={rescueStyles.tdText} wrap>{r.scenario || "-"}</Text>
        </View>
        <View style={[rescueStyles.tdCell, rescueStyles.colMethod]}>
          <Text style={rescueStyles.tdText} wrap>{r.method || "-"}</Text>
        </View>
        <View style={[rescueStyles.tdCell, rescueStyles.colEquip]}>
          <Text style={rescueStyles.tdText} wrap>{r.equipment || "-"}</Text>
        </View>
        <View style={[rescueStyles.tdCell, rescueStyles.colRescuer, rescueStyles.tdCellLast]}>
          <Text style={rescueStyles.tdText} wrap>{r.designated_rescuer || "-"}</Text>
        </View>
      </View>
    ))}
  </View>
) : null}

    </>
  );
}


/* Health & Safety (single column from string[]) */
function HealthSafetyTable({ rams }: { rams: Rams }) {
  const items = rams.health_safety ?? [];
  if (!items.length) return null;

  return (
    <View style={{ marginTop: 16 }}>
      <Text style={styles.h2}>Health & Safety</Text>
      <Text style={{ marginBottom: 12 }}> A detailed risk assessment will be conducted prior to connecting the work. Key health and safety aspects include: </Text>
      <View style={styles.table}>
        {/* Header */}
        <View style={styles.row}>
          <Text style={styles.thLast}> Aspects Include </Text>
        </View>

        {/* Rows */}
        {items.map((it, i) => (
          <View
            key={i}
            style={[
              i === items.length - 1 ? styles.rowLast : styles.row,
              i % 2 ? styles.zebra : null,
            ]}
          >
            <Text style={styles.tdLast}>• {it}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}



/* Full classic risk table (every cell bordered, color-coded R cell) */
function RiskTableClassic({ rams }: { rams: Rams }) {
  const rows = rams.risk_assessment ?? [];
  if (!rows.length) return null;

  return (
    <>
      <Text style={styles.h2}>Risk Assessment</Text>
      <RiskLegend />

      <View style={[styles.table, { marginTop: 6 }]}>
        {/* Header */}
        <View style={styles.row}>
          <Text style={[styles.th, styles.colActivity]}>Activity</Text>
          <Text style={[styles.th, styles.colHazard]}>Hazard</Text>
          <Text style={[styles.th, styles.colNum]}>L</Text>
          <Text style={[styles.th, styles.colNum]}>S</Text>
          <Text style={[styles.th, styles.colRisk]}>R</Text>
          <Text style={[styles.th, styles.colWho]}>Who</Text>
          <Text style={[styles.th, styles.colControls]}>Controls</Text>
          <Text style={[styles.th, styles.colResidual]}>R′</Text>
        </View>

        {/* Body */}
        {rows.map((r, i) => {
          const isLast = i === rows.length - 1;
          const rowStyle = [isLast ? styles.rowLast : styles.row, i % 2 ? styles.zebra : null];
          const who = Array.isArray(r.who) ? r.who.join(", ") : "";
          const residual =
            r.residual_risk != null
              ? String(r.residual_risk)
              : r.residual_likelihood && r.residual_severity
              ? String(r.residual_likelihood * r.residual_severity)
              : "-";

          // background color for R cell
          const riskColor =
            r.risk <= 5
              ? styles.riskLow
              : r.risk <= 12
              ? styles.riskMedium
              : styles.riskHigh;

          return (
            <View key={i} style={rowStyle}>
              <Text style={[styles.td, styles.colActivity]}>{r.activity}</Text>
              <Text style={[styles.td, styles.colHazard]}>{r.hazard}</Text>
              <Text style={[styles.td, styles.colNum]}>{r.likelihood}</Text>
              <Text style={[styles.td, styles.colNum]}>{r.severity}</Text>
              <Text style={[styles.td, styles.colRisk, riskColor]}>
                <Text style={styles.riskText}>{r.risk}</Text>
              </Text>
              <Text style={[styles.td, styles.colWho]}>{who}</Text>
              <Text style={[styles.td, styles.colControls]}>{r.controls}</Text>
              <Text style={[styles.td, styles.colResidual]}>{residual}</Text>
            </View>
          );
        })}
      </View>
    </>
  );
}


export default function RamsPdfClassic({ rams }: { rams: Rams }) {
  return (
    <Document title="RAMS (Classic Tables)" author={rams.project.prepared_by}>
      {/* Page 1: Key details & core lists */}
      <Page size="A4" style={styles.page}>
        <PdfHeader rams={rams} />
        <View style={styles.content}>
          <Text style={styles.h1}>Method Statement & Risk Assessment</Text>
          <KeyDetailsTable rams={rams} />
          <SimpleListTable title="Activities" items={rams.activities || []} />
          {rams.responsibilities?.length ? (
            <>
              <Text style={styles.h2}>Responsibilities</Text>
              <View style={styles.table}>
                <View style={styles.row}>
                  <Text style={[styles.th, { flexBasis: 160, flexGrow: 0 }]}>Role</Text>
                  <Text style={styles.thLast}>Description</Text>
                </View>
                {rams.responsibilities.map((r, i) => (
                  <View key={i} style={[i === rams.responsibilities.length - 1 ? styles.rowLast : styles.row, i % 2 ? styles.zebra : null]}>
                    <Text style={[styles.td, { flexBasis: 160, flexGrow: 0 }]}>{r.role}</Text>
                    <Text style={styles.tdLast}>{r.description}</Text>
                  </View>
                ))}
              </View>
            </>
          ) : null}
        </View>
      </Page>

      {/* Page 2: Materials, PPE, H&S, Procedure */}
      <Page size="A4" style={styles.page}>
        <PdfHeader rams={rams} />
        <View style={styles.content}>
          <MaterialsTable rams={rams} />
          <DetailedPPETable rams={rams} />
          <HealthSafetyTable rams={rams} />
          <ProcedureTable rams={rams} />
        </View>
      </Page>

      {/* Page 3: NEW – Hazards register + Emergency & Rescue */}
      <Page size="A4" style={styles.page}>
        <PdfHeader rams={rams} />
        <View style={styles.content}>
          <HazardRegisterTable rams={rams} />
          <EmergencyRescueTable rams={rams} />
        </View>
      </Page>

      {/* Page 4: Risk Assessment (classic grid) */}
      <Page size="A4" style={styles.page}>
        <PdfHeader rams={rams} />
        <View style={styles.content}>
          <RiskTableClassic rams={rams} />
        </View>
      </Page>
    </Document>
  );
}
