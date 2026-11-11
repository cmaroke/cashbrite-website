# Cashbrite 2.0 — Protected Local Baseline

Date: 11 November 2026. Purpose: preserve **all existing working files**, not just Git HEAD, before two isolated homepage design studies. No commit, push, stash, reset, clean, worktree or deployment.

## Git and Project Inventory Before Prototypes

- Branch: **`main`**, tracking `origin/main`.
- HEAD: **`c8dbebfcf0c41fb4d6d9f51e01f577f752d28ab3`**. This does **not** represent the complete approved implementation.
- **48 modified tracked files; 149 untracked files; zero staged changes.**
- Git reported **37,090 ignored file paths**, principally `.next`, `node_modules` and local filesystem metadata. These were included, not discarded as rebuildable.
- Complete filesystem manifest: **44,079 entries**, including **37,690 regular files and 1,501 symlinks**, totalling **1,430,811,870 file-content bytes**. Directory entries account for the remainder.
- Full original modified/untracked/index/ignored inventory is preserved in private `state.json`; every file path, byte hash, size and original mode, and every symlink target, is in private `manifest.json`. Neither is served by the prototype harness.

### Existing Approved Work Represented

| Phase / area | Representative protected paths |
|---|---|
| Phase 2 identity and homepage | `public/brand/v2/`, `app/page.tsx`, `app/layout.tsx`, `app/globals.css`, `tailwind.config.ts`, `components/Logo.tsx`, shared components and icons |
| Phase 3A visual, responsive, navigation/accessibility | Public page files, `components/MobileNavigation.tsx`, `ButtonLink`, `SectionHeader`, `InfoCard`, existing forms and layout styles |
| Phase 3B assessment | `app/quiz/page.tsx`, `components/assessment/`, `lib/assessmentDraft.ts`, `data/quizQuestions.ts`, `lib/quizScoring.ts`, assessment routes/types/validation/storage; assessment prototypes and screenshots |
| Phase 3C.1 naming/content/demo | `lib/actionPlan.ts`, `lib/premiumActionPlan.ts`, `lib/premiumPlanDemo.ts`, existing free/paid wording and documentation |
| Phase 3C.2 reliability | Stripe API routes, `lib/purchaseDelivery.ts`, `premiumPurchaseDb`, `verifiedPurchase`, `operatorRecovery`, `purchaseSafety`, recovery/health/test scripts, migration and all safety/review documents |
| Phase 3C.3 results | `app/results/page.tsx`, results/messaging tests, synthetic fixtures, final results screenshots and review document |
| Other systems/assets | Neon/Resend/Stripe implementation, protected paid routes, PDF generation and demo PDF, Excel tracker, calculators/resources, schools/contact forms, legal pages, analytics, metadata, package manifests/lockfile, all existing tests/docs and ignored local work |

## Complete Private Backup and Verification

**Verified location, outside the working project:**

`/Users/cmaroke/Documents/Cashbrite-Private-Backups/cashbrite-2-2026-11-11-pre-concepts-verified/`

- `project/`: full project snapshot, including `.git`, ignored content, approved modified files and untracked files.
- `private-configuration/`: segregated files matching private-configuration/key/database-file patterns, with original relative locations recorded only in the private manifest. These were copied opaquely, not printed or used by prototypes. Three files matched; this count does not imply three active service credentials.
- `state.json`, `manifest.json`, `verified.json`: inventory and verification evidence.
- `comparison.json`: post-prototype comparison against original working files.

The backup parent/root is owner-only (0700); private configuration files and inventory/verification records are 0600. Snapshot directories are owner-only; regular files retain their original mode inside that private tree. This is a private filesystem backup, **not a claim of encryption or an off-device disaster-recovery copy**. Symlinks were preserved and verified as links; external targets are not silently traversed/copied.

Each source regular file was hashed with SHA-256, copied, rehashed at the destination and rehashed at the source; all matched. Symlink targets were verified. A subsequent complete source-to-manifest comparison passed **before the first prototype edit**. No file was excluded from backup because it was modified, untracked or ignored. An initial inventory command exceeded its output buffer before copying; a distinct successful destination above was used and verified, rather than treating the failed attempt as a backup.

Do not publish/archive this backup into prototype outputs. Restoration is **manual and approval-only**: inspect the manifest, identify required files and review any differences before selectively restoring. Do not overwrite the current project, Git metadata or configuration wholesale. No automatic restoration or cleanup was performed.

## Isolation and Added Files

All prototype code/assets are new files under **`prototypes/homepage-concepts/`**, outside `app`, `public`, `components`, `lib` and shared configuration. The only other additions are this document and `docs/cashbrite-homepage-concepts-review.md`.

New sources:

- `concept-a.html`, `concept-a.css`
- `concept-b.html`, `concept-b.css`
- `shared.css`, `partials.mjs`, `server.mjs`, `README.md`

Seven allowlisted asset copies under `assets/`: `wordmark.svg`, `wordmark-white.svg`, `favicon.svg`, `chandni-founder.jpg`, `inter.woff2`, `manrope.woff2`, `editorial.woff2`. Each is byte-identical to its original approved public asset or existing locally built font. No environment files, credentials, reports, customer data or private implementation were copied into the preview.

Generated prototype-only outputs: `qa-results.json` and `screenshots/concept-{a,b}-{1440,768,390}.png` (six full-page captures).

Loopback harness: `http://localhost:3020/concept-a` and `/concept-b`, bound to `127.0.0.1`. It serves only a fixed allowlist, with no directory browsing, app API proxy, environment loading, analytics, checkout or database. No unfinished production route was created. Existing site remains `http://localhost:3012/`. No Next.js build was run to avoid replacing assets of the approved running site.

## Post-Prototype Preservation Check

The complete baseline comparison checks original file SHA-256 hashes, symlink targets, path existence, Git HEAD and staged-index entries, then identifies additions outside the expected prototype/two-document scope. Final evidence is in private `comparison.json`.

**Result: all 44,079 original entries remain represented; zero changed/missing baseline files; Git HEAD/index unchanged; no unexpected additions.** In particular, the existing homepage, quiz/results, score engine, registration, Stripe, database, email, recovery, PDF and spreadsheet files are byte-for-byte unchanged. Original 48 modified files and 149 untracked files were not replaced, staged or discarded.

Existing quiz, product-messaging, results-experience and purchase-reliability regressions passed with synthetic records/mocks. TypeScript no-emit and prototype script ESLint passed. Purchase SQL/migration tests used disposable in-memory PGlite only, not Neon or customer records. No real payments/emails. Browser QA uses only the new allowlisted local server.

## Still Outstanding, Not Part of These Studies

- **Phase 3C.4:** separately approved PDF/email Cashbrite 2.0 parity; existing PDF name/design deliberately preserved.
- **Phase 3C.5:** any later learning-quality/product refinement requires its own scope. No premium generator/content edits in this task.
- **Mandatory staging:** test-mode £19 Checkout, signed webhook/payment persistence, duplicate/concurrent events, paid PDF/report/spreadsheet access, email failure/manual recovery, return/repeat-purchase safeguards, basic migration/rollback and old/new sender separation, private-link/analytics checks, verified lost-link support and owner sign-off. See `docs/cashbrite-phase-3c2-minimum-launch-checklist.md`.
- Monitoring automation remains explicitly deferred. No jobs, monitoring credentials or new infrastructure.

**Neither concept is a replacement homepage. Production payments/deployment remain unapproved. Stop for design approval.**
