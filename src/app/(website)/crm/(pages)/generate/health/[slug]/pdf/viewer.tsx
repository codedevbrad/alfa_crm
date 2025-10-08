"use client";

import { PDFViewer } from "@react-pdf/renderer";
import type { ReactElement, PropsWithChildren } from "react";
import type { DocumentProps } from "@react-pdf/renderer";

type PDFViewerClientProps = PropsWithChildren<{
  children: ReactElement<DocumentProps>;
  width?: number | string;
  height?: number | string;
}>;

export default function PDFViewerClient({
  children,
  width = "100%",
  height = 800,
}: PDFViewerClientProps) {
  return <PDFViewer width={width} height={height}>{children}</PDFViewer>;
}
