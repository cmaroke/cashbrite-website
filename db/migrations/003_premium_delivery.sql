-- Apply explicitly after backup/review. Never run from a request handler.
BEGIN;
LOCK TABLE premium_purchases IN SHARE ROW EXCLUSIVE MODE;
ALTER TABLE premium_purchases
  ADD COLUMN delivery_status TEXT NOT NULL DEFAULT 'needs_review',
  ADD COLUMN delivery_attempts INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN delivery_lease_until TIMESTAMPTZ,
  ADD COLUMN delivery_next_attempt_at TIMESTAMPTZ,
  ADD COLUMN delivery_sent_at TIMESTAMPTZ,
  ADD COLUMN delivery_provider_id TEXT,
  ADD COLUMN delivery_error_code TEXT,
  ADD COLUMN delivery_claim_token UUID,
  ADD COLUMN delivery_provider_started_at TIMESTAMPTZ,
  ADD COLUMN delivery_audit JSONB NOT NULL DEFAULT '[]'::jsonb;
-- Preserve unknown historical paid outcomes. Never automatically resend them.
UPDATE premium_purchases SET delivery_status = 'pending'
WHERE payment_status IS DISTINCT FROM 'paid';
ALTER TABLE premium_purchases ALTER COLUMN delivery_status SET DEFAULT 'pending';
ALTER TABLE premium_purchases ADD CONSTRAINT premium_delivery_status_check
  CHECK (delivery_status IN ('pending', 'sending', 'failed', 'sent', 'needs_review'));
ALTER TABLE premium_purchases ADD CONSTRAINT premium_delivery_attempts_check
  CHECK (delivery_attempts >= 0);
CREATE INDEX premium_delivery_retry_idx ON premium_purchases (delivery_next_attempt_at)
  WHERE payment_status = 'paid' AND delivery_status IN ('pending', 'failed');
COMMIT;
