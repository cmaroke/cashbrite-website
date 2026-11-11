# Cashbrite 2.0: release candidate

11 November 2026. A3 integrated locally. Production deployment and production payment activation are **not approved**. No migration, real payment, customer-record access or real email was performed.

## Baseline and rollback

- Original branch: `main`; baseline HEAD: `c8dbebfcf0c41fb4d6d9f51e01f577f752d28ab3` (`Update the homepage`). This is the local Git baseline, **not a verified production deployment SHA**.
- Release branch: `codex/cashbrite-2-release`. No reset, stash, clean or discard was used.
- Complete verified backup: `/Users/cmaroke/Documents/Cashbrite-Private-Backups/cashbrite-2-2026-11-11-pre-integration/verified/`.
- Backup contains 44,252 entries: 37,859 regular files, 1,501 symlinks, 1,465,681,488 bytes. Includes Git, ignored/untracked files, local build/dependencies and all prototypes. SHA-256 was compared before/after each copied file; symlink targets were checked. Private-pattern files are separately compartmented under an owner-only directory. No backup is published.
- `state.json` in that private backup records HEAD, branch, exact staged/modified/untracked status, ignored-file inventory and index; `manifest.json` records hashes. A separate public-safe inventory is in `cashbrite-2-release-inventory.json`.
- Current production is served by Vercel; the bare domain redirects to `https://www.cashbrite.co.uk/`. The existing project is `cmarokes-projects/cashbrite-website`. No production alias was changed. Record its exact deployment ID before an authorised production cutover; do not infer it from local HEAD.

## Consolidated approved work

| Area | Preserved implementation |
|---|---|
| Phase 2/3A | Approved serif wordmarks/favicons, DM Serif Display/Manrope/Inter, palette, navigation/footer, editorial/shared UI and accessibility refinements |
| Phase 3B | Canonical 30 questions, 10 categories, single-question interface, cancellable 400ms auto-next, Back/edit, manual toggle, review/explicit submission, private tab draft recovery |
| Phase 3C.1 | Free Cashbrite Money Confidence Snapshot and optional £19 Personalised Money Action Plan naming, category-based content, corrected synthetic demo |
| Phase 3C.2 | Existing signed webhooks, payment-first persistence, fenced claims, provider idempotency, safe retry/reconciliation CLI, failure health check, private report/PDF access and analytics URL protections |
| Phase 3C.3 | Approved results layout, strengths/priorities, accessible tie disclosure, authentic excerpt, £19 offer without unapproved future-price comparison |
| Other functionality | Registration/consent, Neon, Resend, Stripe, calculators, resources, forms, legal/SEO, PDF naming/design and Excel tracker preserved |

Historical docs saying these phases were uncommitted/not approved describe their original delivery dates; this release consolidates the current approved source. Deferred PDF/email branding and naming are **not silently implemented**.

## Integration changes made in this task

1. `app/page.tsx`: latest A3 hero and Concept A sections adapted to native server-rendered JSX and internal Next links. Original metadata and JSON-LD retained. Prototype banner/navigation/localhost links and concept-only purchase disclaimer removed. Existing shared navigation/footer/legal links retained.
2. `app/homepage.module.css`: mechanically scoped the approved prototype styles and mapped fonts to existing Next font variables. Includes the latest top-aligned desktop content, approximately 191px higher than initial A3. No style leakage into other pages.
3. `components/UniversityMoneyIllustration.tsx`: client-only interactive island using React state and unique accessible IDs. Same tilted illustration, annotation artwork, expense insights and £60 trip toggle; £1,200 minus £1,050 leaves £150, minus £60 leaves £90. No API, storage, payment or tracking added.
4. `scripts/check-release-browser.mjs`: loopback-only rendered production regression and screenshots; blocks outside traffic, stubs Vercel analytics, intercepts assessment submissions.
5. `scripts/check-release-server.mjs`: synthetic assessment/consent/save and shared schools/contact enquiry regression with mocked adapters.
6. `scripts/check-downloads.mjs`: actual PDF generation with synthetic assessment and XLSX integrity smoke check; no live providers.
7. `.gitignore` and `.vercelignore`: exclude local credentials, build/store files, QA output, prototypes and reference/backup artwork from deployment. They are preserved locally/private backup, not deleted. Vercel linking created ignored local project metadata and a new ignored OIDC env file; no pre-existing env file was overwritten.
8. This report and safe changed-file inventory. All other previously modified sources are consolidated unchanged from the verified starting snapshot.

## Local verification

