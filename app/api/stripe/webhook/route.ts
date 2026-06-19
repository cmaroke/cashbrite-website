import type Stripe from "stripe";
import { NextResponse } from "next/server";
import { sendPremiumPurchaseConfirmation } from "@/lib/assessmentEmail";
import { getAssessment } from "@/lib/assessmentDb";
import { markCheckoutExpired, markPaymentFailed, markPurchasePaid } from "@/lib/premiumPurchaseDb";
import { getSiteUrl, getStripe, moneyReadyPlanProduct } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Stripe webhook is not configured." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const rawBody = await request.text();
    event = getStripe().webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      await handleCompletedCheckout(event.data.object as Stripe.Checkout.Session);
    } else if (event.type === "checkout.session.expired") {
      const session = event.data.object as Stripe.Checkout.Session;
      await markCheckoutExpired(session.id);
    } else if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const assessmentId = paymentIntent.metadata.assessment_id;
      if (assessmentId) {
        await markPaymentFailed({ assessmentId, paymentIntentId: paymentIntent.id });
      }
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }
}

async function handleCompletedCheckout(session: Stripe.Checkout.Session) {
  const assessmentId = session.metadata?.assessment_id;
  const product = session.metadata?.product;
  const email = session.metadata?.email ?? session.customer_details?.email;

  if (!assessmentId || !email || product !== moneyReadyPlanProduct || session.payment_status !== "paid") {
    return;
  }

  const newlyPaid = await markPurchasePaid({
    assessmentId,
    email,
    checkoutSessionId: session.id,
    paymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : null,
    amount: session.amount_total ?? 1900,
    currency: session.currency ?? "gbp",
  });

  if (!newlyPaid) return;

  const assessment = await getAssessment(assessmentId);
  if (!assessment) return;

  const accessUrl = `${getSiteUrl()}/money-ready-plan/success?session_id=${encodeURIComponent(session.id)}`;
  await sendPremiumPurchaseConfirmation({
    registration: assessment.registration,
    amount: session.amount_total ?? 1900,
    currency: session.currency ?? "gbp",
    accessUrl,
  });
}
