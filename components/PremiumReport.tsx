import "server-only";
import Image from "next/image";
import { Logo } from "@/components/Logo";
import { PremiumPlanPrintControls } from "@/components/PremiumPlanPrintControls";
import { generatePremiumActionPlan, type CreditLearningGuide } from "@/lib/premiumActionPlan";
import type { PremiumPlanAssessment } from "@/lib/premiumPlanDemo";
import { priorityTieExplanation } from "@/lib/assessmentPriorities";

export function PremiumReport({ assessment, isDemo = false, downloadSessionId, registeredAccess = false }: { assessment: PremiumPlanAssessment; isDemo?: boolean; downloadSessionId?: string; registeredAccess?: boolean }) {
  const plan = generatePremiumActionPlan(assessment.registration, assessment.scores);
  const completedDate = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(assessment.completedAt));

  return (
    <article className="premium-plan-preview bg-mist py-8 sm:py-12">
      <div className="no-print mx-auto mb-6 flex max-w-5xl flex-col gap-4 px-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        {isDemo ? (
          <div className="rounded-md border border-sea/15 bg-white px-4 py-3 shadow-sm">
            <p className="text-sm font-semibold text-navy">Illustrative demo preview</p>
            <p className="mt-1 text-xs font-semibold text-navy/65">Fixed synthetic answers scored by the Cashbrite assessment engine. No customer information is shown.</p>
          </div>
        ) : (
          <span />
        )}
        <PremiumPlanPrintControls
          registeredAccess={registeredAccess}
          budgetTrackerUrl={registeredAccess ? "/api/reports/excel" : downloadSessionId ? `/downloads/cashbrite-budget-tracker.xlsx?session_id=${encodeURIComponent(downloadSessionId)}` : undefined}
          downloadUrl={
            registeredAccess ? "/api/reports/pdf" : downloadSessionId
              ? `/api/money-ready-plan/pdf?session_id=${encodeURIComponent(downloadSessionId)}`
              : isDemo && process.env.NODE_ENV !== "production"
                ? "/api/money-ready-plan/pdf?demo=true"
                : undefined
          }
        />
      </div>

      <div className="premium-workbook mx-auto grid max-w-5xl gap-7 px-5 sm:px-8">
        <section className="premium-sheet premium-cover relative flex min-h-[640px] sm:min-h-[760px] flex-col overflow-hidden rounded-lg bg-navy p-6 text-white shadow-sm sm:p-10">
          <Image
            src="/brand/v2/favicon-dark.svg"
            alt=""
            width={280}
            height={280}
            className="pointer-events-none absolute -right-20 top-24 h-64 w-64 opacity-[0.09]"
            aria-hidden="true"
          />
          <div className="flex items-center justify-between gap-6 border-b border-white/15 pb-7">
            <Logo href="" light />
            <span className="rounded-full border border-mint/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-mint">
              {isDemo ? "Demo report" : "Personal report"}
            </span>
          </div>
          <div className="my-auto py-14">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-mint">Cashbrite Personalised Money Action Plan</p>
            <h1 className="editorial-heading mt-5 max-w-3xl text-4xl md:text-5xl">
              Your Cashbrite Personalised Money Action Plan
            </h1>
            <p className="mt-5 max-w-2xl text-xl leading-8 text-white/75 sm:text-2xl">
              Guidance focused on your three lowest-scoring money topics
            </p>
          </div>
          <div className="grid gap-5 border-t border-white/15 pt-7 sm:grid-cols-[1.3fr_0.7fr_0.7fr]">
            <CoverDetail label="Prepared for" value={assessment.registration.firstName} />
            <CoverDetail label="Age" value={String(assessment.registration.age)} />
            <CoverDetail label="Completed" value={completedDate} />
          </div>
          <div className="relative mt-7 grid gap-5 rounded-lg border border-white/15 bg-white/10 p-5 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-8">
            <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full border-[9px] border-mint bg-navy">
              <p className="font-display tabular-nums text-4xl font-semibold text-white">{assessment.scores.readinessScore}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-mint">out of 100</p>
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-white/80">Result band</p>
              <p className="mt-2 text-2xl font-semibold">{assessment.scores.band}</p>
              <p className="mt-2 text-sm text-white/80">Prepared for {assessment.registration.email}</p>
              {isDemo ? (
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.1em] text-mint">
                  Sample data &middot; design preview only
                </p>
              ) : null}
            </div>
          </div>
        </section>

        <ReportChapter number="01" eyebrow="Welcome" title={`A letter for ${assessment.registration.firstName}`}>
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div className="text-lg leading-9 text-navy/70">
              <p className="font-semibold text-navy">Welcome to your Cashbrite Personalised Money Action Plan.</p>
              <p className="mt-5">
                Money confidence is not something you are born with. It is a skill you can learn through small actions,
                honest questions and experience. Your assessment is a starting point, not a judgement.
              </p>
              <p className="mt-5">
                This workbook has been shaped around your results. Use it at your own pace, discuss it with someone you
                trust and tick off each action as it becomes part of everyday life.
              </p>
            </div>
            <aside className="relative overflow-hidden rounded-lg bg-navy p-6 text-white">
              <Image src="/brand/v2/favicon-dark.svg" alt="" width={40} height={40} className="h-9 w-9" aria-hidden="true" />
              <blockquote className="mt-5 text-2xl font-semibold leading-9">
                Money confidence grows through action, not perfection.
              </blockquote>
              <p className="mt-5 text-sm font-bold text-mint">Small steps count. Let&apos;s get started.</p>
            </aside>
          </div>
        </ReportChapter>

        <ReportChapter number="02" eyebrow="Money Confidence Profile" title={plan.moneyPersonality.title}>
          <p className="max-w-3xl text-xl leading-8 text-navy/75">{plan.moneyPersonality.description}</p>
          <div className="relative mt-7 overflow-hidden rounded-lg border-l-4 border-sea bg-mint/25 p-6 sm:pl-8">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sea">Your personalised reading</p>
            <p className="mt-3 text-base leading-8 text-navy/70">{plan.personalMoneyProfile}</p>
          </div>
          <div className="mt-7 grid gap-6 lg:grid-cols-2">
            <div>
              <h3 className="text-xl font-semibold tracking-tight text-navy">Your money strengths</h3>
              <div className="mt-4 grid gap-3">
                {plan.strengths.map((strength) => (
                  <div key={strength.category} className="rounded-md border border-sea/15 bg-mint/25 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-semibold text-navy">{strength.title}</p>
                      <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-sea">{strength.score}%</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-navy/65">{strength.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold tracking-tight text-navy">Your biggest opportunities</h3>
              <div className="mt-4 grid gap-3">
                {plan.opportunities.map((opportunity, index) => (
                  <div key={opportunity.category} className="flex items-center gap-4 rounded-md border border-navy/10 p-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-semibold text-white">
                      {index + 1}
                    </span>
                    <p className="font-semibold text-navy">{opportunity.title}</p>
                    <span className="ml-auto text-sm font-semibold text-sea">{opportunity.score}%</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs leading-5 text-navy/65">{priorityTieExplanation}</p>
            </div>
          </div>
          <div className="mt-8 border-t border-navy/10 pt-7">
            <h3 className="text-xl font-semibold tracking-tight text-navy">Your complete category picture</h3>
            <div className="mt-5 grid gap-x-7 gap-y-4 sm:grid-cols-2">
              {plan.categoryScores.map((category) => (
                <div key={category.category}>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="font-bold text-navy">{category.title}</span>
                    <span className="font-semibold text-sea">{category.score}%</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-cream">
                    <div className="h-full rounded-full bg-sea" style={{ width: `${category.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ReportChapter>

        {plan.priorityAreas.map((area, index) => (
          <ReportChapter
            key={area.category}
            number={`0${index + 3}`}
            eyebrow={`Priority Area ${index + 1}`}
            title={area.title}
          >
            <div className="flex items-center gap-4">
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-cream">
                <div className="h-full rounded-full bg-sea" style={{ width: `${area.score}%` }} />
              </div>
              <span className="text-lg font-semibold text-sea">{area.score}%</span>
            </div>
            <div className={`mt-7 grid gap-x-5 gap-y-3 ${area.creditLearningGuide ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
              <WorkbookInfo title="Why this matters" copy={area.whyItMatters} />
              <WorkbookInfo title="Common mistakes" copy={area.commonMistakes} />
              {!area.creditLearningGuide ? (
                <WorkbookInfo title="What you need to understand" copy={area.whatToLearn} />
              ) : null}
            </div>
            {area.creditLearningGuide ? (
              <CreditBorrowingLesson guide={area.creditLearningGuide} />
            ) : (
              <div className="mt-7 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
              <article className="overflow-hidden rounded-lg border border-sea/15 bg-white shadow-sm">
                <div className="flex items-center gap-3 border-b border-sea/15 bg-mint/25 px-5 py-4">
                  <Image src="/brand/v2/mark.svg" alt="" width={24} height={24} className="h-6 w-6" aria-hidden="true" />
                  <p className="text-sm font-semibold uppercase tracking-[0.1em] text-sea">Money Smart Example</p>
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className="text-2xl font-semibold tracking-tight text-navy">{area.realLifeExample.title}</h3>
                  <p className="mt-3 text-base leading-7 text-navy/70">{area.realLifeExample.summary}</p>
                  <ul className="mt-5 grid gap-3">
                    {area.realLifeExample.details.map((detail) => (
                      <li key={detail} className="flex gap-3 rounded-md bg-cream px-4 py-3 text-sm font-bold leading-6 text-navy/75">
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-sea" aria-hidden="true" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 border-l-4 border-sea pl-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.1em] text-sea">What this shows</p>
                    <p className="mt-2 font-semibold leading-7 text-navy">{area.realLifeExample.takeaway}</p>
                  </div>
                </div>
              </article>
              <aside className="relative overflow-hidden rounded-lg bg-navy p-6 text-white">
                <Image
                  src="/brand/v2/favicon-dark.svg"
                  alt=""
                  width={42}
                  height={42}
                  className="h-10 w-10"
                  aria-hidden="true"
                />
                <p className="mt-6 text-sm font-semibold uppercase tracking-[0.1em] text-mint">Money Smart Tip</p>
                <p className="mt-3 text-lg font-bold leading-8 text-white/80">{area.moneySmartTip}</p>
              </aside>
              </div>
            )}
            <div className="mt-7">
              <h3 className="text-xl font-semibold tracking-tight text-navy">Your five practical actions</h3>
              <ol className="mt-4 grid gap-3">
                {area.actions.map((action, actionIndex) => (
                  <li key={action} className="flex gap-4 rounded-md bg-cream p-4 text-base leading-7 text-navy/70">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sea text-sm font-semibold text-white">
                      {actionIndex + 1}
                    </span>
                    <span>{action}</span>
                  </li>
                ))}
              </ol>
            </div>
          </ReportChapter>
        ))}

        <ReportChapter number="06" eyebrow="30-Day Money Challenge" title="Four weeks from insight to action">
          <div className="grid gap-5 md:grid-cols-2">
            {plan.roadmap.map((week, index) => (
              <article key={week.week} className="rounded-lg border border-navy/10 border-t-4 border-t-mint bg-white p-5 shadow-sm">
                <div className="flex items-center gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-navy font-semibold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.1em] text-sea">{week.week}</p>
                    <h3 className="mt-1 text-xl font-semibold tracking-tight text-navy">{week.focus}</h3>
                  </div>
                </div>
                <ul className="mt-5 grid gap-3">
                  {week.actions.map((action) => (
                    <li key={action} className="flex gap-3 text-sm leading-6 text-navy/70">
                      <span className="mt-1 h-5 w-5 shrink-0 rounded border-2 border-sea/50 bg-white" aria-hidden="true" />
                      {action}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </ReportChapter>

        <ReportChapter number="07" eyebrow="Parent Conversation Guide" title="Make money conversations feel easier">
          <p className="max-w-3xl text-lg leading-8 text-navy/70">
            These prompts are designed to start a conversation, not test knowledge. Listen first, share experiences
            honestly and explore anything uncertain together.
          </p>
          <ol className="mt-7 grid gap-4">
            {plan.parentConversationGuide.map((prompt, index) => (
              <li key={prompt} className="flex gap-5 rounded-lg border border-navy/10 border-l-4 border-l-mint bg-white p-5 shadow-sm">
                <span className="text-2xl font-semibold text-sea">0{index + 1}</span>
                <p className="text-lg font-bold leading-8 text-navy">{prompt}</p>
              </li>
            ))}
          </ol>
        </ReportChapter>

        <ReportChapter number="08" eyebrow="Money Ready Checklist" title="What ready looks like in real life">
          <div className="grid gap-3 md:grid-cols-2">
            {plan.checklist.map((item) => (
              <div key={item.topic} className="flex gap-4 rounded-md border border-navy/10 bg-white p-4 shadow-sm">
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded border-2 border-sea/50 bg-mint/25" aria-hidden="true">
                  <span className="h-2 w-2 rounded-sm bg-white" />
                </span>
                <div>
                  <h3 className="font-semibold tracking-tight text-navy">{item.topic}</h3>
                  <p className="mt-1 text-sm leading-6 text-navy/65">{item.prompt}</p>
                </div>
              </div>
            ))}
          </div>
        </ReportChapter>

        <ReportChapter number="09" eyebrow="Money Confidence Tracker" title="Your next 90 days">
          <div className="grid gap-5 md:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-lg bg-navy p-6 text-white">
              <p className="font-display text-sm font-semibold uppercase tracking-[0.12em] text-mint">Current score</p>
              <p className="font-display tabular-nums mt-3 text-6xl font-semibold">{plan.confidenceTracker.currentScore}</p>
              <div className="mt-6 border-t border-white/15 pt-5">
                <p className="font-display text-sm font-semibold uppercase tracking-[0.12em] text-mint">90-day goal</p>
                <p className="font-display tabular-nums mt-2 text-4xl font-semibold">{plan.confidenceTracker.goalScore}/100</p>
              </div>
            </div>
            <div className="rounded-lg bg-cream p-6">
              <h3 className="text-xl font-semibold tracking-tight text-navy">Three areas to improve</h3>
              <ol className="mt-5 grid gap-4">
                {plan.confidenceTracker.improvementAreas.map((area, index) => (
                  <li key={area} className="flex items-center gap-4 border-b border-navy/10 pb-4 last:border-0 last:pb-0">
                    <span className="text-sm font-semibold text-sea">0{index + 1}</span>
                    <span className="font-semibold text-navy">{area}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            {["My first review date", "A habit I will keep", "Someone who can support me"].map((label) => (
              <div key={label} className="min-h-28 rounded-md border border-dashed border-navy/25 p-4">
                <p className="text-sm font-bold text-ink/75">{label}</p>
              </div>
            ))}
          </div>
        </ReportChapter>

        <ReportChapter number="10" eyebrow="Next Steps" title="Keep building, one decision at a time">
          <div className="grid gap-4">
            {plan.recommendedNextSteps.map((step, index) => (
              <div key={step} className="flex gap-5 rounded-lg bg-cream p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mint font-semibold text-navy">
                  {index + 1}
                </span>
                <p className="text-lg leading-8 text-navy/70">{step}</p>
              </div>
            ))}
          </div>
          <p className="mt-7 text-xl font-semibold leading-8 text-navy">
            Financial confidence grows every time you pause, ask a useful question and make an informed choice.
          </p>
        </ReportChapter>

        <section className="premium-sheet premium-founder-note rounded-lg bg-navy p-6 text-white shadow-sm sm:p-10">
          <Logo href="" light />
          <p className="mt-10 text-sm font-semibold uppercase tracking-[0.14em] text-mint">A message from the founder</p>
          <blockquote className="relative mt-6 max-w-3xl border-l-4 border-mint pl-6 text-xl leading-9 text-white/80 sm:pl-8">
            <p>&ldquo;I created Cashbrite because I believe every young person deserves to enter adult life feeling confident about money.</p>
            <p className="mt-5">As a banking professional, I have seen first-hand how financial knowledge can transform confidence and decision-making.</p>
            <p className="mt-5">I hope this plan helps you take your first steps towards financial independence.</p>
            <footer className="mt-8 font-semibold text-mint">Chandni<br />Founder of Cashbrite&rdquo;</footer>
          </blockquote>
        </section>
      </div>
    </article>
  );
}

function ReportChapter({
  number,
  eyebrow,
  title,
  children,
}: {
  number: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="premium-sheet overflow-hidden rounded-lg border border-navy/10 bg-white p-6 shadow-sm sm:p-10">
      <div className="relative flex items-start gap-5 border-b border-navy/10 pb-6">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mint text-sm font-semibold text-navy">{number}</span>
        <div>
          <div className="flex items-center gap-2">
            <Image src="/brand/v2/mark.svg" alt="" width={18} height={18} className="h-4 w-4" aria-hidden="true" />
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-sea">{eyebrow}</p>
          </div>
          <h2 className="editorial-heading mt-2 text-2xl text-navy md:text-3xl">{title}</h2>
        </div>
      </div>
      <div className="mt-7">{children}</div>
    </section>
  );
}

function CreditBorrowingLesson({ guide }: { guide: CreditLearningGuide }) {
  return (
    <div className="mt-7 grid gap-6">
      <article className="rounded-lg border border-navy/10 bg-white p-5 shadow-sm sm:p-6">
        <LessonHeading number="01" title="What is a credit card?" />
        <p className="mt-4 text-base leading-7 text-navy/70">{guide.basics.explanation}</p>
      </article>

      <article className="rounded-lg border border-navy/10 bg-white p-5 shadow-sm sm:p-6">
        <LessonHeading number="02" title="The monthly bill" />
        <p className="mt-4 text-base leading-7 text-navy/70">{guide.monthlyStatement.explanation}</p>
        <TeachingPoints items={guide.monthlyStatement.shows} />
      </article>

      <article className="rounded-lg border border-navy/10 bg-white p-5 shadow-sm sm:p-6">
        <LessonHeading number="03" title="The best habit" />
        <p className="mt-4 text-base font-bold leading-7 text-navy">{guide.bestHabit.explanation}</p>
        <TeachingPoints items={guide.bestHabit.benefits} tone="mint" />
      </article>

      <article className="rounded-lg border border-navy/10 bg-white p-5 shadow-sm sm:p-6">
        <LessonHeading number="04" title="Minimum payment warning" />
        <p className="mt-4 text-base leading-7 text-navy/70">{guide.minimumPayment.explanation}</p>
        <TeachingPoints items={guide.minimumPayment.consequences} />
      </article>

      <article className="rounded-lg border border-navy/10 bg-white p-5 shadow-sm sm:p-6">
        <LessonHeading number="05" title={guide.example.title} />
        <p className="mt-4 text-base leading-7 text-navy/70">{guide.example.scenario}</p>
        <div className="mt-5 overflow-hidden rounded-lg border border-sea/15">
          <div className="bg-mint/25 px-5 py-3">
            <p className="text-sm font-semibold text-sea">{guide.example.monthTitle}</p>
          </div>
          <dl className="grid sm:grid-cols-2">
            {guide.example.statement.map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-4 border-b border-navy/10 px-5 py-4 sm:odd:border-r">
                <dt className="text-sm font-bold text-navy/65">{item.label}</dt>
                <dd className="font-semibold text-navy">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <p className="mt-5 text-base font-semibold text-navy">You have two choices:</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {guide.example.options.map((option, index) => (
            <div key={option.title} className={`rounded-lg p-5 ${index === 0 ? "bg-mint/25" : "bg-cream"}`}>
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-sea">{option.title}</p>
              <p className="mt-3 font-semibold leading-7 text-navy">{option.payment}</p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.08em] text-sea">Result</p>
              <ul className="mt-4 grid gap-3">
                {option.outcomes.map((outcome) => (
                  <li key={outcome} className="flex gap-3 text-sm leading-6 text-navy/70">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-sea" aria-hidden="true" />
                    {outcome}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-lg border border-navy/10 bg-white p-5 shadow-sm sm:p-6">
        <LessonHeading number="06" title="The Cashbrite Rule" />
        <div className="mt-5 rounded-lg border-2 border-sea bg-mint/25 p-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sea">Cashbrite Rule</p>
          <p className="mt-2 text-xl font-semibold leading-8 text-navy">{guide.rule}</p>
        </div>
      </article>

      <p className="text-sm leading-6 text-ink/75">
        These examples are for financial education and confidence-building. They do not recommend a particular credit product.
      </p>
    </div>
  );
}

function LessonHeading({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mint text-sm font-semibold text-navy">{number}</span>
      <h3 className="text-xl font-semibold leading-7 tracking-tight text-navy sm:text-2xl">{title}</h3>
    </div>
  );
}

function TeachingPoints({ items, tone = "cream" }: { items: string[]; tone?: "mint" | "cream" }) {
  return (
    <div className={`mt-5 rounded-lg p-5 ${tone === "mint" ? "bg-mint/25" : "bg-cream"}`}>
      <ul className="grid gap-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-base font-bold leading-7 text-navy/70">
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-sea" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CoverDetail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-mint">{label}</p>
      <p className="mt-2 font-semibold text-white">{value}</p>
    </div>
  );
}

function WorkbookInfo({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="grid content-start gap-3 rounded-lg border border-navy/10 bg-cream p-5 md:row-span-2 md:grid-rows-subgrid">
      <div className="flex items-start gap-3">
        <Image src="/brand/v2/mark.svg" alt="" width={22} height={22} className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <h3 className="font-semibold tracking-tight text-navy">{title}</h3>
      </div>
      <p className="text-sm leading-6 text-navy/70">{copy}</p>
    </div>
  );
}


