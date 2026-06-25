import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { SectionHeader } from "@/components/SectionHeader";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Contact Cashbrite",
  description:
    "Contact Cashbrite about UK financial education workshops, student money confidence resources, partnerships or the Money Readiness Assessment.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <section className="bg-cream py-16">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1fr] lg:px-8">
        <SectionHeader
          eyebrow="Contact"
          headingLevel="h1"
          title="Talk to Cashbrite"
          body="Use this form for school enquiries, partnership ideas or questions about the first version of the platform."
        />
        <ContactForm />
      </div>
    </section>
  );
}
