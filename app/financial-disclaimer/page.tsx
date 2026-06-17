import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Financial Education Disclaimer | Cashbrite",
  description: "Important information about Cashbrite's educational content and Money Readiness Assessment.",
};

const sections = [
  {
    title: "1. Our Purpose",
    content: [
      "Cashbrite exists to improve financial confidence and help young people understand real-world money topics.",
      "Our resources are designed to make everyday financial decisions feel clearer, calmer and less intimidating.",
    ],
  },
  {
    title: "2. Not Financial Advice",
    content: [
      "Cashbrite is an educational platform. The Money Readiness Assessment, scores, personalised action plans, articles and resources are for educational and informational purposes only.",
      "They are not regulated financial advice and should not be relied upon as a recommendation to take, avoid or change any financial product or decision.",
    ],
  },
  {
    title: "3. Personal Circumstances",
    content: [
      "Everyone's financial circumstances are different. What is helpful for one person may not be right for another.",
      "Users should consider independent professional advice where appropriate, especially before making important financial, legal, tax or investment decisions.",
    ],
  },
  {
    title: "4. No Guarantees",
    content: [
      "Improving a Money Readiness Score can be a positive sign of growing knowledge and confidence, but it does not guarantee financial success or specific financial outcomes.",
      "Financial wellbeing depends on many factors, including income, costs, personal circumstances, wider economic conditions and choices made over time.",
    ],
  },
  {
    title: "5. Third Party Services",
    content: [
      "Cashbrite may refer to external organisations, tools or resources that users may find useful.",
      "Those third-party services are separate from Cashbrite. We do not endorse or accept responsibility for their content, services, accuracy, availability or actions.",
    ],
  },
  {
    title: "6. Contact",
    content: ["For questions about this disclaimer, contact Cashbrite at cmaroke@me.com."],
  },
];

export default function FinancialDisclaimerPage() {
  return (
    <section className="bg-cream py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-navy p-6 text-white shadow-soft sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.14em] text-mint">Cashbrite guidance</p>
          <h1 className="mt-3 text-4xl font-black sm:text-5xl">Financial Education Disclaimer</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-white/76">
            Cashbrite is here to support learning and confidence. This page explains the limits of our educational
            content in a clear and friendly way.
          </p>
          <p className="mt-4 text-sm font-semibold text-white/62">Last updated: 17 June 2026</p>
        </div>

        <div className="mt-8 grid gap-5">
          {sections.map((section) => (
            <article
              key={section.title}
              className="rounded-lg border border-navy/10 bg-white p-6 shadow-[0_18px_50px_rgba(7,29,43,0.06)] sm:p-7"
            >
              <h2 className="text-2xl font-black text-navy">{section.title}</h2>
              <div className="mt-4 grid gap-3 text-base leading-8 text-navy/74">
                {section.content.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
