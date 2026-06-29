"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { categoryDescriptions, categoryLabels, quizQuestions, type QuizAnswer } from "@/data/quizQuestions";
import {
  educationStages,
  referralSources,
  type EducationStage,
  type ReferralSource,
  type RegistrationData,
} from "@/lib/assessmentTypes";

type RegistrationFormState = {
  firstName: string;
  lastName: string;
  age: string;
  email: string;
  educationStage: "" | EducationStage;
  referralSource: "" | ReferralSource;
  reportConsent: boolean;
  marketingConsent: boolean;
};

const initialRegistration: RegistrationFormState = {
  firstName: "",
  lastName: "",
  age: "",
  email: "",
  educationStage: "",
  referralSource: "",
  reportConsent: false,
  marketingConsent: false,
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function QuizPage() {
  const router = useRouter();
  const quizStartRef = useRef<HTMLFormElement>(null);
  const [registration, setRegistration] = useState<RegistrationFormState>(initialRegistration);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [registrationError, setRegistrationError] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const shuffledAnswersByQuestion = useMemo(
    () =>
      Object.fromEntries(
        quizQuestions.map((question) => [question.id, shuffleAnswers(question.answers)]),
      ) as Record<string, QuizAnswer[]>,
    [],
  );

  useEffect(() => {
    if (!registrationComplete) return;

    let secondFrame: number | undefined;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        const quizStart = quizStartRef.current;
        if (!quizStart) return;

        const headerHeight = document.querySelector<HTMLElement>("body > header")?.offsetHeight ?? 0;
        const quizTop = window.scrollY + quizStart.getBoundingClientRect().top;
        window.scrollTo({ top: Math.max(0, quizTop - headerHeight - 16), behavior: "auto" });
      });
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      if (secondFrame !== undefined) window.cancelAnimationFrame(secondFrame);
    };
  }, [registrationComplete]);

  function handleRegistrationSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const error = validateRegistration(registration);
    if (error) {
      setRegistrationError(error);
      return;
    }

    setRegistrationError("");
    setRegistrationComplete(true);
  }

  async function handleAssessmentSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isComplete || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registration: toRegistrationData(registration),
          selectedAnswers,
        }),
      });
      const result = (await response.json()) as { id?: string; error?: string };

      if (!response.ok || !result.id) {
        throw new Error(result.error ?? "Your assessment could not be saved. Please try again.");
      }

      router.push(`/results?id=${result.id}`);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Your assessment could not be saved. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <section className="bg-cream py-10 sm:py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-lg border border-navy/10 bg-white p-6 shadow-[0_18px_50px_rgba(7,29,43,0.06)] sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.14em] text-sea">Money Readiness Assessment</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold leading-tight text-navy sm:text-5xl">
            Discover your Money Confidence Score
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-navy/72">
            Find out where you&apos;re already doing well and identify the areas to improve before university, work and
            independent life.
          </p>
          <div className="mt-6 grid gap-3 text-sm font-bold text-navy/72 sm:grid-cols-2 lg:grid-cols-4">
            {["Takes 5 minutes", "Educational only", "Personalised recommendations", "No spam"].map((benefit) => (
              <span key={benefit} className="rounded-md border border-sea/15 bg-mint/30 px-4 py-2">
                {benefit}
              </span>
            ))}
          </div>
          {registrationComplete ? (
            <>
              <div className="mt-7 h-3 overflow-hidden rounded-full bg-cream">
                <div className="h-full rounded-full bg-sea transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-2 text-sm font-semibold text-navy/65">
                {answeredCount} of {quizQuestions.length} answered
              </p>
            </>
          ) : null}
        </div>

        {!registrationComplete ? (
          <form
            onSubmit={handleRegistrationSubmit}
            className="rounded-lg border border-navy/10 bg-white p-5 shadow-[0_18px_50px_rgba(7,29,43,0.06)] sm:p-7"
          >
            <div className="mb-6">
              <p className="text-sm font-black uppercase tracking-[0.14em] text-sea">Start your assessment</p>
              <h2 className="mt-2 text-2xl font-black text-navy">Create your Cashbrite result</h2>
              <p className="mt-2 text-base leading-7 text-navy/68">
                A few details help us generate your personalised result and send your Money Action Plan securely.
              </p>
            </div>

            <div className="mb-6 grid gap-2 rounded-lg border border-sea/15 bg-mint/20 p-3 text-sm font-black text-navy/75 sm:grid-cols-4">
              {["Private", "Educational", "Guidance only", "No financial advice"].map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-md bg-white/70 px-3 py-2">
                  <span className="h-2 w-2 rounded-full bg-sea" aria-hidden="true" />
                  {item}
                </div>
              ))}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold text-navy">
                First name
                <input
                  className="focus-ring rounded-md border border-navy/15 bg-cream/35 px-4 py-3 text-base font-normal transition focus:bg-white"
                  value={registration.firstName}
                  onChange={(event) => setRegistrationValue("firstName", event.target.value)}
                  required
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-navy">
                Last name
                <input
                  className="focus-ring rounded-md border border-navy/15 bg-cream/35 px-4 py-3 text-base font-normal transition focus:bg-white"
                  value={registration.lastName}
                  onChange={(event) => setRegistrationValue("lastName", event.target.value)}
                  required
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-navy">
                Age
                <input
                  className="focus-ring rounded-md border border-navy/15 bg-cream/35 px-4 py-3 text-base font-normal transition focus:bg-white"
                  type="number"
                  min="13"
                  max="100"
                  value={registration.age}
                  onChange={(event) => setRegistrationValue("age", event.target.value)}
                  required
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-navy">
                Email address
                <input
                  className="focus-ring rounded-md border border-navy/15 bg-cream/35 px-4 py-3 text-base font-normal transition focus:bg-white"
                  type="email"
                  value={registration.email}
                  onChange={(event) => setRegistrationValue("email", event.target.value)}
                  required
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-navy sm:col-span-2">
                Which best describes your current stage?
                <select
                  className="focus-ring rounded-md border border-navy/15 bg-cream/35 px-4 py-3 text-base font-normal transition focus:bg-white"
                  value={registration.educationStage}
                  onChange={(event) =>
                    setRegistrationValue(
                      "educationStage",
                      event.target.value as RegistrationFormState["educationStage"],
                    )
                  }
                  required
                >
                  <option value="">Choose one</option>
                  {educationStages.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-bold text-navy sm:col-span-2">
                How did you hear about Cashbrite? (Optional)
                <select
                  className="focus-ring rounded-md border border-navy/15 bg-cream/35 px-4 py-3 text-base font-normal transition focus:bg-white"
                  value={registration.referralSource}
                  onChange={(event) =>
                    setRegistrationValue("referralSource", event.target.value as RegistrationFormState["referralSource"])
                  }
                >
                  <option value="">Choose one, if applicable</option>
                  {referralSources.map((source) => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-5 grid gap-2">
              <label className="flex gap-3 rounded-md border border-navy/10 bg-cream/35 p-3 text-sm leading-6 text-navy/72">
                <input
                  className="mt-0.5 h-4 w-4 shrink-0 accent-sea"
                  type="checkbox"
                  checked={registration.reportConsent}
                  onChange={(event) => setRegistrationValue("reportConsent", event.target.checked)}
                  required
                />
                <span>
                  I agree to receive my personalised Cashbrite Money Action Plan by email and understand how Cashbrite
                  uses my data as explained in the{" "}
                  <Link href="/privacy-policy" className="font-black text-sea underline underline-offset-4">
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
              <label className="flex gap-3 rounded-md border border-navy/10 bg-cream/35 p-3 text-sm leading-6 text-navy/72">
                <input
                  className="mt-0.5 h-4 w-4 shrink-0 accent-sea"
                  type="checkbox"
                  checked={registration.marketingConsent}
                  onChange={(event) => setRegistrationValue("marketingConsent", event.target.checked)}
                />
                <span>
                  I would like to receive occasional Cashbrite updates, resources and offers. I can unsubscribe at any
                  time. See the{" "}
                  <Link href="/privacy-policy" className="font-black text-sea underline underline-offset-4">
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
            </div>

            {registrationError ? (
              <p className="mt-5 rounded-md border border-[#e9c36b]/35 bg-[#fff3d9] p-4 text-sm font-semibold leading-6 text-navy" role="alert">
                {registrationError}
              </p>
            ) : null}

            <button
              className="focus-ring mt-6 rounded-full bg-navy px-6 py-4 text-base font-black text-white shadow-[0_14px_30px_rgba(7,29,43,0.22)] transition hover:-translate-y-0.5 hover:bg-ink"
              type="submit"
            >
              Start the 5-minute assessment
            </button>
          </form>
        ) : (
          <form
            ref={quizStartRef}
            onSubmit={handleAssessmentSubmit}
            className="grid gap-8"
          >
            {Object.entries(groupedQuestions).map(([category, questions]) => (
              <fieldset
                key={category}
                className="rounded-lg border border-navy/10 bg-white p-6 shadow-[0_18px_50px_rgba(7,29,43,0.06)] sm:p-7"
              >
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
                        {shuffledAnswersByQuestion[question.id].map((answer) => (
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
                              disabled={isSubmitting}
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

            {submitError ? (
              <p className="rounded-md border border-[#e9c36b]/35 bg-[#fff3d9] p-4 text-sm font-semibold leading-6 text-navy" role="alert">
                {submitError}
              </p>
            ) : null}

            <button
              className="focus-ring rounded-full bg-navy px-6 py-4 text-base font-black text-white shadow-[0_14px_30px_rgba(7,29,43,0.22)] transition enabled:hover:-translate-y-0.5 enabled:hover:bg-ink disabled:cursor-not-allowed disabled:opacity-50"
              type="submit"
              disabled={!isComplete || isSubmitting}
            >
              {isSubmitting ? "Generating your Money Action Plan..." : "Generate my Money Action Plan"}
            </button>
          </form>
        )}
      </div>
    </section>
  );

  function setRegistrationValue<Key extends keyof RegistrationFormState>(
    key: Key,
    value: RegistrationFormState[Key],
  ) {
    setRegistration((current) => ({ ...current, [key]: value }));
  }
}

function validateRegistration(registration: RegistrationFormState) {
  const age = Number(registration.age);

  if (!registration.firstName.trim()) return "Please enter your first name.";
  if (!registration.lastName.trim()) return "Please enter your last name.";
  if (!Number.isInteger(age) || age < 13 || age > 100) return "Please enter a valid age.";
  if (!emailPattern.test(registration.email.trim())) return "Please enter a valid email address.";
  if (!registration.educationStage) return "Please choose your current stage.";
  if (!registration.reportConsent) {
    return "Please confirm that you agree to receive your personalised Cashbrite Money Action Plan by email.";
  }

  return "";
}

function toRegistrationData(registration: RegistrationFormState): RegistrationData {
  return {
    firstName: registration.firstName.trim(),
    lastName: registration.lastName.trim(),
    age: Number(registration.age),
    email: registration.email.trim().toLowerCase(),
    educationStage: registration.educationStage as EducationStage,
    referralSource: registration.referralSource,
    reportConsent: registration.reportConsent,
    marketingConsent: registration.marketingConsent,
  };
}

function shuffleAnswers(answers: QuizAnswer[]) {
  const shuffled = [...answers];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}
