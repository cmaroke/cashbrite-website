# Cashbrite Phase 3C.2: Purchase and Delivery Reliability

Status: **audit and offline regression fixtures completed; implementation stopped at the required approval gate**.
Date: 3 November 2026.

## Decision / Approval Required

The existing purchase schema has no durable delivery state, attempt record or worker lease. Fixing email retries by simply removing the `newlyPaid` guard would allow duplicate emails on webhook replay; keeping it permanently suppresses failed deliveries. An in-memory flag does not work across Vercel instances/restarts.

**Recommend a small additive migration to the existing purchase table before changing fulfilment.** This is a migration and requires approval under this task's explicit constraint. No migration, production code change, new credential, account system or new infrastructure has been implemented. The only new files are the audit regression script and this report.

The request refers to 50 questions. The canonical assessment currently contains **30 questions across 10 categories**; all were preserved, along with scoring, the free Snapshot, £19 pricing, approved content, visual design and deferred PDF names/design.

## 1. Actual Current Flow

1. Results/recovery CTA posts `{ assessmentId }` to `/api/stripe/checkout`.
2. Server validates UUID, loads assessment, then creates a Stripe payment-mode Checkout session using `STRIPE_PRICE_ID`. Server supplies assessment/email/product metadata and customer email. The success URL contains the session ID; cancellation returns to free results.
3. Checkout purchase tracking and interest tracking run using `Promise.allSettled`. The browser receives the Checkout URL even when purchase tracking fails.
4. Webhook verifies the raw request body with the Stripe signature secret.
5. For `checkout.session.completed`, handler checks paid status and product metadata, looks up assessment, **generates PDF first**, then upserts a paid purchase.
6. Unique `stripe_checkout_session_id` plus a conditional paid transition means only the first transition returns `newlyPaid = true`. Only that transition attempts the purchase email.
7. Purchase email uses Resend, attaches generated PDF and includes the web access link. Missing Resend key silently returns. Provider error objects are not checked; rejected promises are swallowed by `Promise.allSettled`.
8. Success page and PDF download independently retrieve Stripe session and check complete/paid/product metadata before fetching assessment. They do not require email delivery or a paid database-row lookup. The web report regenerates the premium plan; PDF download regenerates PDF on demand.
9. Success page invokes the existing report-preview page server-side using a configured preview secret (falling back to the Stripe secret). That secret is not placed in the customer success URL by this path. The separate private preview URL does accept a key parameter.
10. There is no dedicated paid access recovery, delivery retry state, scheduled retry worker, or authenticated resend endpoint. The email checkout-recovery route creates checkout, not recovery of an already-paid entitlement.

## 2. What Already Works

- Server-side Stripe SDK and secret handling; price configuration is not read from a client-supplied amount.
- Signature verification rejects invalid payloads before database/PDF/email work.
- Per-session purchase uniqueness and conditional paid transition prevent repeated paid transitions and ordinarily prevent duplicate confirmation emails.
- Database and PDF exceptions return webhook 500, which permits Stripe retry.
- Repeated paid web/PDF access does not create a new checkout or require an email to have arrived.
- Success/PDF access rejects absent, malformed, incomplete, unpaid and wrong-product sessions. Demo PDF bypass is disabled in production.
- PDF attachment uses the linked assessment's generator; the browser and download use the existing category-personalised product. Existing PDF naming/design are untouched.
- Expiration/failure updates exclude already-paid rows, so an ordinary later failure does not downgrade a paid purchase.

These are code/mock findings, not a certification of deployed Stripe, Neon or Resend configuration.

## 3. Failure Points and Security Findings

