# Cashbrite 2.0: Phase 3C.1 Review

Date: 3 November 2026. Local only; not committed, pushed or deployed.

## Scope and Outcome

Implemented product naming, expectation-setting and synthetic demo accuracy only.
No results redesign, strengths UI, fulfilment repair, PDF rebranding or learning-content improvement has begun.
Earlier uncommitted brand/assessment changes have been preserved.

## Approved Product Contract

| Product | Positioning | Delivered now |
|---|---|---|
| **Cashbrite Money Confidence Snapshot** | Free: understand where you stand | Cashbrite Score out of 100, score band, short interpretation and three priority areas |
| **Cashbrite Personalised Money Action Plan** | Optional £19 one-off purchase: understand what to do next | Three priority-based learning chapters, fifteen practical actions, worked examples, four-week roadmap, conversation prompts, checklists, printable progress tracker, PDF, online report and companion budget spreadsheet |

Relative financial strengths are part of the approved future Snapshot definition, **not currently displayed on the free results page**. No new copy advertises them as visible. Presentation is reserved for Phase 3C.3: use existing relative category rankings, distinguish relative strengths from mastery, and handle users with no strength above the existing threshold without changing scoring.

Paid descriptions explain that the plan focuses primarily on the three lowest-scoring categories. The roadmap combines selected priority tasks with general money habits. No answer-by-answer recommendations, financial advice, AI coaching, personalised resource library, live tracking, monitoring, reminders or guaranteed improvements are promised by the updated offer copy.

## Before / After Messaging

| Area | Before | After |
|---|---|---|
| Registration explanation | Details used to send a Money Action Plan | Free Snapshot available after assessment; email used to send a copy; no purchase needed; £19 Action Plan optional |
| Registration benefit | Personalised recommendations | Free Snapshot |
| Completion loading / API message | Generating / generated Money Action Plan | Preparing / ready Money Confidence Snapshot |
| Free results | Ambiguous results/plan names | Explicit free Snapshot and distinct optional paid Action Plan |
| Paid benefits | Broad profile/action-plan/progress claims | Verified chapters, fifteen actions, examples, four-week roadmap, printable tracker and formats |
| Recovery | Money Ready Plan and vague tracking promise | Approved paid name; category-based guidance; printable self-review tracker |
| Payment success | Money Ready Plan unlocked | Approved paid name, PDF/spreadsheet downloads and online access explained without assuming email arrival |
| Free email subject | Your Cashbrite Money Action Plan | **Your Cashbrite Money Confidence Snapshot** |
| Paid email subject | Your Cashbrite Money Ready Plan is unlocked | **Your Cashbrite Personalised Money Action Plan** |
| Demo | Manually entered score 69, mismatched band and linear category percentages | Fixed synthetic answer IDs passed to canonical `scoreQuiz`; illustrative label |

Homepage How It Works and Resources quiz signpost received limited wording changes to remove free-strength/guidance ambiguity. No hero, shared navigation, styling system or layout was redesigned.

## Exact Files Changed in This Phase

Modified:

1. `app/page.tsx` - How It Works product descriptions only.
2. `app/resources/page.tsx` - free assessment signpost only.
3. `app/quiz/page.tsx` - surrounding registration/product explanation and benefits only; consent and validation unchanged.
4. `components/assessment/MoneyReadinessAssessment.tsx` - submission loading label only.
5. `app/api/assessments/route.ts` - human-readable success message only; payload, save and email calls unchanged.
6. `app/results/page.tsx` - product names, metadata and verified deliverable descriptions; existing layout and checkout retained.
7. `app/checkout/money-ready-plan/page.tsx` - recovery naming/descriptions and free Snapshot link text.
8. `app/money-ready-plan/success/page.tsx` - paid name and delivery instructions only.
9. `app/premium-plan-preview/page.tsx` - report name, introductory positioning and illustrative demo notice only; learning sections unchanged.
10. `components/PremiumPlanCtas.tsx` - default CTA label only; fetch/redirect logic unchanged.
11. `components/PremiumPlanPrintControls.tsx` - print/PDF button labels only; URLs and behaviour unchanged.
12. `lib/assessmentEmail.ts` - subjects, product descriptions and confirmation text; existing templates/styles, links, attachment filename/content and delivery mechanism preserved.
13. `lib/actionPlan.ts` - serious-gap summary product wording only; category guidance/actions unchanged.
14. `lib/premiumPlanDemo.ts` - fixed synthetic responses and canonical score generation, replacing hand-entered results.

Created:

15. `scripts/check-product-messaging.mjs` - offline demo, email and synthetic results/recovery checks.
16. `docs/cashbrite-phase-3c1-review.md` - this report.

## Demo Scoring Verification

`demoPremiumAnswers` explicitly contains valid answer IDs for all 30 canonical questions. The demo calls `scoreQuiz(demoPremiumAnswers)`; neither production questions nor scoring rules were modified.

| Metric | Canonically derived result |
|---|---|
| Raw score | 62 / 90 |
| Displayed Cashbrite Score | **57 / 100** |
| Band | **Developing Money Skills** |
| First priority | Credit cards and borrowing: 30% |
| Second priority | Student finance understanding: 41% |
| Third priority | Buy now pay later: 41% |

