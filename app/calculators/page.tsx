import type { Metadata } from "next";
import Image from "next/image";
import { StudentBudgetCalculator } from "@/components/StudentBudgetCalculator";
import { createSeoMetadata, JsonLd, siteUrl } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Money Calculators for Students",
  description:
    "Free UK money calculators for students, school leavers and young adults. Start with the Student Budget Calculator and build your money confidence.",
  path: "/calculators",
});

const comingSoonTools = [
  "Student Loan Calculator",
  "Moving Out Calculator",
  "First Payslip Calculator",
  "Savings Goal Calculator",
];

export default function CalculatorsPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Money Calculators for Students",
          url: `${siteUrl}/calculators`,
          description:
            "Free UK money calculators for students, school leavers and young adults planning budgets, spending and savings.",
          hasPart: [
            {
              "@type": "WebApplication",
              name: "Student Budget Calculator",
              url: `${siteUrl}/student-budget-calculator`,
              applicationCategory: "FinanceApplication",
              operatingSystem: "Any",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "GBP",
              },
            },
          ],
        }}
      />

      <section className="bg-cream py-7 sm:py-9 lg:py-10">
        <div className="mx-auto max-w-site px-5 sm:px-8">
          <div className="mb-5 max-w-4xl">
            <div className="flex items-center gap-3">
              <Image src="/brand/v2/mark.svg" alt="" width={24} height={24} aria-hidden="true" />
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-sea">Cashbrite calculators</p>
            </div>
            <h1 className="editorial-heading mt-4 text-4xl text-navy md:text-5xl">
              Money Calculators
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-navy/72 sm:text-lg sm:leading-8">
              Simple tools to help UK students, apprentices and school leavers plan their money with more confidence.
            </p>
          </div>
          <h2 className="mb-4 text-2xl font-semibold tracking-tight text-navy md:text-3xl">
            Free Student Budget Calculator
          </h2>
          <StudentBudgetCalculator />
        </div>
      </section>

      <section className="bg-white py-10 sm:py-12 lg:py-14">
        <div className="mx-auto max-w-site px-5 sm:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-sea">Coming soon</p>
            <h2 className="editorial-heading mt-3 text-2xl text-navy md:text-3xl">
              More tools are on the way
            </h2>
          </div>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {comingSoonTools.map((tool) => (
              <article key={tool} className="border-t border-ink/20 py-4">
                <span className="inline-flex rounded-full border border-navy/10 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-navy/60">
                  Coming Soon
                </span>
                <h3 className="mt-3 text-lg font-semibold leading-7 tracking-tight text-navy">{tool}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
