import { ContactForm } from "@/components/ContactForm";
import { InfoCard } from "@/components/InfoCard";
import { SectionHeader } from "@/components/SectionHeader";

export default function SchoolsPage() {
  const credibilityPoints = [
    "Created by a former corporate banking professional",
    "Built for UK students preparing for life after school",
    "Designed for PSHE, enrichment and transition support",
  ];

  return (
    <section className="bg-cream py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_0.82fr] lg:px-8">
        <div>
          <SectionHeader
            eyebrow="For schools and colleges"
            title="Practical money education for Year 11, Sixth Form and college students"
            body="Cashbrite supports PSHE, enrichment, transition days and employability programmes with clear sessions on the money decisions young people face next."
          />
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {credibilityPoints.map((point) => (
              <div key={point} className="rounded-lg border border-navy/10 bg-white p-4 text-sm font-black leading-6 text-navy shadow-sm">
                {point}
              </div>
            ))}
          </div>
          <div className="mt-10 grid gap-5">
            <InfoCard title="Relevant to next steps">
              Workshops focus on budgeting, student finance, credit, fraud awareness and confidence before students
              move into work, university or independent living.
            </InfoCard>
            <InfoCard title="Friendly and accessible" tone="mint">
              Sessions use plain English, real-life examples and practical activities that do not assume prior money
              knowledge.
            </InfoCard>
            <InfoCard title="Useful evidence of support">
              Schools can use the quiz and workshop themes to identify confidence gaps and signpost students toward
              further help.
            </InfoCard>
            <InfoCard title="Professional and credible" tone="navy">
              Practical money confidence for sixth forms, colleges and schools, shaped by banking experience and made
              accessible for 16-18 year olds.
            </InfoCard>
          </div>
        </div>
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="mb-5 rounded-lg bg-navy p-6 text-white shadow-soft">
            <p className="text-sm font-black uppercase tracking-[0.14em] text-mint">School enquiry</p>
            <h2 className="mt-3 text-2xl font-black">Book a practical Cashbrite session</h2>
            <p className="mt-3 text-base leading-7 text-white/72">
              Tell us about your year group, setting and goals. The form is front-end only for this MVP.
            </p>
          </div>
          <ContactForm context="school" />
        </aside>
      </div>
    </section>
  );
}
