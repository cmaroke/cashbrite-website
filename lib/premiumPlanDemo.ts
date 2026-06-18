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
    totalScore: 136,
    maxScore: 200,
    readinessScore: 68,
    band: "Building Confidence",
    categoryScores: {
      budgetingSpending: { score: 16, max: 20, percentage: 80 },
      savingHabits: { score: 15, max: 20, percentage: 75 },
      studentFinance: { score: 11, max: 20, percentage: 55 },
      bankAccountsOverdrafts: { score: 14, max: 20, percentage: 70 },
      creditBorrowing: { score: 10, max: 20, percentage: 50 },
      buyNowPayLater: { score: 12, max: 20, percentage: 60 },
      fraudScamsOnlineSafety: { score: 17, max: 20, percentage: 85 },
      payslipsTaxNi: { score: 14, max: 20, percentage: 70 },
      movingOutRentBills: { score: 12, max: 20, percentage: 60 },
      moneyConfidence: { score: 15, max: 20, percentage: 75 },
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
