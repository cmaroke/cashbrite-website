# Cashbrite 2.0: Phase 3C Audit

Date: 3 November 2026. Status: recommendations only; implementation not approved.

## Executive Decision

**Keep the £19 price. Improve the product handover before increasing sales pressure.**

The paid product is a substantial, category-personalised educational workbook, not a bespoke financial diagnosis. Its examples, fifteen priority actions, four-week roadmap and companion spreadsheet can justify £19. The current journey does not demonstrate those strengths convincingly enough, and inconsistent naming makes the free/paid boundary unnecessarily confusing.

The most important priorities are reliable purchase-email delivery, accurate promises, an honest demonstration of personalisation, and PDF/email parity with Cashbrite 2.0. A more prominent button alone will not solve these issues.

### Evidence and Limits

- Reviewed the actual results, assessment submission/storage, free and premium generators, report renderer, PDF generator, Resend templates, Stripe routes, purchase persistence, recovery page and download controls.
- Opened the existing local registration page and `/premium-plan-preview?demo=true`; inspected the demo's rendered content and desktop cover. Its typography and serif logo have clear premium potential.
- Results and recovery layouts were assessed from source, without retrieving customer records. Mobile ordering findings below follow the actual responsive classes, not a fresh device test.
- Did not generate any PDFs, inspect a newly generated PDF, send emails, call checkout, make payments, write database records or run integration tests. PDF visual findings are based on its explicit rendering instructions. No claim of a verified production delivery failure is made.
- Did not audit spreadsheet formulas or current legal adequacy. The spreadsheet download wiring and public asset location were verified; its contents were not re-reviewed.
- Only this document was created. No production files, scoring, pricing or integrations were changed. No commit/deployment.

## A. Current Customer Journey

| Step | Verified implementation | Customer implication |
|---|---|---|
| Registration | Required consent promises an emailed personalised Money Action Plan. | Sets a stronger free expectation than the results page fulfils. |
| Assessment | Existing 30-question flow explicitly submits answer IDs to `/api/assessments`. | Scoring remains server-side; this audit proposes no scoring changes. |
| Save and free email | API generates scores and a free `ActionPlan`, saves category/results data, then awaits settled email attempts before returning the ID. | Results can be delayed by email processing; email failure does not necessarily fail assessment completion. |
| Free results | Score, band, summary, three lowest categories, then £19 offer. | Useful orientation, but no strengths despite the stated free model. |
| Purchase | `UnlockPlanButton` posts assessment ID to `/api/stripe/checkout`; server loads email, creates a payment-mode session and returns its URL. | Existing real checkout, not a placeholder. |
| Cancel | Stripe returns to `/results?id=...`. | Answers/results persist, but no specific cancellation acknowledgement. |
| Success | Server retrieves Stripe session and checks complete/paid/product metadata before loading linked assessment. | Web access is verified independently of webhook completion. |
| Fulfilment | Signed completed-checkout webhook generates PDF, marks purchase paid, then attempts confirmation email with PDF attachment and access URL. | PDF generation is retryable before payment marking; email retry has a separate weakness below. |
| Downloads | Unlocked web report exposes PDF API download and static Excel download. | PDF download rechecks Stripe; Excel file itself is publicly addressable. |
| Return later | Free email links to `/checkout/money-ready-plan?assessmentId=...&source=email`. | Recovery page uses the same checkout button and records view/email-click interest. |

## B. Five Strongest Aspects

1. **Concrete educational substance:** credit statement walkthrough, student-finance weekly allocation, BNPL stacking and other worked examples exceed a simple score report.
2. **Real prioritisation:** three weakest categories determine detailed chapters and several roadmap tasks, shared by the web and PDF generators.
3. **Low-friction commercial model:** £19, one payment, no subscription, with the checkout card already alongside the desktop introduction.
4. **Multiple delivery formats:** protected web report and PDF, plus a practical Excel companion. The PDF attachment uses the linked assessment, not demo data.
5. **Credible visual foundation:** approved serif wordmark, editorial headings, ink/cream surfaces and lime controls give the web report an identifiable brand. Educational disclaimers avoid presenting it as regulated advice.

