import type { QuizCategory } from "@/data/quizQuestions";
import type { QuizScores, ResultBand } from "@/lib/quizScoring";

export const educationStages = ["School", "College or Sixth Form", "University", "Other"] as const;
export const legacyUserTypes = ["Student", "Parent", "Teacher/School professional", "Other"] as const;
export const referralSources = [
  "TikTok",
  "Instagram",
  "Facebook",
  "Google Search",
  "School or College",
  "Teacher",
  "Parent recommendation",
  "Friend or Family",
  "Event or Workshop",
  "Other",
] as const;

export type EducationStage = (typeof educationStages)[number];
export type LegacyUserType = (typeof legacyUserTypes)[number];
export type ReferralSource = (typeof referralSources)[number];

export type RegistrationData = {
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  educationStage: EducationStage | "";
  legacyUserType?: LegacyUserType;
  referralSource: ReferralSource | "";
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
  education_stage: EducationStage | null;
  user_type: LegacyUserType | null;
  referral_source: ReferralSource | null;
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
