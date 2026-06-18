import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Cashbrite",
  description: "How Cashbrite collects, uses and protects personal information.",
};

const sections = [
  {
    title: "1. Who We Are",
    content: [
      "Cashbrite is a UK financial education platform that provides Money Readiness Assessments, personalised Money Action Plans, financial education resources and school programmes.",
      "For privacy questions, you can contact Cashbrite at cmaroke@me.com.",
    ],
  },
  {
    title: "2. Information We Collect",
    content: [
      "We may collect your name, age, email address and current education stage, such as school, college or sixth form, university or other.",
      "When you complete the Money Readiness Assessment, we may collect your assessment results, Money Readiness Score, category scores, areas for improvement, strengths, risk areas and generated Money Action Plan information.",
      "We may collect marketing preferences, enquiry information submitted through our forms, and website analytics or technical data where applicable.",
    ],
  },
  {
    title: "3. How We Use Your Information",
    content: [
      "We use personal information to provide personalised Money Action Plans, email assessment reports, improve Cashbrite products and services, and understand common financial knowledge gaps.",
      "We also use information to respond to enquiries and, where you have consented, send updates, resources and offers from Cashbrite.",
    ],
  },
  {
    title: "4. Legal Basis For Processing",
    content: [
      "Under UK GDPR, we rely on consent where you agree to receive your Money Action Plan by email or choose to receive marketing communications.",
      "We may rely on legitimate interests to improve Cashbrite services, understand common learning needs and respond to enquiries in a proportionate way.",
      "Where Cashbrite provides services to a school, organisation or customer, we may process information where it is necessary for a contract or steps connected with a contract.",
    ],
  },
  {
    title: "5. Marketing Communications",
    content: [
      "Marketing emails are optional. You can choose whether to receive occasional Cashbrite updates, resources and offers.",
      "You can unsubscribe or withdraw marketing consent at any time by contacting cmaroke@me.com or using any unsubscribe option provided in our emails.",
      "We will not sell your personal information.",
    ],
  },
  {
    title: "6. Data Storage And Security",
    content: [
      "Cashbrite uses trusted service providers to run the website, store assessment information and deliver emails. These include Vercel for website hosting, Neon for database services and Resend for email delivery.",
      "We take reasonable security measures to protect personal data from unauthorised access, loss, misuse or disclosure. No online service can be guaranteed to be completely secure, but we aim to handle personal data carefully and responsibly.",
    ],
  },
  {
    title: "7. Data Retention",
    content: [
      "We keep personal information only for as long as necessary to provide Cashbrite services, comply with legal obligations, respond to enquiries, maintain records and improve the Cashbrite platform.",
      "If information is no longer needed, we will delete it or anonymise it where appropriate.",
    ],
  },
  {
    title: "8. Children's Privacy",
    content: [
      "The Cashbrite Money Readiness Assessment is designed for young people, including students preparing for life after school.",
      "Where users are under the relevant age of consent or are completing the assessment through a school or organisation, parental, guardian or school involvement may be appropriate. Schools and adults supporting young people should make sure students understand how their information will be used.",
    ],
  },
  {
    title: "9. Your Rights",
    content: [
      "Under UK GDPR, you may have the right to access your personal data, correct inaccurate data, request deletion of your data, withdraw consent for marketing and object to certain uses of your data.",
      "You also have the right to make a complaint to the Information Commissioner's Office (ICO) if you are unhappy with how your personal information has been handled.",
    ],
  },
  {
    title: "10. Contact Us",
    content: [
      "For privacy questions, requests or concerns, contact Cashbrite at cmaroke@me.com.",
      "We may need to ask for information to confirm your identity before responding to certain privacy requests.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <section className="bg-cream py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-navy p-6 text-white shadow-soft sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.14em] text-mint">Cashbrite privacy</p>
          <h1 className="mt-3 text-4xl font-black sm:text-5xl">Privacy Policy</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-white/76">
            This policy explains how Cashbrite collects, uses and protects personal information from students, parents,
            teachers, schools and other website visitors.
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

        <div className="mt-8 rounded-lg border border-navy/10 bg-mint/35 p-6">
          <h2 className="text-2xl font-black text-navy">Questions about your data?</h2>
          <p className="mt-3 text-base leading-7 text-navy/72">
            Email <span className="font-black text-navy">cmaroke@me.com</span> with any privacy request or concern.
          </p>
          <Link
            href="/contact"
            className="focus-ring mt-5 inline-flex rounded-full bg-navy px-5 py-3 font-black text-white"
          >
            Contact Cashbrite
          </Link>
        </div>
      </div>
    </section>
  );
}
