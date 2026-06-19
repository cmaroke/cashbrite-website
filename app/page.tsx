import Image from "next/image";
import { ButtonLink } from "@/components/ButtonLink";
import { InfoCard } from "@/components/InfoCard";
import { SectionHeader } from "@/components/SectionHeader";

export default function Home() {
  const trustItems = [
    "Created by a former corporate banking professional",
    "Built for UK students preparing for life after school",
    "Practical money confidence for sixth forms, colleges and schools",
  ];

  return (
    <>
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
          <div className="relative min-h-[520px] overflow-hidden rounded-lg border border-white/70 bg-white shadow-soft sm:min-h-[500px]">
            <Image
              src="/images/cashbrite-hero.png"
              alt="Student planning at a desk with a laptop, phone and notebook"
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
            <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/75 bg-white/94 p-4 shadow-[0_22px_55px_rgba(7,29,43,0.18)] backdrop-blur sm:inset-x-auto sm:bottom-5 sm:left-5 sm:w-[22rem] sm:p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-sea">
                    Cashbrite Money Readiness Score
                  </p>
                  <p className="mt-2 text-4xl font-black leading-none text-navy">
                    72<span className="text-xl text-navy/50">/100</span>
                  </p>
                </div>
                <div className="rounded-full bg-mint px-3 py-1 text-xs font-black text-navy">Building confidence</div>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-navy/55">Strengths</p>
                  <ul className="mt-2 grid gap-2 text-sm font-bold text-navy">
                    <li className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-mint text-xs">✓</span>
                      Budgeting basics
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-mint text-xs">✓</span>
                      Saving habits
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-navy/55">Areas to improve</p>
                  <ul className="mt-2 grid gap-2 text-sm font-bold text-navy/75">
                    <li className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-sea" aria-hidden="true" />
                      Credit scores
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-sea" aria-hidden="true" />
                      Student finance
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-8">
          <div className="flex justify-center lg:justify-start">
            <div className="relative flex aspect-square w-full max-w-[18rem] items-center justify-center rounded-full border border-sea/15 bg-cream shadow-[0_24px_70px_rgba(7,29,43,0.08)] sm:max-w-[22rem]">
              <div className="absolute inset-6 rounded-full border border-white bg-mint/45" aria-hidden="true" />
              <div className="relative flex h-36 w-36 items-center justify-center rounded-full bg-white text-center text-sm font-black uppercase tracking-[0.14em] text-sea shadow-sm sm:h-44 sm:w-44">
                Founder Photo
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.14em] text-sea">Meet the Founder</p>
            <h2 className="mt-3 max-w-3xl text-3xl font-black leading-tight text-navy sm:text-4xl lg:text-5xl">
              Helping the next generation feel confident with money.
            </h2>
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
