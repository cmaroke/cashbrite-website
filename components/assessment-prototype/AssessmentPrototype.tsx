"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { categoryDescriptions, categoryLabels, quizQuestions, type QuizQuestion } from "@/data/quizQuestions";
import styles from "./prototype.module.css";

type Mode = "a" | "b";
type View = "assessment" | "review" | "complete";
type Answers = Record<string, string>;
type Draft = { answers: Answers; step: number; view: View };

// Canonical question objects are referenced directly; no prompts, IDs or points are copied.
const categories = [...new Set(quizQuestions.map((question) => question.category))];
const sections = categories.map((category) => ({ category, questions: quizQuestions.filter((q) => q.category === category) }));
const total = quizQuestions.length;

function readDraft(key: string, stepCount: number): Draft {
  const empty: Draft = { answers: {}, step: 0, view: "assessment" };
  try {
    const stored = JSON.parse(sessionStorage.getItem(key) ?? "null");
    if (!stored || typeof stored !== "object") return empty;
    const answers: Answers = {};
    for (const question of quizQuestions) {
      const id = stored.answers?.[question.id];
      if (question.answers.some((answer) => answer.id === id)) answers[question.id] = id;
    }
    const step = Number.isInteger(stored.step) ? Math.max(0, Math.min(stepCount - 1, stored.step)) : 0;
    const view: View = Object.keys(answers).length === total && ["review", "complete"].includes(stored.view) ? stored.view : "assessment";
    return { answers, step, view };
  } catch {
    return empty;
  }
}

