import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { generateActionPlan, createActionPlanSummary, getPriorityCategories } from "@/lib/actionPlan";
import { saveAssessment } from "@/lib/assessmentDb";
import { sendActionPlanEmail, sendInternalAssessmentNotification } from "@/lib/assessmentEmail";
import {
  normaliseRegistration,
  validateAssessmentRequest,
  type AssessmentRequestBody,
} from "@/lib/assessmentValidation";
import { scoreQuiz } from "@/lib/quizScoring";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AssessmentRequestBody;
    const validationError = validateAssessmentRequest(body);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "Assessment storage is not configured yet." }, { status: 500 });
    }

    const registration = normaliseRegistration(body.registration!);
    const scores = scoreQuiz(body.selectedAnswers!);
    const priorityAreas = getPriorityCategories(scores);
    const actionPlan = generateActionPlan(registration, scores);
    const actionPlanSummary = createActionPlanSummary(actionPlan);
    const id = randomUUID();
    const origin = new URL(request.url).origin;
    const resultUrl = `${origin}/results?id=${id}`;
    const checkoutRecoveryUrl = `${origin}/checkout/money-ready-plan?assessmentId=${id}&source=email`;

    await saveAssessment({
      id,
      registration,
      scores,
      priorityAreas,
      actionPlan,
      actionPlanSummary,
    });

    await Promise.allSettled([
      sendActionPlanEmail({ registration, scores, actionPlan, resultUrl, checkoutRecoveryUrl }),
      sendInternalAssessmentNotification({ registration, scores, actionPlan, resultUrl }),
    ]);

    return NextResponse.json({
      id,
      resultUrl,
      message: "Your Cashbrite Money Action Plan has been generated.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "The assessment could not be saved.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
