"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { categoryDescriptions, categoryLabels, quizQuestions, type QuizAnswer } from "@/data/quizQuestions";
import type { AssessmentPosition } from "@/lib/assessmentDraft";
import styles from "./assessment.module.css";

type Props = {
  answers: Record<string, string>;
  answerOrder: Record<string, QuizAnswer[]>;
  position: AssessmentPosition;
  onAnswer: (questionId: string, answerId: string) => void;
  onNavigate: (position: AssessmentPosition) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  isSubmitting: boolean;
  submitError: string;
  storageAvailable: boolean;
};

const categories = [...new Set(quizQuestions.map((q) => q.category))];
const autoAdvanceDelay = 400;

export function MoneyReadinessAssessment({ answers, answerOrder, position, onAnswer, onNavigate, onSubmit, isSubmitting, submitError, storageAvailable }: Props) {
  const [questionError, setQuestionError] = useState(false);
  const [pending, setPending] = useState(false);
  const [keyboardSelection, setKeyboardSelection] = useState(false);
  const browsingAnswers = useRef(false);
  const [editing, setEditing] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [confirmationError, setConfirmationError] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const generation = useRef(0);
  const navigationLocked = useRef(false);
  const unlockFrame = useRef<number | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const screen = useRef<HTMLElement>(null);
  const firstAnswer = useRef<HTMLInputElement>(null);
  const confirmation = useRef<HTMLInputElement>(null);
  const { step, view, autoAdvance } = position;
  const question = quizQuestions[step];
  const answeredCount = Object.keys(answers).length;
  const missing = quizQuestions.filter((q) => !answers[q.id]);
  const progress = Math.round(answeredCount / quizQuestions.length * 100);
  const isCategoryStart = step === 0 || quizQuestions[step - 1].category !== question.category;

  const clearTimer = useCallback(() => {
    generation.current += 1;
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = null;
  }, []);

  const cancelPending = useCallback(() => { clearTimer(); setPending(false); }, [clearTimer]);

  useEffect(() => {
    const hide = () => { if (document.hidden) cancelPending(); };
    window.addEventListener("pagehide", cancelPending);
    document.addEventListener("visibilitychange", hide);
    return () => {
      clearTimer();
      if (unlockFrame.current !== null) cancelAnimationFrame(unlockFrame.current);
      window.removeEventListener("pagehide", cancelPending);
      document.removeEventListener("visibilitychange", hide);
    };
  }, [cancelPending, clearTimer]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      heading.current?.focus({ preventScroll: true });
      screen.current?.scrollIntoView({ block: "start", behavior: "instant" });
    });
    return () => cancelAnimationFrame(frame);
  }, [step, view]);

  function navigate(nextStep: number, nextView: AssessmentPosition["view"]) {
    cancelPending();
    if (navigationLocked.current || isSubmitting) return;
    navigationLocked.current = true;
    setQuestionError(false);
    setKeyboardSelection(false);
    onNavigate({ ...position, step: nextStep, view: nextView });
    unlockFrame.current = requestAnimationFrame(() => { navigationLocked.current = false; });
  }

  function advance() {
    if (editing || step === quizQuestions.length - 1) {
      setEditing(false);
      setConfirmed(false);
      navigate(step, "review");
    } else navigate(step + 1, "question");
  }

  function choose(answerId: string, browseOnly = false) {
    if (isSubmitting) return;
    cancelPending();
    onAnswer(question.id, answerId);
    setQuestionError(false);
    setConfirmed(false);
    setKeyboardSelection(browseOnly && autoAdvance);
    if (browseOnly) return;
    if (!autoAdvance) return;
    setPending(true);
    const token = generation.current;
    // Every selection gets one cancellable timer. No effect reschedules it on render.
    timer.current = setTimeout(() => {
      if (token !== generation.current) return;
      timer.current = null;
      advance();
    }, autoAdvanceDelay);
  }

  function next(event: FormEvent) {
    event.preventDefault();
    cancelPending();
    if (!answers[question.id]) {
      setQuestionError(true);
      firstAnswer.current?.focus();
      return;
    }
    advance();
  }

  function edit(index: number) {
    setEditing(true);
    setConfirmed(false);
    setConfirmationError(false);
    navigate(index, "question");
  }

  function review() {
    setEditing(false);
    setConfirmed(false);
    setConfirmationError(false);
    navigate(step, "review");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    cancelPending();
    if (missing.length || isSubmitting) return;
    if (!confirmed) {
      setConfirmationError(true);
      confirmation.current?.focus();
      return;
    }
    void onSubmit(event);
  }

  return <section ref={screen} className={styles.assessment} aria-label="Money Readiness Assessment">
    <div className="mb-4 flex items-start justify-between gap-3 border-b border-ink/20 pb-3">
      <h1 className="editorial-heading min-w-0 text-2xl sm:text-3xl">Money Readiness Assessment</h1>
      {view === "question" && <button type="button" className={styles.textButton} onClick={review}>Review answers</button>}
    </div>
    <div className={styles.progress}>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 font-display text-sm font-medium">
        <span role="status" aria-live="polite">{answeredCount} of {quizQuestions.length} answered · {progress}% complete</span>
        <label className="flex min-h-11 cursor-pointer items-center gap-2 text-xs">
          <span>Auto-next</span>
          <span className="relative flex shrink-0 items-center"><input type="checkbox" role="switch" aria-label="Auto-next" aria-describedby="auto-next-description" checked={autoAdvance} onChange={(event) => { cancelPending(); setKeyboardSelection(false); onNavigate({ ...position, autoAdvance: event.target.checked }); }} className="focus-ring peer h-6 w-11 cursor-pointer appearance-none rounded-full border border-ink/60 bg-mist checked:bg-lime" /><span aria-hidden="true" className="pointer-events-none absolute left-1 h-4 w-4 rounded-full bg-ink peer-checked:translate-x-5" /></span>
        </label>
        <p id="auto-next-description" className="sr-only">Answers advance automatically 0.4 seconds after selection. Switch off to use Next and take more time. Use arrow keys to explore answers, then press Enter or Space to continue.</p>
      </div>
      <div role="progressbar" aria-label="Assessment progress" aria-valuemin={0} aria-valuemax={quizQuestions.length} aria-valuenow={answeredCount} className="h-1.5 overflow-hidden rounded-sm bg-ink"><div className="h-full bg-lime motion-safe:transition-[width]" style={{ width: `${progress}%` }} /></div>
    </div>
    {!storageAvailable && <p role="status" className="mb-5 border-l-2 border-sage pl-3 text-sm leading-6">Tab storage is unavailable. Keep this page open to retain your answers.</p>}
    {view === "question" ? <form onSubmit={next} noValidate>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-x-5 gap-y-2">
        <div><p className="font-display text-xs font-medium uppercase tracking-[0.08em] text-sea">Category {categories.indexOf(question.category) + 1} of {categories.length}</p><p className="mt-1 font-display text-sm font-medium">{categoryLabels[question.category]}</p></div>
        <p className="font-display text-sm font-medium">Question {step + 1} of {quizQuestions.length}</p>
      </div>
      {isCategoryStart && <p className="mb-5 text-sm leading-6 text-ink/80">{categoryDescriptions[question.category]}</p>}
      {editing && <p className="mb-3 text-sm text-sea">Editing your response · return to review when ready</p>}
      <p id="question-context" className="sr-only">Question {step + 1} of {quizQuestions.length}. Category {categories.indexOf(question.category) + 1} of {categories.length}: {categoryLabels[question.category]}. {isCategoryStart ? categoryDescriptions[question.category] : ""}</p>
      <h2 ref={heading} tabIndex={-1} id={`question-${question.id}`} aria-describedby="question-context" className={styles.questionHeading}>{question.prompt}</h2>
      <fieldset key={question.id} data-question-id={question.id} aria-labelledby={`question-${question.id}`} aria-describedby={questionError ? "question-error" : undefined} className="min-w-0">
        <legend className="sr-only">Choose one answer</legend>
        <div className={styles.answers}>{answerOrder[question.id].map((answer, index) => <label key={answer.id} className={styles.answer}>
          <input ref={index === 0 ? firstAnswer : undefined} type="radio" name={question.id} value={answer.id} checked={answers[question.id] === answer.id} onChange={() => choose(answer.id, browsingAnswers.current)} onPointerDown={() => { browsingAnswers.current = false; }} onKeyDown={(event) => {
            if (event.key.startsWith("Arrow")) { browsingAnswers.current = true; cancelPending(); }
            else if (event.key === "Tab") cancelPending();
            else if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              if (!event.repeat) { browsingAnswers.current = false; choose(answer.id); }
            }
          }} onKeyUp={() => { browsingAnswers.current = false; }} disabled={isSubmitting} aria-describedby={questionError ? "question-error" : "auto-next-description"} />
          <span>{answer.label}</span>
        </label>)}</div>
      </fieldset>
      {questionError && <p id="question-error" role="alert" className="mt-3 border-l-2 border-ink pl-3 text-sm">Choose an answer before continuing.</p>}
      <div className={styles.controls}>
        <button type="button" className={styles.secondary} disabled={step === 0 && !editing} onClick={() => {
          if (editing) { setEditing(false); navigate(step, "review"); }
          else navigate(Math.max(0, step - 1), "question");
        }}>{editing ? "Back to review" : "← Back"}</button>
        {!autoAdvance && <button type="submit" className={styles.primary}>{editing ? "Save & return to review" : step === quizQuestions.length - 1 ? "Review my answers" : "Next →"}</button>}
      </div>
      <p role="status" aria-live="polite" className="mt-3 min-h-5 text-xs text-sea">{pending ? editing ? "Answer selected. Returning to review shortly." : step === quizQuestions.length - 1 ? "Answer selected. Opening review shortly." : "Answer selected. Moving to the next question shortly." : keyboardSelection ? "Answer selected. Press Enter or Space to continue." : ""}</p>
    </form> : <div>
      <h2 ref={heading} tabIndex={-1} className={styles.questionHeading}>Review your answers</h2>
      <p className="mt-3 max-w-2xl leading-7 text-ink/80">{missing.length ? `${missing.length} questions still need an answer. You can finish them before submitting.` : "All 30 questions are answered. Check your responses, then confirm when you are ready to see your results."}</p>
      <div className="mt-6 divide-y divide-ink/20 border-y border-ink/20">{categories.map((category, index) => {
        const group = quizQuestions.filter((q) => q.category === category);
        const remaining = group.filter((q) => !answers[q.id]).length;
        return <details key={category} className={styles.reviewGroup}>
          <summary className="focus-ring flex min-h-14 cursor-pointer items-center justify-between gap-4 py-4 font-display font-semibold"><span>{String(index + 1).padStart(2, "0")} / {categoryLabels[category]}</span><span className="shrink-0 font-sans text-xs font-normal">{remaining ? `${remaining} unanswered` : "3 answered"} +</span></summary>
          <div className="pb-4">{group.map((q) => <div key={q.id} data-review-question={q.id} className="border-t border-ink/10 py-4"><p className="font-display font-medium leading-7">{q.prompt}</p><div className="mt-2 flex items-start justify-between gap-4"><p className="text-sm leading-6 text-ink/80">{q.answers.find((answer) => answer.id === answers[q.id])?.label ?? "Not answered"}</p><button type="button" disabled={isSubmitting} className={styles.textButton} aria-label={`Edit: ${q.prompt}`} onClick={() => edit(quizQuestions.indexOf(q))}>{answers[q.id] ? "Edit" : "Answer"}</button></div></div>)}</div>
        </details>;
      })}</div>
      <div className="mt-6">
        {missing.length ? <button type="button" className={styles.primary} onClick={() => { setEditing(false); navigate(quizQuestions.indexOf(missing[0]), "question"); }}>Answer remaining questions</button> : <form onSubmit={submit} noValidate>
          <label className="flex cursor-pointer items-start gap-3 text-sm leading-6"><input ref={confirmation} type="checkbox" checked={confirmed} disabled={isSubmitting} onChange={(event) => { setConfirmed(event.target.checked); setConfirmationError(false); }} aria-describedby={confirmationError ? "confirmation-error" : undefined} className="focus-ring mt-0.5 h-5 w-5 shrink-0 accent-ink" /><span>I have reviewed my answers and am ready to submit my assessment.</span></label>
          {confirmationError && <p id="confirmation-error" role="alert" className="mt-3 text-sm font-medium">Please confirm you are ready to submit.</p>}
          {submitError && <p role="alert" className="mt-4 border-l-2 border-ink bg-mist p-4 text-sm leading-6">{submitError}</p>}
          <button type="submit" disabled={isSubmitting} className={`${styles.primary} mt-5`}>{isSubmitting ? "Preparing your Money Confidence Snapshot..." : "Submit my assessment"}</button>
        </form>}
        <button type="button" disabled={isSubmitting} className={`${styles.textButton} mt-4`} onClick={() => { setEditing(false); navigate(step, "question"); }}>← Back to questions</button>
      </div>
    </div>}
  </section>;
}
