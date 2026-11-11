import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, moneyReadyPlanProduct } from "@/lib/stripe";
import { recordVerifiedPayment, fulfilPurchase } from "@/lib/purchaseDelivery";
import { markCheckoutExpired, markCheckoutFailed, markPaymentFailed } from "@/lib/premiumPurchaseDb";
import { privateHeaders, purchaseLog, PurchaseError } from "@/lib/purchaseSafety";

export const runtime = "nodejs";
export async function POST(request: Request) {
  let event: Stripe.Event;
  try {
    const signature = request.headers.get("stripe-signature");
    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) throw new Error("unconfigured");
    event = getStripe().webhooks.constructEvent(await request.text(), signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch { return NextResponse.json({ error: "Webhook signature could not be verified." }, { status: 400, headers: privateHeaders }); }
  try {
    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.metadata?.product && session.metadata.product !== moneyReadyPlanProduct) return NextResponse.json({ received: true }, { headers: privateHeaders });
      if (session.payment_status !== "paid") return NextResponse.json({ received: true }, { headers: privateHeaders });
      const { purchase } = await recordVerifiedPayment(session.id);
      const outcome = await fulfilPurchase(purchase.id);
      if (outcome === "deferred") return NextResponse.json({ error: "Delivery retry pending." }, { status: 503, headers: privateHeaders });
      if (outcome === "needs_review") purchaseLog("delivery_needs_review", purchase.id);
    } else if (event.type === "checkout.session.expired") {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.metadata?.product === moneyReadyPlanProduct) await markCheckoutExpired(session.id);
    } else if (event.type === "payment_intent.payment_failed") {
      const intent = event.data.object as Stripe.PaymentIntent;
      if (intent.metadata.product === moneyReadyPlanProduct && intent.metadata.assessment_id) {
        await markPaymentFailed({ assessmentId: intent.metadata.assessment_id, paymentIntentId: intent.id });
      }
    } else if (event.type === "checkout.session.async_payment_failed") {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.metadata?.product === moneyReadyPlanProduct) await markCheckoutFailed(session.id);
    }
    return NextResponse.json({ received: true }, { headers: privateHeaders });
  } catch (error) {
    purchaseLog(error instanceof PurchaseError ? error.code : "webhook_processing_failed", event.id);
    return NextResponse.json({ error: "Purchase processing requires retry." }, { status: 500, headers: privateHeaders });
  }
}
