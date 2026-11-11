# Cashbrite Phase 3C.2 — Minimum Launch Safety

**11 November 2026 — practical handover; production payments NOT approved.**

This document supersedes the monitoring activation requirements in `cashbrite-phase-3c2-monitoring-staging-readiness.md` for the initial low-volume launch. Scheduled workflows, Issues automation, monitoring credentials/services, heartbeat infrastructure and subscriptions are explicitly **deferred**, not launch blockers. Manual oversight replaces them; it is not unattended monitoring.

**Phase 3C.2 preparation may close and Phase 3C.3 may proceed locally.** First real payment remains blocked until the mandatory staging checklist below passes and production activation is separately approved.

## 1. Minimum Safety Review

Reviewed the current webhook, checkout, purchase storage, verification, delivery, paid report/PDF routes, recovery CLI, health checker and permanent regression suite. Evidence below is the previously passing synthetic/PGlite suite documented in the remediation report, with its assertions checked against current code. **No tests or migrations were executed in this document-only review.** No newly discovered critical issue requires an application change.

| Safeguard | Implementation and local evidence | Remaining verification / limitation |
|---|---|---|
| Stripe signature verification | **Implemented and locally tested:** raw-body signature verification; invalid-signature regression returns 400. | **Requires staging verification:** actual test endpoint secret and signed Stripe event. |
| Duplicate fulfilment protection | **Implemented and locally tested:** unique session purchase, payment-first processing, atomic claim/lease, provider idempotency, conservative ambiguity and fenced reconciliation; duplicate/concurrent webhook and H1 regressions. | **Requires staging verification:** hosted database concurrency, retries and stale-operator scenario. Not an unlimited exactly-once guarantee across all outages. |
| Paid access when email fails | **Implemented and locally tested:** live Stripe verification authorises repeated report/PDF requests independently of email status; access regression covers a review-state purchase. | **Requires staging verification:** real test-mode session and actual generated PDF. Local reliability tests mock PDF bytes. Stripe/database availability and retaining the private link remain dependencies. |
| Safe manual delivery recovery | **Implemented and locally tested:** trusted-environment CLI, dry-run default, verified paid-only shared retry, bounded attempts, evidence-bound reconciliation; legacy/ambiguous/sent safeguards. | **Requires staging verification:** operator access and end-to-end provider evidence. Lost-link reissue is **manual, not an implemented recovery endpoint**; rehearse procedure below. |
| Delivery-failure visibility | **Implemented and locally tested:** persisted delivery states/error codes, sanitised logs and read-only health checker. | **Missing by design:** automatic alerts. Manual reviews are required. Checker cannot detect absent purchase rows or post-acceptance bounces; compare Stripe and inspect Resend separately. |
| Normal navigation repeat-purchase safety | **Implemented and locally tested:** open-session reuse, deterministic checkout idempotency, paid/in-flight completion guard, save-before-redirect; concurrent checkout and paid 409 regressions. Report refresh does not initiate checkout. | **Requires staging verification:** back/refresh/retry/return before webhook arrival. Not identity-wide deduplication across different assessments or unrelated sessions; never advise a paid customer to buy again. |

The prior remediation records passing reliability, messaging, quiz, ESLint, TypeScript and production build checks. These are **local evidence**, not hosted payment/email certification. Preserve the 30-question assessment, £19 one-off price, free Snapshot, premium content, PDF and existing design.

## 2. Initial Manual Operating Procedure

**Owner:** Chandni; nominate a backup before accepting payments. Check each first purchase promptly, check at least morning and evening UK time on launch days, and check whenever a customer reports a problem. Record who checked and the last reconciled time in a private existing operations note. If coverage is unavailable, postpone payment activation; do not promise 24/7 support. Unresolved paid access failures receive priority that working day.

