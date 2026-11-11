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
    subject: "Your Cashbrite Money Confidence Snapshot",
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
      "Thank you for completing your free assessment. Your Cashbrite Money Confidence Snapshot helps you understand where you stand.",
      "",
      `Cashbrite Score: ${scores.readinessScore}/100`,
      `Result band: ${scores.band}`,
      actionPlan.summary,
      "",
      "Your top 3 money priorities:",
      ...actionPlan.priorityAreas.map((area, index) => `${index + 1}. ${area.title}`),
      "",
      "Your next steps:",
      ...actionPlan.challenge.slice(0, 3).map((item) => `- ${item}`),
      "",
      "Optional: Cashbrite Personalised Money Action Plan",
      "Understand what to do next. Your Action Plan focuses on the three money topics where your assessment suggests you could benefit from more guidance.",
      "Includes three priority-based learning chapters, fifteen practical actions, worked financial examples, a four-week roadmap, conversation prompts and checklists, a printable progress tracker, PDF and online access, and a companion budget spreadsheet.",
      "Launch Offer: £19. One-off payment. No subscription.",
      `Unlock your plan: ${checkoutRecoveryUrl}`,
      "",
      `View your free Cashbrite Money Confidence Snapshot (no purchase required): ${resultUrl}`,
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
    "Three priority-based learning chapters and fifteen practical actions",
    "Worked financial examples",
    "Four-week action roadmap",
    "Conversation prompts and checklists",
    "Printable progress tracker",
    "PDF report, online access and companion budget spreadsheet",
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
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Your free Cashbrite Money Confidence Snapshot is ready. No purchase required.</div>
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
              <p style="margin:16px 0 0;color:#4f6069;font-size:16px;line-height:26px;">Thank you for completing your free assessment. Your Cashbrite Money Confidence Snapshot helps you understand where you stand: your score, score band, short interpretation and three priority areas. No purchase is required to view your free results.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 26px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#fbf7ec;border-radius:9px;">
                <tr>
                  <td style="padding:22px;">
                    <p style="margin:0;color:#2f8f7b;font-size:11px;letter-spacing:1.4px;font-weight:800;text-transform:uppercase;">Cashbrite Score</p>
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
              <a href="${resultUrlFromCheckout(checkoutRecoveryUrl)}" style="display:inline-block;margin-top:5px;color:#2f8f7b;font-size:14px;font-weight:800;">View your free Snapshot</a>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 28px;background:#071d2b;">
              <p style="margin:0;color:#b9ead8;font-size:11px;letter-spacing:1.2px;font-weight:800;text-transform:uppercase;">Optional paid Action Plan</p>
              <h2 style="margin:10px 0 0;color:#ffffff;font-size:25px;line-height:32px;">Cashbrite Personalised Money Action Plan</h2>
              <p style="margin:12px 0 22px;color:#d7e0e4;font-size:15px;line-height:24px;">Understand what to do next. Your Action Plan focuses on the three money topics where your assessment suggests you could benefit from more guidance.</p>
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
              <a href="${checkoutRecoveryUrl}" style="display:block;padding:15px 20px;background:#b9ead8;color:#071d2b;text-align:center;text-decoration:none;border-radius:999px;font-size:16px;font-weight:900;">Get My £19 Action Plan</a>
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
  idempotencyKey: string;
}): Promise<{ kind: "accepted"; id: string } | { kind: "rejected" } | { kind: "ambiguous" }> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.CONTACT_FROM_EMAIL ?? "Cashbrite <onboarding@resend.dev>";
  if (!resendApiKey) return { kind: "rejected" };

  const resend = new Resend(resendApiKey);
  const price = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: params.currency.toUpperCase(),
  }).format(params.amount / 100);

  const result = await resend.emails.send({
      from: fromEmail,
      to: params.registration.email,
      subject: "Your Cashbrite Personalised Money Action Plan",
      attachments: [
        {
          filename: `Cashbrite-Money-Ready-Plan-${params.registration.firstName.replace(/[^a-z0-9-]/gi, "-")}.pdf`,
          content: params.pdfAttachment,
        },
      ],
      text: [
        `Hi ${params.registration.firstName},`,
        "",
        `Thank you for purchasing your Cashbrite Personalised Money Action Plan for ${price}.`,
        "",
        "Your Action Plan PDF is attached. You can also use this secure link to view your online report and download the companion budget spreadsheet:",
        params.accessUrl,
        "",
        "Cashbrite provides financial education and confidence-building guidance. It is not regulated financial, legal, tax or investment advice.",
        "",
        "Cashbrite",
      ].join("\n"),
    }, { idempotencyKey: params.idempotencyKey });
  if (result.error || !result.data?.id) {
    const definiteRejections = new Set(["validation_error", "invalid_from_address", "invalid_attachment", "invalid_access", "invalid_api_key", "missing_api_key", "rate_limit_exceeded", "daily_quota_exceeded", "monthly_quota_exceeded"]);
    return { kind: result.error && definiteRejections.has(result.error.name) ? "rejected" : "ambiguous" };
  }

  return { kind: "accepted", id: result.data.id };
}

// Called only after durable customer acceptance. Never changes customer delivery state.
export async function sendInternalPurchaseNotification(purchaseId: string, idempotencyKey: string) {
  if (!process.env.CONTACT_TO_EMAIL || !process.env.RESEND_API_KEY || !process.env.CONTACT_FROM_EMAIL) return;
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const result = await Promise.race([
      resend.emails.send({
        from: process.env.CONTACT_FROM_EMAIL,
        to: process.env.CONTACT_TO_EMAIL,
        subject: "Cashbrite Action Plan purchase confirmed",
        text: `Verified paid purchase ${purchaseId}. Customer delivery accepted. Use the trusted operator tool for sanitised status.`,
      }, { idempotencyKey: `${idempotencyKey}/internal` }),
      new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error("notification_timeout")), 2000); }),
    ]);
    if (result.error) console.error("Cashbrite purchase", { code: "internal_notification_failed", purchaseId });
  } catch {
    console.error("Cashbrite purchase", { code: "internal_notification_failed", purchaseId });
  } finally {
    if (timer) clearTimeout(timer);
  }
}
