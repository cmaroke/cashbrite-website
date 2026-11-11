# Phase 3C.2: Local Reliability Implementation

Status: implemented locally and tested with synthetic data. **Not approved for production migration/deployment.**
Date: 3 November 2026.

## What Changed

- Verified payment is persisted before PDF generation or email. Delivery failures never clear/downgrade `paid`.
- Payment verification retrieves the trusted Stripe session/line items and checks complete/paid, payment mode, £19 GBP total, one item/quantity one, configured one-off price ID, product tag, assessment UUID and client reference.
- A single shared delivery service serves webhook and trusted operator CLI. Delivery has a durable status, bounded attempts, atomic claim, five-minute lease and UUID fencing token.
- New paid purchases start pending. Existing paid rows migrate to `needs_review`; they are never automatically queued for resending.
- Up to five attempts per recovery cycle, with 60s / 300s / 1800s / 7200s backoff for definite pre-send/rejected failures. Duplicate events do not spend another attempt while a claim is held or backoff is pending.
- An expired pre-send lease can be reclaimed. An expired provider-started lease, thrown send exception, uncertain provider response or acceptance that cannot be committed becomes `needs_review`. No automatic resend of an uncertain delivery.
- Resend returned errors are inspected, not just thrown exceptions. Known explicit rejections can retry; unknown outcomes require reconciliation. Provider acceptance is recorded separately from inbox delivery.
- Resend idempotency keys use purchase ID plus persisted claim UUID. Concurrent workers cannot both claim a send. Each new *definitely unsent* attempt has a new key; an ambiguous attempt is not replayed with a newly generated PDF.
- Reconciliation requires explicit execution, evidence reference and allowlisted reason. Accepted reconciliation also requires a provider message UUID; confirmed-not-sent reconciliation begins a new bounded cycle only after operator evidence. Previous attempt count/reason/evidence/OS actor are appended to the database audit.
- Checkout reuses an eligible open session, uses deterministic per-attempt Stripe idempotency, checks price configuration and refuses to redirect until purchase tracking is saved. Already-paid or payment-completed assessments are not silently offered a second charge or given a paid access URL based on their free UUID.
- Distinct successful Stripe sessions remain distinct purchases; duplicate webhook handling does not merge separate payments by assessment.
- Signed asynchronous success/failure and expired events are handled. Payment-intent failures match the exact stored intent, never an arbitrary latest assessment row. Paid rows cannot be downgraded by a late failure.
- Missing assessment/reference is a retryable failure rather than false fulfilment. Unknown explicitly different products can be ignored safely.
- Customer web/PDF access is independent of email state and does not call a preview-secret route. The report moved mechanically into a shared `server-only` renderer, preserving layout/content. Public preview accepts synthetic demo only; private `id/key` preview access was removed.
- Customer copy distinguishes confirmed payment, provider-accepted email, pending delivery and support review. It explicitly says not to pay again for a delivery problem.

## Scope Preserved

The canonical 30 questions, 10 categories, scoring/bands, free Snapshot, £19 one-off product, category-based personalisation, approved learning content, report design, PDF generator/design/naming, calculators and contact forms were not changed in this phase. Existing local rebrand edits remain intact.

No live database/service was contacted, no customer record accessed, no real email/payment made and no production migration run. No commit, push or deployment.

## Migration for Review

File: `db/migrations/003_premium_delivery.sql`.

Adds the seven approved delivery fields plus:

- `delivery_claim_token UUID`: prevents stale workers from completing another worker's claim.
- `delivery_provider_started_at TIMESTAMPTZ`: distinguishes safe pre-send crash recovery from uncertain provider invocation.
- `delivery_audit JSONB`: reconciliation evidence/reason/actor and prior attempt count.

The transaction locks writes while adding fields/backfilling. Existing IDs, session IDs, relationships, payment statuses and original timestamps remain intact. Only new delivery columns are populated. All historical `paid` rows remain `needs_review`, non-paid rows become `pending`, and new rows default to `pending`. Constraints and a retry index are added.

This migration is intentionally **apply-once**, not silently repeatable. A rerun fails and rolls back instead of reclassifying deliveries. Request handlers no longer run purchase-schema DDL.

