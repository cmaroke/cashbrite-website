import type { Metadata } from "next";
import { ButtonLink } from "@/components/ButtonLink";
import { InfoCard } from "@/components/InfoCard";
import { SectionHeader } from "@/components/SectionHeader";
import { createSeoMetadata, JsonLd, siteUrl } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Money Skills for Students and Young People",
  description:
    "Simple UK money skills for students, school leavers and young adults covering budgeting, saving, credit, scams and life after school decisions.",
  path: "/students",
});

export default function StudentsPage() {
  return (
    <section className="bg-cream py-16">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "LearningResource",
          name: "Cashbrite Money Skills for Students",
          url: `${siteUrl}/students`,
          description:
            "Plain-English financial education for UK students and young people preparing for work, university and independent money decisions.",
          educationalLevel: "Secondary education, college and early adulthood",
          audience: {
            "@type": "EducationalAudience",
            educationalRole: "student",
          },
          learningResourceType: "Financial education resource",
          teaches: ["budgeting", "saving", "credit awareness", "student finance", "fraud awareness"],
          inLanguage: "en-GB",
        }}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="For students"
          headingLevel="h1"
          title="Feel clearer about money before the big choices arrive"
          body="Cashbrite explains budgeting, student money skills and everyday money choices in plain language, with examples that match life after school."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <InfoCard title="Know what your money needs to cover">
            Learn how to split money across essentials, travel, study costs, savings and flexible spending.
          </InfoCard>
          <InfoCard title="Avoid expensive mistakes">
            Understand credit, overdrafts and scams before they become stressful.
          </InfoCard>
          <InfoCard title="Build confidence">
            Get used to asking good questions and checking information before making decisions.
          </InfoCard>
        </div>
        <div className="mt-10 rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black text-navy">Start with your Money Readiness score</h2>
          <p className="mt-3 max-w-3xl text-lg leading-8 text-navy/72">
            The 5-minute Money Readiness Assessment uses 30 practical questions to show where you are already strong,
            plus where a bit more guidance could help.
          </p>
          <div className="mt-6">
            <ButtonLink href="/quiz">Take the quiz</ButtonLink>
          </div>
        </div>
        <div className="mt-6 rounded-lg border border-navy/10 bg-mint/35 p-6">
          <h2 className="text-2xl font-black text-navy">Plan a monthly student budget</h2>
          <p className="mt-3 max-w-3xl text-lg leading-8 text-navy/72">
            Use the free Student Budget Calculator to estimate income, rent, travel, spending, savings and money left
            over each month.
          </p>
          <div className="mt-6">
            <ButtonLink href="/student-budget-calculator" variant="secondary">
              Use the budget calculator
            </ButtonLink>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3 text-sm font-bold text-navy/70">
          <ButtonLink href="/resources" variant="secondary">
            Browse free resources
          </ButtonLink>
          <ButtonLink href="/schools" variant="secondary">
            For schools and colleges
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
