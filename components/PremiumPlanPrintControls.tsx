"use client";

type PremiumPlanPrintControlsProps = {
  budgetTrackerUrl?: string;
  downloadUrl?: string;
};

export function PremiumPlanPrintControls({ budgetTrackerUrl, downloadUrl }: PremiumPlanPrintControlsProps) {
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
          Download available after purchase
        </button>
      )}
      {budgetTrackerUrl ? (
        <a
          href={budgetTrackerUrl}
          download
          className="focus-ring inline-flex min-h-12 items-center justify-center rounded-md border border-sea/25 bg-white px-6 py-3 font-semibold text-navy transition hover:border-sea hover:bg-mint/30"
        >
          Download Budget Tracker
        </a>
      ) : null}
    </div>
  );
}
