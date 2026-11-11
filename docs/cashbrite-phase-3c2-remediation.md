# Cashbrite Phase 3C.2: Release-Blocker Remediation

Date: 4 November 2026. Local implementation only. Production remains **NOT APPROVED**.

## Decision

- **GO for controlled, isolated staging verification**, once separately authorised and configured with synthetic data, test-mode providers and isolated analytics.
- **NO-GO for production**. H1 and H3 have local fixes and permanent regressions. H2 has a local read-only checker but no deployed scheduler/alert transport. H4 privacy evidence and H5 cutover evidence remain outstanding.
- No commit, push, deployment, production migration, real payment, real email or customer-record access occurred. Phase 3C.3 has not begun.

## Implemented Fixes

### H1: Exact-attempt reconciliation

The reconciliation update now atomically requires all of:

1. The internal purchase ID, verified paid state and `needs_review` state.
2. The exact persisted claim UUID (`IS NOT DISTINCT FROM` explicitly handles legacy null tokens).
3. The reviewed delivery attempt count.
4. The exact reviewed `updated_at` version.

The row version catches legacy null-token ABA transitions, including reconciliation resetting the attempt counter to zero. `getPurchase` selects the PostgreSQL timestamp as text to retain microseconds rather than passing through a millisecond-precision JavaScript Date. If a duplicate payment update changes the version, reconciliation conservatively fails and the operator must inspect again; this is intentional.

Audit entries now bind evidence and provider ID to the reviewed claim, attempt count and row version. A stale update changes nothing and appends no audit entry. No schema change is required.

Permanent tests reproduce operator A waiting during remote verification, operator B reconciling, a new ambiguous attempt, and operator A resuming with old evidence. A is rejected and the new attempt remains `needs_review`. A separate null-token/same-attempt-count transition is also rejected. Existing legacy accepted reconciliation still succeeds when its snapshot is current.

The trusted-environment authorisation boundary is unchanged. The CAS protects concurrency; it does not authenticate an operator or prove their provider evidence is genuine.

### H3: Customer acceptance independent of optional notification

`sendPremiumPurchaseConfirmation` now returns immediately after the customer provider outcome. The delivery service durably commits `sent` and the customer provider ID **before** invoking the separate internal-notification function.

Internal notification is best effort, with a two-second wait bound, errors handled locally and a separate idempotency suffix. It contains only the internal purchase ID and a generic confirmation, not the customer email, name, access URL or PDF. It cannot change customer delivery state. Duplicate webhooks encountering `sent` never resend the customer email.

The timeout bounds application waiting, not the underlying provider operation: the SDK request may complete later. Promise rejection is handled, but serverless shutdown may discard the optional notification. There is deliberately no guaranteed internal-notification retry queue. This notification is **not** the health-alert channel.

Permanent tests cover disabled, successful, rejected, throwing and hanging internal notifications. Each enabled test checks the database is already `sent` while the notification is in progress, then delivers a duplicate webhook and asserts exactly one customer send. The hanging case completes through the timeout without changing the durable customer outcome.

### H2: Read-only delivery health checker

Run from the same protected execution environment as recovery:

```sh
CASHBRITE_OPERATOR_ENV=staging node scripts/delivery-health.mjs
```

The host must inject the appropriate database credential securely; the command does not load environment files. Prefer a dedicated SELECT-only database role if approved later. Never put credentials in shell arguments or output. The environment label is not authentication and does not validate which database the credential targets.

Exit codes:

| Code | Meaning | Required operator action |
|---|---|---|
| 0 | No observable database exceptions | Record successful heartbeat |
| 2 | Exceptions found | Route sanitised JSON to the approved alert channel and triage |
| 1 | Checker/configuration/storage failure | Alert on monitoring failure, not a healthy result |

The JSON contains only status, total count, truncation flag, internal purchase IDs and fixed reason codes. It never selects customer emails or Stripe identifiers. The query returns at most 200 exceptions but reports the full count; truncation requires investigation, not treating omitted rows as healthy. The query performs no mutation or provider calls.

| Reason | Detection | Suggested response |
|---|---|---|
| `pending_overdue` | Paid/pending and purchase created over 10 minutes ago | Inspect; eligible shared retry after verification |
| `retry_overdue` | Paid/failed and retry eligibility over 5 minutes late, or missing eligibility | Inspect configuration/provider failure; shared retry only if eligible |
| `expired_lease` | Paid/sending with expired or missing lease | Inspect; provider-started outcomes need evidence, never blind resend |
| `needs_review` | Every paid review row, including legacy | Compare with approved legacy baseline; new IDs alert immediately |
| `attempts_exhausted` | Five attempts and inactive/expired delivery state | Investigate; no automatic reset or resend |
| `missing_assessment_reference` | Observable purchase with no joined assessment | Stop recovery; investigate integrity, do not relink automatically |
| `payment_confirmation_check` | Checkout-created row older than one hour | Check provider outcome through approved operations; not proof of a charge |

