# Cashbrite Phase 3C.2: Monitoring Design and Staging Readiness

Date: 4 November 2026. **Design for approval, not an activated service.**

## Recommendation and Decision

Use a **private GitHub Actions monitoring workflow**, querying Neon with a dedicated restricted login, and using **private GitHub Issues** as the incident register, acknowledgement interface and notification source. Run at approximately 15-minute intervals, with a once-daily unresolved summary. Keep monitoring entirely separate from customer fulfilment and the recovery CLI. No public monitoring/recovery endpoint, Stripe key or Resend key is needed for this core design.

This is the smallest proposed arrangement that supplies durable deduplication and an operator workflow without another database migration, new service subscription or reliance on the email provider being monitored. It still requires approval of a restricted database credential, private repository access, Actions permissions/budget, notification recipients and a missed-run safeguard. It is **not implemented or active**. If the current repository is public, do not put incidents there: approve an existing private operations repository or choose another private incident store first.

**GO:** separately authorised, synthetic, isolated staging verification. **NO-GO:** production. H2 is not closed by a runnable local checker; scheduling, alert delivery, missing-row detection and missed-run response must be proven. H4/H5 evidence remains outstanding. H1/H3 are accepted locally, not certified in hosted concurrency conditions.

## 1. What Is Actually Known

Inspected `lib/deliveryHealth.ts`, `scripts/delivery-health.mjs`, the regression suite, package manifest, migration/schema, prior release documents and README. No `.github` workflow directory or `vercel.json` is present. No scheduler or durable alert/acknowledgement component is implemented. The checker is read-only, prints sanitised JSON, returns 0 for healthy, 2 for exceptions and 1 for checker failure. It never retries delivery.

**Not verified:** Vercel plan, Neon plan/compute settings, GitHub repository visibility, Actions enablement/balance/budgets, Issues availability, operator access or notifications, Resend quota/domain status, existing account-level schedules and external monitors. Absence of repository configuration does not prove absence of account-level configuration. No authenticated platform dashboard, customer database or actual secret values were accessed.

## 2. Platform Assessment and Cost Dependencies

| Infrastructure | Can support this? | Dependency / qualification | Recommendation |
|---|---|---|---|
| Vercel | Yes on a suitable plan | Hobby supports daily cron, not 15-minute scheduling; Pro/Enterprise support shorter intervals. Cron uses function resources and production deployments, not ordinary previews. Actual plan unknown. | Viable alternative if already Pro; do not upgrade or create endpoints silently. Durable deduplication and independent heartbeat still need design/configuration. |
| Neon | Yes as restricted data source | Querying every 15 minutes can increase compute wakeups/usage. Grants and connection scope must be verified. | Use existing database via new least-privilege login; never reuse application-owner credentials. |
| Neon scheduling | Technically available options, not configured here | Current docs describe `pg_cron` and scheduled Functions; `pg_cron` runs only on active compute and setup can require restart. A separate function runtime/feature entitlement is unverified. | Do not enable extensions, keep compute awake or introduce a new runtime just for this monitor. |
| Resend | Alert transport possible, not a database scheduler | Scheduled email sends are not recurring database inspections. Same-provider outage could suppress both customer delivery and alerts; quotas apply. | Keep core alerts on GitHub notifications instead; no additional Resend credential in runner. |
| GitHub | Supports approximate 15-minute schedules | Default-branch workflow, Actions enabled, private incident destination, runner availability, compute allowance and protected code required. Schedules are best effort. | Recommended conditional on owner confirmation and cost approval. |

