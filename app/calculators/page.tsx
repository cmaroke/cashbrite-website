import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/ButtonLink";
import { createSeoMetadata, JsonLd, siteUrl } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Money Calculators for Students",
  description:
    "Free UK money calculators for students, school leavers and young adults. Start with the Student Budget Calculator and build your money confidence.",
  path: "/calculators",
});

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

      <section className="overflow-hidden bg-navy text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-18 lg:grid-cols-[1fr_0.72fr] lg:px-8 lg:py-20">
          <div>
            <div className="flex items-center gap-3">
              <Image src="/brand/cashbrite-icon.svg" alt="" width={24} height={24} aria-hidden="true" />
              <p className="text-sm font-black uppercase tracking-[0.14em] text-mint">Cashbrite Calculators</p>
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              Calculators
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/74 sm:text-xl sm:leading-9">
              Free money calculators for UK students, school leavers and young adults who want to plan clearly and
              build confidence before real-life money decisions arrive.
            </p>
          </div>
          <div className="relative hidden min-h-52 lg:block" aria-hidden="true">
            <Image src="/brand/cashbrite-icon.svg" alt="" width={86} height={86} className="absolute right-16 top-12" />
            <Image
              src="/brand/cashbrite-icon.svg"
              alt=""
              width={32}
              height={32}
              className="absolute right-44 top-5 opacity-60"
            />
            <Image
              src="/brand/cashbrite-icon.svg"
              alt=""
              width={22}
              height={22}
              className="absolute right-4 top-36 opacity-45"
            />
          </div>
        </div>
      </section>

      <section className="bg-cream py-14 sm:py-18 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <article className="grid overflow-hidden rounded-lg border border-navy/10 bg-white shadow-[0_24px_70px_rgba(7,29,43,0.1)] lg:grid-cols-[1fr_0.72fr]">
            <div className="p-6 sm:p-9 lg:p-12">
              <span className="inline-flex rounded-full bg-mint px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-navy">
                Free calculator
              </span>
              <h2 className="mt-5 max-w-2xl text-3xl font-black leading-tight text-navy sm:text-4xl">
                Student Budget Calculator
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-navy/70">
                Estimate your monthly income, essential costs, flexible spending, savings and money left over. Built
                for students, apprentices and young adults planning real UK money decisions.
              </p>
              <div className="mt-8">
                <ButtonLink href="/student-budget-calculator" variant="secondary">
                  Use the calculator
                </ButtonLink>
              </div>
            </div>
            <div className="grid content-center gap-3 bg-mint/35 p-6 sm:p-8 lg:p-10">
              {["Income", "Essential costs", "Flexible spending", "Savings", "Money left over"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 text-sm font-black text-navy shadow-sm">
                  <span className="h-2.5 w-2.5 rounded-full bg-sea" aria-hidden="true" />
                  {item}
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-18 lg:py-20">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <Image src="/brand/cashbrite-icon.svg" alt="" width={38} height={38} className="mx-auto" aria-hidden="true" />
          <h2 className="mt-5 text-3xl font-black text-navy sm:text-4xl">More Cashbrite calculators are coming</h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-navy/70">
            We are building simple tools for savings, moving out costs and first-job money planning. For now, start
            with your monthly student budget, then take the free quiz to understand your wider money confidence.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="/quiz">Take the free quiz</ButtonLink>
            <ButtonLink href="/resources" variant="secondary">
              Browse resources
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
