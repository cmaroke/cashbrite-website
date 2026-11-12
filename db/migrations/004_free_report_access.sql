-- Review and apply separately before enabling the registration-first report flow.
-- Historical assessments/purchases remain unchanged and have no free-access grant.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '60s';
ALTER TABLE assessment_results
  ADD COLUMN report_access_hash TEXT,
  ADD COLUMN report_request_hash TEXT,
  ADD COLUMN report_email_status TEXT CHECK (report_email_status IN ('pending','sent','failed','needs_review'));
CREATE UNIQUE INDEX assessment_report_access_idx ON assessment_results (report_access_hash)
  WHERE report_access_hash IS NOT NULL;
COMMIT;
