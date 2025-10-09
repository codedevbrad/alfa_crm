/* eslint-disable jsx-a11y/alt-text */
"use client";

import React from "react";
import { Text, View, StyleSheet , Image } from "@react-pdf/renderer";
import { Rams } from "../rams";

/* ---------------- Styles: Traditional Tables ---------------- */


const styles = StyleSheet.create({

   page: { padding: 32, fontSize: 10, color: "#111827" },
   header: {
    position: "absolute",
    top: 0, left: 0, right: 0,
    paddingTop: 18,
    paddingBottom: 14,
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
  headRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  topMetaRow: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 6,         // space before the logo/title row
},
topMetaRight: { fontSize: 9, color: "#4B5563" },


  /* left block (logo + titles) */
  leftWrap: { flexDirection: "row", alignItems: "center", flexGrow: 1, marginRight: 8 },
  logoBox: {
    width: 120,          // tweak to fit your image aspect
    height: 36,
    marginRight: 12,
    justifyContent: "center",
  },
  logoImg: { width: "100%", height: "100%", objectFit: "contain" },

  headerTextWrap: { flexGrow: 1 },
  headerTitle: { fontSize: 12, fontWeight: 700, marginBottom: 2 },
  headerMeta: { fontSize: 9, color: "#4B5563", marginTop: 2 },
  label: { fontSize: 9, color: "#4B5563", marginBottom: 6 },

  /* right block */
  headerRight: { alignItems: "flex-end" },
});



export default function PdfHeader({ rams }: { rams: Rams }) {

  return (
   <View fixed style={styles.header}>
  <View style={styles.brandBar} />

  {/* top line: label on the left, page x of y on the right */}
  <View style={styles.topMetaRow}>
    <Text style={styles.label}>
      Method Statement and Risk Assessments | {rams.project.date && `Date: ${rams.project.date} `}
    </Text>
    <Text
      style={styles.topMetaRight}
      render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
      fixed
    />
  </View>

  {/* second line: logo + project meta */}
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
          {[rams.project.client && `Client: ${rams.project.client}`,
            rams.project.location && `Location: ${rams.project.location}`,
            rams.project.prepared_by && `Prepared by: ${rams.project.prepared_by}`]
            .filter(Boolean).join(" • ")}
        </Text>
      </View>
    </View>
  </View>
</View>
  );
}