`db/schema.sql` describes a fresh database. On an existing database use the migration; do not rely on `CREATE TABLE IF NOT EXISTS` to add columns. On a genuinely new database use the current schema and do not also apply this migration.

### Safe Deployment Sequence (Instructions Only)

1. Obtain separate production approval. Save an application release identifier and establish an authorised database restore point/backup. Review the SQL against the target schema; do not inspect/export customer data into a development workspace.
2. Prepare a maintenance cutover: prevent new Checkout requests and pause webhook delivery, and drain existing old-version functions. Do not allow old fulfilment code to send mail during migration/new-code cutover: it cannot record the new delivery state. A maintenance response to webhooks should be retryable, not a false 200 success.
3. On the authorised migration host, with protected database credentials (never command-line literals or shell tracing), run:

   ```sh
   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f db/migrations/003_premium_delivery.sql
   ```

   This command was **not** run against Neon/production. The local test used only an in-memory database.

4. Deploy the matching application with the existing `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID`, `NEXT_PUBLIC_SITE_URL`, `DATABASE_URL`, `RESEND_API_KEY` and verified `CONTACT_FROM_EMAIL`. No new web production secret is introduced. Keep the same approved £19 GBP one-off Stripe price ID; do not rotate it without an entitlement compatibility plan.
5. `NEXT_PUBLIC_SITE_URL` must be the canonical HTTPS origin without path, query, credentials or fragment. Production does not fall back to an untrusted request origin.
6. Verify webhook subscriptions: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `checkout.session.expired`, `payment_intent.payment_failed`. Verify test/live key and webhook-secret alignment separately.
7. **GA4 configuration requirement:** disable Enhanced Measurement's automatic browser-history page views and automatic form/outbound interactions where they might independently inspect sensitive URLs. This application sends sanitised manual page views; do not add another automatic tag via a tag manager. Check actual analytics network requests in an authorised staging environment before resuming production traffic.
8. Restore webhook delivery and replay appropriate pending events. Already-paid legacy records stay `needs_review`; do not bulk resend them. Test-mode staging verification and safe header/analytics checks must precede production release.
9. Resume public checkout and monitor classified failure codes, pending/backoff rows and `needs_review`. Keep the trusted operator workflow available; no background cron was added.

### Rollback

Prefer roll-forward repair. Keep the added columns and audit/delivery state even if code is rolled back. Do **not** drop columns or reset sent/review states to pending. The old app does not understand new delivery outcomes and may skip retries; do not resume old-version fulfilment alongside the new worker. Keep checkout/webhook delivery paused until the matching version is restored, then resume Stripe retries. Any destructive schema rollback requires a separate reviewed backup/restore plan and a check for new purchases; none is automated or executed here.

## Trusted Operator CLI

File: `scripts/premium-recovery.mjs`. Uses the same verifier, atomic SQL and delivery service as the webhook. It never imports or invokes Checkout creation.

Authorisation is access to the trusted execution environment and protected credentials. `CASHBRITE_OPERATOR_ENV` is an environment-selection guard, **not authentication**. A typed operator name is not accepted. Audit actor comes from OS user/hostname; protect the workstation/server, secret store and operating-system audit trail. This is not a multi-user admin identity system.

The CLI does not load `.env` files automatically. Provision credentials securely in the trusted operator process. Do not paste production credentials into this chat, scripts, command arguments, URLs or repository. Use the full workspace dependencies (including TypeScript) when running this source-based tool; it is not a browser/admin endpoint.

Examples below are documentation, not commands executed against production:

