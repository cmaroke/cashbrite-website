"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { isSensitivePath, sanitiseAnalyticsUrl } from "@/lib/analyticsPrivacy";
import { analyticsSettingsEvent, getAnalyticsChoice, saveAnalyticsChoice, subscribeAnalyticsChoice } from "@/lib/analyticsConsent";
import { funnelPaths } from "@/lib/funnelAnalytics";

export function PrivacySettingsButton() {
  return <button type="button" className="focus-ring min-h-11 rounded-sm hover:text-navy" onClick={() => window.dispatchEvent(new Event(analyticsSettingsEvent))}>Analytics preferences</button>;
}

export function SiteAnalytics() {
  const pathname = usePathname();
  const choice = useSyncExternalStore(subscribeAnalyticsChoice, getAnalyticsChoice, () => null);
  const [settings, setSettings] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const loaded = useRef(false);
  const allowed = process.env.NODE_ENV === "production" && choice === "granted" && (!isSensitivePath(pathname ?? "/") || funnelPaths.includes(pathname ?? ""));

  useEffect(() => {
    const open = () => setSettings(true);
    window.addEventListener(analyticsSettingsEvent, open);
    return () => window.removeEventListener(analyticsSettingsEvent, open);
  }, []);

  useEffect(() => {
    if (allowed) loaded.current = true;
    else if (loaded.current && choice !== "granted") window.location.reload();
  }, [allowed, choice]);

  // Keep optional scripts off sensitive destinations, including Next Link transitions.
  useEffect(() => {
    const navigate = (event: MouseEvent) => {
      if (!loaded.current || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element)?.closest("a");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      const url = new URL(anchor.href, location.href);
      if (url.origin === location.origin && isSensitivePath(url.pathname)) {
        event.preventDefault(); window.location.assign(url.href);
      }
    };
    document.addEventListener("click", navigate, true);
    return () => document.removeEventListener("click", navigate, true);
  }, []);

  function choose(value: "granted" | "denied") {
    saveAnalyticsChoice(value);
    setSettings(false); setDismissed(true);
  }

  return <>
    {allowed && <><GoogleAnalytics /><Analytics beforeSend={event => {
      if (getAnalyticsChoice() !== "granted") return null;
      if (event.type === "event" && funnelPaths.includes(location.pathname)) return { type: "event", url: location.origin + location.pathname };
      if (isSensitivePath(location.pathname)) return null;
      const url = sanitiseAnalyticsUrl(event.url);
      return url ? { ...event, url } : null;
    }} /></>}
    {(settings || (choice === null && !dismissed)) && <aside aria-label="Analytics preferences" className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-md border border-ink/25 bg-cream p-4 text-ink shadow-sm sm:p-5">
      <h2 className="font-display text-base font-semibold">Your analytics choice</h2>
      <p className="mt-2 text-sm leading-6">With your permission, optional analytics help us understand public-page use and anonymous steps through the assessment and report journey. We do not send your details, answers, score or private report link. <Link href="/privacy-policy#analytics" className="underline underline-offset-4">Privacy details</Link></p>
      <div className="mt-3 flex flex-wrap gap-3">
        <button type="button" onClick={() => choose("denied")} className="focus-ring min-h-11 rounded-sm border border-ink px-4 text-sm font-semibold">Reject analytics</button>
        <button type="button" onClick={() => choose("granted")} className="focus-ring min-h-11 rounded-sm border border-ink px-4 text-sm font-semibold">Allow analytics</button>
        {choice !== null && <button type="button" onClick={() => setSettings(false)} className="focus-ring min-h-11 px-3 text-sm underline">Keep current choice</button>}
      </div>
      <p role="status" className="mt-2 text-xs leading-5">{choice === "granted" ? "Analytics are currently allowed." : "Analytics are currently off."} Change this anytime using Analytics preferences in the footer.</p>
    </aside>}
  </>;
}
