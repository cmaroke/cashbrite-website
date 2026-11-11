# Cashbrite Phase 3C.2: Release-Readiness Review

Date: **4 November 2026**. Scope: independent local review, synthetic tests and release planning only.

## Executive Decision

| Target | Recommendation | Meaning |
|---|---|---|
| Controlled staging verification | **GO, with strict isolation and supervision** | Suitable for the checklist below using synthetic assessments, an isolated database, Stripe sandbox/test mode and explicitly authorised test recipients. This is verification, not release-candidate sign-off. Do not exercise concurrent mutation/reconciliation as normal operation until H1 is fixed; reproduce it only as an expected-failure test. |
| Production migration and release | **NO-GO** | Resolve H1-H5 below, demonstrate the cutover/rollback rehearsal and complete the staging evidence before approval. Local passing tests are not sufficient. |

This recommendation does **not** authorise deploying staging or contacting provider APIs during this review. No production migration, deployment, commit, push, real email/payment, production credential inspection or customer-record access occurred. Phase 3C.3 has not begun.

The architecture is materially stronger than the original implementation: payment-first persistence, durable claims, conservative ambiguity handling and private paid access are sound foundations. Two additional code defects and three operational/privacy release gates remain. No remotely exploitable critical defect was demonstrated in this bounded review; that is not a security certification.

## 1. Evidence and Local Checks

Inspected the complete migration, fresh schema, purchase SQL, shared verification/delivery services, webhook, checkout, report/PDF access, paid email template, operator CLI/loader, analytics protections and release instructions. Read environment-variable **names and code usage only**, never actual environment files or secret values.

Reran:

- `node scripts/check-purchase-reliability.mjs`: passed; actual SQL/migration against disposable in-memory PGlite, with synthetic records and mocked Stripe/Resend/PDF.
- `node scripts/check-product-messaging.mjs`: passed.
- `node scripts/check-quiz-scoring.mjs`: passed; unchanged 30-question, 10-category assessment.
- ESLint and TypeScript no-emit checks: passed.
- Additional isolated edge tests: **reproduced H1 and H3** below. Passing the existing suite did not cover these cases.

The temporary edge-test harness is `/private/tmp/cashbrite-release-edge.mjs`. Its reproducible sequences are documented below; it is not a production/repository change. No new dependency was installed for this review. PGlite is PostgreSQL-compatible local testing, not evidence of Neon/Vercel multi-process behaviour or production lock duration.

Production build was not rerun for this document-only review. The prior implementation report records a passing production build; staging must rebuild the exact candidate revision. No fresh production-build claim is made here.

## 2. Critical / High-Severity Release Findings

| ID | Severity / status | Finding | Required resolution before production |
|---|---|---|---|
| H1 | **High, reproduced code defect** | Reconciliation is not fenced to the delivery attempt whose evidence was reviewed. `runRecovery` reads a snapshot before remote verification; `reconcileDelivery` subsequently matches only purchase ID, paid and `needs_review`. | Include expected attempt/claim identity in the atomic update, reject stale reconciliation, and bind audit/evidence/provider ID to that attempt. Add the reproduced race to the permanent suite. |
| H2 | **High, confirmed operational gap** | No independent overdue-delivery scan, discovery command or tested operator alert exists. Timestamp eligibility is not a scheduler. `needs_review` is normally acknowledged with 200. | Establish an independently tested exception monitor, named owner, notification/escalation channel and response SLA. Cover overdue paid pending/failed, expired sending, review and provider-accepted-but-bounced cases. Logs alone are insufficient. |
| H3 | **High, reproduced code defect** | Customer provider acceptance waits for the optional internal notification before returning to the delivery service. A slow internal request delays the durable `sent` commit and can turn an already accepted customer email into an uncertain lease/review case. | Commit the customer's accepted outcome independently before optional internal notification work; bound that work and test hangs/timeouts. No uncontrolled customer resend. |
| H4 | **High, unverified privacy release gate** | Sensitive-route filtering is good, but already-loaded Google tags, automatic measurement and client-side transitions need real browser verification. GA's ID is hardcoded, so staging does not automatically isolate its analytics destination. | Prove no capability values leave on direct load, SPA transition, back/forward, form/outbound/scroll and referrer paths. Disable conflicting automatic tags/measurement and use isolated measurement or intercepted outbound requests. |
| H5 | **High, unproven cutover control** | Old code does not participate in delivery claims. Operational instructions describe pausing/draining, but there is no demonstrated barrier covering old deployment aliases, in-flight requests and operator processes. | Rehearse a maintenance gate, old-version/alias isolation, drain and rollback. Keep Stripe destination registered; do not assume disabling it preserves event retries. |