Vercel plan/frequency and preview behaviour are documented in [cron pricing](https://vercel.com/docs/cron-jobs/usage-and-pricing) and [cron quickstart](https://vercel.com/docs/cron-jobs/quickstart). GitHub documents delayed/dropped schedules and default-branch execution in [workflow events](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule). Neon describes active-compute constraints in [pg_cron](https://neon.com/docs/extensions/pg_cron). Resend supports scheduling particular emails in [Schedule Email](https://resend.com/docs/dashboard/emails/schedule-email); that is not a replacement for querying current delivery state.

### Estimated budget, not a promise of free operation

- 96 checks/day = 2,880 runs in 30 days, or 2,976 in 31 days; add daily digests and retries. Measure complete runner time including installation, not SQL execution alone.
- At one billed minute per check and the currently documented standard Linux 2-core rate of $0.006/minute, 30-day checks alone represent about **$17.28 of compute before included allowance**; two minutes doubles that. This is an estimate, not the account's bill.
- Current GitHub documentation lists included compute credits by plan ($12 Free, $18 Pro/Team), shared with other eligible usage. Do not assume a fixed 2,000-minute entitlement or that all allowance is available to this job. Verify the actual billing page and limits before activation. [GitHub Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions).
- Public-runner discounts are not a reason to publish operational incidents. No paid third-party monitor is proposed. Neon query/compute usage and any alternative Vercel plan cost remain account-specific.
- Cost cap exhaustion can stop monitoring: budget/allowance alerts and a missed-run check are release requirements. Do not silently permit overage or downgrade the requested frequency.

## 3. Recommended Architecture — Proposed, Not Implemented

```text
Private default-branch scheduled workflow / manual test dispatch
  -> restricted read-only Neon login -> existing checker
  -> validate and sanitise report
  -> private incident Issues via short-lived GITHUB_TOKEN
  -> authorised subscribers' GitHub notifications

Daily scheduled run -> same incident register -> one unresolved digest/day
Separate missed-run safeguard -> owner/backup (approval required)

Trusted operator -> existing inspect/reconcile/retry CLI (never the monitoring job)
```

### Schedule and failure handling

- Proposed UTC cron: `7,22,37,52 * * * *` (avoid the hour boundary); daily digest `11 8 * * *`. Daily means 08:11 UTC, not fixed UK local time through BST changes.
- Use one workflow concurrency group per environment with cancellation disabled. Make each job bounded (for example 5 minutes, checker subprocess 60 seconds) and record failed/skipped/cancelled outcomes. Concurrency is not an exactly-once guarantee.
- Capture checker stdout privately. **Exit 2 is an incident report, not a command failure to discard.** Exit 1, timeout, malformed report, missing output or unexpected exit code creates/updates a monitor-failure incident and fails the workflow. Never print database exceptions or raw subprocess stderr.
- Persist a sanitised heartbeat only after a complete successful query AND incident synchronisation, including the zero-exception case. A truncated report is not a complete inventory and must not advance the complete-scan heartbeat or close unseen incidents.
- Truncation currently caps output at 200 rows with total count. Alert on truncation; after approval implement bounded complete pagination or an explicit drain procedure before using this checker to close incidents automatically. Current code has no pagination or durable baseline.
- Workflow API failures or inability to write Issues must fail visibly, not claim successful alert delivery. Test a real authorised operator receiving a test notification; GitHub notification preferences can suppress email, and API acceptance does not prove receipt.

### Durable deduplication, daily digest and acknowledgement

The future adapter should create one private incident per `environment + purchase ID`, retaining reason changes in that issue. This avoids a new ticket for each state transition. A separate fixed key represents checker failures; hashed event correlations can identify provider/webhook incidents with no purchase ID.

- Use an exact machine marker and structured allowlisted state written only by the trusted automation identity. Never interpret arbitrary issue comments as commands or credentials. Do not rely on runner-local files, ephemeral caches or Actions artifacts as the durable incident store.
- First observation: create/assign the issue and notify the authorised owner/backup. Unchanged scans: update only heartbeat/state without new comments or mentions. Reason escalation: notify once and record a version/fingerprint. A recurrence after resolution reopens/notifies once with a new occurrence.
- Acknowledge through assignee plus an `acknowledged` label by an authorised collaborator; include an operations-ticket reference, never customer details. Acknowledgement does not suppress worsening conditions or change purchase records.
- Once daily, publish one digest keyed by UTC date with unresolved IDs, fixed reason codes, acknowledgement and escalation status. Include acknowledged-but-unresolved cases. The adapter must check for an existing dated digest before notifying again.
- Label/API updates need idempotent behaviour and tests for partial failures. GitHub Issues has no distributed transaction with Neon: a timeout after issue creation may require discovering the existing marker before retrying. Claims of exactly-once notifications would be false.
- Resolution: only a complete healthy scan plus operator verification of payment/access/delivery can close a customer-impacting case. An absent row or expired filter condition is not proof of resolution. Never close unseen incidents from a truncated scan. A closed but still-present issue reopens without triggering automatic fulfilment.

### Monitor-of-monitor limitation

GitHub failure notifications help when a job **runs and fails**. They do not prove that a never-started, disabled or dropped scheduled job will notify anyone. A daily second workflow catches some skipped 15-minute runs, but shares the same platform and cannot detect a total Actions outage by itself.

Before unattended production approval, choose an independent dead-man safeguard: an already-owned heartbeat system, or a separately approved Vercel watcher if plan/cost permits. It should alert if the last complete scan is over **45 minutes** old and escalate after **90 minutes**. A GitHub API reader outside Actions would require its own restricted credential and protection; a heartbeat service may require an additional account. Neither is assumed or created here.

Until approved, the interim fallback is a named operator checking runs/heartbeat at agreed staffed intervals and a daily backup check. This is **manual supervised coverage, not automatic 24/7 failure detection** and cannot meet a guaranteed 45-minute unattended response. Production monitoring is not closed by this fallback without explicit business risk acceptance.

## 4. Security and Authentication Requirements

- Create a dedicated SQL login using a trusted SQL administrator after approval; do not create a default Neon Console/API role and assume it is restricted. Neon documents that those roles inherit broad `neon_superuser` privileges; limited roles should be created via SQL. [Neon roles](https://neon.com/docs/manage/roles).
- Grant CONNECT/USAGE and only the columns required by the query: purchase `id`, `assessment_id`, `payment_status`, `delivery_status`, `delivery_attempts`, `delivery_lease_until`, `delivery_next_attempt_at`, `created_at`; assessment `id` for the join. No email, registration JSON, session IDs, report content, write permissions, role membership, schema creation, ownership, bypass-RLS or inherited owner grants. Review PUBLIC/inherited/function privileges as well as direct grants.
- Prefer a sanitised read-only monitoring view if stricter isolation is required; that requires separately reviewed SQL and a checker adjustment. Current checker expects direct column grants. Test that reads of email/session columns and all writes fail under the actual monitoring role, not just that the application performs SELECT.
- Store the TLS connection URL as GitHub environment secret `DELIVERY_MONITOR_DATABASE_URL`; map it to `DATABASE_URL` only for the checker subprocess. No application-owner connection, Stripe, Resend or deployment credentials in this job. Verify target environment through a controlled setup record; `CASHBRITE_OPERATOR_ENV` is a label, not authentication.
- `GITHUB_TOKEN` is supplied per run, with `contents: read`, `issues: write` and no additional permissions. No PAT needed for same-private-repository issues. A different repository needs an explicitly approved GitHub App/token; do not add it silently.
- Scheduled production monitoring needs unattended access: mandatory per-run environment approval would stall the schedule. Protect workflow/source changes, restrict deployment branches to the default branch, enforce reviews/MFA, and limit secret access accordingly. Never expose secrets on PR/fork triggers or `pull_request_target`.
- Pin third-party Actions to reviewed commit SHAs, use frozen dependency installation, disable persisted checkout credentials, no shell tracing/env dumps, and no untrusted data interpolation into shell commands. Protect the loader and code it executes: `serverLoader` is trusted-code execution, not a security sandbox.
- Validate reports against known reason codes, decimal internal IDs, bounded counts and expected structure before publishing; reject unexpected fields rather than forwarding raw JSON/errors. Private issue retention/access must be reviewed. Never paste provider payloads, emails, session IDs, access links, PDFs or credentials.
- Rotate/revoke the monitoring credential if compromised. Its inability to mutate fulfilment is a core boundary, not merely a convention.

## 5. Exception Coverage and Recovery

| Case | Current checker | Operational requirement |
|---|---|---|
| Paid pending over 10 minutes | Yes, using purchase creation time | Late payments may alert early; inspect, then shared eligible retry |
| Failed past eligibility by 5 minutes / missing eligibility | Yes | Verify cause, manual shared retry; no independent sender |
| Expired/missing sending lease | Yes | Inspect provider-started flag; ambiguous cases stay manual |
| Needs review / exhausted attempts | Yes, including legacy rows | Approved legacy baseline, new/worsening alerts, evidence-bound reconciliation |
| Purchase has missing assessment reference | Yes if an inconsistent row exists | FK normally prevents this; investigate integrity, do not relink |
| Old checkout-created row | Yes after one hour | Not proof of payment; abandoned sessions create noise. Classify manually until a provider-confirmed policy is approved |
| Paid Stripe session but **no purchase row** | **No** | Separate completed-payment vs persisted-purchase reconciliation and failed-webhook notification required |
| Row erased through existing cascade | **No** | Same external payment comparison; health scan cannot discover absence |
| Customer email bounced after provider accepted | **No** | Resend delivery-event/dashboard failure monitoring; sent means acceptance |
| Recipient cannot find email / lost link | **No** | Verified manual support; never reset sent to force a resend |

Frequency is not detection latency: a 10-minute pending threshold plus a nominal 15-minute check is roughly 10–25 minutes before scheduler delay. Stripe retries remain useful, not a substitute for discovery.

Do **not** give the proposed core monitor a broad Stripe or Resend secret to fill these gaps. For initial supervised verification, the authorised owner reviews provider dashboards and records only a correlation/internal ID in private operations tickets. Before unattended release, approve provider-native failure notifications and a daily controlled payment-comparison job/process, scoped credentials and lookback/reconciliation policy. It must compare more than webhook logs, tolerate delayed events, never charge/resend, and alert on missing references without exporting customer payloads. This component is not implemented here; missing-row automation remains a release gap.

Suggested ownership: acknowledge new ambiguous/exhausted/reference/monitor-failure cases within 30 minutes of notification during agreed staffed hours; escalate unacknowledged at 30 minutes and unresolved paid-product access/delivery at 2 hours. Define out-of-hours handling explicitly. Existing CLI inspect/dry-run/retry/reconcile remains the only approved mutation path; an issue label never invokes it.

## 6. Exact Activation Sequence — Future Approval Required

1. Owner confirms Vercel plan, GitHub private destination/Issues/Actions access, billing quota/cap, Neon compute/role policy and the named primary/backup. Provide plan names/setting confirmations, **not secret values**.
2. Approve GitHub architecture, restricted credential, private issue retention/notifications, missing-row/provider check and independent missed-run safeguard (or expressly accept supervised interim coverage). If already on Vercel Pro, compare marginal costs before approving the scheduler choice.
3. After that approval, implement the unscheduled adapter/workflow candidate with sanitisation, durable issue state, recurrence/digest/partial-failure tests, concurrency/timeouts and all checks. Do not imply the current CLI already does these things. No active `.github` schedule was added now.
4. Create an isolated, schema-only staging database with synthetic records. Review and apply delivery migration only there under separate staging approval. Create/test restricted staging login through SQL, inject it as the staging secret, and verify write/sensitive-column denials.
5. Configure same-private-repository `GITHUB_TOKEN` permissions, staging environment/default-branch restrictions and operator notifications. Initially enable manual dispatch **only**, with no production credential. Verify identity, no secret leakage, incident creation, unchanged suppression, acknowledgement, recurrence and one daily digest under simulated dates.
6. Verify failure alerts: DB unavailable, denied query, malformed output, truncated result, timeout, Issues API rejection, permission failure, missing heartbeat and disabled schedule. Confirm primary/backup receipt rather than relying on console output.
7. Obtain permission to merge/activate the staging schedule. Schedules require the workflow on the default branch. If Vercel cron is chosen instead, a separate staging project with its own production deployment is needed; ordinary preview deployment does not schedule cron. No changes are made to that infrastructure in this task.
8. Run the checklist below, record evidence and costs over an agreed supervised period, and close exceptions. Re-review candidate and produce a separate production approval request.
9. Only after production approval: separately create production restricted role/secrets, enable approved schedule/alerts/dead-man system, baseline legacy review IDs, validate first run and document emergency disablement. Disabling monitoring must not disable Stripe payment processing or reset delivery records. Revoke secrets if rolling back monitoring.

No infrastructure activation, production credential creation, workflow commit or migration is authorised by this document.

## 7. Final Staging Checklist and Evidence Record

Every item is **NOT EXECUTED** here. Record candidate revision/checksums, date, tester, synthetic purchase/correlation ID, expected vs actual result, sanitised evidence location and pass/fail. Never include raw session capabilities or provider payloads in the shared record. Failed items block sign-off.

### A. Isolation and Preflight

- [ ] Schema-only disposable database; no customer rows or copied production credentials. Distinct site URL, Stripe test product/£19 GBP one-off price, test signing secret and authorised email recipient policy.
- [ ] Test-only credentials restricted to staging; frozen dependencies; lint, types, reliability, messaging, quiz and production build checks on exact candidate.
- [ ] Decide analytics isolation **before loading pages**; block outgoing production measurement or use approved isolated measurement. Protect staging access and test without weakening production access controls.
- [ ] Inspect migration applicability; run-once handling, backup/restore plan, connection pool and permissions confirmed.

### B. Stripe Test Purchase and Persistence

- [ ] Test-mode Checkout through the existing results CTA; £19 GBP, one-off, correct assessment metadata. No subscriptions or second purchase from double-click/concurrent creation.
- [ ] Signed snapshot webhook from test endpoint; payment committed before PDF/email. Read synthetic purchase only, exact assessment linkage, currency/amount and intent verified.
- [ ] Duplicate and concurrent completed events send once; out-of-order failure cannot downgrade paid. Invalid signature/missing reference/wrong amount or price fails safely and creates an operationally discoverable signal.
- [ ] Close tab before success return: webhook still fulfils. Simulate database persistence failure and provider retry; eventual recovery has no duplicate purchase/payment/delivery.
- [ ] H1 hosted race: paused operator A, B reconciliation/new attempt, A resumes; stale evidence rejected, correct claim/audit retained. Include legacy null-token case.

### C. Customer Report and PDF

- [ ] Verified paid access works repeatedly; unpaid/invalid/cross-assessment references cannot unlock another plan. No-store/no-referrer headers verified at hosted edge.
- [ ] PDF download succeeds and matches the synthetic report/category priorities; existing filename/design preserved. Budget Tracker download still works.
- [ ] Paid web/PDF access remains available when email fails; refresh does not create another charge or send. Do not publish access links in screenshots/tickets.

### D. Resend and Recovery

- [ ] Separately authorised test delivery only, e.g. provider-designated simulator or approved controlled mailbox. Verify attachment/link and actual test status; acceptance is not inbox proof.
- [ ] Synthetic PDF failure preserves paid, schedules bounded retry and appears in monitoring. Restore generator and execute only shared eligible recovery.
- [ ] Rejection/backoff, five-attempt exhaustion, ambiguous timeout and expired provider-started lease handled conservatively. No automatic resend of ambiguity/legacy/sent.
- [ ] H3: disabled/success/rejected/hanging internal notification cannot delay customer sent commit; duplicate webhook during hang sends no second customer email.
- [ ] Provider accepted but database commit failed remains manual-review, with evidence-bound reconciliation. Bounced email is visible through separately configured provider checks.
- [ ] Operator dry-run makes no writes; retry/reconcile requires trusted environment, verified paid state and valid evidence. Lost-link support uses agreed ownership verification, not email address alone or state reset.

### E. Monitor and Alert Proof

- [ ] Test every reason code plus a healthy dataset; restricted-role denied writes/sensitive reads; no PII/session/access URLs in output, issues, notifications or logs.
- [ ] First incident notifies; unchanged scans do not repeat; reason escalation/recurrence notifies once; ack persists; complete resolution closes only with evidence; daily digest includes unresolved acknowledged cases once/day.
- [ ] Truncation never closes unseen incidents or produces a healthy complete-scan heartbeat. Missing-row synthetic payment is detected by the separately approved provider comparison, not falsely claimed by the SQL scanner.
- [ ] Job/DB/Issues/notification failures, dropped/disabled schedule, exceeded budget and stale heartbeat produce the agreed response. Named primary/backup demonstrate receipt/acknowledgement.

### F. Analytics Privacy

- [ ] Direct load, SPA navigation, refresh, back/forward, scrolling, form/outbound events on results/recovery/success/PDF reveal no private query/hash/IDs/emails to analytics/referrers.
- [ ] Verify already-loaded Google tag/enhanced automatic measurement and Vercel Analytics at network level; code filtering alone is insufficient. Public-page tracking still works in the isolated destination.

### G. Two-Version Cutover

- [ ] Use separate old/new staging instances, synthetic rows and controlled endpoint. Gate new Checkout plus webhook ingress before old/new fulfilment; return retryable non-2xx, retain enabled registered Stripe destination.
- [ ] Protect old direct origins/aliases, stop CLI/workers, drain in-flight execution; prove no old unclaimed sender survives after opening new handler.
- [ ] Account for previously open hosted Checkout sessions completing during maintenance; replay/reconcile those events before reopening checkout creation.
- [ ] Exercise concurrent replay/new claims, customer access and monitoring through cutover. Do not confuse a cron rollback with payment rollout; explicitly review active schedules and credential scope on rollback.

### H. Migration Locks and Rollback

- [ ] Disposable PostgreSQL with two actual connections: hold conflicting table lock, apply migration with connection-level `lock_timeout=3s`, `statement_timeout=30s`, stop-on-error; verify timeout, rollback and original schema/data. PGlite is not proof of multi-session lock behaviour.
- [ ] Synthetic large backfill and statement-timeout rollback; measure readers/writers/index/constraint duration. Choose production timeout budgets only after evidence and approval.
- [ ] Reapply on a fresh disposable copy once; verify legacy paid review-only/defaults/constraints/index, IDs/data intact.
- [ ] After commit/new deliveries, preserve additive delivery/audit state. Roll forward or use compatible claim-aware code; never restore old untracked fulfilment or reset rows to pending.
- [ ] Restore rehearsal accounts for payments/writes after backup; document customer support and event replay. No production restore/migration occurs in staging verification.

## 8. Local Work, Checks and Remaining Blockers

Only this document was added in this task. No monitoring code, workflow, migration, dependency or application functionality changed. Existing local purchase reliability regression rerun: **PASS** against disposable PGlite and synthetic provider mocks, including health-check read-only/output coverage, H1 and H3. No hosted service tested. Full lint/type/build were not rerun because no code changed; prior remediation passed those checks, and staging must rerun them on the final implemented adapter/candidate.

Remaining approvals: actual plan/quota confirmation; private incident destination and operator notifications; restricted login creation; scheduler/adapter implementation and activation; independent missed-run safeguard; missing-payment/provider-delivery observation process; staged H4/H5 and migration evidence; safe lost-link support. A 15-minute scheduled query alone does not close these gaps.

**Stop for review. Production deployment and Phase 3C.3 remain NOT APPROVED.**
