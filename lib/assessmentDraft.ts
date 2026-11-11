import { quizQuestions } from "@/data/quizQuestions";

export type AssessmentPosition = {
  step: number;
  view: "question" | "review";
  autoAdvance: boolean;
};

export const assessmentDraftKey = "cashbrite:assessment-draft:v1";
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
    try { stored = JSON.parse(raw); } catch { sessionStorage.removeItem(assessmentDraftKey); return empty; }
    if (!stored || !Number.isFinite(stored.updatedAt) || stored.updatedAt > Date.now() || Date.now() - stored.updatedAt > draftLifetime) {
      sessionStorage.removeItem(assessmentDraftKey);
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
}
