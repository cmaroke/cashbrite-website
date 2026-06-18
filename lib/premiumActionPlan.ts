import { categoryDescriptions, categoryLabels, type QuizCategory } from "@/data/quizQuestions";
import type { RegistrationData } from "@/lib/assessmentTypes";
import type { QuizScores, ResultBand } from "@/lib/quizScoring";

export type PremiumPriorityArea = {
  category: QuizCategory;
  title: string;
  score: number;
  whyItMatters: string;
  commonMistakes: string;
  whatToLearn: string;
  actions: string[];
};

export type PremiumActionPlan = {
  moneyPersonality: { title: string; description: string };
  personalMoneyProfile: string;
  categoryScores: Array<{ category: QuizCategory; title: string; score: number }>;
  strengths: Array<{ category: QuizCategory; title: string; explanation: string; score: number }>;
  opportunities: Array<{ category: QuizCategory; title: string; score: number }>;
  priorityAreas: PremiumPriorityArea[];
  roadmap: Array<{ week: string; focus: string; actions: string[] }>;
  parentConversationGuide: string[];
  checklist: Array<{ topic: string; prompt: string }>;
  confidenceTracker: {
    currentScore: number;
    goalScore: number;
    improvementAreas: string[];
  };
  recommendedNextSteps: string[];
};

type CategoryGuidance = Omit<PremiumPriorityArea, "category" | "title" | "score">;

const profileByBand: Record<ResultBand, string> = {
  "Money Foundations Needed":
    "You are at the start of your money-confidence journey. Your plan focuses on a few clear foundations so everyday choices feel less uncertain and more manageable.",
  "Getting Started":
    "You have begun building useful money awareness. Your plan will help turn that early knowledge into practical habits you can rely on when study, work and living costs become more independent.",
  "Building Confidence":
    "You have a sound base and are ready to make it more consistent. Your plan targets the details most likely to protect your money and reduce stress as your responsibilities grow.",
  "Nearly Money Ready":
    "You already approach many money decisions thoughtfully. Your plan will sharpen the remaining gaps and help you prepare for bigger commitments with calm, informed confidence.",
  "Money Ready":
    "You are showing strong financial awareness and judgement. Your plan is designed to help you maintain those strengths, pressure-test your choices and stay ready as life changes.",
};

const personalityByBand: Record<ResultBand, { title: string; description: string }> = {
  "Money Foundations Needed": {
    title: "The Foundation Builder",
    description: "You are ready to turn unfamiliar money topics into simple, repeatable foundations.",
  },
  "Getting Started": {
    title: "The Curious Starter",
    description: "You have useful instincts and are beginning to connect them with practical everyday habits.",
  },
  "Building Confidence": {
    title: "The Practical Progressor",
    description: "You understand many of the basics and learn best by applying them to real decisions.",
  },
  "Nearly Money Ready": {
    title: "The Thoughtful Planner",
    description: "You usually pause, compare and plan, with a few details left to strengthen before greater independence.",
  },
  "Money Ready": {
    title: "The Confident Navigator",
    description: "You show strong awareness and judgement while staying alert to changing circumstances and new risks.",
  },
};

const nextStepsByBand: Record<ResultBand, string[]> = {
  "Money Foundations Needed": [
    "Complete one priority action at a time rather than trying to change everything at once.",
    "Ask a trusted adult to work through unfamiliar terms or decisions with you.",
    "Repeat the Money Readiness Assessment after 30 days to see what has improved.",
  ],
  "Getting Started": [
    "Turn the first two roadmap actions into regular weekly habits.",
    "Keep a short list of money questions and check them with a trusted source.",
    "Review your progress at the end of the month and choose your next focus.",
  ],
  "Building Confidence": [
    "Practise your weaker topics using real figures from your own plans.",
    "Compare options before your next financial commitment, even when the amount seems small.",
    "Share your roadmap with someone who can keep you accountable.",
  ],
  "Nearly Money Ready": [
    "Use your priority areas to check the detail behind your otherwise strong decisions.",
    "Prepare a realistic plan for one upcoming change such as university, work or moving out.",
    "Keep reviewing financial products and commitments as their terms change.",
  ],
  "Money Ready": [
    "Maintain your habits with a short monthly money review.",
    "Plan ahead for a bigger goal and test how different choices affect it.",
    "Stay curious and verify unfamiliar products, messages and financial claims.",
  ],
};

