"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { quizQuestions, type QuizAnswer } from "@/data/quizQuestions";
import { MoneyReadinessAssessment } from "@/components/assessment/MoneyReadinessAssessment";
import { clearAssessmentDraft, initialAssessmentPosition, readAssessmentDraft, saveAssessmentDraft } from "@/lib/assessmentDraft";
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
  const submissionInFlight = useRef(false);
  const draftCleared = useRef(false);
  const [registration, setRegistration] = useState<RegistrationFormState>(initialRegistration);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [registrationError, setRegistrationError] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [position, setPosition] = useState(initialAssessmentPosition);
  const [draftReady, setDraftReady] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [recoveredAnswers, setRecoveredAnswers] = useState(false);

  const answeredCount = Object.keys(selectedAnswers).length;
  const isComplete = answeredCount === quizQuestions.length;

  const shuffledAnswersByQuestion = useMemo(
    () =>
      Object.fromEntries(
        quizQuestions.map((question) => [question.id, shuffleAnswers(question.answers)]),
      ) as Record<string, QuizAnswer[]>,
    [],
  );

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const saved = readAssessmentDraft();
      setSelectedAnswers(saved.answers);
      setPosition(saved.position);
      setStorageAvailable(saved.available);
      setRecoveredAnswers(Object.keys(saved.answers).length > 0);
      setDraftReady(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!draftReady || draftCleared.current) return;
    try {
      saveAssessmentDraft(selectedAnswers, position);
    } catch {
      const frame = requestAnimationFrame(() => setStorageAvailable(false));
      return () => cancelAnimationFrame(frame);
    }
  }, [selectedAnswers, position, draftReady]);

  useEffect(() => {
    if (!isSubmitting && (storageAvailable || !answeredCount)) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isSubmitting, storageAvailable, answeredCount]);

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
    if (!isComplete || submissionInFlight.current) return;

    submissionInFlight.current = true;
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

      draftCleared.current = true;
      clearAssessmentDraft();
      router.push(`/results?id=${result.id}`);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Your assessment could not be saved. Please try again.");
      submissionInFlight.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <section className="bg-cream py-8 sm:py-10">
      <div className="mx-auto max-w-workflow px-5 sm:px-8">
        {!registrationComplete && <div className="mb-6 border-b border-ink/20 pb-6">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-sea">Money Readiness Assessment</p>
          <h1 className="editorial-heading mt-3 max-w-4xl text-4xl text-navy md:text-5xl">
            Discover your Money Confidence Score
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-navy/72">
            Take the free assessment to receive your Cashbrite Money Confidence Snapshot: your score, score band,
            short interpretation and three priority areas.
          </p>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-ink/80">
            {["Takes 5 minutes", "Educational only", "Free Snapshot", "No spam"].map((benefit) => (
              <span key={benefit} className="border-l border-sage/40 pl-3 first:border-0 first:pl-0">
                {benefit}
              </span>
            ))}
          </div>

        </div>}

        {!registrationComplete ? (
          <form
            onSubmit={handleRegistrationSubmit}
            className="rounded-md border border-ink/20 bg-white p-5 sm:p-6"
          >
            {recoveredAnswers && <div className="mb-6 border-l-2 border-sage bg-mist/50 p-4 text-sm leading-6">
              <p>Your saved answers are ready in this tab. Re-enter your details and consent to resume; personal details are not stored in the draft.</p>
              <button type="button" className="focus-ring mt-2 min-h-11 underline underline-offset-4" onClick={() => {
                if (!window.confirm("Discard the saved answers and start a new assessment?")) return;
                clearAssessmentDraft();
                setSelectedAnswers({});
                setPosition(initialAssessmentPosition());
                setRecoveredAnswers(false);
              }}>Discard saved answers</button>
            </div>}
            <div className="mb-6">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-sea">Start your assessment</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-navy">Create your Cashbrite result</h2>
              <p className="mt-2 text-base leading-7 text-navy/68">
                Register for the free assessment to view your Cashbrite Money Confidence Snapshot after completing
                it. We attempt to email a copy when email delivery is configured; your Snapshot remains available online
                if it cannot be delivered. No purchase is required to view your free results.
                The Cashbrite Personalised Money Action Plan is an optional £19 one-off purchase.
              </p>
            </div>

            <div className="mb-6 flex flex-wrap gap-x-5 gap-y-2 border-y border-ink/15 py-3 text-xs font-medium text-ink/80">
              {["Private", "Educational", "Guidance only", "No financial advice"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-sea" aria-hidden="true" />
                  {item}
                </div>
              ))}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold text-navy">
                First name
                <input
                  className="focus-ring rounded-md border border-ink/55 bg-cream/35 px-4 py-3 text-base font-normal transition focus:bg-white"
                  value={registration.firstName}
                  onChange={(event) => setRegistrationValue("firstName", event.target.value)}
                  required
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-navy">
                Last name
                <input
                  className="focus-ring rounded-md border border-ink/55 bg-cream/35 px-4 py-3 text-base font-normal transition focus:bg-white"
                  value={registration.lastName}
                  onChange={(event) => setRegistrationValue("lastName", event.target.value)}
                  required
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-navy">
                Age
                <input
                  className="focus-ring rounded-md border border-ink/55 bg-cream/35 px-4 py-3 text-base font-normal transition focus:bg-white"
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
                  className="focus-ring rounded-md border border-ink/55 bg-cream/35 px-4 py-3 text-base font-normal transition focus:bg-white"
                  type="email"
                  value={registration.email}
                  onChange={(event) => setRegistrationValue("email", event.target.value)}
                  required
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-navy sm:col-span-2">
                Which best describes your current stage?
                <select
                  className="focus-ring rounded-md border border-ink/55 bg-cream/35 px-4 py-3 text-base font-normal transition focus:bg-white"
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
                  className="focus-ring rounded-md border border-ink/55 bg-cream/35 px-4 py-3 text-base font-normal transition focus:bg-white"
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
                  I agree to receive my free Cashbrite Money Confidence Snapshot by email and understand how Cashbrite
                  uses my data as explained in the{" "}
                  <Link href="/privacy-policy" className="font-semibold text-sea underline underline-offset-4">
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
                  <Link href="/privacy-policy" className="font-semibold text-sea underline underline-offset-4">
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
              className="focus-ring mt-6 min-h-12 rounded-md bg-lime px-6 py-3 text-base font-semibold text-ink transition hover:bg-lime/85"
              type="submit"
            >
              Start the 5-minute assessment
            </button>
          </form>
        ) : (
          <MoneyReadinessAssessment
            answers={selectedAnswers}
            answerOrder={shuffledAnswersByQuestion}
            position={position}
            onNavigate={setPosition}
            onAnswer={(questionId, answerId) => setSelectedAnswers((current) => ({ ...current, [questionId]: answerId }))}
            onSubmit={handleAssessmentSubmit}
            isSubmitting={isSubmitting}
            submitError={submitError}
            storageAvailable={storageAvailable}
          />
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
    return "Please confirm that you agree to receive your free Cashbrite Money Confidence Snapshot by email.";
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
