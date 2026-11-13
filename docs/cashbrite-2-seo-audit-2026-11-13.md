# Cashbrite 2.0: comprehensive SEO audit

**Audit date:** 13 November 2026, Europe/London  
**Live website:** https://www.cashbrite.co.uk/  
**Source reviewed:** `f06f3561d8780cc0ccf9769afccef6fda84940b0`, `codex/cashbrite-2-release`  
**Scope:** audit and recommendations only. No application code, settings, database records, consent configuration, integrations or deployed assets changed. No registrations, emails or payments initiated. This document is not a deployment approval.

## 1. Executive summary

Cashbrite has a credible free product and a usable, server-rendered marketing website, but its SEO configuration currently works against its main acquisition journey.

**Fix these before commissioning a large content programme:**

1. **HIGH, verified:** `/quiz` returns `X-Robots-Tag: noindex, nofollow`. It is linked throughout the site and included in the sitemap, but is explicitly excluded from indexing. This is the clearest technical obstacle to organic quiz acquisition.
2. **HIGH, verified:** canonical URLs and sitemap URLs use `https://cashbrite.co.uk`, which redirects to `https://www.cashbrite.co.uk`. The preferred host and the canonical signals disagree. Privacy, Terms and Disclaimer additionally canonicalise to the homepage rather than themselves.
3. **HIGH, verified lab issue:** quiz entry produces a repeatable initial layout shift, particularly on mobile. Observed mobile scores were approximately 0.33-0.37; homepage and calculator probes recorded zero. This deserves a targeted loading-layout fix, not a redesign.
4. **HIGH, growth opportunity:** the useful educational substance is largely inside personalised reports. Public pages mostly introduce products rather than answer financial questions in depth. Publish a small number of excellent, sourced public guides that naturally lead to the quiz.
5. **MEDIUM, verified overlap:** `/calculators` and `/student-budget-calculator` both embed the same complete calculator. They need distinct search purposes and a clear contextual link between them; this is potential overlap, not proof of a Google duplicate-content penalty.

**Overall SEO health:** good product/brand foundations; important indexability and canonical corrections required; limited public topical depth. No redesign, mass article generation, paid analytics upgrade or replacement infrastructure is needed.

No critical personal-data exposure was observed in the unauthenticated checks. Private report routes are noindexed, the report page requires a private link, and PDF/Excel requests without access returned 403. This is not a penetration test or proof about every historical URL.

### What is already strong

- Clear UK audience and a genuinely free 30-question assessment; basic results do not require personal details.
- All 11 sitemap destinations resolve to working pages after the existing host redirect.
- Public acquisition pages have server-delivered H1s and descriptions. The calculator's form labels are also server-rendered; only its calculations require JavaScript.
- One main H1 on each intended indexable page; readable heading structure overall.
- No horizontal overflow found at 390px on the 20 page routes inspected.
- Organization/WebSite JSON-LD, page-specific schemas, social previews, `lang="en-GB"`, robots.txt and sitemap.xml already exist.
- All 16 discovered internal URL checks completed without a 4xx/5xx destination.
- Approved C-monogram icons, meaningful founder alt text and responsive image delivery are present.
- Optional analytics did not load before consent in the observed fresh-browser homepage visit.

## 2. Method, evidence and limitations

### Work completed

- Enumerated all 20 `app/**/page.tsx` routes in the exact release source; fetched and rendered each at 1440px and 390px.
- Checked raw response HTML and hydrated DOM separately: title, description, canonical, HTTP/meta robots, H1-H3, links, alt attributes, JSON-LD and social tags.
- Read robots.txt, sitemap.xml, public checklist headers, unauthorised download responses and a deliberately missing URL. Checked the synthetic `?demo=true` preview separately.
- Checked HTTP/HTTPS, www/non-www, a trailing slash, a campaign-query URL, and the retired checkout redirect without submitting anything.
- Ran six exploratory Chrome performance probes across homepage, quiz and calculator; repeated quiz layout-shift attribution three times.
- Inspected source for metadata inheritance, fonts, report protection, analytics consent/events, calculator duplication and quiz loading.
- Researched current publicly visible UK-oriented search results and directly inspected competitor and official documentation pages.

### Local evidence

Evidence is outside the application source and contains only public pages and synthetic/non-personal observations:

`/Users/cmaroke/Documents/ChatGPT/Cashbrite/docs/seo-audit-2026-11-13/`

| Evidence file | Contents |
|---|---|
| `crawl.json` | All route observations, current descriptions, H1-H3, schemas, social tags, links, image attributes and mobile checks |
| `robots.txt`, `sitemap.xml` | Exact live crawler directives and sitemap at audit time |
| `performance.json` | Device/network methodology, resource sizes, lab timings and PageSpeed quota response |
| `followup.json` | Repeated quiz shift sources, founder image delivery, pre-consent requests and synthetic preview checks |
| `home.html`, route-named `.html` files | Raw public HTML responses; no authenticated report HTML |
| `*-390.png` | Eight public acquisition-page mobile screenshots |

### Evidence labels

- **Verified:** observed in live responses/rendering and/or exact source, with the scope stated.
- **Likely risk:** a plausible consequence that needs Search Console, field data or further testing.
- **Opportunity:** a recommended improvement, not a defect.
- **Not verified:** access or measurement was unavailable.

**Not available:** private Search Console/GA4 data, actual Google-selected canonicals, indexing coverage, backlink inventory, keyword volume/KD subscription, organic conversion attribution or field CrUX data. Search queries were UK-oriented, not a controlled UK Google rank-tracking experiment. No rankings, traffic estimates, growth percentages or conversion uplifts are claimed.

PageSpeed Insights' unauthenticated API returned HTTP 429. No Lighthouse score or field Core Web Vitals pass is reported. Lab probes are described in section 6.

## 3. Page-by-page live audit

All paths below are on `https://www.cashbrite.co.uk`. An absent noindex directive means technically eligible, not confirmed indexed. Canonicals are hints; actual Google selection requires Search Console.

### Intended public/indexable pages

Every row returned HTTP 200, has a description, one H1 and no 390px horizontal overflow. **All emit non-www canonicals.** The legal pages have the additional homepage-canonical error.

| URL | Current title | Current H1 | Canonical emitted | Indexability and purpose |
|---|---|---|---|---|
| `/` | Financial Education for Students and School Leavers | How money confident are you? | `https://cashbrite.co.uk/` | Eligible; brand/audience introduction and quiz acquisition. Keep approved hero wording. |
| `/quiz` | 5-Minute Money Readiness Assessment \| Cashbrite | Discover your Money Confidence Score | `https://cashbrite.co.uk/quiz` | **Excluded by HTTP noindex**; needs narrowly scoped correction. |
| `/calculators` | Money Calculators for Students \| Cashbrite | Money Calculators | `https://cashbrite.co.uk/calculators` | Eligible; hub, but currently duplicates the full budget calculator. |
| `/student-budget-calculator` | Student Budget Calculator UK \| Cashbrite | Student Budget Calculator | `https://cashbrite.co.uk/student-budget-calculator` | Eligible; strongest existing task-specific search landing page. |
| `/resources` | Free Money Resources for Young People \| Cashbrite | Free Money Resources | `https://cashbrite.co.uk/resources` | Eligible; one available checklist plus three clearly labelled future resources. |
| `/students` | Money Skills for Students and Young People \| Cashbrite | Feel clearer about money before the big choices arrive | `https://cashbrite.co.uk/students` | Eligible; mainly introductory copy, not yet a substantial money-skills guide. |
| `/schools` | Financial Education Workshops for Schools and Colleges \| Cashbrite | Practical money education for Year 11, Sixth Form and college students | `https://cashbrite.co.uk/schools` | Eligible; strong audience fit, limited practical procurement/delivery detail. |
| `/contact` | Contact Cashbrite \| Cashbrite | Talk to Cashbrite | `https://cashbrite.co.uk/contact` | Eligible; concise form serves contact intent. Low word count is not itself an SEO defect. |
| `/privacy-policy` | Privacy Policy \| Cashbrite \| Cashbrite | Privacy Policy | **`https://cashbrite.co.uk/`** | No noindex; homepage canonical conflicts with distinct policy content. Duplicated brand suffix. |
| `/terms-and-conditions` | Terms & Conditions \| Cashbrite \| Cashbrite | Terms & Conditions | **`https://cashbrite.co.uk/`** | Same canonical/title-inheritance defects. |
| `/financial-disclaimer` | Financial Education Disclaimer \| Cashbrite \| Cashbrite | Financial Education Disclaimer | **`https://cashbrite.co.uk/`** | Same defects; retain clear educational/not-advice statement. |

