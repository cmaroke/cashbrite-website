import type { Metadata } from "next";
import Link from "next/link";
import { UnlockPlanButton } from "@/components/PremiumPlanCtas";
import { categoryLabels, type QuizCategory } from "@/data/quizQuestions";
import { getAssessment } from "@/lib/assessmentDb";
import { createSeoMetadata } from "@/lib/seo";
import { priorityTieExplanation, selectPriorityCategories } from "@/lib/assessmentPriorities";
import { generatePremiumActionPlan } from "@/lib/premiumActionPlan";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createSeoMetadata({
  title: "Your Cashbrite Money Confidence Snapshot",
  description:
    "View your free Cashbrite Score, score band, short interpretation and three priority areas, with an optional £19 Personalised Money Action Plan.",
  path: "/results",
  noIndex: true,
});

const premiumBenefits = [
  ["Learn", "Three priority chapters with worked examples and fifteen practical actions."],
  ["Put it into practice", "A four-week roadmap, conversation prompts and checklists."],
  ["Keep building", "A printable progress tracker and companion budget spreadsheet."],
  ["Make it yours", "Your PDF download and online report, ready to return to."],
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
    return <ResultsUnavailable message="Start the free assessment to receive your Cashbrite Money Confidence Snapshot." />;
  }

  let assessment;
  try {
    assessment = await getAssessment(id);
  } catch {
    return <ResultsUnavailable message="The results page is not connected to assessment storage yet." />;
  }

  if (!assessment) {
    return <ResultsUnavailable message="We could not find that Cashbrite Money Confidence Snapshot. Please retake the assessment." />;
  }

  const scores = assessment.scores;
  const actionPlan = assessment.actionPlan;
  const categoryResults = categoryOrder.map((category) => ({
    category,
    name: categoryLabels[category],
    percentage: scores.categoryScores[category]?.percentage ?? 0,
  }));
  const improvementCategories = selectPriorityCategories(scores).map((category) => categoryResults.find((area) => area.category === category)!);
  const rankedStrengths = [...categoryResults].sort((a, b) => b.percentage - a.percentage || categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category));
  const hasStrengths = scores.strengths.length > 0;
  const strengths = (hasStrengths ? rankedStrengths.filter((area) => scores.strengths.includes(area.category)) : rankedStrengths).slice(0, 3);
  // Match the existing scoring engine's strength threshold; this is presentation, not new scoring.
  const allAreasStrong = categoryResults.every((area) => area.percentage >= 75);
  const sample = generatePremiumActionPlan(assessment.registration, scores).priorityAreas[0];
  // Only this short excerpt is rendered. No full premium plan is passed to a client component.
  const sampleExplanation = sample.whatToLearn;
  const sampleAction = sample.actions[sample.creditLearningGuide ? 2 : 0];

  return (
    <section className="bg-cream py-8 text-ink sm:py-12">
      <div className="mx-auto max-w-report px-5 sm:px-8">
        <section aria-labelledby="snapshot-title" className="border-b border-ink/20 pb-8 sm:pb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sea">Your free personal report</p>
          <h1 id="snapshot-title" className="editorial-heading mt-3 max-w-3xl text-3xl md:text-5xl">Your Money Confidence Snapshot</h1>
          <div className="mt-7 grid gap-6 md:grid-cols-[0.7fr_1fr] md:items-center md:gap-14">
            <div className="border-l-4 border-lime pl-5 sm:pl-7">
              <p className="font-display text-sm font-semibold">Cashbrite Score</p>
              <p className="mt-2 flex items-baseline gap-3 font-display tabular-nums" aria-label={`${scores.readinessScore} out of 100`}>
                <span className="text-8xl font-semibold leading-none sm:text-9xl">{scores.readinessScore}</span>
                <span className="text-xl text-ink/70" aria-hidden="true">/ 100</span>
              </p>
              <p className="mt-4 inline-block border-b-2 border-sage pb-1 font-display text-lg font-semibold">{scores.band}</p>
            </div>
            <div className="min-w-0">
              <h2 className="font-display text-xl font-semibold [overflow-wrap:anywhere]">{assessment.registration.firstName}, here&apos;s where you are today.</h2>
              <p className="mt-3 max-w-reading text-base leading-7 text-ink/80">{actionPlan.summary}</p>
              <p className="mt-4 text-sm leading-6 text-ink/70">A starting point for learning, based on your answers. Not a financial qualification, a prediction or personalised financial advice.</p>
            </div>
          </div>
        </section>

        <section aria-label="Your strengths and priorities" className="grid gap-8 py-8 sm:py-10 md:grid-cols-2 md:gap-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sea">What to carry forward</p>
            <h2 className="editorial-heading mt-2 text-2xl sm:text-3xl">{hasStrengths ? "Your strengths" : "Your strongest starting points"}</h2>
            <p className="mt-3 text-sm leading-6 text-ink/75">{hasStrengths ? "These topics stood out in your assessment. Keep building on what you already understand." : "These are your strongest topics relative to your other answers, not a claim of mastery. There is something to build on."}</p>
            <ul className="mt-4 divide-y divide-ink/15 border-y border-ink/15">
              {strengths.map((area) => <li key={area.category} className="flex items-start gap-3 py-3.5 font-display text-base font-semibold leading-6"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-sage" aria-hidden="true" />{area.name}</li>)}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sea">Where to focus next</p>
            <h2 className="editorial-heading mt-2 text-2xl sm:text-3xl">{allAreasStrong ? "Areas to build on" : "Your priorities"}</h2>
            <p className="mt-3 text-sm leading-6 text-ink/75">{allAreasStrong ? "You showed strong awareness across every category. These three topics offer a focus for further practice." : "Your three lowest-scoring topics offer a useful focus for your next steps. They are opportunities to learn, not labels."}</p>
            <ul className="mt-4 divide-y divide-ink/15 border-y border-ink/15">
              {improvementCategories.map((area) => <li key={area.category} className="flex items-start gap-3 py-3.5 font-display text-base font-semibold leading-6"><span className="mt-2 h-2 w-2 shrink-0 bg-ink" aria-hidden="true" />{area.name}</li>)}
            </ul>
            <details className="mt-3 text-xs leading-5 text-ink/70">
              <summary className="focus-ring w-fit cursor-pointer py-2 font-semibold underline underline-offset-2">How your priorities are selected</summary>
              <p className="mt-1">{priorityTieExplanation}</p>
            </details>
          </div>
        </section>

        <section aria-labelledby="sample-heading" className="border-y border-ink/15 bg-white px-5 py-6 sm:px-8 sm:py-8">
          <div className="grid gap-5 md:grid-cols-[0.7fr_1fr] md:gap-14">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sea">Inside the Action Plan</p>
              <h2 id="sample-heading" className="editorial-heading mt-2 text-2xl sm:text-3xl">A little understanding.<br className="hidden sm:block" /> A practical next step.</h2>
              <p className="mt-3 text-sm leading-6 text-ink/75">A sample from the {sample.title} chapter selected for your Action Plan.</p>
              <p className="mt-3 text-xs leading-5 text-ink/70">Selected by category score, not an explanation of a particular answer.</p>
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold leading-7">{sample.title}</h3>
              {sample.creditLearningGuide ? <p className="mt-3 text-sm leading-6 text-ink/75">{sample.realLifeExample.summary}</p> : null}
              <p className="mt-3 text-base leading-7 text-ink/80">{sampleExplanation}</p>
              <div className="mt-5 border-l-2 border-sage pl-4">
                <p className="font-display text-sm font-semibold">One action to try</p>
                <p className="mt-2 text-sm leading-6 text-ink/80">{sampleAction}</p>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="plan-heading" className="py-8 sm:py-10">
          <div className="grid items-start gap-6 md:grid-cols-[1fr_0.8fr] md:gap-14">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sea">Cashbrite Personalised Money Action Plan</p>
              <h2 id="plan-heading" className="editorial-heading mt-3 text-3xl sm:text-4xl">Your next step starts here.</h2>
              <p className="mt-4 max-w-reading text-base leading-7 text-ink/80">Build on your three assessment priorities with clear explanations, real-life examples and a practical plan for the next four weeks. Personalised by category, with space to put the learning into practice.</p>
              <p className="mt-4 text-sm leading-6 text-ink/75">Your free Cashbrite Money Confidence Snapshot is yours to use. The Action Plan is an optional way to take it further.</p>
            </div>
            <div className="rounded-md border border-ink/20 bg-white p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sea">Personalised Money Action Plan</p>
              <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-2">
                <p className="font-display text-6xl font-semibold leading-none tabular-nums">£19</p>
              </div>
              <p className="mt-3 text-sm leading-6 text-ink/80">One-off payment. No subscription.</p>
              <div className="mt-4"><UnlockPlanButton assessmentId={assessment.id} label="Get My £19 Action Plan" showReassurance={false} /></div>
              <p className="mt-3 text-xs leading-5 text-ink/70">Secure payment powered by Stripe. After payment, access your online report and download your PDF and budget spreadsheet.</p>
              <Link href="/contact" className="focus-ring mt-2 inline-flex min-h-11 items-center text-sm font-semibold underline decoration-ink/40 underline-offset-4">Already paid or need help?</Link>
            </div>
          </div>
          <div className="mt-7 border-t border-ink/20 pt-5">
            <h3 className="font-display text-sm font-semibold">What&apos;s included</h3>
            <dl className="mt-4 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
              {premiumBenefits.map(([title, description]) => <div key={title}><dt className="font-display text-base font-semibold">{title}</dt><dd className="mt-2 text-sm leading-6 text-ink/75">{description}</dd></div>)}
            </dl>
          </div>
        </section>

        <section aria-labelledby="free-tools-heading" className="border-t border-ink/20 py-7">
          <div className="grid gap-4 md:grid-cols-[1fr_0.8fr] md:gap-14">
            <div><h2 id="free-tools-heading" className="editorial-heading text-2xl sm:text-3xl">Keep learning, at your own pace.</h2><p className="mt-3 text-sm leading-6 text-ink/75">Start with a free tool or a practical guide. You do not need to buy a plan to keep building money confidence.</p></div>
            <div className="flex flex-col items-start">
              <Link className="focus-ring inline-flex min-h-11 items-center py-2 font-semibold underline decoration-sage underline-offset-4" href="/student-budget-calculator">Plan your monthly budget <span aria-hidden="true" className="ml-2">&rarr;</span></Link>
              <Link className="focus-ring inline-flex min-h-11 items-center py-2 font-semibold underline decoration-sage underline-offset-4" href="/resources">Explore free money resources <span aria-hidden="true" className="ml-2">&rarr;</span></Link>
            </div>
          </div>
          <p className="mt-6 max-w-reading text-xs leading-5 text-ink/70">Cashbrite provides financial education, not regulated financial, legal, tax or investment advice. <Link href="/financial-disclaimer" className="focus-ring underline underline-offset-2">Read our financial education disclaimer.</Link></p>
        </section>
      </div>
    </section>
  );
}

function ResultsUnavailable({ message }: { message: string }) {
  return (
    <section className="bg-cream section-space">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <div className="rounded-lg border border-navy/10 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-sea">Cashbrite Money Confidence Snapshot</p>
          <h1 className="editorial-heading mt-3 text-4xl text-navy md:text-5xl">
            Your report is not available yet
          </h1>
          <p className="mt-4 text-lg leading-8 text-navy/72">{message}</p>
          <Link
            href="/quiz"
            className="focus-ring mt-6 inline-flex justify-center rounded-full bg-navy px-5 py-3 font-semibold text-white"
          >
            Start assessment
          </Link>
        </div>
      </div>
    </section>
  );
}
