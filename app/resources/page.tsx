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
        <div className="site-container grid items-center gap-10 py-12 sm:py-16 ">
          <div>
            <div className="flex items-center gap-3">
              <Image src="/brand/v2/favicon-dark.svg" alt="" width={24} height={24} aria-hidden="true" />
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-mint">Cashbrite Resources</p>
            </div>
            <h1 className="editorial-heading mt-5 max-w-3xl text-4xl md:text-5xl">
              Free Money Resources
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/74 sm:text-xl sm:leading-9">
              Practical guides, checklists and tools designed to help young people feel confident with money before
              real life starts.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-cream section-space">
        <div className="mx-auto max-w-site px-5 sm:px-8">
          <article className="grid overflow-hidden border-y border-ink/20 bg-white lg:grid-cols-[1.08fr_0.92fr]">
            <div className="p-6 sm:p-8">
              <span className="inline-flex rounded-full bg-mint px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-navy">
                Free PDF
              </span>
              <h2 className="editorial-heading mt-5 max-w-xl text-2xl text-navy md:text-3xl">
                Your First Paycheck Checklist
              </h2>
              <p className="mt-4 max-w-xl text-lg leading-8 text-navy/70">
                The money guide every young person should read before their first salary arrives.
              </p>
              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {checklistBenefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3 text-base font-bold leading-6 text-navy">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mint text-xs font-semibold" aria-hidden="true">
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
              <p className="mt-4 text-sm font-semibold text-ink/75">Two pages. Mobile-friendly. No sign-up required.</p>
            </div>

            <div className="flex items-center justify-center bg-mist p-6 sm:p-8">
              <div className="w-full max-w-sm border border-navy/10 bg-cream p-4 shadow-sm">
                <div className="bg-navy p-6 text-white sm:p-8">
                  <Image
                    src="/brand/v2/wordmark-white.svg"
                    alt="Cashbrite"
                    width={150}
                    height={36}
                    className="h-auto w-32"
                  />
                  <p className="mt-12 text-xs font-bold uppercase tracking-[0.14em] text-mint">Free Money Guide</p>
                  <p className="mt-3 text-2xl font-semibold leading-tight tracking-tight">Your First Paycheck Checklist</p>
                  <p className="mt-5 text-sm leading-6 text-white/72">Build better money habits from payday one.</p>
                  <Image src="/brand/v2/favicon-dark.svg" alt="" width={38} height={38} className="mt-10" aria-hidden="true" />
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

      <section className="bg-white section-space">
        <div className="mx-auto max-w-site px-5 sm:px-8">
          <article className="mb-8 border-b border-ink/20 pb-8">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div>
                <h2 className="editorial-heading text-2xl text-navy md:text-3xl">Looking for calculators?</h2>
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
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-sea">The resource library</p>
            <h2 className="editorial-heading mt-3 text-2xl text-navy md:text-3xl">
              More resources coming soon
            </h2>
            <p className="mt-4 text-lg leading-8 text-navy/68">
              Clear guides for the money moments that arrive as independence grows.
            </p>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {futureResources.map((resource) => (
              <article key={resource.title} className="border-t border-ink/20 py-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold text-sea">{resource.number}</span>
                  <span className="rounded-full border border-navy/10 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-ink/75">
                    Coming Soon
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-semibold leading-7 tracking-tight text-navy">{resource.title}</h3>
                <p className="mt-3 text-base leading-7 text-navy/68">{resource.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-mint/35 section-space">
        <div className="mx-auto max-w-5xl px-5 text-center sm:px-8 lg:px-8">
          <Image src="/brand/v2/mark.svg" alt="" width={38} height={38} className="mx-auto" aria-hidden="true" />
          <h2 className="editorial-heading mt-5 text-2xl text-navy md:text-3xl">
            How Money Ready Are You?
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-navy/70">
            Your first paycheck is just the beginning. Take the free assessment for your Cashbrite Money Confidence
            Snapshot: your score, score band, short interpretation and three priority areas.
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