const guidance: Record<QuizCategory, CategoryGuidance> = {
  budgetingSpending: {
    whyItMatters: "A realistic budget gives every pound a purpose while leaving room for normal life and changing plans.",
    commonMistakes: "Relying on a bank balance, missing small repeat purchases, or making a budget so strict that it is quickly abandoned.",
    whatToLearn: "How to separate essentials, flexible spending, saving and irregular costs using a weekly or monthly plan.",
    actions: [
      "Review the last seven days of transactions and label each spend.",
      "Write down your essential weekly costs before planning social spending.",
      "Set one realistic flexible-spending limit for the coming week.",
      "Add a small buffer for costs you cannot predict exactly.",
      "Choose a regular day to check and adjust your budget.",
    ],
  },
  savingHabits: {
    whyItMatters: "Savings create choices and breathing room when costs arrive early or plans change unexpectedly.",
    commonMistakes: "Waiting for a large amount to be left over, saving without a goal, or repeatedly moving savings back into a spending account.",
    whatToLearn: "How small automatic amounts, named savings pots and clear timescales make goals easier to reach.",
    actions: [
      "Choose one specific short-term savings goal and give it a target date.",
      "Create a separate savings pot so the money is not mixed with spending funds.",
      "Work out the weekly amount needed to reach your goal.",
      "Move a small amount to savings as soon as income arrives.",
      "Track progress weekly and adjust the target without giving up.",
    ],
  },
  studentFinance: {
    whyItMatters: "Student finance has to cover real living and study costs across a whole term, not just the first few weeks.",
    commonMistakes: "Treating a termly payment as spare cash, overlooking bursaries, or comparing courses without comparing living costs.",
    whatToLearn: "What support may be available, how repayments work, and how to turn termly income into a usable weekly budget.",
    actions: [
      "Check official student finance guidance for the nation where you normally live.",
      "Estimate rent, food, travel and course costs for one realistic term.",
      "Divide expected termly money by the weeks it must cover.",
      "Research bursaries, scholarships and hardship support at likely institutions.",
      "Write a backup plan for a delayed or lower-than-expected payment.",
    ],
  },
  bankAccountsOverdrafts: {
    whyItMatters: "A bank account supports everyday money management, while an overdraft is still debt that needs a repayment plan.",
    commonMistakes: "Choosing an account for a freebie, treating an overdraft limit as income, or ignoring charges and repayment terms.",
    whatToLearn: "How to compare account features, protect access details and understand arranged and unarranged overdrafts.",
    actions: [
      "Compare alerts, fees, overdraft terms and support across two accounts.",
      "Turn on low-balance and transaction notifications.",
      "Find the overdraft limit and charges on your current or planned account.",
      "Write down how you would repay any overdraft used.",
      "Review the information you should never share, including PINs and one-time codes.",
    ],
  },
  creditBorrowing: {
    whyItMatters: "Borrowing choices can affect monthly cash flow, future applications and the total price paid for something.",
    commonMistakes: "Looking only at the monthly payment, treating a credit limit as spare money, or missing payments without asking for help.",
    whatToLearn: "How interest, total repayable, credit files and missed payments affect the real cost and consequences of borrowing.",
    actions: [
      "Compare the total repayable on two example borrowing offers.",
      "Learn the difference between an interest rate and APR.",
      "List the bills or agreements that may contribute to a credit history.",
      "Create a reminder for every payment due date.",
      "Save the details of a free debt-advice service before you ever need it.",
    ],
  },
  buyNowPayLater: {
    whyItMatters: "BNPL splits a purchase into future commitments that can overlap with bills and other plans.",
    commonMistakes: "Using it for impulse buys, forgetting several due dates, or assuming interest-free means consequence-free.",
    whatToLearn: "How to track instalments, check provider terms and decide whether a purchase is affordable before delaying payment.",
    actions: [
      "List every active or example BNPL payment on one calendar.",
      "Check the late-payment and affordability terms of one provider.",
      "Use a 24-hour pause before choosing BNPL for a non-essential purchase.",
      "Ask whether you could afford the full price today without using essential money.",
      "Remove saved checkout details if they encourage unplanned spending.",
    ],
  },
  fraudScamsOnlineSafety: {
    whyItMatters: "Scammers use urgency, trust and attractive opportunities to make people act before checking.",
    commonMistakes: "Clicking message links, sharing security codes, moving money for someone else, or staying silent through embarrassment.",
    whatToLearn: "How to pause, verify requests independently, protect accounts and report suspected fraud quickly.",
    actions: [
      "Turn on two-step verification for your email and banking access.",
      "Practise checking a message through an organisation's official website or app.",
      "Learn why moving money for someone else can make you a money mule.",
      "Save your bank's official fraud-contact details.",
      "Agree that you will tell a trusted person immediately if a message worries you.",
    ],
  },
  payslipsTaxNi: {
    whyItMatters: "Understanding a payslip helps you confirm that your hours, pay and deductions are correct.",
    commonMistakes: "Confusing gross and net pay, ignoring tax codes, or failing to keep records when something looks wrong.",
    whatToLearn: "How gross pay becomes take-home pay and where to find tax, National Insurance, pension and payroll details.",
    actions: [
      "Use a sample payslip to locate gross pay, deductions and net pay.",
      "Check that hours multiplied by pay rate match the expected gross figure.",
      "Learn where the tax code appears and what to do if it looks wrong.",
      "Create a secure place to keep payslips and employment documents.",
      "Write down who to contact at work about a pay query.",
    ],
  },
  movingOutRentBills: {
    whyItMatters: "Moving out involves upfront costs, legal commitments and shared bills that need planning before the move date.",
    commonMistakes: "Budgeting for rent alone, signing without reading terms, or leaving shared-payment expectations unclear.",
    whatToLearn: "How deposits, tenancy terms, utilities, council tax rules and household responsibilities fit together.",
    actions: [
      "Build an example moving-out budget including deposit and setup costs.",
      "List the regular bills that may sit alongside rent.",
      "Read a sample tenancy and highlight payment and notice terms.",
      "Draft a simple agreement for splitting bills with housemates.",
      "Create a monthly calendar for rent, utilities and other due dates.",
    ],
  },
  moneyConfidence: {
    whyItMatters: "Confidence helps you pause, ask questions and take early action instead of avoiding decisions that feel difficult.",
    commonMistakes: "Pretending to understand, copying friends, avoiding messages, or believing one mistake means being bad with money.",
    whatToLearn: "How to use a repeatable decision process, trusted support and calm recovery steps when something goes wrong.",
    actions: [
      "Name two trusted people or services you could ask for money help.",
      "Write three questions to ask before accepting a financial product.",
      "Compare two options for one upcoming spending decision.",
      "Open and deal with one money message you have been putting off.",
      "Review one past decision and write down what it taught you.",
    ],
  },
};

