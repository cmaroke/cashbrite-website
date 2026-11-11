# Cashbrite 2.0: Phase 2 review

## Scope

Shared brand foundations and homepage redesign. No commit or deployment.
Approved SVG artwork remains unchanged. Original site icons are backed up in
`public/brand/v2/backup-site-icons/`.

## Foundations

Manrope headings/navigation and Inter body/forms are loaded with next/font.
Ink, sage, lime, cream, mist and white are available as design tokens.
Legacy navy/mint/sea names remain for compatibility: navy maps to ink, mint
to lime, and sea to a darker sage text tone (#3D604F) for readable small text.
Shared buttons, cards and form controls use restrained radii and weights.
Logo containers have explicit responsive widths to prevent flex collapse.
Global CSS does not override route grids, positioning, or spacing utilities.

The new identity reaches all routes through the root layout and shared tokens.
Public pages with embedded old brand images now use approved v2 assets.
SEO titles, descriptions, canonicals, structured-data content and routes remain;
only shared logo/social image and favicon references change for the rebrand.

## Homepage

Editorial hero with the requested headline, supporting copy and two real links.
Illustrative 72/100 score uses the current Building Money Confidence band.
Numbered process columns replace feature cards. Tools link to existing routes.
Schools have a concise ink section. Founder photograph and factual banking
background remain, with a quieter biography and pull quote. Final quiz CTA.
The previous future Index teaser is omitted from this focused homepage layout.

## Phase 3 priorities

| Priority | Route | Layout work still needed |
| --- | --- | --- |
| 1 | /quiz | Reduce repeated onboarding panels; clarify intro/form hierarchy without changing consent or validation. |
| 1 | /results | Simplify nested surfaces and repeated sales content; retain score/priorities and existing checkout component. Review with a real authorised assessment. |
| 1 | /checkout/money-ready-plan | Match the results offer layout; verify customer-specific recovery content in test mode. |
| 1 | /money-ready-plan/success | Align download hierarchy with the new editorial report presentation. Requires confirmed test payment to review full access state. |
| 2 | /schools | Replace repeated information cards with an editorial workshop overview and enquiry column. |
| 2 | /resources | Simplify oversized PDF mockup and repeated coming-soon cards. |
| 2 | /calculators | Make tool inputs/results more compact; reduce nested cards. |
| 2 | /student-budget-calculator | Align standalone calculator spacing with tools hub; preserve formulas. |
| 2 | /students | Replace repeated benefit cards with a clearer route from assessment to tools. |
| 3 | /contact | Reduce introductory panel weight; preserve functional form and feedback. |
| 3 | /premium-plan-preview | Harmonise workbook web/print spacing and legacy coloured surfaces. Demo is reviewable; real access remains protected. |
| 3 | Legal routes | Move from article cards to readable document sections. No legal copy changes. |
| 3 | /brand-preview | Retain as the noindex internal reference, outside navigation and sitemap. |

## Files changed in this stage

- app/page.tsx
- app/layout.tsx
- app/globals.css
- app/icon.png, app/apple-icon.png, app/favicon.ico
- tailwind.config.ts
- components/Logo.tsx, ButtonLink.tsx, InfoCard.tsx
- components/ContactForm.tsx, PremiumPlanCtas.tsx, PremiumPlanPrintControls.tsx
- components/StudentBudgetCalculator.tsx
- app/quiz/page.tsx, app/results/page.tsx, app/calculators/page.tsx
- app/student-budget-calculator/page.tsx, app/resources/page.tsx
- app/schools/page.tsx, app/privacy-policy/page.tsx
- app/terms-and-conditions/page.tsx, app/financial-disclaimer/page.tsx
- app/checkout/money-ready-plan/page.tsx
- app/money-ready-plan/success/page.tsx, app/premium-plan-preview/page.tsx
- lib/seo.tsx (shared preview artwork reference only)
- public/brand/v2/social.png (new)
- public/brand/v2/backup-site-icons/ (three original icons)
- docs/cashbrite-2-phase-2-review.md (this report)

Supporting-page edits are visual class/asset changes. Questions, score calculations,
registration fields/consents, API routes, database, email templates, PDFs,
calculator formulas and analytics implementations are untouched.

## QA and limitations

ESLint, TypeScript, production build and scoring sanity checks pass.
Production browser checks cover 16 routes at 1440px and 390px, including demo
premium content and protected-route error states. No horizontal page overflow.
Navigation and calculator input are exercised without writing customer data.
Real assessment retrieval, purchase, email delivery and PDF delivery have not
been exercised end-to-end; they require authorised service/test data.
Google Fonts requires network access on a cold production build.
Existing generated PDFs and email branding are intentionally unchanged and need
a separately scoped future brand pass; their generation/delivery logic is preserved.