### Other page routes and assets

| Route | Actual result | Index/access observation | Recommendation |
|---|---|---|---|
| `/results` | 200; empty-state Snapshot when no local answers | HTTP and meta noindex; robots disallow. No identity/report data in anonymous output. | Keep private-results exclusion. Never make results indexable as part of fixing `/quiz`. |
| `/report` | 200; "Your report link is needed" | HTTP and meta noindex; private/no-store; private access required. | Keep current access controls and noindex. Do not add to sitemap. |
| `/report/access` | 200; private-link exchange UI | HTTP/meta noindex; no-referrer; no credentials supplied during audit. | Keep excluded; do not expose fragment keys in crawl links or analytics. |
| `/money-ready-plan/success` | 200; unverified-link message without a session | HTTP/meta noindex; no-referrer. Historical access remains separate from SEO. | Keep existing route and entitlements; no redirect consolidation that breaks purchased links. |
| `/checkout/money-ready-plan` | **307 to `/quiz`**, then 200 | Old checkout is retired, not a functioning payment landing page. | Preserve retirement. Consider redirect status only if product owners approve; not a priority SEO task. |
| `/premium-plan-preview` | 404 without demo flag | HTTP/meta noindex; no public real report. | Correctly excluded. |
| `/premium-plan-preview?demo=true` | 200, explicitly synthetic demo | HTTP/meta noindex; "Alex" and `.example` identity are fixed demo data. | Keep out of sitemap/navigation; not a data leak. Optional future production-preview cleanup. |
| `/brand-preview` | 200 | Meta noindex; two H1s in demonstration content; not linked from normal public navigation. | Intentional nonindexable design reference. Do not spend launch SEO time fixing its demo heading count. |
| `/brand-preview/assessment-a`, `/brand-preview/assessment-b` | 404 in production | Meta noindex; source permits development only. | Expected, not broken public navigation. |
| `/api/resources/first-paycheck-checklist` | 200 PDF, attachment | HTTP noindex; robots disallows all `/api/`; public download works. | Keep download behaviour. Add an indexable HTML companion guide rather than opening all API URLs to crawlers. |
| `/api/reports/pdf`, `/api/reports/excel` | 403 without grant | HTTP noindex, private/no-store; helpful generic error. | Correct denial. Never expose personalised files for SEO. |
| `/downloads/cashbrite-budget-tracker.xlsx` | 403 without report access | HTTP noindex, private/no-store | Correct protection; no claim that the registered Excel is an anonymous public download. |
| Deliberately nonexistent URL | 404 | Meta noindex | Genuine 404, not a soft-404 response. Low-priority cleanup: inherited homepage canonical/default metadata also appears in the error document. |

### Current metadata descriptions

These are the actual descriptions, not proposed changes. They are generally relevant; missing descriptions are **not** the main problem.

| Page | Current description |
|---|---|
| Home | Cashbrite helps UK young people build money confidence for life after school with a free Money Readiness Assessment, resources and school workshops. |
| Quiz | Take Cashbrite's free 30-question Money Readiness Assessment for UK students and young people to understand your money confidence. |
| Calculators | Free UK money calculators for students, school leavers and young adults. Start with the Student Budget Calculator and build your money confidence. |
| Student Budget Calculator | Use Cashbrite's free Student Budget Calculator to estimate monthly income, rent, bills, spending, savings and money left over. |
| Resources | Free UK money resources from Cashbrite, including practical guides for payslips, budgeting, saving and first paycheck confidence. |
| Students | Simple UK money skills for students, school leavers and young adults covering budgeting, saving, credit, scams and life after school decisions. |
| Schools | Cashbrite provides practical UK money education for Year 11, Sixth Form and college students, covering budgeting, student finance, credit and scams. |
| Contact | Contact Cashbrite about UK financial education workshops, student money confidence resources, partnerships or the Money Readiness Assessment. |
| Privacy | How Cashbrite collects, uses and protects personal information. |
| Terms | The terms that apply when using the Cashbrite website and services. |
| Disclaimer | Important information about Cashbrite's educational content and Money Readiness Assessment. |

## 4. Technical findings

### T1. Public quiz excluded from Search — HIGH, verified

**Evidence:** live `/quiz` header `X-Robots-Tag: noindex, nofollow`; no equivalent robots meta is needed for this to take effect. `next.config.ts` includes `/quiz` in a common private-route header list. `app/quiz/layout.tsx` supplies public metadata and `app/sitemap.ts` includes the same URL.

**Recommendation:** in a separately approved change, remove only the public quiz entry URL's noindex/nofollow directive. Preserve no-store and no-referrer where useful, all private route exclusions, and all question/scoring/registration behaviour. Inspect `/quiz` with Search Console after release. Do not weaken access controls or index personal results.

Google documents both HTTP and HTML robots rules; a page must be crawlable for Google to read a noindex instruction. [Robots meta and HTTP-header guidance](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag).

### T2. Conflicting canonical host — HIGH, verified

**Evidence:** every observed canonical uses non-www; `https://cashbrite.co.uk/` returns 308 to `https://www.cashbrite.co.uk/`. Sitemap locs, OG URLs and schema URLs also use non-www. Internal relative links resolve to www.

**Recommendation:** retain the existing www destination and align canonical base, sitemap locs, robots sitemap address, OG URLs and schema identity URLs to `https://www.cashbrite.co.uk`. Review `lib/seo.tsx` and the public URL configuration under a future approved implementation; no configuration was changed in this audit. Check final rendered output, not just source defaults. Do not switch the live host merely to match an erroneous canonical.

**Risk:** confusing signals and unnecessary redirect hops for discovery; this does not prove Google has selected the wrong host. Google treats redirects, canonical declarations and sitemap inclusion as canonicalisation signals. [Canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).

### T3. Legal metadata inherits homepage identity — MEDIUM, verified

`app/privacy-policy/page.tsx`, `app/terms-and-conditions/page.tsx` and `app/financial-disclaimer/page.tsx` define only title/description, inheriting the root homepage canonical and generic social metadata. Their explicit `| Cashbrite` titles receive the layout suffix a second time.

Give each its own www canonical, a single brand suffix and appropriate page social metadata. Keep them available and linked as trust/support documents. Canonicalising distinct legal policies to the homepage is not a sensible duplication strategy. Their search traffic is not a primary growth target.

### T4. Sitemap works, but its signals need refinement — MEDIUM, verified

- 200 XML response with 11 intended public URLs; no result, report or preview routes included.
- The quiz entry conflicts with its own HTTP noindex.
- All locs use the redirecting host.
- `app/sitemap.ts` assigns `new Date()` to every URL. At audit time every page showed `2026-11-13T10:48:56.747Z`, including the Disclaimer displaying a June update date. This is a build-wide timestamp, not page-specific editorial maintenance.

