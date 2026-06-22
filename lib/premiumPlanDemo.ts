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
    totalScore: 62,
    maxScore: 90,
    readinessScore: 69,
    band: "Developing Money Skills",
    categoryScores: {
      budgetingSpending: { score: 8, max: 9, percentage: 89 },
      savingHabits: { score: 7, max: 9, percentage: 78 },
      studentFinance: { score: 5, max: 9, percentage: 56 },
      bankAccountsOverdrafts: { score: 6, max: 9, percentage: 67 },
      creditBorrowing: { score: 4, max: 9, percentage: 44 },
      buyNowPayLater: { score: 5, max: 9, percentage: 56 },
      fraudScamsOnlineSafety: { score: 8, max: 9, percentage: 89 },
      payslipsTaxNi: { score: 6, max: 9, percentage: 67 },
      movingOutRentBills: { score: 5, max: 9, percentage: 56 },
      moneyConfidence: { score: 8, max: 9, percentage: 89 },
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
