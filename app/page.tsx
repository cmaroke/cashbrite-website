import Image from "next/image";
import { ButtonLink } from "@/components/ButtonLink";
import { InfoCard } from "@/components/InfoCard";
import { Logo } from "@/components/Logo";
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
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:py-20">
          <div>
            <div className="mb-6">
              <Logo href="" />
            </div>
            <p className="mb-4 inline-flex rounded-full border border-sea/15 bg-white px-4 py-2 text-sm font-black uppercase tracking-[0.14em] text-sea shadow-sm">
              UK financial education for young adults
            </p>
            <h1 className="max-w-4xl text-5xl font-black leading-[0.98] tracking-normal text-navy sm:text-6xl lg:text-7xl">
              Money confidence for life after school
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-9 text-navy/75">
              Cashbrite helps students understand budgeting, credit, student finance, scams and real-world money
              decisions.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/quiz">Take the Money Readiness Questionnaire</ButtonLink>
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
          <div className="relative min-h-[360px] overflow-hidden rounded-lg border border-white/70 bg-white shadow-soft sm:min-h-[500px]">
            <Image
              src="/images/cashbrite-hero.png"
              alt="Desk with budgeting notes, a phone and money planning items"
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
            <div className="absolute bottom-5 left-5 max-w-xs rounded-lg border border-white/70 bg-white/92 p-4 shadow-[0_18px_40px_rgba(7,29,43,0.16)] backdrop-blur">
              <p className="text-sm font-black text-navy">Money Readiness Score</p>
              <p className="mt-1 text-sm leading-6 text-navy/68">
                A practical snapshot of strengths, risk areas and next steps for real life after school.
              </p>
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
