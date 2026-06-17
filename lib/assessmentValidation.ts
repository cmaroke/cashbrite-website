import { quizQuestions } from "@/data/quizQuestions";
import {
  referralSources,
  userTypes,
  type ReferralSource,
  type RegistrationData,
  type UserType,
} from "@/lib/assessmentTypes";

export type AssessmentRequestBody = {
  registration?: Partial<RegistrationData>;
  selectedAnswers?: Record<string, string>;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateAssessmentRequest(body: AssessmentRequestBody) {
  const registration = body.registration;

  if (!registration) return "Please complete the registration step before starting the assessment.";

  const firstName = String(registration.firstName ?? "").trim();
  const lastName = String(registration.lastName ?? "").trim();
  const email = String(registration.email ?? "").trim().toLowerCase();
  const age = Number(registration.age);
  const userType = String(registration.userType ?? "") as UserType;
  const referralSource = String(registration.referralSource ?? "") as ReferralSource | "";

  if (!firstName) return "Please enter your first name.";
  if (!lastName) return "Please enter your last name.";
  if (!Number.isInteger(age) || age < 13 || age > 100) return "Please enter a valid age.";
  if (!emailPattern.test(email)) return "Please enter a valid email address.";
  if (!userTypes.includes(userType)) return "Please choose a user type.";
  if (referralSource && !referralSources.includes(referralSource)) {
    return "Please choose a valid referral source.";
  }
  if (registration.reportConsent !== true) {
    return "Please confirm that you agree to receive your personalised Cashbrite Money Action Plan by email.";
  }

  const selectedAnswers = body.selectedAnswers ?? {};
  const missingAnswer = quizQuestions.find((question) => !selectedAnswers[question.id]);
  if (missingAnswer) return "Please answer every assessment question before submitting.";

  const invalidAnswer = quizQuestions.find(
    (question) => !question.answers.some((answer) => answer.id === selectedAnswers[question.id]),
  );
  if (invalidAnswer) return "One or more answers could not be recognised. Please check the assessment and try again.";

  return null;
}

export function normaliseRegistration(registration: Partial<RegistrationData>): RegistrationData {
  return {
    firstName: String(registration.firstName ?? "").trim(),
    lastName: String(registration.lastName ?? "").trim(),
    age: Number(registration.age),
    email: String(registration.email ?? "").trim().toLowerCase(),
    userType: String(registration.userType ?? "") as UserType,
    referralSource: normaliseReferralSource(registration.referralSource),
    reportConsent: registration.reportConsent === true,
    marketingConsent: registration.marketingConsent === true,
  };
}

function normaliseReferralSource(value: unknown) {
  const referralSource = String(value ?? "") as ReferralSource | "";
  return referralSource && referralSources.includes(referralSource) ? referralSource : "";
}