```sh
node scripts/premium-recovery.mjs --help

# Read-only inspection; selecting an environment does not grant access.
CASHBRITE_OPERATOR_ENV=staging node scripts/premium-recovery.mjs inspect --purchase-id 123

# Dry run is the default. Paid verification reads Stripe but does not create a payment.
CASHBRITE_OPERATOR_ENV=staging node scripts/premium-recovery.mjs retry --purchase-id 123

# Execute only after checking eligibility/configuration and the displayed state.
CASHBRITE_OPERATOR_ENV=staging node scripts/premium-recovery.mjs retry --purchase-id 123 --execute

# Provider acceptance must be confirmed from actual authorised provider evidence.
CASHBRITE_OPERATOR_ENV=staging node scripts/premium-recovery.mjs reconcile --purchase-id 123 \
  --outcome accepted --reason provider_accepted --evidence CASE-123 \
  --provider-id 11111111-1111-4111-8111-111111111111
# Add --execute only after reviewing the dry run and evidence.

# Use only if the provider has positively established that the attempt did not send.
CASHBRITE_OPERATOR_ENV=staging node scripts/premium-recovery.mjs reconcile --purchase-id 123 \
  --outcome not_sent --reason provider_confirmed_not_sent --evidence CASE-456
```

Reconciliation itself never sends email. After an explicit confirmed-not-sent reconciliation, a separate eligible retry is needed. Sent purchases cannot be retried or reconciled into an unsent state. Unknown or legacy outcomes cannot be automatically retried. Absence of an email in a dashboard is **not by itself proof of no acceptance**; do not reset an ambiguous live request. Keep the reason/evidence narrative in the protected support case referenced by the short evidence ID.

Inspection prints internal purchase ID, stored payment/delivery state, attempts, safe error code, timing and whether provider invocation started. It never prints email addresses, Stripe session/intent values, access links, provider keys, PDF contents or provider IDs. Reconciliation provider ID is stored, not echoed. Exceptions produce a generic failure code, not raw exception/SQL text.

## Privacy and Access Protection

- Application logs use allowlisted failure codes and one-way hashed correlations. Client checkout logging no longer dumps provider errors.
- Protected pages/APIs receive private/no-store, no-referrer and noindex headers. PDF downloads retain their original naming and receive the same privacy headers.
- Sensitive paths are excluded from Vercel analytics via `beforeSend`, and all allowed URLs lose query/hash. GA is not loaded on initial sensitive pages, is disabled on sensitive SPA routes, and explicit page views carry sanitised location/referrer values.
- This does not replace the GA admin configuration check above; third-party auto-measurement is controlled partly outside the codebase. No real analytics request was sent or inspected here.
- Customer access intentionally remains a private bearer-session-link model, with live Stripe verification on access. No customer token/cookie/accounts were introduced. Anyone possessing a valid paid link can use it; keep it private. Hosting/edge infrastructure may log request URLs outside app control: restrict log access/retention and configure URL redaction where available. The application cannot retrospectively remove old analytics/log copies.
- The existing spreadsheet is still a public static asset, not a payment-protected file. The personalised web report and PDF require payment verification.
- Customers who lose both the link and email use support/manual ownership verification; there is no unauthenticated email/assessment-ID recovery shortcut.

## Provider Idempotency / Ambiguity