Additional medium-priority concerns: migration lacks lock/statement timeouts; CLI dry run does not calculate full retry eligibility and returns success exit status for a deferred outcome; no workflow discovers purchases by exception; retry actions themselves lack a durable operator audit entry; provider/reference failures with no purchase row need a manual reconciliation path; assessment deletion still cascades to purchase records; rotating `STRIPE_PRICE_ID` can invalidate historical access. These require explicit operational acceptance or follow-up, not silent assumptions.

### H1: Reproduced Stale-Evidence Race

Source: `lib/operatorRecovery.ts:24-49`, `lib/premiumPurchaseDb.ts:82-90`.

1. Operator A reads a paid `needs_review` purchase, then waits on Stripe verification.
2. Operator B reconciles the old attempt as confirmed not sent.
3. A new attempt claims the purchase, invokes the provider and becomes `needs_review` for a different ambiguous outcome.
4. Operator A resumes with the **old** acceptance evidence and provider ID.
5. Current SQL accepts the update because the purchase is again `needs_review`; it marks the **new** attempt sent using stale evidence.

The local test used the actual operator function and SQL, a verification barrier, two synthetic actors and an in-memory database. It reproduced incorrect final `sent` state. Reversing the decision could instead authorise an inappropriate new retry. This is an integrity issue involving trusted operations, not an unauthenticated public exploit.

Recommended fix: compare the expected claim token/attempt identity in the SQL `WHERE` clause, including an explicit legacy/null-token case. Evidence/audit must identify the reviewed attempt. A fresh read or dry-run instruction alone does not close the race. Do not add a public recovery endpoint.

### H3: Reproduced Optional-Notification Dependency

Source: `lib/assessmentEmail.ts:303-326`, `lib/purchaseDelivery.ts:37-49`.

The real paid-email function was called with a mocked customer send that immediately returned an accepted message ID, and a second mocked internal send held unresolved. The function did not return acceptance until the internal promise was released. Consequently the shared service cannot persist customer `sent` while that optional call is pending. On process termination the row may remain sending and later require review; the accepted provider ID may never have been persisted.

This occurs only when internal notifications are configured. An unset `CONTACT_TO_EMAIL` hides it in the existing core reliability suite. Move customer acceptance persistence ahead of optional notification work; a larger queue system is not required to fix this ordering.

## 3. Complete Migration Review

Reviewed `db/migrations/003_premium_delivery.sql` against `db/schema.sql` and the purchase code.

### Data / Schema Findings

- No `DROP`, `DELETE`, `TRUNCATE`, relationship removal, original-column type change or original payment-status rewrite.
- Adds ten columns: seven approved delivery fields plus claim token, provider-start timestamp and reconciliation audit.
- Initial default `needs_review` preserves unknown historical paid outcomes. Only new delivery fields on non-paid rows are changed to pending. Final default pending applies to future inserts.
- Original purchase IDs, assessment references, session uniqueness, original payment states and existing timestamps are retained by the migration statements.
- Migration constraints/index are functionally consistent with the fresh schema. Constraint names differ between explicit migration names and inline fresh-schema names; the code does not depend on those names.
- The canonical schema is for a fresh database; it is not an upgrade. Do not apply this migration after creating the already-upgraded schema.
- Apply once. A second run fails on existing columns/objects; with transaction/error-stop handling, it should not partially reclassify rows. There is no migration-history runner in the project: record the reviewed migration checksum/revision and successful application separately.
- Non-paid legacy states are assumed not previously fulfilled. Review aggregate state counts/unknown labels in authorised staging/preflight. The source implementations use `paid`, but actual production contents were not inspected.
- Existing `ON DELETE CASCADE` from assessment to purchase remains unchanged. Assessment cleanup can therefore remove purchase/delivery/audit history. Freeze such cleanup until an approved retention/restore policy covers paid purchases.
- Only status membership and non-negative attempts are checked. SQL does not enforce all state invariants, e.g. sending requires a claim and lease, or sent requires acceptance metadata. Normal code provides them; malformed manual writes could create unrecoverable states. Consider additional constraints or integrity monitoring.

