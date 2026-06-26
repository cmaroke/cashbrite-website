import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/ButtonLink";
import { createSeoMetadata, JsonLd, siteUrl } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Free Money Resources for Young People",
  description:
    "Free UK money resources from Cashbrite, including practical guides for payslips, budgeting, saving and first paycheck confidence.",
  path: "/resources",
});

const checklistBenefits = [
  "Understand your payslip",
  "Create your first spending plan",
  "Build healthy saving habits",
  "Avoid common money mistakes",
];

const futureResources = [
  {
    number: "01",
    title: "Moving Out Money Checklist",
    description: "Everything you need to know before paying your first bills.",
  },
  {
    number: "02",
    title: "Student Money Survival Guide",
    description: "Understand student finance, budgeting and managing your money independently.",
  },
  {
    number: "03",
    title: "Your First Credit Card Guide",
    description: "Learn how to borrow confidently and avoid expensive mistakes.",
  },
];

export default function ResourcesPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Free Money Resources",
          url: `${siteUrl}/resources`,
          description:
            "Practical UK financial education guides and checklists for young people preparing for work, study and independent money decisions.",
          hasPart: [
            {
              "@type": "LearningResource",
              name: "Your First Paycheck Checklist",
              url: `${siteUrl}/api/resources/first-paycheck-checklist`,
              learningResourceType: "Checklist",
              teaches: ["payslips", "budgeting", "saving habits", "first pay cheque money skills"],
              audience: {
                "@type": "EducationalAudience",
                educationalRole: "student",
              },
              inLanguage: "en-GB",
            },
          ],
        }}
      />
      <section className="overflow-hidden bg-navy text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-18 lg:grid-cols-[1fr_0.72fr] lg:px-8 lg:py-20">
          <div>
            <div className="flex items-center gap-3">
              <Image src="/brand/cashbrite-icon.svg" alt="" width={24} height={24} aria-hidden="true" />
              <p className="text-sm font-black uppercase tracking-[0.14em] text-mint">Cashbrite Resources</p>
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              Free Money Resources
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/74 sm:text-xl sm:leading-9">
              Practical guides, checklists and tools designed to help young people feel confident with money before
              real life starts.
            </p>
          </div>
          <div className="relative hidden min-h-52 lg:block" aria-hidden="true">
            <Image src="/brand/cashbrite-icon.svg" alt="" width={86} height={86} className="absolute right-16 top-12" />
            <Image src="/brand/cashbrite-icon.svg" alt="" width={32} height={32} className="absolute right-44 top-5 opacity-60" />
            <Image src="/brand/cashbrite-icon.svg" alt="" width={22} height={22} className="absolute right-4 top-36 opacity-45" />
          </div>
        </div>
      </section>

      <section className="bg-cream py-14 sm:py-18 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <article className="grid overflow-hidden rounded-lg border border-navy/10 bg-white shadow-[0_24px_70px_rgba(7,29,43,0.1)] lg:grid-cols-[1.08fr_0.92fr]">
            <div className="p-6 sm:p-9 lg:p-12">
              <span className="inline-flex rounded-full bg-mint px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-navy">
                Free PDF
              </span>
              <h2 className="mt-5 max-w-xl text-3xl font-black leading-tight text-navy sm:text-4xl">
                Your First Paycheck Checklist
              </h2>
              <p className="mt-4 max-w-xl text-lg leading-8 text-navy/70">
                The money guide every young person should read before their first salary arrives.
              </p>
              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {checklistBenefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3 text-base font-bold leading-6 text-navy">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mint text-xs font-black" aria-hidden="true">
                      &#10003;
                    </span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <ButtonLink href="/api/resources/first-paycheck-checklist" variant="secondary">
                  Download Free Checklist
                </ButtonLink>
              </div>
              <p className="mt-4 text-sm font-semibold text-navy/55">Two pages. Mobile-friendly. No sign-up required.</p>
            </div>

            <div className="flex items-center justify-center bg-mint/35 p-7 sm:p-10 lg:p-12">
              <div className="w-full max-w-sm rotate-[1.5deg] border border-navy/10 bg-cream p-4 shadow-[0_24px_55px_rgba(7,29,43,0.18)]">
                <div className="bg-navy p-6 text-white sm:p-8">
                  <Image
                    src="/brand/cashbrite-logo-white.svg"
                    alt="Cashbrite"
                    width={150}
                    height={36}
                    className="h-auto w-32"
                  />
                  <p className="mt-12 text-xs font-black uppercase tracking-[0.14em] text-mint">Free Money Guide</p>
                  <p className="mt-3 text-3xl font-black leading-tight">Your First Paycheck Checklist</p>
                  <p className="mt-5 text-sm leading-6 text-white/72">Build better money habits from payday one.</p>
                  <Image src="/brand/cashbrite-icon.svg" alt="" width={38} height={38} className="mt-10" aria-hidden="true" />
                </div>
                <div className="grid gap-2 bg-white p-5" aria-hidden="true">
                  {["Bank account ready", "Payslip checked", "Spending plan set"].map((item) => (
                    <div key={item} className="flex items-center gap-3 text-sm font-bold text-navy/72">
                      <span className="h-4 w-4 border border-sea" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-18 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <article className="mb-12 rounded-lg border border-navy/10 bg-cream p-6 shadow-[0_18px_50px_rgba(7,29,43,0.08)] sm:p-8">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div>
                <h2 className="text-2xl font-black text-navy sm:text-3xl">Looking for calculators?</h2>
                <p className="mt-3 max-w-2xl text-lg leading-8 text-navy/70">
                  Try our free Cashbrite calculators to plan your student budget and build money confidence.
                </p>
              </div>
              <ButtonLink href="/calculators" variant="secondary">
                View calculators
              </ButtonLink>
            </div>
          </article>

          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.14em] text-sea">The resource library</p>
            <h2 className="mt-3 text-3xl font-black text-navy sm:text-4xl">More resources coming soon</h2>
            <p className="mt-4 text-lg leading-8 text-navy/68">
              Clear guides for the money moments that arrive as independence grows.
            </p>
          </div>

          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {futureResources.map((resource) => (
              <article key={resource.title} className="rounded-lg border border-navy/10 bg-cream p-6">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-black text-sea">{resource.number}</span>
                  <span className="rounded-full border border-navy/10 bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-navy/60">
                    Coming Soon
                  </span>
                </div>
                <h3 className="mt-7 text-xl font-black leading-7 text-navy">{resource.title}</h3>
                <p className="mt-3 text-base leading-7 text-navy/68">{resource.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-mint/35 py-14 sm:py-18 lg:py-20">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <Image src="/brand/cashbrite-icon.svg" alt="" width={38} height={38} className="mx-auto" aria-hidden="true" />
          <h2 className="mt-5 text-3xl font-black text-navy sm:text-4xl">How Money Ready Are You?</h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-navy/70">
            Your first paycheck is just the beginning. Discover your Money Readiness Score and get personalised
            guidance based on your biggest opportunities.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="/quiz">Take the Free Money Assessment</ButtonLink>
            <ButtonLink href="/students" variant="secondary">
              Learn money skills
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
