import "server-only";
import { neon } from "@neondatabase/serverless";

export type Purchase = {
  id: string; assessment_id: string; email: string; stripe_checkout_session_id: string;
  stripe_payment_intent_id: string | null; amount: number; currency: string; payment_status: string;
  delivery_status: "pending" | "sending" | "failed" | "sent" | "needs_review";
  delivery_attempts: number; delivery_claim_token: string | null; delivery_provider_id: string | null;
  delivery_error_code: string | null; delivery_next_attempt_at: string | null; delivery_sent_at: string | null;
  delivery_lease_until: string | null; delivery_provider_started_at: string | null;
  updated_at: string;
};
function sql() {
  if (!process.env.DATABASE_URL) throw new Error("purchase_storage_unavailable");
  return neon(process.env.DATABASE_URL);
}
type PurchaseInput = { assessmentId: string; email: string; checkoutSessionId: string; amount: number; currency: string; paymentIntentId?: string | null };
function purchaseRow(row: Record<string, unknown> | undefined): Purchase | null {
  return row ? { ...row, id: String(row.id) } as Purchase : null;
}

// Schema changes are an explicit deployment operation, never request-time DDL.
export async function saveCheckoutPurchase(p: PurchaseInput) {
  await sql()`INSERT INTO premium_purchases (assessment_id,email,stripe_checkout_session_id,stripe_payment_intent_id,amount,currency,payment_status)
    VALUES (${p.assessmentId},${p.email},${p.checkoutSessionId},${p.paymentIntentId ?? null},${p.amount},${p.currency},'checkout_created')
    ON CONFLICT (stripe_checkout_session_id) DO NOTHING`;
}
export async function markPurchasePaid(p: PurchaseInput): Promise<Purchase> {
  const rows = await sql()`INSERT INTO premium_purchases (assessment_id,email,stripe_checkout_session_id,stripe_payment_intent_id,amount,currency,payment_status)
    VALUES (${p.assessmentId},${p.email},${p.checkoutSessionId},${p.paymentIntentId ?? null},${p.amount},${p.currency},'paid')
    ON CONFLICT (stripe_checkout_session_id) DO UPDATE SET payment_status='paid',
      stripe_payment_intent_id=EXCLUDED.stripe_payment_intent_id, updated_at=NOW()
    WHERE premium_purchases.assessment_id=EXCLUDED.assessment_id AND premium_purchases.amount=EXCLUDED.amount
      AND premium_purchases.currency=EXCLUDED.currency
    RETURNING *`;
  if (!rows[0]) throw new Error("purchase_link_conflict");
  return purchaseRow(rows[0])!;
}
export async function getPurchase(id: string): Promise<Purchase | null> {
  // Preserve PostgreSQL microseconds for optimistic reconciliation, including legacy null claims.
  const rows = await sql()`SELECT *, updated_at::text AS updated_at FROM premium_purchases WHERE id=${id}`;
  return purchaseRow(rows[0]);
}
export async function findSessionPurchase(sessionId: string): Promise<Purchase | null> {
  const rows = await sql()`SELECT * FROM premium_purchases WHERE stripe_checkout_session_id=${sessionId}`;
  return purchaseRow(rows[0]);
}
export async function assessmentPurchases(id: string): Promise<Purchase[]> {
  const rows = await sql()`SELECT * FROM premium_purchases WHERE assessment_id=${id}
    ORDER BY (payment_status='paid') DESC, created_at DESC, id DESC`;
  return rows.map((row) => purchaseRow(row)!);
}
export async function claimDelivery(id: string, token: string): Promise<Purchase | null> {
  // A crash after provider invocation is ambiguous, not permission for an automatic resend.
  await sql()`UPDATE premium_purchases SET
    delivery_status=CASE WHEN delivery_provider_started_at IS NULL AND delivery_attempts<5 THEN 'failed' ELSE 'needs_review' END,
    delivery_error_code=CASE WHEN delivery_provider_started_at IS NULL THEN 'lease_expired_before_send' ELSE 'ambiguous_expired_lease' END,
    delivery_lease_until=NULL, updated_at=NOW()
    WHERE id=${id} AND delivery_status='sending' AND delivery_lease_until < NOW()`;
  const rows = await sql()`UPDATE premium_purchases SET delivery_status='sending',delivery_attempts=delivery_attempts+1,
    delivery_claim_token=${token},delivery_provider_started_at=NULL,delivery_lease_until=NOW()+INTERVAL '5 minutes',
    delivery_next_attempt_at=NULL,updated_at=NOW()
    WHERE id=${id} AND payment_status='paid' AND delivery_status IN ('pending','failed') AND delivery_attempts<5
      AND (delivery_next_attempt_at IS NULL OR delivery_next_attempt_at<=NOW()) RETURNING *`;
  return purchaseRow(rows[0]);
}
export async function beginProvider(id: string, token: string): Promise<boolean> {
  const rows = await sql()`UPDATE premium_purchases SET delivery_provider_started_at=NOW()
    WHERE id=${id} AND delivery_status='sending' AND delivery_claim_token=${token} AND delivery_lease_until>NOW() RETURNING id`;
  return rows.length === 1;
}
export async function finishDelivery(id: string, token: string, status: "sent" | "failed" | "needs_review", code: string | null, providerId: string | null = null) {
  const rows = await sql()`UPDATE premium_purchases SET
    delivery_status=CASE WHEN ${status}='failed' AND delivery_attempts>=5 THEN 'needs_review' ELSE ${status} END,
    delivery_provider_id=COALESCE(${providerId},delivery_provider_id),
    delivery_sent_at=CASE WHEN ${status}='sent' THEN NOW() ELSE delivery_sent_at END,
    delivery_error_code=${code},delivery_lease_until=NULL,
    delivery_next_attempt_at=CASE WHEN ${status}='failed' AND delivery_attempts<5
      THEN NOW() + (CASE delivery_attempts WHEN 1 THEN 60 WHEN 2 THEN 300 WHEN 3 THEN 1800 ELSE 7200 END)*INTERVAL '1 second' ELSE NULL END,
    updated_at=NOW()
    WHERE id=${id} AND delivery_claim_token=${token} AND delivery_status IN ('sending','needs_review') RETURNING id`;
  if (rows.length !== 1) throw new Error("delivery_claim_lost");
}
export async function reconcileDelivery(id: string, outcome: "accepted" | "not_sent", providerId: string | null, audit: Record<string, string>, expected: Pick<Purchase, "delivery_claim_token" | "delivery_attempts" | "updated_at">) {
  const rows = await sql()`UPDATE premium_purchases SET
    delivery_status=CASE WHEN ${outcome}='accepted' THEN 'sent' ELSE 'failed' END,
    delivery_sent_at=CASE WHEN ${outcome}='accepted' THEN NOW() ELSE NULL END,
    delivery_provider_id=${providerId},delivery_error_code='operator_reconciled',delivery_attempts=0,
    delivery_claim_token=NULL,delivery_provider_started_at=NULL,delivery_lease_until=NULL,delivery_next_attempt_at=NULL,
    delivery_audit=delivery_audit || ${JSON.stringify([{ ...audit, outcome, claimToken: expected.delivery_claim_token, attempts: expected.delivery_attempts, reviewedVersion: expected.updated_at, providerId, at: new Date().toISOString() }])}::jsonb,updated_at=NOW()
    WHERE id=${id} AND payment_status='paid' AND delivery_status='needs_review'
      AND delivery_claim_token IS NOT DISTINCT FROM ${expected.delivery_claim_token}::uuid
      AND delivery_attempts=${expected.delivery_attempts} AND updated_at=${expected.updated_at}::timestamptz RETURNING id`;
  if (rows.length !== 1) throw new Error("reconciliation_not_eligible");
}
export async function markCheckoutExpired(sessionId: string) {
  await sql()`UPDATE premium_purchases SET payment_status='cancelled',updated_at=NOW()
    WHERE stripe_checkout_session_id=${sessionId} AND payment_status IS DISTINCT FROM 'paid'`;
}
export async function markCheckoutFailed(sessionId: string) {
  await sql()`UPDATE premium_purchases SET payment_status='failed',updated_at=NOW()
    WHERE stripe_checkout_session_id=${sessionId} AND payment_status IS DISTINCT FROM 'paid'`;
}
export async function markPaymentFailed(p: { assessmentId: string; paymentIntentId: string }) {
  await sql()`UPDATE premium_purchases SET payment_status='failed',updated_at=NOW()
    WHERE assessment_id=${p.assessmentId} AND stripe_payment_intent_id=${p.paymentIntentId} AND payment_status IS DISTINCT FROM 'paid'`;
}
