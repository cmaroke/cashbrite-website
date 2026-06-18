import { Resend } from "resend";
import { categoryLabels } from "@/data/quizQuestions";
import type { RegistrationData } from "@/lib/assessmentTypes";
import type { ActionPlan } from "@/lib/assessmentTypes";
import type { QuizScores } from "@/lib/quizScoring";

export async function sendActionPlanEmail(params: {
  registration: RegistrationData;
  scores: QuizScores;
  actionPlan: ActionPlan;
  resultUrl: string;
}) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.CONTACT_FROM_EMAIL ?? "Cashbrite <onboarding@resend.dev>";
  if (!resendApiKey) return;

  const resend = new Resend(resendApiKey);
  const { registration, scores, actionPlan, resultUrl } = params;

  await resend.emails.send({
    from: fromEmail,
    to: registration.email,
    subject: "Your Cashbrite Money Action Plan",
    text: [
      `Hi ${registration.firstName},`,
      "",
      "Your personalised Cashbrite Money Action Plan has been generated.",
      "",
      `Money Readiness Score: ${scores.readinessScore}/100`,
      `Result band: ${scores.band}`,
      "",
      "Summary:",
      actionPlan.summary,
      "",
      "Your top 3 money priorities:",
      ...actionPlan.priorityAreas.flatMap((area, index) => [
        `${index + 1}. ${area.title}`,
        `Why it matters: ${area.whyItMatters}`,
        `Common mistakes: ${area.commonMistakes}`,
        `Actions: ${area.actions.join(" | ")}`,
        "",
      ]),
      "Your 30-day challenge:",
      ...actionPlan.challenge.map((item) => `- ${item}`),
      "",
      actionPlan.nextStepsMessage,
      "",
      `View your full results page: ${resultUrl}`,
      "",
      "Cashbrite",
    ].join("\n"),
  });
}

export async function sendInternalAssessmentNotification(params: {
  registration: RegistrationData;
  scores: QuizScores;
  actionPlan: ActionPlan;
  resultUrl: string;
}) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL ?? "Cashbrite <onboarding@resend.dev>";
  if (!resendApiKey || !toEmail) return;

  const resend = new Resend(resendApiKey);
  const { registration, scores, actionPlan, resultUrl } = params;

  await resend.emails.send({
    from: fromEmail,
    to: toEmail,
    replyTo: registration.email,
    subject: `Cashbrite assessment completed by ${registration.firstName} ${registration.lastName}`,
    text: [
      "A Cashbrite Money Readiness Assessment has been completed.",
      "",
      `Name: ${registration.firstName} ${registration.lastName}`,
      `Age: ${registration.age}`,
      `Email: ${registration.email}`,
      `Current stage: ${registration.educationStage}`,
      `How they heard about Cashbrite: ${registration.referralSource || "Not provided"}`,
      `Marketing consent: ${registration.marketingConsent ? "Yes" : "No"}`,
      "",
      `Score: ${scores.readinessScore}/100`,
      `Band: ${scores.band}`,
      `Top priorities: ${actionPlan.priorityAreas.map((area) => categoryLabels[area.category]).join(", ")}`,
      "",
      `Results page: ${resultUrl}`,
    ].join("\n"),
  });
}
