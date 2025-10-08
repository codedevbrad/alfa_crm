import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { Rams } from "../../rams";

/* ---------------- Styles: Traditional Tables ---------------- */

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 10, color: "#111827" },

  /* Header */
  header: {
    paddingTop: 20,
    paddingBottom: 18,
    paddingHorizontal: 24,
    backgroundColor: "#F8FAFC",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    borderStyle: "solid",
  },
  brandBar: {
    position: "absolute",
    top: 0, left: 0, right: 0,
    height: 3,
    backgroundColor: "#0EA5E9",
  },
  headRow: { flexDirection: "row", justifyContent: "space-between" },
  headerLeft: { flexGrow: 1, marginRight: 8 },
  headerRight: { alignItems: "flex-end" },
  headerTitle: { fontSize: 12, fontWeight: 700, marginBottom: 2 },
  headerMeta: { fontSize: 9, color: "#4B5563", marginTop: 2 },
  label: { fontSize: 9, color: "#4B5563", marginBottom: 2 },

  /* Content offset */
  content: { marginTop: 72 },

  /* Headings */
  h1: { fontSize: 16, marginBottom: 8, fontWeight: 700 },
  h2: { fontSize: 12, marginTop: 16, marginBottom: 8, fontWeight: 700 },

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
  },
  rowLast: { flexDirection: "row" },
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
});

/* ---------------- Small helpers ---------------- */

function metaJoin(parts: (string | undefined | null | false)[]) {
  return parts.filter(Boolean).join(" • ");
}

/* Fixed header for all pages */
function PdfHeader({ rams }: { rams: Rams }) {
  const leftTop = rams.project.title;
  const leftBottom = metaJoin([
    `Client: ${rams.project.client}`,
    `Location: ${rams.project.location}`,
    rams.project.prepared_by && `Prepared by: ${rams.project.prepared_by}`,
  ]);
  const rightTop = metaJoin([
    `Date: ${rams.project.date}`,
    rams.project.review_date && `Review: ${rams.project.review_date}`,
  ]);

  return (
    <View fixed style={styles.header}>
      <View style={styles.brandBar} />
      <Text style={styles.label}>Method Statement and Risk Assessment</Text>
      <View style={styles.headRow}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>{leftTop}</Text>
          <Text style={styles.headerMeta}>{leftBottom}</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.headerMeta}>{rightTop}</Text>
          <Text
            style={styles.headerMeta}
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
            fixed
          />
        </View>
      </View>
    </View>
  );
}

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
    ["Date", rams.project.date + (rams.project.review_date ? `  (Review: ${rams.project.review_date})` : "")],
    ...(rams.project.scope ? [["Scope", rams.project.scope]] : []),
  ] as [string, string][];

  return (
    <View style={styles.table}>
      {/* header */}
      <View style={styles.row}>
        <Text style={[styles.th, { flexBasis: 140, flexGrow: 0 }]}>Field</Text>
        <Text style={[styles.thLast, { flexGrow: 1 }]}>Details</Text>
      </View>
      {rows.map(([label, value], i) => (
        <View key={label} style={[i === rows.length - 1 ? styles.rowLast : styles.row, i % 2 ? styles.zebra : null]}>
          <Text style={[styles.td, { flexBasis: 140, flexGrow: 0 }]}>{label}</Text>
          <Text style={[styles.tdLast, { flexGrow: 1 }]}>{value}</Text>
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

/* Procedure table: three blocks as columns */
function ProcedureTable({ rams }: { rams: Rams }) {
  const prep = rams.procedure?.preparation ?? [];
  const fit = rams.procedure?.fitting ?? [];
  const insp = rams.procedure?.inspection ?? [];
  if (!prep.length && !fit.length && !insp.length) return null;

  return (
    <>
      <Text style={styles.h2}>Procedure</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={[styles.th, { flexBasis: 150, flexGrow: 0 }]}>Preparation</Text>
          <Text style={[styles.th, { flexBasis: 150, flexGrow: 0 }]}>Fitting</Text>
          <Text style={styles.thLast}>Inspection</Text>
        </View>
        {/* Single row with three columns, each is a bullet list */}
        <View style={styles.rowLast}>
          <View style={[styles.td, { flexBasis: 150, flexGrow: 0 }]}>
            {prep.length ? prep.map((x, i) => <Text key={i}>• {x}</Text>) : <Text>-</Text>}
          </View>
          <View style={[styles.td, { flexBasis: 150, flexGrow: 0 }]}>
            {fit.length ? fit.map((x, i) => <Text key={i}>• {x}</Text>) : <Text>-</Text>}
          </View>
          <View style={styles.tdLast}>
            {insp.length ? insp.map((x, i) => <Text key={i}>• {x}</Text>) : <Text>-</Text>}
          </View>
        </View>
      </View>
    </>
  );
}

/* Health & Safety quick table */
function HealthSafetyTable({ rams }: { rams: Rams }) {
  const hazards = rams.health_safety?.hazards ?? [];
  const controls = rams.health_safety?.controls ?? [];
  if (!hazards.length && !controls.length) return null;

  return (
    <>
      <Text style={styles.h2}>Health & Safety</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={[styles.th, { flexBasis: 180, flexGrow: 0 }]}>Hazards</Text>
          <Text style={styles.thLast}>Controls</Text>
        </View>
        <View style={styles.rowLast}>
          <View style={[styles.td, { flexBasis: 180, flexGrow: 0 }]}>
            {hazards.length ? hazards.map((h, i) => <Text key={i}>• {h}</Text>) : <Text>-</Text>}
          </View>
          <View style={styles.tdLast}>
            {controls.length ? controls.map((c, i) => <Text key={i}>• {c}</Text>) : <Text>-</Text>}
          </View>
        </View>
      </View>
    </>
  );
}

/* Full classic risk table (every cell bordered) */
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

          return (
            <View key={i} style={rowStyle}>
              <Text style={[styles.td, styles.colActivity]}>{r.activity}</Text>
              <Text style={[styles.td, styles.colHazard]}>{r.hazard}</Text>
              <Text style={[styles.td, styles.colNum]}>{r.likelihood}</Text>
              <Text style={[styles.td, styles.colNum]}>{r.severity}</Text>
              <Text style={[styles.td, styles.colRisk]}>{r.risk}</Text>
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

/* ---------------- Main PDF (Classic) ---------------- */

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

      {/* Page 3: Risk Assessment (classic grid) */}
      <Page size="A4" style={styles.page}>
        <PdfHeader rams={rams} />
        <View style={styles.content}>
          <RiskTableClassic rams={rams} />
        </View>
      </Page>
    </Document>
  );
}