Resend supports the SDK `idempotencyKey` option and retains keys for 24 hours ([official documentation](https://resend.com/changelog/idempotency-keys)). This implementation does not assume indefinite exactly-once delivery or replay an uncertain newly regenerated PDF under a changed payload. Ambiguous outcomes stop for operator evidence. Provider acceptance is not inbox delivery. A trusted operator can still make a wrong reconciliation decision; procedural evidence review is essential.

Internal purchase notifications remain best effort with a separate idempotency key. Their failure is logged safely and cannot make the shared service automatically resend an accepted customer message. No internal-notification retry queue was added.

## Tests and Environment

Passed:

- ESLint.
- TypeScript no-emit check.
- Production build. First attempt could not resolve Google Fonts inside the network sandbox; rerun with approved font-fetch network access passed without changing typography.
- Existing quiz scoring sanity check: unchanged 30-question/90-point raw maximum.
- Existing product messaging checks, updated for the required paid-email idempotency option.
- Corrected purchase suite using **actual migration and SQL against a disposable in-memory PGlite 0.5.15 database**, synthetic assessments, signed synthetic Stripe events, mocked Stripe session/price calls, mocked PDF buffer and mocked Resend.
- CLI help and recovery function dry-run/execute/reconciliation paths, without production credentials.

Coverage includes legacy migration state, payment-before-PDF, PDF failure/retry, definite provider rejection/backoff, returned uncertain error, thrown exception, missing email configuration, five-attempt exhaustion, duplicate/concurrent events, safe/ambiguous abandoned leases, acceptance followed by failed database commit, evidence-required reconciliation, sent-state protection, wrong mode/amount/currency/price/reference, missing assessment, invalid signature, exact intent failure matching, asynchronous success, repeated verified paid access, production demo PDF denial, checkout concurrency/session reuse/persistence failure, and URL sanitisation.

The tests execute real SQL claims/constraints but do not simulate multi-process Neon networking, provider latency, real deliverability, full Stripe UI or Vercel edge configuration. No live email/payment/database/PDF generation was used in this phase's tests. The approved actual PDF generator file was not modified.

Reproduce SQL tests without a hosted database:

```sh
npm install --prefix /tmp/cashbrite-pg-test --no-save --ignore-scripts --package-lock=false @electric-sql/pglite@0.5.15
node scripts/check-purchase-reliability.mjs
# Or set PGLITE_MODULE_PATH to an isolated installation's absolute module directory.
node scripts/check-product-messaging.mjs
node scripts/check-quiz-scoring.mjs
pnpm lint
pnpm exec tsc --noEmit --incremental false
pnpm build
```

PGlite is a temporary test dependency, not a new deployed database/service or production package. The sole added production dependency is `server-only@0.0.1`, with a narrowly scoped lockfile change. The package manager reported ignored optional native build scripts; no approval to run them was granted or needed for the successful checks/build.

## Exact Files Changed in This Implementation

Modified:

1. `app/api/stripe/checkout/route.ts`
2. `app/api/stripe/webhook/route.ts`
3. `app/api/money-ready-plan/pdf/route.ts`
4. `app/money-ready-plan/success/page.tsx`
5. `app/premium-plan-preview/page.tsx`
6. `app/layout.tsx`
7. `components/GoogleAnalytics.tsx`
8. `components/PremiumPlanCtas.tsx`
9. `lib/premiumPurchaseDb.ts`
10. `lib/assessmentEmail.ts` (paid delivery only)
11. `lib/stripe.ts`
12. `db/schema.sql`
13. `next.config.ts`
14. `package.json`
15. `pnpm-lock.yaml`
16. `scripts/check-purchase-reliability.mjs` (defect reproduction replaced with corrected-behaviour assertions)
17. `scripts/check-product-messaging.mjs` (paid email's idempotency argument)
18. `README.md` (remove obsolete secret-preview/automatic-schema guidance; link safe release/CLI instructions)

Created:

19. `db/migrations/003_premium_delivery.sql`
20. `lib/verifiedPurchase.ts`
21. `lib/purchaseDelivery.ts`
22. `lib/purchaseSafety.ts`
23. `lib/operatorRecovery.ts`
24. `lib/analyticsPrivacy.ts`
25. `components/PremiumReport.tsx`
26. `components/SiteAnalytics.tsx`
27. `scripts/server-runtime.mjs`
28. `scripts/premium-recovery.mjs`
29. `docs/cashbrite-phase-3c2-implementation.md`

Earlier audit/proposal reports remain historical records; this report supersedes their "not implemented" status. Other uncommitted project work was not reverted.

## Remaining Operational Risks / Stop Point

- Production migration and deployment are **not executed**; current production behaviour is not changed by these local files.
- Missing references/assessments cannot be safely invented. They remain retryable failures requiring authorised Stripe/source reconciliation; the CLI operates on an existing internal purchase ID only.
- Automatic retries rely on Stripe's retries plus backoff. There is no scheduler; operator review/retry is required after Stripe's retry horizon or for `needs_review`.
- Existing success links depend on Stripe availability and the configured approved price ID. Any later price rotation/refund/dispute entitlement policy needs an explicit compatibility decision; no silent revocation or refund workflow was added.
- Browser-level third-party analytics privacy and real service configuration still need authorised staging verification; local sanitiser/route tests are not a claim about third-party dashboard settings or historical data.
- No new security architecture approval is requested. The approved CLI/bearer-access model was preserved; only separate approval to apply the production migration and deploy is outstanding.

Stop here for review. Do not proceed to Phase 3C.3, apply a production migration, commit, push or deploy without approval.
