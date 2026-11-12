import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { PremiumReport } from "@/components/PremiumReport";
import { getRegisteredReport, reportCookieName } from "@/lib/reportAccess";
import { FunnelEvent } from "@/components/FunnelEvent";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your Cashbrite Personalised Money Action Plan", robots: { index: false, follow: false }, referrer: "no-referrer" };
export default async function ReportPage() {
  let assessment;
  try { assessment = await getRegisteredReport((await cookies()).get(reportCookieName)?.value ?? ""); } catch { assessment = null; }
  if (!assessment) return <section className="bg-cream section-space"><div className="mx-auto max-w-workflow px-5 sm:px-8"><h1 className="editorial-heading text-4xl">Your report link is needed</h1><p className="mt-4 leading-7">Use the private link in your report email, or complete the assessment and choose Get My Full Report. If your email has not arrived, contact Cashbrite for help. Please do not share your private link.</p><Link href="/quiz" className="focus-ring mt-6 inline-flex rounded-md bg-lime px-6 py-3 font-semibold">Start assessment</Link><Link href="/contact" className="focus-ring ml-5 underline">Contact Cashbrite</Link></div></section>;
  return <><FunnelEvent name="full_report_generated" /><section className="no-print bg-mint/25 py-5"><div className="mx-auto max-w-report px-5 sm:px-8"><p className="font-semibold text-sea">Your full report is ready</p><h1 className="mt-2 font-display text-2xl font-semibold">Your Cashbrite Personalised Money Action Plan</h1><p className="mt-2 text-sm leading-6">Use your report and downloads now. We also attempt to email your PDF and private access link; email delays do not affect access here. Keep the email link private.</p></div></section><PremiumReport assessment={assessment} registeredAccess /></>;
}
