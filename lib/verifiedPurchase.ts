import "server-only";
import type Stripe from "stripe";
import { getAssessment } from "@/lib/assessmentDb";
import { getStripe, moneyReadyPlanProduct } from "@/lib/stripe";
import { PurchaseError } from "@/lib/purchaseSafety";

export const sessionPattern = /^cs_(test|live)_[A-Za-z0-9]+$/;
export async function verifyPaidPurchase(sessionId: string) {
  if (!sessionPattern.test(sessionId)) throw new PurchaseError("invalid_access");
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ["line_items.data.price"] });
  const id = session.metadata?.assessment_id;
  if (session.status !== "complete" || session.payment_status !== "paid" || session.mode !== "payment" ||
      session.metadata?.product !== moneyReadyPlanProduct || session.amount_total !== 1900 || session.currency !== "gbp") {
    throw new PurchaseError("payment_not_verified");
  }
  if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id) || session.client_reference_id !== id) throw new PurchaseError("missing_assessment_reference");
  const items = session.line_items;
  const price = items?.data[0]?.price;
  if (!process.env.STRIPE_PRICE_ID || !items || items.has_more || items.data.length !== 1 ||
      items.data[0].quantity !== 1 || price?.id !== process.env.STRIPE_PRICE_ID || price.unit_amount !== 1900 || price.currency !== "gbp" || price.recurring) {
    throw new PurchaseError("price_not_verified");
  }
  const assessment = await getAssessment(id);
  if (!assessment) throw new PurchaseError("assessment_unavailable");
  return { session, assessment };
}

export function intentId(session: Stripe.Checkout.Session) {
  return typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id ?? null;
}
