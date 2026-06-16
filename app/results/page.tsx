import Link from "next/link";
import { categoryDescriptions, categoryLabels, quizQuestions, type QuizCategory } from "@/data/quizQuestions";
import { scoreQuiz } from "@/lib/quizScoring";

type ResultsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  const params = await searchParams;
  const selectedAnswers = Object.fromEntries(
    quizQuestions.map((question) => {
      const value = params[question.id];
      return [question.id, Array.isArray(value) ? value[0] : value ?? ""];
    }),
  );

  const scores = scoreQuiz(selectedAnswers);
  const categoryEntries = Object.entries(scores.categoryScores) as Array<
    [QuizCategory, (typeof scores.categoryScores)[QuizCategory]]
  >;
  const hasStrengths = scores.strengths.length > 0;
  const hasRiskAreas = scores.riskAreas.length > 0;

  return (
    <section className="bg-cream py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 rounded-lg bg-navy p-6 text-white shadow-soft sm:p-8 md:grid-cols-[0.7fr_1fr] md:items-center">
          <div className="rounded-lg border border-white/10 bg-white/8 p-6 text-center">
            <p className="text-sm font-black uppercase tracking-[0.14em] text-mint">Money Readiness Score</p>
            <p className="mt-3 text-6xl font-black leading-none text-white">{scores.readinessScore}</p>
            <p className="mt-2 text-lg font-black text-mint">out of 100</p>
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.14em] text-mint">Your result</p>
            <h1 className="mt-3 text-4xl font-black sm:text-5xl">{scores.band}</h1>
            <p className="mt-4 text-xl leading-8 text-white/78">
              This score highlights your current strengths, possible risk areas and practical next steps for life after
              school.
            </p>
            <p className="mt-3 text-sm text-white/60">
              Raw score: {scores.totalScore} out of {scores.maxScore} points.
            </p>
          </div>
        </div>

        <div className="mt-10">
          <div className="mb-5">
            <p className="text-sm font-black uppercase tracking-[0.14em] text-sea">Category scores</p>
            <h2 className="mt-2 text-3xl font-black text-navy">Where confidence is strongest and where to build</h2>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {categoryEntries.map(([category, categoryScore]) => (
            <article key={category} className="rounded-lg border border-navy/10 bg-white p-6 shadow-[0_18px_50px_rgba(7,29,43,0.06)]">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-black text-navy">{categoryLabels[category]}</h2>
                <p className="rounded-full bg-mint/45 px-3 py-1 text-sm font-black text-navy">{categoryScore.percentage}%</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-navy/62">{categoryDescriptions[category]}</p>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-cream">
                <div className="h-full rounded-full bg-sea" style={{ width: `${categoryScore.percentage}%` }} />
              </div>
              <p className="mt-3 text-sm font-semibold text-navy/60">
                {categoryScore.score} of {categoryScore.max} points
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <article className="rounded-lg border border-navy/10 bg-white p-6 shadow-[0_18px_50px_rgba(7,29,43,0.06)]">
            <h2 className="text-2xl font-black text-navy">Strengths</h2>
            {hasStrengths ? (
              <ul className="mt-4 grid gap-3">
                {scores.strengths.map((category) => (
                  <li key={category} className="rounded-md border border-sea/10 bg-mint/35 p-4">
                    <p className="font-black text-navy">{categoryLabels[category]}</p>
                    <p className="mt-1 text-sm leading-6 text-navy/65">{categoryDescriptions[category]}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-base leading-7 text-navy/70">
                No standout strengths yet. That is useful to know: focus on a few steady habits first, then your
                strongest areas will start to show.
              </p>
            )}
          </article>

          <article className="rounded-lg border border-navy/10 bg-white p-6 shadow-[0_18px_50px_rgba(7,29,43,0.06)]">
            <h2 className="text-2xl font-black text-navy">Risk areas</h2>
            {hasRiskAreas ? (
              <ul className="mt-4 grid gap-3">
                {scores.riskAreas.map((category) => (
                  <li key={category} className="rounded-md border border-[#e9c36b]/25 bg-[#fff3d9] p-4">
                    <p className="font-black text-navy">{categoryLabels[category]}</p>
                    <p className="mt-1 text-sm leading-6 text-navy/65">{categoryDescriptions[category]}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-base leading-7 text-navy/70">
                No major risk areas were flagged. Keep reviewing your money habits when your income, study plans or
                living costs change.
              </p>
            )}
          </article>
        </div>

        <div className="mt-8 rounded-lg border border-navy/10 bg-white p-6 shadow-soft">
          <h2 className="text-2xl font-black text-navy">Personalised next steps</h2>
          <ol className="mt-4 grid gap-3 text-lg leading-8 text-navy/72">
            {scores.nextSteps.map((step, index) => (
              <li key={step} className="flex gap-4 rounded-md bg-mint/35 p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-black text-white">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <div className="mt-6 rounded-md border border-navy/10 bg-cream p-4 text-sm leading-6 text-navy/68">
            Bands: 0-25 Money Foundations Needed, 26-50 Getting Started, 51-70 Building Confidence, 71-85 Nearly
            Money Ready, 86-100 Money Ready.
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/quiz"
              className="focus-ring inline-flex justify-center rounded-full bg-navy px-5 py-3 font-bold text-white"
            >
              Retake quiz
            </Link>
            <Link
              href="/students"
              className="focus-ring inline-flex justify-center rounded-full border border-navy/15 bg-white px-5 py-3 font-bold text-navy"
            >
              Student resources
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
