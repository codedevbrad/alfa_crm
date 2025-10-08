"use client";
import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Rams } from "./index";

/* Styles */
const S = StyleSheet.create({
  list: { marginTop: 8, gap: 8 },

  card: {
    borderWidth: 1, borderStyle: "solid", borderColor: "#D9DFE7",
    borderRadius: 6, padding: 10,
  },

  row: { flexDirection: "row", gap: 10 },
  colLeft: { flexBasis: 180, flexGrow: 0 },
  colRight: { flexGrow: 1 },

  h3: { fontSize: 11, fontWeight: 700, marginBottom: 4 },
  label: { fontSize: 9, color: "#4B5563", marginBottom: 2 },
  text: { fontSize: 10, lineHeight: 1.4 },

  meta: { marginBottom: 6 },
  chips: { flexDirection: "row", gap: 6, alignItems: "center", marginTop: 4 },

  chip: {
    borderRadius: 10, paddingVertical: 2, paddingHorizontal: 6,
    fontSize: 9, color: "#111827", borderWidth: 1, borderStyle: "solid",
  },
  chipNeutral: { backgroundColor: "#EEF2F7", borderColor: "#CBD5E1" },

  divider: { height: 1, backgroundColor: "#EEF2F7", marginVertical: 8 },

  // tiny badges for Who
  whoWrap: { flexDirection: "row", gap: 4, marginTop: 2, flexWrap: "wrap" },
  who: {
    fontSize: 8, borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2,
    borderWidth: 1, borderStyle: "solid", borderColor: "#CBD5E1", backgroundColor: "#F8FAFC",
  },

  // legend (if you’re using the scale card, keep your existing one)
  legendNote: { fontSize: 9, color: "#6B7280", marginTop: 6 },
});


/* Helpers */
function band(val?: number) {
  if (val == null) return { bg: "#EEF2F7", bd: "#CBD5E1", label: "—" };
  if (val <= 5)  return { bg: "#D1FAE5", bd: "#10B981", label: String(val) };   // green
  if (val <= 12) return { bg: "#FEF3C7", bd: "#F59E0B", label: String(val) };   // yellow
  return { bg: "#FECACA", bd: "#EF4444", label: String(val) };                  // red
}


const Neutral = ({ children }: { children: React.ReactNode }) => (
  <Text style={[S.chip, S.chipNeutral]}>{children}</Text>
);


export default function RiskCardsPdf({ rows }: { rows: NonNullable<Rams["risk_assessment"]> }) {
  return (
    <View style={S.list}>
      {rows.map((r, i) => {
        const pre = band(r.risk);
        const post = band(r.residual_risk);
        return (
          <View key={i} style={S.card}>

            <View style={[S.row, S.meta]}>
              <View style={S.colLeft}>
                <Text style={S.h3}>{r.activity}</Text>
                <Text style={S.label}>Hazard</Text>
                <Text style={S.text}>{r.hazard}</Text>

                <View style={S.whoWrap}>
                  {(r.who ?? []).map((w, idx) => (
                    <Text key={idx} style={S.who}>{w}</Text>
                  ))}
                </View>

              </View>

              <View style={S.colRight}>
                {/* Pre-control */}
                <Text style={S.label}>Pre-control</Text>
                <View style={S.chips}>
                  <Neutral>L{r.likelihood}</Neutral>
                  <Neutral>S{r.severity}</Neutral>
                  <Text style={[S.chip, { backgroundColor: pre.bg, borderColor: pre.bd }]}>R{pre.label}</Text>
                </View>

                <View style={S.divider} />

                {/* Controls */}
                <Text style={S.label}>Preventive & control measures</Text>
                <Text style={S.text}>{r.controls}</Text>

                <View style={S.divider} />

                {/* Post-control */}
                <Text style={S.label}>Post-control</Text>
                <View style={S.chips}>
                  {typeof r.residual_likelihood === "number" && <Neutral>L{r.residual_likelihood}</Neutral>}
                  {typeof r.residual_severity === "number" && <Neutral>S{r.residual_severity}</Neutral>}
                  <Text style={[S.chip, { backgroundColor: post.bg, borderColor: post.bd }]}>R{post.label}</Text>
                </View>

                {(r.residual_who?.length ?? 0) > 0 && (
                  <>
                    <View style={S.whoWrap}>
                      {r.residual_who!.map((w, idx) => (
                        <Text key={idx} style={S.who}>{w}</Text>
                      ))}
                    </View>
                  </>
                )}

                {r.monitoring && (
                  <>
                    <View style={S.divider} />
                    <Text style={S.label}>Monitoring arrangements</Text>
                    <Text style={S.text}>{r.monitoring}</Text>
                  </>
                )}
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}
