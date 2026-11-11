import "server-only";
import * as storage from "@/lib/premiumPurchaseDb";
import { fulfilPurchase } from "@/lib/purchaseDelivery";
import { verifyPaidPurchase } from "@/lib/verifiedPurchase";
import { PurchaseError } from "@/lib/purchaseSafety";

export async function runRecovery(args: string[], actor: string) {
  const allowed = new Set(["--purchase-id", "--execute", "--outcome", "--provider-id", "--evidence", "--reason"]);
  const command = args[0];
  if (!["inspect", "retry", "reconcile"].includes(command)) throw new PurchaseError("invalid_command");
  const options = new Map<string, string>();
  for (let i = 1; i < args.length; i++) {
    const name = args[i];
    if (!allowed.has(name) || options.has(name)) throw new PurchaseError("invalid_option");
    if (name === "--execute") options.set(name, "true");
    else {
      const value = args[++i];
      if (!value || value.startsWith("--")) throw new PurchaseError("invalid_option");
      options.set(name, value);
    }
  }
  const id = options.get("--purchase-id") ?? "";
  if (!/^[1-9][0-9]{0,18}$/.test(id)) throw new PurchaseError("invalid_purchase_id");
  const purchase = await storage.getPurchase(id);
  if (!purchase) throw new PurchaseError("purchase_unavailable");
  const summary = { purchaseId: String(purchase.id), payment: purchase.payment_status, delivery: purchase.delivery_status,
    attempts: purchase.delivery_attempts, errorCode: purchase.delivery_error_code, nextAttempt: purchase.delivery_next_attempt_at,
    leaseUntil: purchase.delivery_lease_until, providerStarted: Boolean(purchase.delivery_provider_started_at),
    execute: options.has("--execute") };
  if (command === "inspect") return summary;
  const verified = await verifyPaidPurchase(purchase.stripe_checkout_session_id);
  if (purchase.payment_status !== "paid" || verified.assessment.id !== purchase.assessment_id) throw new PurchaseError("payment_not_verified");
  if (command === "retry") {
    if (!["pending", "failed", "sending"].includes(purchase.delivery_status)) throw new PurchaseError("delivery_not_retryable");
    if (!options.has("--execute")) return { ...summary, action: "dry_run_retry_no_mutation" };
    return { purchaseId: id, outcome: await fulfilPurchase(id) };
  }
  const outcome = options.get("--outcome");
  const providerId = options.get("--provider-id") ?? null;
  const evidence = options.get("--evidence") ?? "";
  const reason = options.get("--reason");
  if (purchase.delivery_status !== "needs_review" || !/^[A-Za-z0-9_.-]{3,100}$/.test(evidence) ||
      !["accepted", "not_sent"].includes(outcome ?? "") ||
      reason !== (outcome === "accepted" ? "provider_accepted" : "provider_confirmed_not_sent") ||
      (outcome === "accepted" && !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(providerId ?? "")) ||
      (outcome === "not_sent" && providerId !== null)) throw new PurchaseError("reconciliation_evidence_required");
  if (!options.has("--execute")) return { ...summary, action: "dry_run_reconciliation_no_mutation" };
  await storage.reconcileDelivery(id, outcome as "accepted" | "not_sent", providerId, {
    actor, evidence, reason, previousAttempts: String(purchase.delivery_attempts),
  }, purchase);
  return { purchaseId: id, outcome: "reconciled_no_email_sent" };
}
