# Phase 3C.2: Operator Authentication Approval Gate

Status: stopped before implementation, as explicitly required by approval item 4.
Date: 3 November 2026.

## Finding

The existing project has no suitable operator authentication mechanism. Source/package/route inspection found no operator login, authenticated admin session, role checks, or recovery authentication middleware.

Existing Stripe signature verification authenticates Stripe events, not a human operator. The report preview's `PREMIUM_PLAN_PREVIEW_KEY` / Stripe-secret fallback is also not an operator identity or authorisation system. It must not be repurposed as a public recovery password.

No credential values, production customer records, live service configuration or external accounts were inspected.

## Recommended Smallest Secure Design: Trusted Operator CLI

Implement recovery as a server-side command-line tool, not an HTTP endpoint.

- Only an authorised operator on an access-controlled workstation or server can execute it with the required server-side database, Stripe and Resend credentials.
- Operator authorisation is enforced by access to that trusted execution environment and its secret store, not by possession of an assessment ID, an email address, a browser preview key or an arbitrary self-declared operator name.
- Keep credentials outside source control and browser code. Restrict credential-file permissions where applicable. Do not pass secrets in command arguments or URLs.
- No customer accounts, public resend route, new shared admin password, token/cookie customer recovery or new hosted authentication service.
- Use the same approved payment-verification, durable delivery state, atomic claims and provider idempotency logic as the webhook. The CLI must not implement a second fulfilment path or create Checkout sessions.

### Operations

1. **Inspect / dry run:** identify an existing purchase by internal purchase ID and show sanitised payment/delivery status. Do not print raw session IDs, access URLs, customer emails or document contents.
2. **Retry:** act only on a verified paid purchase whose delivery state permits retry. Respect backoff, attempt bounds, claims and provider idempotency. Never charge, clear a sent state, or blindly resend an ambiguous/legacy `needs_review` case.
3. **Reconcile:** require the operator to establish the provider outcome before resolving ambiguous or legacy delivery. Persist an auditable reason and appropriate provider evidence/reference. An unknown outcome must remain `needs_review`.

Mutation requires an explicit execute option; dry run is the default. Log safe operation identifiers, reason, transition and outcome. Link operational audit to the trusted environment's operator identity where available; a typed `--operator` string alone is not authentication.

The credentials needed for recovery are powerful. Approval of this design does not authorise using production credentials or customer data during implementation/testing. Local tests must continue using mocks or a disposable database with synthetic records only.

## Boundary / Alternative

This design is suitable for a small startup with one or a few trusted technical operators. It does not provide browser-based staff login, remotely callable recovery, per-staff roles or a tamper-proof central staff audit trail.

If browser-based recovery is required, a real operator identity/session system with authorisation, CSRF protection, audit and secret management needs separate design approval. A bare API key in a URL, public email/assessment lookup, or unprotected admin page is not an acceptable substitute.

## Approval Requested

Approve the trusted-operator CLI as the Phase 3C.2 recovery mechanism. After approval, continue the already-approved additive migration, payment-first processing, delivery state/claims/retries, checkout idempotency, sensitive-route protection, shared server-only report rendering and corrected-behaviour tests.

Migration SQL must still be provided for review and must not be executed against production. The proposed CLI must initially be tested without contacting live services or customer records.

## Changes / Checks at This Stop Point

Created only this proposal document. No production code, migration, credential, dependency or endpoint was added or modified in this turn. Existing uncommitted work is preserved.

No email, payment, deployment, migration or customer-record access occurred. No commit or push. Build/test checks were not rerun because implementation has stopped at the required authentication decision; they remain mandatory after the approved implementation.
