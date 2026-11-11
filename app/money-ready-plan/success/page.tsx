import type { Metadata } from "next";
import Link from "next/link";
import { PremiumReport } from "@/components/PremiumReport";
import { verifyPaidPurchase } from "@/lib/verifiedPurchase";
import { findSessionPurchase } from "@/lib/premiumPurchaseDb";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your Cashbrite Personalised Money Action Plan | Cashbrite", robots: { index: false, follow: false }, referrer: "no-referrer" };
export default async function SuccessPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const sessionId = typeof params.session_id === "string" ? params.session_id : "";
  let verified;
  try { verified = await verifyPaidPurchase(sessionId); }
  catch {
    return <section className="bg-cream section-space"><div className="mx-auto max-w-2xl px-5 text-center">
      <h1 className="editorial-heading text-4xl">We cannot verify this access link yet</h1>
      <p className="mt-4 leading-7">Use your original confirmation link or try again shortly. If you have already paid, do not pay again.</p>
      <Link className="focus-ring mt-6 inline-flex rounded-md bg-navy px-6 py-3 text-white" href="/contact">Contact Cashbrite</Link>
    </div></section>;
  }
  const purchase = await findSessionPurchase(sessionId).catch(() => null);
  const deliveryMessage = purchase?.delivery_status === "sent"
    ? "Your confirmation email has been accepted by our email provider. Check your inbox and spam folder; inbox delivery is not guaranteed."
    : purchase?.delivery_status === "needs_review"
      ? "Your email delivery needs a support check. Your paid plan and downloads remain available here. Contact Cashbrite if you need help."
      : "Your email confirmation is not yet confirmed as sent. Keep this private link; you can use your downloads now without waiting for email.";
  return <>
    <section className="no-print bg-mint/25 py-5"><div className="mx-auto max-w-5xl px-5 sm:px-8">
      <p className="text-sm font-semibold text-sea">Payment confirmed</p>
      <h1 className="mt-2 text-2xl font-semibold">Your Cashbrite Personalised Money Action Plan is unlocked</h1>
      <p className="mt-2 text-sm leading-6">{deliveryMessage} No further payment is needed.</p>
    </div></section>
    <PremiumReport assessment={verified.assessment} downloadSessionId={sessionId} />
  </>;
}
