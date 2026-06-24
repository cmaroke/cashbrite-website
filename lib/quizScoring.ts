import { categoryLabels, quizQuestions, type QuizCategory } from "@/data/quizQuestions";

export type ResultBand =
  | "Starting Your Money Journey"
  | "Developing Money Skills"
  | "Building Money Confidence"
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
const scoreCurveExponent = 1.5;

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
  "Starting Your Money Journey":
    "Start with a few steady foundations, especially around spending, borrowing, bills and staying safe from scams.",
  "Developing Money Skills":
    "You have some useful foundations. Focus on the areas where a little more knowledge could make everyday decisions safer and calmer.",
  "Building Money Confidence":
    "You understand many money essentials. Strengthen the remaining gaps and keep checking details before making commitments.",
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
    score.percentage = normaliseScore(score.score, score.max);
  }

  const readinessScore = normaliseScore(totalScore, maxScore);
  const rankedCategories = [...categories].sort(
    (a, b) => categoryScores[a].percentage - categoryScores[b].percentage,
  );
  const riskAreas = rankedCategories.filter((category) => categoryScores[category].percentage <= 55).slice(0, 4);
  const strengths = [...categories]
    .filter((category) => categoryScores[category].percentage >= 75)
    .sort((a, b) => categoryScores[b].percentage - categoryScores[a].percentage)
    .slice(0, 4);
  const band = getResultBand(readinessScore);

  return {
    totalScore,
    maxScore,
    readinessScore,
    categoryScores,
    band,
    strengths,
    riskAreas,
    nextSteps: getPersonalisedNextSteps(band, riskAreas, rankedCategories),
  };
}

export function getResultBand(readinessScore: number): ResultBand {
  if (readinessScore >= 85) return "Money Ready";
  if (readinessScore >= 65) return "Building Money Confidence";
  if (readinessScore >= 40) return "Developing Money Skills";
  return "Starting Your Money Journey";
}

export function hasSeriousKnowledgeGaps(scores: Pick<QuizScores, "readinessScore" | "categoryScores">) {
  const percentages = categories.map((category) => scores.categoryScores[category].percentage);
  const lowestCategoryScore = Math.min(...percentages);
  const categoriesBelow40 = percentages.filter((score) => score < 40).length;

  return scores.readinessScore >= 65 && (lowestCategoryScore < 30 || categoriesBelow40 >= 2);
}

function getPersonalisedNextSteps(
  band: ResultBand,
  riskAreas: QuizCategory[],
  rankedCategories: QuizCategory[],
) {
  const priorityCategories = riskAreas.length > 0 ? riskAreas : rankedCategories.slice(0, 3);
  const categorySteps = priorityCategories.slice(0, 3).map((category) => categoryNextSteps[category]);

  return [bandNextSteps[band], ...categorySteps];
}

function normaliseScore(score: number, maxScore: number) {
  if (maxScore === 0) return 0;
  return Math.round(Math.pow(score / maxScore, scoreCurveExponent) * 100);
}