## C. Ten Most Important Weaknesses

Effort estimates are engineering/design estimates, not commitments; integration QA is additional.

| Rank | Finding and evidence | Classification | Impact | Effort / priority |
|---|---|---|---|---|
| 1 | Purchase marking precedes email success. `sendPremiumPurchaseConfirmation` uses `Promise.allSettled` without inspecting outcomes; Resend result errors are also not inspected. Missing API key returns silently. A later webhook sees an already-paid purchase and does not resend. | Confirmed delivery-recovery defect; actual failed deliveries not observed | Critical trust/fulfilment risk | Medium, 1-2 days; P0 |
| 2 | Registration and free email promise/name a Money Action Plan; the results sell an Action Plan. Free email subject is `Your Cashbrite Money Action Plan`. | Confirmed promise mismatch | High: perceived bait-and-switch | Low-medium, 3-5h plus consent-copy approval; P0 |
| 3 | PDF explicitly uses old PNG logo, old navy/mint palette, Helvetica and a sparkle. Free HTML email also references old logo/colours; paid confirmation is text-only. | Confirmed brand mismatch | High: purchase feels like a different/older product | Medium, 1-2 days including PDF/email visual QA; P1 |
| 4 | Free results omit strengths entirely, although data exists. Three compulsory priorities are shown even when all scores are strong. | Confirmed free-model gap; UX improvement | High: trust and emotional reward | Low, 2-4h; P1 |
| 5 | Plan generation receives scores/registration, not individual answers. Age/stage are interpolated into profile copy but do not adapt learning chapters. No exact-answer explanation can currently be reconstructed from storage. | Confirmed capability limit; commercial opportunity | High: qualify personalisation claims | Low for honest messaging; high for new answer-level capability; P1 |
| 6 | Results describe formats/benefits but show no genuine paid content excerpt. Repetitive format strip plus benefits list substitutes for evidence. | UX/commercial opportunity | High: buyer cannot judge teaching quality | Medium, 4-6h; P1 |
| 7 | Mobile puts all left-column introduction/value copy and the three-format strip before price/CTA. Recovery CTA follows its six-item inclusion list. | Confirmed layout ordering; conversion effect needs testing | Medium-high | Low, 2-4h; P1 |
| 8 | Tracker is static: current score, arbitrary +15 goal capped at 100, three priorities and blank writing areas. No saved progress, reminders or automated remeasurement. Personality descriptions also overinterpret a score band. | Confirmed product limit; UX improvement | Medium-high: avoid overpromising | Medium, 4-8h for clearer editable/printable goals, not an account system; P1 |
| 9 | Roadmap reuses two actions from each priority, mixes them with fixed week themes and always includes a credit week. Parent framing is universal. Credit-history checklist exists without a matching dedicated learning explanation. | Confirmed content gaps | Medium-high: weak fit for older/non-student users | Medium, 1-2 days; P2 |
| 10 | No existing-purchase lookup before new checkout; a returning buyer can start another session. Paid access errors only offer contact, and cancellation has no acknowledgement. | Confirmed safeguards/UX gaps; not evidence of duplicate charges | Medium | Medium, 1 day plus payment/access QA; P1/P2 |

Additional confirmed observations: storage errors are described as storage "not connected yet", even for a transient outage; success renders a confirmation H1 plus the report cover H1; static tracker URL is not payment-protected; recovery tracking occurs during server rendering, so reloads/prefetches/email scanners can inflate interest counts. None requires altering scoring.

## D. Verified Free Versus Paid Deliverables

