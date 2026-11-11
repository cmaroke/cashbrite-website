# Typography and spacing refinement

## Approval boundary

DM Serif Display is imported only by /brand-preview. Existing public headings
remain Manrope. Approved SVGs, colours, existing page copy, SEO and functionality
are unchanged. Preview specimen copy is demonstration material only.

## Proposed typography rules (not rolled out)

| Application | Proposed treatment |
| --- | --- |
| Logo | Approved outlined SVG; never recreated as web text |
| Hero H1 | DM Serif Display regular; 40–52px desktop, 32–36px mobile; 1.15–1.2 line height |
| Standard page H1 | DM Serif Display regular; 40–48px desktop, 32–36px mobile |
| Major editorial H2 | Selective DM Serif Display regular; 28–36px; explanatory/marketing sections only |
| Product headings, quiz prompts, card titles | Manrope medium/semibold; 18–24px |
| Navigation | Manrope medium/semibold; 14–16px |
| Body | Inter regular; 16–18px; 1.65–1.8 line height |
| Buttons, labels, forms | Inter medium; 14–16px; minimum 44px primary control height |
| Scores, charts, numerical displays | Manrope medium/semibold with tabular figures where appropriate |

DM Serif Display has only regular weight for this treatment: do not synthesize
semibold. Leave dense workflow headings in Manrope even if editorial serif H1s
are approved. The comparison keeps body, questions and numerals identical.
Desktop comparisons align corresponding examples; mobile stacks A then B.

## Spacing findings and corrections

- Marketing gutters varied between 16/24/32px and 20/32px. Standardised the
  reviewed page wrappers and header/footer to 20px mobile and 32px larger screens.
- Marketing section padding varied across 56/72/80px and 64/80px. Introduced
  section-space: 48px mobile and 64px desktop; applied to homepage bands,
  students, schools, contact, resources, legal pages and the calculator CTA.
- Homepage hero required at least 85vh desktop. Reduced to 72vh and reduced
  mobile top/bottom padding from 64px to 48px. Content still sets the minimum
  required height; nothing is clipped to a fixed viewport size.
- Hero CTA gap reduced from 36px to the 24px content/action token.
- Quiz entry top padding reduced from 40/56px to 32/40px; intro panel reduced
  from 24/32px to 20/24px, preserving the existing fields and consent layout.
- Standalone calculator top spacing reduced from 40/48/56px to 32/40px.
- Resource feature-card desktop padding reduced from 48px to 32px, and the
  calculator signpost bottom gap reduced from 48px to 32px.
- Shared InfoCard padding is now 20px mobile / 24px desktop. Calculator panels
  already follow this scale and were preserved.
- Shared SectionHeader uses an explicit 16px heading-to-copy token.
- Existing py-18 references had no Tailwind spacing definition; 72px is now
  defined explicitly rather than silently missing from the generated stylesheet.

## Container rules

| Token | Width | Purpose |
| --- | --- | --- |
| site | 1280px | Marketing and tool layouts |
| workflow | 1024px | Quiz/onboarding |
| report | 1152px | Free results and recovery checkout |
| reading | 768px | Long-form copy within wider layouts |

Narrower legal/report/empty-state containers remain intentional. Content widths
are not forced into a single grid. New site-container and section-space classes
provide opt-in shared foundations without descendant selector overrides.

## Route audit and remaining work

| Route | Review outcome |
| --- | --- |
| / | Shorter hero, consistent section rhythm and CTA spacing; Manrope retained |
| /quiz | More compact intro; fields/consents and question navigation untouched |
| /results | Consistent gutters and explicit report width; dense offer/score surfaces remain Phase 3 work |
| /calculators | Aligned gutters; compact tools-first spacing retained |
| /student-budget-calculator | Reduced intro gap; aligned gutters; existing calculator panels retained |
| /resources | Reduced oversized padding; consistent sections and gutters |
| /students | Consistent outer sections/gutters; repeated cards remain Phase 3 work |
| /schools | Consistent outer sections/gutters; enquiry grid preserved |
| /contact | Consistent outer sections/gutters; functional form preserved |
| Legal pages | Consistent outer sections/gutters; reading width and content unchanged |
| /checkout/money-ready-plan | Consistent report width/gutters; personalised recovery state requires authorised assessment data |
| /money-ready-plan/success | Reviewed; narrow access-error state and download strip remain intentional |
| /premium-plan-preview | Reviewed in demo mode; larger workbook cover and print sheet padding intentionally retained |
| /brand-preview | Added A/B typography comparison; all approved identity specimens retained |

Some older pages still use tighter 12px heading-to-copy gaps inside compact
cards and wider introductory text sizes. Resolve those with their Phase 3 layout
work rather than applying broad descendant overrides now. Existing score and
price numerals are not all explicitly Manrope yet; proposed type rules above
remain subject to approval. Paid PDF layouts are outside this web refinement.

## Files changed in this refinement

- app/brand-preview/page.tsx
- app/brand-preview/preview.module.css
- app/globals.css
- tailwind.config.ts
- app/layout.tsx
- components/InfoCard.tsx
- components/SectionHeader.tsx
- app/page.tsx
- app/quiz/page.tsx
- app/results/page.tsx
- app/calculators/page.tsx
- app/student-budget-calculator/page.tsx
- app/resources/page.tsx
- app/students/page.tsx
- app/schools/page.tsx
- app/contact/page.tsx
- app/privacy-policy/page.tsx
- app/terms-and-conditions/page.tsx
- app/financial-disclaimer/page.tsx
- app/checkout/money-ready-plan/page.tsx
- docs/cashbrite-typography-spacing-review.md

## QA

ESLint, TypeScript and production build pass. Production browser checks cover
16 routes at 1440px and 390px with no page-level horizontal overflow. Comparison
font inspection confirms Manrope 600 versus DM Serif Display 400; quiz H1 stays
Manrope at both widths. Screenshot review covers the comparison and main layouts.
Protected results/purchase routes were reviewed in their access-error states;
premium workbook was reviewed with demo data. No purchase or customer submission
was performed. Cold Google Fonts builds require network access.