1. **Identify successful payments:** in the authorised Stripe dashboard, choose the correct environment and review completed/paid £19 GBP Cashbrite Checkout transactions since the last check, with an overlapping period to catch delayed events. Distinguish paid from pending, abandoned, failed or refunded transactions; a screenshot alone is not proof. Inspect related webhook delivery failures.
2. **Compare with Neon:** using existing authorised database access, match each transaction's Checkout session/payment intent and assessment reference to `premium_purchases`; verify one matching row, correct assessment, amount `1900`, currency `gbp` and `payment_status='paid'`. Do this inside protected consoles, not public exports. Keep only internal purchase IDs, checked times, fixed issue codes and outcomes in the operations note.
3. **Missing/unpaid row after confirmed payment:** inspect the signed event's delivery result and reference/configuration problem. Do not manually invent a purchase, relink an assessment, create another Checkout or ask the customer to repay. Once the underlying problem is fixed, an authorised operator may replay the existing signed event through Stripe's existing mechanism; confirm payment persistence and single fulfilment. Escalate unresolved data/reference problems to the owner for supervised repair/support or refund consideration, not blind retries.
4. **Inspect delivery:** use the existing read-only checker manually and inspect flagged purchase IDs. A checker error is not a healthy result. Exit 2 means exceptions; exit 1 means check failed. It lists at most 200 exceptions; truncation requires direct protected review. It cannot discover Stripe payments without rows.

```sh
# Future authorised use only, on a trusted host with the correct existing environment injected.
# No automatic env-file loading; never paste credentials into commands/output.
CASHBRITE_OPERATOR_ENV=staging node scripts/delivery-health.mjs
CASHBRITE_OPERATOR_ENV=staging node scripts/premium-recovery.mjs inspect --purchase-id PURCHASE_ID
CASHBRITE_OPERATOR_ENV=staging node scripts/premium-recovery.mjs retry --purchase-id PURCHASE_ID
# Only after inspection, payment verification and eligibility confirmation:
CASHBRITE_OPERATOR_ENV=staging node scripts/premium-recovery.mjs retry --purchase-id PURCHASE_ID --execute
```

For launch, the authorised host must explicitly target the approved production environment; the environment label itself is **not authentication**. Protected host access and existing credentials are the authorisation boundary. Do not create monitoring credentials. Retry dry-run is not a full eligibility guarantee: inspect actual execution outcome (`sent`, `deferred`, `needs_review`) and recheck state.

5. **Apply state rules:** `pending`/`failed` may retry only through the shared eligible process after configuration/PDF errors are resolved and backoff permits. A live `sending` lease must not be interrupted. An expired provider-started attempt, `needs_review`, exhausted attempts or legacy unknown outcome needs provider evidence before any resend. Never reset counters/state by hand. `sent` is never a resend instruction.
6. **Check Resend:** using existing authorised dashboard access, inspect customer-message acceptance, delivery, rejection, bounce or suppression. `sent` in Neon means provider acceptance, **not inbox receipt**. Distinguish customer delivery from optional internal notification. Investigate sender/configuration or recipient issues; no bulk resend or unverified address change.
7. **Reconcile ambiguity only with evidence:** the existing `reconcile` CLI accepts `accepted` with `provider_accepted`, provider message UUID and an evidence reference, or `not_sent` with `provider_confirmed_not_sent` and evidence. Dry-run first, then deliberate `--execute`. Reinspect after a stale-evidence rejection. Reconciliation itself sends no email; accepted becomes sent, confirmed-not-sent becomes eligible for controlled retry. No evidence means no resend. Keep provider IDs/evidence in protected operations storage and protected command history, never shared logs.
8. **Customer says “paid, no report”:** reassure them not to pay again. Verify the real transaction and its assessment linkage in protected records, inspect delivery/Resend and offer use of their original private success/confirmation link. Suggest checking spam without treating this as proof of delivery. Paid web/PDF access remains usable even if email is pending or under review.
9. **Lost access link:** there is no automatic reissue tool. The authorised owner must verify ownership against original payer/registration records and payment evidence; an email address, assessment UUID or screenshot alone is insufficient. Never request full card details, CVC or passwords. After ownership verification, retrieve the existing session reference in the protected Stripe console, check it links to the correct paid assessment, and privately return the existing Cashbrite success link only to the verified original recipient through the existing support channel. Do not expose it through the CLI, notes, analytics or shared screenshots. Rehearse this on a synthetic paid record before launch; if ownership cannot be verified, escalate rather than disclose. Do not reset `sent`, generate a new payment or use the customer-delivery retry tool merely to reissue a link.
10. **Close the case:** confirm access/download, purchase linkage and the actual delivery outcome; record a minimal resolution. Do not close a case just because a log disappeared. If repeated failures cannot be resolved promptly, pause new payment entry and escalate; preserve paid access and do not disable the registered webhook as a shortcut.