| Deliverable | Free today | Paid today |
|---|---|---|
| Cashbrite Score / band | Results page and email | Repeated in web/PDF |
| Short interpretation | Band-based summary, name and serious-gap message when applicable | Band profile plus name/age/stage text |
| Three priorities | Category names on page and in email | Three category-selected learning chapters |
| Strengths | Generated/stored, **not displayed on free page or customer email** | Up to three, with a highest-category fallback |
| Detailed teaching | Not on free results page | Why it matters, mistakes, explanation, example, tip/rule and five actions per priority |
| Free actions | Email includes first three entries of a fixed generic challenge, not lowest-category-specific actions | Fifteen chapter actions; roadmap reuses some of them |
| Four-week roadmap | Generic challenge exists in stored free plan; first three entries emailed | Four weeks, three tasks each; partly category-based |
| Parent prompts / checklist | Not on results/email | Five prompts, twelve checklist topics |
| 90-day tracker | No | Static current score, proposed +15 target and writing prompts; no saved tracking |
| PDF | No free plan attachment in assessment email | Attached to purchase email; protected download; web print option |
| Budget tracker | Public asset is accessible without payment if URL is known | Download button on unlocked report, not attached to purchase email |
| Matched resource library | No | No per-priority resource-link collection found; do not promise one |

**Recommended boundary:** free = understanding your result, genuine relative strengths, three priorities and routes to free tools. Paid = guided learning, examples, five actions per selected topic, weekly plan, conversation prompts, printable tracker and companion spreadsheet. Do not remove essential safety/support signposting to create purchase pressure.

## E. Actual £19 Product Assessment

### What is genuinely personalised

- Lowest three category percentages select chapters from ten fixed guidance objects; ties follow category insertion order rather than a severity model.
- Highest categories/strengths populate the profile; result band chooses profile/personality and closing next steps.
- First name, age and education stage appear in text. Completion date appears on cover. Email appears in web presentation.
- Roadmap uses the first two actions of the first two priorities and the first two actions of the third priority, mixed with standard tasks.
- One parent prompt names the first priority. Goal score is `min(100, current + 15)`.

### What is not personalised

No answer-specific misconception mapping, personal income/budget calculations, circumstances-based product advice, age-dependent chapters, education-stage learning path, adaptive lesson difficulty or live progress tracking. Users sharing priorities receive essentially the same chapters. `riskAreas` are not a separate premium-content selector; the engine sorts category scores directly. The storage save does **not** retain `selectedAnswers`.

**Price verdict:** £19 is defensible for a well-presented guided workbook and useful spreadsheet, especially for a parent buying structure and reassurance. It is not yet defensible as deeply individual coaching or an intelligent answer-by-answer diagnosis. This is a professional value judgement, not tested willingness-to-pay evidence.

**Content quality:** strongest when it teaches through real figures; weaker where actions say "explain" or "write the rule" rather than help users complete an output. The week labels sometimes do not match selected tasks. Student-finance material is conditional in places, but universal parent/"prepare for adult life" framing fits a 17-year-old better than an independent 29-year-old. Make parent conversations optional and offer a trusted-person alternative.

**Accuracy/credibility cautions:** the scam example names a fictional "Cashbrite Bank", which could confuse Cashbrite's role; use an explicitly fictional unrelated bank. Payslip deduction figures are explicitly illustrative, not a current tax calculator, but should carry prominent assumptions. Checklist mentions credit history while the credit chapter focuses on statements. No conclusion about current legal/tax correctness is made here.

**Version consistency:** stored assessments retain old score/category values, while `getAssessment` recalculates the band and free plan using current code. Premium web/PDF are regenerated on access. Therefore an old email attachment and a later download can differ after future content changes. Define a versioning policy before promising a permanent identical report; do not silently recalculate historical scores.

**Demo defect:** `premiumPlanDemo.ts` shows 69 with `Developing Money Skills`, but current 65-84 band is `Building Money Confidence`. Its raw 62/90 would calibrate to about 57, and category percentages are old linear values rather than the current power curve. Demo is not suitable evidence of scoring correctness until rebuilt from canonical sample answers. Do not change the production scoring to fit it.

