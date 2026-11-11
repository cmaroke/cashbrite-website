# Phase 3C.1: Targeted Refinements and PDF Validation

Date: 3 November 2026. Local review only. Phase 3C.2 has not begun.

## 1. Consent and Delivery

Inspected the actual assessment API, Resend functions and paid webhook before editing.

- Free submission saves an assessment and attempts to send the Snapshot email when `RESEND_API_KEY` is configured. The email has HTML/plain-text content and no paid PDF attachment.
- Paid confirmation is triggered by a signed, paid checkout-completed webhook. It attempts to send the generated PDF attachment and online access link. Both missing configuration and delivery errors can prevent email delivery; the existing reliability concerns remain deferred.
- Registration is for the **free Snapshot**, not the paid plan. The required checkbox now says: **"I agree to receive my free Cashbrite Money Confidence Snapshot by email and understand how Cashbrite uses my data as explained in the Privacy Policy."**
- Surrounding copy explains that email is attempted when configured and the Snapshot remains available online if it cannot be delivered. The optional £19 one-off plan remains explicit.
- Client/server validation messages and the Privacy Policy's matching consent-product sentence now use the same name. Checkbox requirements, marketing choice, stored consent flags, privacy links and validation behaviour remain unchanged. Historical consent records were not accessed or reinterpreted.
- No promises of guaranteed email arrival were added. No delivery mechanism was repaired or changed in this refinement.

## 2. Five Actions Versus Four-Week Challenge

Reviewed all ten priority action sets. The clearest duplication was in credit: several actions repeated definitions/explanations, while the roadmap copied chapter actions verbatim and always prescribed a credit week.

- Retained five actions per chapter and fifteen actions per paid plan.
- Reworked the five credit actions into concrete outputs: annotate a statement, compare full/minimum repayment outcomes, fit repayment into a fictional budget, create a practice payment calendar, and write a personal borrowing rule. Existing teaching, £100/£5/£95 example and educational limitations remain intact.
- Preserved the other nine chapters' action sets: their educational substance is distinct enough; no broad rewrite was needed.
- Replaced copied roadmap actions with a progression:
  1. **Understand and prepare:** work through examples, select practice tasks and record starting habits.
  2. **Put your first priority into practice:** apply the topic to a fresh exercise, record the outcome and check understanding.
  3. **Build consistency:** practise the second priority and revisit the previous task with an adjustment.
  4. **Apply and review:** practise the third priority, review the checklist using evidence and set a next review date.
- Added a transfer exercise for each of the ten possible priority categories. Fictional scenarios are explicitly permitted, including credit practice without applying for a card or borrowing money.
- Automated checks exercise each category as the first priority: every plan keeps fifteen chapter actions and twelve unique roadmap tasks, with no roadmap task copied verbatim from a chapter action. This tests duplication mechanically; the educational progression was also reviewed manually.
- No live tracker, reminders, score guarantee or answer-level personalisation was introduced.

## 3. Explanatory Card Balance

The existing three-column cards already stretched to equal height, but a two-line heading shifted the paragraph below it relative to neighbouring cards. Icon shrink could also affect alignment.

- Shared header/body row sizing now uses CSS subgrid at desktop widths. Headings and paragraph starts align without adding text or arbitrary fixed-height padding.
- Icons have a stable size and top alignment. Gaps are consistent.
- Credit retains its two explanatory cards plus the existing detailed lesson; no empty third card was introduced.
- At 1440px, the student-finance cards measured equal 294px heights with identical paragraph start positions. At 390px, cards stack naturally with content-driven heights; no horizontal overflow was found.
- Cashbrite colours, logo assets and typography are unchanged.

## 4. Tied Priority Selection

Previously, JavaScript's stable sort preserved the incoming category-object key order. This was predictable for a given object but not an explicit cross-output contract, particularly when stored JSON keys arrive in a different order.

- Added one shared selector using lowest category percentage first and the canonical assessment category order as an explicit tie-break.
- Free plan generation, premium plan generation and results presentation now use it.
- No category percentage, score, band or weight changed.
- Added a short explanation to results, browser report and PDF: equal scores use assessment order to choose three focus areas; tie ordering does not imply different urgency.
- Tests cover all categories tied with reversed object keys, plus a tie at the third-place boundary. Free/premium outputs agree.
- Demo remains **57/100, Developing Money Skills**. Credit is 30%; student finance, BNPL and moving out are all 41%. Canonical order chooses student finance and BNPL for the two remaining slots. Moving out is not treated as less important because of the tie.
- This does not backfill historical records or rewrite old sent emails.

## 5. Actual Downloaded PDF Review

Generated through the existing **development demo download endpoint**, using only fixed synthetic responses. No paid endpoint, real Stripe session or customer record was used.

Artifact: `output/pdf/cashbrite-money-ready-plan-demo.pdf`.

