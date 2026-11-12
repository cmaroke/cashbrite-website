import "server-only";
import { Resend } from "resend";
import type { SavedAssessment } from "@/lib/assessmentTypes";
import { generateMoneyReadyPlanPdf } from "@/lib/moneyReadyPlanPdf";
import { setReportEmailStatus } from "@/lib/assessmentDb";
import { assessmentLog } from "@/lib/assessmentSubmission";

const escape = (value: string) => value.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function deliverFullReport(assessment: SavedAssessment, accessUrl: string, timeoutMs = 10000) {
  let providerStarted = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    if (!process.env.RESEND_API_KEY || !process.env.CONTACT_FROM_EMAIL) throw new Error("unconfigured");
    const pdf = await generateMoneyReadyPlanPdf(assessment);
    const name = assessment.registration.firstName.replace(/[^a-z0-9-]/gi, "-");
    providerStarted = true;
    const sending = new Resend(process.env.RESEND_API_KEY).emails.send({
      from: process.env.CONTACT_FROM_EMAIL, to: assessment.registration.email,
      subject: "Your Cashbrite Personalised Money Action Plan",
      attachments: [{ filename: `Cashbrite-Money-Ready-Plan-${name}.pdf`, content: pdf }],
      text: `Hi ${assessment.registration.firstName},\n\nYour complete Cashbrite Personalised Money Action Plan is ready. Your PDF is attached. Use this private link to view your report and download the companion Excel budget tracker:\n${accessUrl}\n\nKeep this link private. No payment or subscription is required.\n\nCashbrite provides educational guidance, not regulated financial advice.\nPrivacy: ${new URL("/privacy-policy", accessUrl)}\nTerms: ${new URL("/terms-and-conditions", accessUrl)}\nContact: cmaroke@me.com`,
      html: `<html lang="en"><body style="margin:0;background:#F7F4EC;color:#0F2A3A;font-family:Arial,sans-serif"><main style="max-width:600px;margin:0 auto;padding:32px 24px"><header style="padding:24px;background:#0F2A3A;color:#fff;font-family:Georgia,serif;font-size:36px">cashbrite<span style="color:#C7F36B">.</span></header><section style="background:white;padding:24px"><p>Hi ${escape(assessment.registration.firstName)},</p><h1 style="font-family:Georgia,serif;font-size:28px;font-weight:400">Your personalised Action Plan is ready.</h1><p style="line-height:1.7">Your complete PDF report is attached. Explore your money confidence profile, three priority chapters, practical actions and 30-day roadmap. Your companion Excel budget tracker is available through your report.</p><p style="margin:28px 0"><a href="${escape(accessUrl)}" style="display:inline-block;padding:16px 22px;background:#C7F36B;color:#0F2A3A;text-decoration:none;font-weight:bold;border-radius:4px">View My Full Report</a></p><p style="line-height:1.7">Keep this private link safe. No payment or subscription is required.</p></section><footer style="font-size:12px;line-height:1.7;padding-top:20px">Educational guidance, not regulated financial advice.<br><a href="${new URL("/privacy-policy", accessUrl)}">Privacy Policy</a> · <a href="${new URL("/financial-disclaimer", accessUrl)}">Financial Disclaimer</a><br>Contact: cmaroke@me.com</footer></main></body></html>`,
    }, { idempotencyKey: `cashbrite-full-report/${assessment.id}` });
    const result = await Promise.race([sending, new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error("provider_timeout")), timeoutMs); })]);
    if (result.error || !result.data?.id) {
      await setReportEmailStatus(assessment.id, "needs_review");
      assessmentLog("full_report_email_unconfirmed", assessment.id);
      return;
    }
    await setReportEmailStatus(assessment.id, "sent");
  } catch {
    assessmentLog(providerStarted ? "full_report_email_outcome_unknown" : "full_report_generation_or_email_failed", assessment.id);
    await setReportEmailStatus(assessment.id, providerStarted ? "needs_review" : "failed").catch(() => assessmentLog("full_report_delivery_status_unavailable", assessment.id));
  } finally {
    if (timer) clearTimeout(timer);
  }
}
