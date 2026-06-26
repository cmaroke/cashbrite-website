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

      <section className="bg-cream py-10 sm:py-12 lg:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 max-w-4xl">
            <div className="flex items-center gap-3">
              <Image src="/brand/cashbrite-icon.svg" alt="" width={24} height={24} aria-hidden="true" />
              <p className="text-sm font-black uppercase tracking-[0.14em] text-sea">Free Cashbrite tool</p>
            </div>
            <h1 className="mt-5 text-4xl font-black leading-tight text-navy sm:text-5xl lg:text-6xl">
              Student Budget Calculator
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-navy/72 sm:text-xl sm:leading-9">
              Plan your monthly income, spending and savings in one place. Add monthly amounts if you know them, or
              divide termly student finance by the number of months it needs to cover.
            </p>
            <p className="mt-3 max-w-3xl text-base font-semibold leading-7 text-navy/62">
              The calculator updates as you type, helping you see your remaining money, savings rate and budget health.
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
