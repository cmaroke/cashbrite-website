import { NextResponse } from "next/server";
import { Resend } from "resend";

type ContactRequestBody = {
  name?: string;
  email?: string;
  organisation?: string;
  message?: string;
  formStartedAt?: string;
  website?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const maxFieldLength = {
  name: 120,
  email: 160,
  organisation: 160,
  message: 3000,
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactRequestBody;
    const validationError = validateContactRequest(body);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL;
    const fromEmail = process.env.CONTACT_FROM_EMAIL ?? "Cashbrite <onboarding@resend.dev>";

    if (!resendApiKey || !toEmail) {
      return NextResponse.json({ error: "Contact form email is not configured yet." }, { status: 500 });
    }

    const resend = new Resend(resendApiKey);
    const name = body.name!.trim();
    const email = body.email!.trim().toLowerCase();
    const organisation = body.organisation?.trim() || "Not provided";
    const message = body.message!.trim();

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: email,
      subject: `New Cashbrite enquiry from ${name}`,
      text: [
        "New Cashbrite enquiry",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `School/organisation: ${organisation}`,
        "",
        "Message:",
        message,
      ].join("\n"),
    });

    if (error) {
      return NextResponse.json({ error: "The enquiry could not be sent. Please try again." }, { status: 502 });
    }

    return NextResponse.json({ message: "Thanks, your enquiry has been sent." });
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

function validateContactRequest(body: ContactRequestBody) {
  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const message = body.message?.trim() ?? "";
  const organisation = body.organisation?.trim() ?? "";

  if (body.website?.trim()) {
    return "Your enquiry could not be sent.";
  }

  const formStartedAt = Number(body.formStartedAt);
  if (!Number.isFinite(formStartedAt) || Date.now() - formStartedAt < 2500) {
    return "Please take a moment to complete the form before sending.";
  }

  if (!name || !email || !message) {
    return "Please complete your name, email and message.";
  }

  if (!emailPattern.test(email)) {
    return "Please enter a valid email address.";
  }

  if (
    name.length > maxFieldLength.name ||
    email.length > maxFieldLength.email ||
    organisation.length > maxFieldLength.organisation ||
    message.length > maxFieldLength.message
  ) {
    return "One or more fields is too long. Please shorten your enquiry and try again.";
  }

  return null;
}