Other category percentages: budgeting 84%, saving 69%, banking/overdrafts 54%, scams 84%, payslips 54%, moving out 41%, money confidence 84%. Equal scores retain the existing category-order tie behaviour; moving out is tied with the second/third priorities. Strongest categories derive as budgeting, scams and money confidence.

The real premium generator selects its priorities from these scores; the rendered demo displays 57 and the matching band. Fifteen priority actions and four roadmap weeks are verified by the offline check. The existing tracker formula remains unchanged (demo goal 72); this is not a promised improvement or live tracker.

## Consent Wording: Approval Required

**Not changed.** Required checkbox currently says:

> I agree to receive my personalised Cashbrite Money Action Plan by email and understand how Cashbrite uses my data as explained in the Privacy Policy.

Proposed replacement for approval:

> I agree to receive my free Cashbrite Money Confidence Snapshot by email and understand how Cashbrite uses my data as explained in the Privacy Policy.

This changes the named report covered by consent, so it was not silently applied. The required checkbox, stored `reportConsent`, optional marketing checkbox, privacy links and all validation remain intact. After approval, align both client and server consent-validation messages (`app/quiz/page.tsx` and `lib/assessmentValidation.ts`) and review the Privacy Policy's consent/product wording together. Do not reinterpret historical consents automatically.

The surrounding registration copy now clearly states the free/paid distinction, but the old checkbox wording remains a known inconsistency until approved. The optional marketing wording is unchanged.

## Preserved Behaviour and QA

Passed:

- ESLint: `node_modules/.bin/eslint .`
- TypeScript: `node_modules/.bin/tsc --noEmit --incremental false`
- Production build: `node_modules/.bin/next build --webpack`
- Existing scoring sanity check: `node scripts/check-quiz-scoring.mjs`
- New offline check: `node scripts/check-product-messaging.mjs`

The new check uses an in-memory Resend replacement, never a real API key or network delivery. It verifies free/paid subjects and recipient, HTML/plain-text product descriptions, free/recovery/legal URLs, existing paid access URL and identical PDF attachment buffer/filename. A mock buffer is used; no PDF is generated. Results and recovery pages are rendered against a synthetic record and mocked database/tracking, checking the same assessment ID reaches the existing CTA and the recovery link returns to the correct results URL.

Browser checks used an isolated local tab and fictional details:

- 390px registration: native required fields and required report consent still block progression; completing them reaches question 1. No assessment submission was made.
- Renamed demo checked at 390px and 1440px, with document width matching viewport width (no horizontal overflow); long name wraps within the existing layout.
- Rendered demo confirms 57, its band and category-derived priorities; download href remains `/api/money-ready-plan/pdf?demo=true` in development. No download/generation was triggered.
- Desktop/mobile results and recovery wording was additionally reviewed in unchanged responsive grids; synthetic server-render checks cover content/IDs/URLs, not live paid customer journeys. Full visual results redesign testing belongs to 3C.3.

Pre/post file checksums match for canonical quiz data/scoring, database/storage modules, premium learning generator, PDF generator, registration validation/types/draft, Stripe checkout/webhook/configuration, protected PDF route and calculator component. Client checkout still POSTs `{ assessmentId }` to `/api/stripe/checkout`; API/session/price IDs, entitlements, tracking event meanings and redirect URLs are untouched.

No real emails, checkout sessions, payments, customer records or customer PDFs were created. No environment variables or database changes are required. Existing scoring benchmarks remain 100 all-best, 90 mostly-best, 54 sensible-inconsistent, 35 average-inexperienced, 14 risky and 0 all-weakest.

## Remaining Inconsistencies / Deferred Work

- Required consent and its client/server validation wording require approval as above; Privacy Policy consent wording also remains unchanged. Generic legal references to Action Plans were not rewritten without review.
- PDF content/title and attachment filename still use Money Ready Plan; PDF generation is explicitly out of scope. The existing attachment name and bytes are preserved. Rebrand/rename consistently in 3C.4, rather than editing PDF code here.
- Stripe dashboard product/receipt naming may still use an old name; no live dashboard was inspected or product configuration changed. Review separately before deployment; preserve price/product IDs.
- Preview learning content still says "workbook", has a score-band personality, a fixed +15 tracker goal, and credit-oriented roadmap/checklist wording. These are learning-content concerns reserved for 3C.5, not new advertised capabilities.
- Free email's existing three generic action tips remain, as do the old email visual assets/colours. Naming changed, not email design or free-content policy.
- Historical audit documents, filenames, internal function identifiers, old development prototypes and route slugs retain legacy terminology. They are not new product promises; routes must remain stable.
- Fulfilment retry/delivery failures and repeat-purchase safeguards are unchanged and remain for separately approved Phase 3C.2.
- Relative strengths presentation remains for 3C.3; no strengths claim was added to the current free offer.

## Local Review

- Registration: http://localhost:3000/quiz
- Illustrative paid report: http://localhost:3000/premium-plan-preview?demo=true
- Free results: use an existing authorised local `/results?id=...` link; no new assessment was saved for this phase.
- Recovery: existing `/checkout/money-ready-plan?assessmentId=...&source=email` links retain their format.
- Offline checks: `node scripts/check-product-messaging.mjs` and `node scripts/check-quiz-scoring.mjs`.

No commit, push or deployment. Await consent-copy approval and approval to begin Phase 3C.2.