export function AssessmentPrototype({ mode }: { mode: Mode }) {
  const storageKey = `cashbrite:assessment-prototype:${mode}:v1`;
  const stepCount = mode === "a" ? total : sections.length;
  const [draft, setDraft] = useState<Draft>({ answers: {}, step: 0, view: "assessment" });
  const [ready, setReady] = useState(false);
  const [errorIds, setErrorIds] = useState<string[]>([]);
  const [editing, setEditing] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const heading = useRef<HTMLHeadingElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const restartDialog = useRef<HTMLDialogElement>(null);
  const cancelRestart = useRef<HTMLButtonElement>(null);
  const restartTrigger = useRef<HTMLButtonElement>(null);
  const firstRender = useRef(true);
  const { answers, step, view } = draft;

  // Stable during answer changes/navigation, like the live assessment's shuffled options.
  const [answerOrder, setAnswerOrder] = useState(() => Object.fromEntries(quizQuestions.map((q) => [q.id, q.answers])));

  useEffect(() => {
    // Restore the browser-only draft and shuffle before revealing the first screen.
    const frame = requestAnimationFrame(() => {
      setDraft(readDraft(storageKey, stepCount));
      setAnswerOrder(Object.fromEntries(quizQuestions.map((question) => {
        const order = [...question.answers];
        for (let i = order.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [order[i], order[j]] = [order[j], order[i]];
        }
        return [question.id, order];
      })));
      setReady(true);
    });
    return () => cancelAnimationFrame(frame);
  }, [storageKey, stepCount]);

  useEffect(() => {
    if (!ready) return;
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(draft));
    } catch {
      const frame = requestAnimationFrame(() => setStorageAvailable(false));
      return () => cancelAnimationFrame(frame);
    }
  }, [draft, ready, storageKey]);

  useEffect(() => {
    if (!ready) return;
    // Keep initial arrival at the top; subsequent screens receive focus after rendering.
    if (firstRender.current) { firstRender.current = false; return; }
    const frame = requestAnimationFrame(() => {
      heading.current?.focus({ preventScroll: true });
      heading.current?.scrollIntoView({ block: "start", behavior: "instant" });
    });
    return () => cancelAnimationFrame(frame);
  }, [step, view, ready]);

  useEffect(() => {
    if (storageAvailable || !Object.keys(answers).length) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [answers, storageAvailable]);

  const currentQuestions = mode === "a" ? [quizQuestions[step]] : sections[step].questions;
  const category = currentQuestions[0].category;
  const categoryIndex = categories.indexOf(category);
  const answered = Object.keys(answers).length;
  const progress = Math.round(answered / total * 100);
  const currentAnswered = currentQuestions.filter((q) => answers[q.id]).length;

  function choose(questionId: string, answerId: string) {
    setDraft((current) => ({ ...current, answers: { ...current.answers, [questionId]: answerId } }));
    setErrorIds((ids) => ids.filter((id) => id !== questionId));
  }

  function continueAssessment(event: FormEvent) {
    event.preventDefault();
    const missing = currentQuestions.filter((q) => !answers[q.id]).map((q) => q.id);
    setErrorIds(missing);
    if (missing.length) {
      requestAnimationFrame(() => {
        const first = form.current?.querySelector<HTMLInputElement>(`[data-question-id="${missing[0]}"] input`);
        first?.focus();
      });
      return;
    }
    if (editing || step === stepCount - 1) {
      setEditing(false);
      setDraft((current) => ({ ...current, view: "review" }));
    } else setDraft((current) => ({ ...current, step: current.step + 1 }));
  }

  function back() {
    setErrorIds([]);
    if (editing) { setEditing(false); setDraft((current) => ({ ...current, view: "review" })); }
    else setDraft((current) => ({ ...current, step: Math.max(0, current.step - 1) }));
  }

  function edit(question: QuizQuestion) {
    setEditing(true);
    setErrorIds([]);
    setDraft((current) => ({ ...current, step: mode === "a" ? quizQuestions.indexOf(question) : categories.indexOf(question.category), view: "assessment" }));
  }

  function restart() {
    setDraft({ answers: {}, step: 0, view: "assessment" });
    setEditing(false);
    setErrorIds([]);
    restartDialog.current?.close();
    requestAnimationFrame(() => { heading.current?.focus(); });
  }

  return (
    <div className={styles.prototype}>
      <div className="border-b border-ink/15 bg-mist">
        <div className="site-container flex flex-wrap items-center justify-between gap-x-6 py-1 text-xs text-ink/80">
          <p>Development preview · Option {mode.toUpperCase()}</p>
          <Link href={`/brand-preview/assessment-${mode === "a" ? "b" : "a"}`} className="focus-ring inline-flex min-h-11 items-center underline underline-offset-4">Compare Option {mode === "a" ? "B" : "A"} →</Link>
        </div>
      </div>
      <div className="mx-auto max-w-workflow px-5 py-6 sm:px-8 sm:py-10">
        {!ready ? <p role="status" className="py-12">Preparing the assessment preview…</p> : <>
          <div className="mb-6 flex items-start justify-between gap-4 border-b border-ink/20 pb-5">
            <div>
              <p className="mb-2 text-xs text-sea">{mode === "a" ? "One question at a time" : "One category at a time"}</p>
              <h1 className="editorial-heading text-3xl sm:text-4xl">{view === "complete" ? "A clear finish." : "Your money. Your next chapter."}</h1>
            </div>
            <button ref={restartTrigger} type="button" className={styles.textButton} disabled={!answered} onClick={() => { restartDialog.current?.showModal(); cancelRestart.current?.focus(); }}>Restart</button>
          </div>
          <div className="sticky top-[68px] z-20 mb-5 bg-cream py-3 md:top-[76px]" aria-label="Overall assessment progress">
            <div className="mb-2 flex flex-wrap justify-between gap-2 font-display text-sm font-medium"><span>{answered} of {total} answered</span><span>{progress}%</span></div>
            <div role="progressbar" aria-label="Overall assessment progress" aria-valuemin={0} aria-valuemax={total} aria-valuenow={answered} className="h-1.5 overflow-hidden rounded-sm bg-ink">
              <div className="h-full bg-lime transition-[width] motion-reduce:transition-none" style={{ width: `${progress}%` }} />
            </div>
          </div>
          {!storageAvailable && <p role="status" className="mb-5 border-l-2 border-sage pl-3 text-sm">Tab storage is unavailable. Keep this page open to retain your answers.</p>}
          {view === "assessment" ? <>
            <div className={`mb-6 ${mode === "b" ? "border-b border-ink/15 pb-5" : ""}`}>
              <p className="mb-2 font-display text-xs font-medium uppercase tracking-[0.08em] text-sea">Category {categoryIndex + 1} of {categories.length}</p>
              <h2 ref={heading} tabIndex={-1} className={styles.screenHeading}>{mode === "a" ? `Question ${step + 1} of ${total}` : categoryLabels[category]}</h2>
              {mode === "a" ? <p className="mt-1 font-display text-sm text-ink/80">{categoryLabels[category]}</p> : <>
                <p className="mt-3 max-w-2xl text-base leading-7 text-ink/80">{categoryDescriptions[category]}</p>
                <p className="mt-3 font-display text-sm font-medium">{currentAnswered} of {currentQuestions.length} answered in this category</p>
              </>}
            </div>
            <form ref={form} noValidate onSubmit={continueAssessment}>
              <div className={mode === "b" ? "grid gap-7 sm:gap-8" : ""}>
                {currentQuestions.map((question) => <fieldset key={question.id} data-question-id={question.id} className={styles.question} aria-describedby={errorIds.includes(question.id) ? `error-${question.id}` : undefined}>
                  <legend className="mb-4 w-full font-display text-xl font-semibold leading-7 sm:text-2xl sm:leading-8">{question.prompt}</legend>
                  <div className={styles.answers}>{answerOrder[question.id].map((answer) => <label key={answer.id} className={styles.answer}>
                    <input type="radio" name={question.id} value={answer.id} checked={answers[question.id] === answer.id} onChange={() => choose(question.id, answer.id)} aria-describedby={errorIds.includes(question.id) ? `error-${question.id}` : undefined} />
                    <span>{answer.label}</span>
                  </label>)}</div>
                  {errorIds.includes(question.id) && <p id={`error-${question.id}`} className="mt-3 text-sm font-medium text-ink">Choose an answer for this question before continuing.</p>}
                </fieldset>)}
              </div>
              {errorIds.length > 0 && <p role="alert" className="mt-5 border-l-2 border-ink bg-mist px-4 py-3 text-sm">{errorIds.length === 1 ? "There is 1 unanswered question." : `There are ${errorIds.length} unanswered questions.`}</p>}
              <div className={styles.navigation}>
                <button type="button" disabled={step === 0 && !editing} onClick={back} className={styles.secondary}>{editing ? "Cancel edit" : "← Back"}</button>
                <button type="submit" className={styles.primary}>{editing ? "Save & return to review" : step === stepCount - 1 ? "Review my answers" : mode === "a" ? "Next →" : "Continue →"}</button>
              </div>
            </form>
          </> : view === "review" ? <>
            <h2 ref={heading} tabIndex={-1} className={styles.screenHeading}>Review your responses</h2>
            <p className="mt-3 max-w-2xl leading-7 text-ink/80">All {total} questions are answered. You can change any response before finishing this preview.</p>
            <div className="mt-6 divide-y divide-ink/20 border-y border-ink/20">{sections.map((section, index) => <details key={section.category} className={styles.reviewGroup}>
              <summary className="focus-ring flex min-h-14 cursor-pointer items-center justify-between gap-4 py-4 font-display font-semibold"><span>{String(index + 1).padStart(2, "0")} / {categoryLabels[section.category]}</span><span className="shrink-0 font-sans text-xs font-normal">{section.questions.length} answered +</span></summary>
              <div className="pb-4">{section.questions.map((question) => <div key={question.id} data-review-question={question.id} className="border-t border-ink/10 py-4">
                <p className="font-display font-medium leading-7">{question.prompt}</p>
                <div className="mt-2 flex items-start justify-between gap-4"><p className="text-sm leading-6 text-ink/80">{question.answers.find((answer) => answer.id === answers[question.id])?.label}</p><button className={styles.textButton} type="button" aria-label={`Edit: ${question.prompt}`} onClick={() => edit(question)}>Edit</button></div>
              </div>)}</div>
            </details>)}</div>
            <div className={styles.navigation}><button className={styles.secondary} onClick={() => setDraft((current) => ({ ...current, view: "assessment", step: stepCount - 1 }))}>← Back</button><button className={styles.primary} onClick={() => setDraft((current) => ({ ...current, view: "complete" }))}>Finish prototype</button></div>
          </> : <div className="border-t-2 border-ink bg-white p-5 sm:p-8">
            <span className="mb-5 inline-block bg-lime px-3 py-1 font-display text-sm">{total} of {total} answered</span>
            <h2 ref={heading} tabIndex={-1} className={styles.screenHeading}>Assessment prototype complete.</h2>
            <p className="mt-4 max-w-xl leading-7 text-ink/80">You have explored all {categories.length} money topics. This preview ends here: no result has been generated and nothing has been submitted.</p>
            <div className="mt-6 flex flex-wrap gap-3"><button className={styles.secondary} onClick={() => setDraft((current) => ({ ...current, view: "review" }))}>Review answers</button><Link href={`/brand-preview/assessment-${mode === "a" ? "b" : "a"}`} className={styles.primary}>Try Option {mode === "a" ? "B" : "A"} →</Link></div>
          </div>}
          <p className="mt-6 border-t border-ink/15 pt-4 text-xs leading-5 text-ink/75">Prototype only. Answers stay in this browser tab until it closes or you restart. The live assessment is unchanged.</p>
        </>}
      </div>
      <dialog ref={restartDialog} className={styles.dialog} aria-labelledby={`restart-title-${mode}`} onClose={() => restartTrigger.current?.focus()}>
        <h2 id={`restart-title-${mode}`} className="editorial-heading text-3xl">Start again?</h2>
        <p className="mt-4 leading-7">This clears the answers for Option {mode.toUpperCase()} in this tab. Your other prototype and the live assessment are unaffected.</p>
        <div className="mt-6 flex flex-wrap gap-3"><button ref={cancelRestart} className={styles.secondary} onClick={() => restartDialog.current?.close()}>Keep my answers</button><button className={styles.primary} onClick={restart}>Restart prototype</button></div>
      </dialog>
    </div>
  );
}
