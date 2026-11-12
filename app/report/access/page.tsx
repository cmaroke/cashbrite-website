"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function ReportAccessPage() {
  const started = useRef(false);
  const token = useRef("");
  const [error, setError] = useState("");
  async function open() {
    setError("");
    try {
      const response = await fetch("/api/reports/access", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token: token.current }) });
      const result = await response.json();
      if (!response.ok || result.reportUrl !== "/report") throw new Error(result.error ?? "Your report link is unavailable.");
      window.location.replace("/report");
    } catch (failure) { setError(failure instanceof Error ? failure.message : "Please try your report link again."); }
  }
  useEffect(() => {
    if (started.current) return;
    token.current ||= new URLSearchParams(location.hash.slice(1)).get("token") ?? "";
    // The fragment never reaches server access logs. Clear it before exchanging the key.
    history.replaceState(null, "", "/report/access");
    const frame = requestAnimationFrame(() => { started.current = true; void open(); });
    return () => cancelAnimationFrame(frame);
  }, []);
  return <section className="bg-cream section-space"><div className="mx-auto max-w-workflow px-5 sm:px-8"><h1 className="editorial-heading text-4xl">Opening your full report</h1>{error ? <><p role="alert" className="mt-4 leading-7">{error}</p><button className="focus-ring mt-5 rounded-md bg-lime px-6 py-3 font-semibold" onClick={() => void open()}>Try again</button><Link className="focus-ring ml-5 underline" href="/contact">Contact Cashbrite</Link></> : <p role="status" className="mt-4">Checking your private link...</p>}</div></section>;
}
