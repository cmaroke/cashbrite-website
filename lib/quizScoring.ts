import { categoryLabels, quizQuestions, type QuizCategory } from "@/data/quizQuestions";

export type ResultBand =
  | "Money Foundations Needed"
  | "Getting Started"
  | "Building Confidence"
  | "Nearly Money Ready"
  | "Money Ready";

export type QuizScores = {
  totalScore: number;
  maxScore: number;
  readinessScore: number;
  categoryScores: Record<QuizCategory, { score: number; max: number; percentage: number }>;
  band: ResultBand;
  strengths: QuizCategory[];
  riskAreas: QuizCategory[];
  nextSteps: string[];
};

const categories = Object.keys(categoryLabels) as QuizCategory[];

const categoryNextSteps: Record<QuizCategory, string> = {
  budgetingSpending: "Create a simple weekly spending plan with essentials first, then set a realistic limit for flexible spending.",
  savingHabits: "Start a small savings buffer and separate it from day-to-day spending, even if the first target is modest.",
  studentFinance: "Map termly or monthly student income against rent, travel, food and course costs before spending begins.",
  bankAccountsOverdrafts: "Review account features, alerts, fees and overdraft rules so your bank account supports your plan.",
  creditBorrowing: "Before borrowing, compare the total repayment, interest, fees and what happens if a payment is missed.",
  buyNowPayLater: "List any buy now pay later dates alongside bills so small instalments do not stack up quietly.",
  fraudScamsOnlineSafety: "Practise pausing before clicking links, moving money or sharing details, then check requests through official channels.",
  payslipsTaxNi: "Keep payslips and learn where to find gross pay, deductions, tax code and take-home pay.",
  movingOutRentBills: "Build a moving-out checklist covering deposit, rent, bills, due dates and shared-house agreements.",
  moneyConfidence: "Choose one trusted person or support service you could ask before a money decision feels urgent.",
};

const bandNextSteps: Record<ResultBand, string> = {
  "Money Foundations Needed":
    "Focus on the basics first: checking balances, planning essentials and knowing where to get trusted help.",
  "Getting Started":
    "Build a few steady habits before taking on bigger decisions, especially around borrowing, bills and scams.",
  "Building Confidence":
    "You have useful foundations. Strengthen the areas that could become stressful when income or living costs change.",
  "Nearly Money Ready":
    "You are close. Keep practising real-world planning and check the details before signing up to financial products.",
  "Money Ready":
    "Keep reviewing your plan as life changes and use your confidence to help friends spot risks early.",
};

export function scoreQuiz(selectedAnswers: Record<string, string>): QuizScores {
  const categoryScores = categories.reduce(
    (scores, category) => ({
      ...scores,
      [category]: { score: 0, max: 0, percentage: 0 },
    }),
    {} as QuizScores["categoryScores"],
  );

  let totalScore = 0;
  let maxScore = 0;

  for (const question of quizQuestions) {
    const maxQuestionPoints = Math.max(...question.answers.map((answer) => answer.points));
    const selectedAnswer = question.answers.find((answer) => answer.id === selectedAnswers[question.id]);
    const earnedPoints = selectedAnswer?.points ?? 0;

    totalScore += earnedPoints;
    maxScore += maxQuestionPoints;
    categoryScores[question.category].score += earnedPoints;
    categoryScores[question.category].max += maxQuestionPoints;
  }

  for (const category of categories) {
    const score = categoryScores[category];
    score.percentage = score.max === 0 ? 0 : Math.round((score.score / score.max) * 100);
  }

  const readinessScore = maxScore === 0 ? 0 : Math.round((totalScore / maxScore) * 100);
  const rankedCategories = [...categories].sort(
    (a, b) => categoryScores[a].percentage - categoryScores[b].percentage,
  );
  const riskAreas = rankedCategories.filter((category) => categoryScores[category].percentage <= 55).slice(0, 4);
  const strengths = [...categories]
    .filter((category) => categoryScores[category].percentage >= 75)
    .sort((a, b) => categoryScores[b].percentage - categoryScores[a].percentage)
    .slice(0, 4);

  return {
    totalScore,
    maxScore,
    readinessScore,
    categoryScores,
    band: getResultBand(readinessScore),
    strengths,
    riskAreas,
    nextSteps: getPersonalisedNextSteps(readinessScore, riskAreas, rankedCategories),
  };
}

export function getResultBand(scorePercentage: number): ResultBand {
  if (scorePercentage <= 25) return "Money Foundations Needed";
  if (scorePercentage <= 50) return "Getting Started";
  if (scorePercentage <= 70) return "Building Confidence";
  if (scorePercentage <= 85) return "Nearly Money Ready";
  return "Money Ready";
}

function getPersonalisedNextSteps(
  readinessScore: number,
  riskAreas: QuizCategory[],
  rankedCategories: QuizCategory[],
) {
  const band = getResultBand(readinessScore);
  const priorityCategories = riskAreas.length > 0 ? riskAreas : rankedCategories.slice(0, 3);
  const categorySteps = priorityCategories.slice(0, 3).map((category) => categoryNextSteps[category]);

  return [bandNextSteps[band], ...categorySteps];
}
