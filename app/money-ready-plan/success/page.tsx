import type { Metadata } from "next";
import Link from "next/link";
import PremiumPlanPreviewPage from "@/app/premium-plan-preview/page";
import { getAssessment } from "@/lib/assessmentDb";
import { getStripe, moneyReadyPlanProduct } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your Money Ready Plan | Cashbrite",
  robots: { index: false, follow: false },
};

type SuccessPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

type PremiumAccessResult =
  | { ok: true; assessmentId: string; firstName: string }
  | { ok: false; error: string };

export default async function MoneyReadyPlanSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const sessionId = readParam(params.session_id);

  if (!sessionId || !/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) {
    return <AccessUnavailable message="This access link is incomplete. Please use the link in your purchase email." />;
  }

  const access = await verifyPremiumAccess(sessionId);
  if (!access.ok) {
    return <AccessUnavailable message={access.error} />;
  }

  const internalPreviewKey = process.env.PREMIUM_PLAN_PREVIEW_KEY ?? process.env.STRIPE_SECRET_KEY;
  if (!internalPreviewKey) {
    return <AccessUnavailable message="Premium plan access is not configured yet." />;
  }

  return (
    <>
      <section className="no-print bg-mint/25 py-5">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 sm:px-6">
          <p className="text-sm font-black uppercase tracking-[0.12em] text-sea">Payment confirmed</p>
          <h1 className="text-2xl font-black text-navy">Your Cashbrite Money Ready Plan is unlocked</h1>
          <p className="text-sm leading-6 text-navy/70">
            Thank you, {access.firstName}. Keep this secure page or your confirmation email so you can return to your
            plan.
          </p>
        </div>
      </section>
      {await PremiumPlanPreviewPage({
        searchParams: Promise.resolve({ id: access.assessmentId, key: internalPreviewKey }),
      })}
    </>
  );
}

async function verifyPremiumAccess(sessionId: string): Promise<PremiumAccessResult> {
  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    const assessmentId = session.metadata?.assessment_id;

    if (
      session.status !== "complete" ||
      session.payment_status !== "paid" ||
      session.metadata?.product !== moneyReadyPlanProduct ||
      !assessmentId
    ) {
      return {
        ok: false,
        error: "Your payment has not been confirmed yet. Please complete checkout or try again shortly.",
      };
    }

    const assessment = await getAssessment(assessmentId);
    if (!assessment) {
      return { ok: false, error: "We could not find the assessment linked to this purchase." };
    }

    return { ok: true, assessmentId, firstName: assessment.registration.firstName };
  } catch {
    return { ok: false, error: "We could not verify this purchase. Please try your confirmation link again." };
  }
}

function AccessUnavailable({ message }: { message: string }) {
  return (
    <section className="bg-cream py-20">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
        <div className="rounded-lg border border-navy/10 bg-white p-8 shadow-soft">
          <p className="text-sm font-black uppercase tracking-[0.12em] text-sea">Money Ready Plan</p>
          <h1 className="mt-3 text-3xl font-black text-navy">We cannot unlock this plan yet</h1>
          <p className="mt-4 text-lg leading-8 text-navy/70">{message}</p>
          <Link href="/contact" className="focus-ring mt-6 inline-flex rounded-full bg-navy px-6 py-3 font-black text-white">
            Contact Cashbrite
          </Link>
        </div>
      </div>
    </section>
  );
}

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
