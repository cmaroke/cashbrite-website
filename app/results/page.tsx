import Link from "next/link";
import type { ReactNode } from "react";
import { PreviewPlanLink } from "@/components/PremiumPlanCtas";
import { categoryDescriptions, categoryLabels, type QuizCategory } from "@/data/quizQuestions";
import { getAssessment } from "@/lib/assessmentDb";

export const dynamic = "force-dynamic";

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
  const categoryEntries = Object.entries(scores.categoryScores) as Array<
    [QuizCategory, (typeof scores.categoryScores)[QuizCategory]]
  >;

  return (
    <section className="bg-cream py-16 sm:py-20">
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
            <p className="mt-4 text-xl leading-8 text-white/78">
              {assessment.registration.firstName}, your free personalised Cashbrite Money Action Plan is ready.
            </p>
            <p className="mt-3 text-sm leading-6 text-white/62">
              A copy has been sent to {assessment.registration.email} if email delivery is configured.
            </p>
          </div>
        </div>

        <ReportSection eyebrow="Your Money Readiness Summary" title="A supportive snapshot of where you are now">
          <p className="text-lg leading-8 text-navy/74">{actionPlan.summary}</p>
        </ReportSection>

        <section className="mt-8">
          <div className="mb-5">
            <p className="text-sm font-black uppercase tracking-[0.14em] text-sea">Category scores</p>
            <h2 className="mt-2 text-3xl font-black text-navy">Your assessment breakdown</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {categoryEntries.map(([category, categoryScore]) => (
              <article
                key={category}
                className="rounded-lg border border-navy/10 bg-white p-6 shadow-[0_18px_50px_rgba(7,29,43,0.06)]"
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-lg font-black text-navy">{categoryLabels[category]}</h3>
                  <p className="rounded-full bg-mint/45 px-3 py-1 text-sm font-black text-navy">
                    {categoryScore.percentage}%
                  </p>
                </div>
                <p className="mt-2 text-sm leading-6 text-navy/62">{categoryDescriptions[category]}</p>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-cream">
                  <div className="h-full rounded-full bg-sea" style={{ width: `${categoryScore.percentage}%` }} />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-lg border border-navy/10 bg-white p-6 shadow-soft sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.14em] text-sea">Your Top 3 Money Priorities</p>
          <h2 className="mt-2 text-3xl font-black text-navy">The areas to focus on first</h2>
          <div className="mt-6 grid gap-5">
            {actionPlan.priorityAreas.map((area, index) => (
              <article key={area.category} className="rounded-lg border border-navy/10 bg-cream p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy text-base font-black text-white">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-2xl font-black text-navy">{area.title}</h3>
                    <p className="mt-1 text-sm font-semibold text-navy/62">Priority area</p>
                  </div>
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <InfoBlock title="Why this matters">{area.whyItMatters}</InfoBlock>
                  <InfoBlock title="Common mistakes">{area.commonMistakes}</InfoBlock>
                </div>
                <div className="mt-5 rounded-md bg-white p-4">
                  <h4 className="font-black text-navy">Practical actions</h4>
                  <ul className="mt-3 grid gap-2 text-base leading-7 text-navy/72">
                    {area.actions.map((action) => (
                      <li key={action} className="flex gap-3">
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-sea" aria-hidden="true" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <article className="rounded-lg border border-navy/10 bg-white p-6 shadow-[0_18px_50px_rgba(7,29,43,0.06)] sm:p-7">
            <p className="text-sm font-black uppercase tracking-[0.14em] text-sea">Your Money Strengths</p>
            <h2 className="mt-2 text-3xl font-black text-navy">What is already working</h2>
            <div className="mt-5 grid gap-3">
              {actionPlan.strengths.map((strength) => (
                <div key={strength.category} className="rounded-md border border-sea/10 bg-mint/35 p-4">
                  <h3 className="font-black text-navy">{strength.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-navy/68">{strength.explanation}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-lg border border-navy/10 bg-white p-6 shadow-[0_18px_50px_rgba(7,29,43,0.06)] sm:p-7">
            <p className="text-sm font-black uppercase tracking-[0.14em] text-sea">Your 30-Day Money Challenge</p>
            <h2 className="mt-2 text-3xl font-black text-navy">Small steps for the next month</h2>
            <ol className="mt-5 grid gap-3">
              {actionPlan.challenge.map((item, index) => (
                <li key={item} className="flex gap-4 rounded-md bg-cream p-4 text-base leading-7 text-navy/72">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sea text-sm font-black text-white">
                    {index + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </article>
        </section>

        <section className="mt-8 rounded-lg bg-navy p-6 text-white shadow-soft sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.14em] text-mint">Your Next Steps</p>
          <h2 className="mt-2 text-3xl font-black">Keep building your confidence</h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-white/76">{actionPlan.nextStepsMessage}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/quiz"
              className="focus-ring inline-flex justify-center rounded-full bg-mint px-5 py-3 font-black text-navy"
            >
              Retake assessment
            </Link>
            <Link
              href="/students"
              className="focus-ring inline-flex justify-center rounded-full border border-white/20 px-5 py-3 font-black text-white"
            >
              Student resources
            </Link>
          </div>
        </section>

        <section className="relative mt-8 overflow-hidden rounded-lg border border-sea/25 bg-white p-6 shadow-[0_24px_70px_rgba(7,29,43,0.12)] sm:p-9">
          <div className="absolute right-0 top-0 h-32 w-32 translate-x-10 -translate-y-10 rounded-full bg-mint/45" aria-hidden="true" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm font-black uppercase tracking-[0.14em] text-sea">Cashbrite Money Ready Plan</p>
                <span className="rounded-full bg-navy px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-mint">
                  Premium
                </span>
              </div>
              <h2 className="mt-3 max-w-3xl text-3xl font-black text-navy sm:text-4xl">
                Unlock your full Cashbrite Money Ready Plan
              </h2>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-navy/72">
                Get a personalised 30-day roadmap based on your assessment results, including practical weekly
                actions, parent conversation prompts, and a full Money Ready checklist.
              </p>
              <div className="mt-5 flex flex-wrap gap-2 text-sm font-bold text-navy/68">
                {[
                  "Tailored to your results",
                  "Four weekly action plans",
                  "Parent conversation guide",
                ].map((item) => (
                  <span key={item} className="rounded-full border border-navy/10 bg-cream px-3 py-2">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-lg bg-navy p-5 text-white lg:min-w-64">
              <p className="text-sm font-bold text-white/65">Launch price</p>
              <p className="mt-1 text-4xl font-black text-mint">£19</p>
              <div className="mt-5">
                <PreviewPlanLink assessmentId={assessment.id} />
              </div>
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

function ReportSection({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-8 rounded-lg border border-navy/10 bg-white p-6 shadow-soft sm:p-8">
      <p className="text-sm font-black uppercase tracking-[0.14em] text-sea">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-black text-navy">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function InfoBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-md bg-white p-4">
      <h4 className="font-black text-navy">{title}</h4>
      <p className="mt-2 text-base leading-7 text-navy/70">{children}</p>
    </div>
  );
}
