import { ContactForm } from "@/components/ContactForm";
import { SectionHeader } from "@/components/SectionHeader";

export default function ContactPage() {
  return (
    <section className="bg-cream py-16">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1fr] lg:px-8">
        <SectionHeader
          eyebrow="Contact"
          title="Talk to Cashbrite"
          body="Use this form for school enquiries, partnership ideas or questions about the first version of the platform."
        />
        <ContactForm />
      </div>
    </section>
  );
}
