import { quizQuestions } from "@/data/quizQuestions";

export type AssessmentPosition = {
  step: number;
  view: "question" | "review";
  autoAdvance: boolean;
};

export const assessmentDraftKey = "cashbrite:assessment-draft:v1";
const submissionKeyStorage = "cashbrite:assessment-submission:v1";
const draftLifetime = 24 * 60 * 60 * 1000;

export function initialAssessmentPosition(): AssessmentPosition {
  return {
    step: 0,
    view: "question",
    autoAdvance: typeof window === "undefined" || !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  };
}

// Browser-tab recovery contains answer IDs only, never registration or consent data.
export function readAssessmentDraft() {
  const empty = { answers: {} as Record<string, string>, position: initialAssessmentPosition(), available: true };
  try {
    const raw = sessionStorage.getItem(assessmentDraftKey);
    if (!raw) return empty;
    let stored;
      try { stored = JSON.parse(raw); } catch { clearAssessmentDraft(); return empty; }
    if (!stored || !Number.isFinite(stored.updatedAt) || stored.updatedAt > Date.now() || Date.now() - stored.updatedAt > draftLifetime) {
      clearAssessmentDraft();
      return empty;
    }
    const answers: Record<string, string> = {};
    for (const question of quizQuestions) {
      const answerId = stored.answers?.[question.id];
      if (question.answers.some((answer) => answer.id === answerId)) answers[question.id] = answerId;
    }
    const position: AssessmentPosition = {
      step: Number.isInteger(stored.position?.step) ? Math.max(0, Math.min(quizQuestions.length - 1, stored.position.step)) : 0,
      view: stored.position?.view === "review" ? "review" : "question",
      autoAdvance: typeof stored.position?.autoAdvance === "boolean" ? stored.position.autoAdvance : empty.position.autoAdvance,
    };
    return { answers, position, available: true };
  } catch {
    return { ...empty, available: false };
  }
}

export function saveAssessmentDraft(answers: Record<string, string>, position: AssessmentPosition) {
  if (!Object.keys(answers).length) { sessionStorage.removeItem(assessmentDraftKey); return; }
  sessionStorage.setItem(assessmentDraftKey, JSON.stringify({ answers, position, updatedAt: Date.now() }));
}

export function clearAssessmentDraft() {
  try { sessionStorage.removeItem(assessmentDraftKey); } catch { /* Recovery may be unavailable; submission still succeeds. */ }
  try { sessionStorage.removeItem(submissionKeyStorage); } catch { /* The mounted request still has its key. */ }
}

export function getAssessmentSubmissionKey() {
  try {
    const saved = sessionStorage.getItem(submissionKeyStorage);
    if (saved && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(saved)) return saved;
  } catch { /* Fall back to the mounted client's stable ref. */ }
  const key = crypto.randomUUID();
  try { sessionStorage.setItem(submissionKeyStorage, key); } catch { /* A reload cannot recover this key when storage is blocked. */ }
  return key;
}