Active fifth attempts are not misclassified as exhausted. Successful sent rows are excluded. Age uses `created_at` because duplicate webhooks refresh `updated_at`. A payment completed long after checkout creation can therefore alert early: conservative false positives are preferable to replays hiding overdue work. There is no dedicated paid-at timestamp and no schema change in this remediation.

### Monitoring activation proposal: approval required

No scheduler, external service, production credential or paid product has been added. Recommended minimal startup arrangement:

1. An existing trusted operations runner invokes the checker every **5 minutes**, with a 60-second process timeout and protected credentials. It must alert on timeout, exit 1 and missed heartbeats as well as exit 2.
2. Its existing approved notification mechanism sends only reason codes, purchase IDs, counts and an operations-ticket reference. Do not attach raw database rows, provider payloads, URLs or environment dumps.
3. Named primary operator and backup acknowledge new review/exhaustion/reference cases within **30 minutes during staffed coverage**. Escalate unacknowledged cases after 30 minutes; unresolved paid delivery after 2 hours escalates to the owner. Define out-of-hours coverage explicitly before release rather than implying 24/7 support.
4. Keep a protected baseline of legacy review IDs; do not suppress all review cases by age. Deduplicate repeated alerts by purchase ID/reason in the runner or ticket system, with reminders and state-change alerts. Keep a daily check that total/truncated counts and the legacy backlog are understood.
5. Recovery remains manual and shared: inspect by ID; dry-run retry; execute only verified eligible failures. Review/ambiguous/legacy outcomes require provider evidence and audited reconciliation. Never reset state to force a send. Confirm subsequent health and access checks.

**Known observation limits:** a webhook failure before any purchase row exists cannot be discovered by a table scan. Existing signed-webhook error logs have hashed event correlations, but logs alone are not sufficient. Before production, approve a provider-dashboard failed-webhook check/alert and a daily test-mode-rehearsed comparison of completed payments against persisted purchases through a trusted process. No automatic provider polling or durable incident store has been introduced. Rows deleted through the existing assessment cascade likewise cannot be recovered by this scan. Accepted-but-bounced email needs provider event/dashboard monitoring; `sent` means acceptance, not inbox delivery.

Thus H2 is **partially remediated locally, not operationally closed**. Approve the existing runner, credential scope, notification transport, owner/coverage and missing-row/provider-failure procedure before activation. No new service is assumed.

## Prepared Staging Verification — Not Executed

Use a disposable database and test-mode provider configuration. Never clone customer rows or use production credentials. Rebuild the candidate and record revision/checksum evidence before deployment approval.

### H4: Analytics privacy

- [ ] Isolate measurement: current GA destination is hardcoded. Use a separately approved staging configuration or intercept/block all measurement requests before navigation. Do not pollute production analytics.
- [ ] Inspect direct loads and SPA navigation to results, recovery, success and PDF routes, including back/forward, refresh, outbound links, forms and scrolling.
- [ ] Record sanitised network evidence showing no assessment IDs, emails, session capabilities, access URLs or query/hash values reach GA/Vercel analytics or third-party referrers.
- [ ] Verify no-referrer/no-store response headers at the hosted edge as well as locally; review automatic Google measurement, already-loaded tags and dashboard configuration.
- [ ] Confirm ordinary public-page analytics still work under the approved test measurement plan. This remediation did not alter analytics.

### H5: Two-version cutover rehearsal

- [ ] In isolated staging, prepare old and new builds against disposable data and a registered test webhook endpoint. Use only synthetic pending/legacy/ambiguous purchases.
- [ ] Gate checkout creation and webhook ingress before either fulfilment handler. Return retryable non-2xx during maintenance; keep the webhook destination registered/enabled. Do not delete or disable it as a pause mechanism.
- [ ] Protect every old deployment alias/direct origin and stop old CLI/worker processes. Drain in-flight handlers. Demonstrate with concurrent requests that no old sender can run after the gate opens for new code.
- [ ] Remember already-open hosted Checkout sessions can complete while the website is paused. Preserve events and reconcile the maintenance interval before reopening checkout.
- [ ] Apply reviewed migration only to the disposable database, deploy the new candidate behind the gate, inspect synthetic states, then replay test events under supervision.
- [ ] Prove one customer delivery under duplicate/concurrent replay, customer access/PDF independent of email, and new monitoring discovery/alert acknowledgement.
- [ ] Replay H1 stale-operator test across real database connections; PGlite does not certify multi-process hosted behaviour.

