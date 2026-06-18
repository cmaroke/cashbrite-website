import { categoryDescriptions, categoryLabels, type QuizCategory } from "@/data/quizQuestions";
import type { RegistrationData } from "@/lib/assessmentTypes";
import type { QuizScores, ResultBand } from "@/lib/quizScoring";

export type CreditLearningGuide = {
  basics: { explanation: string; example: string };
  responsibleUse: {
    explanation: string;
    example: { spent: string; repaid: string; interest: string };
    tip: string;
  };
  carryingBalance: {
    explanation: string;
    interestDefinition: string;
    aprDefinition: string;
    example: string;
  };
  comparison: {
    options: Array<{ title: string; amount: string; term: string; monthly: string; total: string }>;
    lesson: string;
    rule: string;
  };
  creditHistory: {
    explanation: string;
    positiveFactors: string[];
    negativeFactors: string[];
  };
};

export type PremiumPriorityArea = {
  category: QuizCategory;
  title: string;
  score: number;
  whyItMatters: string;
  commonMistakes: string;
  whatToLearn: string;
  realLifeExample: {
    title: string;
    summary: string;
    details: string[];
    takeaway: string;
  };
  moneySmartTip: string;
  creditLearningGuide?: CreditLearningGuide;
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
    whatToLearn: "A useful budget separates money into essentials, saving, flexible spending and a buffer. It is a plan you review, not a rule that punishes you when life changes.",
    realLifeExample: {
      title: "Planning £240 of monthly income",
      summary: "Alex earns £240 from part-time work and decides what the money needs to do before spending it.",
      details: [
        "Essentials, including travel and phone: £90",
        "Saving towards a laptop: £30",
        "Food out, clothes and social plans: £100",
        "Buffer for an unexpected cost: £20",
      ],
      takeaway: "£90 + £30 + £100 + £20 = £240. Every pound has a job, while the plan still includes saving, flexibility and a buffer.",
    },
    moneySmartTip: "Check your plan before spending, then review what actually happened. A budget becomes useful when you adjust it using real information.",
    actions: [
      "Review the last seven days of transactions and label each one essential, saving or flexible spending.",
      "Add up regular essentials such as travel, phone and food before deciding what is available for social spending.",
      "Use your real income to create four amounts: essentials, saving, flexible spending and a small buffer.",
      "Choose one spending limit for the next week and write down how you calculated it.",
      "Book a ten-minute weekly review to compare your plan with what you spent and make one realistic adjustment.",
    ],
  },
  savingHabits: {
    whyItMatters: "Savings create choices and breathing room when costs arrive early or plans change unexpectedly.",
    commonMistakes: "Waiting for a large amount to be left over, saving without a goal, or repeatedly moving savings back into a spending account.",
    whatToLearn: "A goal becomes easier to plan when it has an amount, a deadline and a regular contribution. Small, consistent payments can matter more than waiting for a perfect month.",
    realLifeExample: {
      title: "Saving £300 for a laptop",
      summary: "A £300 goal needed in 20 weeks can be turned into a clear weekly target.",
      details: ["Goal: £300", "Time available: 20 weeks", "Weekly saving needed: £300 ÷ 20 = £15"],
      takeaway: "Saving £15 each week would reach £300 in 20 weeks. If one week is missed, the target can be recalculated rather than abandoned.",
    },
    moneySmartTip: "Name a savings pot after the goal. A specific label such as Laptop makes the trade-off more visible than a pot called Savings.",
    actions: [
      "Choose one short-term goal and write down its target amount and target date.",
      "Divide the amount still needed by the number of weeks remaining to find a weekly target.",
      "Create a separate named savings pot so the goal is not mixed with everyday spending.",
      "Set a reminder or automatic transfer for shortly after income normally arrives.",
      "Review progress each week and recalculate the amount if your income or deadline changes.",
    ],
  },
  studentFinance: {
    whyItMatters: "Student finance has to cover real living and study costs across a whole term, not just the first few weeks.",
    commonMistakes: "Treating a termly payment as spare cash, overlooking bursaries, or comparing courses without comparing living costs.",
    whatToLearn: "Student finance systems differ across the UK. Where repayments apply, they are generally linked to income above the relevant threshold rather than simply to how much was borrowed. Thresholds, rates and plan rules can change, so official guidance matters.",
    realLifeExample: {
      title: "Turning a termly payment into a weekly plan",
      summary: "A student receives £4,200 to cover a 14-week term.",
      details: [
        "Termly money: £4,200 ÷ 14 weeks = £300 per week",
        "Rent: £190 per week",
        "Remaining for food, travel, study costs and other spending: £110 per week",
      ],
      takeaway: "The account may show £4,200 on day one, but the usable figure is closer to £300 per week before costs are paid.",
    },
    moneySmartTip: "Use the official student finance service for the UK nation where you normally live. Do not rely on a friend’s repayment plan because their rules may differ.",
    actions: [
      "Find the official student finance guidance for the UK nation where you normally live and note which repayment plan could apply.",
      "Write down expected termly income, then divide it by the exact number of weeks it must cover.",
      "Subtract realistic weekly rent, food, travel and course costs to see what remains.",
      "Check likely universities or colleges for bursaries, scholarships and hardship support, including eligibility and deadlines.",
      "Create a backup plan naming who you would contact and which costs you would prioritise if a payment were delayed.",
    ],
  },
  bankAccountsOverdrafts: {
    whyItMatters: "A bank account supports everyday money management, while an overdraft is still debt that needs a repayment plan.",
    commonMistakes: "Choosing an account for a freebie, treating an overdraft limit as income, or ignoring charges and repayment terms.",
    whatToLearn: "An arranged overdraft lets an account go below £0 up to an agreed limit. It is borrowed money, may have conditions or charges, and reduces the amount of new income available when money next enters the account.",
    realLifeExample: {
      title: "What happens when income enters an overdrawn account",
      summary: "Sam is £150 into an overdraft when £400 of wages arrives.",
      details: ["Starting balance: -£150", "Wages paid in: £400", "Available balance after clearing the overdraft: £250"],
      takeaway: "The £400 wage does not create £400 of spending money. £150 first brings the account back to £0.",
    },
    moneySmartTip: "Treat an overdraft as borrowing with an exit plan, not as an extension of your income.",
    actions: [
      "Compare two example accounts using the same headings: fees, alerts, overdraft rules, support and access features.",
      "Turn on low-balance and transaction notifications and choose a balance level that gives you time to act.",
      "Find the arranged and unarranged overdraft terms for your account and write them in plain language.",
      "If you might use an overdraft, calculate how much of your next income would be needed to return the balance to £0.",
      "Write a security checklist covering your PIN, password, one-time codes and what your bank would never ask you to share.",
    ],
  },
  creditBorrowing: {
    whyItMatters: "Borrowing choices can affect monthly cash flow, future applications and the total price paid for something.",
    commonMistakes: "Looking only at the monthly payment, treating a credit limit as spare money, or missing payments without asking for help.",
    whatToLearn: "Interest is the cost of borrowing money. APR stands for Annual Percentage Rate. It shows the yearly cost of borrowing, including interest and certain fees, expressed as a percentage. Credit history can be affected by credit card and personal loan repayments, mobile phone contracts, some utility bills, overdraft use, missed payments, defaults, many credit applications in a short period and electoral roll registration where eligible.",
    realLifeExample: {
      title: "A lower monthly payment can cost more overall",
      summary: "If you borrow £1,000 on a credit card with a 24% APR and only make small repayments, you could repay much more than £1,000 over time.",
      details: [
        "Option A: Borrow £5,000 over 3 years. Monthly repayment: £170. Total repaid: £6,120.",
        "Option B: Borrow £5,000 over 5 years. Monthly repayment: £115. Total repaid: £6,900.",
        "Option B costs £780 more overall, even though its monthly repayment is lower.",
      ],
      takeaway: "Always compare the total amount repayable, not just the monthly payment.",
    },
    moneySmartTip: "Before considering borrowing, write down the amount received, APR, term, monthly repayment, total repayable and missed-payment consequences in one comparison table.",
    creditLearningGuide: {
      basics: {
        explanation: "A credit card allows you to borrow money from a lender to buy something today and pay it back later.",
        example: "You buy a phone for £1,000 using a credit card. The £1,000 is not your money — it is money you have borrowed and agreed to pay back.",
      },
      responsibleUse: {
        explanation: "If you repay the full balance by the payment due date, you usually will not pay interest on purchases.",
        example: { spent: "£1,000", repaid: "£1,000 before the due date", interest: "£0" },
        tip: "Only spend what you know you can afford to repay.",
      },
      carryingBalance: {
        explanation: "If you do not repay the full balance, interest may be added. Making only minimum repayments can keep the balance around for much longer.",
        interestDefinition: "Interest is the cost you pay for borrowing money.",
        aprDefinition: "APR means Annual Percentage Rate. It gives an indication of the yearly cost of borrowing, including interest and certain charges, expressed as a percentage.",
        example: "You buy a £1,000 phone using a credit card with a 24% APR. If you only make minimum repayments each month, it could take years to clear the balance and you may pay hundreds of pounds in interest. Your £1,000 phone could end up costing significantly more.",
      },
      comparison: {
        options: [
          { title: "Option A", amount: "£5,000", term: "3 years", monthly: "£170", total: "£6,120" },
          { title: "Option B", amount: "£5,000", term: "5 years", monthly: "£115", total: "£6,900" },
        ],
        lesson: "Option B looks cheaper because the monthly payment is lower, but because you are borrowing the money for longer, you pay £780 more overall.",
        rule: "Always compare the total amount repayable, not just the monthly repayment.",
      },
      creditHistory: {
        explanation: "Your credit history is a record of how you have managed borrowing and certain financial commitments. Organisations may use it as one part of deciding whether to offer credit.",
        positiveFactors: [
          "Paying credit cards on time",
          "Repaying loans on time",
          "Managing mobile phone contracts",
          "Paying some utility bills as agreed",
          "Staying within agreed overdraft limits",
          "Being registered to vote where eligible",
        ],
        negativeFactors: [
          "Missing payments",
          "Going over agreed limits",
          "Defaulting on debts",
          "Making lots of credit applications in a short period",
        ],
      },
    },
    actions: [
      "Look at the £1,000 phone example and explain why the credit limit is borrowed money rather than extra income.",
      "Use a sample credit card statement to find the full balance, minimum payment, due date and any interest information.",
      "Rewrite interest and APR in your own words, then explain why paying only the minimum can increase the time and cost of repayment.",
      "Recreate the £5,000 comparison and highlight the £780 difference between the total repayment figures.",
      "Make two credit-history lists: habits that show payments are managed as agreed, and warning signs that could make future borrowing harder.",
    ],
  },
  buyNowPayLater: {
    whyItMatters: "BNPL splits a purchase into future commitments that can overlap with bills and other plans.",
    commonMistakes: "Using it for impulse buys, forgetting several due dates, or assuming interest-free means consequence-free.",
    whatToLearn: "Each instalment is a claim on future income. Several affordable-looking purchases can become one difficult payment total when their dates overlap.",
    realLifeExample: {
      title: "Three small purchases stacking up",
      summary: "Three £60 purchases are each split into three £20 instalments.",
      details: ["Trainers: £20 due", "Clothes: £20 due", "Event ticket: £20 due", "Combined payment due that month: £60"],
      takeaway: "The checkout showed £20 for each purchase, but together they created a £60 commitment before normal bills and spending.",
    },
    moneySmartTip: "Add every instalment to one calendar before making another purchase. Future-you needs to be able to afford the combined total.",
    actions: [
      "List every active or example BNPL instalment by amount and due date on one calendar, then calculate each month’s combined total.",
      "Read one provider’s terms and identify what happens after a late or missed payment.",
      "Use a 24-hour pause for a non-essential purchase and write down whether you still want it the next day.",
      "Check whether the full price could be paid today without using money needed for essentials; use the answer as an affordability warning sign.",
      "Remove saved checkout details or app notifications if they make unplanned purchases feel too automatic.",
    ],
  },
  fraudScamsOnlineSafety: {
    whyItMatters: "Scammers use urgency, trust and attractive opportunities to make people act before checking.",
    commonMistakes: "Clicking message links, sharing security codes, moving money for someone else, or staying silent through embarrassment.",
    whatToLearn: "A familiar logo or sender name does not prove a message is genuine. Safe checking means leaving the message, opening the official app or website independently and using contact details you trust.",
    realLifeExample: {
      title: "The fake bank security text",
      summary: "A text says: ‘Cashbrite Bank: A new device has accessed your account. Confirm now at secure-bank-check.example.’",
      details: [
        "Pressure signal: the message creates urgency",
        "Link signal: it asks you to use a link in the message",
        "Safe response: do not click; open the genuine banking app or call the official number",
      ],
      takeaway: "A real-looking message can still be fake. Check through a separate trusted channel before taking action.",
    },
    moneySmartTip: "Stop, leave the message and verify independently. A genuine organisation will allow you time to check.",
    actions: [
      "Turn on two-step verification for email and other important accounts, and store recovery details securely.",
      "Practise the safe response to the fake text: close it, open the official app independently and check there.",
      "Explain in your own words why receiving and forwarding money for someone else could involve you in money-mule activity.",
      "Save your bank’s official fraud number from its app, card or verified website rather than from a message.",
      "Choose a trusted person you will contact immediately if a payment request or account warning makes you feel rushed.",
    ],
  },
  payslipsTaxNi: {
    whyItMatters: "Understanding a payslip helps you confirm that your hours, pay and deductions are correct.",
    commonMistakes: "Confusing gross and net pay, ignoring tax codes, or failing to keep records when something looks wrong.",
    whatToLearn: "Gross pay is earnings before deductions. Net pay, sometimes called take-home pay, is what remains after deductions such as Income Tax, National Insurance or pension contributions where applicable.",
    realLifeExample: {
      title: "From gross pay to take-home pay",
      summary: "This simplified example shows how deductions reduce the amount paid into a bank account.",
      details: ["Gross pay: £1,200", "Income Tax: £80", "National Insurance: £40", "Pension contribution: £36", "Net pay: £1,044"],
      takeaway: "£1,200 - £80 - £40 - £36 = £1,044 take-home pay. Actual deductions depend on individual circumstances and current rules.",
    },
    moneySmartTip: "Compare the hours and rate on your payslip with your own records before checking the deductions.",
    actions: [
      "Use a sample payslip to highlight gross pay, each deduction, tax code and net pay in different colours.",
      "Multiply hours worked by the agreed hourly rate and compare the result with the gross-pay figure.",
      "Add the listed deductions and check that gross pay minus deductions equals net pay.",
      "Find where a tax code appears and note that payroll or HMRC can explain a code that seems unexpected.",
      "Create a secure payslip folder and record who to contact at work if hours, pay or deductions look wrong.",
    ],
  },
  movingOutRentBills: {
    whyItMatters: "Moving out involves upfront costs, legal commitments and shared bills that need planning before the move date.",
    commonMistakes: "Budgeting for rent alone, signing without reading terms, or leaving shared-payment expectations unclear.",
    whatToLearn: "Affordable housing costs include more than advertised rent. The full picture may include a deposit, energy, water, internet, food, travel, insurance and council tax where applicable.",
    realLifeExample: {
      title: "Rent is only the starting figure",
      summary: "A room advertised at £650 per month creates several other regular costs.",
      details: ["Rent: £650", "Energy: £80", "Water: £25", "Internet: £25", "Food: £180", "Travel: £100", "Illustrative monthly total: £1,060"],
      takeaway: "The example costs £410 more than rent alone, before one-off costs such as a deposit or moving items.",
    },
    moneySmartTip: "Build the complete monthly cost before judging whether a room is affordable. Check which bills are included and which are separate.",
    actions: [
      "Build a moving-out budget with separate sections for upfront costs and monthly costs.",
      "Ask which bills are included in rent, then estimate every bill that remains separate.",
      "Read a sample tenancy and highlight rent dates, deposit information, notice terms and shared responsibilities.",
      "Draft a housemate agreement showing who pays each bill, how costs are split and what happens if someone pays late.",
      "Put rent and estimated bill dates into a monthly calendar and compare the total with realistic income.",
    ],
  },
  moneyConfidence: {
    whyItMatters: "Confidence helps you pause, ask questions and take early action instead of avoiding decisions that feel difficult.",
    commonMistakes: "Pretending to understand, copying friends, avoiding messages, or believing one mistake means being bad with money.",
    whatToLearn: "Confidence does not mean knowing every answer. It means slowing down, checking the facts, asking for help and knowing the next safe step when something goes wrong.",
    realLifeExample: {
      title: "Pausing before a phone contract",
      summary: "A contract advertised as £25 per month for 24 months can be translated into a total commitment.",
      details: [
        "Monthly payment: £25",
        "Contract length: 24 months",
        "Total commitment: £25 × 24 = £600",
        "Questions to ask: What is included? Can the price change? What happens if I leave early?",
      ],
      takeaway: "Turning a monthly figure into a total and asking questions creates a calmer, more informed decision.",
    },
    moneySmartTip: "Use a three-step pause: What will this cost in total? What could go wrong? Who or what can help me check it?",
    actions: [
      "Name two trusted people and one impartial service you could use when a money decision feels unclear.",
      "Write five questions covering total cost, commitment length, changes, cancellation and missed payments.",
      "Use those questions to compare two examples without deciding that either product is right for you.",
      "Open one money message you have avoided, write down what it asks and choose the next safe step.",
      "Review one past decision without blame: record what happened, what you learned and what you would check next time.",
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
