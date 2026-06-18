"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

async function recordInterest(assessmentId: string, interestType: "preview" | "unlock") {
  await fetch("/api/premium-interest", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ assessmentId, interestType }),
  });
}

export function PreviewPlanLink({ assessmentId }: { assessmentId: string }) {
  const router = useRouter();
  const [isOpening, setIsOpening] = useState(false);

  async function openPreview() {
    if (isOpening) return;
    setIsOpening(true);

    try {
      await recordInterest(assessmentId, "preview");
    } catch {
      // Interest tracking must never prevent access to the preview.
    }

    router.push(`/money-ready-plan?id=${encodeURIComponent(assessmentId)}`);
  }

  return (
    <button
      type="button"
      onClick={openPreview}
      disabled={isOpening}
      className="focus-ring inline-flex min-h-12 items-center justify-center rounded-full bg-mint px-6 py-3.5 font-black text-navy shadow-[0_14px_30px_rgba(185,234,216,0.18)] transition hover:-translate-y-0.5 hover:bg-[#a7dfcd] disabled:cursor-wait disabled:opacity-70"
    >
      {isOpening ? "Opening your preview..." : "Preview my Money Ready Plan"}
    </button>
  );
}

export function UnlockPlanButton({ assessmentId }: { assessmentId: string }) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function showComingSoon() {
    if (isSubmitting || message) return;
    setIsSubmitting(true);

    try {
      await recordInterest(assessmentId, "unlock");
    } catch {
      // The launch message remains useful even if optional tracking is unavailable.
    }

    setMessage("Payments are coming soon. Your interest has been noted, and your free report remains available.");
    setIsSubmitting(false);
  }

  return (
    <div>
      <button
        type="button"
        onClick={showComingSoon}
        disabled={isSubmitting}
        className="focus-ring inline-flex min-h-12 w-full items-center justify-center rounded-full bg-mint px-7 py-4 text-lg font-black text-navy shadow-[0_16px_34px_rgba(185,234,216,0.18)] transition hover:-translate-y-0.5 hover:bg-[#a7dfcd] disabled:cursor-wait disabled:opacity-70 sm:w-auto"
      >
        {isSubmitting ? "Saving your interest..." : "Unlock my Money Ready Plan"}
      </button>
      <p className="mt-3 min-h-6 text-sm font-semibold leading-6 text-white/72" aria-live="polite">
        {message || "No payment will be taken. Secure payments are coming soon."}
      </p>
    </div>
  );
}
