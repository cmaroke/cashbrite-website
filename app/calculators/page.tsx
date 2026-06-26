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

      <section className="bg-cream py-10 sm:py-12 lg:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 max-w-4xl">
            <div className="flex items-center gap-3">
              <Image src="/brand/cashbrite-icon.svg" alt="" width={24} height={24} aria-hidden="true" />
              <p className="text-sm font-black uppercase tracking-[0.14em] text-sea">Cashbrite tools</p>
            </div>
            <h1 className="mt-5 text-4xl font-black leading-tight text-navy sm:text-5xl lg:text-6xl">
              Free Money Calculators
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-navy/72 sm:text-xl sm:leading-9">
              Free money tools to help UK students, apprentices and school leavers make confident financial decisions.
            </p>
          </div>
          <StudentBudgetCalculator />
        </div>
      </section>

      <section className="bg-white py-14 sm:py-18 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.14em] text-sea">Coming soon</p>
            <h2 className="mt-3 text-3xl font-black text-navy sm:text-4xl">More tools are on the way</h2>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {comingSoonTools.map((tool) => (
              <article key={tool} className="rounded-lg border border-navy/10 bg-cream p-5 opacity-85">
                <span className="inline-flex rounded-full border border-navy/10 bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-navy/60">
                  Coming Soon
                </span>
                <h3 className="mt-6 text-xl font-black leading-7 text-navy">{tool}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