### Migration timeout and locking rehearsal

No migration SQL changed in this remediation. Migration `003_premium_delivery.sql` still requires separate review and explicit execution approval.

- [ ] On disposable PostgreSQL, session A holds a conflicting table lock. Session B runs the migration with connection-level `lock_timeout=3s`, `statement_timeout=30s` and stop-on-error. Confirm timeout, rollback and unchanged schema/data; do not use automatic retry loops.
- [ ] Release A and reapply on a clean disposable copy; verify legacy paid rows remain review-only, nonpaid rows pending, constraints/index/defaults correct and old IDs preserved.
- [ ] Test statement timeout during a sufficiently large synthetic backfill and inspect transaction rollback. Size thresholds must be measured; 30 seconds is a starting test limit, not a production promise.
- [ ] Apply only once. Explicit transaction includes locks, backfill, constraints and index creation; no concurrent index option is used. Check blocked readers/writers and lock duration from a second connection.
- [ ] Capture backup/restore rehearsal evidence. Set production timeouts only after measurements and approval. No production migration was run.

### Rollback and support

- [ ] Before commit, abort and confirm original schema. After commit, preserve additive delivery/audit columns and legacy classifications.
- [ ] If new fulfilment has run, stop ingress and roll forward or use a proven claim-aware compatible build. Never restore an untracked old sender against newly pending rows.
- [ ] Restoring a database snapshot must account for every subsequent provider charge/write. Do not reset all states, bulk resend uncertain outcomes or create replacement payments.
- [ ] For lost access links, publish the existing contact route and explain that support is manual. Verify purchase ownership using a separately approved provider-side procedure; email address alone is not proof. Do not request card secrets or expose capability links in tickets/logs.
- [ ] Current recovery CLI intentionally neither prints access links nor resends confirmed deliveries. A secure manual link reissue procedure is not implemented or approved here; escalate ownership-sensitive cases to the owner. Do not invent an unauthenticated recovery endpoint or reset `sent` to recover a link.

## Validation Results

- Purchase reliability regression: **PASS**, actual migration/SQL in disposable PGlite, mocked Stripe/Resend/PDF. Includes H1 concurrent operators/null-token ABA, H3 all five notification outcomes, all health reasons and read-only/sanitised output checks, plus existing payment-first, idempotency, retry, signature/access and checkout tests.
- Missing-reference health test deliberately removes the FK inside a rolled-back synthetic transaction; production constraints are untouched.
- Product messaging tests: **PASS**.
- Quiz sanity: **PASS**, 30 questions, 10 categories, maximum raw 90; benchmark scores unchanged (100/90/54/35/14/0 for best/mostly-best/inconsistent/inexperienced/risky/weakest).
- ESLint: **PASS**.
- TypeScript no-emit: **PASS**.
- Production build (`npm run build`, existing Next webpack script): **PASS**.
- No real provider call or hosted database test; no claim of hosted concurrency, inbox delivery, analytics network privacy or migration-lock performance certification.

## Exact Files Changed in This Remediation

Modified:

- `lib/premiumPurchaseDb.ts`
- `lib/operatorRecovery.ts`
- `lib/assessmentEmail.ts`
- `lib/purchaseDelivery.ts`
- `scripts/check-purchase-reliability.mjs`

Created:

- `lib/deliveryHealth.ts`
- `scripts/delivery-health.mjs`
- `docs/cashbrite-phase-3c2-remediation.md`

Existing unrelated working-tree changes were preserved. No dependency, database schema/migration, question, scoring, free Snapshot, price, premium content/design, PDF name/appearance or route was changed.

## Remaining Release Gates

1. Approve and demonstrate the H2 scheduled runner, secure alert destination, heartbeat monitoring, ownership/escalation and missing-row/provider failure detection. The CLI alone is not proactive monitoring.
2. Complete H4 isolated browser/edge analytics evidence.
3. Complete H5 two-version ingress/drain/cutover and rollback rehearsal, plus bounded migration tests.
4. Agree safe lost-link ownership/reissue support, legacy backlog handling and out-of-hours expectations. Customer access still depends on database/Stripe availability and possession of the private access capability.
5. Record provider test-mode staging purchase, payment persistence, access, PDF, delivery failure/recovery and retry/idempotency evidence, then obtain separate production approval.

Stop for review. No authorisation for production or Phase 3C.3 is implied.