## F. Recommended Results Structure

1. **Result opening:** modest editorial H1, Manrope score, current band and concise supportive meaning. Say it reflects assessment responses, not an accreditation or prediction of financial outcomes.
2. **A balanced result:** compact relative strengths and three priority areas side by side on desktop; stack on mobile. No need for ten percentage cards. If no category meets the strength threshold, say "Your strongest starting points", not "skills mastered". For high scorers, say "Areas to build on", not imply severe gaps.
3. **Bridge:** "You know where to focus. Your Action Plan helps you put it into practice." Add one small genuinely selected lesson excerpt, visibly labelled as a sample.
4. **Paid offer:** editorial headline/short description on left, £19 and the existing checkout button on right. Mobile order: heading, one-sentence promise, price/button, then detail. Preserve current pricing and Stripe component behaviour.
5. **Proof, not more promises:** two optional, compact example reveals and a four-item deliverables list. Show exactly what arrives: personalised PDF, web access, 30-day plan and Excel companion. Clarify static/printable nature of tracker.
6. **Free route and support:** unobtrusive links to calculator/resources, educational disclaimer, delivery explanation and purchase-help contact. Visitors should not feel their only next step is payment.

Use DM Serif Display for the result/offer editorial headings, Manrope for score and interface headings, Inter for body/buttons. Ink text on cream, restrained sage labels, lime for the main action. Use rules and aligned columns rather than nested rounded boxes. Avoid lime body text on white and check contrast for small sage text. Retain 390px gutters and comfortable tap targets. Do not promise first-screen CTA visibility until measured with long band/summary text.

## G. Demonstrating Value Honestly

The requested answer -> priority -> explanation -> action chain is **possible as an illustrative teaching sample**, not currently as a stored-user answer explanation. Each category contains three questions; one response alone does not establish a bottom-three ranking.

| Authentic sample from canonical data | What selection can indicate | Existing paid explanation/example | Existing recommended action |
|---|---|---|---|
| `credit-3`, answer `b`: "Pay the minimum payment only" (1 point) | Contributes to lower credit category score | £100 trainers statement: pay £5, £95 remains and interest may be added | Use a sample statement to find amount spent, minimum, full balance and due date |
| `student-finance-5`, answer `b`: "Spend what I need first, then budget what remains" (0 points) | Contributes to lower student-finance score | £4,200 across 14 weeks = £300/week; £190 rent leaves £110 | Write expected termly income and divide by exact weeks covered |
| `budgeting-3`, answer `c`: "Use credit or BNPL to cover the gap" (1 point) | Contributes to lower budgeting score | £240 allocated to £90 essentials, £30 saving, £100 flexible spending and £20 buffer | Review seven days of transactions and label spending categories |

Display approach: one real excerpt from the visitor's lowest-category guidance, labelled "A sample from the [category] chapter selected for your plan". Offer two other clearly illustrative scenarios in an expandable sample area. Do not show "You answered..." or assert an exact misconception. A small authentic excerpt gives evidence without releasing all fifteen actions or the full roadmap.

### Paid Report Improvements

1. Rebrand generated PDF, not just print CSS; embed suitable licensed fonts and approved logo artwork with render checks. Actual page count, clipping and file size need demo-PDF QA after approval.
2. Align web/PDF content through the shared generator; add a short contents/"start here" area and estimated task effort.
3. Make week themes follow selected topics; avoid a fixed credit week when credit is already a strength.
4. Turn each priority into a practical output: completed spending allocation, payment calendar, payslip check, or scam-verification routine. Keep educational scope.
5. Describe band personalities as a supportive learning starting point, not a validated personality assessment.
6. Offer an optional review goal rather than an unexplained +15 target; make clear there is no guaranteed score improvement.
7. Add a small maintained set of official/help resources per topic only after verification; do not advertise matched resources before they exist.

