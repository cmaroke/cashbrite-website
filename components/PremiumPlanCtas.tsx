"use client";

import { useState } from "react";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function createCheckout(assessmentId: string) {
  if (!uuidPattern.test(assessmentId)) {
    throw new Error("This assessment link is invalid. Please return to your results and try again.");
  }

  const response = await fetch("/api/stripe/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ assessmentId }),
    cache: "no-store",
  });

  const contentType = response.headers.get("content-type") ?? "";
  const result = contentType.includes("application/json")
    ? ((await response.json()) as { checkoutUrl?: string; error?: string })
    : { error: "The checkout service returned an unexpected response." };

  if (!response.ok || !result.checkoutUrl) {
    const error = result.error ?? "Checkout could not be started.";
    console.error("Cashbrite Checkout request failed", {
      status: response.status,
      statusText: response.statusText,
      error,
    });
    throw new Error(error);
  }

  const checkoutUrl = new URL(result.checkoutUrl);
  if (checkoutUrl.protocol !== "https:") {
    throw new Error("Stripe returned an invalid Checkout URL.");
  }

  return checkoutUrl.toString();
}

export function UnlockPlanButton({ assessmentId }: { assessmentId: string }) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function startCheckout() {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setMessage("");

    try {
      const checkoutUrl = await createCheckout(assessmentId);
      window.location.assign(checkoutUrl);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Checkout could not be started. Please try again.";
      console.error("Cashbrite Checkout could not be opened", error);
      setMessage(message);
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={startCheckout}
        disabled={isSubmitting}
        className="focus-ring inline-flex min-h-12 w-full items-center justify-center rounded-full bg-mint px-6 py-4 text-center text-base font-black leading-6 text-navy shadow-[0_16px_34px_rgba(185,234,216,0.18)] transition hover:-translate-y-0.5 hover:bg-[#a7dfcd] disabled:cursor-wait disabled:opacity-70 sm:text-lg"
      >
        {isSubmitting ? "Opening secure checkout..." : "Unlock My £19 Money Ready Plan"}
      </button>
      <p
        className={`mt-3 min-h-6 text-sm font-semibold leading-6 ${message ? "text-[#a43f47]" : "text-navy/70"}`}
        role={message ? "alert" : undefined}
        aria-live="polite"
      >
        {message || "Secure one-off payment with Stripe. No subscription."}
      </p>
    </div>
  );
}
