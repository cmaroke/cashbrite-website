# Cashbrite 2.0 — Two Homepage Design Studies

Date: 11 November 2026. **Local experiments only; the approved homepage and all existing implementation are unchanged.** Verified private baseline: `docs/cashbrite-2-baseline-protection.md`.

## View the Concepts

| | Local URL | Desktop | Mobile |
|---|---|---|---|
| A — The Cashbrite Score | http://localhost:3020/concept-a | `prototypes/homepage-concepts/screenshots/concept-a-1440.png` | `prototypes/homepage-concepts/screenshots/concept-a-390.png` |
| B — Real Life, Real Money | http://localhost:3020/concept-b | `prototypes/homepage-concepts/screenshots/concept-b-1440.png` | `prototypes/homepage-concepts/screenshots/concept-b-390.png` |

Tablet screenshots at 768px are alongside them. The approved homepage remains http://localhost:3012/.

## Concept A: Start with Self-Knowledge

**Headline: “How money confident are you?”**

A direct consumer-product proposition. The ink hero is deliberately type-led: a large editorial question sits opposite an oversized lime 72/100, report rules and short example strengths/priorities. This is an unframed product composition, not a generic app dashboard or a fake personalised result. Score, band and topic examples are explicitly illustrative and educational.

The next section turns to lime for a numbered free-assessment journey; a white report spread explains what the free Snapshot contains. The optional £19 plan is a separate cream editorial spread, followed by free tools, schools, real founder credibility and a final assessment CTA.

**Why it could work:** fastest route to understanding the core free product; strong recognition and visual continuity with the approved results experience. It is the more product-led of the two and the shorter page.

**Trade-off:** the dark first screen and very large type are intentionally a departure from the existing restrained homepage. Review whether the question/score feels exciting rather than intimidating to newcomers; no conversion improvement is assumed.

## Concept B: Start with a Recognisable Decision

**Headline: “Money decisions don't come with instructions.”**

A cream editorial hero introduces an original flat budget allocation graphic, not a payslip. Fictional £900 monthly income is assigned to £520 essentials, £180 everyday spending, £100 saving and £100 buffer: **£900 allocated in total**. Segment widths match those amounts, apart from separator strokes. No tax, return, affordability or future-outcome claim is made; the split is explicitly not a recommendation.

The money-moments section becomes an editorial atlas: linked, numbered decisions rather than six rounded cards. Desktop uses a ruled three-column index, tablet two columns, and mobile a connected vertical reading path. No mandated life/career order is claimed. Existing routes supply every destination: Resources, Students, Budget Calculator and Quiz. Borrowing/renting links explicitly go to quiz knowledge checks, not nonexistent guides.

A mist section explains the free Snapshot, followed by an optional sage-based £19 plan spread, real tools/resources, lime schools band, founder and final CTA.

**Why it could work:** gives a cold visitor an immediate real-life reason to care, with a broader school-leaver/young-adult story before asking for an assessment.

**Trade-off:** longer than A because six money moments need room. Mobile keeps primary assessment access early, but visitors scroll further for the paid offer. The SVG's smallest labels are illustration details; the accessible description and readable caption also state the amounts and meaning.

## Differences to Decide Between

| Decision | Concept A | Concept B |
|---|---|---|
| First impression | Personal score / curiosity | Recognisable money decision / relevance |
| First-screen palette | Ink, cream typography, lime score | Cream, ink typography, lime allocation graphic |
| Main visual | Illustrative report typography | Original SVG monthly-allocation illustration |
| Narrative | Discover -> understand -> choose | Life moments -> learn -> practise |
| Journey presentation | Numbered lime assessment sequence | Ruled milestone atlas, connected on mobile |
| Commercial role | Product explained sooner | Product grounded in everyday life first |
| Longer-term flexibility | Strong assessment-led brand | Broader education/resource brand story |

Both preserve approved lowercase wordmarks, serif/Manrope/Inter typography, lime primary CTAs and current navigation order. Both show the official Cashbrite Money Confidence Snapshot and Cashbrite Personalised Money Action Plan names; £19 one-off/no subscription, no future price or urgency. Inclusions map to existing three chapters, fifteen actions, roadmap, examples, prompts/checklists, printable tracker, PDF, online report and companion spreadsheet.

## Founder and Mobile Treatment

Only the existing verified founder photograph and professional background are used. Following the founder addendum, both concepts now use a substantial rectangular editorial portrait and the same balanced two-column desktop composition. The JPEG itself is an exact copy, not edited. On mobile the portrait becomes a 350px-wide, 250px-high crop above a concise biography and two-column value points, not a thumbnail or a long biography disclosure.

At 390px, both CTAs appear in the first screen (under approximately 650px from page top in an 844px viewport). A puts its score below the introductory decision; B puts its budget illustration below its two CTAs. Neither shrinks a desktop multi-column layout into unreadable columns. The native menu works without JavaScript. Mobile milestone links remain one connected vertical path, with no horizontal scrolling.

No gradients, animation, stock photos, testimonials, partnerships, invented statistics, fake transactions or obsolete sparkles. A small ink mix on sage text backgrounds protects contrast for white small copy; lime remains restrained to meaning/CTAs and intentional colour-block sections.