Use meaningful content-update dates, or omit lastmod until reliable dates exist. Do not invent fresh review dates. Leave priority/changefreq alone or simplify them; they are not levers worth spending time on. Submit the corrected sitemap after approval. [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

### T5. Redirects and errors — mostly sound

| Starting URL | Observed chain | Assessment |
|---|---|---|
| `http://cashbrite.co.uk/` | 308 HTTPS non-www, then 308 HTTPS www, then 200 | Two hops; minor optimisation, not a launch blocker. |
| `http://www.cashbrite.co.uk/` | 308 HTTPS www, then 200 | Correct. |
| `https://cashbrite.co.uk/` | 308 HTTPS www, then 200 | Correct destination; canonical declarations must agree. |
| `/students/` | 308 `/students`, then 200 | Consistent no-trailing-slash routing. |
| `/?utm_source=seo-audit` | 200; clean homepage canonical | Sensible query consolidation, subject to host correction. |
| Old checkout | 307 `/quiz` | Correctly retired; leave historical purchased-access routes alone. |
| Unknown route | 404 and noindex | Correct. |

No redirect loop or failed public navigation was observed. No URL restructuring is recommended for current public pages.

### T6. Private pages: preserve security, distinguish crawling from access

Private routes combine noindex, robots exclusions and actual access checks. The latter are the important protection: robots.txt is not authentication. A disallowed URL can still appear as a URL-only result if discovered elsewhere because the crawler cannot read its noindex. No evidence of such indexing was available here. [Google robots.txt guidance](https://developers.google.com/search/docs/crawling-indexing/robots/intro).

Retain report cookies/private-link checks, no-referrer/no-store headers, hashed grants, private downloads and link sanitisation. Review any historical indexed URLs only through authorised Search Console access; do not put report keys in inspection tools, analytics, this report or removal requests. If real private content is found indexed, treat that as a separate critical privacy incident. Do not broadly open `/api/` or `/report` to make the checklist discoverable.

### T7. Server rendering and heading semantics — good foundations

The marketing H1s, descriptions, navigation and JSON-LD exist in delivered HTML; there is no blanket JavaScript-only marketing-site problem. The quiz delivers its introduction then mounts the assessment; this is acceptable for the interactive experience but leaves limited static search context. Do not index all 30 questions or change their wording for SEO.

The approved homepage's expressive H2s are understandable in context. Keep its H1 and design. `/students` can use a more descriptive heading or a clear money-skills H2 to make its subject explicit; this is a content recommendation, not an H1 keyword-density rule. The brand-preview demo has two H1s, but is intentionally noindex and is not a priority.

### T8. Structured data and social previews — useful, not magic

All observed JSON-LD parsed successfully. Existing types:

| Page group | Current page-specific markup, in addition to shared Organization/WebSite | Recommendation |
|---|---|---|
| Home | WebPage | Keep. Add stable entity `@id` connections and only real, public identity details. |
| Quiz | LearningResource, assessment type | Keep truthful; no score/certification/rating promises. Fix noindex first. |
| Students | LearningResource | Either expand its actual teaching content or describe it as a learning hub/CollectionPage. |
| Schools | Course | Use only if the offered workshop is accurately represented. Service/WebPage may better describe an enquiry-led offering. Do not invent syllabus, dates, accreditation or free pricing. |
| Resources | CollectionPage with checklist LearningResource | Link future HTML guide to its real PDF as an encoding/download; keep future items out of active resource schema until published. |
| Calculator | WebApplication and LearningResource | Appropriate basic semantics; free GBP 0 offer matches the tool. Do not fabricate reviews to chase application stars. |
| Calculators hub | CollectionPage with WebApplication entry | Keep and make its actual content match hub purpose. |
| Contact/legal | Shared types only | Optional ContactPage/WebPage; low priority. |

`sameAs: []` is not an error; add profiles only when genuine. Use a public author page and a real editorial policy before adding detailed Person/reviewer claims. Organization markup can clarify brand identity, but cannot establish expertise by itself. [Organization guidance](https://developers.google.com/search/docs/appearance/structured-data/organization).

Do not promise FAQ rich results: Google's documented FAQ eligibility is limited to authoritative government/health sites. HowTo rich results were discontinued; Course Info support was also retired. Normal visible FAQs can still help users. Generic LearningResource markup does not guarantee a rich result. [FAQ/HowTo changes](https://developers.google.com/search/blog/2023/08/howto-faq-changes), [structured-result simplification](https://developers.google.com/search/blog/2025/06/simplifying-search-results).

Public marketing pages have OG and Twitter card data and use the approved social image. The main issues are canonical-host mismatch and generic inherited social data on legal/private utility pages, not missing social tags site-wide. Public/private preview cleanup is lower priority than acquisition pages. No rich-results tool submission with private URLs was performed.

## 5. Internal architecture, content and trust

### Architecture

- Shared navigation/footer expose Home, Quiz, Calculators, Resources, Students, Schools and Contact. Legal documents are linked in the footer. No intended public sitemap page is an orphan.
- The dedicated calculator is linked from Home and Students. **The Calculators hub itself has no contextual link to `/student-budget-calculator`**, despite its schema pointing there; its main page link is the quiz. Add a natural link to the dedicated guide, without adding an unnecessary step before using the existing tool.
- Resources links to the checklist, calculator hub, quiz and Students. This is a good starting hub, but three coming-soon items are not published learning content and cannot rank as guides.
- The calculator page includes two quiz CTAs (one inside the shared tool, one below it). This is not a technical SEO defect; simplify only if user testing shows distraction. It also lacks a direct contextual Students link requested in earlier calculator planning; the shared navigation still provides access.
- Avoid canonicalising the calculator hub to the tool or noindexing one merely because they share a component. Distinguish their purposes: hub = tool discovery; dedicated URL = budgeting explanation, assumptions, example and tool. Keep both usable, with one primary SEO target per query cluster.

### Content assessment

The homepage is a persuasive product introduction, not a financial reference article. Preserve its approved copy. Students has approximately 146 visible main-content words; Schools approximately 224; Resources approximately 220, including future items. These counts are observations, **not minimum-word targets or evidence of a thin-content penalty**. The actual shortfall is unanswered user questions.

Prioritise helpful additions on the dedicated tool, Students and a new first-payslip guide. Explain termly-to-monthly budgeting, irregular income, genuine student costs, and what the quiz does/does not measure. Each guide should answer its query before inviting registration. Do not put all useful education behind the report form, and do not expose personalised reports to solve this gap.

### YMYL and editorial credibility

Financial content can affect important decisions. Google explicitly places greater weight on trust and relevant experience/expertise for these topics. E-E-A-T is not a standalone score or markup switch. [People-first content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).

Recommended editorial standard for every substantive guide:

1. Named public author and a concise verified biography; preserve the founder's approved homepage name and story. Add a linked profile elsewhere only with permission. Do not infer regulated-adviser status from banking experience.
2. Real publication/review dates, a source list and a named reviewer only when someone actually reviewed the material.
3. Scope statements: UK-wide versus England-specific; tax year when using rates; age/eligibility limits; illustrative examples distinguished from typical costs.
4. Primary sources for tax/employment/student finance, with clear escalation to HMRC, payroll, student support or impartial debt help where relevant.
5. No guarantees that a Cashbrite Score predicts borrowing eligibility or financial outcomes. Distinguish the educational score from a credit score.
6. An accessible corrections/contact route and a short editorial policy explaining independence, funding and maintenance. Describe the actual business model; do not assert "no commercial influence" without checking it.

Current legal pages correctly describe the free model and retain historical transaction/access context. Clear not-financial-advice language is already present. Do not remove truthful historical references simply because Stripe is no longer used for new reports.

### UK accuracy and the First Paycheck Checklist

The current PDF is two pages, text-based and branded correctly; it retains the £10 x 52 = £520 and £20 x 52 = £1,040 examples. No calculation defect was observed. It is a checklist, not a complete explanation of tax, National Insurance, pensions or credit eligibility.

For a future HTML companion, use UK search language such as "first payslip" and "first pay cheque" naturally while preserving the approved product title. Explain conditional deductions and age-related context; do not suggest every young worker has every deduction, or that a credit card is appropriate/available to every teenager. Link to [GOV.UK payslip rights](https://www.gov.uk/payslips), [HMRC starter checklist](https://www.gov.uk/guidance/starter-checklist-for-paye) and [Acas payslip guidance](https://www.acas.org.uk/payslips). Clearly distinguish Cashbrite's educational checklist from HMRC's official starter form.

For student-finance content, identify the relevant home nation and start date rather than treating one set of rules as UK-wide. Current [GOV.UK student-finance guidance](https://www.gov.uk/student-finance) separates loan purposes and flags changes for some course starts from January 2027. Any future guide needs a fresh source check before publication; no repayment thresholds are asserted in this audit.

## 6. Performance and mobile usability

### Measured results, not a field ranking claim

Chrome on the local machine loaded production URLs in fresh browser contexts with cache disabled. Mobile: 390x844, 150ms network latency, 1.6Mbps download, 0.75Mbps upload and 4x CPU slowdown. Desktop: 1440x900, unthrottled. One initial probe per route/device; no forms submitted; optional analytics initially off. These are exploratory lab runs, not standard Lighthouse scores or representative real-user percentiles.

| URL | Desktop LCP | Desktop initial CLS | Mobile LCP | Mobile initial CLS | Observation |
|---|---:|---:|---:|---:|---|
| Home | 0.376s | 0.000 | 0.920s | 0.000 | LCP is the H1, not the founder image. |
| Quiz | 0.192s | **0.145** | 0.940s | **0.371** | Fast text paint, but substantial entry/render shift. |
| Student Budget Calculator | 0.212s | 0.000 | 0.888s | 0.000 | LCP is introductory text. |

Follow-up quiz loads reproduced 0.145 desktop and 0.329 twice at 390x900. LayoutShift attribution identified the footer moving from approximately y=144 to y=897 on mobile. Source also has a short "Preparing your assessment..." state with no reserved assessment footprint. This strongly supports an initial rendering/loading-height issue; use a focused DevTools trace to confirm the precise rendering trigger before choosing a fix. Reserve stable layout space or an appropriate skeleton without altering quiz logic, questions or approved composition.

**INP:** not established. A single analytics-rejection click recorded approximately 48ms event duration in each exploratory run. That is not a page-level INP result and says nothing conclusive about a complete 30-question session. Real INP requires appropriate field or representative interaction measurement.

Reference good thresholds are LCP <=2.5s, INP <=200ms and CLS <=0.1 at the 75th percentile of visits. The homepage/calculator lab results do not prove a field CWV pass. [Web Vitals](https://web.dev/articles/vitals), [lab versus field measurements](https://web.dev/articles/lab-and-field-data-differences).

### Resource and loading observations

- Initial observed JavaScript transfer was approximately 146-164 KiB across these probes, including transfer overhead. Different cache/response compression timing can change the number; it is not a build bundle-budget measurement. There is no evidence here of a megabyte-scale initial JS problem.
- Three self-hosted WOFF2 downloads totalled about 89.5 KiB per fresh context. The approved DM Serif Display/Manrope/Inter system uses next/font and does not require Google Fonts network calls in the browser. Do not remove approved typefaces for a speculative SEO gain.
- The founder image was lazy-loaded; after scrolling it used a 384px optimised URL, rendered at 278px, with approximately 15.3 KiB transfer. The large fallback `src` attribute alone is not evidence that a 3840px image was downloaded.
- Logos and decorative monograms use SVG, with appropriate text alternatives or empty alt. No missing alt attributes were observed in the crawl. The text-based hero illustration is DOM content, not an inaccessible image of text.
- Static public responses use revalidation; personalised routes use no-store. The public checklist responds with public caching despite the general API no-store declaration, which is not a personal-data leak because this particular file is public.
- A fresh homepage browser made no GA4/Vercel Analytics request before consent. The crawl blocked off-domain requests as an additional safety measure; the separate pre-consent follow-up did not rely on that block.

### Mobile usability

All 20 page-route render checks at 390px had no horizontal overflow. Acquisition-page screenshots show responsive stacking and readable controls; calculator input text is 16px in the captured DOM. The long calculator form remains a usability research opportunity, not an SEO error. Keep the approved look, retain keyboard access and confirm any CLS fix across mobile Safari as well as Chrome. This audit did not perform a complete mobile Safari or assistive-technology session.

## 7. Page-by-page recommendations

All suggested metadata is for a future approved implementation. Titles below include the rendered brand suffix once. Keep the homepage's approved visible headline and do not change assessment questions. Descriptions are suggestions, not mandatory character quotas; Google can choose different snippets. [Title-link guidance](https://developers.google.com/search/docs/appearance/title-link).

### Titles, descriptions, keywords and H1s

| Page | Primary keyword | Suggested rendered title | Suggested description | H1 recommendation |
|---|---|---|---|---|
| Home | financial education for young adults | Financial Education for Students & School Leavers \| Cashbrite | Free money education for UK students and school leavers. Discover your Cashbrite Score, explore budgeting tools and get your personalised report. | **Keep** "How money confident are you?" |
| Quiz | money confidence quiz | Free Money Confidence Quiz for Students \| Cashbrite | Answer 30 questions in around 5 minutes. See your score without signing up, then register for your full report, PDF and budget tracker. | Keep "Discover your Money Confidence Score"; fix HTTP noindex first. |
| Calculators | money calculators for students | Money Calculators for Students \| Cashbrite | Keep existing description; it accurately introduces the available student tool. | Keep "Money Calculators". |
| Student Budget Calculator | student budget calculator UK | Student Budget Calculator UK \| Cashbrite | Plan monthly income, spending and savings with Cashbrite's free UK student budget calculator. See money remaining and where your budget feels tight. | Keep "Student Budget Calculator". |
| Resources | free financial education resources | Free Financial Education Resources for Students \| Cashbrite | Download Cashbrite's free First Paycheck Checklist and explore practical UK money resources for students, school leavers and young adults. | Keep "Free Money Resources"; use descriptive resource H2s. |
| Students | money management for students | Money Management for Students & School Leavers \| Cashbrite | Learn practical UK money skills for life after school: budgeting, saving, first payslips and credit. Try the free quiz and student budget tools. | Optional future "Practical money skills for students and school leavers", or keep the current H1 and add this as an explicit H2. |
| Schools | financial education workshops for schools | Financial Education Workshops for Schools \| Cashbrite | Practical money workshops for UK schools, sixth forms and colleges. Explore topics, session options and resources, then enquire about your students. | Current H1 is relevant; no urgent change. |
| Contact | contact Cashbrite | Contact Cashbrite \| Cashbrite | Keep existing description. | Keep "Talk to Cashbrite". |
| Privacy | Cashbrite privacy policy | Privacy Policy \| Cashbrite | Keep existing description. | Keep current. |
| Terms | Cashbrite terms and conditions | Terms & Conditions \| Cashbrite | Keep existing description. | Keep current. |
| Disclaimer | Cashbrite financial education disclaimer | Financial Education Disclaimer \| Cashbrite | Keep existing description. | Keep current. |

### Content, headings, links, schema and imagery by page

| Page | Highest-value on-page work | Internal links | Schema and image actions |
|---|---|---|---|
| Home | Keep approved hero/sections. Optional small contextual explanation elsewhere of "educational score, not a credit score"; do not stuff the hero. | Existing quiz, calculator, resources and schools routes are strong. Link new guides from genuinely relevant sections only. | Keep WebPage/Organization/WebSite; align www entity URLs. Keep illustrative score label and current optimised portrait. |
| Quiz | Add concise H2s such as "What your score means" and "What you get without signing up" in a non-disruptive placement if needed. Explain 30 questions, ten topics, free report registration and privacy without changing the flow. | Relevant guide pages should link directly to `/quiz`; no mandatory intermediate landing page. | Keep truthful LearningResource; no Quiz rich-result promise, ratings or private results. No new image needed. |
| Calculators | Clarify hub purpose and distinguish active tool from coming-soon concepts. Avoid duplicating a full explanatory guide here. No immediate removal of the embedded calculator required. | Add a contextual link to the dedicated budgeting guide; keep direct access to the tool. | Keep CollectionPage; list only actually available tools. Decorative icons remain empty-alt. |
| Dedicated calculator | Add H2s "Convert termly money into a monthly budget", "What to include", "Example student budget" and "How these estimates work" below the tool. Explain the near-zero band and savings-rate convention as educational rules, not validated risk predictions. | Link Students, Resources, first-payslip guide and Quiz with descriptive anchors. Avoid duplicate prompts where testing supports simplifying. | Keep WebApplication/LearningResource; accurate example, no invented typical costs. No extra illustration necessary. |
| Resources | Add a short explanation for each genuinely available download. Create an HTML first-payslip companion. Coming-soon items should remain clearly unavailable until real content exists. | Link companion guide to download, Students, calculator and Quiz. | Keep CollectionPage; connect the actual checklist using LearningResource/MediaObject where suitable. Do not open all API routes to indexing. |
| Students | Build a useful starter hub: budget, savings, first pay, borrowing/scams and independent-life decisions, with short actionable explanations and sourced onward links. | Descriptive links to each curated guide, calculator and Quiz. | LearningResource fits substantive teaching; CollectionPage fits a hub. No stock photo or additional alt keywords needed. |
| Schools | Add actual session length/options, delivery location/format, year-group adaptation, learning outcomes and what teachers receive. Add honest FAQs on safeguarding/SEND/accessibility only after confirming the offer. | Link sample learning resource, Quiz, Contact and a future verified facilitator profile. | Review Course versus Service; do not imply accreditation or partnerships. A genuine sample handout is more useful than decorative imagery. |
| Contact | Clarify public contact identity, school-enquiry route and support for accessing an existing report; no unnecessary long SEO article. State response expectations only if operationally true. | Link Schools, privacy and safe report-support guidance, without collecting private links in public. | Optional ContactPage; no fabricated LocalBusiness address. Existing logo alt is adequate. |
| Privacy | Fix self-canonical and single title suffix. Keep free-model/historical-access explanation and analytics disclosure. | Retain support/Contact and analytics preference controls. | WebPage if desired; no new imagery. Legal completeness review is separate from SEO. |
| Terms | Fix metadata inheritance; retain educational/free-service and historical-entitlement context. | Keep policy/disclaimer links; add only if useful. | WebPage if desired; no new imagery. |
| Disclaimer | Fix metadata inheritance. Ensure its visible review date changes only after an actual review; not every deployment. | Contextual links from substantive financial guides and calculator methodology. | WebPage if desired; no image work required. |

## 8. UK keyword opportunities

**No reliable volume or numerical keyword-difficulty data was available. All volumes are intentionally unreported.** Competition below is a qualitative judgement from the sampled results and subject matter, not a tool-derived score. High competition does not mean impossible; it means a new site should target a narrower user need first. Search intent is not validated by volume.

Priority order balances audience fit, current product usefulness and realistic scope, not the old paid-plan model.

| Primary keyword | Supporting terms | Intent | Suggested target | UK audience relevance | Qualitative competition / evidence | Priority |
|---|---|---|---|---|---|---|
| money confidence quiz | money readiness quiz, financial literacy quiz UK | Interactive self-assessment | Existing `/quiz` | School leavers, students, young adults | Established bank/education quizzes appear in samples; narrower confidence positioning is a differentiated opportunity, not proven low KD. | High |
| financial literacy quiz for students | money quiz for young adults, money skills test | Assessment/learning | Same `/quiz`, not a near-duplicate page | Students and teachers | Educational organisations and general quiz sites appear; UK-specific relevance matters. | High |
| student budget calculator UK | budget calculator for students, monthly student budget | Tool | Existing dedicated calculator | University students/apprentices | High; UCAS, MoneyHelper, MSE and Save the Student appear in sampled budgeting results. | High |
| student budget planner | student budget spreadsheet, monthly budget template | Tool/download | Calculator explanation + Resources; disclose report registration for Excel | Students with irregular/termly income | High for broad phrase; existing useful tool provides a starting point. | High |
| first payslip checklist | first pay cheque checklist, first paycheck checklist UK | Practical checklist | Proposed `/resources/first-payslip-checklist` | First jobs, apprentices, part-time workers | High official presence for payslip queries; a youth-friendly checklist is a narrower format opportunity. Do not compete as an HMRC form. | High |
| how to budget a maintenance loan | make student loan last the term, student finance monthly budget | Problem-solving | Proposed student-budgeting guide linked to calculator | University entrants | High broadly; specific term-to-month examples provide useful differentiation. | High |
| budgeting for teenagers UK | teen budget, pocket money budget, part-time job budget | Beginner learning | Proposed `/guides/budgeting-for-teenagers` | Ages 16-18, parents | Sampled results mix UK providers and non-UK guidance; UK-specific examples are an opportunity, not proof of low competition. | High |
| money management for students | student money skills, student finance basics | Learning hub | Expand existing `/students` | Sixth form/university | High broad educational competition; narrow starting-out examples. | High |
| financial education for schools | school money workshops, sixth form financial education | B2B research/enquiry | Existing `/schools` | Teachers, colleges | High; The Money Charity/HSBC/education providers have substantial resources. Compete through concrete offer details. | High |
| financial literacy workshops | PSHE money workshops, college money skills sessions | B2B enquiry | Same `/schools` | Schools/colleges | High; avoid multiple nearly identical service pages until materially distinct offers exist. | High |
| understanding your first payslip | gross pay vs net pay, payslip deductions explained | Explanation | Proposed `/guides/understanding-your-first-payslip` | First jobs and apprentices | High; GOV.UK, Acas, MoneyHelper and LITRG are visible primary/help sources. Differentiate with annotated examples and source links. | High |
| financial education for young adults | personal finance basics UK, financial literacy for students | Broad learning | Home + Students hub; separate page roles | Ages 16-30 | High; bank, charity and Open University resources visible. Not the first standalone generic article to commission. | Medium |
| money management for beginners UK | manage money first job, personal finance for beginners | Beginner guide | Students hub + first-job guide | Young adults | High/broad; better served through real scenarios than a generic glossary. | Medium |
| money skills for school leavers | life after school money skills, money checklist after school | Transition guide | Proposed `/guides/money-skills-for-school-leavers` | Ages 16-18 and parents | Relevant educational courses visible; relative difficulty unquantified. Strong audience fit. | High |
| apprenticeship money management | budgeting on apprentice wages, apprentice first payslip | Transition guide | Proposed apprenticeship guide | Apprentices | Not enough sampled SERP evidence for a difficulty label; validate in Search Console/Keyword Planner before expanding. | Medium |
| income tax and National Insurance explained | why is pay lower, payslip tax and NI | Explanation | Payslip guide first; separate guide only if distinct need emerges | First jobs | High official/payroll competition; requires current tax-year review. | Medium |
| credit scores for beginners UK | first credit score, credit report vs score | Explanation | Proposed beginner credit guide | Ages 18-30; appropriate under-18 education | High; MoneyHelper and established credit providers. Clarify Cashbrite Score is unrelated. | Medium |
| student overdraft explained | arranged overdraft, student bank account borrowing | Explanation | Proposed overdraft guide | University students | High authority/banking competition; useful no-product-recommendation angle. | Medium |
| saving money as a student | student savings habits, small savings goals | Practical guide | Proposed student saving/emergency-buffer guide | Students/early careers | Broad competition likely high; sample-based difficulty not established for every variation. | Medium |
| emergency fund for students | small emergency savings, student financial buffer | Scenario guide | Same savings guide initially | Students/young workers | Difficulty unverified; highly relevant topic for a modest, empathetic worked example. | Medium |
| student finance explained | maintenance vs tuition loan, student support | Explanation | Student-finance guide with country scope | University entrants/parents | High; GOV.UK and established student publishers. Avoid generic UK-wide eligibility claims. | Medium |
| moving out budget checklist UK | first rent costs, deposit bills setup costs | Practical planning | Proposed moving-out guide + eventual real checklist | Young renters | Difficulty unverified; review nation-specific rental rules before publication. | Medium |
| student money resources | free financial education worksheets, money guides for young people | Resource discovery | Existing `/resources` | Students, parents, schools | Broad providers visible; success depends on actual useful published resources. | Medium |
| money confidence | financial confidence, money mindset young adults | Broad/ambiguous | Brand homepage + quiz context | All target audiences | Ambiguous intent; no evidence it is a large or easy acquisition term. Use as positioning, not the entire SEO strategy. | Low as standalone guide |

Search examples supporting this table: [UCAS calculator](https://www.ucas.com/money-and-student-life/money/budgeting/budget-calculator), [MSE student planner](https://www.moneysavingexpert.com/students/student-budgeting-planner/), [HSBC young-adult resources](https://www.hsbc.co.uk/financial-education/young-adults/), [OpenLearn young-adult course](https://www.open.edu/openlearn/money-business/personal-finance/managing-my-money-young-adults/content-section-overview), [MoneyHelper payslips](https://www.moneyhelper.org.uk/en/work/employment/understanding-your-payslip), [The Money Charity schools offering](https://themoneycharity.org.uk/our-work-with-children-and-young-people/secondary-schools-and-colleges/).

Do not target all of these with separate pages immediately. Map synonyms to one strong page; expand only when Search Console and user questions show a genuine separate need.

## 9. Content gaps: a small, differentiated publishing programme

Proposed routes are recommendations, **not existing pages or implemented functionality**. Editorial outlines must be verified against current UK primary sources before publication.

| Proposed page/title and primary keyword | Intent and outline | Why relevant / distinctive | Natural quiz connection | Priority |
|---|---|---|---|---|
| `/resources/first-payslip-checklist` — First Payslip Checklist for Your First Job; **first payslip checklist** | Public HTML version/companion: before payday, gross/net, conditional deductions, what to check, questions for payroll, existing PDF download. | Converts an existing useful asset into accessible search content; UK wording and links distinguish it from HMRC's starter form. | "Your first payday is one money milestone. Explore your wider money confidence." | High; first new page |
| `/guides/student-budgeting` — How to Make Your Student Money Last the Term; **how to budget a maintenance loan** | Convert an illustrative termly amount into monthly/weekly limits; irregular job income; rent already due; small contingency; link live calculator. | Solves a specific student problem rather than repeating "track your spending". Example totals must balance and be labelled illustrative. | Quiz invitation after practical example, not before the answer. | High |
| `/guides/budgeting-for-teenagers` — A Realistic First Budget for Teenagers; **budgeting for teenagers UK** | Pocket money/part-time income, spending/saving, irregular costs, optional family discussion and a small worked example. | Covers school/college lives without assuming rent, full-time wages or high spare income. | Budgeting is one of the quiz's ten topics. | High |
| `/guides/understanding-your-first-payslip` — Understand Your First Payslip; **understanding your first payslip** | An original annotated example; gross/net; conditional tax/NI/pension; rates via current sources; resolving a query. | Clear student/apprentice context and trustworthy source attribution. Distinguish detailed explanation from the short checklist. | Link after the example to assess wider knowledge, not to obtain a tax ruling. | High |
| `/guides/money-skills-for-school-leavers` — Your Money Checklist for Life After School; **money skills for school leavers** | Branch into work/apprenticeship/university; bank account, first pay, costs, scams, support. | Unifies Cashbrite's actual audience without pretending all users attend university. | Main transition CTA to free quiz; show no-sign-up basics honestly. | High |
| `/guides/apprentice-money` — Managing Money on Apprentice Wages; **apprenticeship money management** | Travel/lunch/work costs, variable hours, payslip checks, small saving plan, verified support signposts. | Important audience currently mentioned but not taught in depth. No invented apprentice wage/rate. | Link to calculator, payslip guide and quiz. | Medium |
| `/guides/student-overdrafts` — What a Student Overdraft Really Means; **student overdraft explained** | Borrowing versus own money; arranged/unarranged; limits/charges change; repayment planning; where to ask for help. | Education without bank rankings or affiliate-driven "best account" claims. | Credit/overdraft understanding is one assessment area. | Medium |
| `/guides/credit-scores-for-beginners` — Credit Scores and Credit Reports: A First Guide; **credit scores for beginners UK** | Reports versus scores, lender decisions, common myths, safe information sources; educational examples. | Explicitly separate credit scoring from the Cashbrite educational score; no promise that borrowing improves a score. | Quiz measures learning needs, not borrowing eligibility. | Medium |
| `/guides/student-savings-buffer` — Building a Small Savings Buffer as a Student; **emergency fund for students** | Broken-phone/travel scenarios, affordable regular saving, irregular income, no shame if essentials consume income. | Practical but avoids implying structural money problems can be solved by willpower. | Quiz as broader learning tool; calculator for a realistic budget. | Medium |
| `/guides/moving-out-budget` — What to Budget Before Your First Move; **moving out budget checklist UK** | Deposit/initial rent/bills/setup; shared costs; irregular expenses; nation-specific tenancy signposts. | Clear cost categories plus a balanced illustrative example; later fulfil the existing coming-soon resource. | Link to Quiz, calculator and real checklist once released. | Medium |
| `/about` + `/editorial-policy` — Who Creates Cashbrite's Money Education? | Verified founder background, purpose/funding, content review and corrections. | Supports trust and author transparency; not a traffic-volume play. | Link to how the quiz/report are used and their limits. | High trust foundation |

Publish two strong guides per month at first, not dozens of generic articles. Schools can reuse a genuinely useful sample activity from this programme with the author's permission; do not fabricate teacher reviews or partnerships.

## 10. Competitor and search-result observations

These are observations about the pages examined, **not statements about traffic, rank positions, backlink counts or conversion performance**. Wealthbrite is not the principal SEO benchmark for these student queries; the sites below are more relevant acquisition competitors.

| Site/page inspected | What is visibly strong | What Cashbrite should learn | How Cashbrite can differ |
|---|---|---|---|
| [UCAS budget calculator](https://www.ucas.com/money-and-student-life/money/budgeting/budget-calculator) | Sits within a student money/life navigation system, with related finance and accommodation routes. | Connect calculator, budgeting, student support and next-step guides. Avoid treating a tool as an isolated landing page. | Retain a quick, approachable starting budget and connect it to a broader educational Snapshot, without claiming UCAS-style spending data. |
| [Save the Student calculators](https://www.savethestudent.org/money/student-budgeting/student-budget-calculators.html) | Tool content is linked into budgeting, banking, student-finance, accommodation and bills topics. | Useful topical connections and clear student language beat isolated generic articles. | Serve school leavers/apprentices as well as university students, with a focused free assessment/report journey. |
| [MoneyHelper budget planner](https://www.moneyhelper.org.uk/en/everyday-money/budgeting/budget-planner) | Explains needed information, how the tool works and next steps for different situations, with relevant onward help. | Add assumptions, practical context and supportive outcomes around Cashbrite's calculator. | Youth-first examples and less adult-household complexity; do not try to replicate its whole advice library. |
| [MSE student budgeting planner](https://www.moneysavingexpert.com/students/student-budgeting-planner/) | Detailed student budgeting guidance, practical planner framing and extensive related money navigation. | Give the visitor a complete useful answer and a reason to save/share a resource. | Independent learning and confidence before first decisions, rather than product comparisons/deal-led content. |
| [HSBC young-adult resources](https://www.hsbc.co.uk/financial-education/young-adults/) | Explicit young-adult audience and a money-personality quiz within a wider learning offer. | Explain the quiz's purpose and the learning that follows, not just its score. | A provider-independent educational journey without requiring a banking relationship. Explain actual funding/independence accurately. |
| [The Money Charity schools](https://themoneycharity.org.uk/our-work-with-children-and-young-people/secondary-schools-and-colleges/) | Specific school/college workshop offering, linked resources, teacher support and enquiry routes. | Help an educator judge suitability using real delivery details and examples. | A polished individual starting point plus school-facilitated learning; do not imply equivalent reach or endorsements. |

Practical link-earning targets are school careers/PSHE resource pages, college transition packs, university student-support pages and apprenticeship support teams **after** a genuinely useful guide/tool is ready. Offer an inspectable resource and a clear audience explanation; do not buy links or ask for keyword-stuffed anchor text. No outreach was conducted and no partnership is implied.

## 11. Search Console, analytics and measuring the free journey

### What was verified

- Google site-verification meta is present in live HTML. A meta token proves configuration, not current property ownership or a successful verification state.
- Sitemap is public and referenced in robots.txt. Submission and processing in Search Console were **not** verified.
- GA4 integration is production-only and consent-controlled in source. It uses `G-XSGSX4EXY6`; consent and URL sanitisation are separate from report/marketing choices.
- A fresh live homepage visit made no optional analytics requests before opt-in.
- Source excludes GA page views from sensitive routes and uses fixed Vercel journey events without custom identity/answer/score properties. This is an appropriate privacy boundary to preserve.
- Fixed events exist for assessment start/completion, basic results, full-report click, registration, report generation and download. Their names do not prove the analytics provider accepted or surfaced them. Source definitions are not conversion counts.

### Owner actions needed; no credentials should be pasted into chat

1. Open [Google Search Console](https://search.google.com/search-console/) using the existing owner account. Check the existing Domain property for `cashbrite.co.uk`, or the precise URL-prefix property for `https://www.cashbrite.co.uk/`. A non-www URL-prefix property alone does not establish the same scope as the www property.
2. Confirm verified ownership. Reuse existing verification; if a suitable property is absent, create/verify it through Google's normal owner process. Do not remove the current token blindly.
3. After the approved canonical/noindex corrections, submit `https://www.cashbrite.co.uk/sitemap.xml` and inspect Home, Quiz, calculator, Students and Schools. Compare declared versus Google-selected canonical, crawl status and indexing exclusions.
4. Share read-only property access with the authorised reviewer, or export Page indexing, Sitemaps, Core Web Vitals and Performance reports. Performance export should include date, query, page, country/device, clicks, impressions, CTR and position, with UK and non-brand views where useful. If the site is new, report the available date range rather than implying 16 months of data exists.
5. Separately confirm the existing GA4 property receives **consented public-page** visits. Do not turn on tracking merely to complete an SEO audit or send personal report links into DebugView.

[Search Console setup and monitoring guidance](https://developers.google.com/search/docs/monitor-debug/search-console-start).

### Minimum useful measurement plan

| Question | Existing source to use | Limitation |
|---|---|---|
| Is Google finding the right public pages? | Search Console sitemap/URL inspection/Page indexing | Owner access required; not established by the meta tag. |
| Which UK queries and pages bring relevant visitors? | Search Console Performance by query/page/country/device | Do not infer search volume from impressions alone. |
| Are consented organic visitors reaching useful public pages? | Existing GA4 public-page acquisition data | Consent means undercounting; cannot treat it as all visitors. |
| Do visitors complete the quiz and request reports? | Existing approved fixed-event instrumentation, if ingestion is available; owner-reviewed aggregate operational counts where lawful | GA4 currently excludes the quiz/report pages. Vercel events do not automatically establish GA organic conversion attribution. No customer records were queried. |
| Is the experience stable in the field? | Search Console CWV/CrUX where enough data exists | Low traffic may mean no report; absence is not a pass. |

Do not upgrade Vercel to obtain enhanced funnel reporting. First verify what current reporting actually receives. Organic-specific completion attribution is not demonstrated by this audit; a separate privacy-reviewed measurement design may be needed later. Preserve consent, withdrawal, sanitised paths and no personal event properties.

## 12. Prioritised action plan

Effort is an estimate for implementation plus focused verification, excluding unpredictable Google recrawl time and owner access delays. Benefits are directional, not promised traffic gains. **CRITICAL** is reserved for confirmed private-data exposure, broad unintended deindexing or comparable harm; none was confirmed here. Three HIGH technical/content priorities should precede optional enhancements.

### Quick wins: 1-2 working days

| ID / severity | Issue or opportunity / URLs | Evidence | Recommended action | Expected benefit | Effort | Dependencies / risk |
|---|---|---|---|---|---|---|
| Q1 **HIGH** | Quiz excluded, `/quiz` | Live HTTP noindex; sitemap includes it | Remove only public quiz noindex/nofollow; preserve private route rules and flow | Makes organic quiz landing possible | 1-2h | Header regression tests; approval to change code; preserve no-store/referrer choices |
| Q2 **HIGH** | Canonical-host disagreement, all public pages | Non-www canonical -> 308 www | Align www canonical, schema, OG, sitemap and robots references | Consolidated discovery/canonical signals | 2-4h | Review URL config safely; no blind domain/environment change |
| Q3 **MEDIUM** | Three legal homepage canonicals/duplicate suffixes | Live metadata inheritance | Per-page canonicals, single brand suffix, appropriate social data | Clear document identity and cleaner snippets | 1-2h | Keep legal body unchanged unless separately reviewed |
| Q4 **MEDIUM** | Search Console state unknown | Verification token only | Owner checks property, submits corrected sitemap, inspects five key URLs | Actual indexing evidence and early issue detection | 1h owner + reviewer | Existing account permission; no keys in chat |
| Q5 **MEDIUM** | Hub lacks dedicated calculator link | Main links on `/calculators` do not include tool URL | Add a contextual guide link without adding a click before tool use | Better topic/navigation relationship | 0.5-1h | Preserve approved practical tool access |
| Q6 **LOW** | Build timestamp used as all lastmod values | `new Date()` for all sitemap entries | Use real update dates or omit unreliable lastmod | More truthful maintenance signals | 0.5-1h | No fabricated freshness or automated daily date bumps |

### Short term: 2-4 weeks

| ID / severity | Issue or opportunity / URLs | Evidence | Recommended action | Expected benefit | Effort | Dependencies / risk |
|---|---|---|---|---|---|---|
| S1 **HIGH** | Quiz initial CLS | Six probes plus three attributed reloads | Trace and reserve stable loading space; retest entry/recovery/390px/Safari | Less visual disruption at a key conversion step | 0.5-1 day | No question/auto-next/scoring changes; confirm actual shift trigger |
| S2 **HIGH** | No public first-payslip guide | Public PDF excluded; Resources only a summary | Publish sourced HTML checklist companion linked to existing PDF | New relevant search entry and shareable resource | 1-2 days | Real editorial review, no HMRC-form confusion |
| S3 **HIGH** | Calculator lacks useful supporting explanation | Same shared calculator on two URLs | Add termly conversion, balanced example, methodology and support links to dedicated URL | Stronger task satisfaction and long-tail relevance | 1-2 days | Label illustrative amounts; do not change formulas |
| S4 **HIGH** | Limited public learning depth | Students mostly introductory | Expand curated student hub and publish one term-budgeting guide | Relevant topic coverage and natural quiz referrals | 2-4 days | Source verification; no boilerplate word-count target |
| S5 **MEDIUM** | Weak public author/editorial trail | Founder intro but no dedicated profile/editorial route | Add verified profile, review/corrections policy and author attribution to guides | Trust, accountability and clearer expertise | 1-2 days | Founder permission; verify every credential/claim |
| S6 **MEDIUM** | Schools buyer questions unanswered | Workshop summary lacks operational detail | Add actual delivery/session/sample-resource details and real FAQs | Better qualified school enquiries and relevance | 1-2 days | Owner confirms offer; no invented accreditations/testimonials |
| S7 **MEDIUM** | Duplicate calculator intent | Both pages embed same functional tool | Distinguish hub from detailed learning landing; add clear cross-links | Less ambiguous page targeting | 0.5-1 day | Keep both routes and existing usability; no speculative noindex |
| S8 **LOW** | Entity/schema graph inconsistencies | Shared schema URLs use redirecting host; no stable IDs | Validate accurate connected entities and chosen page types | Cleaner machine-readable identity | 0.5 day | No fake ratings, reviewer names or rich-result promises |

### Longer term: 3-6 months

| ID / severity | Opportunity / URLs | Evidence | Recommended action | Expected benefit | Effort | Dependencies / risk |
|---|---|---|---|---|---|---|
| L1 **HIGH opportunity** | School-leaver and first-job learning cluster | Matches real audience but few public teaching pages | Publish roughly two deeply useful guides monthly, starting with section 9 priorities | More useful acquisition entry points | Ongoing editorial capacity | Every page sourced/reviewed; no mass AI output |
| L2 **MEDIUM opportunity** | Apprentice and young-renter needs | Audience gaps in current content | Add differentiated guides when query/user evidence supports them | Reach beyond university-only traffic | 1-3 days per guide | Eligibility/nation-specific review and current primary sources |
| L3 **MEDIUM opportunity** | Trusted distribution/backlinks | Competitors integrate education hubs | Offer real tools/guides to college/student-support/PSHE resource editors | Relevant referrals and earned recognition | 1-2h/week | No paid links, fake affiliations or promised placements |
| L4 **MEDIUM investigation** | Field performance and query opportunity | PSI quota failure; no GSC access | Review available CWV and UK query/page data monthly, then improve actual weak pages | Evidence-led prioritisation | 1-2h/month | Low-data caveat; no need for paid monitoring infrastructure |
| L5 **LOW opportunity** | Better snippets/resource sharing | Public metadata already present | Iterate titles/descriptions from real query data; add page-specific social images only when worthwhile | Clearer search/share expectations | Small monthly reviews | No A/B ranking claims from tiny samples; preserve brand |

### Recommended sequence

- **Days 1-2:** Q1-Q6, with private-route and free-model regression checks; owner supplies Search Console evidence.
- **Week 1:** focused quiz CLS fix and calculator methodology/example; establish editorial ownership.
- **Week 2:** publish first-payslip companion and practical term-budgeting guide; add contextual links from Students/Resources.
- **Weeks 3-4:** strengthen Schools with factual operational detail, clarify calculator hub intent, publish verified author/editorial pages.
- **Months 2-3:** teenager budgeting and school-leaver guide; begin limited resource-editor outreach once content is useful.
- **Months 4-6:** prioritise apprentice/overdraft/saving/renting content using real query data and user questions; review stale sources and examples monthly or when rules change.

After any future implementation: test response headers and rendered metadata, recrawl sitemap URLs, preserve private 403/noindex responses, retest 30-question/free-report flow locally with synthetic providers, and inspect the changed public URLs in Search Console. No new payment test is warranted for isolated SEO metadata edits.

## 13. Top ten highest-impact recommendations

1. **Make the public quiz indexable**, without weakening private results/report controls.
2. **Make www the consistent canonical identity**, matching the already live redirect destination.
3. **Correct legal-page self-canonicals and duplicate title suffixes** as part of the same metadata pass.
4. **Fix the measured quiz entry layout shift**, not its approved visual design.
5. **Get actual Search Console evidence**: property scope, indexing, selected canonicals and UK queries.
6. **Turn the existing payslip checklist into a substantive public HTML companion**, retaining its two-page download.
7. **Make the dedicated calculator page the best explanation of the student's task**, with termly conversion, assumptions and one balanced example.
8. **Build a small student/school-leaver learning hub**, not a high-volume generic blog.
9. **Make authorship and editorial maintenance inspectable**, using only genuine background and review work.
10. **Give schools concrete delivery details and a real sample**, then earn links from relevant education/support pages.

## 14. What remains unverified and what not to do

| Item | Why incomplete | Smallest next step |
|---|---|---|
| Google indexing/selected canonicals/manual actions | No private GSC access provided | Owner read-only access or exports; inspect the five priority public URLs |
| Search volume, numerical competition and rankings | No reliable UK keyword tool/rank-tracking dataset | Optional existing Keyword Planner access/export; do not invent numbers or buy a subscription as a prerequisite |
| Field LCP/INP/CLS | PSI API 429; CrUX availability unestablished | Owner PSI browser report/GSC CWV; if insufficient field data, say so |
| Full assessment-session INP | Only non-submitting browser navigation and a single harmless click measured | Separately approved synthetic interaction performance test; retain original quiz/scoring |
| Analytics ingestion and organic conversion attribution | Source and pre-consent behaviour checked, not private dashboards | Owner verifies existing GA4/Vercel reports without upgrading or exposing user data |
| Backlink profile and link opportunities at scale | No authenticated backlink dataset/outreach | Start with real known school/student-support resource editors; inspect GSC Links if available |
| Comprehensive financial/legal accuracy | Audit sampled public material and primary-source context, not every personalised chapter/legal obligation | Qualified editorial review for new substantive content; do not claim legal/regulatory sign-off |
| Full security/accessibility/Safari audit | Unauthenticated privacy checks and Chrome mobile rendering only | Separate targeted tests; no customer links/records required for synthetic tests |
| Search-result enhancements | JSON-LD parses, but no private or synthetic report submitted to external validators | Validate only public acquisition pages in Google's supported tests after relevant schema work |

Do not redesign the approved homepage, add keyword-heavy headings to the illustration, expose report pages/files, change quiz/scoring/registration, restore paid checkout, create mass location/keyword pages, fabricate school proof or buy links. Do not interpret lack of a visible search result in a sample query as proof that the whole site is unindexed. Do not promise traffic or ranking outcomes from these changes.

**Conclusion:** the next useful SEO release is a small technical correction followed by a credible, focused public learning programme. Cashbrite's main differentiator is not another generic finance article: it is practical learning connected to a genuinely free, private and personalised assessment/report journey.
