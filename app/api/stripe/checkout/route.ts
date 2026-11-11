import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { getAssessment, recordPremiumInterest } from "@/lib/assessmentDb";
import { assessmentPurchases, saveCheckoutPurchase } from "@/lib/premiumPurchaseDb";
import { getSiteUrl, getStripe, moneyReadyPlanProduct } from "@/lib/stripe";
import { privateHeaders, purchaseLog } from "@/lib/purchaseSafety";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  try {
    const { assessmentId } = await request.json() as { assessmentId?: unknown };
    if (typeof assessmentId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(assessmentId)) {
      return NextResponse.json({ error: "A valid assessment is required." }, { status: 400, headers: privateHeaders });
    }
    const assessment = await getAssessment(assessmentId);
    if (!assessment) return NextResponse.json({ error: "Assessment not available." }, { status: 404, headers: privateHeaders });
    const stripe = getStripe();
    const purchases = await assessmentPurchases(assessmentId);
    // Do not reveal an existing paid capability to someone possessing only a free-results UUID.
    const alreadyPaid = () => NextResponse.json({ error: "If you have already paid, use your confirmation link or contact Cashbrite. Do not pay again." }, { status: 409, headers: privateHeaders });
    if (purchases.some((p) => p.payment_status === "paid")) return alreadyPaid();
    for (const purchase of purchases) {
      const existing = await stripe.checkout.sessions.retrieve(purchase.stripe_checkout_session_id, { expand: ["line_items.data.price"] });
      if (existing.payment_status === "paid" || (existing.status === "complete" && purchase.payment_status !== "failed")) return alreadyPaid();
      if (existing.status === "open" && existing.url && existing.amount_total === 1900 && existing.currency === "gbp" &&
          existing.mode === "payment" && existing.client_reference_id === assessmentId && existing.metadata?.assessment_id === assessmentId && existing.metadata.product === moneyReadyPlanProduct &&
          !existing.line_items?.has_more && existing.line_items?.data.length === 1 && existing.line_items.data[0].quantity === 1 && existing.line_items.data[0].price?.id === process.env.STRIPE_PRICE_ID) {
        return NextResponse.json({ checkoutUrl: existing.url }, { headers: privateHeaders });
      }
      if (existing.status === "open") throw new Error("existing_attempt_requires_review");
    }
    const priceId = process.env.STRIPE_PRICE_ID;
    if (!priceId) throw new Error("price_unconfigured");
    const price = await stripe.prices.retrieve(priceId);
    if (!price.active || price.unit_amount !== 1900 || price.currency !== "gbp" || price.recurring) throw new Error("price_invalid");
    const metadata = { assessment_id: assessmentId, email: assessment.registration.email, product: moneyReadyPlanProduct };
    const siteUrl = getSiteUrl();
    // Concurrent requests observing the same last attempt use the same provider key.
    const attempt = purchases[0]?.stripe_checkout_session_id ?? "initial";
    const key = createHash("sha256").update(`${assessmentId}/${attempt}`).digest("hex");
    const session = await stripe.checkout.sessions.create({ mode: "payment", customer_email: assessment.registration.email,
      client_reference_id: assessmentId, line_items: [{ price: priceId, quantity: 1 }], metadata,
      payment_intent_data: { metadata }, success_url: `${siteUrl}/money-ready-plan/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/results?id=${assessmentId}`,
    }, { idempotencyKey: `cashbrite-checkout/${key}` });
    if (!session.url || session.amount_total !== 1900 || session.currency !== "gbp") throw new Error("checkout_invalid");
    await saveCheckoutPurchase({ assessmentId, email: assessment.registration.email, checkoutSessionId: session.id,
      paymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : null, amount: 1900, currency: "gbp" });
    await recordPremiumInterest({ assessmentId, interestType: "unlock_click" }).catch(() => purchaseLog("interest_tracking_failed"));
    return NextResponse.json({ checkoutUrl: session.url }, { headers: privateHeaders });
  } catch {
    purchaseLog("checkout_unavailable");
    return NextResponse.json({ error: "We could not safely open checkout. Please try again, or contact Cashbrite if you have already paid." }, { status: 503, headers: privateHeaders });
  }
}
