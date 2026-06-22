import { categoryDescriptions, categoryLabels, type QuizCategory } from "@/data/quizQuestions";
import type { ActionPlan, PriorityAreaPlan, RegistrationData } from "@/lib/assessmentTypes";
import { hasSeriousKnowledgeGaps, type QuizScores, type ResultBand } from "@/lib/quizScoring";

const bandSummaries: Record<ResultBand, string> = {
  "Getting Started":
    "You are at the beginning of building money confidence, and that is a completely valid place to start. Focus first on simple habits and trusted support so everyday decisions feel more manageable.",
  "Building Money Confidence":
    "You have useful knowledge to build from. Your next step is to strengthen the areas that could become expensive or stressful when income, study costs, work or living arrangements change.",
  "Nearly Money Ready":
    "You are close to being ready for many real-world money decisions. Keep checking the details, comparing options and using trusted support before signing up to products or commitments.",
  "Money Ready":
    "You are showing strong money awareness and decision-making. Keep reviewing your habits as life changes, and remember that confidence is strongest when it stays curious and cautious.",
};

const categoryPlans: Record<QuizCategory, Omit<PriorityAreaPlan, "category" | "title">> = {
  budgetingSpending: {
    whyItMatters:
      "Budgeting helps you make money last across travel, food, study costs, social plans and unexpected essentials.",
    commonMistakes:
      "Young people often forget small regular spends, rely on mental maths, or only check their balance when money already feels tight.",
    actions: [
      "List your weekly essentials first: travel, food, phone, study costs and regular payments.",
      "Set a realistic flexible spending amount before the week starts.",
      "Check your banking app before spending, not just after.",
      "Review one week of transactions and spot three spending patterns.",
    ],
  },
  savingHabits: {
    whyItMatters:
      "Saving gives you breathing room when plans change, costs arrive early, or an opportunity needs money upfront.",
    commonMistakes:
      "A common mistake is waiting until there is a large amount spare, instead of building small buffers consistently.",
    actions: [
      "Open or use a separate savings pot for a clear short-term goal.",
      "Start with a small target such as £50 to £100.",
      "Move money into savings soon after income arrives.",
      "Name one upcoming cost and split it into weekly amounts.",
    ],
  },
  studentFinance: {
    whyItMatters:
      "Student finance decisions affect rent, travel, food, course costs and how much pressure you feel during each term.",
    commonMistakes:
      "Students can treat a termly payment like one big balance, forget local living costs, or miss support such as bursaries and hardship funds.",
    actions: [
      "Estimate rent, travel, food and course costs before choosing a course or accommodation.",
      "Divide termly money by the number of weeks it needs to cover.",
      "Check what bursaries, scholarships or hardship support may be available.",
      "Plan what you would do if a payment was delayed.",
    ],
  },
  bankAccountsOverdrafts: {
    whyItMatters:
      "Your bank account is the base for everyday money management, and overdrafts are borrowing even when they feel easy to use.",
    commonMistakes:
      "People often choose accounts for freebies, ignore overdraft terms, or share account details too casually.",
    actions: [
      "Compare account fees, alerts, overdraft rules and app features.",
      "Turn on balance or spending notifications.",
      "Write down what an arranged overdraft would cost and how it would be repaid.",
      "Never share your PIN, card or banking login.",
    ],
  },
  creditBorrowing: {
    whyItMatters:
      "Credit can affect future choices such as phone contracts, renting, car finance and other applications.",
    commonMistakes:
      "Common mistakes include seeing credit limits as income, only looking at monthly payments, or avoiding help after a missed payment.",
    actions: [
      "Before borrowing, compare the total amount repayable, not just the monthly payment.",
      "Check interest, fees and missed-payment consequences.",
      "Pay agreed bills on time where possible.",
      "Speak to the lender or a free debt advice service early if repayment looks difficult.",
    ],
  },
  buyNowPayLater: {
    whyItMatters:
      "Buy Now Pay Later can make spending feel smaller than it is, especially when several payments overlap.",
    commonMistakes:
      "Young people may forget due dates, use BNPL for wants they cannot afford today, or stack up multiple small payments.",
    actions: [
      "List all BNPL payments beside your normal bills.",
      "Pause before using BNPL for anything you could not afford today.",
      "Check late fees, payment dates and provider terms.",
      "Keep BNPL for planned purchases only, not impulse spending.",
    ],
  },
  fraudScamsOnlineSafety: {
    whyItMatters:
      "Scams often target young people through urgency, social media, fake jobs, bargains and requests to move money.",
    commonMistakes:
      "People can click links under pressure, share codes or PINs, pay by bank transfer too quickly, or keep suspicious requests secret.",
    actions: [
      "Pause before clicking links, sending money or sharing details.",
      "Use official contact details to check bank or delivery messages.",
      "Be wary of jobs asking you to move money through your account.",
      "Contact your bank immediately if you think details have been shared.",
    ],
  },
  payslipsTaxNi: {
    whyItMatters:
      "Understanding payslips helps you check whether you have been paid correctly and what deductions mean.",
    commonMistakes:
      "People often confuse gross pay with take-home pay, ignore tax codes, or fail to keep payslip records.",
    actions: [
      "Find gross pay, deductions and take-home pay on your next payslip.",
      "Check your hours and rate of pay match what you expected.",
      "Save or download payslips somewhere secure.",
      "Ask payroll, a manager or trusted adult if something looks wrong.",
    ],
  },
  movingOutRentBills: {
    whyItMatters:
      "Moving out brings upfront costs, shared responsibilities and regular bills that can quickly become stressful without a plan.",
    commonMistakes:
      "Common mistakes include forgetting deposits, not reading tenancy terms, and failing to agree shared bills early.",
    actions: [
      "List deposit, first rent, travel, basic items and setup costs.",
      "Read tenancy terms before signing anything.",
      "Agree who pays each shared bill and when.",
      "Keep a monthly bill calendar with due dates.",
    ],
  },
  moneyConfidence: {
    whyItMatters:
      "Money confidence helps you pause, ask better questions and recover from mistakes before they grow.",
    commonMistakes:
      "People often pretend they understand, copy friends, avoid opening messages, or wait until a problem feels urgent.",
    actions: [
      "Choose one trusted person or service you can ask for money help.",
      "Write down questions before making bigger decisions.",
      "Compare at least two options before signing up to a financial product.",
      "Treat mistakes as information: review what happened and make a recovery plan.",
    ],
  },
};

