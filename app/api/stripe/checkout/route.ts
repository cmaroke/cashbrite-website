import { NextResponse } from "next/server";
import { getAssessment, recordPremiumInterest } from "@/lib/assessmentDb";
import { saveCheckoutPurchase } from "@/lib/premiumPurchaseDb";
import { getSiteUrl, getStripe, moneyReadyPlanProduct } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { assessmentId?: unknown };
    if (typeof body.assessmentId !== "string" || !uuidPattern.test(body.assessmentId)) {
      return NextResponse.json({ error: "A valid assessment is required." }, { status: 400 });
    }

    const priceId = process.env.STRIPE_PRICE_ID;
    if (!priceId) {
      return NextResponse.json({ error: "Checkout is not configured yet." }, { status: 503 });
    }

    const assessment = await getAssessment(body.assessmentId);
    if (!assessment) {
      return NextResponse.json({ error: "Assessment not found." }, { status: 404 });
    }

    const stripe = getStripe();
    const siteUrl = getSiteUrl(new URL(request.url).origin);
    const metadata = {
      assessment_id: assessment.id,
      email: assessment.registration.email,
      product: moneyReadyPlanProduct,
    };

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: assessment.registration.email,
      client_reference_id: assessment.id,
      line_items: [{ price: priceId, quantity: 1 }],
      metadata,
      payment_intent_data: { metadata },
      success_url: `${siteUrl}/money-ready-plan/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/results?id=${assessment.id}`,
    });

    if (!session.url) {
      throw new Error("Stripe did not return a Checkout URL.");
    }

    const trackingResults = await Promise.allSettled([
      saveCheckoutPurchase({
        assessmentId: assessment.id,
        email: assessment.registration.email,
        checkoutSessionId: session.id,
        amount: session.amount_total ?? 1900,
        currency: session.currency ?? "gbp",
      }),
      recordPremiumInterest({ assessmentId: assessment.id, interestType: "unlock_click" }),
    ]);

    trackingResults.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(index === 0 ? "Stripe purchase tracking failed" : "Premium interest tracking failed", {
          checkoutSessionId: session.id,
          assessmentId: assessment.id,
          error: getSafeErrorMessage(result.reason),
        });
      }
    });

    return NextResponse.json(
      { checkoutUrl: session.url },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Stripe Checkout session creation failed", {
      error: getSafeErrorMessage(error),
    });
    return NextResponse.json(
      { error: "We could not start checkout. Please try again in a moment." },
      { status: 500 },
    );
  }
}

function getSafeErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown checkout error";
}
