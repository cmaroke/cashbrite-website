"use client";
import { track } from "@vercel/analytics";
import { getAnalyticsChoice } from "@/lib/analyticsConsent";
export const funnelEvents = ["assessment_started", "assessment_completed", "basic_results_viewed", "full_report_clicked", "registration_completed", "full_report_generated", "full_report_downloaded"] as const;
export type FunnelEventName = typeof funnelEvents[number];
export const funnelPaths = ["/quiz", "/results", "/report"];
export function trackFunnel(name: FunnelEventName) {
  if (process.env.NODE_ENV !== "production" || getAnalyticsChoice() !== "granted" || !funnelEvents.includes(name)) return;
  // Fixed event names only: never pass identity, answers, scores, keys or URLs as properties.
  try { track(name); } catch { /* Optional analytics must never interrupt the assessment. */ }
}
