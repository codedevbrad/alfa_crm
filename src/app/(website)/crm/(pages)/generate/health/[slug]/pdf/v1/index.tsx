"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import RiskTable from "./risks";
import { Rams } from "../../rams";
import PdfHeader from "../header";

/* ---------- Styles (no border shorthands) ---------- */

const styles = StyleSheet.create({
  label: { fontSize: 9, color: "#4B5563", marginBottom: 2 },

  page: { padding: 32, fontSize: 10 },

  /* Push content below fixed header */
  content: { marginTop: 84 }, // was 64 — keep this in step with the taller header



  /* Section headings + cards */
  h1: { fontSize: 18, marginBottom: 6, fontWeight: 700 },
  h2: { fontSize: 12, marginTop: 16, marginBottom: 8, fontWeight: 700 },
  h3: { fontSize: 10, fontWeight: 700, marginTop: 6, marginBottom: 4 },

  card: {
    borderWidth: 1,
    borderColor: "#D9DFE7",
    borderStyle: "solid",
    borderRadius: 6,
    padding: 8,
    marginTop: 6,
  },
  cardItem: { marginBottom: 3 },

  /* Table (kept from your file) */
  tableWrap: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#D9DFE7",
    borderStyle: "solid",
    borderRadius: 6,
  },
  trHeader: {
    flexDirection: "row",
    backgroundColor: "#F3F6FA",
    borderBottomWidth: 1,
    borderBottomColor: "#D9DFE7",
    borderStyle: "solid",
  },
  th: { paddingVertical: 6, paddingHorizontal: 8, fontSize: 10, fontWeight: 700 },
  tr: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#EEF2F7",
    borderStyle: "solid",
  },
  trLast: { flexDirection: "row" },
  rowAlt: { backgroundColor: "#FAFBFD" },
  td: { paddingVertical: 8, paddingHorizontal: 8, fontSize: 10, lineHeight: 1.5 },

  colActivity: { flexBasis: 120, flexGrow: 2 },
  colHazard: { flexBasis: 120, flexGrow: 2 },
  colNum: { flexBasis: 28, flexGrow: 0, textAlign: "center" },
  colRisk: { flexBasis: 30, flexGrow: 0, textAlign: "center" },
  colWho: { flexBasis: 90, flexGrow: 1 },
  colControls: { flexBasis: 160, flexGrow: 3 },
  colResidual: { flexBasis: 40, flexGrow: 0, textAlign: "center" },

  chip: {
    alignSelf: "center",
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 6,
    fontSize: 9,
    color: "#111827",
  },

  /* --- Legend styles --- */
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


/* ---------- Legend block shown above Risk Assessment ---------- */

function RiskLegend() {
  return (
    <View style={styles.card}>
        
      <View>
            <Text style={styles.legendTitle}> Who </Text>
            <Text style={styles.label}>Operative=A · Other Employees=B · Others/Public=C</Text>
      </View>
      

      {/* Likelihood */}
      <Text style={styles.legendTitle}>Likelihood (L)</Text>
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <Text style={styles.legendNum}>1</Text>
          <Text style={styles.legendText}>Very unlikely</Text>
        </View>
        <View style={styles.legendItem}>
          <Text style={styles.legendNum}>2</Text>
          <Text style={styles.legendText}>Unlikely</Text>
        </View>
        <View style={styles.legendItem}>
          <Text style={styles.legendNum}>3</Text>
          <Text style={styles.legendText}>Likely</Text>
        </View>
        <View style={styles.legendItem}>
          <Text style={styles.legendNum}>4</Text>
          <Text style={styles.legendText}>Very likely</Text>
        </View>
        <View style={styles.legendItem}>
          <Text style={styles.legendNum}>5</Text>
          <Text style={styles.legendText}>Almost certain</Text>
        </View>
      </View>

      {/* Severity */}
      <Text style={[styles.legendTitle, { marginTop: 8 }]}>Severity (S)</Text>
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <Text style={styles.legendNum}>1</Text>
          <Text style={styles.legendText}>First aid required</Text>
        </View>
        <View style={styles.legendItem}>
          <Text style={styles.legendNum}>2</Text>
          <Text style={styles.legendText}>Minor injury or illness</Text>
        </View>
        <View style={styles.legendItem}>
          <Text style={styles.legendNum}>3</Text>
          <Text style={styles.legendText}>RIDDOR injury / illness</Text>
        </View>
        <View style={styles.legendItem}>
          <Text style={styles.legendNum}>4</Text>
          <Text style={styles.legendText}>Major injury / illness</Text>
        </View>
        <View style={styles.legendItem}>
          <Text style={styles.legendNum}>5</Text>
          <Text style={styles.legendText}>Fatal or disabling</Text>
        </View>
      </View>

      {/* Risk bands */}
      <Text style={[styles.legendTitle, { marginTop: 10 }]}>Risk (R = L × S)</Text>
      <View style={styles.legendRow}>
        <Text style={[styles.pill, styles.pillGreen]}>1–5 Low</Text>
        <Text style={styles.legendText}>No further action.</Text>
      </View>
      <View style={styles.legendRow}>
        <Text style={[styles.pill, styles.pillAmber]}>6–12 Medium</Text>
        <Text style={styles.legendText}>Introduce further controls or monitoring to reduce risk.</Text>
      </View>
      <View style={styles.legendRow}>
        <Text style={[styles.pill, styles.pillRed]}>13–25 High</Text>
        <Text style={styles.legendText}>Stop process until controls reduce risk or seek advice.</Text>
      </View>
    </View>
  );
}

