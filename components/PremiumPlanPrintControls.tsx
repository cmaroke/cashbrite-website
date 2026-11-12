"use client";
import { useState } from "react";
import { trackFunnel } from "@/lib/funnelAnalytics";

type PremiumPlanPrintControlsProps = {
  budgetTrackerUrl?: string;
  downloadUrl?: string;
  registeredAccess?: boolean;
};

export function PremiumPlanPrintControls({ budgetTrackerUrl, downloadUrl, registeredAccess = false }: PremiumPlanPrintControlsProps) {
  const [error, setError] = useState("");
  async function download(event: React.MouseEvent<HTMLAnchorElement>, filename: string) {
    if (!registeredAccess) return;
    event.preventDefault();
    const url = event.currentTarget.href;
    setError("");
    try {
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) throw new Error("unavailable");
      const href = URL.createObjectURL(await response.blob());
      const suppliedName = response.headers.get("content-disposition")?.match(/filename="([^"]+)"/)?.[1];
      const link = document.createElement("a"); link.href = href; link.download = suppliedName ?? filename; link.click();
      setTimeout(() => URL.revokeObjectURL(href), 30000);
      trackFunnel("full_report_downloaded");
    } catch { setError("Your download is temporarily unavailable. Please try again shortly; your online report remains available."); }
  }
  return (
    <div className="no-print flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <button
        type="button"
        onClick={() => window.print()}
        className="focus-ring inline-flex min-h-12 items-center justify-center rounded-md bg-mint px-6 py-3 font-semibold text-navy transition hover:bg-lime/85"
      >
        Print Action Plan
      </button>
      {downloadUrl ? (
        <a
          href={downloadUrl}
          onClick={event => void download(event, "Cashbrite-Money-Ready-Plan.pdf")}
          className="focus-ring inline-flex min-h-12 items-center justify-center rounded-md bg-navy px-6 py-3 font-semibold text-white transition hover:bg-ink/90"
        >
          Download Action Plan PDF
        </a>
      ) : (
        <button
          type="button"
          disabled
          className="inline-flex min-h-12 cursor-not-allowed items-center justify-center rounded-md border border-ink/40 px-6 py-3 font-semibold text-navy/45"
        >
          Download available in your full report
        </button>
      )}
      {budgetTrackerUrl ? (
        <a
          href={budgetTrackerUrl}
          onClick={event => void download(event, "Cashbrite-Budget-Tracker.xlsx")}
          download
          className="focus-ring inline-flex min-h-12 items-center justify-center rounded-md border border-sea/25 bg-white px-6 py-3 font-semibold text-navy transition hover:border-sea hover:bg-mint/30"
        >
          Download Budget Tracker
        </a>
      ) : null}
      {error && <p role="alert" className="w-full text-sm">{error}</p>}
    </div>
  );
}
