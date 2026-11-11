# Cashbrite Phase 3B — assessment prototypes

## Local previews

- Option A: http://localhost:3000/brand-preview/assessment-a
- Option B: http://localhost:3000/brand-preview/assessment-b

These links use the existing project development server. Both routes check
NODE_ENV on the server and return HTTP 404 unless it is development. They are
noindex, absent from navigation and sitemap, and unavailable through next start.
Use the project's normal development command if the development server stops.
No environment variable or production-access override is provided.

## What the prototypes do

Both import quizQuestions, categoryLabels and categoryDescriptions directly
from data/quizQuestions.ts. No question/answer copies or scoring engine are
introduced. Option A shows the 30 canonical questions in order. Option B shows
the ten canonical categories with three questions each, preserving that order.
Answer order is shuffled once per mount and stays stable during navigation and
answer changes. A reload may change display order, but saved IDs remain correct.

Back/forward navigation retains responses. Validation highlights unanswered
questions and moves focus to the first unanswered group. Progress measures
answers actually selected, rather than screens merely visited. The overall
indicator remains visible while scrolling. Option B also shows category position
and answers completed within the current category.

Review contains all 30 questions with the selected labels, grouped into
expandable categories. Edit returns to the relevant screen, then back to review.
Completion is explicitly a prototype finish, with no financial score/results.
Restart requires confirmation; cancellation keeps responses.

Drafts contain only answer IDs, position and prototype view. They live in
separate sessionStorage keys for A and B, in the current browser tab. Nothing is
sent to a server. Refreshes restore the draft; closing the tab or restarting
clears the relevant session. If browser storage is blocked, in-memory navigation
still works, a warning appears and beforeunload warns about leaving with answers.
The prototypes do not collect registration details or import database, email,
Stripe, Action Plan, PDF or scoring modules.

## Independent design comparison

| Dimension | A: one question | B: one category |
| --- | --- | --- |
| Visual quality | Focused composition; one decision dominates; little competition for attention | Clear topic introduction and sectional rhythm; more content visible together |
| Ease of completion | One validation decision at a time, but 30 question screens | Ten category checkpoints, but several unanswered questions can accumulate before Continue |
| Mobile | Better fit for a short viewport; most choices and controls visible together; long prompts can still require a small scroll | More scrolling because three complete answer sets share a screen; sticky overall progress maintains orientation |
| Accessibility | Native radio groups, large labels, visible focus and predictable post-navigation focus; more screen/focus transitions | Same semantic controls; fewer screen transitions, but errors may be further from the Continue control |
| Complexity | Simpler current-screen validation; more navigation and edit transitions | Adds category grouping and partial-category validation; reuses the shared response/review implementation |
| Friction | Repeated Next clicks may feel slow; do not auto-advance without testing | Users may overlook a question while scrolling; category intros add reading |
| Best hypothesis to test | Independent mobile use, particularly users hesitant about finance | Deliberate topic-by-topic use, including facilitated school sessions |

**Recommendation: take Option A forward as the lead user-test candidate.**
It provides the clearest separation of decisions and the strongest mobile focus.
Keep Option B as a serious alternative: it offers useful context and fewer
explicit navigation checkpoints. The prototypes establish usability differences,
not improved conversion or completion rates. Those require representative users
and measured testing. Compare time, abandonment points, mistaken selections,
perceived effort and recall; assess young people, parents and educators separately.

The shared site header/footer remain in both previews to expose the real
available viewport, rather than making the prototype look artificially compact.
Registration is intentionally excluded from this comparison; /quiz still uses
its existing registration, consent and assessment journey.

## Screenshots

| View | A | B |
| --- | --- | --- |
| Desktop, 1440px | option-a-desktop.png | option-b-desktop.png |
| Mobile, 390px | option-a-mobile.png | option-b-mobile.png |
| Desktop completion | option-a-complete-1440.png | option-b-complete-1440.png |
| Mobile completion | option-a-complete-390.png | option-b-complete-390.png |

## QA results

- ESLint, TypeScript and production build pass.
- All 30 canonical question IDs encountered exactly once in each forward journey
  at both 1440px and 390px. Ten categories, three questions each.
- Every displayed prompt, answer label and answer ID matches canonical data;
  category associations and question order match. No point values are changed.
- Answer changes do not reshuffle options. Back, forward and refresh preserve
  selections, and switching prototypes does not mix their drafts.
- Validation prevents progression; first-unanswered focus and native radio
  keyboard selection are checked. Enter advances; new-screen H2 receives focus.
- Overall progress is accurate and remains in the viewport after navigation.
- Review/edit, completion, restart cancellation and confirmed restart pass.
- No horizontal overflow in either prototype at either required width.
- Browser request inspection records zero /api/ calls during all test journeys.
- Both preview routes return 404 on the production server; /quiz remains available.

Browser QA uses Chromium at desktop/mobile viewport sizes, not physical iOS or
Android hardware. Screen-reader semantics/focus are checked programmatically;
no human assistive-technology session or conversion study is claimed.

## Exact new files

- app/brand-preview/assessment-a/page.tsx
- app/brand-preview/assessment-b/page.tsx
- components/assessment-prototype/AssessmentPrototype.tsx
- components/assessment-prototype/prototype.module.css
- docs/assessment-prototypes/README.md
- docs/assessment-prototypes/option-a-desktop.png
- docs/assessment-prototypes/option-b-desktop.png
- docs/assessment-prototypes/option-a-mobile.png
- docs/assessment-prototypes/option-b-mobile.png
- docs/assessment-prototypes/option-a-complete-1440.png
- docs/assessment-prototypes/option-b-complete-1440.png
- docs/assessment-prototypes/option-a-complete-390.png
- docs/assessment-prototypes/option-b-complete-390.png

No existing source files are modified by Phase 3B. Earlier local rebrand changes
remain untouched. No dependencies installed, no commit, and no deployment.