## H. Email, Access and Checkout Observations

### Confirmed Defects / Risks

- **Email recovery:** marking paid suppresses subsequent confirmation attempts; ignored settled results cannot establish successful delivery. Resend may return an error object without throwing. Add separate delivery state/retry design after approval; do not conflate payment with email success. This may require separately approved persistence work.
- **Free email asymmetry:** text fallback includes the explicit results URL; HTML reconstructs it from checkout URL. Both give three generic free actions, no strengths, and use the ambiguous Action Plan subject. Standardise from one presentation model later.
- **Access model:** results/recovery use possession of an assessment UUID, not identity verification; paid web/PDF use possession of a paid Stripe session URL. Treat links as bearer credentials. This is not proof of an exploitable guessable-ID vulnerability, but sharing/logging/referrer exposure and analytics URL handling deserve a focused security review.
- **Preview key:** real-record preview accepts a secret in query parameters, falling back to the Stripe secret. Avoid sharing such URLs; recommend a separate protected preview design, not a redesign of checkout. Public demo uses synthetic data, but is accessible in production and currently inconsistent.
- **Repeat purchase:** checkout validates assessment but does not check previous purchases or use a session-creation idempotency key. Browser loading state helps ordinary clicks, not retries across tabs or visits.
- **Amount expectation:** Stripe uses configured price ID; £19 is presentation copy. No explicit amount/currency check ties the configured product to that promise. Verify configuration in authorised test-mode QA before launch, without changing pricing here.
- **Tracker:** presenting it as a bonus is acceptable, but do not call it payment-protected while the file lives under `public/downloads/`.

### What Already Works in Code

- UUID validation, server-side customer-email lookup, product/assessment metadata and success/cancel URLs are present.
- Checkout button handles loading, network/response failures and visible inline retry errors.
- Webhook checks signature on raw body; paid access and PDF routes check Stripe paid/completed/product fields.
- Purchase email attaches the generated PDF buffer and includes web access plus educational disclaimer. Internal notification is configured separately.
- PDF is generated before purchase is marked paid, allowing webhook retry when generation throws. Duplicate completed events do not normally send a second email after the paid transition, although PDF generation still occurs before that check.

### Recommended Delivery Language

Before purchase: "After payment, download your PDF and Budget Tracker here. We'll also email your PDF and a link to return to your plan." Avoid guaranteeing email arrival before delivery is observed.

After purchase: visible PDF and spreadsheet downloads, copy/save access link, email destination with appropriate privacy, and "Email not arrived?" help. Offer explicit purchase recovery rather than inviting an already-paid customer to buy again.

Free email should be "Your Cashbrite Score and priority areas"; paid email should consistently name "Cashbrite Money Action Plan" or the single approved product name. Approve the naming convention first; do not silently rewrite consent wording during a visual pass. Retain accurate pricing, plain-text fallbacks, legal links and educational limitations.

## I. Prioritised Implementation Roadmap

| Stage | Work | Impact / effort | Acceptance gate |
|---|---|---|---|
| 3C.1: promise contract | Approve one free-results name, one paid name, deliverables and delivery wording; correct synthetic demo | High / low | Every advertised feature mapped to actual output; canonical demo score and band agree |
| 3C.2: fulfilment safeguards | Separate email delivery success from payment marking, inspect Resend errors, design retry and duplicate-purchase recovery | Critical / medium-high | Mock failed/missing email, webhook replay, PDF failure and returning buyer; paid web access remains available |
| 3C.3: results editorial pass | Add honest strengths, concise priorities, real sample bridge, compact price/CTA and free tools route | High / medium | 1440/390 layouts with short/long bands, low/high scores and ties; existing checkout payload unchanged |
| 3C.4: product parity | Bring PDF and emails to 2.0; align recovery offer and purchase/download instructions | High / medium | Render synthetic PDFs for all bands and varied priorities; check mobile email and text fallback; no customer emails |
| 3C.5: learning quality | Align weeks to priorities, practical outputs, age-appropriate conversation framing and transparent tracker | Medium-high / medium | Web/PDF parity, clear lesson/action outcomes; no scoring change |
| 3C.6: authorised validation | Test-mode checkout, cancellation, paid access, attachment/download equality and delivery recovery | Critical / medium | Explicitly approved test environment; lint, TypeScript, build and regression checks |

