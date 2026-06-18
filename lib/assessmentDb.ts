import { neon } from "@neondatabase/serverless";
import type { QuizCategory } from "@/data/quizQuestions";
import type { ActionPlan, RegistrationData, SavedAssessment, StoredAssessmentRow } from "@/lib/assessmentTypes";
import type { QuizScores } from "@/lib/quizScoring";

let schemaReady = false;
let premiumInterestSchemaReady = false;

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured.");
  }

  return neon(databaseUrl);
}

export async function saveAssessment(params: {
  id: string;
  registration: RegistrationData;
  scores: QuizScores;
  priorityAreas: QuizCategory[];
  actionPlan: ActionPlan;
  actionPlanSummary: string;
}) {
  const sql = getSql();
  await ensureAssessmentTable();

  await sql`
    INSERT INTO assessment_results (
      id,
      first_name,
      last_name,
      age,
      email,
      education_stage,
      referral_source,
      report_consent,
      marketing_consent,
      completed_at,
      readiness_score,
      result_band,
      category_scores,
      strengths,
      risk_areas,
      priority_areas,
      action_plan,
      action_plan_summary
    )
    VALUES (
      ${params.id},
      ${params.registration.firstName},
      ${params.registration.lastName},
      ${params.registration.age},
      ${params.registration.email},
      ${params.registration.educationStage},
      ${params.registration.referralSource || null},
      ${params.registration.reportConsent},
      ${params.registration.marketingConsent},
      NOW(),
      ${params.scores.readinessScore},
      ${params.scores.band},
      ${JSON.stringify(params.scores.categoryScores)}::jsonb,
      ${JSON.stringify(params.scores.strengths)}::jsonb,
      ${JSON.stringify(params.scores.riskAreas)}::jsonb,
      ${JSON.stringify(params.priorityAreas)}::jsonb,
      ${JSON.stringify(params.actionPlan)}::jsonb,
      ${params.actionPlanSummary}
    )
  `;
}

export async function getAssessment(id: string): Promise<SavedAssessment | null> {
  const sql = getSql();
  const rows = await sql`SELECT * FROM assessment_results WHERE id = ${id} LIMIT 1`;
  const row = rows[0] as StoredAssessmentRow | undefined;
  if (!row) return null;

  return {
    id: row.id,
    registration: {
      firstName: row.first_name,
      lastName: row.last_name,
      age: row.age,
      email: row.email,
      educationStage: row.education_stage ?? "",
      legacyUserType: row.user_type ?? undefined,
      referralSource: row.referral_source ?? "",
      reportConsent: row.report_consent,
      marketingConsent: row.marketing_consent,
    },
    completedAt: row.completed_at,
    scores: {
      totalScore: 0,
      maxScore: 0,
      readinessScore: row.readiness_score,
      categoryScores: row.category_scores,
      band: row.result_band,
      strengths: row.strengths,
      riskAreas: row.risk_areas,
      nextSteps: [],
    },
    priorityAreas: row.priority_areas,
    actionPlan: row.action_plan,
    actionPlanSummary: row.action_plan_summary,
  };
}

export async function recordPremiumInterest(params: {
  assessmentId: string;
  interestType: "unlock_click";
}) {
  const sql = getSql();
  await ensurePremiumInterestTable();

  const rows = await sql`
    INSERT INTO premium_plan_interest (assessment_id, email, interest_type)
    SELECT id, email, ${params.interestType}
    FROM assessment_results
    WHERE id = ${params.assessmentId}
    RETURNING id
  `;

  return rows.length > 0;
}

async function ensureAssessmentTable() {
  if (schemaReady) return;
  const sql = getSql();

  await sql`
    CREATE TABLE IF NOT EXISTS assessment_results (
      id UUID PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      age INTEGER NOT NULL,
      email TEXT NOT NULL,
      education_stage TEXT,
      user_type TEXT,
      referral_source TEXT,
      report_consent BOOLEAN NOT NULL,
      marketing_consent BOOLEAN NOT NULL DEFAULT FALSE,
      completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      readiness_score INTEGER NOT NULL,
      result_band TEXT NOT NULL,
      category_scores JSONB NOT NULL,
      strengths JSONB NOT NULL,
      risk_areas JSONB NOT NULL,
      priority_areas JSONB NOT NULL,
      action_plan JSONB NOT NULL,
      action_plan_summary TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`ALTER TABLE assessment_results ADD COLUMN IF NOT EXISTS education_stage TEXT`;
  await sql`ALTER TABLE assessment_results ALTER COLUMN user_type DROP NOT NULL`;
  await sql`ALTER TABLE assessment_results ADD COLUMN IF NOT EXISTS referral_source TEXT`;
  await sql`CREATE INDEX IF NOT EXISTS assessment_results_email_idx ON assessment_results (email)`;
  await sql`CREATE INDEX IF NOT EXISTS assessment_results_completed_at_idx ON assessment_results (completed_at DESC)`;
  schemaReady = true;
}

async function ensurePremiumInterestTable() {
  if (premiumInterestSchemaReady) return;
  await ensureAssessmentTable();
  const sql = getSql();

  await sql`
    CREATE TABLE IF NOT EXISTS premium_plan_interest (
      id BIGSERIAL PRIMARY KEY,
      assessment_id UUID NOT NULL REFERENCES assessment_results(id) ON DELETE CASCADE,
      email TEXT NOT NULL,
      interest_type TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    ALTER TABLE premium_plan_interest
    DROP CONSTRAINT IF EXISTS premium_plan_interest_interest_type_check
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS premium_plan_interest_assessment_idx
    ON premium_plan_interest (assessment_id, created_at DESC)
  `;
  premiumInterestSchemaReady = true;
}
