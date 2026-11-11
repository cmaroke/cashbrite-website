import type { RegistrationData } from "@/lib/assessmentTypes";
import { scoreQuiz, type QuizScores } from "@/lib/quizScoring";

export type PremiumPlanAssessment = {
  registration: RegistrationData;
  completedAt: string;
  scores: QuizScores;
};

// Fixed fictional responses. Derive every displayed result through production scoring.
export const demoPremiumAnswers: Record<string, string> = {
  "budgeting-1": "c", "budgeting-3": "b", "budgeting-5": "c",
  "saving-2": "a", "saving-3": "a", "saving-4": "a",
  "student-finance-1": "c", "student-finance-4": "d", "student-finance-5": "c",
  "banking-2": "a", "banking-3": "c", "banking-4": "b",
  "credit-1": "d", "credit-3": "b", "credit-5": "c",
  "bnpl-1": "c", "bnpl-2": "d", "bnpl-5": "d",
  "scams-1": "b", "scams-3": "a", "scams-5": "c",
  "pay-1": "a", "pay-2": "b", "pay-3": "b",
  "moving-1": "b", "moving-3": "d", "moving-4": "b",
  "confidence-1": "a", "confidence-3": "a", "confidence-4": "b",
};

export const demoPremiumAssessment: PremiumPlanAssessment = {
  registration: {
    firstName: "Alex",
    lastName: "Morgan",
    age: 17,
    email: "alex.demo@cashbrite.example",
    educationStage: "College or Sixth Form",
    referralSource: "School or College",
    reportConsent: true,
    marketingConsent: false,
  },
  completedAt: "2026-06-12T10:30:00.000Z",
  scores: scoreQuiz(demoPremiumAnswers),
};