| Priority | Confirmed finding | Consequence |
|---|---|---|
| P0 | Paid state is recorded only after PDF generation. | A verified payment can remain unrecorded locally while PDF generation repeatedly fails. |
| P0 | Paid state and email delivery are conflated. Resend errors/throws/missing key do not cause a durable retry. | A customer can pay, receive no email, and never get an email through ordinary replay. |
| P0 | Paid transition occurs before constructing access URL. A missing/invalid site URL can fail afterward. | Replay sees paid state and skips the email permanently even after configuration is repaired. |
| P0 | Production GA4 builds `page_path` from pathname + query + hash. Paid success URL contains a usable session bearer value. | Code would include access-bearing query data in analytics. No real analytics traffic was inspected or sent in this audit. |
| P0 | Missing assessment or reference returns webhook 200 without a stored recovery failure. | Stripe is told the event was handled, while the purchase is not linked/fulfilled. |
| P1 | Repeated checkout requests do not check existing sessions/purchases or send a Stripe idempotency key. | Separate sessions can be created for the same assessment; separate payments are possible. This is distinct from duplicate webhook handling. |
| P1 | Checkout returns a redirect after its purchase tracking failed. Failure logs include raw checkout-session IDs and provider error messages. | Payment may lack local initial tracking; usable session identifiers can be exposed through operational logs. |
| P1 | Failure-to-pay handler selects latest unpaid row by assessment, not an exact intent/session match, and does not verify product metadata. | Out-of-order or unrelated signed payment failures can label the wrong attempt as failed. |
| P1 | Webhook catch returns only generic 500, without structured failure logging. | Support cannot reliably distinguish PDF, database, configuration and email failures. |
| P1 | Access checks paid/product metadata but not expected price, currency or payment mode. | A configuration error can grant access to an unintended amount/mode; **not** evidence customers can forge signed metadata. |
| P1 | No protected access-link recovery for a customer who loses both success URL and email. | Current workaround is support contact; assessment UUID must not be treated as proof of purchase ownership. |
| P1 | No explicit `Referrer-Policy: no-referrer` on sensitive pages, no global sensitive-route analytics exclusion, and no common private-response policy. | Bearer link exposure must be reviewed across analytics, referrers and caches. `noindex` alone is not access control. |
| P2 | Duplicate completed events generate PDF before testing `newlyPaid`. | Duplicate expensive generation, even when no email will be sent. |
| P2 | Only synchronous completed events fulfil paid purchases; async-success/async-failure events are not handled. | Delayed payment methods would need explicit support or exclusion. Enabled methods were not inspected in a live dashboard. |

Additional boundaries:

- Results/recovery assessment UUIDs and paid session IDs are capability links, not customer identity checks. Session IDs should be treated as credentials, not harmless diagnostic IDs.
- A caller with no valid paid session is rejected; possession of a leaked paid session currently grants access. That is a real limitation of the existing bearer-link model.
- Static budget spreadsheet is in `public/downloads/`, so hiding its button does not payment-protect the file.
- Operator preview permits a query-string secret and Stripe-key fallback. Do not use a payment API secret as a preview password. Refactor to a non-routable shared report renderer before expanding access mechanisms.
- The purchase foreign key uses `ON DELETE CASCADE`; assessment deletion could remove purchase evidence. Retention/deletion policy is a separate decision, not changed here.

## 4. Proposed Proportionate Implementation (Not Applied)

### A. Payment Is Independent of Delivery

- Verify signature, recognised product, complete/paid session, correct mode and configured £19/GBP price linkage. Use trusted Stripe values; do not accept amount/email/access eligibility from a browser.
- Validate assessment reference; reconcile an expected missing reference/record instead of silently acknowledging it as fulfilled. Unknown unrelated products can still be safely ignored.
- Record verified payment **before** PDF generation or email. Upsert by existing unique checkout-session ID. Preserve the distinction between separate payments and duplicate events.
- A database failure returns retryable failure. A paid record remains paid when PDF/email fails.
- Match failed/expired events to exact session/intent and known product; never mark a different latest attempt by assessment alone.
- Support async payment events if delayed methods remain enabled; do not unlock merely because Checkout has completed while payment is pending.

### B. Minimal Durable Delivery State

Proposed additive columns on `premium_purchases` (names/types to finalise on approval):

| Proposed field | Purpose |
|---|---|
| `delivery_status` | `pending`, `sending`, `sent`, `failed`, or `needs_review`, separate from payment |
| `delivery_attempts` | Bounded attempt count |
| `delivery_lease_until` | Atomic in-flight claim with expiry for crashed workers |
| `delivery_next_attempt_at` | Safe retry/backoff eligibility |
| `delivery_sent_at` | Confirmed Resend acceptance timestamp, not proof of inbox delivery |
| `delivery_provider_id` | Provider reconciliation reference, never exposed publicly |
| `delivery_error_code` | Sanitised classified failure, not raw exceptions/payloads |

No full event ledger, queue service, object storage, login system or new platform is proposed initially. Existing session uniqueness remains the payment dedupe key. A single atomic `UPDATE ... WHERE eligible ... RETURNING` claims delivery; concurrent duplicate events do not both own the claim.

Important migration safety:

