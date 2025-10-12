/* eslint-disable jsx-a11y/alt-text */
"use client";

import React from "react";
import { Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { Rams } from "../rams";

export const HEADER_HEIGHT = 86; // <- single source of truth (tweak if you change header contents)

const styles = StyleSheet.create({
  header: {
    position: "absolute",              // <- IMPORTANT: fixed, not absolute
    top: 0, left: 0, right: 0,
    height: HEADER_HEIGHT,          // <- lock height so we can reserve space
    paddingTop: 18,
    paddingBottom: 14,
    paddingHorizontal: 24,
    backgroundColor: "#FFFFFF",     // <- opaque so nothing shows through
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
  headRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  topMetaRight: { fontSize: 9, color: "#4B5563" },
  leftWrap: { flexDirection: "row", alignItems: "center", flexGrow: 1, marginRight: 8 },
  logoBox: { width: 120, height: 36, marginRight: 12, justifyContent: "center" },
  logoImg: { width: "100%", height: "100%", objectFit: "contain" },
  headerTextWrap: { flexGrow: 1 },
  headerTitle: { fontSize: 12, fontWeight: 700, marginBottom: 2 },
  headerMeta: { fontSize: 9, color: "#4B5563", marginTop: 2 },
  label: { fontSize: 9, color: "#4B5563", marginBottom: 6 },
});

export default function PdfHeader({ rams }: { rams: Rams }) {
  return (
    <View fixed style={styles.header}>
      <View style={styles.brandBar} />

      <View style={styles.topMetaRow}>
        <Text style={styles.label}>
          Method Statement and Risk Assessments {rams.project.date ? `| Date: ${rams.project.date}` : ""}
        </Text>
        <Text
          style={styles.topMetaRight}
          render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
        />
      </View>

      <View style={styles.headRow}>
        <View style={styles.leftWrap}>
          <View style={styles.logoBox}>
            <Image
              style={styles.logoImg}
              src="https://res.cloudinary.com/dnph27ksd/image/upload/v1759947705/a0a89ba7-739b-4324-b60b-8061b03744ce.png"
            />
          </View>
          <View style={styles.headerTextWrap}>
            <Text style={styles.headerTitle}>{rams.project.title}</Text>
            <Text style={styles.headerMeta}>
              {[
                rams.project.client && `Client: ${rams.project.client}`, 
                rams.project.prepared_by && `Prepared by: ${rams.project.prepared_by}`,
              ]
                .filter(Boolean)
                .join(" • ")}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