| Check | Finding |
|---|---|
| Format | 17 A4 pages, 68,183 bytes (approximately 68 KB) |
| Score/band | 57 and Developing Money Skills, matching browser/canonical demo |
| Category/priority content | Matches the shared generator, including the deterministic tie explanation |
| Completeness | 123 expected content items found: profile, explanations, examples, five actions per priority, all four weeks, prompts, checklists and next steps |
| Credit arithmetic | £100 spent minus £5 paid leaves £95; full repayment clears the £100 balance |
| Student-finance arithmetic | £4,200 / 14 = £300; £300 - £190 = £110 |
| BNPL arithmetic | Three £20 instalments total £60 in the example month |
| Page breaks | Each week and its tasks kept together; continued chapter headers/page numbers present |
| Clipping/overlap | No out-of-page glyphs or detected overlapping text lines in the demo; visually reviewed all pages as a contact sheet and enlarged credit/roadmap pages |
| Print readability | A4 raster inspection shows legible body text, hierarchy, borders and checkboxes; the PDF uses 9-11pt body text, with smaller labels/footers. No physical printer test was performed |
| Forms/accessibility | Static PDF, not fillable; not tagged. Printable writing areas are not saved digital inputs |
| Typography/brand parity | **Not equivalent to the browser:** PDF retains older PNG wordmark, sparkle, navy/mint palette and Helvetica/Helvetica-Bold instead of the approved web identity. This remains a real deferred 3C.4 issue, not a passed brand check |
| Naming | Existing Money Ready Plan title/footer/filename retained deliberately, as requested |

Small pagination safeguards were added: reserve room after section headings, reserve the full info-box height and keep a week's heading/tasks together. PDF naming and content-generation entry point remain unchanged.

Some chapters still continue across pages, including the credit example options on adjacent pages and the final roadmap week on its own continuation page. No content is cut off; reducing page count or redesigning these spreads would be a separate PDF layout refinement. The PDF includes the educational disclaimer; layout differences from the browser are not presented as content parity failures.

**Validation limits:** full PDF visual/content inspection covers this three-priority synthetic demo, not every possible priority combination or arbitrary long customer name. Generator tests cover all ten topic exercise paths. No current tax-rate calculation or financial-product recommendation is made by these illustrative arithmetic checks.

## 6. Checks

Passed:

- ESLint.
- TypeScript (`--noEmit --incremental false`).
- Production build (`next build --webpack`).
- Existing quiz scoring sanity check: unchanged benchmarks.
- `node scripts/check-product-messaging.mjs --pdf-manifest`: demo, ties, consent validation, roadmap uniqueness, mocked emails, synthetic results/recovery and existing CTA assessment-ID handover.
- `python3 scripts/check-premium-pdf.py`: checks the already downloaded demo against its manifest; no network or PDF generation in this script.
- Browser review at 1440px and 390px for priority-card alignment/stacking, plus rendered updated registration consent.

PDF pages were rendered with Poppler and inspected. A local temporary fontconfig configuration was needed to avoid the bundled renderer's missing cache/config warnings; this affects QA tooling only, not the application or shipped PDF.

Protected functionality remains unchanged: all thirty canonical questions, scoring, result bands, registration data fields, auto-next navigation, Stripe/pricing, webhook, email delivery code, database schema/integrations and calculator formulas. Existing offline email tests use mocked Resend; no real email was sent. Historical brand assets are untouched.

## 7. Files Changed in This Refinement

Modified:

- `app/quiz/page.tsx` - consent/helper text and matching validation copy.
- `lib/assessmentValidation.ts` - matching consent validation copy only.
- `app/privacy-policy/page.tsx` - matching consent-product sentence only.
- `lib/actionPlan.ts` - use shared explicit priority selector.
- `lib/premiumActionPlan.ts` - credit actions, progressive roadmap and shared priority selector.
- `app/results/page.tsx` - shared priority selector and tie explanation; no redesign.
- `app/premium-plan-preview/page.tsx` - explanatory-card alignment and tie explanation.
- `lib/moneyReadyPlanPdf.ts` - tie explanation and pagination safeguards; naming unchanged.
- `scripts/check-product-messaging.mjs` - tie/consent/roadmap checks and optional synthetic PDF manifest.

Created:

- `lib/assessmentPriorities.ts` - canonical, deterministic selector and explanatory copy.
- `scripts/check-premium-pdf.py` - content, bounds, line-collision and week-pagination validation.
- `output/pdf/cashbrite-money-ready-plan-demo.pdf` - synthetic QA/download review artifact, not a customer plan.
- `docs/cashbrite-phase-3c1-refinements.md` - this report.

Temporary PDF renders/manifest live under `tmp/pdfs/phase3c1/` and are QA intermediates, not public website assets. No new dependencies or environment variables are required.

## Review / Stop Point

Preview: http://localhost:3000/premium-plan-preview?demo=true

Registration: http://localhost:3000/quiz

The updated learning/roadmap content is shared by browser and downloadable PDF. The remaining PDF visual-brand mismatch, delivery reliability, and any broader results redesign are still deferred. Nothing was committed, pushed or deployed. No payments, real emails or customer-record access occurred. Await review before Phase 3C.2.
