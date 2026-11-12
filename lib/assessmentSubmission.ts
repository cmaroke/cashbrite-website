import { createHash } from "node:crypto";
import { quizQuestions } from "@/data/quizQuestions";
import type { RegistrationData } from "@/lib/assessmentTypes";

export const submissionKeyPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// A retry has the same nonce and canonical payload. Edits are a different submission.
export function assessmentSubmissionId(key: string, registration: RegistrationData, answers: Record<string, string>) {
  const digest = createHash("sha256").update(JSON.stringify([
    "cashbrite-assessment-v1", key.toLowerCase(), registration,
    quizQuestions.map(question => [question.id, answers[question.id]]),
  ])).digest();
  digest[6] = (digest[6] & 15) | 80;
  digest[8] = (digest[8] & 63) | 128;
  const hex = digest.toString("hex").slice(0, 32);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function assessmentLog(code: string, id?: string) {
  console.error("Cashbrite assessment", { code, correlation: id ? createHash("sha256").update(id).digest("hex").slice(0, 16) : undefined });
}

export async function runAssessmentEmailTask(task: () => Promise<unknown>, kind: "customer" | "internal", id: string, timeoutMs = 5000) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const outcome = await Promise.race([
      task(),
      new Promise(resolve => { timer = setTimeout(() => resolve("timeout"), timeoutMs); }),
    ]);
    if (outcome !== "accepted") assessmentLog(`email_${kind}_${outcome === "timeout" ? "timeout_outcome_unknown" : outcome === "not_configured" ? "not_configured" : "unconfirmed"}`, id);
  } catch {
    assessmentLog(`email_${kind}_failed`, id);
  } finally {
    if (timer) clearTimeout(timer);
  }
}
