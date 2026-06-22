import type { RegistrationData } from "@/lib/assessmentTypes";
import type { QuizScores } from "@/lib/quizScoring";

export type PremiumPlanAssessment = {
  registration: RegistrationData;
  completedAt: string;
  scores: QuizScores;
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
  scores: {
    totalScore: 82,
    maxScore: 120,
    readinessScore: 68,
    band: "Building Money Confidence",
    categoryScores: {
      budgetingSpending: { score: 10, max: 12, percentage: 83 },
      savingHabits: { score: 9, max: 12, percentage: 75 },
      studentFinance: { score: 7, max: 12, percentage: 58 },
      bankAccountsOverdrafts: { score: 8, max: 12, percentage: 67 },
      creditBorrowing: { score: 6, max: 12, percentage: 50 },
      buyNowPayLater: { score: 7, max: 12, percentage: 58 },
      fraudScamsOnlineSafety: { score: 10, max: 12, percentage: 83 },
      payslipsTaxNi: { score: 8, max: 12, percentage: 67 },
      movingOutRentBills: { score: 7, max: 12, percentage: 58 },
      moneyConfidence: { score: 10, max: 12, percentage: 83 },
    },
    strengths: ["fraudScamsOnlineSafety", "budgetingSpending", "savingHabits", "moneyConfidence"],
    riskAreas: ["creditBorrowing", "studentFinance"],
    nextSteps: [
      "Build confidence around borrowing before choosing any credit product.",
      "Turn student finance into a realistic weekly living-cost plan.",
      "Review how Buy Now Pay Later creates future payment commitments.",
    ],
  },
};
