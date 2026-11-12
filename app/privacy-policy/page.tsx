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
      "You can complete the assessment and view your score without entering personal details. Answer IDs stay in this browser tab for up to 24 hours to support recovery and calculate your basic results. They are not sent to our assessment database before you request your full report.",
      "If you choose Get My Full Report, we collect your name, age and email address, optional referral source and separate report and marketing choices. Your answers are then sent securely to generate your report; we retain your scores, strengths, priorities and Action Plan rather than a separate list of individual answers. Older registrations may also include education stage.",
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
      "We ask you to agree to the use of your details to create and email the full report you request. Marketing is a separate optional choice and is not required for report access. Assessment, reporting, PDF and companion spreadsheet access do not require payment.",
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
      "New reports use an unguessable private access link and a secure, HTTP-only browser cookie, lasting up to 30 days, to protect access. We store a hash of the access key, not the reusable key itself, in our database. The email link contains a fragment which is exchanged privately and removed from the address bar. Keep report links confidential. Clearing cookies may require reopening your email link.",
      "New report requests do not use Stripe. We retain historical transaction and delivery records and continue supporting original purchase access links; Cashbrite does not store full card details.",
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
      "Report registration accepts ages 13 and over. This is a self-declared age, not identity or age verification. If you are under 18, you can ask a trusted adult to help you understand this notice. Marketing is off unless separately selected. Do not enter bank details or account numbers. Contact us if information has been submitted about a child under 13.",
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
    id: "analytics",
    title: "10. Optional Analytics And Your Choice",
    content: [
      "Google Analytics 4 and Vercel Web Analytics are optional. Neither is loaded by Cashbrite until you choose Allow analytics. Rejecting analytics does not affect the assessment, results, registration or downloads. This choice is separate from report and marketing choices.",
      "Google Analytics may use cookies and identifiers to measure public-page visits and browser/device information. Vercel Web Analytics uses a request-derived visitor hash rather than analytics cookies and provides aggregate traffic information. We use these tools to understand public-page use and improve the website, not to provide financial advice or make decisions about you.",
      "Google Analytics is excluded from assessment, results and private report routes. With analytics opt-in, Vercel may receive fixed journey events such as assessment started, completed, basic results viewed, full report requested, registration completed, report generated and successful download. These events have no custom personal properties; only a clean page path is sent, without query strings or fragments. Sensitive-page views, access-link exchange and API routes are excluded. We do not send names, email addresses, ages, answers, scores or private report keys to analytics providers. Google advertising storage and personalisation are not enabled.",
      "We use opt-in consent for both tools rather than assuming a cookieless or statistical-purpose exemption applies. Use Analytics preferences in the footer at any time to allow, reject or withdraw analytics. Withdrawing stops future collection by our analytics integration, clears accessible Google Analytics cookies and reloads the page to remove loaded tracking scripts; it does not undo data already sent.",
      "Your analytics choice and its date are stored on this device for up to 180 days, solely to remember your preference. Expired or unreadable preferences default to analytics being off. If storage is unavailable, the preference may last only for the current page. Clearing browser storage can make the choice appear again.",
      "Google and Vercel process analytics information as service providers. For questions about retention, international processing or your data rights, contact cmaroke@me.com. Our analytics settings and provider arrangements remain subject to privacy review.",
    ],
  },
  {
    title: "11. Contact Us",
    content: [
      "For privacy questions, requests or concerns, contact Cashbrite at cmaroke@me.com.",
      "We may need to ask for information to confirm your identity before responding to certain privacy requests.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <section className="bg-cream section-space">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="border-t-2 border-ink bg-ink p-6 text-white sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-mint">Cashbrite privacy</p>
          <h1 className="editorial-heading mt-3 text-4xl md:text-5xl">Privacy Policy</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-white/76">
            This policy explains how Cashbrite collects, uses and protects personal information from students, parents,
            teachers, schools and other website visitors.
          </p>
          <p className="mt-4 text-sm font-semibold text-white/62">Last updated: 12 November 2026</p>
        </div>

        <div className="mt-8 grid gap-5">
          {sections.map((section) => (
            <article
              key={section.title}
              id={section.id}
              className="border-b border-ink/20 py-6"
            >
              <h2 className="text-2xl font-semibold tracking-tight text-navy">{section.title}</h2>
              <div className="mt-4 grid gap-3 text-base leading-8 text-navy/74">
                {section.content.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-lg border border-navy/10 bg-mint/35 p-6">
          <h2 className="text-2xl font-semibold tracking-tight text-navy">Questions about your data?</h2>
          <p className="mt-3 text-base leading-7 text-navy/72">
            Email <span className="font-semibold text-navy">cmaroke@me.com</span> with any privacy request or concern.
          </p>
          <Link
            href="/contact"
            className="focus-ring mt-5 inline-flex rounded-full bg-navy px-5 py-3 font-semibold text-white"
          >
            Contact Cashbrite
          </Link>
        </div>
      </div>
    </section>
  );
}
