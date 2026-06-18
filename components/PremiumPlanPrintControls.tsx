"use client";

export function PremiumPlanPrintControls() {
  return (
    <div className="no-print flex flex-col gap-3 sm:flex-row">
      <button
        type="button"
        onClick={() => window.print()}
        className="focus-ring inline-flex min-h-12 items-center justify-center rounded-full bg-mint px-6 py-3 font-black text-navy transition hover:bg-[#a7dfcd]"
      >
        Print or save as PDF
      </button>
      <button
        type="button"
        disabled
        className="inline-flex min-h-12 cursor-not-allowed items-center justify-center rounded-full border border-white/20 px-6 py-3 font-black text-white/55"
      >
        Download PDF coming soon
      </button>
    </div>
  );
}
