import Image from "next/image";
import Link from "next/link";
import { UnlockPlanButton } from "@/components/PremiumPlanCtas";
import { categoryLabels, type QuizCategory } from "@/data/quizQuestions";
import { getAssessment } from "@/lib/assessmentDb";

export const dynamic = "force-dynamic";

const premiumBenefits = [
  {
    title: "What to improve first",
    description: "A clear order of focus based on your quiz answers.",
  },
  {
    title: "Mistakes to avoid",
    description: "The biggest money traps linked to your weakest areas.",
  },
  {
    title: "Tailored action steps",
    description: "Practical next moves built around your results.",
  },
  {
    title: "30-day confidence plan",
    description: "A simple roadmap to build stronger money habits.",
  },
  {
    title: "Matched resources",
    description: "Guidance connected to the areas that need most work.",
  },
];

const premiumTrustSignals = [
  "Created by a banking professional",
  "Designed for UK young people preparing for adult life",
  "Practical real-world money situations",
  "No subscription. One simple payment",
];

const categoryOrder = Object.keys(categoryLabels) as QuizCategory[];

type ResultsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  const params = await searchParams;
  const idParam = params.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;

  if (!id) {
    return <ResultsUnavailable message="Start the assessment first so Cashbrite can generate your Money Action Plan." />;
  }

  let assessment;
  try {
    assessment = await getAssessment(id);
  } catch {
    return <ResultsUnavailable message="The results page is not connected to assessment storage yet." />;
  }

  if (!assessment) {
    return <ResultsUnavailable message="We could not find that Money Action Plan. Please retake the assessment." />;
  }

  const scores = assessment.scores;
  const actionPlan = assessment.actionPlan;
  const categoryResults = categoryOrder.map((category) => ({
    category,
    name: categoryLabels[category],
    percentage: scores.categoryScores[category]?.percentage ?? 0,
  }));
  const improvementCategories = [...categoryResults].sort((a, b) => a.percentage - b.percentage).slice(0, 3);

  return (
    <section className="bg-cream py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 rounded-lg bg-navy p-6 text-white shadow-soft sm:p-8 md:grid-cols-[0.72fr_1fr] md:items-center">
          <div className="rounded-lg border border-white/10 bg-white/8 p-6 text-center">
            <p className="text-sm font-black uppercase tracking-[0.14em] text-mint">Money Readiness Score</p>
            <p className="mt-3 text-6xl font-black leading-none text-white">{scores.readinessScore}</p>
            <p className="mt-2 text-lg font-black text-mint">out of 100</p>
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.14em] text-mint">Your Cashbrite report</p>
            <h1 className="mt-3 text-4xl font-black sm:text-5xl">{scores.band}</h1>
            <p className="mt-2 text-base font-black text-mint">Your money confidence band</p>
            <p className="mt-4 text-lg leading-8 text-white/78">{actionPlan.summary}</p>
            <p className="mt-3 text-sm leading-6 text-white/62">
              A copy has been sent to {assessment.registration.email} if email delivery is configured.
            </p>
          </div>
        </div>

        <section className="mt-7 rounded-lg border border-navy/10 bg-white p-6 shadow-soft sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.14em] text-sea">Your Top Priority Areas</p>
          <h2 className="mt-2 text-3xl font-black text-navy">Your Top Priority Areas</h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-navy/68">
            These are the money areas your answers suggest would make the biggest difference to work on first.
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {improvementCategories.map((area, index) => (
              <article key={area.category} className="rounded-md border border-navy/10 bg-cream p-5">
                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-black text-white">
                    {index + 1}
                  </span>
                  <h3 className="text-xl font-black leading-7 text-navy">{area.name}</h3>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="relative mt-3 overflow-hidden rounded-lg bg-navy p-6 text-white shadow-[0_24px_70px_rgba(7,29,43,0.2)] sm:p-9 lg:p-11">
          <div className="flex flex-wrap items-center gap-3">
            <Image src="/brand/cashbrite-icon.svg" alt="" width={24} height={24} aria-hidden="true" />
            <p className="text-sm font-black uppercase tracking-[0.14em] text-mint">Cashbrite Money Ready Plan</p>
            <span className="rounded-full border border-mint/25 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-mint">
              Personalised
            </span>
          </div>

          <h2 className="mt-5 max-w-3xl text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
            Unlock Your Personal Money Ready Plan
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-white/75">
            Get a personalised roadmap built from your quiz answers.
          </p>

          <div className="mt-7 grid gap-9 xl:grid-cols-[1.15fr_0.85fr] xl:items-start">
            <div className="order-2 xl:order-1">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.12em] text-mint">What&apos;s included</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {premiumBenefits.map((benefit) => (
                    <article key={benefit.title} className="flex gap-4 rounded-md border border-white/15 bg-white/10 p-4">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mint/15" aria-hidden="true">
                        <Image src="/brand/cashbrite-icon.svg" alt="" width={18} height={18} />
                      </span>
                      <div>
                        <h3 className="font-black leading-6 text-white">{benefit.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-white/65">{benefit.description}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>

            <div className="order-1 grid gap-5 sm:grid-cols-2 xl:order-2 xl:grid-cols-1">
              <div className="order-2 rounded-lg bg-cream p-4 text-navy shadow-[0_22px_55px_rgba(0,0,0,0.22)] sm:p-5">
                <div className="overflow-hidden rounded-md border border-navy/10 bg-white">
                  <div className="bg-navy p-5">
                    <Image
                      src="/brand/cashbrite-logo-white.svg"
                      alt="Cashbrite"
                      width={150}
                      height={38}
                      className="h-auto w-32"
                    />
                    <p className="mt-8 text-xs font-black uppercase tracking-[0.12em] text-mint">Prepared for</p>
                    <p className="mt-1 text-xl font-black text-white">{assessment.registration.firstName}</p>
                    <h3 className="mt-6 text-2xl font-black leading-tight text-white">Your Money Ready Plan</h3>
                    <div className="mt-5 inline-flex items-end gap-2 rounded-md bg-mint px-4 py-3 text-navy">
                      <span className="text-3xl font-black leading-none">{scores.readinessScore}</span>
                      <span className="pb-0.5 text-sm font-black">/100</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-sea">Money Smart Tip</p>
                    <p className="mt-2 text-sm font-bold leading-6 text-navy">
                      Small, consistent money habits can make a bigger difference than one perfect decision.
                    </p>
                    <div className="relative mt-5 overflow-hidden rounded-md bg-cream p-4">
                      <div className="space-y-2 opacity-25 blur-[2px]" aria-hidden="true">
                        <div className="h-2 w-4/5 rounded-full bg-navy" />
                        <div className="h-2 w-full rounded-full bg-sea" />
                        <div className="h-2 w-3/5 rounded-full bg-navy" />
                      </div>
                      <p className="absolute inset-0 flex items-center justify-center px-4 text-center text-xs font-black text-navy">
                        Unlock to access your full personalised plan
                      </p>
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-center text-xs font-bold text-navy/60">A practical workbook built from your answers</p>
              </div>

              <div className="order-1 rounded-lg border border-mint/25 bg-white p-6 text-navy shadow-[0_22px_55px_rgba(0,0,0,0.18)] sm:p-7">
                <p className="text-sm font-black uppercase tracking-[0.12em] text-sea">£19 Launch Offer</p>
                <div className="mt-3 flex items-end gap-3">
                  <p className="text-6xl font-black leading-none text-navy">£19</p>
                  <p className="pb-1 text-sm font-bold text-navy/60">
                    Future price: <span className="line-through">£39</span>
                  </p>
                </div>
                <p className="mt-4 border-t border-navy/10 pt-4 text-sm font-bold text-navy/70">
                  One-off payment. No subscription.
                </p>
                <div className="mt-5">
                  <UnlockPlanButton assessmentId={assessment.id} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-9 border-t border-white/15 pt-6">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-mint">Made to build real confidence</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {premiumTrustSignals.map((signal) => (
                <div key={signal} className="flex items-center gap-3 rounded-md bg-white/10 px-4 py-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-mint" aria-hidden="true">
                    <span className="text-sm font-black text-navy">&#10003;</span>
                  </span>
                  <p className="text-sm font-bold leading-5 text-white/80">{signal}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </section>
  );
}

function ResultsUnavailable({ message }: { message: string }) {
  return (
    <section className="bg-cream py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-navy/10 bg-white p-8 text-center shadow-soft">
          <p className="text-sm font-black uppercase tracking-[0.14em] text-sea">Money Action Plan</p>
          <h1 className="mt-3 text-3xl font-black text-navy">Your report is not available yet</h1>
          <p className="mt-4 text-lg leading-8 text-navy/72">{message}</p>
          <Link
            href="/quiz"
            className="focus-ring mt-6 inline-flex justify-center rounded-full bg-navy px-5 py-3 font-black text-white"
          >
            Start assessment
          </Link>
        </div>
      </div>
    </section>
  );
}
