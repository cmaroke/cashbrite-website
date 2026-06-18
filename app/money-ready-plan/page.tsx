import Link from "next/link";
import { UnlockPlanButton } from "@/components/PremiumPlanCtas";
import { getAssessment } from "@/lib/assessmentDb";
import { generatePremiumActionPlan, getPremiumPreview } from "@/lib/premiumActionPlan";

export const dynamic = "force-dynamic";

type MoneyReadyPlanPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const includedFeatures = [
  {
    number: "01",
    title: "Personal Money Profile",
    copy: "A warm, tailored explanation of your confidence level, strengths and most useful focus points.",
  },
  {
    number: "02",
    title: "Top 3 Priority Guides",
    copy: "Clear learning points, common mistakes to avoid and five practical actions for each priority.",
  },
  {
    number: "03",
    title: "30-Day Roadmap",
    copy: "Four manageable weeks of practical activity, ordered around the results of your assessment.",
  },
  {
    number: "04",
    title: "Parent Conversation Guide",
    copy: "Supportive prompts that make useful money conversations easier to begin at home.",
  },
  {
    number: "05",
    title: "Money Ready Checklist",
    copy: "A complete check across budgeting, saving, borrowing, scams, payslips, renting and more.",
  },
  {
    number: "06",
    title: "Recommended Next Steps",
    copy: "A focused way forward matched to your Money Readiness result band.",
  },
];

export default async function MoneyReadyPlanPage({ searchParams }: MoneyReadyPlanPageProps) {
  const params = await searchParams;
  const idParam = params.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;

  if (!id) {
    return <PreviewUnavailable message="Complete the free assessment first to see your personalised preview." />;
  }

  let assessment;
  try {
    assessment = await getAssessment(id);
  } catch {
    return <PreviewUnavailable message="Your assessment results could not be loaded right now." />;
  }

  if (!assessment) {
    return <PreviewUnavailable message="We could not find that assessment. You can retake it to create a new report." />;
  }

  // Generate the complete product server-side, then expose only the preview fields until payments are added.
  const fullPlan = generatePremiumActionPlan(assessment.registration, assessment.scores);
  const preview = getPremiumPreview(fullPlan);

  return (
    <main className="bg-cream">
      <section className="bg-navy py-14 text-white sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_0.72fr] lg:items-center lg:px-8">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm font-black uppercase tracking-[0.14em] text-mint">Cashbrite Money Ready Plan</p>
              <span className="rounded-full border border-mint/25 px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-mint">
                Premium preview
              </span>
            </div>
            <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight sm:text-5xl">
              A clearer route from knowing to doing.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/75">
              {preview.personalMoneyProfile}
            </p>
          </div>
          <div className="rounded-lg border border-white/12 bg-white/8 p-6 sm:p-7">
            <p className="text-sm font-bold text-white/62">Your current result</p>
            <p className="mt-2 text-5xl font-black text-mint">{assessment.scores.readinessScore}/100</p>
            <p className="mt-3 text-xl font-black text-white">{assessment.scores.band}</p>
            <p className="mt-4 border-t border-white/12 pt-4 text-sm leading-6 text-white/65">
              Your full plan uses your age, user type and complete category breakdown to tailor every section.
            </p>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-18">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.14em] text-sea">Your plan preview</p>
            <h2 className="mt-2 text-3xl font-black text-navy sm:text-4xl">Your top three priority areas</h2>
            <p className="mt-4 text-lg leading-8 text-navy/70">
              These are the areas where focused action could make the biggest difference. The full plan turns each
              one into a practical learning guide and five-step action list.
            </p>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {preview.priorityAreas.map((area, index) => (
              <article key={area.category} className="relative overflow-hidden rounded-lg border border-navy/10 bg-white p-6 shadow-[0_18px_50px_rgba(7,29,43,0.07)]">
                <div className="flex items-center justify-between gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy font-black text-white">
                    {index + 1}
                  </span>
                  <span className="rounded-full bg-mint/50 px-3 py-1 text-sm font-black text-navy">{area.score}%</span>
                </div>
                <h3 className="mt-5 text-2xl font-black text-navy">{area.title}</h3>
                <p className="mt-3 text-base leading-7 text-navy/68">{area.whyItMatters}</p>
                <div className="mt-5 border-t border-navy/10 pt-4">
                  <p className="text-sm font-bold text-sea">Full guidance and 5 actions included</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-navy/8 bg-white py-14 sm:py-18">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.14em] text-sea">Inside your full plan</p>
            <h2 className="mt-2 text-3xl font-black text-navy sm:text-4xl">Practical support for the next 30 days</h2>
          </div>
          <div className="mt-8 grid gap-x-8 gap-y-4 md:grid-cols-2">
            {includedFeatures.map((feature) => (
              <article key={feature.number} className="flex gap-5 border-t border-navy/10 py-5">
                <span className="text-sm font-black text-sea">{feature.number}</span>
                <div>
                  <h3 className="text-xl font-black text-navy">{feature.title}</h3>
                  <p className="mt-2 text-base leading-7 text-navy/65">{feature.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg bg-navy p-7 text-center text-white shadow-[0_24px_70px_rgba(7,29,43,0.18)] sm:p-10">
            <p className="text-sm font-black uppercase tracking-[0.14em] text-mint">One personalised plan</p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">Turn your results into confident action</h2>
            <p className="mt-4 text-lg leading-8 text-white/72">
              Your complete roadmap, conversation guide and checklist for the £19 launch price.
            </p>
            <p className="mt-5 text-5xl font-black text-mint">£19</p>
            <p className="mt-1 text-sm font-bold text-white/55">Launch price · one-off payment</p>
            <div className="mt-7">
              <UnlockPlanButton assessmentId={assessment.id} />
            </div>
            <Link href={`/results?id=${assessment.id}`} className="focus-ring mt-5 inline-flex text-sm font-bold text-white/72 underline decoration-white/30 underline-offset-4 hover:text-white">
              Return to my free results
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function PreviewUnavailable({ message }: { message: string }) {
  return (
    <section className="bg-cream py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <div className="rounded-lg border border-navy/10 bg-white p-8 shadow-soft">
          <p className="text-sm font-black uppercase tracking-[0.14em] text-sea">Money Ready Plan</p>
          <h1 className="mt-3 text-3xl font-black text-navy">Your premium preview is not available</h1>
          <p className="mt-4 text-lg leading-8 text-navy/70">{message}</p>
          <Link href="/quiz" className="focus-ring mt-6 inline-flex rounded-full bg-navy px-6 py-3 font-black text-white">
            Take the free assessment
          </Link>
        </div>
      </div>
    </section>
  );
}
