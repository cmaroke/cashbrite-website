-- Read-only schema evidence. Does not query purchase or assessment records.
BEGIN READ ONLY;
SET LOCAL statement_timeout = '10s';
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'premium_purchases'
ORDER BY ordinal_position;

SELECT conname, convalidated, pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE conrelid = 'public.premium_purchases'::regclass
ORDER BY conname;

SELECT indexrelid::regclass::text AS index_name, indisvalid, indisready,
       pg_get_indexdef(indexrelid) AS definition
FROM pg_index
WHERE indrelid = 'public.premium_purchases'::regclass
ORDER BY indexrelid::regclass::text;

DO $$
BEGIN
  IF (SELECT count(*) FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'premium_purchases'
        AND column_name IN ('delivery_status', 'delivery_attempts', 'delivery_lease_until',
          'delivery_next_attempt_at', 'delivery_sent_at', 'delivery_provider_id',
          'delivery_error_code', 'delivery_claim_token', 'delivery_provider_started_at',
          'delivery_audit')) <> 10 THEN
    RAISE EXCEPTION 'Delivery schema verification failed: missing columns';
  END IF;
  IF (SELECT count(*) FROM pg_constraint
      WHERE conrelid = 'public.premium_purchases'::regclass AND convalidated
        AND conname IN ('premium_delivery_status_check', 'premium_delivery_attempts_check')) <> 2 THEN
    RAISE EXCEPTION 'Delivery schema verification failed: missing validated constraints';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_index
      WHERE indrelid = 'public.premium_purchases'::regclass
        AND indexrelid = to_regclass('public.premium_delivery_retry_idx')
        AND indisvalid AND indisready) THEN
    RAISE EXCEPTION 'Delivery schema verification failed: missing valid retry index';
  END IF;
END $$;
COMMIT;
