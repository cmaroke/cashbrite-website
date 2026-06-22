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
  checkoutRecoveryUrl: string;
}) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.CONTACT_FROM_EMAIL ?? "Cashbrite <onboarding@resend.dev>";
  if (!resendApiKey) return;

  const resend = new Resend(resendApiKey);
  const { registration, scores, actionPlan, resultUrl, checkoutRecoveryUrl } = params;
  const siteUrl = new URL(resultUrl).origin;
  const contactEmail = process.env.CONTACT_TO_EMAIL ?? "cmaroke@me.com";

  await resend.emails.send({
    from: fromEmail,
    to: registration.email,
    subject: "Your Cashbrite Money Action Plan",
    html: buildAssessmentEmailHtml({
      registration,
      scores,
      actionPlan,
      checkoutRecoveryUrl,
      siteUrl,
      contactEmail,
    }),
    text: [
      `Hi ${registration.firstName},`,
      "",
      "Thank you for completing your Cashbrite Money Readiness Assessment. Your score is the first step towards building confidence with money.",
      "",
      `Money Readiness Score: ${scores.readinessScore}/100`,
      `Result band: ${scores.band}`,
      actionPlan.summary,
      "",
      "Your top 3 money priorities:",
      ...actionPlan.priorityAreas.map((area, index) => `${index + 1}. ${area.title}`),
      "",
      "Your next steps:",
      ...actionPlan.challenge.slice(0, 3).map((item) => `- ${item}`),
      "",
      "Unlock Your Personal Cashbrite Money Ready Plan",
      "Your personalised roadmap to financial confidence, built around your assessment results.",
      "Launch Offer: £19. One-off payment. No subscription.",
      `Unlock your plan: ${checkoutRecoveryUrl}`,
      "",
      `View your free results: ${resultUrl}`,
      "",
      "Cashbrite is an educational platform and does not provide regulated financial advice.",
      `Privacy Policy: ${siteUrl}/privacy-policy`,
      `Financial Disclaimer: ${siteUrl}/financial-disclaimer`,
      `Contact: ${contactEmail}`,
    ].join("\n"),
  });
}

