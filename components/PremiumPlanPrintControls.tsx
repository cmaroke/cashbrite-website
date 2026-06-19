"use client";

export function PremiumPlanPrintControls({ downloadUrl }: { downloadUrl?: string }) {
  return (
    <div className="no-print flex flex-col gap-3 sm:flex-row">
      <button
        type="button"
        onClick={() => window.print()}
        className="focus-ring inline-flex min-h-12 items-center justify-center rounded-full bg-mint px-6 py-3 font-black text-navy transition hover:bg-[#a7dfcd]"
      >
        Print or save as PDF
      </button>
      {downloadUrl ? (
        <a
          href={downloadUrl}
          className="focus-ring inline-flex min-h-12 items-center justify-center rounded-full bg-navy px-6 py-3 font-black text-white transition hover:bg-[#12354a]"
        >
          Download PDF
        </a>
      ) : (
        <button
          type="button"
          disabled
          className="inline-flex min-h-12 cursor-not-allowed items-center justify-center rounded-full border border-navy/15 px-6 py-3 font-black text-navy/45"
        >
          Download available after purchase
        </button>
      )}
    </div>
  );
}
