"use client";

import { FileDown } from "lucide-react";
import { useState } from "react";

export function ExportReportButton() {
  const [loading, setLoading] = useState(false);

  const downloadReport = async () => {
    setLoading(true);
    const response = await fetch("/api/reports/export");

    if (!response.ok) {
      setLoading(false);
      return;
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "crm-analytics-report.pdf";
    link.click();
    window.URL.revokeObjectURL(url);
    setLoading(false);
  };

  return (
    <button
      type="button"
      onClick={downloadReport}
      disabled={loading}
      className="inline-flex h-11 items-center gap-2 rounded-full bg-cyan-400 px-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <FileDown size={16} />
      {loading ? "Generating PDF..." : "Export PDF"}
    </button>
  );
}