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

CREATE TABLE IF NOT EXISTS premium_purchases (
  id BIGSERIAL PRIMARY KEY,
  assessment_id UUID NOT NULL REFERENCES assessment_results(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  stripe_checkout_session_id TEXT NOT NULL UNIQUE,
  stripe_payment_intent_id TEXT,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL,
  payment_status TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS premium_purchases_assessment_idx
ON premium_purchases (assessment_id, created_at DESC);

CREATE INDEX IF NOT EXISTS premium_purchases_payment_intent_idx
ON premium_purchases (stripe_payment_intent_id);
