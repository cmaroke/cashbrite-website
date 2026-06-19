import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { UnlockPlanButton } from "@/components/PremiumPlanCtas";
import { getAssessment, recordPremiumInterest } from "@/lib/assessmentDb";
import { generatePremiumActionPlan, getPremiumPreview } from "@/lib/premiumActionPlan";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your Money Ready Plan | Cashbrite",
  robots: { index: false, follow: false },
};

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const included = [
  ["Your Money Confidence Profile", "Understand your strengths and where to improve."],
  ["Your Top 3 Priority Areas", "Focus on the topics that can make the biggest difference."],
  ["Real-life Money Smart examples", "Learn through practical UK money situations."],
  ["30-Day Money Roadmap", "Build confidence through clear weekly actions."],
  ["Money Ready Checklist", "Prepare for budgeting, borrowing, payslips, renting and bills."],
  ["90-Day Progress Tracker", "Return to your priorities and measure your progress."],
] as const;

const trustSignals = [
  "Created by a banking professional",
  "Designed for UK young people",
  "Practical real-world money situations",
  "One payment. No subscription",
];

type RecoveryPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function MoneyReadyPlanRecoveryPage({ searchParams }: RecoveryPageProps) {
  const params = await searchParams;
  const assessmentId = readParam(params.assessmentId);
  const source = readParam(params.source);

  if (!assessmentId || !uuidPattern.test(assessmentId)) {
    return <RecoveryUnavailable message="This checkout link is incomplete or invalid." />;
  }

  let assessment;
  try {
    assessment = await getAssessment(assessmentId);
  } catch {
    return <RecoveryUnavailable message="We could not load your assessment right now. Please try again shortly." />;
  }

  if (!assessment) {
    return <RecoveryUnavailable message="We could not find the assessment linked to this email." />;
  }

  const tracking = [
    recordPremiumInterest({ assessmentId, interestType: "checkout_recovery_view" }),
  ];
  if (source === "email") {
    tracking.push(recordPremiumInterest({ assessmentId, interestType: "email_checkout_click" }));
  }
  await Promise.allSettled(tracking);

  const preview = getPremiumPreview(generatePremiumActionPlan(assessment.registration, assessment.scores));

  return (
    <main className="bg-cream py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-lg bg-navy text-white shadow-[0_24px_70px_rgba(7,29,43,0.2)]">
          <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
            <div className="p-6 sm:p-9 lg:p-11">
              <div className="flex items-center gap-3">
                <Image src="/brand/cashbrite-icon.svg" alt="" width={24} height={24} aria-hidden="true" />
                <p className="text-xs font-black uppercase tracking-[0.14em] text-mint">Your assessment, continued</p>
              </div>
              <h1 className="mt-5 max-w-2xl text-4xl font-black leading-tight sm:text-5xl">
                Your Personal Cashbrite Money Ready Plan
              </h1>
              <p className="mt-4 max-w-xl text-lg leading-8 text-white/75">
                Welcome back, {assessment.registration.firstName}. Your personalised roadmap is ready to unlock from
                the results you have already completed.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-[0.7fr_1.3fr]">
                <div className="border border-white/15 bg-white/10 p-5">
                  <p className="text-xs font-black uppercase tracking-[0.1em] text-mint">Your score</p>
                  <p className="mt-2 text-5xl font-black">{assessment.scores.readinessScore}<span className="text-xl text-mint">/100</span></p>
                </div>
                <div className="border border-white/15 bg-white/10 p-5">
                  <p className="text-xs font-black uppercase tracking-[0.1em] text-mint">Result band</p>
                  <p className="mt-2 text-2xl font-black leading-8">{assessment.scores.band}</p>
                </div>
              </div>

              <div className="mt-8">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-mint">Your top 3 priority areas</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  {preview.priorityAreas.map((area, index) => (
                    <article key={area.category} className="border border-white/15 bg-white/10 p-4">
                      <p className="text-xs font-black text-mint">0{index + 1}</p>
                      <h2 className="mt-2 font-black leading-6">{area.title}</h2>
                    </article>
                  ))}
                </div>
              </div>
            </div>

            <aside className="bg-white p-6 text-navy sm:p-9 lg:p-11">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-sea">Launch Offer</p>
              <div className="mt-3 flex items-end gap-3">
                <p className="text-6xl font-black leading-none">£19</p>
                <p className="pb-1 text-sm font-bold text-navy/60">One-off payment</p>
              </div>
              <p className="mt-3 text-sm font-bold text-navy/65">No subscription. Secure checkout with Stripe.</p>

              <h2 className="mt-8 text-2xl font-black">What your plan includes</h2>
              <div className="mt-4 grid gap-3">
                {included.map(([title, description]) => (
                  <article key={title} className="flex gap-3 border-b border-navy/10 pb-3 last:border-0">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-mint text-sm font-black text-navy" aria-hidden="true">&#10003;</span>
                    <div>
                      <h3 className="font-black">{title}</h3>
                      <p className="mt-1 text-sm leading-5 text-navy/65">{description}</p>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-7">
                <UnlockPlanButton assessmentId={assessment.id} label="Continue to Secure Checkout" />
              </div>
            </aside>
          </div>
        </section>

        <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {trustSignals.map((signal) => (
            <div key={signal} className="flex items-center gap-3 border border-navy/10 bg-white px-4 py-4 shadow-[0_8px_25px_rgba(7,29,43,0.04)]">
              <Image src="/brand/cashbrite-icon.svg" alt="" width={20} height={20} aria-hidden="true" />
              <p className="text-sm font-black leading-5 text-navy">{signal}</p>
            </div>
          ))}
        </section>

        <p className="mt-7 text-center text-sm text-navy/60">
          Want to review your free assessment first? <Link href={`/results?id=${assessment.id}`} className="font-black text-sea underline underline-offset-4">Return to your results</Link>
        </p>
      </div>
    </main>
  );
}

function RecoveryUnavailable({ message }: { message: string }) {
  return (
    <main className="bg-cream py-20">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
        <section className="border border-navy/10 bg-white p-8 shadow-soft">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-sea">Money Ready Plan</p>
          <h1 className="mt-3 text-3xl font-black text-navy">We cannot open this checkout page yet</h1>
          <p className="mt-4 text-lg leading-8 text-navy/70">{message}</p>
          <Link href="/quiz" className="focus-ring mt-6 inline-flex rounded-full bg-navy px-6 py-3 font-black text-white">Take the assessment</Link>
        </section>
      </div>
    </main>
  );
}

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