/* ---------- Main PDF ---------- */

export default function RamsPdf({ rams }: { rams: Rams }) {
  return (
    <Document title={`RAMS Builder file`} author={rams.project.prepared_by}>
      {/* ---------- Page 1 ---------- */}
      <Page size="A4" style={styles.page}>
        <PdfHeader rams={rams} />
        <View style={styles.content}>

          <Text style={styles.h1}> Method Statement and Risk Assessment for {rams.project.title} </Text>

          {/* Scope */}
          {rams.project.scope ? (
            <>
              <Text style={styles.h2}>Scope of Work</Text>
              <View style={styles.card}>
                <Text style={styles.cardItem}>{rams.project.scope}</Text>
              </View>
            </>
          ) : null}

          {/* Activities */}
          <Text style={styles.h2}>Activities</Text>
          <View style={styles.card}>
            {rams.activities?.map((a, i) => (
              <Text key={i} style={styles.cardItem}>• {a}</Text>
            ))}
          </View>

          {/* Responsibilities */}
          <Text style={styles.h2}>Responsibilities</Text>
          <View style={styles.card}>
            {rams.responsibilities?.map((r, i) => (
              <Text key={i} style={styles.cardItem}>
                {r.role}: {r.description}
              </Text>
            ))}
          </View>
        </View>
      </Page>

      {/* ---------- Page 2 ---------- */}
      <Page size="A4" style={styles.page}>
        <PdfHeader rams={rams} />
        <View style={styles.content}>
          {/* Materials & Equipment */}
          <Text style={styles.h2}>Materials & Equipment</Text>
          <View style={styles.card}>
            <Text style={styles.cardItem}>Pipes: {(rams.materials_equipment.pipes ?? []).join(", ")}</Text>
            <Text style={styles.cardItem}>Fittings: {(rams.materials_equipment.fittings ?? []).join(", ")}</Text>
            <Text style={styles.cardItem}>Tools: {(rams.materials_equipment.tools ?? []).join(", ")}</Text>
            {rams.materials_equipment.ppe && (
              <Text style={styles.cardItem}>PPE: {rams.materials_equipment.ppe.join(", ")}</Text>
            )}
          </View>

          {/* Health & Safety */}
          {(rams.health_safety?.hazards?.length || rams.health_safety?.controls?.length) ? (
            <>
              <Text style={styles.h2}>Health & Safety</Text>
              <View style={styles.card}>
                {!!rams.health_safety?.hazards?.length && (
                  <Text style={styles.cardItem}>Hazards: {rams.health_safety?.hazards?.join(", ")}</Text>
                )}
                {!!rams.health_safety?.controls?.length && (
                  <Text style={styles.cardItem}>Controls: {rams.health_safety?.controls?.join(", ")}</Text>
                )}
              </View>
            </>
          ) : null}

          {/* Detailed PPE */}
          {rams.ppe && rams.ppe.length > 0 && (
            <>
              <Text style={styles.h2}>Required PPE</Text>
              <View style={styles.card}>
                {rams.ppe.map((p, i) => (
                  <Text key={i} style={styles.cardItem}>
                    • {p.item}{p.standard ? ` (${p.standard})` : ""}{p.type ? ` — ${p.type}` : ""}
                  </Text>
                ))}
              </View>
            </>
          )}

          {/* Procedure */}
          {(rams.procedure?.preparation?.length ||
            rams.procedure?.fitting?.length ||
            rams.procedure?.inspection?.length) ? (
            <>
              <Text style={styles.h2}>Procedure</Text>
              <View style={styles.card}>
                {!!rams.procedure?.preparation?.length && (
                  <>
                    <Text style={styles.h3}>Preparation</Text>
                    {rams.procedure!.preparation!.map((item, idx) => (
                      <Text key={`prep-${idx}`} style={styles.cardItem}>• {item}</Text>
                    ))}
                  </>
                )}
                {!!rams.procedure?.fitting?.length && (
                  <>
                    <Text style={styles.h3}>Fitting</Text>
                    {rams.procedure!.fitting!.map((item, idx) => (
                      <Text key={`fit-${idx}`} style={styles.cardItem}>• {item}</Text>
                    ))}
                  </>
                )}
                {!!rams.procedure?.inspection?.length && (
                  <>
                    <Text style={styles.h3}>Inspection</Text>
                    {rams.procedure!.inspection!.map((item, idx) => (
                      <Text key={`insp-${idx}`} style={styles.cardItem}>• {item}</Text>
                    ))}
                  </>
                )}
              </View>
            </>
          ) : null}
        </View>
      </Page>

      {/* ---------- Page 3 ---------- */}

      <Page size="A4" style={styles.page}>
        <PdfHeader rams={rams} />
        <View style={styles.content}>
          {/* Risk Assessment */}
          {rams.risk_assessment && rams.risk_assessment.length > 0 && (
            <>
              <Text style={styles.h2}>Risk Assessment</Text>
              
              <RiskLegend />

              <RiskTable rows={rams.risk_assessment} />
            </>
          )}
        </View>
      </Page>
    </Document>
  );
}