function buildAssessmentEmailHtml(params: {
  registration: RegistrationData;
  scores: QuizScores;
  actionPlan: ActionPlan;
  checkoutRecoveryUrl: string;
  siteUrl: string;
  contactEmail: string;
}) {
  const { registration, scores, actionPlan, checkoutRecoveryUrl, siteUrl, contactEmail } = params;
  const priorities = actionPlan.priorityAreas
    .map(
      (area, index) => `
        <tr>
          <td style="padding:0 0 10px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#ffffff;border:1px solid #dfe8e3;border-radius:8px;">
              <tr>
                <td width="48" style="padding:15px 0 15px 15px;vertical-align:top;">
                  <div style="width:30px;height:30px;line-height:30px;border-radius:50%;background:#b9ead8;color:#071d2b;text-align:center;font-weight:800;">${index + 1}</div>
                </td>
                <td style="padding:16px 15px 15px 8px;color:#071d2b;font-size:15px;line-height:22px;font-weight:800;">${escapeHtml(area.title)}</td>
              </tr>
            </table>
          </td>
        </tr>`,
    )
    .join("");
  const nextSteps = actionPlan.challenge
    .slice(0, 3)
    .map(
      (step) => `
        <tr>
          <td width="28" style="padding:0 0 12px;color:#2f8f7b;font-size:18px;font-weight:800;vertical-align:top;">&#10003;</td>
          <td style="padding:0 0 12px;color:#4f6069;font-size:14px;line-height:22px;">${escapeHtml(step)}</td>
        </tr>`,
    )
    .join("");
  const included = [
    "Your Money Confidence Profile",
    "Your Top 3 Priority Areas",
    "Real-life Money Smart examples",
    "30-Day Money Roadmap",
    "Money Ready Checklist",
    "90-Day Progress Tracker",
  ]
    .map(
      (item) => `
        <tr>
          <td width="24" style="padding:0 0 9px;color:#2f8f7b;font-weight:800;vertical-align:top;">&#10003;</td>
          <td style="padding:0 0 9px;color:#071d2b;font-size:14px;line-height:20px;font-weight:700;">${item}</td>
        </tr>`,
    )
    .join("");

  return `<!doctype html>
<html lang="en">
  <head><meta name="viewport" content="width=device-width, initial-scale=1"><meta charset="utf-8"></head>
  <body style="margin:0;padding:0;background:#edf4f0;font-family:Arial,Helvetica,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Your personalised Cashbrite results and next steps are ready.</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#edf4f0;">
      <tr><td align="center" style="padding:24px 12px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#ffffff;border-radius:10px;overflow:hidden;">
          <tr>
            <td style="background:#071d2b;padding:25px 28px;">
              <img src="${siteUrl}/brand/cashbrite-logo-white.svg" width="154" alt="Cashbrite" style="display:block;width:154px;max-width:100%;height:auto;border:0;">
            </td>
          </tr>
          <tr>
            <td style="padding:32px 28px 20px;">
              <h1 style="margin:0;color:#071d2b;font-size:27px;line-height:34px;">Hi ${escapeHtml(registration.firstName)},</h1>
              <p style="margin:16px 0 0;color:#4f6069;font-size:16px;line-height:26px;">Thank you for completing your Cashbrite Money Readiness Assessment. Your score is the first step towards building confidence with money.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 26px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#fbf7ec;border-radius:9px;">
                <tr>
                  <td style="padding:22px;">
                    <p style="margin:0;color:#2f8f7b;font-size:11px;letter-spacing:1.4px;font-weight:800;text-transform:uppercase;">Money Readiness Score</p>
                    <p style="margin:8px 0 0;color:#071d2b;font-size:42px;line-height:46px;font-weight:900;">${scores.readinessScore}<span style="font-size:18px;">/100</span></p>
                  </td>
                  <td align="right" style="padding:22px;">
                    <p style="margin:0;color:#4f6069;font-size:11px;font-weight:700;text-transform:uppercase;">Result band</p>
                    <p style="margin:8px 0 0;color:#071d2b;font-size:17px;line-height:23px;font-weight:900;">${escapeHtml(scores.band)}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 26px;color:#4f6069;font-size:15px;line-height:24px;">${escapeHtml(actionPlan.summary)}</td>
          </tr>
          <tr>
            <td style="padding:0 28px 28px;">
              <h2 style="margin:0 0 15px;color:#071d2b;font-size:20px;line-height:27px;">Your Top 3 Priority Areas</h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${priorities}</table>
            </td>
          </tr>
          <tr>
            <td style="padding:26px 28px;background:#f4faf7;">
              <h2 style="margin:0 0 17px;color:#071d2b;font-size:20px;line-height:27px;">Your Next Steps</h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${nextSteps}</table>
              <a href="${resultUrlFromCheckout(checkoutRecoveryUrl)}" style="display:inline-block;margin-top:5px;color:#2f8f7b;font-size:14px;font-weight:800;">View your free results</a>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 28px;background:#071d2b;">
              <p style="margin:0;color:#b9ead8;font-size:11px;letter-spacing:1.2px;font-weight:800;text-transform:uppercase;">Cashbrite Money Ready Plan</p>
              <h2 style="margin:10px 0 0;color:#ffffff;font-size:25px;line-height:32px;">Unlock Your Personal Cashbrite Money Ready Plan</h2>
              <p style="margin:12px 0 22px;color:#d7e0e4;font-size:15px;line-height:24px;">Your personalised roadmap to financial confidence, built around your assessment results.</p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:8px;">
                <tr><td style="padding:20px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${included}</table>
                </td></tr>
              </table>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding:22px 0 17px;">
                    <p style="margin:0;color:#b9ead8;font-size:12px;font-weight:800;text-transform:uppercase;">Launch Offer</p>
                    <p style="margin:4px 0 0;color:#ffffff;font-size:39px;line-height:43px;font-weight:900;">£19</p>
                    <p style="margin:4px 0 0;color:#d7e0e4;font-size:13px;">One-off payment. No subscription.</p>
                  </td>
                </tr>
              </table>
              <a href="${checkoutRecoveryUrl}" style="display:block;padding:15px 20px;background:#b9ead8;color:#071d2b;text-align:center;text-decoration:none;border-radius:999px;font-size:16px;font-weight:900;">Unlock My £19 Money Ready Plan</a>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 28px;background:#fbf7ec;color:#66747c;font-size:12px;line-height:19px;text-align:center;">
              <p style="margin:0 0 10px;">Cashbrite is an educational platform and does not provide regulated financial advice.</p>
              <p style="margin:0;"><a href="${siteUrl}/privacy-policy" style="color:#2f8f7b;">Privacy Policy</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="${siteUrl}/financial-disclaimer" style="color:#2f8f7b;">Financial Disclaimer</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="mailto:${escapeHtml(contactEmail)}" style="color:#2f8f7b;">${escapeHtml(contactEmail)}</a></p>
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

function resultUrlFromCheckout(checkoutRecoveryUrl: string) {
  const url = new URL(checkoutRecoveryUrl);
  return `${url.origin}/results?id=${encodeURIComponent(url.searchParams.get("assessmentId") ?? "")}`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
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

export async function sendPremiumPurchaseConfirmation(params: {
  registration: RegistrationData;
  amount: number;
  currency: string;
  accessUrl: string;
  pdfAttachment: Buffer;
}) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.CONTACT_FROM_EMAIL ?? "Cashbrite <onboarding@resend.dev>";
  if (!resendApiKey) return;

  const resend = new Resend(resendApiKey);
  const price = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: params.currency.toUpperCase(),
  }).format(params.amount / 100);

  const deliveries = [
    resend.emails.send({
      from: fromEmail,
      to: params.registration.email,
      subject: "Your Cashbrite Money Ready Plan is unlocked",
      attachments: [
        {
          filename: `Cashbrite-Money-Ready-Plan-${params.registration.firstName.replace(/[^a-z0-9-]/gi, "-")}.pdf`,
          content: params.pdfAttachment,
        },
      ],
      text: [
        `Hi ${params.registration.firstName},`,
        "",
        `Thank you for purchasing your Cashbrite Money Ready Plan for ${price}.`,
        "",
        "Your personalised workbook is attached as a PDF. You can also use this secure link to view it online:",
        params.accessUrl,
        "",
        "Cashbrite provides financial education and confidence-building guidance. It is not regulated financial, legal, tax or investment advice.",
        "",
        "Cashbrite",
      ].join("\n"),
    }),
  ];

  const internalEmail = process.env.CONTACT_TO_EMAIL;
  if (internalEmail) {
    deliveries.push(
      resend.emails.send({
        from: fromEmail,
        to: internalEmail,
        replyTo: params.registration.email,
        subject: `Cashbrite Money Ready Plan purchased by ${params.registration.firstName} ${params.registration.lastName}`,
        text: [
          "A Cashbrite Money Ready Plan purchase has been completed.",
          "",
          `Name: ${params.registration.firstName} ${params.registration.lastName}`,
          `Email: ${params.registration.email}`,
          `Amount: ${price}`,
          `Plan access: ${params.accessUrl}`,
        ].join("\n"),
      }),
    );
  }

  await Promise.allSettled(deliveries);
}