| Check | Result and limits |
|---|---|
| ESLint | Full project passed; new release test scripts included |
| TypeScript | `tsc --noEmit --incremental false` passed |
| Production build | Next 16.2.9 webpack build passed, 23 static pages plus existing dynamic/API routes. Environment-file loading disabled, no live credentials used |
| Quiz scoring | Passed: 30 questions, 10 categories, raw max 90; best 100, mostly-best 90, mixed 54/35, risky 14, weakest 0; unchanged |
| Product messaging | Passed: canonical demo, deterministic priorities, consent, 15 actions/4 weeks and mocked templates/attachment |
| Results | Passed 16 synthetic cases, existing checkout props, strengths/fallbacks and limited authentic excerpts |
| Purchase reliability | Passed existing suite using disposable in-memory PGlite, actual migration/SQL, mocked Stripe/Resend/PDF; duplicate/concurrent events, H1/H3, rejection/ambiguity/backoff, paid access and no-second-charge guards |
| Homepage/routes | Passed 1440/768/390px: loaded fonts/images, one H1, no overflow, no prototype links/banner, no page JS errors, keyboard/touch controls, repeated £150/£90 toggles, visible CTA; main public routes and missing-reference states return 200 with useful content |
| Quiz browser flow | All 30 answered; Back correction; auto-next hides Next, manual validation, final review, explicit confirmation, one intercepted save, error preservation, refresh recovery with no registration/consent restored. No real assessment written |
| Registration/server | Invalid/absent consent rejected; valid 30-answer payload produces one mocked save at 100/100; shared schools/contact endpoint validates anti-spam and uses mocked Resend |
| Calculator | Actual hydrated component returns £30 remaining and Strong budget for £1,200 income, £870 essentials, £180 flexible and £120 savings |
| Downloads | Actual premium PDF: 17 pages, 68,182 bytes; free PDF: 2 pages, 40,859 bytes. Excel asset present, valid ZIP header, 15,114 bytes. PDF content check: all 123 expected items present, zero out-of-page glyphs/line collisions, four week blocks kept together. Cover visually inspected; PDF retains deliberately deferred previous branding |

Local candidate: `http://127.0.0.1:3022/` (production build, no live service configuration). A1/A2/A3/B prototypes remain untouched at port 3020. Screenshots and browser evidence: `output/release-qa/`. These are local synthetic artifacts, not customer data.

Package-manager note: installed pnpm 11 attempted an automatic dependency-status reinstall and failed in the sandbox. No dependency input was changed or modules purged. Equivalent installed ESLint/TypeScript/Next commands passed directly. No new application dependency was added. Poppler initially lacked its font cache config; rerun with the existing local font configuration passed.

## Preview isolation and remaining blockers

The Vercel preview environment lists database and Stripe variables assigned to Preview and Production. Values were not read. **Do not deploy an unmodified preview with those service bindings.** Use deployment-only empty overrides at build/runtime for `DATABASE_URL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` and `CONTACT_TO_EMAIL`. Keep the price source unchanged. This is a visual/navigation/error-state preview, not certified functional hosted checkout. Never promote this service-disabled preview directly into production; an authorised production release must use the correctly approved production configuration after staging/migration gates pass.

No project-level environment value, DNS, domain, schema or payment setting is changed. Preview source excludes private `.env*`, backups, prototypes and local QA outputs. Preview upload dry-run reviewed: 123 files, approximately 4.5MB before this report. Vercel authentication was renewed through its user-approved device flow; credentials are not committed or printed.

Mandatory remaining hosted staging gates in `cashbrite-phase-3c2-minimum-launch-checklist.md`:

- Isolated staging database/schema and separately authorised migration 003; lock/rollback/cutover checks and no overlap between old/new fulfilment workers.
- Real Stripe **test-mode** £19 purchase, signature, persistence, webhook replay/concurrency, cancellation/errors and returning-customer safety.
- Authorised Resend test delivery, failed/ambiguous delivery recovery, report/PDF access without email and safe lost-link support.
- Hosted paid-link no-store/referrer/indexing protections and actual outgoing analytics privacy; GA admin Enhanced Measurement configuration remains an external dependency.
- Manual operating owner/backup and explicit final production approval.

Local mocks are not substitutes for these gates. No real service test or migration was performed. No scheduled monitoring, new credentials/services or Phase 3C.4/3C.5 work was introduced.

Handwritten notes retain A3's system-font fallback; appearance varies by OS. Local browser coverage is Chromium/touch emulation, not physical Safari/Android or a full assistive-technology audit. Existing public Excel asset is not payment-protected; personalised report/PDF remain protected by verified payment.

## Release decision

**GO for isolated visual preview and review. NO-GO for production release/payment activation until mandatory staging gates and explicit approval.**

Do not push `main`, promote a deployment or change production aliases in this task. Preserve the baseline commit, complete private backup and candidate commit for rollback. If production migration is later approved, retain additive delivery fields/audit state on rollback and pause new checkout/old fulfilment until the matching safe code is running; blindly rolling back to old fulfilment is unsafe.
