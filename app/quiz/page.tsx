"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { categoryDescriptions, categoryLabels, quizQuestions } from "@/data/quizQuestions";

export default function QuizPage() {
  const router = useRouter();
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});

  const answeredCount = Object.keys(selectedAnswers).length;
  const isComplete = answeredCount === quizQuestions.length;
  const progress = Math.round((answeredCount / quizQuestions.length) * 100);

  const groupedQuestions = useMemo(
    () =>
      quizQuestions.reduce(
        (groups, question) => {
          groups[question.category] = [...(groups[question.category] ?? []), question];
          return groups;
        },
        {} as Record<string, typeof quizQuestions>,
      ),
    [],
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isComplete) return;

    const params = new URLSearchParams(selectedAnswers);
    router.push(`/results?${params.toString()}`);
  }

  return (
    <section className="bg-cream py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 rounded-lg border border-navy/10 bg-white p-6 shadow-soft sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.14em] text-sea">Money Readiness Questionnaire</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-black leading-tight text-navy sm:text-5xl">
            Build a clearer picture of your money confidence
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-navy/72">
            Choose the answer that feels closest to you right now. This is a helpful confidence assessment, not a
            school test, and there is no judgement in the score.
          </p>
          <div className="mt-6 grid gap-3 text-sm font-bold text-navy/70 sm:grid-cols-3">
            <span className="rounded-full bg-mint/45 px-4 py-2">50 practical questions</span>
            <span className="rounded-full bg-mint/45 px-4 py-2">10 real-life money areas</span>
            <span className="rounded-full bg-mint/45 px-4 py-2">Personal next steps</span>
          </div>
          <div className="mt-7 h-3 overflow-hidden rounded-full bg-cream">
            <div className="h-full rounded-full bg-sea transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-sm font-semibold text-navy/65">
            {answeredCount} of {quizQuestions.length} answered
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-8">
          {Object.entries(groupedQuestions).map(([category, questions]) => (
            <fieldset key={category} className="rounded-lg border border-navy/10 bg-white p-6 shadow-[0_18px_50px_rgba(7,29,43,0.06)] sm:p-7">
              <legend className="px-1 text-xl font-black text-navy">
                {categoryLabels[category as keyof typeof categoryLabels]}
              </legend>
              <p className="mt-2 text-base leading-7 text-navy/65">
                {categoryDescriptions[category as keyof typeof categoryDescriptions]}
              </p>
              <div className="mt-4 grid gap-6">
                {questions.map((question) => (
                  <div key={question.id}>
                    <p className="text-lg font-bold leading-7 text-navy">{question.prompt}</p>
                    <div className="mt-3 grid gap-3">
                      {question.answers.map((answer) => (
                        <label
                          key={answer.id}
                          className="flex cursor-pointer gap-3 rounded-md border border-navy/12 bg-cream/55 p-4 text-base leading-7 transition hover:-translate-y-0.5 hover:border-sea hover:bg-mint/25"
                        >
                          <input
                            className="mt-1 h-5 w-5 accent-sea"
                            type="radio"
                            name={question.id}
                            value={answer.id}
                            checked={selectedAnswers[question.id] === answer.id}
                            onChange={() =>
                              setSelectedAnswers((current) => ({
                                ...current,
                                [question.id]: answer.id,
                              }))
                            }
                            required
                          />
                          <span>{answer.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </fieldset>
          ))}

          <button
            className="focus-ring rounded-full bg-navy px-6 py-4 text-base font-black text-white shadow-[0_14px_30px_rgba(7,29,43,0.22)] transition enabled:hover:-translate-y-0.5 enabled:hover:bg-ink disabled:cursor-not-allowed disabled:opacity-50"
            type="submit"
            disabled={!isComplete}
          >
            See my results
          </button>
        </form>
      </div>
    </section>
  );
}