export function getPriorityCategories(scores: QuizScores) {
  return (Object.keys(scores.categoryScores) as QuizCategory[])
    .sort((a, b) => scores.categoryScores[a].percentage - scores.categoryScores[b].percentage)
    .slice(0, 3);
}

export function generateActionPlan(registration: RegistrationData, scores: QuizScores): ActionPlan {
  const firstName = registration.firstName;
  const priorityCategories = getPriorityCategories(scores);
  const strengthCategories = scores.strengths.length > 0 ? scores.strengths : getTopCategories(scores).slice(0, 3);
  const summary = hasSeriousKnowledgeGaps(scores)
    ? "Your overall score shows a strong foundation, but your assessment also identified a few important gaps. These areas matter because they can affect real-life money decisions, so your Money Ready Plan focuses on helping you build confidence where it counts most."
    : bandSummaries[scores.band];

  return {
    summary: `${firstName}, your result is ${scores.band}. ${summary}`,
    priorityAreas: priorityCategories.map((category) => ({
      category,
      title: categoryLabels[category],
      ...categoryPlans[category],
    })),
    strengths: strengthCategories.map((category) => ({
      category,
      title: categoryLabels[category],
      explanation: `${categoryDescriptions[category]} This can support you in adult life because strong money habits tend to make bigger choices feel calmer and more manageable.`,
    })),
    challenge: [
      "Day 1-3: Check your balance and list your regular weekly costs.",
      "Day 4-7: Create one simple budget for essentials, flexible spending and saving.",
      "Week 2: Open or name a savings pot and set one realistic target.",
      "Week 3: Review one financial product or agreement, such as a bank account, overdraft or BNPL provider.",
      "Week 4: Practise a scam-safety pause: check links, sender details and payment requests before acting.",
      "End of month: Review what felt easier, what still feels unclear and who you could ask for help.",
    ],
    nextStepsMessage:
      "Financial confidence is a skill, not a personality trait. You build it through small checks, better questions and steady habits over time.",
  };
}

export function createActionPlanSummary(actionPlan: ActionPlan) {
  const priorities = actionPlan.priorityAreas.map((area) => area.title).join(", ");
  return `${actionPlan.summary} Top priorities: ${priorities}.`;
}

function getTopCategories(scores: QuizScores) {
  return (Object.keys(scores.categoryScores) as QuizCategory[]).sort(
    (a, b) => scores.categoryScores[b].percentage - scores.categoryScores[a].percentage,
  );
}