### Locking / Runtime Risk

The explicit `SHARE ROW EXCLUSIVE` lock is not the strongest lock. `ALTER TABLE` can escalate to **ACCESS EXCLUSIVE**, blocking reads and writes until commit. The backfill, constraint validation and ordinary index creation occur inside that same transaction. Large tables or long-running concurrent transactions can cause significant blocking. No `lock_timeout` or `statement_timeout` is specified in the file. [PostgreSQL ALTER TABLE documentation](https://www.postgresql.org/docs/current/sql-altertable.html).

For staging rehearsal, measure migration duration and lock behaviour using independent sessions and representative **synthetic** volume. Use reviewed session-local lock/statement timeouts appropriate to measured size; abort and keep maintenance active on timeout. Do not assert zero-downtime or a fast metadata-only migration without measuring. PGlite did not establish production lock timing.

### Rollback Limitations

- A failure before commit can roll back the transaction; confirm rollback rather than rerunning blindly in an aborted session.
- After new deliveries are processed, dropping columns destroys evidence needed to avoid duplicate sends. Preserve them; roll forward is preferred.
- Reverting application code alone restores the old untracked email mechanism. It is **not** a safe fulfilment rollback while purchases continue.
- Restoring a whole database snapshot can erase purchases made after the snapshot while Stripe retains the charges. It requires a frozen write window and provider reconciliation, not an ordinary rollback button.
- There is no destructive rollback SQL recommended for execution. Maintenance and delivery remain stopped until a compatible version and state are restored.

## 4. State-Transition Verification

| Scenario | Verified implementation / result | Remaining consideration |
|---|---|---|
| Paid confirmation | Trusted session/price/reference verification precedes upsert; paid upsert precedes PDF/email. | Stripe/assessment lookup failure means local recording has not happened yet; 500 needs retry/alert. |
| PDF failure | Paid row remains paid; delivery fails with backoff; eligible retry can succeed. | Requires a later invocation; timestamp alone does nothing. |
| Explicit email rejection | Allowlisted definite rejection becomes failed; attempts/backoff apply. | Invalid credentials/sender are configuration failures, not things retries alone repair. |
| Thrown/unknown provider response | Conservative `needs_review`; no automatic resend; payment/access retained. | Provider evidence and timely operator notification are necessary. |
| Duplicate paid event | Unique session/upsert and delivery state skip sent work; no second PDF/email. | Duplicate event IDs themselves are not stored; business dedupe is by Checkout session. Distinct sessions remain distinct purchases. |
| Concurrent workers | Conditional claim is atomic; UUID token fences provider start/finalisation. | Tested SQL interleaving in PGlite, not multi-process Neon/HTTP faults. |
| Live lease/backoff | No new claim; webhook returns 503/deferred. | CLI also returns a deferred outcome; exit status alone is not a success signal. |
| Expired lease before provider | Failed/reclaimed if attempts remain. | Only evaluated when a later webhook/CLI invokes claim processing. |
| Expired lease after provider | `needs_review`, never auto-resend. | A late result from the same token may finalise; reconciliation must be attempt-fenced (H1). |
| Retry exhaustion | Fifth definite failure stores review state; later replay logs review and returns 200. | The fifth call can first return deferred/503; a later replay observes review. No operator alert is guaranteed. |
| Legacy paid | Migration leaves `needs_review`; normal replay does not resend. | Needs a planned legacy baseline/reconciliation process, not mass retry. |
| Late failure | Exact stored PaymentIntent/session updates exclude already-paid rows. | An intent not yet associated with a stored attempt may update no row; session outcome/reconciliation is still needed. |
| Async payment | Completed-but-unpaid is not fulfilled; later async success can fulfil; async failure targets exact session. | Correct snapshot event subscriptions required. |
| Customer access after email failure | Web/PDF verifies Stripe directly and does not require sent delivery state. | Depends on Stripe availability, assessment persistence and current price ID. Lost link requires support. |
| Operator reconciliation | Evidence/reason/execute required and sent rows normally protected. | Stale-evidence race H1 remains. |

PDF naming/design and premium content were not changed or regenerated in this review. Existing tests use a synthetic buffer, not a customer PDF.

## 5. Can Paid Delivery Remain Pending Indefinitely?

**Yes. There is currently no demonstrated guarantee that an operator will be alerted.**

Examples:

- Process stops after paid upsert, before claim or delivery, and no further event reaches the endpoint.
- Definite failures keep a future retry timestamp, but Stripe stops retrying or the destination remains unavailable.
- Sending lease expires; without another invocation it remains sending in storage, because expiry is not a scheduled action.
- A review outcome returns 200 and future automatic retries stop. `console.error` is not a configured notification channel.
- Customer email is accepted but internal notification blocks customer-state persistence (H3).
- A message accepted by Resend later bounces: current `sent` means acceptance, not receipt. No Resend-event reconciliation is implemented.

Stripe retries are finite and environment-dependent: official documentation currently describes up to three days in live mode, fewer sandbox attempts, and manual replay windows. It also warns that disabling/deleting a destination can stop future retries. Do not use sandbox timing as proof of production timing. [Stripe webhook delivery behaviour](https://docs.stripe.com/webhooks#automatic-retries).

### Minimum Operational Closure Before Production

Provide an independent, tested exception check with a named owner/back-up, polling/inspection cadence, escalation channel and response target. It may be a small read-only operational job plus alerting rather than a new queue, but must cover:

- paid pending or failed deliveries overdue relative to retry eligibility;
- expired or malformed sending leases;
- new `needs_review`, with an explicitly tracked baseline for migrated legacy rows;
- Stripe delivery failures, missing local purchase records and wrong references;
- relevant provider bounce/suppression events through a monitored provider workflow.

Alerts should contain safe internal purchase/correlation references, not email addresses, session IDs, access URLs or provider payloads. Verify who receives the alert and their access to the CLI. The current CLI can inspect a known ID; it cannot discover the backlog.

Do not age a stuck delivery solely using `updated_at`: duplicate paid upserts update it and could mask an old problem. There is no dedicated paid-at timestamp. Use state/eligibility timestamps with explicit conservative handling of old creation dates; consider a dedicated timestamp in a future change. Required monitoring is an unresolved release gate, not an implemented feature.

## 6. Trusted Operator CLI Review

**Security strengths:** no public endpoint/accounts; inherited protected credentials only; no automatic environment-file loading; OS user/host audit actor; no self-declared operator-name authentication; explicit execute for mutation; paid verification before recovery; no Checkout creation; no automatic retry of sent/review; output excludes emails/session IDs/URLs/PDFs; reconciliation has reason/evidence requirements.

**Usability / limitations:**

- `CASHBRITE_OPERATOR_ENV` is only a label/selection guard. It does not prove that the supplied database/Stripe credentials belong to that environment. Independent target verification is mandatory.
- Retry dry run checks paid/status but does not compute all lease/backoff/attempt eligibility, and no row is reserved. It is not a promise that execute will send.
- Execute can return `deferred` with exit status zero. Operators and scripts must inspect outcome and then inspect persisted state, not infer success from exit code.
- Generic CLI errors protect secrets but hide distinctions such as configuration failure, missing purchase and invalid evidence. Safe classified diagnostics would improve support.
- No list/search-by-exception or scheduler; a separate protected discovery/monitoring process is needed.
- Reconciliation evidence is asserted by a trusted operator, not independently verified against Resend. A ticket reference is not proof by itself. H1 must bind it to the current attempt.
- `--provider-id` is not echoed, but command arguments may be retained in local shell/process history. Keep the host/history access restricted; do not put credentials, customer details or access links into any argument.
- Retry actions have delivery counters/logs, but only reconciliation appends the operator-specific database audit. Broader operations audit relies on the protected host/process workflow.
- The runtime transpiles local TypeScript and deliberately treats the server-only marker as a no-op in trusted Node. It is not a security sandbox. Protect repository write access, pinned dependencies, working directory and credentials; never execute an unreviewed checkout with production privileges.
- Post-send accepted mail cannot simply be resent via this CLI. If the customer loses both confirmation and success link, support needs an approved ownership-verification/private-link retrieval procedure outside public email/UUID lookup. Do not ask them to pay again or reset a sent record to work around this.

## 7. Environment Requirements (Values Not Read)

| Name | Use / requirement | Verification required in isolated staging |
|---|---|---|
| `DATABASE_URL` | Server/CLI purchase + assessment storage; migration needs DDL privileges on authorised host. | Separate synthetic database; target identity established without logging connection string; runtime privileges least necessary. |
| `STRIPE_SECRET_KEY` | Session/price reads and checkout creation. | Test/sandbox credential only; no live charges possible in staging. Do not expose to client. |
| `STRIPE_WEBHOOK_SECRET` | Raw-body signature validation. | Exact staging destination/listener secret; not interchangeable with API key or production destination. |
| `STRIPE_PRICE_ID` | One-off £19 GBP price and historical paid-access validation. | Existing active non-recurring test price, one quantity, no unexpected tax/discount. A changed ID can break old access even when price is unchanged; freeze or implement compatibility first. |
| `NEXT_PUBLIC_SITE_URL` | Canonical success/cancel/email origin. | HTTPS origin only, staging domain, no path/query/fragment/credentials. Production-mode staging cannot use the development HTTP localhost exception. Public configuration, never a place for a secret. |
| `RESEND_API_KEY` | Customer confirmation and optional internal notification. | Separate restricted test setup; no production recipient list. Missing key causes delivery failure, not loss of payment/access. |
| `CONTACT_FROM_EMAIL` | Sending identity; required by shared paid delivery precheck. | Verified authorised test sender; example fallback is not production readiness. |
| `CONTACT_TO_EMAIL` | Optional internal notification and existing contact workflows. | Use an explicitly authorised test recipient or leave unset. Must test both configured and unset because H3 depends on it. No messages to real business/personal recipients during this review. |
| `CASHBRITE_OPERATOR_ENV` | CLI only, accepted labels development/staging/production. | Does not validate credentials or confer authentication. Set deliberately in trusted host. |
| `NODE_ENV` | Framework/runtime mode; analytics and demo-download behaviour. | Hosting staging is often production-mode: test actual built behaviour, not `next dev`. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Present in documented setup, not referenced by current server-redirect Checkout implementation. | Retain if used externally; do not describe it as a secret or evidence of server configuration. |

`PREMIUM_PLAN_PREVIEW_KEY` is obsolete for this implementation's real-report access and is not required. No customer token/admin-password variable exists. GA measurement ID is hardcoded in the component, not environment-selectable; Vercel analytics also depends on hosting configuration. Those settings were not inspected remotely.

This table verifies requirements from source, **not production presence, correctness, permissions, sender verification or secret rotation**.

## 8. Detailed Staging Verification Checklist

All items below are **future verification tasks, not completed live tests**. Record candidate revision, tester, timestamp, safe evidence reference and pass/fail for each. No production data or copied production database. Any actual provider test calls require separate authorisation for the isolated environment; this review made none.

### A. Isolation and Migration

- [ ] Freeze the reviewed candidate and dependency lockfile; build it in production mode. Do not use development-only behaviour as release evidence.
- [ ] Verify database/project identity, Stripe test mode, sender/recipient restrictions and staging domain without exporting secret values.
- [ ] Create synthetic legacy paid, checkout-created, failed and cancelled rows; preserve a before-state of IDs/references/original fields for comparison.
- [ ] Apply migration once to the isolated database; verify original fields unchanged, legacy paid review state, other pending state, defaults, constraints and index.
- [ ] Exercise a deliberate migration failure/rerun; confirm transaction rollback and a clear stop, not partial backfill.
- [ ] Rehearse representative synthetic row volume and independent reader/writer sessions; measure lock acquisition/hold time with reviewed lock/statement timeouts.
- [ ] Rehearse rollback/cutover while all records remain synthetic; preserve sent/review/audit state.

### B. Checkout, Payment and Webhooks

- [ ] Use the app to create a synthetic assessment and Checkout session. A generic `stripe trigger` fixture without Cashbrite metadata is not a valid happy-path purchase.
- [ ] Configure a **snapshot** webhook payload matching current handler expectations (`event.data.object`), all five subscribed event types and correct signing secret; do not assume thin events work with this handler.
- [ ] Confirm exact £19 GBP one-off price/quantity and server-derived assessment linkage; no subscription or unplanned discount/tax configuration.
- [ ] Concurrent repeated clicks/requests reuse one eligible open session; expired attempts create an appropriate new session without collapsing distinct successful payments.
- [ ] Complete a Stripe **test-mode** payment using provider-documented test details, never a real card/charge.
- [ ] Confirm paid is durably recorded before any PDF/email task. Record only sanitised purchase/evidence references.
- [ ] Replay identical and logically duplicate success events concurrently; one customer fulfilment, no duplicate accepted email or paid-state regression.
- [ ] Replay a later failure/expiry and a different pending attempt's failure; exact matching and no paid downgrade.
- [ ] Exercise delayed paid/unpaid/failed transitions where supported by test methods.
- [ ] Wrong price/amount/currency/mode/reference and missing assessment fail closed; paid failures remain discoverable and not false success. Invalid signature fails before storage/delivery.

### C. Access and PDF

- [ ] Success URL unlocks correct synthetic profile, score, categories and premium content, both before and after webhook arrival.
- [ ] Access/PDF still works with missing/failed/review email state; no instruction or route forces a second payment.
- [ ] Repeated access does not create another checkout, send another email or consume delivery attempts.
- [ ] PDF download matches the synthetic profile and browser learning content, retains current naming and contains correct worked figures. Existing visual rebrand differences remain intentional/deferred.
- [ ] PDF success/error responses and sensitive HTML have effective no-store/no-referrer/noindex protections at the deployed edge, not merely in source configuration.
- [ ] Invalid, unpaid, unrelated and wrong-price session links do not expose profile/email/PDF data. Production-mode `demo=true` cannot bypass paid PDF access.
- [ ] No real-record `id/key` preview works; demo shows synthetic data only.
- [ ] Test a missing/lost confirmation link and document the verified support process without revealing another buyer's capability or resetting a sent state.

### D. Resend, Failures and Recovery

- [ ] Use provider-designated test addresses such as `delivered@resend.dev` for provider event simulation, only after authorisation. These are not a human inbox test. [Official Resend test domain](https://resend.dev/).
- [ ] For an actual inbox/attachment check, separately authorise one controlled test mailbox; never use customer addresses. Verify subject, existing PDF filename, content and private return link.
- [ ] Establish `sent` means provider acceptance; simulate bounce/suppression and show how the operator learns about it. The app currently has no Resend-event consumer.
- [ ] Test internal notification both off and on, including a stalled request; H3 must pass after correction.
- [ ] In an isolated harness, inject PDF failure, returned rejection, thrown/ambiguous response, provider acceptance followed by failed database commit and missing configuration. Do not ship public fault-injection flags.
- [ ] Verify paid persists, definite failures respect backoff/five-attempt limit, ambiguity stops automatic sends and original paid access remains available.
- [ ] Expire a pre-send and provider-started lease; verify only the safe pre-send case can be reclaimed automatically.
- [ ] Run CLI inspect/dry run; no mutation. Execute an eligible retry; confirm no new Checkout/payment and no unsafe console output.
- [ ] Reconcile accepted and confirmed-not-sent with real synthetic evidence; stale attempt evidence must fail after H1 is fixed. A ticket label alone cannot prove provider outcome.
- [ ] Prove an independent alert discovers overdue/review/expired records, reaches a named operator and is resolved/escalated within the agreed SLA. Include a missing-record webhook failure, not just existing purchase IDs.

### E. Analytics and Operational Evidence

- [ ] Prevent analytics tests from polluting the hardcoded production GA destination: use an approved isolated configuration or intercept outbound collection before navigation. Never forward capability-bearing test payloads to production analytics.
- [ ] Test direct sensitive-page load, public-to-sensitive SPA navigation, back/forward, route prefetch, form/outbound/scroll events and return to public pages.
- [ ] Inspect all third-party request fields, not just `page_path`: location, referrer, event data and custom properties must contain no session ID, email, assessment capability or preview key. Inspect hosted Vercel analytics behaviour too.
- [ ] Confirm non-sensitive public page views still work with query/hash removed; no duplicate automatic page-view tag.
- [ ] Check application/edge/support logs and traces for forbidden data; keep exported evidence sanitised and synthetic.
- [ ] Measure webhook/PDF/Resend timing against platform execution limits. No unbounded optional call may hold up durable customer acceptance.
- [ ] Complete the two-version cutover/rollback rehearsal below and record objective evidence of zero old-version senders.

## 9. Cutover and Rollback Review

The existing outline is directionally correct but not yet an executable, rehearsed deployment control.

### Safe Cutover Requirements

1. Separate production approval; record exact old/new revisions, migration checksum, backup/restore point, operator/backup owner and abort criteria.
2. Inventory every production/preview deployment alias that can reach the production database or send mail, registered Stripe destinations, operator processes and scheduled jobs. A primary-domain switch alone does not retire an old deployment.
3. Route checkout and webhook handling through a reviewed maintenance barrier at the same canonical ingress. Refuse new Checkout creation and return retryable non-2xx for webhook processing. **Keep the Stripe destination registered and enabled**; disabling/deleting it can stop future retries. `Retry-After` does not replace Stripe's own schedule.
4. Protect old aliases and stop operator delivery processes. Drain old in-flight functions/provider calls before applying the migration; record how that was established. Uncertain old sends must remain review cases, not guessed unsent.
5. Existing Stripe-hosted Checkout sessions can still complete during maintenance. Account for those events through retained Stripe delivery/replay and reconciliation; freezing the website does not freeze Stripe.
6. Apply the reviewed migration with bounded lock/runtime policy and error-stop behaviour from an authorised host. Check schema/legacy-state outcomes without extracting customer data into development.
7. Deploy the matching new version, with verified configuration. Keep maintenance in place while confirming route headers, shared renderer, migration compatibility and absence of old active senders.
8. Resume processing/replay first under supervision, reconcile missing outcomes, then reopen checkout. Do not bulk retry historical review rows. Keep rollback criteria explicit.

Why this matters: old code can send an email without recording a delivery claim on a newly pending row. A new worker seeing that same paid/pending row can independently claim and send it. The new UUID fence cannot constrain code that never uses it.

### Safe Rollback Requirements

- Before migration commit: abort/rollback and confirm original schema/state; keep ingress maintenance until consistent.
- After migration, before new fulfilment: preserve added columns/legacy classification. Do not assume redeploying the old version is safe for payments accepted during the window.
- After any new deliveries: keep the delivery/audit columns and stop checkout/fulfilment. Roll forward to a compatible repair or restore a proven compatible application build. Never resume untracked old senders against pending/new delivery state.
- Database snapshot restore requires accounting for all subsequent Stripe charges and new assessment/purchase writes; it is not a routine first response.
- Do not drop/reset delivery fields, reset all rows to pending, issue another charge or manually resend uncertain deliveries as a rollback shortcut.
- Keep a communication/support plan for paid customers while maintenance is active; private access may still depend on Stripe and database availability.

## 10. Release Exit Criteria and Changes Made Now

Production approval requires:

1. H1 fixed with permanent stale-reconciliation regression tests.
2. H3 fixed with customer-acceptance persistence independent of optional notification hangs.
3. H2 monitored backlog/alerting, owner and recovery SLA demonstrated.
4. H4 real browser/edge privacy evidence and correct external measurement configuration.
5. H5 complete two-version maintenance/cutover/rollback rehearsal, plus bounded migration execution and a support path for lost/missing-reference purchases.
6. All staging checklist results recorded, failures closed or explicitly accepted by the release owner, final candidate lint/type/build/tests completed and separate production permission granted.

**Only this report was added to the project during this review.** Production code, migration SQL, dependencies, questions/scoring, content and existing reports were not modified. The temporary additional test harness contains synthetic data only. Existing local implementation remains uncommitted. No phase progression or production action is authorised by this document.
