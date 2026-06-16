type ContactFormProps = {
  context?: "school" | "general";
};

export function ContactForm({ context = "general" }: ContactFormProps) {
  return (
    <form className="rounded-lg border border-navy/10 bg-white p-6 shadow-soft" action="#" method="post">
      <div className="grid gap-5">
        <label className="grid gap-2 text-sm font-bold text-navy">
          Name
          <input
            className="focus-ring rounded-md border border-navy/15 bg-cream/35 px-4 py-3 text-base font-normal transition focus:bg-white"
            name="name"
            type="text"
            autoComplete="name"
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-navy">
          Email
          <input
            className="focus-ring rounded-md border border-navy/15 bg-cream/35 px-4 py-3 text-base font-normal transition focus:bg-white"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-navy">
          School/organisation
          <input
            className="focus-ring rounded-md border border-navy/15 bg-cream/35 px-4 py-3 text-base font-normal transition focus:bg-white"
            name="organisation"
            type="text"
            autoComplete="organization"
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-navy">
          Message
          <textarea
            className="focus-ring min-h-36 rounded-md border border-navy/15 bg-cream/35 px-4 py-3 text-base font-normal transition focus:bg-white"
            name="message"
            defaultValue={
              context === "school"
                ? "I would like to enquire about a Cashbrite workshop for students."
                : ""
            }
            required
          />
        </label>
        <button
          className="focus-ring rounded-full bg-navy px-5 py-3.5 text-base font-black text-white shadow-[0_14px_30px_rgba(7,29,43,0.18)] transition hover:-translate-y-0.5 hover:bg-ink"
          type="submit"
        >
          Submit enquiry
        </button>
        <p className="text-sm leading-6 text-navy/60">
          This MVP form is front-end only. Connect it to email, a CRM or a form service before launch.
        </p>
      </div>
    </form>
  );
}
