CREATE TABLE IF NOT EXISTS assessment_results (
  id UUID PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  email TEXT NOT NULL,
  user_type TEXT NOT NULL,
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
);

CREATE INDEX IF NOT EXISTS assessment_results_email_idx ON assessment_results (email);
CREATE INDEX IF NOT EXISTS assessment_results_completed_at_idx ON assessment_results (completed_at DESC);

CREATE TABLE IF NOT EXISTS premium_plan_interest (
  id BIGSERIAL PRIMARY KEY,
  assessment_id UUID NOT NULL REFERENCES assessment_results(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  interest_type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS premium_plan_interest_assessment_idx
ON premium_plan_interest (assessment_id, created_at DESC);
