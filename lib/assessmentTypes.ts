import type { QuizCategory } from "@/data/quizQuestions";
import type { QuizScores, ResultBand } from "@/lib/quizScoring";

export const userTypes = ["Student", "Parent", "Teacher/School professional", "Other"] as const;

export type UserType = (typeof userTypes)[number];

export type RegistrationData = {
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  userType: UserType;
  reportConsent: boolean;
  marketingConsent: boolean;
};

export type PriorityAreaPlan = {
  category: QuizCategory;
  title: string;
  whyItMatters: string;
  commonMistakes: string;
  actions: string[];
};

export type ActionPlan = {
  summary: string;
  priorityAreas: PriorityAreaPlan[];
  strengths: Array<{
    category: QuizCategory;
    title: string;
    explanation: string;
  }>;
  challenge: string[];
  nextStepsMessage: string;
};

export type SavedAssessment = {
  id: string;
  registration: RegistrationData;
  completedAt: string;
  scores: QuizScores;
  priorityAreas: QuizCategory[];
  actionPlan: ActionPlan;
  actionPlanSummary: string;
};

export type StoredAssessmentRow = {
  id: string;
  first_name: string;
  last_name: string;
  age: number;
  email: string;
  user_type: UserType;
  report_consent: boolean;
  marketing_consent: boolean;
  completed_at: string;
  readiness_score: number;
  result_band: ResultBand;
  category_scores: QuizScores["categoryScores"];
  strengths: QuizCategory[];
  risk_areas: QuizCategory[];
  priority_areas: QuizCategory[];
  action_plan: ActionPlan;
  action_plan_summary: string;
};
