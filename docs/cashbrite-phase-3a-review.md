# Cashbrite 2.0 — Phase 3A local review

## Scope

Aesthetic refinement only, with the explicitly authorised mobile navigation and
checkout-error visibility fixes. No commit, deployment, or Phase 3B/3C work.
Approved SVGs, fonts, palette, questions, order, scoring, consent/registration
requirements, API/data integrations, Stripe session creation, analytics,
calculator formulas, email delivery and PDF generation remain intact.

## Route changes

| Route | Refinement |
| --- | --- |
| / | Preserved structure and copy; balanced hero gap/score padding, calmer shadows, lime primary actions, mist final CTA band; founder photograph preserved. |
| /quiz registration | Removed decorative intro card; benefits and reassurance now compact text rows; retained every field/consent; lighter form frame and lime start CTA. |
| /quiz assessment | Retained one continuous assessment, questions/order/answer state; clearer answer selected/focus states; Manrope question legends; semantic per-question fieldsets; accessible progress values and lime progress fill. |
| /results | Retained score, priorities, offer, price and feature content; cream editorial offer replaces repeated ink panels; deliverable rows, compact mobile preview, no obsolete sparkles; checkout errors visible. |
| /calculators | Existing working calculator remains first; unavailable tools now understated divider-led items; shared calculator visual improvements. |
| /student-budget-calculator | Inherits refined calculator controls/output and shared branding without route-specific content changes. |
| /students | Benefit content uses editorial rules; assessment/tool sections unframed; original copy and routes retained. |
| /schools | Removed repeated filled credibility/benefit cards; lighter workshop overview, section rules and enquiry introduction; all factual information preserved. |
| /resources | Working resource remains prominent; unavailable resources reduced to compact editorial columns; reduced mockup effects; dark-background marks corrected; redundant decorative marks removed. |
| /contact | Lighter functional form, stronger input boundaries and lime submit; removed the outdated first-version reference. |
| Legal routes | Section dividers replace repeated floating article cards; all legal content preserved. |
| /checkout/money-ready-plan | Shared shadows, controls and contrast refinements; pricing/session/recovery logic unchanged. |
| /money-ready-plan/success | Shared typography and controls retained; quieter access-error surface; entitlements/download behaviour unchanged. |
| /premium-plan-preview | Quieter shadows, mist background, corrected dark-surface monograms and more compact mobile cover; workbook content and generated PDFs unchanged. |
| /brand-preview | Existing approved specimens retained; inherits shared navigation, controls and focus treatment. |

## Shared components and accessibility

Primary ButtonLink actions now use lime/ink; secondary links stay outlined.
InfoCard is now a divider-led editorial article rather than a filled card.
Contact forms remain framed, with subtle borders and reduced shadow.
Calculator controls/results remain framed where useful, with one redundant
output wrapper removed. No calculated values or conditions change.

MobileNavigation uses native details/summary below 1024px, with 44px toggle and
48px links. All seven existing routes are visible when expanded. Native Enter/
Space operation, Escape-to-close with focus return, current-page indication and
link-click closure are supported. Desktop navigation remains at larger widths.
Footer links have 44px minimum targets. Focus outlines include a white ring so
they remain distinguishable on dark surfaces. Reduced-motion users receive
immediate rather than global smooth scrolling. Input boundaries and muted text
contrast are strengthened. Existing alpha utilities now have explicit Tailwind
definitions so their intended styles resolve consistently.

## Checkout finding and resolution

The results wrapper's `[&_p]:hidden` hid the paragraph that also carries checkout
errors. Removed it. UnlockPlanButton has a presentation-only showReassurance prop:
the results page suppresses redundant default reassurance, while errors always
render with role=alert and aria-live. Fetch/session creation, redirect, disabled
state and error state handling are unchanged. An isolated fixture using the real
component confirms that an error remains visible with reassurance disabled.

## Exact files changed in Phase 3A

- app/layout.tsx
- app/globals.css
- tailwind.config.ts
- components/MobileNavigation.tsx (new)
- components/ButtonLink.tsx
- components/InfoCard.tsx
- components/ContactForm.tsx
- components/PremiumPlanCtas.tsx
- components/StudentBudgetCalculator.tsx
- app/page.tsx
- app/quiz/page.tsx
- app/results/page.tsx
- app/calculators/page.tsx
- app/students/page.tsx
- app/schools/page.tsx
- app/resources/page.tsx
- app/contact/page.tsx
- app/privacy-policy/page.tsx
- app/terms-and-conditions/page.tsx
- app/financial-disclaimer/page.tsx
- app/checkout/money-ready-plan/page.tsx
- app/money-ready-plan/success/page.tsx
- app/premium-plan-preview/page.tsx
- docs/cashbrite-phase-3a-review.md (new)

## QA and local review

ESLint, TypeScript, production build and scoring sanity check pass.
Production browser checks cover all 16 public page routes at 1440px and 390px:
HTTP 200, no horizontal overflow and no missing image assets. Active assessment
checks confirm 30 questions, progress updates and checked-answer styling.
Keyboard navigation checks cover mobile and tablet (390px/768px). Native required
form validation is preserved. Checkout error visibility is checked in isolation
using the real component with simulated error state, not a real payment.
The actual results component is rendered with the existing demo data in an
isolated visual fixture; no Neon records are accessed/created for that check.
Contact success and failure feedback are also verified with browser-intercepted
responses at both widths, without sending an enquiry. Form-control boundaries
use a stronger ink alpha and the progress track contrasts with its lime fill.

Local review: http://localhost:3012/
Representative screenshots are in /tmp/cashbrite-3a-*.png, including homepage,
registration, active quiz, resources, schools, menus, checkout error and demo
results. Temporary QA scripts stay outside the repository.

## Remaining limits

The assessment is still a continuous 30-question document, intentionally.
Registration still includes all existing details and consent text. Schools and
premium reports retain substantial content; no factual claims were discarded
to shorten them. Live paid entitlements, customer-specific recovery, Resend
delivery and generated PDFs are not exercised end to end. Those implementations
are untouched. No blanket accessibility certification is implied by these
visual/keyboard checks. Product naming and deeper conversion journey changes
remain outside this aesthetic phase.
