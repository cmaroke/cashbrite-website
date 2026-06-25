import Image from "next/image";
import Link from "next/link";
import { UnlockPlanButton } from "@/components/PremiumPlanCtas";
import { categoryLabels, type QuizCategory } from "@/data/quizQuestions";
import { getAssessment } from "@/lib/assessmentDb";

export const dynamic = "force-dynamic";

const premiumBenefits = [
  "Personal Money Confidence Profile",
  "Your Top 3 Priority Areas & Action Plan",
  "30-Day Challenge + 90-Day Progress Tracker",
  "Bonus Cashbrite Budget Tracker",
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
    <section className="bg-cream py-8 sm:py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <section className="grid gap-5 rounded-lg bg-navy p-5 text-white shadow-soft sm:p-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-stretch">
          <div className="grid gap-5 sm:grid-cols-[0.55fr_1fr] sm:items-center">
            <div className="rounded-lg border border-white/10 bg-white/8 p-5 text-center">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-mint">Cashbrite Score</p>
              <p className="mt-3 text-6xl font-black leading-none text-white">{scores.readinessScore}</p>
              <p className="mt-2 text-base font-black text-mint">out of 100</p>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-mint">Your money confidence band</p>
              <h1 className="mt-2 text-3xl font-black leading-tight sm:text-4xl">{scores.band}</h1>
              <p className="mt-3 text-base leading-7 text-white/78">{actionPlan.summary}</p>
            </div>
          </div>

          <div className="rounded-lg border border-white/12 bg-white p-5 text-navy sm:p-6">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-sea">Your Top Priority Areas</p>
            <h2 className="mt-2 text-2xl font-black text-navy">Focus here first</h2>
            <p className="mt-2 text-sm leading-6 text-navy/68">
              These are the money areas your answers suggest would make the biggest difference to work on first.
            </p>
            <div className="mt-4 grid gap-3">
              {improvementCategories.map((area, index) => (
                <article key={area.category} className="flex items-center gap-3 rounded-md bg-cream p-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-black text-white">
                    {index + 1}
                  </span>
                  <h3 className="text-base font-black leading-6 text-navy">{area.name}</h3>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative mt-4 overflow-hidden rounded-lg bg-navy p-6 text-white shadow-[0_24px_70px_rgba(7,29,43,0.2)] sm:p-8 lg:p-9">
          <div className="grid gap-6 md:grid-cols-[1fr_0.78fr] md:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <Image src="/brand/cashbrite-icon.svg" alt="" width={24} height={24} aria-hidden="true" />
                <p className="text-sm font-black uppercase tracking-[0.14em] text-mint">Cashbrite Money Ready Plan</p>
                <span className="rounded-full border border-mint/25 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-mint">
                  Personalised
                </span>
              </div>
              <h2 className="mt-5 max-w-3xl text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
                Get Your Personalised Action Plan
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-white/75">
                Built from your Cashbrite Score and priority areas, this action plan shows you exactly what to focus on,
                what mistakes to avoid and the steps to take over the next 30 days.
              </p>
              <p className="mt-5 rounded-md border border-white/15 bg-white/10 p-5 text-base font-bold leading-7 text-white/75">
                The financial habits you build now can influence everything from managing your first pay cheque to moving
                out, university and future borrowing decisions.
              </p>
            </div>

            <div className="rounded-lg border border-mint/25 bg-white p-6 text-navy shadow-[0_22px_55px_rgba(0,0,0,0.18)] sm:p-7">
              <p className="text-sm font-black uppercase tracking-[0.12em] text-sea">£19 Launch Offer</p>
              <div className="mt-3 flex items-end gap-3">
                <p className="text-6xl font-black leading-none text-navy">£19</p>
                <p className="pb-1 text-sm font-bold text-navy/60">
                  Future price: <span className="line-through">£39</span>
                </p>
              </div>
              <p className="mt-4 border-t border-navy/10 pt-4 text-sm font-bold leading-6 text-navy/70">
                Instant PDF download. One payment. No subscription.
              </p>
              <div className="mt-5 [&_p]:hidden">
                <UnlockPlanButton assessmentId={assessment.id} label="Get My £19 Action Plan" />
              </div>
              <p className="mt-3 text-sm font-semibold leading-6 text-navy/70">Secure payment powered by Stripe.</p>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-sm font-black uppercase tracking-[0.12em] text-mint">What&apos;s included</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {premiumBenefits.map((benefit) => (
                <article key={benefit} className="flex items-center gap-4 rounded-md border border-white/15 bg-white/10 p-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mint/15" aria-hidden="true">
                    <span className="text-sm font-black text-mint">&#10003;</span>
                  </span>
                  <h3 className="font-black leading-6 text-white">{benefit}</h3>
                </article>
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