- Existing paid rows have unknown email outcome. **Do not backfill every paid row as pending**: replay could resend historical confirmations. Mark legacy outcome as `needs_review` (or an explicit legacy state), then reconcile through an authorised process.
- Existing checkout-created rows must not be fulfilled as paid without verification.
- Keep all current IDs, data, relationships and payment statuses. No deletion or destructive rewrite.
- Review existing runtime `CREATE TABLE IF NOT EXISTS` behaviour; use an explicit reviewed migration, not a hidden schema alteration during customer requests.

### C. Retry Without Duplicate Delivery

- Paid webhook records payment, claims pending delivery, generates existing PDF and checks Resend's returned `error` as well as thrown exceptions.
- Reuse a stable provider idempotency key per purchase/customer-message type across retries. Internal notification uses a separate key and cannot determine customer delivery success.
- Persist provider acceptance and message ID, then mark delivery sent. Duplicate events with a sent state skip fulfilment before generating PDF.
- On transient PDF/email failure, preserve paid state, record a safe error/next attempt and release/expire the claim. Retry using Stripe replay while the handler returns retryable failure, and an operator-authenticated replay for recovery outside Stripe's retry window.
- Provider idempotency has a finite retention window; its supported window must be verified before implementation. Ambiguous timeouts/provider acceptance followed by database failure require reconciliation. After that window, use `needs_review`, not an unsafe automatic resend. Do not claim unlimited exactly-once external email delivery.
- No public endpoint may resend a report or reveal an access link using an assessment ID/email alone. Operator recovery must require server-side authentication, not a shared secret in a URL.

### D. Checkout and Access Hardening

- Consult existing pending/paid purchase attempts before starting a fresh checkout. Use deterministic Stripe idempotency per purchase attempt, reuse a valid open session, and reconcile completed Stripe state if the webhook has not yet persisted it. Define safe expiry/retry behaviour rather than a forever-fixed idempotency key.
- Do not return paid access based only on a free-results UUID. Already-paid customers should recover through verified ownership, not be silently invited to buy again.
- Fail visibly if required purchase persistence fails; do not blindly send the customer into an untracked session. Any cleanup/reuse must itself be idempotent.
- Extract a server-only report component so verified paid access does not call a route designed around a preview secret. Preserve report content/design.
- Immediately exclude sensitive access/recovery URLs from third-party analytics and strip bearer values from logging/referrers; add private/no-store and no-referrer protections. Preserve non-sensitive analytics meanings.
- Keep private web/PDF access independent of delivery success. Give customers PDF/spreadsheet downloads immediately after verified payment and a clear route back.
- **Additional access decision requiring approval:** retain the hardened Stripe-session capability model for this release, or introduce expiring opaque recovery tokens exchanged for an HttpOnly cookie. The latter needs reviewed token persistence, expiry, abuse/rate-limit controls and generic responses. It is not silently included in this task.
- Do not add accounts, subscriptions or a new public email-based recovery endpoint without approval.

### E. Safe Observability / Messaging

- Log allowlisted stage/error codes and a non-secret correlation reference or one-way identifier hash. Never log complete session URLs, Stripe keys, customer email, PDF content or raw provider exceptions.
- Track outcomes such as `payment_recorded`, `delivery_claimed`, `pdf_failed`, `email_failed`, `provider_accepted`, `delivery_needs_review` without personal data.
- Distinguish provider acceptance from successful inbox delivery. A provider-accepted message is not proof the customer received/read it.
- Success UI should say payment is confirmed and downloads are available; email status should reflect persisted state and offer safe recovery/help. Avoid telling a customer to pay again for a fulfilment fault.

## 5. Offline Tests of the Actual Current Implementation

New script: `node scripts/check-purchase-reliability.mjs`.

The script transpiles/imports the real existing route/template code. Stripe signature verification uses the installed official SDK with a synthetic secret and locally signed fixture payload. Stripe session calls, database functions, PDF generation and Resend are replaced before routes load. No environment file, production key, customer database or network request is used. A mock buffer stands in for PDF attachment; **no PDF is generated**.

