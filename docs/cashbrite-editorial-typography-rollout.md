# Approved editorial typography rollout

## Applied rules

- Approved SVG logos remain untouched.
- DM Serif Display regular is loaded by next/font in the root layout and
  exposed as font-editorial. Explicit editorial-heading classes opt in H1s
  and selected H2s; there is no blanket serif rule for every heading.
- Homepage, quiz introduction, calculators, resources, shared student/school/
  contact introductions, legal titles and purchase/recovery introductions use
  serif H1s. Homepage editorial H2s, resource sections, calculator CTA,
  results offer and premium report chapter titles use selected serif headings.
- Result-band headings, calculator input/result headings, quiz legends,
  small cards, H3s and navigation retain Manrope. Numerical displays and score
  labels explicitly use Manrope; numeric outputs use tabular figures.
- Body copy, buttons, forms, consent text and ordinary labels remain Inter.
- DM Serif Display uses genuine regular weight, without synthetic semibold.
- The brand preview presents serif as the primary direction, with Option B
  explicitly approved and Option A retained as the previous system.

## Visual rhythm

Existing 20px/32px page gutters and 48px/64px marketing section tokens remain.
Completed gutter alignment for premium workbook, download/success and checkout
error-state wrappers. Access-error pages now use the shared section spacing
instead of a fixed 80px on mobile. Purposeful 768px reading, 1024px workflow,
1152px results and 1280px marketing widths remain. The homepage keeps its
content-led mobile height and 72vh desktop minimum; no fixed-height text boxes.
Report sheet padding and cover height remain intentional for the workbook.

## Files changed in this rollout

- app/layout.tsx
- app/globals.css
- tailwind.config.ts
- components/SectionHeader.tsx
- components/StudentBudgetCalculator.tsx
- app/page.tsx
- app/quiz/page.tsx
- app/results/page.tsx
- app/calculators/page.tsx
- app/student-budget-calculator/page.tsx
- app/resources/page.tsx
- app/privacy-policy/page.tsx
- app/terms-and-conditions/page.tsx
- app/financial-disclaimer/page.tsx
- app/checkout/money-ready-plan/page.tsx
- app/money-ready-plan/success/page.tsx
- app/premium-plan-preview/page.tsx
- app/brand-preview/page.tsx
- app/brand-preview/preview.module.css
- docs/cashbrite-editorial-typography-rollout.md

Students, schools and contact inherit serif H1s through SectionHeader without
additional route-specific edits. Existing page copy and all business logic are
preserved. No approved logo files, brand colours, routes, analytics, email or
PDF generation files are modified.

## Remaining scope and verification limits

Dense results, school and resources layouts still await Phase 3 redesign.
Small product headings intentionally differ from editorial titles. PDF and
email typography remain unchanged under the preservation requirement.
Real assessment/purchase states require authorised data and confirmed payment;
route QA uses missing-access states and the premium demo. No live purchase,
email send or customer-data submission is performed. Google Fonts downloads
require network access for a cold build.

## QA outcome

ESLint, TypeScript and production build pass. Browser checks cover 16 routes
at 1440px and 390px without horizontal overflow. Final computed-font checks
confirm DM Serif Display 400 for home/quiz editorial H1s and Manrope for
calculator result numerals. The approved Option B label is present in the
preview. Homepage quiz navigation works at both widths. Final screenshots
were reviewed with fonts loaded and the founder photograph fully loaded.
No business logic, page copy or route changes are introduced.
