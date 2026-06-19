import { neon } from "@neondatabase/serverless";

let purchaseSchemaReady = false;

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured.");
  }

  return neon(databaseUrl);
}

export async function saveCheckoutPurchase(params: {
  assessmentId: string;
  email: string;
  checkoutSessionId: string;
  amount: number;
  currency: string;
}) {
  await ensurePremiumPurchasesTable();
  const sql = getSql();

  await sql`
    INSERT INTO premium_purchases (
      assessment_id,
      email,
      stripe_checkout_session_id,
      amount,
      currency,
      payment_status
    ) VALUES (
      ${params.assessmentId},
      ${params.email},
      ${params.checkoutSessionId},
      ${params.amount},
      ${params.currency},
      'checkout_created'
    )
    ON CONFLICT (stripe_checkout_session_id) DO UPDATE SET
      email = EXCLUDED.email,
      amount = EXCLUDED.amount,
      currency = EXCLUDED.currency,
      updated_at = NOW()
  `;
}

export async function markPurchasePaid(params: {
  assessmentId: string;
  email: string;
  checkoutSessionId: string;
  paymentIntentId: string | null;
  amount: number;
  currency: string;
}) {
  await ensurePremiumPurchasesTable();
  const sql = getSql();

  const rows = await sql`
    INSERT INTO premium_purchases (
      assessment_id,
      email,
      stripe_checkout_session_id,
      stripe_payment_intent_id,
      amount,
      currency,
      payment_status
    ) VALUES (
      ${params.assessmentId},
      ${params.email},
      ${params.checkoutSessionId},
      ${params.paymentIntentId},
      ${params.amount},
      ${params.currency},
      'paid'
    )
    ON CONFLICT (stripe_checkout_session_id) DO UPDATE SET
      email = EXCLUDED.email,
      stripe_payment_intent_id = EXCLUDED.stripe_payment_intent_id,
      amount = EXCLUDED.amount,
      currency = EXCLUDED.currency,
      payment_status = 'paid',
      updated_at = NOW()
    WHERE premium_purchases.payment_status IS DISTINCT FROM 'paid'
    RETURNING id
  `;

  return rows.length > 0;
}

export async function markCheckoutExpired(checkoutSessionId: string) {
  await ensurePremiumPurchasesTable();
  const sql = getSql();

  await sql`
    UPDATE premium_purchases
    SET payment_status = 'cancelled', updated_at = NOW()
    WHERE stripe_checkout_session_id = ${checkoutSessionId}
      AND payment_status IS DISTINCT FROM 'paid'
  `;
}

export async function markPaymentFailed(params: { assessmentId: string; paymentIntentId: string }) {
  await ensurePremiumPurchasesTable();
  const sql = getSql();

  await sql`
    UPDATE premium_purchases
    SET
      stripe_payment_intent_id = ${params.paymentIntentId},
      payment_status = 'failed',
      updated_at = NOW()
    WHERE id = (
      SELECT id
      FROM premium_purchases
      WHERE assessment_id = ${params.assessmentId}
        AND payment_status IS DISTINCT FROM 'paid'
      ORDER BY created_at DESC
      LIMIT 1
    )
  `;
}

async function ensurePremiumPurchasesTable() {
  if (purchaseSchemaReady) return;
  const sql = getSql();

  await sql`
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
    )
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS premium_purchases_assessment_idx
    ON premium_purchases (assessment_id, created_at DESC)
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS premium_purchases_payment_intent_idx
    ON premium_purchases (stripe_payment_intent_id)
  `;
  purchaseSchemaReady = true;
}
