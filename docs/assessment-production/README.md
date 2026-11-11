# Cashbrite — approved Option A production integration

## Local preview

http://localhost:3000/quiz

The existing development server serves the updated production route. Registration
still comes first, with the same fields, requirements, validation and consent.
The development-only A/B comparison routes remain separate and unchanged.
Nothing is committed or deployed. Phase 3C has not started.

## Assessment interaction

- One canonical question at a time, in the original order and categories.
- Four native radio choices; two columns on desktop and a single column on mobile.
- Immediate lime/ink selected state, followed by a scheduled 400ms pause.
- A new selection replaces the pending timer. Manual Back/Next, Review,
  switching automatic progression off, pagehide, hiding the tab and unmounting
  cancel it. A generation token rejects stale callbacks; a navigation lock
  prevents same-frame duplicate navigation. Timers are not rescheduled by renders.
- Back preserves answers without automatically moving forward again. Next is
  shown only when Auto-next is off; it validates unanswered questions before advancing.
- The compact Auto-next switch sits beside progress, with a screen-reader
  explanation rather than a separate full-width settings block.
  A new draft starts in manual mode for reduced-motion users; an explicitly saved
  preference is retained. Turning the switch on does not advance an existing
  selection until another answer change or explicit keyboard confirmation.
- In automatic mode, native arrow-key radio selection saves the response without
  navigating. Enter or Space explicitly confirms and starts the 400ms timer.
  Tabbing away cancels pending progression. Returning to an answer is passive.
- Overall progress counts actual answered questions, independently of position.
  Question number/category are separate. Category descriptions appear at the
  first question in each category without extra screens or waiting time.
- After question 30, the assessment opens review, never submission. Review is
  also available earlier; missing questions are labelled and can be answered.
- Review/edit returns to the selected question. With automatic progression on,
  a changed answer returns to review after the same pause. Manual mode offers
  Save & return to review. Every edit clears the submission confirmation.
- Submission requires an explicit review checkbox and submit action. Errors
  remain visible and preserve answers for an explicit retry.

## Preserved integration

app/quiz/page.tsx still owns registration, selectedAnswers and submission.
The POST remains /api/assessments with exactly:

```text
{ registration: toRegistrationData(registration), selectedAnswers }
```

selectedAnswers remains question ID -> answer ID. No points or scores are
computed by the new component. The same server validation, scoring, database
save, email workflow and /results?id=... redirect remain in use. A synchronous
client ref guards against duplicate submit events while a request is in flight.

No canonical question, answer, point, category, server API, result-band rule,
database schema, email/PDF generation, Stripe, route or analytics event is changed.

## Recovery and privacy

A separate production draft key in sessionStorage stores only answer IDs,
position/view, the automatic-progression preference and a timestamp. It does not
store names, age, email, education stage, referral source or consent. It is
separate from both development prototype drafts. Invalid answer IDs are filtered
against canonical data; malformed or expired drafts are discarded. Drafts expire
after 24 hours and are tab-scoped. Successful submission clears the draft.

After refresh, users complete the original registration/consent form again to
resume their saved answers and position. The recovery banner explains this and
offers a confirmed discard action. This deliberately avoids storing personal
details or reviving consent. If browser storage fails, answers still work in
memory, a warning appears, and beforeunload warns before leaving. There is also
a beforeunload guard while submission is in flight.

## Accessibility

Native radio groups are named by the canonical question. Programmatic heading
focus after navigation announces question position and category through an
associated description. Selected-answer status is announced politely. Manual
mode precedes choices in keyboard order. All buttons/answer targets have generous
touch areas, visible focus, and high-contrast selected states. The progress bar
has current/min/max values and remains near the top. No question transition
animation is added; reduced-motion users also avoid automatic progression by
default on a fresh draft.

## Exact project files changed

Modified:
- app/quiz/page.tsx

Created:
- components/assessment/MoneyReadinessAssessment.tsx
- components/assessment/assessment.module.css
- lib/assessmentDraft.ts
- docs/assessment-production/README.md
- docs/assessment-production/question-1440.png
- docs/assessment-production/question-390.png
- docs/assessment-production/review-1440.png
- docs/assessment-production/review-390.png
- docs/assessment-production/recovery-390.png

Earlier local rebrand changes are retained; no unrelated files are reverted.

## Functional QA

ESLint, TypeScript, production build and the existing scoring sanity check pass.
Browser journeys at 1440px and 390px verify:

1. All 30 prompts, answer-label sets and category associations match canonical data.
2. Answer order remains stable while selecting. All questions automatically
   progress to review, with accurate answered counts and no horizontal overflow.
3. A browser MutationObserver measured 409ms from selection to the next screen
   in a focused timing check (400ms scheduled delay; not a performance guarantee).
4. Rapid consecutive choices cause one advance and retain the final choice.
5. Back, manual Next and switching off automatic progression cancel pending timers.
6. Leaving for Calculators cancels pending progression; returning restores the
   selected answer at the same question after registration.
7. Keyboard selection/arrow keys work in manual mode. In automatic mode arrow
   browsing stays on the current question; Enter confirms the selection.
   Reduced-motion users start
   with automatic progression off on a fresh draft.
8. Refresh restores position, answers and preference; registration details and
   consent are not restored. Draft contents are checked for absence of PII.
9. Partial review lists missing answers and cannot submit. Final review requires
   confirmation; correction returns to review and clears confirmation.
10. Simulated save errors are visible and preserve all answers. Multiple submit
    events in the same tick cause one request per explicit attempt. Retry works.
11. Captured payloads pass the actual server validator. All-best selections return
    100 from the unchanged scoring engine; registration normalisation and both
    consent values remain correct. Success redirects to the existing results URL
    and clears the draft.

POST responses and the destination results page are intercepted during QA, so
no Neon records, Resend emails, PDFs or purchases are created by these tests.
Screenshots show manual mode to hold the selected state for inspection.
A final compiled-production smoke test also confirms registration-to-question
transition, automatic progression and no mobile horizontal overflow, without
submitting an assessment.

## Integration risks and remaining limits

- The duplicate-submit guard protects a mounted client request. Existing backend
  idempotency is unchanged: an ambiguous network failure after a completed server
  save can still require reconciliation. No exactly-once guarantee across reloads
  or multiple tabs is introduced.
- Recovery is current-tab/24-hour only and deliberately requires registration
  and consent again. Closing/clearing the tab loses its draft.
- Automated checks use Chromium at desktop/mobile widths, not physical iOS or
  Android devices or a human screen-reader session.
- Real Neon/email/PDF delivery still needs an authorised end-to-end staging test.
  Those implementations are untouched. No conversion improvement is claimed.