Do not bundle backend reliability changes into a layout-only approval. Agree scope separately, particularly delivery persistence, access recovery and any future answer-level data retention. No database migration is proposed by this audit itself.

### Suggestions Requiring Further Testing

- Whether restoring a small strengths section increases trust without reducing conversion.
- Whether a real lesson excerpt outperforms benefits-only presentation.
- Whether £19 feels worthwhile to young buyers versus parent buyers; use short moderated comprehension/willingness-to-pay sessions, not assumed uplift.
- Whether price immediately after introduction helps on mobile without making results feel withheld.
- Whether users understand the score is an educational indicator, not certification; whether "personality" framing adds value or distracts.
- Measure completion -> results -> checkout -> paid -> successful delivery/download separately. Existing recovery-interest rows are not reliable unique-human conversion counts.

## J. Exact File / Component Change Map

These are future change candidates, **not files changed in this audit**.

| File | Proposed responsibility |
|---|---|
| `app/results/page.tsx` | Balanced free insights, real excerpt, editorial offer hierarchy and free tools links |
| `components/PremiumPlanCtas.tsx` | Retain existing checkout mechanism; only approved shared naming/reassurance changes |
| `lib/actionPlan.ts` | Free summary/strength wording and contract; avoid adding premium education to free output |
| `lib/premiumActionPlan.ts` | Honest profile, topic-aligned roadmap, practical outputs and tracker improvements |
| `app/premium-plan-preview/page.tsx` | Report layout, contents, optional conversation framing and tracker presentation |
| `lib/premiumPlanDemo.ts` | Rebuild consistent synthetic example using canonical scoring; no scoring edits |
| `lib/moneyReadyPlanPdf.ts` | 2.0 logo/colours/fonts, layout and report-version policy support |
| `components/PremiumPlanPrintControls.tsx` | Clear delivery/download hierarchy; retain existing protected PDF endpoint |
| `lib/assessmentEmail.ts` | Unified names, 2.0-compatible email assets/templates, inspect results and report delivery outcome |
| `app/api/assessments/route.ts` | Only if separately approved: free-email naming/integration contract or response-latency work |
| `app/api/stripe/webhook/route.ts` | Separately approved fulfilment retry/idempotency work |
| `lib/premiumPurchaseDb.ts` | Separately approved delivery-state/repeat-purchase support, if required |
| `app/api/stripe/checkout/route.ts` | Separately approved existing-purchase safeguard/configuration validation |
| `app/money-ready-plan/success/page.tsx` | Delivery instructions, recovery options and single-H1 composition |
| `app/checkout/money-ready-plan/page.tsx` | Consistent naming, samples/deliverables and earlier mobile CTA |
| `app/api/money-ready-plan/pdf/route.ts` | Regression-test access and content parity; no change needed solely for rebranding PDF internals |
| `app/quiz/page.tsx` | Only separately approved free/paid promise clarification; preserve registration fields/validation/consent semantics |
| `public/brand/v2/` | Preserve approved SVGs; create email/PDF-compatible derivative assets only if needed |

`lib/quizScoring.ts`, `data/quizQuestions.ts`, calculator logic and Stripe pricing must remain untouched by the aesthetic work. Protect existing assessment payloads, consent handling, analytics meanings and downloads with regression tests.

## Approval Needed

Approve the free/paid naming contract and results structure first. Then approve a separate fulfilment-safety scope. No implementation has begun; Phase 3C remains at audit stage.
