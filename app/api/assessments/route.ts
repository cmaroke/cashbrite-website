import { createHash } from "node:crypto";
import { after, NextResponse } from "next/server";
import { quizQuestions } from "@/data/quizQuestions";
import { createActionPlanSummary, generateActionPlan, getPriorityCategories } from "@/lib/actionPlan";
import { findRegisteredReport, saveAssessment } from "@/lib/assessmentDb";
import { sendInternalAssessmentNotification } from "@/lib/assessmentEmail";
import { normaliseRegistration, validateAssessmentRequest, type AssessmentRequestBody } from "@/lib/assessmentValidation";
import { assessmentLog, runAssessmentEmailTask } from "@/lib/assessmentSubmission";
import { deliverFullReport } from "@/lib/fullReportDelivery";
import { hashReportKey, reportAssessmentId, reportCookieName, reportCookieOptions, reportKeyPattern } from "@/lib/reportAccess";
import { privateHeaders } from "@/lib/purchaseSafety";
import { scoreQuiz } from "@/lib/quizScoring";

export const runtime = "nodejs";
export async function POST(request: Request) {
  const error = (message: string, status: number) => NextResponse.json({ error: message }, { status, headers: privateHeaders });
  try {
    const originHeader = request.headers.get("origin");
    if (originHeader && new URL(originHeader).host !== (request.headers.get("host") ?? new URL(request.url).host)) return error("Please submit this form from Cashbrite.", 403);
    if (!request.headers.get("content-type")?.includes("application/json")) return error("Please send a valid registration.", 415);
    const text = await request.text();
    if (text.length > 32768) return error("This registration is too large. Please try again.", 413);
    let body: AssessmentRequestBody;
    try { body = JSON.parse(text); } catch { return error("Please send a valid registration.", 400); }
    if (!body || typeof body !== "object" || Array.isArray(body)) return error("Please send a valid registration.", 400);
    const validationError = validateAssessmentRequest(body);
    if (validationError) return error(validationError, 400);
    if (typeof body.reportKey !== "string" || !reportKeyPattern.test(body.reportKey)) return error("Please return to your results and try again.", 400);
    if (!process.env.DATABASE_URL) return error("We cannot save your report right now. Keep this page open and try again shortly.", 503);
    const origin = new URL(process.env.NEXT_PUBLIC_SITE_URL || (process.env.NODE_ENV !== "production" ? request.url : "")).origin;
    const registration = normaliseRegistration(body.registration!);
    const scores = scoreQuiz(body.selectedAnswers!);
    const actionPlan = generateActionPlan(registration, scores);
    const id = reportAssessmentId(body.reportKey);
    const hash = hashReportKey(body.reportKey);
    const requestHash = createHash("sha256").update(JSON.stringify([registration, quizQuestions.map(q => [q.id, body.selectedAnswers![q.id]])])).digest("hex");
    const existing = await findRegisteredReport(hash);
    if (existing && existing.report_request_hash !== requestHash) return error("These details differ from the saved registration. Use your report link or contact Cashbrite.", 409);
    const assessment = { id, registration, scores, actionPlan, actionPlanSummary: createActionPlanSummary(actionPlan), priorityAreas: getPriorityCategories(scores), completedAt: new Date().toISOString() };
    const created = await saveAssessment({ ...assessment, access: { hash, requestHash } });
    const saved = await findRegisteredReport(hash);
    if (!saved || saved.report_request_hash !== requestHash) return error("We could not confirm this registration. Keep this page open and try again.", 409);
    if (created) {
      const accessUrl = `${origin}/report/access#token=${body.reportKey}`;
      try {
        after(async () => {
          await Promise.all([
            deliverFullReport(assessment, accessUrl),
            runAssessmentEmailTask(() => sendInternalAssessmentNotification({ registration, scores, actionPlan, resultUrl: `${origin}/report`, idempotencyKey: `cashbrite-full-report/${id}/internal` }), "internal", id),
          ]);
        });
      } catch { assessmentLog("full_report_email_scheduling_failed", id); }
    }
    const response = NextResponse.json({ reportUrl: "/report" }, { headers: privateHeaders });
    response.cookies.set(reportCookieName, body.reportKey, reportCookieOptions);
    return response;
  } catch {
    assessmentLog("report_registration_unavailable");
    return error("We cannot confirm your report yet. Keep this page open and try again; your answers will be kept.", 503);
  }
}
