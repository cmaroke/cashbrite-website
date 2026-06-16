"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type ContactFormProps = {
  context?: "school" | "general";
};

type FormStatus = "idle" | "submitting" | "success" | "error";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm({ context = "general" }: ContactFormProps) {
  const formStartedAt = useRef(0);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [feedback, setFeedback] = useState("");
  const [message, setMessage] = useState(
    context === "school" ? "I would like to enquire about a Cashbrite workshop for students." : "",
  );

  useEffect(() => {
    formStartedAt.current = Date.now();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const organisation = String(formData.get("organisation") ?? "").trim();
    const website = String(formData.get("website") ?? "").trim();
    const enquiryMessage = message.trim();

    if (!name || !email || !enquiryMessage) {
      setStatus("error");
      setFeedback("Please complete your name, email and message.");
      return;
    }

    if (!emailPattern.test(email)) {
      setStatus("error");
      setFeedback("Please enter a valid email address.");
      return;
    }

    setStatus("submitting");
    setFeedback("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          organisation,
          message: enquiryMessage,
          website,
          formStartedAt: String(formStartedAt.current),
        }),
      });
      const result = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        throw new Error(result.error ?? "The enquiry could not be sent. Please try again.");
      }

      setStatus("success");
      setFeedback(result.message ?? "Thanks, your enquiry has been sent.");
      form.reset();
      setMessage("");
      formStartedAt.current = Date.now();
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "The enquiry could not be sent. Please try again.");
    }
  }

  const isSubmitting = status === "submitting";

  return (
    <form className="rounded-lg border border-navy/10 bg-white p-6 shadow-soft" onSubmit={handleSubmit}>
      <div className="grid gap-5">
        <label className="grid gap-2 text-sm font-bold text-navy">
          Name
          <input
            className="focus-ring rounded-md border border-navy/15 bg-cream/35 px-4 py-3 text-base font-normal transition focus:bg-white"
            name="name"
            type="text"
            autoComplete="name"
            required
            disabled={isSubmitting}
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
            disabled={isSubmitting}
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-navy">
          School/organisation
          <input
            className="focus-ring rounded-md border border-navy/15 bg-cream/35 px-4 py-3 text-base font-normal transition focus:bg-white"
            name="organisation"
            type="text"
            autoComplete="organization"
            disabled={isSubmitting}
          />
        </label>
        <label className="hidden" aria-hidden="true">
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
        <label className="grid gap-2 text-sm font-bold text-navy">
          Message
          <textarea
            className="focus-ring min-h-36 rounded-md border border-navy/15 bg-cream/35 px-4 py-3 text-base font-normal transition focus:bg-white"
            name="message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            required
            disabled={isSubmitting}
          />
        </label>
        <button
          className="focus-ring rounded-full bg-navy px-5 py-3.5 text-base font-black text-white shadow-[0_14px_30px_rgba(7,29,43,0.18)] transition hover:-translate-y-0.5 hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending enquiry..." : "Submit enquiry"}
        </button>
        {feedback ? (
          <p
            className={`rounded-md border p-4 text-sm font-semibold leading-6 ${
              status === "success"
                ? "border-sea/20 bg-mint/35 text-navy"
                : "border-[#e9c36b]/35 bg-[#fff3d9] text-navy"
            }`}
            role={status === "error" ? "alert" : "status"}
          >
            {feedback}
          </p>
        ) : null}
      </div>
    </form>
  );
}