const checklistCategories: Array<{ category: QuizCategory; topic: string; prompt: string }> = [
  { category: "budgetingSpending", topic: "Budgeting", prompt: "I can make and review a realistic weekly or monthly budget." },
  { category: "savingHabits", topic: "Saving", prompt: "I have a savings goal and a regular way to work towards it." },
  { category: "bankAccountsOverdrafts", topic: "Bank accounts", prompt: "I can compare account features, fees, alerts and overdraft terms." },
  { category: "studentFinance", topic: "Student finance", prompt: "I know where to check support, costs and repayment information." },
  { category: "payslipsTaxNi", topic: "Payslips", prompt: "I can identify gross pay, deductions and take-home pay." },
  { category: "payslipsTaxNi", topic: "Tax and National Insurance", prompt: "I understand why tax and National Insurance may be deducted from pay." },
  { category: "creditBorrowing", topic: "Credit scores", prompt: "I understand how borrowing and payment behaviour can affect my credit history." },
  { category: "creditBorrowing", topic: "Credit cards", prompt: "I compare total cost and understand interest, limits and missed-payment consequences." },
  { category: "buyNowPayLater", topic: "Buy Now Pay Later", prompt: "I treat every instalment as borrowing and track its due date." },
  { category: "fraudScamsOnlineSafety", topic: "Scams", prompt: "I pause and verify unexpected payment or security requests." },
  { category: "movingOutRentBills", topic: "Renting", prompt: "I know to budget for deposits and read tenancy terms before signing." },
  { category: "movingOutRentBills", topic: "Bills", prompt: "I can plan for utilities, due dates and shared household responsibilities." },
];

