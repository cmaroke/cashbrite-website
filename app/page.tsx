import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/ButtonLink";
import { InfoCard } from "@/components/InfoCard";
import { SectionHeader } from "@/components/SectionHeader";
import { createSeoMetadata, JsonLd, siteUrl } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Financial Education for Students and School Leavers",
  description:
    "Cashbrite helps UK young people build money confidence for life after school with a free Money Readiness Assessment, resources and school workshops.",
  path: "/",
});

export default function Home() {
  const trustItems = [
    "Created by a former corporate banking professional",
    "Built for UK students preparing for life after school",
    "Practical money confidence for sixth forms, colleges and schools",
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Financial Education for Students and School Leavers",
          url: siteUrl,
          description:
            "Cashbrite helps UK young people build money confidence for life after school with a free Money Readiness Assessment, resources and school workshops.",
          about: [
            "financial education for students",
            "money confidence for school leavers",
            "budgeting for teenagers",
            "student money skills",
          ],
        }}
      />
      <section className="overflow-hidden bg-cream">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 sm:py-12 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:py-14">
          <div className="py-1 sm:py-2 lg:py-0">
            <h1 className="max-w-4xl text-4xl font-black leading-[1.03] tracking-normal text-navy sm:text-6xl lg:text-7xl">
              Money confidence for life after school.
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-9 text-navy/75">
              From first payslips and student finance to budgeting, borrowing and everyday money decisions, Cashbrite
              helps young people build the confidence they need for the next chapter.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/quiz">Take the Free Money Assessment</ButtonLink>
              <ButtonLink href="/schools" variant="secondary">
                For Schools
              </ButtonLink>
            </div>
            <div className="mt-8 grid gap-3 text-sm font-bold text-navy/72">
              {trustItems.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-sea" aria-hidden="true" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative min-h-[520px] overflow-hidden rounded-lg border border-white/70 bg-white p-4 shadow-soft sm:min-h-[500px] sm:p-6">
            <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-mint/45" aria-hidden="true" />
            <div className="absolute -bottom-12 -left-12 h-52 w-52 rounded-full bg-cream" aria-hidden="true" />
            <div className="absolute right-8 top-10 text-5xl font-black text-mint/80" aria-hidden="true">
              ✦
            </div>
            <div className="absolute bottom-16 right-12 text-3xl font-black text-sea/35" aria-hidden="true">
              ✦
            </div>

            <div
              className="relative flex min-h-[488px] flex-col justify-center gap-4 sm:min-h-[452px] sm:gap-5"
              aria-label="Cashbrite product preview showing a sample score, action plan and budget tracker"
            >
              <div className="rounded-2xl border border-navy/10 bg-navy p-5 text-white shadow-[0_24px_70px_rgba(7,29,43,0.24)] sm:p-7">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-mint">Cashbrite Score</p>
                    <p className="mt-3 text-6xl font-black leading-none">
                      72<span className="text-2xl text-white/50">/100</span>
                    </p>
                  </div>
                  <div className="w-fit rounded-full bg-mint px-3 py-1.5 text-xs font-black text-navy">
                    Building Confidence
                  </div>
                </div>

                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-white/10 bg-white/8 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-white/55">Strengths</p>
                    <ul className="mt-3 grid gap-2 text-sm font-bold text-white">
                      {["Budgeting basics", "Saving habits"].map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <span
                            className="flex h-5 w-5 items-center justify-center rounded-full bg-mint text-xs text-navy"
                            aria-hidden="true"
                          >
                            ✓
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/8 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-white/55">Areas to improve</p>
                    <ul className="mt-3 grid gap-2 text-sm font-bold text-white/78">
                      {["Credit scores", "Student finance"].map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-mint" aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-navy/10 bg-cream/95 p-5 shadow-[0_18px_50px_rgba(7,29,43,0.1)]">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-black text-navy">Personalised Action Plan</p>
                    <span className="text-2xl font-black text-sea" aria-hidden="true">
                      ✦
                    </span>
                  </div>
                  <div className="mt-5 grid gap-2" aria-hidden="true">
                    <span className="h-2 rounded-full bg-navy/18" />
                    <span className="h-2 w-4/5 rounded-full bg-sea/35" />
                    <span className="h-2 w-3/5 rounded-full bg-mint" />
                  </div>
                </div>
                <div className="rounded-2xl border border-navy/10 bg-mint p-5 shadow-[0_18px_50px_rgba(35,133,111,0.12)]">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-black text-navy">Bonus Budget Tracker</p>
                    <span className="rounded-full bg-white px-2.5 py-1 text-xs font-black text-navy">Excel</span>
                  </div>
                  <div className="mt-5 grid grid-cols-3 gap-2" aria-hidden="true">
                    <span className="h-10 rounded-md bg-white/70" />
                    <span className="h-10 rounded-md bg-white/55" />
                    <span className="h-10 rounded-md bg-white/70" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="relative h-[90px] w-[90px] shrink-0 overflow-hidden rounded-full border-2 border-mint bg-cream shadow-[0_10px_28px_rgba(7,29,43,0.12)] sm:h-[145px] sm:w-[145px]">
                <Image
                  src="/images/chandni-founder.jpg"
                  alt="Chandni Josson, founder of Cashbrite"
                  fill
                  sizes="(min-width: 640px) 145px, 90px"
                  className="scale-[1.34] object-cover object-[50%_25%] grayscale brightness-[1.08] contrast-[1.03]"
                />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-[0.14em] text-sea">Meet the Founder</p>
                <h2 className="mt-3 max-w-3xl text-3xl font-black leading-tight text-navy sm:text-4xl lg:text-5xl">
                  Helping the next generation feel confident with money.
                </h2>
              </div>
            </div>
            <div className="mt-6 grid max-w-3xl gap-5 text-lg leading-8 text-navy/72">
              <p>Hi, I&apos;m Chandni, the founder of Cashbrite.</p>
              <p>
                As a banking professional, I have seen first-hand how confidence and knowledge can transform the way
                people make financial decisions.
              </p>
              <p>
                But one thing became increasingly clear: many young people leave school without feeling prepared for the
                everyday money decisions that come with adult life &mdash; from understanding a payslip and managing a
                budget to navigating student finance, credit and scams.
              </p>
              <p>I created Cashbrite to bridge that gap.</p>
              <p>
                My mission is simple: to give young people the knowledge, confidence and practical skills they need to
                take their first steps towards financial independence.
              </p>
            </div>
            <div className="mt-8 rounded-lg border border-sea/15 bg-mint/45 p-5 shadow-[0_16px_45px_rgba(7,29,43,0.06)]">
              <p className="text-xl font-black leading-8 text-navy">
                &quot;Because money confidence shouldn&apos;t start after school &mdash; it should start before life
                after school begins.&quot;
              </p>
            </div>
            <div className="mt-6 rounded-lg border border-navy/10 bg-cream p-5 shadow-[0_14px_36px_rgba(7,29,43,0.05)]">
              <p className="text-sm font-black uppercase tracking-[0.14em] text-sea">Founder credibility</p>
              <p className="mt-3 text-base font-bold leading-7 text-navy/72">
                Cashbrite combines professional banking experience with plain-English financial education, helping
                students, parents and schools turn everyday money topics into practical confidence.
              </p>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {["Banking Professional", "Parent Perspective", "Practical Financial Education"].map((badge) => (
                <div
                  key={badge}
                  className="rounded-lg border border-navy/10 bg-cream px-4 py-3 text-sm font-black text-navy shadow-sm"
                >
                  {badge}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <article className="relative overflow-hidden rounded-lg border border-navy/10 bg-white p-6 shadow-[0_24px_70px_rgba(7,29,43,0.08)] sm:p-8 lg:p-10">
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-mint/45" aria-hidden="true" />
            <div className="absolute bottom-8 right-10 hidden text-5xl font-black text-mint/45 sm:block" aria-hidden="true">
              ✦
            </div>
            <div className="relative grid gap-8 lg:grid-cols-[1fr_0.82fr] lg:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-sm font-black uppercase tracking-[0.14em] text-sea">Coming Soon</p>
                  <span className="rounded-full bg-mint px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-navy">
                    Coming 2027
                  </span>
                </div>
                <h2 className="mt-4 max-w-3xl text-3xl font-black leading-tight text-navy sm:text-4xl lg:text-5xl">
                  The Cashbrite Student Money Confidence Index
                </h2>
                <div className="mt-5 grid max-w-3xl gap-4 text-lg leading-8 text-navy/72">
                  <p>
                    Cashbrite is building a picture of how prepared young people really feel about money before adult
                    life starts.
                  </p>
                  <p>
                    Using anonymised assessment data, the Student Money Confidence Index will highlight common
                    confidence gaps, money habits and emerging trends among students and school leavers across the UK.
                  </p>
                </div>
                <p className="mt-6 rounded-md border border-sea/15 bg-mint/25 px-4 py-3 text-sm font-black leading-6 text-navy">
                  Launching after our first 1,000 assessments.
                </p>
              </div>

              <div className="rounded-lg border border-navy/10 bg-cream p-5 shadow-[0_18px_50px_rgba(7,29,43,0.06)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-sea">Insights preview</p>
                    <p className="mt-2 text-xl font-black text-navy">Future report dashboard</p>
                  </div>
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-navy text-2xl font-black text-mint" aria-hidden="true">
                    ↗
                  </span>
                </div>
                <div className="mt-6 grid gap-3">
                  {[
                    "Average Money Confidence Score",
                    "Top Student Knowledge Gaps",
                    "Assessment Insights",
                  ].map((stat) => (
                    <div key={stat} className="rounded-md border border-navy/10 bg-white p-4">
                      <p className="text-sm font-black text-navy">{stat}</p>
                      <p className="mt-2 text-sm font-semibold text-sea">— Coming Soon</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="border-y border-navy/10 bg-white py-8">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          {trustItems.map((item) => (
            <div key={item} className="rounded-lg bg-cream px-5 py-4 text-sm font-black leading-6 text-navy">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="What Cashbrite does"
            title="Clear money lessons for decisions that arrive fast"
            body="We turn practical financial topics into friendly workshops, quizzes and resources that help young people act with more confidence."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <InfoCard title="Budgeting basics">
              Plan around real costs, regular payments and the pressure points that can catch people out.
            </InfoCard>
            <InfoCard title="Credit and borrowing" tone="mint">
              Understand overdrafts, credit cards, buy now pay later and the habits that protect future choices.
            </InfoCard>
            <InfoCard title="Scam awareness">
              Learn how fraudsters create urgency, what to check, and where to get help before money moves.
            </InfoCard>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/students" variant="secondary">
              Money skills for students
            </ButtonLink>
            <ButtonLink href="/resources" variant="secondary">
              Explore free resources
            </ButtonLink>
            <ButtonLink href="/student-budget-calculator" variant="light">
              Try the budget calculator
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="bg-mint/35 py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <InfoCard title="Who it helps">
            Cashbrite is built for Year 11 pupils, sixth formers, college students, university starters and young
            adults who want simple, practical guidance without jargon.
          </InfoCard>
          <InfoCard title="Why it matters" tone="default">
            Money decisions often arrive before confidence does. Good financial education helps students avoid panic,
            spot risks early and make choices they understand.
          </InfoCard>
          <InfoCard title="How it feels" tone="navy">
            Calm, practical and confidence-building: students leave with language they understand and steps they can
            actually use.
          </InfoCard>
        </div>
      </section>

      <section className="bg-navy py-20 text-white" id="book-workshop">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-4 sm:px-6 md:flex-row md:items-center lg:px-8">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.14em] text-mint">Book a workshop</p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">Bring Cashbrite into your school or college</h2>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-white/75">
              Practical money confidence for sixth forms, colleges and schools, designed for the decisions students
              meet next.
            </p>
          </div>
          <ButtonLink href="/schools" variant="secondary">
            Enquire for schools
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