## 3. Mandatory Before the First Real Payment

**All unchecked: not executed here.** Use synthetic records, isolated staging and Stripe test mode. Provider test email delivery requires separate permission; this task sends none. For each item record candidate revision, tester/date, internal synthetic ID and pass/fail evidence without private links or customer data.

- [ ] **£19 test Checkout:** correct one-off GBP price and assessment linkage, successful return and cancellation; no unintended second session/charge from double-click, back or refresh.
- [ ] **Signed webhook/persistence:** real test event records paid before fulfilment; invalid signature rejected; missing reference/configuration fails safely; owner can find a failed event and match it to purchase records.
- [ ] **Duplicate/concurrent delivery:** replay completed event and concurrent requests, verify one customer fulfilment; late failed events cannot downgrade paid. Reproduce H1's stale reconciliation safely in staging.
- [ ] **Report/PDF:** real generated PDF opens, is complete/readable, matches the user's synthetic priorities, retains existing naming and downloads repeatedly; companion spreadsheet link remains usable.
- [ ] **Email failure/recovery:** permitted Resend test delivery plus simulated rejection/PDF failure, eligible recovery and bounded attempts. Ambiguous outcomes require evidence; no repeat customer send. H3 internal-notification failure/hang cannot delay durable customer acceptance.
- [ ] **Access without email:** original paid link still opens report and PDF with failed/review delivery. Invalid/unpaid links fail; returned content belongs to the referenced paid assessment. Rehearse verified manual lost-link support.
- [ ] **Returning customer:** success refresh, return to free results and recovery checkout before/after webhook do not create another payment. Existing paid purchase is blocked from buying again, with a useful support route.
- [ ] **Basic migration/release safety:** separately authorised staging migration on disposable schema; verify fields/defaults/constraints, legacy paid review-only classification and nonpaid pending defaults. Verify abort/rollback on failure and retained audit state after application rollback. Prevent old untracked fulfilment code and new claim-aware code running concurrently; drain/protect old aliases before cutover. No migration is authorised by this checklist alone.
- [ ] **Paid-link privacy:** no-store/no-referrer at hosted edge; no private capability/assessment/email in outgoing analytics or third-party referrers across direct load, SPA return and back/forward. No indexable paid report, public log/screenshot leak or production demo bypass.
- [ ] **Manual readiness/sign-off:** owner/backup can compare a synthetic paid transaction with a missing/failed purchase, inspect Resend bounce status, use recovery dry-run and safely handle lost access. Latest candidate reliability/messaging/quiz/lint/types/build checks pass. Record results and obtain separate production payment activation approval.

## 4. Deferred, Not Required for Initial Low-Volume Launch

15-minute scheduling, Issues automation, monitoring-only database logins, external alert/heartbeat services and subscriptions; automatic daily digests; automated missing-purchase/bounce reconciliation; dashboards, customer accounts and self-service recovery. Manual comparison covers known discovery gaps for now, with an explicitly accepted delay until the next operator check.

Revisit when manual checks cannot cover every transaction, unresolved incidents recur, sales continue outside staffed coverage, or transaction volume makes reconciliation unreliable. Do not treat deferred automation as implemented, or defer payment correctness, safe access and private-link protection with it.

## Handover

**Only this document created.** No application code changed; no credentials, jobs, emails, payments, migrations, commits or deployment. No new critical defect identified in this bounded review; staging outcomes remain unverified. Phase 3C.3 may proceed **locally** while staging is pending. Stop here; production activation remains blocked.
