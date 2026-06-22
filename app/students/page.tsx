import { ButtonLink } from "@/components/ButtonLink";
import { InfoCard } from "@/components/InfoCard";
import { SectionHeader } from "@/components/SectionHeader";

export default function StudentsPage() {
  return (
    <section className="bg-cream py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="For students"
          title="Feel clearer about money before the big choices arrive"
          body="Cashbrite explains money in plain language, with examples that match life after school."
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
      </div>
    </section>
  );
}
