"use client";
import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { quizQuestions, type QuizAnswer } from "@/data/quizQuestions";
import { MoneyReadinessAssessment } from "@/components/assessment/MoneyReadinessAssessment";
import { initialAssessmentPosition, readAssessmentDraft, saveAssessmentDraft } from "@/lib/assessmentDraft";
import { FunnelEvent } from "@/components/FunnelEvent";
import { trackFunnel } from "@/lib/funnelAnalytics";

export default function QuizPage() {
  const router = useRouter();
  const navigating = useRef(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [position, setPosition] = useState(initialAssessmentPosition);
  const [ready, setReady] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const answerOrder = useMemo(() => Object.fromEntries(quizQuestions.map(question => [question.id, shuffleAnswers(question.answers)])) as Record<string, QuizAnswer[]>, []);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const draft = readAssessmentDraft();
      setAnswers(draft.answers); setPosition(draft.position); setStorageAvailable(draft.available); setReady(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { saveAssessmentDraft(answers, position); }
    catch { const frame = requestAnimationFrame(() => setStorageAvailable(false)); return () => cancelAnimationFrame(frame); }
  }, [answers, position, ready]);
  async function complete(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (navigating.current || quizQuestions.some(q => !q.answers.some(a => a.id === answers[q.id]))) return;
    try {
      saveAssessmentDraft(answers, { ...position, view: "review" });
      navigating.current = true; setSubmitting(true); trackFunnel("assessment_completed");
      router.push("/results");
    } catch { setError("Your browser could not keep your results. Keep this page open and allow session storage before continuing; your answers are still here."); }
  }
  return <section className="bg-cream py-8 sm:py-10"><div className="mx-auto max-w-workflow px-5 sm:px-8">
    <FunnelEvent name="assessment_started" />
    <div className="mb-6 border-b border-ink/20 pb-6"><p className="text-sm font-semibold uppercase text-sea">Money Readiness Assessment</p><h1 className="editorial-heading mt-3 text-4xl md:text-5xl">Discover your Money Confidence Score</h1><p className="mt-4 max-w-3xl leading-7 text-ink/80">Answer {quizQuestions.length} questions to see your score and starting points. No registration is needed. You can choose to register afterwards for your complete report and Action Plan, without payment.</p><p className="mt-3 text-sm text-ink/70">Around 5 minutes · Educational guidance · No financial advice</p></div>
    {ready ? <MoneyReadinessAssessment answers={answers} answerOrder={answerOrder} position={position} onNavigate={setPosition} onAnswer={(id, answer) => setAnswers(current => ({ ...current, [id]: answer }))} onSubmit={complete} isSubmitting={submitting} submitError={error} storageAvailable={storageAvailable} /> : <p role="status">Preparing your assessment...</p>}
  </div></section>;
}

function shuffleAnswers(answers: QuizAnswer[]) {
  const choices = [...answers];
  for (let index = choices.length - 1; index > 0; index--) {
    const swap = Math.floor(Math.random() * (index + 1));
    [choices[index], choices[swap]] = [choices[swap], choices[index]];
  }
  return choices;
}
