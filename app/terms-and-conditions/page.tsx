import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions | Cashbrite",
  description: "The terms that apply when using the Cashbrite website and services.",
};

const sections = [
  {
    title: "1. Introduction",
    content: [
      "These Terms & Conditions govern your use of the Cashbrite website, Money Readiness Assessment, Money Action Plans, educational resources and related services.",
      "By using the Cashbrite website or services, you agree to these terms. If you do not agree with these terms, please do not use the website or services.",
    ],
  },
  {
    title: "2. About Cashbrite",
    content: [
      "Cashbrite provides financial education, information and confidence-building resources for young people, parents, schools and educational organisations in the UK.",
      "Our aim is to help users understand real-world money topics in a clear, practical and supportive way.",
    ],
  },
  {
    title: "3. Educational Purposes Only",
    content: [
      "Cashbrite provides general financial education. Information, assessment scores and action plans are intended to support learning and financial confidence.",
      "Cashbrite content does not constitute personalised financial, legal, tax or investment advice. Users should consider seeking advice from a qualified professional where appropriate.",
    ],
  },
  {
    title: "4. Accuracy Of Information",
    content: [
      "Cashbrite aims to provide accurate and up-to-date information, but we do not guarantee that all content is complete, accurate or suitable for every individual situation.",
      "Financial rules, products and personal circumstances can change, so users should check important information before making decisions.",
    ],
  },
  {
    title: "5. Money Readiness Assessment",
    content: [
      "The Money Readiness Assessment is designed to provide a general indication of financial knowledge and confidence.",
      "Scores and Money Action Plans are based on the responses provided by users. Results should not be interpreted as a professional assessment of financial capability or future financial outcomes.",
      "The assessment and basic results can be used without registration. To receive the complete personalised report, PDF and companion Excel budget tracker, provide the required registration details. No payment or subscription is required. Marketing is optional. Keep private report links confidential; email delays do not prevent immediate online access after successful registration.",
      "Moving to free reporting does not remove access to reports previously purchased or affect your statutory rights relating to those purchases.",
    ],
  },
  {
    title: "6. User Responsibilities",
    content: [
      "Users are responsible for providing accurate information, using Cashbrite information appropriately and making their own financial decisions.",
      "Users should not rely on Cashbrite content as a substitute for professional advice where their circumstances require it.",
    ],
  },
  {
    title: "7. Intellectual Property",
    content: [
      "All Cashbrite content, branding, assessments, resources and materials are owned by Cashbrite or used with permission.",
      "You may download, print and complete your report and templates for your own personal learning. You may not resell or redistribute Cashbrite materials without prior written permission.",
    ],
  },
  {
    title: "8. Privacy And Data",
    content: [
      "Use of personal information is governed by the Cashbrite Privacy Policy.",
      "Please read the Privacy Policy to understand how Cashbrite collects, uses and protects personal data.",
    ],
    link: { href: "/privacy-policy", label: "Read the Privacy Policy" },
  },
  {
    title: "9. Website Availability",
    content: [
      "Cashbrite aims to maintain website availability, but we cannot guarantee uninterrupted access or that the website will always be free from technical errors.",
      "We may update, suspend or withdraw parts of the website or services from time to time.",
    ],
  },
  {
    title: "10. Limitation Of Liability",
    content: [
      "To the extent permitted by law, Cashbrite is not liable for losses arising from reliance on website content, assessment results, Money Action Plans or educational materials.",
      "Nothing in these terms excludes or limits liability where it would be unlawful to do so.",
    ],
  },
  {
    title: "11. Changes To Terms",
    content: [
      "Cashbrite may update these Terms & Conditions from time to time. Users should check the latest version on the website.",
      "Continued use of the website after changes are published means you accept the updated terms.",
    ],
  },
  {
    title: "12. Contact",
    content: ["For questions regarding these terms, contact Cashbrite at cmaroke@me.com."],
  },
];

export default function TermsAndConditionsPage() {
  return (
    <section className="bg-cream section-space">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="border-t-2 border-ink bg-ink p-6 text-white sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-mint">Cashbrite terms</p>
          <h1 className="editorial-heading mt-3 text-4xl md:text-5xl">Terms & Conditions</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-white/76">
            These terms explain how you may use Cashbrite’s website, assessment, action plans and educational
            resources.
          </p>
          <p className="mt-4 text-sm font-semibold text-white/62">Last updated: 12 November 2026</p>
        </div>

        <div className="mt-8 grid gap-5">
          {sections.map((section) => (
            <article
              key={section.title}
              className="border-b border-ink/20 py-6"
            >
              <h2 className="text-2xl font-semibold tracking-tight text-navy">{section.title}</h2>
              <div className="mt-4 grid gap-3 text-base leading-8 text-navy/74">
                {section.content.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              {section.link ? (
                <Link
                  href={section.link.href}
                  className="focus-ring mt-5 inline-flex rounded-full bg-mint px-5 py-3 font-semibold text-navy"
                >
                  {section.link.label}
                </Link>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
