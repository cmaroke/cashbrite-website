-- Metadata only: no assessment, customer or purchase rows are read.
DO $$
BEGIN
  IF (SELECT count(*) FROM information_schema.columns
      WHERE table_schema='public' AND table_name='assessment_results'
        AND column_name IN ('report_access_hash','report_request_hash','report_email_status')
        AND data_type='text' AND is_nullable='YES') <> 3 THEN
    RAISE EXCEPTION 'Free report columns incomplete';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_index i JOIN pg_class c ON c.oid=i.indexrelid
      WHERE c.relname='assessment_report_access_idx' AND i.indisunique
        AND i.indisvalid AND i.indisready AND i.indpred IS NOT NULL) THEN
    RAISE EXCEPTION 'Free report unique index unavailable';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint
      WHERE conrelid='public.assessment_results'::regclass AND contype='c'
        AND convalidated AND pg_get_constraintdef(oid) LIKE '%report_email_status%') THEN
    RAISE EXCEPTION 'Free report email status constraint unavailable';
  END IF;
END $$;
SELECT column_name,data_type,is_nullable
FROM information_schema.columns
WHERE table_schema='public' AND table_name='assessment_results'
  AND column_name IN ('report_access_hash','report_request_hash','report_email_status');