## QA and Technical Limits

- Both concepts inspected at **1440px, 768px and 390px**. All CSS, three fonts, logo variants, favicon and photo loaded successfully; zero missing-asset responses, request failures, browser console errors or horizontal overflow.
- Full-page screenshots taken after font readiness, image decoding and instant scroll reset to zero. Screenshots were visually inspected; unstyled output was not accepted.
- Keyboard menu opening/closing, original navigation order and visible CTA focus tested. Main actions are at least 49px high. Reduced-motion preferences remove smooth scrolling/transitions.
- The preview server serves only allowlisted files on loopback, with noindex, no-referrer, script/connect/form restrictions. No environment/config files or customer records are in the prototype files. No production route, API or analytics change.
- CTAs are real links to existing local app entry points on port 3012. They do not submit registration, launch Checkout or claim purchase completion in the prototype. The SVG is a static educational illustration, not a new calculator.
- Relevant existing quiz, results, product messaging and purchase-reliability tests passed. TypeScript no-emit and prototype script ESLint passed. No project dependency changes or Next.js rebuild: this protects the original running site's build assets from the previously observed stale-build problem.
- Original file/hash/index comparison passed: **zero original changes/missing files or unexpected additions**. Full verification details and exact inventory are in the baseline protection document/private backup.
- Not a full screen-reader certification or Safari/Firefox compatibility sign-off. Fixed illustration figures and local URLs are intentional prototype limits. Mobile page length and how both directions feel to real 16–30-year-olds still need design judgement/user feedback, not assumed conversion claims.

Reference was reviewed only for high-level editorial contrast and product storytelling: [Wealthbrite homepage](https://wealthbrite.co.uk/). Its layout, payslip, financial calculations, annotations, wording, partnerships and career timeline were not reused. Cashbrite's score composition, budget graphic, product copy and milestone treatment were created for this brief.

## Exact Additions

No existing application file modified. New files only:

- `prototypes/homepage-concepts/concept-a.html`, `concept-a.css`
- `prototypes/homepage-concepts/concept-b.html`, `concept-b.css`
- `prototypes/homepage-concepts/shared.css`, `partials.mjs`, `server.mjs`, `README.md`
- Seven copied public/font assets under `prototypes/homepage-concepts/assets/` (listed in baseline document)
- Six full-page PNGs under `prototypes/homepage-concepts/screenshots/`
- Six additional section-only founder PNGs, `founder-{a,b}-{1440,768,390}.png`, added with the founder addendum
- `prototypes/homepage-concepts/qa-results.json`
- `docs/cashbrite-2-baseline-protection.md`
- `docs/cashbrite-homepage-concepts-review.md`

Restart preview if needed: `node prototypes/homepage-concepts/server.mjs`. No build or install needed. No private backend access, paid service, hosting registration, commit, push or deployment. No Phase 3C.4/3C.5 work begun.

**Await a choice of direction or specific feedback. Neither concept has been applied to the real homepage.**

## Founder Addendum — 11 November 2026

Both concepts now share the requested headline: **“Financial confidence shouldn't begin with your first financial mistake.”** The same portrait size, biography and four-point layout make comparison fair, while retaining each concept's existing white/cream section background.

The authentic source photograph is **3024 × 3024px**. Desktop image frame is approximately 545 × 681 CSS px, with modest CSS cropping; even a 2x desktop render is below the available source resolution. Mobile uses a shorter rectangular crop, approximately 350 × 250px. No pixel upscaling, replacement image or raster edit was needed. The earlier 1600px HTML dimensions were corrected to the actual source dimensions; source and copied JPEG bytes remain unchanged.

Claim checks:

| Published point | Evidence |
|---|---|
| Banking experience | Existing approved founder bio in `app/page.tsx`; professional background also stated on Schools |
| Practical learning | Existing school-page real-life examples/activities and actual Action Plan examples/actions |
| Built for young adults | Existing Students page/metadata and Cashbrite's stated audience |
| Education, not product advice | `app/financial-disclaimer/page.tsx` explicitly identifies educational/informational purposes, not financial product recommendations |

**“Independent financial education” was not published as a commercial independence claim:** existing content does not establish affiliations, commissions or commercial independence. Owner confirmation is needed before making that claim. The accurate fourth point above is used instead; being unregulated alone would not prove independence.

Changed for this addendum only: `prototypes/homepage-concepts/partials.mjs`, `shared.css`, `README.md`, this review, `qa-results.json`, and refreshed/generated prototype screenshots. No production-facing file modified. ESLint passed. Both concepts passed 1440/768/390px browser checks: three fonts loaded, all assets successful, no console/request errors or overflow, four founder points present and substantial portrait on each. Full-page and section screenshots were refreshed and inspected. No Next.js build, dependency changes, API calls, emails, payments or deployment.

Preservation check against the protected baseline: **zero application-file changes or missing application files; Git HEAD and staged index unchanged**. The original all-files checker encountered six historical `.git/refs/codex/turn-diffs/` entries no longer present; a full comparison recorded these separately from application files. No automatic restoration or metadata cleanup was attempted. The private baseline backup remains unchanged.
