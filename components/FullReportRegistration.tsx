"use client";
import { type FormEvent, useRef, useState } from "react";
import Link from "next/link";
import { referralSources } from "@/lib/assessmentTypes";
import { clearAssessmentDraft } from "@/lib/assessmentDraft";
import { trackFunnel } from "@/lib/funnelAnalytics";

const requestStorage = "cashbrite:report-request:v1";
function reportKey() {
  try {
    const stored = JSON.parse(sessionStorage.getItem(requestStorage) ?? "null");
    if (/^[a-f0-9]{64}$/.test(stored?.key) && Date.now() - stored.at < 86400000) return stored.key as string;
  } catch { /* Generate a fresh, non-personal access credential. */ }
  const key = Array.from(crypto.getRandomValues(new Uint8Array(32)), byte => byte.toString(16).padStart(2, "0")).join("");
  sessionStorage.setItem(requestStorage, JSON.stringify({ key, at: Date.now() }));
  return key;
}

export function FullReportRegistration({ answers }: { answers: Record<string, string> }) {
  const busy = useRef(false);
  const credential = useRef<string | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    busy.current = true; setPending(true); setError("");
    const fields = new FormData(event.currentTarget);
    const [firstName, ...rest] = String(fields.get("fullName") ?? "").trim().split(/\s+/);
    try {
      credential.current ??= reportKey();
      const response = await fetch("/api/assessments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        reportKey: credential.current, selectedAnswers: answers,
        registration: { firstName, lastName: rest.join(" "), age: Number(fields.get("age")), email: fields.get("email"), educationStage: "", referralSource: fields.get("referralSource") ?? "", reportConsent: fields.get("reportConsent") === "on", marketingConsent: fields.get("marketingConsent") === "on" },
      }) });
      const result = await response.json();
      if (!response.ok || result.reportUrl !== "/report") throw new Error(result.error ?? "We could not prepare your report. Please try again.");
      trackFunnel("registration_completed");
      clearAssessmentDraft(); sessionStorage.removeItem(requestStorage);
      window.location.assign("/report");
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "We could not prepare your report. Keep this page open and try again.");
      busy.current = false; setPending(false);
    }
  }
  const input = "focus-ring min-h-12 rounded-md border border-ink/55 bg-cream/35 px-4 py-3 text-base font-normal";
  return <form onSubmit={submit} aria-labelledby="registration-title" className="mt-6 rounded-md border border-ink/20 bg-white p-5 sm:p-6">
    <h3 id="registration-title" className="font-display text-xl font-semibold">Where should we send your full report?</h3>
    <p className="mt-3 text-sm leading-6 text-ink/75">Your report opens immediately after registration. We also attempt to email your PDF and private access link. No payment is needed.</p>
    <div className="mt-5 grid gap-5 sm:grid-cols-2">
      <label className="grid gap-2 text-sm font-semibold">Full name<input className={input} name="fullName" autoComplete="name" maxLength={200} required /></label>
      <label className="grid gap-2 text-sm font-semibold">Age<input className={input} name="age" type="number" min={13} max={100} required /></label>
      <label className="grid gap-2 text-sm font-semibold sm:col-span-2">Email address<input className={input} name="email" type="email" autoComplete="email" maxLength={254} required /></label>
      <label className="grid gap-2 text-sm font-semibold sm:col-span-2">How did you hear about Cashbrite? (optional)<select className={input} name="referralSource" defaultValue=""><option value="">Prefer not to say</option>{referralSources.map(source => <option key={source}>{source}</option>)}</select></label>
    </div>
    <div className="mt-5 space-y-3 text-sm leading-6">
      <label className="flex items-start gap-3"><input className="focus-ring mt-1 h-4 w-4 shrink-0 accent-ink" name="reportConsent" type="checkbox" required /><span>I agree that Cashbrite may use my details to create and email my personalised report.</span></label>
      <label className="flex items-start gap-3"><input className="focus-ring mt-1 h-4 w-4 shrink-0 accent-ink" name="marketingConsent" type="checkbox" /><span>I would also like occasional Cashbrite updates and resources (optional). I can change my mind at any time.</span></label>
      <p className="text-xs text-ink/70">Please read our <Link href="/privacy-policy" className="underline">Privacy Policy</Link> and <Link href="/terms-and-conditions" className="underline">Terms &amp; Conditions</Link>. Marketing is not required for access. If you are under 18, you can ask a trusted adult to help you understand how your details will be used. Please do not enter bank details or account numbers.</p>
    </div>
    {error && <p role="alert" className="mt-4 border-l-2 border-ink bg-mist p-3 text-sm leading-6">{error}</p>}
    <button type="submit" disabled={pending} className="focus-ring mt-5 inline-flex min-h-12 items-center justify-center rounded-md bg-lime px-6 py-3 font-semibold text-ink disabled:opacity-60">{pending ? "Preparing your full report..." : "Get My Full Report"}</button>
  </form>;
}
