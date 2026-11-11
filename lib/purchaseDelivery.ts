import "server-only";
import { randomUUID } from "node:crypto";
import * as storage from "@/lib/premiumPurchaseDb";
import { verifyPaidPurchase, intentId } from "@/lib/verifiedPurchase";
import { generateMoneyReadyPlanPdf } from "@/lib/moneyReadyPlanPdf";
import { sendPremiumPurchaseConfirmation, sendInternalPurchaseNotification } from "@/lib/assessmentEmail";
import { getSiteUrl } from "@/lib/stripe";
import { PurchaseError, purchaseLog } from "@/lib/purchaseSafety";

export type DeliveryOutcome = "sent" | "deferred" | "needs_review";

export async function recordVerifiedPayment(sessionId: string) {
  const verified = await verifyPaidPurchase(sessionId);
  const purchase = await storage.markPurchasePaid({
    assessmentId: verified.assessment.id, email: verified.assessment.registration.email,
    checkoutSessionId: verified.session.id, paymentIntentId: intentId(verified.session), amount: 1900, currency: "gbp",
  });
  return { ...verified, purchase };
}

export async function fulfilPurchase(purchaseId: string): Promise<DeliveryOutcome> {
  const token = randomUUID();
  const claim = await storage.claimDelivery(purchaseId, token);
  if (!claim) {
    const current = await storage.getPurchase(purchaseId);
    return current?.delivery_status === "sent" ? "sent" : current?.delivery_status === "needs_review" ? "needs_review" : "deferred";
  }
  let providerStarted = false;
  try {
    const { assessment } = await verifyPaidPurchase(claim.stripe_checkout_session_id);
    if (assessment.id !== claim.assessment_id) throw new PurchaseError("purchase_link_conflict");
    if (!process.env.RESEND_API_KEY || !process.env.CONTACT_FROM_EMAIL) throw new PurchaseError("email_not_configured");
    const accessUrl = `${getSiteUrl()}/money-ready-plan/success?session_id=${encodeURIComponent(claim.stripe_checkout_session_id)}`;
    const pdfAttachment = await generateMoneyReadyPlanPdf(assessment);
    if (!await storage.beginProvider(purchaseId, token)) throw new PurchaseError("delivery_claim_lost");
    providerStarted = true;
    const result = await sendPremiumPurchaseConfirmation({
      registration: assessment.registration, amount: claim.amount, currency: claim.currency,
      accessUrl, pdfAttachment, idempotencyKey: `cashbrite-plan/${purchaseId}/${token}`,
    });
    if (!result || result.kind === "ambiguous") {
      await storage.finishDelivery(purchaseId, token, "needs_review", "provider_outcome_unknown");
      return "needs_review";
    }
    if (result.kind === "rejected") {
      await storage.finishDelivery(purchaseId, token, "failed", "provider_rejected");
      return "deferred";
    }
    await storage.finishDelivery(purchaseId, token, "sent", null, result.id);
    await sendInternalPurchaseNotification(purchaseId, `cashbrite-plan/${purchaseId}/${token}`);
    return "sent";
  } catch (error) {
    const code = error instanceof PurchaseError ? error.code : providerStarted ? "provider_outcome_unknown" : "generation_or_configuration_failed";
    // If acceptance cannot be committed, the expired provider-started lease remains conservative.
    await storage.finishDelivery(purchaseId, token, providerStarted ? "needs_review" : "failed", code);
    purchaseLog(code, purchaseId);
    return providerStarted ? "needs_review" : "deferred";
  }
}
