import "server-only";
import { neon } from "@neondatabase/serverless";

// Read-only exception discovery. Age uses created_at because webhook replays refresh updated_at.
export async function checkDeliveryHealth() {
  if (!process.env.DATABASE_URL) throw new Error("health_storage_unavailable");
  const rows = await neon(process.env.DATABASE_URL)`WITH exceptions AS (
    SELECT p.id::text AS "purchaseId", CASE
      WHEN a.id IS NULL THEN 'missing_assessment_reference'
      WHEN p.payment_status='paid' AND p.delivery_attempts>=5
        AND (p.delivery_status IN ('pending','failed','needs_review') OR
          (p.delivery_status='sending' AND (p.delivery_lease_until IS NULL OR p.delivery_lease_until<NOW()))) THEN 'attempts_exhausted'
      WHEN p.payment_status='paid' AND p.delivery_status='needs_review' THEN 'needs_review'
      WHEN p.payment_status='paid' AND p.delivery_status='sending'
        AND (p.delivery_lease_until IS NULL OR p.delivery_lease_until<NOW()) THEN 'expired_lease'
      WHEN p.payment_status='paid' AND p.delivery_status='failed'
        AND (p.delivery_next_attempt_at IS NULL OR p.delivery_next_attempt_at<NOW()-INTERVAL '5 minutes') THEN 'retry_overdue'
      WHEN p.payment_status='paid' AND p.delivery_status='pending' AND p.created_at<NOW()-INTERVAL '10 minutes' THEN 'pending_overdue'
      WHEN p.payment_status='checkout_created' AND p.created_at<NOW()-INTERVAL '1 hour' THEN 'payment_confirmation_check'
      ELSE NULL END AS reason
    FROM premium_purchases p LEFT JOIN assessment_results a ON a.id=p.assessment_id
  ) SELECT "purchaseId", reason, COUNT(*) OVER()::integer AS total
    FROM exceptions WHERE reason IS NOT NULL ORDER BY "purchaseId"::bigint LIMIT 200`;
  return { status: rows.length ? "attention_required" : "healthy", total: Number(rows[0]?.total ?? 0),
    truncated: Number(rows[0]?.total ?? 0) > rows.length,
    exceptions: rows.map((row) => ({ purchaseId: String(row.purchaseId), reason: String(row.reason) })) };
}