| Scenario | Observed current result |
|---|---|
| Signed successful purchase | One mocked paid record; correct synthetic recipient/PDF attachment attempted |
| Duplicate webhook | One email attempt; two PDF generations |
| Concurrent duplicates | One paid transition/email with atomic mocked DB claim; real database race behaviour not exercised |
| Resend returns error | Webhook 200, row paid; replay does not retry email; paid PDF access still works |
| Resend throws | Same permanently skipped email on replay |
| Missing Resend key, later restored | No email; replay still skips it |
| PDF generation fails then recovers | First 500/no paid record; retry succeeds and records payment |
| Database failure then retry | 500 then successful paid record on replay |
| Missing reference or missing assessment | Acknowledged without recording or recoverable failure |
| Invalid webhook signature | 400 before assessment/PDF/email work |
| Missing/invalid session, unpaid/open/wrong-product PDF | Rejected; no assessment lookup for these denied cases |
| `demo=true` PDF in production | Rejected without a confirmed paid session |
| Repeated paid web/PDF access | Available without new checkout/email; confirms existing link-based access independence |
| Unknown session web access | Helpful locked state, no assessment email exposed |
| Site URL failure after paid transition | Initial 500, but repaired replay skips email |
| Unintended amount/currency/mode with paid product metadata | Accepted: reproduces missing independent product-price validation, not a signature bypass |
| Repeated checkout | Two create calls, no SDK idempotency key supplied |
| Checkout tracking failure | Redirect still returned; raw session value present in mocked log capture |

**These passing assertions reproduce defects; they do not mean the service now meets the reliability requirements.** No proposed delivery-state or recovery implementation has been tested because it has not been approved or built.

Other checks:

- ESLint: passed.
- TypeScript: passed.
- Production build: passed.
- Existing scoring sanity check: passed, unchanged 30-question/90-raw-point model.
- Existing product messaging tests: passed with mocked email and synthetic page rendering.

After approval, replace defect expectations with desired invariants and add real temporary-database transaction tests in an explicitly approved test environment. Include post-send crash, expired lease, reordered failures, old paid-row migration, async-payment cases and authorised recovery. Do not validate these against customer records.

## 6. Exact Files Changed Now

Created only:

1. `scripts/check-purchase-reliability.mjs` - offline current-behaviour audit tests.
2. `docs/cashbrite-phase-3c2-reliability-review.md` - this review and approval proposal.

No production files, package files, schema files or configuration were changed. Existing unrelated uncommitted work remains intact.

## 7. Future File Map (Not Modified)

| File / area | Planned responsibility after approval |
|---|---|
| Reviewed migration + `db/schema.sql` | Add approved delivery fields with safe legacy-state backfill |
| `lib/premiumPurchaseDb.ts` | Payment upsert, exact intent/session updates, atomic delivery claim/status and attempt lookup |
| `app/api/stripe/webhook/route.ts` | Payment-first flow, retryable classified failures and idempotent fulfilment |
| `lib/assessmentEmail.ts` | Check Resend responses, return provider result, use approved idempotency keys |
| `app/api/stripe/checkout/route.ts` | Existing-attempt handling, price checks and safe persistence/redirect |
| `lib/stripe.ts` / new server-only purchase service | Central verified entitlement/price/configuration checks |
| `app/money-ready-plan/success/page.tsx` | Recovery-aware verified downloads and accurate delivery messaging |
| `app/api/money-ready-plan/pdf/route.ts` | Shared access validation and sanitised errors; existing PDF untouched |
| `app/premium-plan-preview/page.tsx` / shared report renderer | Remove operational secret-query dependency for customer rendering |
| `components/GoogleAnalytics.tsx`, layout/header policy | Exclude capability URLs and stop sensitive query/hash transmission |
| Authenticated operations recovery entry point | Replay an existing purchase, never create a new charge or trust a public UUID |

## 8. Configuration and Next Steps

- No migration was written or executed. No new production credentials are currently required or requested.
- Existing Stripe/Resend/Neon configuration was inspected by **code only**, not by reading credentials or contacting services. Actual production webhook subscriptions, sender verification and enabled payment methods still need authorised configuration review later.
- No queue/cron service is proposed for the initial fix. Stripe retries plus authenticated operator recovery can cover the initial design; scheduled retries are a separately approved option, not a hidden requirement.
- Approval requested for the additive delivery-state migration, safe legacy backfill, authenticated operator recovery design, and sensitive-route analytics hardening.
- Choose whether self-service token/cookie recovery is in scope now or whether secure manual recovery is the initial release boundary. Do not build an unauthenticated resend shortcut.

**Stop point:** awaiting these approvals before production implementation. Nothing committed, pushed or deployed. No real payments, emails, customer records or customer PDFs accessed/created. Do not proceed to Phase 3C.3.
