import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/ButtonLink";
import { StudentBudgetCalculator } from "@/components/StudentBudgetCalculator";
import { createSeoMetadata, JsonLd, siteUrl } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Student Budget Calculator UK",
  description:
    "Use Cashbrite's free Student Budget Calculator to estimate monthly income, rent, bills, spending, savings and money left over.",
  path: "/student-budget-calculator",
});

const budgetIncludes = [
  "Money coming in, such as student finance, part-time work, apprenticeship wages or family support.",
  "Essential costs, including rent, food, travel, phone bills, course costs and repayments.",
  "Flexible spending, such as social plans, shopping, subscriptions, hobbies and fitness.",
  "Savings goals, so you can see whether your plan leaves room for future costs.",
];

export default function StudentBudgetCalculatorPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Student Budget Calculator",
          url: `${siteUrl}/student-budget-calculator`,
          applicationCategory: "FinanceApplication",
          operatingSystem: "Any",
          description:
            "A free UK student budget calculator to help young people estimate monthly income, spending, savings and remaining money.",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "GBP",
          },
          audience: {
            "@type": "EducationalAudience",
            educationalRole: "student",
          },
          inLanguage: "en-GB",
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "LearningResource",
          name: "Student Budget Calculator",
          url: `${siteUrl}/student-budget-calculator`,
          learningResourceType: "Calculator",
          teaches: ["student budgeting", "monthly spending", "saving money", "money confidence"],
          audience: {
            "@type": "EducationalAudience",
            educationalRole: "student",
          },
          inLanguage: "en-GB",
        }}
      />

      <section className="overflow-hidden bg-cream">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-18 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-20">
          <div>
            <div className="flex items-center gap-3">
              <Image src="/brand/cashbrite-icon.svg" alt="" width={24} height={24} aria-hidden="true" />
              <p className="text-sm font-black uppercase tracking-[0.14em] text-sea">Free Cashbrite tool</p>
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight text-navy sm:text-5xl lg:text-6xl">
              Student Budget Calculator
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-navy/72 sm:text-xl sm:leading-9">
              Plan your monthly income, spending and savings in one place. This free UK student budget calculator helps
              sixth formers, apprentices, university students and young adults see what is left over before the month
              begins.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="#calculator">Use the calculator</ButtonLink>
              <ButtonLink href="/quiz" variant="secondary">
                Take the free quiz
              </ButtonLink>
            </div>
          </div>

          <div className="rounded-lg border border-navy/10 bg-white p-6 shadow-[0_24px_70px_rgba(7,29,43,0.1)] sm:p-8">
            <p className="text-sm font-black uppercase tracking-[0.14em] text-sea">What it helps you see</p>
            <div className="mt-6 grid gap-4">
              {[
                ["Income", "Student finance, wages and other support"],
                ["Spending", "Essential costs and flexible choices"],
                ["Savings", "How much you are setting aside"],
                ["Remaining money", "Whether your budget has breathing room"],
              ].map(([title, copy]) => (
                <div key={title} className="rounded-lg bg-cream p-4">
                  <h2 className="text-lg font-black text-navy">{title}</h2>
                  <p className="mt-1 text-sm font-semibold leading-6 text-navy/65">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-18 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-sea">Before you calculate</p>
              <h2 className="mt-3 text-3xl font-black leading-tight text-navy sm:text-4xl">
                What to include in a student budget
              </h2>
              <p className="mt-4 text-lg leading-8 text-navy/70">
                A good monthly budget is not about being perfect. It is about knowing what money is coming in, what
                needs to go out, and how much flexibility you have for the rest of the month.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col">
                <ButtonLink href="/resources" variant="secondary">
                  Browse free resources
                </ButtonLink>
                <ButtonLink href="/students" variant="light">
                  Money skills for students
                </ButtonLink>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {budgetIncludes.map((item) => (
                <div key={item} className="rounded-lg border border-navy/10 bg-cream p-5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-mint text-sm font-black text-navy">
                    ✓
                  </span>
                  <p className="mt-4 text-base font-bold leading-7 text-navy/75">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="calculator" className="bg-cream py-14 sm:py-18 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.14em] text-sea">Calculate your month</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-navy sm:text-4xl">
              Estimate your student budget
            </h2>
            <p className="mt-4 text-lg leading-8 text-navy/70">
              Add monthly amounts if you know them. If you are planning for termly student finance, divide the term
              amount by the number of months it needs to cover.
            </p>
          </div>
          <StudentBudgetCalculator />
        </div>
      </section>

      <section className="bg-mint/35 py-14 sm:py-18 lg:py-20">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <Image src="/brand/cashbrite-icon.svg" alt="" width={38} height={38} className="mx-auto" aria-hidden="true" />
          <h2 className="mt-5 text-3xl font-black text-navy sm:text-4xl">Want to understand your money confidence?</h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-navy/70">
            Your budget is one part of the picture. Take the free Cashbrite Money Readiness Quiz to get your Cashbrite
            Score and see your top money priority areas.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="/quiz">Take the free quiz</ButtonLink>
            <ButtonLink href="/resources" variant="secondary">
              Explore free tools
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