export function generatePremiumActionPlan(
  registration: Pick<RegistrationData, "firstName" | "age" | "userType">,
  scores: QuizScores,
): PremiumActionPlan {
  const priorityCategories = getPremiumPriorityCategories(scores);
  const priorityAreas = priorityCategories.map((category) => ({
    category,
    title: categoryLabels[category],
    score: scores.categoryScores[category].percentage,
    ...guidance[category],
  }));
  const strengthCategories = getPremiumStrengthCategories(scores);

  return {
    moneyPersonality: personalityByBand[scores.band],
    personalMoneyProfile: `${registration.firstName}, at age ${registration.age}, your ${scores.band} result shows where your money knowledge already supports you and where a little focused practice will make the biggest difference. ${profileByBand[scores.band]} This plan is tailored for you as a ${registration.userType.toLowerCase()}.`,
    categoryScores: (Object.keys(scores.categoryScores) as QuizCategory[]).map((category) => ({
      category,
      title: categoryLabels[category],
      score: scores.categoryScores[category].percentage,
    })),
    strengths: strengthCategories.map((category) => ({
      category,
      title: categoryLabels[category],
      explanation: categoryDescriptions[category],
      score: scores.categoryScores[category].percentage,
    })),
    opportunities: priorityAreas.map(({ category, title, score }) => ({ category, title, score })),
    priorityAreas,
    roadmap: [
      {
        week: "Week 1",
        focus: "Build your foundations",
        actions: [
          priorityAreas[0].actions[0],
          priorityAreas[0].actions[1],
          "Choose one regular day for a ten-minute money check-in.",
        ],
      },
      {
        week: "Week 2",
        focus: "Understand your money",
        actions: [
          priorityAreas[1].actions[0],
          priorityAreas[1].actions[1],
          "Explain one new money term in your own words to a trusted person.",
        ],
      },
      {
        week: "Week 3",
        focus: "Become credit confident",
        actions: [
          "Compare the total cost, terms and consequences before using any form of borrowing.",
          "Review how overdrafts, credit cards and Buy Now Pay Later create future payment commitments.",
          priorityAreas[2].actions[0],
        ],
      },
      {
        week: "Week 4",
        focus: "Prepare for adult life",
        actions: [
          priorityAreas[2].actions[1],
          "Complete the Money Ready Checklist and mark the topics that still need support.",
          "Choose one habit to continue for the next 90 days and share your goal with someone you trust.",
        ],
      },
    ],
    parentConversationGuide: [
      `What money decision feels most likely to come up for you in the next year?`,
      `Which part of ${priorityAreas[0].title.toLowerCase()} feels least clear, and how could we explore it together?`,
      "What did you learn about money through experience that you wish had been explained earlier?",
      "How should we handle it if a bill, scam message or borrowing problem ever feels worrying?",
      "What is one money responsibility you could practise independently this month?",
    ],
    checklist: checklistCategories.map(({ topic, prompt }) => ({ topic, prompt })),
    confidenceTracker: {
      currentScore: scores.readinessScore,
      goalScore: Math.min(100, scores.readinessScore + 15),
      improvementAreas: priorityAreas.map((area) => area.title),
    },
    recommendedNextSteps: nextStepsByBand[scores.band],
  };
}

export function getPremiumPriorityCategories(scores: QuizScores) {
  return (Object.keys(scores.categoryScores) as QuizCategory[])
    .sort((a, b) => scores.categoryScores[a].percentage - scores.categoryScores[b].percentage)
    .slice(0, 3);
}

function getPremiumStrengthCategories(scores: QuizScores) {
  const ranked = (Object.keys(scores.categoryScores) as QuizCategory[]).sort(
    (a, b) => scores.categoryScores[b].percentage - scores.categoryScores[a].percentage,
  );
  return scores.strengths.length > 0 ? scores.strengths.slice(0, 3) : ranked.slice(0, 3);
}

export function getPremiumPreview(plan: PremiumActionPlan) {
  return {
    personalMoneyProfile: plan.personalMoneyProfile,
    priorityAreas: plan.priorityAreas.map(({ category, title, score, whyItMatters }) => ({
      category,
      title,
      score,
      whyItMatters,
    })),
  };
}
