export type QuizCategory =
  | "budgetingSpending"
  | "savingHabits"
  | "studentFinance"
  | "bankAccountsOverdrafts"
  | "creditBorrowing"
  | "buyNowPayLater"
  | "fraudScamsOnlineSafety"
  | "payslipsTaxNi"
  | "movingOutRentBills"
  | "moneyConfidence";

export type QuizAnswer = {
  id: string;
  label: string;
  points: 0 | 1 | 2 | 3 | 4;
};

export type QuizQuestion = {
  id: string;
  category: QuizCategory;
  prompt: string;
  answers: QuizAnswer[];
};

export const categoryLabels: Record<QuizCategory, string> = {
  budgetingSpending: "Budgeting and spending habits",
  savingHabits: "Saving habits",
  studentFinance: "Student finance understanding",
  bankAccountsOverdrafts: "Bank accounts and overdrafts",
  creditBorrowing: "Credit cards and borrowing",
  buyNowPayLater: "Buy now pay later",
  fraudScamsOnlineSafety: "Fraud, scams and online safety",
  payslipsTaxNi: "Payslips, tax and National Insurance",
  movingOutRentBills: "Moving out, rent and bills",
  moneyConfidence: "Money confidence and decision-making",
};

export const categoryDescriptions: Record<QuizCategory, string> = {
  budgetingSpending: "How you plan, track and adjust day-to-day spending.",
  savingHabits: "How you build buffers and prepare for future costs.",
  studentFinance: "How well you understand loans, maintenance money and support.",
  bankAccountsOverdrafts: "How you use accounts, cards, alerts and overdrafts.",
  creditBorrowing: "How you approach credit, borrowing costs and repayment.",
  buyNowPayLater: "How carefully you use short-term payment products.",
  fraudScamsOnlineSafety: "How you spot pressure, protect details and check requests.",
  payslipsTaxNi: "How confident you are reading pay, tax and deductions.",
  movingOutRentBills: "How prepared you are for rent, deposits, utilities and shared costs.",
  moneyConfidence: "How you make decisions, ask for help and recover from setbacks.",
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: "budgeting-1",
    category: "budgetingSpending",
    prompt: "When you receive money — such as birthday money, pocket money, a part-time job or wages — what do you usually do first?",
    answers: [
      { id: "a", label: "I spend most of it straight away and think about the rest later", points: 0 },
      { id: "b", label: "I keep a rough idea in my head of what I want to use it for", points: 2 },
      { id: "c", label: "I decide what I want to save, spend and keep aside before using it", points: 4 },
      { id: "d", label: "I spend some and hope I have enough left for what I need or want later", points: 1 },
    ],
  },
  {
    id: "budgeting-3",
    category: "budgetingSpending",
    prompt: "A friend invites you to something you cannot really afford. What is closest to your response?",
    answers: [
      { id: "a", label: "I go anyway and worry later", points: 0 },
      { id: "b", label: "I suggest a cheaper option or say I need to skip it", points: 4 },
      { id: "c", label: "I borrow from someone without a repayment plan", points: 1 },
      { id: "d", label: "I check my budget and decide after that", points: 3 },
    ],
  },
  {
    id: "budgeting-5",
    category: "budgetingSpending",
    prompt: "You have £30 left until you next receive money, but you see something you really want for £25. What do you do?",
    answers: [
      { id: "a", label: "Buy it and hope the remaining £5 is enough", points: 0 },
      { id: "b", label: "Pause and keep enough money for essentials until I next receive money", points: 4 },
      { id: "c", label: "Check what I still need to pay for before deciding", points: 2 },
      { id: "d", label: "Use credit or Buy Now Pay Later so I can keep the £30", points: 1 },
    ],
  },
  {
    id: "saving-2",
    category: "savingHabits",
    prompt: "You know you need money for a birthday, travel or course item next month. What do you do?",
    answers: [
      { id: "a", label: "Break the cost into smaller weekly amounts", points: 4 },
      { id: "b", label: "Hope I can cover it when it happens", points: 0 },
      { id: "c", label: "Think about it but do not change anything yet", points: 1 },
      { id: "d", label: "Put something aside if I remember", points: 2 },
    ],
  },
  {
    id: "saving-3",
    category: "savingHabits",
    prompt: "What is the main purpose of an emergency fund?",
    answers: [
      { id: "a", label: "To cover an unexpected important cost without having to panic or borrow", points: 4 },
      { id: "b", label: "To spend on treats whenever I want", points: 0 },
      { id: "c", label: "Only to use for holidays", points: 1 },
      { id: "d", label: "I have heard of it but I am not sure", points: 2 },
    ],
  },
  {
    id: "saving-4",
    category: "savingHabits",
    prompt: "You want to save money for something important. What is the best way to stop yourself spending it?",
    answers: [
      { id: "a", label: "Keep it with the rest of my money and try not to touch it", points: 1 },
      { id: "b", label: "Move it to a separate savings pot, account or safe place", points: 4 },
      { id: "c", label: "Keep it as cash somewhere and hope I remember not to spend it", points: 2 },
      { id: "d", label: "Leave it mixed in with money I can spend", points: 0 },
    ],
  },
  {
    id: "student-finance-1",
    category: "studentFinance",
    prompt: "If you receive student maintenance money, what is it mainly designed to help pay for?",
    answers: [
      { id: "a", label: "Living costs such as rent, food, travel and course needs", points: 4 },
      { id: "b", label: "Only nights out during freshers' week", points: 0 },
      { id: "c", label: "Only tuition fees", points: 1 },
      { id: "d", label: "Anything, because it does not need planning", points: 0 },
    ],
  },
  {
    id: "student-finance-4",
    category: "studentFinance",
    prompt: "Which support might be worth checking if money is tight while studying?",
    answers: [
      { id: "a", label: "Hardship funds, bursaries, scholarships or student support services", points: 4 },
      { id: "b", label: "Only payday loans", points: 0 },
      { id: "c", label: "Nothing, support is never available", points: 0 },
      { id: "d", label: "Rely only on friends to lend me money", points: 1 },
    ],
  },
  {
    id: "student-finance-5",
    category: "studentFinance",
    prompt: "You receive a large student finance payment at the start of term. What is the smartest way to manage it?",
    answers: [
      { id: "a", label: "Split it across the weeks or months it needs to cover", points: 4 },
      { id: "b", label: "Spend freely at first and plan later", points: 0 },
      { id: "c", label: "Keep a rough idea but not work out how long it needs to last", points: 1 },
      { id: "d", label: "Set aside obvious essentials and review often", points: 3 },
    ],
  },
  {
    id: "banking-2",
    category: "bankAccountsOverdrafts",
    prompt: "You spend more money than you have in your bank account and go into your arranged overdraft. What does this mean?",
    answers: [
      { id: "a", label: "Borrowing through your current account that may have rules or charges", points: 4 },
      { id: "b", label: "Free money that never needs repaying", points: 0 },
      { id: "c", label: "A savings account", points: 0 },
      { id: "d", label: "A reward for spending more", points: 1 },
    ],
  },
  {
    id: "banking-3",
    category: "bankAccountsOverdrafts",
    prompt: "You keep wondering where your money disappears each week. What could help you stay on track?",
    answers: [
      { id: "a", label: "Balance alerts, spending notifications or pots", points: 4 },
      { id: "b", label: "Turning off all notifications and never checking", points: 0 },
      { id: "c", label: "Using only contactless without tracking", points: 1 },
      { id: "d", label: "Relying on memory without checking what I spend", points: 0 },
    ],
  },
  {
    id: "banking-4",
    category: "bankAccountsOverdrafts",
    prompt: "If you go into an arranged overdraft, what is a sensible next step?",
    answers: [
      { id: "a", label: "Check any charges and make a plan to reduce it", points: 4 },
      { id: "b", label: "Ignore it because the bank allowed it", points: 0 },
      { id: "c", label: "Open more accounts to avoid seeing it", points: 1 },
      { id: "d", label: "Use it for non-essential spending as long as possible", points: 0 },
    ],
  },
  {
    id: "credit-1",
    category: "creditBorrowing",
    prompt: "You buy something using money you will pay back later. What does this mean?",
    answers: [
      { id: "a", label: "Borrowed money or a payment agreement that usually needs repaying", points: 4 },
      { id: "b", label: "Income you have earned", points: 0 },
      { id: "c", label: "A discount code", points: 0 },
      { id: "d", label: "Money I can spend without planning how to repay it", points: 1 },
    ],
  },
  {
    id: "credit-3",
    category: "creditBorrowing",
    prompt: "You receive your monthly credit card statement. What is usually the best way to manage it?",
    answers: [
      { id: "a", label: "Pay the full statement balance when possible", points: 4 },
      { id: "b", label: "Pay only the minimum amount each month", points: 1 },
      { id: "c", label: "Treat the available limit as extra money I can spend", points: 0 },
      { id: "d", label: "Use it to buy things for friends and assume they will pay me back", points: 0 },
    ],
  },
  {
    id: "credit-5",
    category: "creditBorrowing",
    prompt: "What should you do if you think you cannot make a repayment?",
    answers: [
      { id: "a", label: "Tell the lender early or ask a trusted person or free debt adviser for help", points: 4 },
      { id: "b", label: "Wait until missed payments build up", points: 0 },
      { id: "c", label: "Borrow more without checking the cost", points: 1 },
      { id: "d", label: "Delete the app and avoid messages", points: 0 },
    ],
  },
  {
    id: "bnpl-1",
    category: "buyNowPayLater",
    prompt: "You see trainers online with a 'Buy Now Pay Later' option. What does this usually mean?",
    answers: [
      { id: "a", label: "Get something now and pay later or in instalments", points: 4 },
      { id: "b", label: "Get things for free", points: 0 },
      { id: "c", label: "Avoid needing a budget", points: 0 },
      { id: "d", label: "Pay nothing unless I decide to later", points: 0 },
    ],
  },
  {
    id: "bnpl-2",
    category: "buyNowPayLater",
    prompt: "What is a risk of having several buy now pay later purchases at once?",
    answers: [
      { id: "a", label: "Small payments can stack up and become hard to track", points: 4 },
      { id: "b", label: "It makes every purchase cheaper", points: 0 },
      { id: "c", label: "It removes the need to check due dates", points: 0 },
      { id: "d", label: "There is no risk if each item is small", points: 1 },
    ],
  },
  {
    id: "bnpl-5",
    category: "buyNowPayLater",
    prompt: "Your Buy Now Pay Later payment is due tomorrow but you do not have enough money. What should you do?",
    answers: [
      { id: "a", label: "Contact the provider, check my options and ask for help before I miss it", points: 4 },
      { id: "b", label: "Ignore it because it is not a real bill", points: 0 },
      { id: "c", label: "Use another BNPL purchase to cover the problem", points: 0 },
      { id: "d", label: "Hope it does not matter", points: 1 },
    ],
  },
  {
    id: "scams-1",
    category: "fraudScamsOnlineSafety",
    prompt: "You receive a text saying your bank account is at risk and asking for your PIN. What should you do?",
    answers: [
      { id: "a", label: "Reply quickly so the account is safe", points: 0 },
      { id: "b", label: "Use official bank contact details or the app to check", points: 4 },
      { id: "c", label: "Click the link but enter only some details", points: 0 },
      { id: "d", label: "Forward it to friends first", points: 1 },
    ],
  },
  {
    id: "scams-3",
    category: "fraudScamsOnlineSafety",
    prompt: "What is a common warning sign of a scam?",
    answers: [
      { id: "a", label: "Pressure to act immediately or keep it secret", points: 4 },
      { id: "b", label: "A clear returns policy", points: 0 },
      { id: "c", label: "A normal receipt after checkout", points: 0 },
      { id: "d", label: "A website with contact information", points: 1 },
    ],
  },
  {
    id: "scams-5",
    category: "fraudScamsOnlineSafety",
    prompt: "What should you do if you think you have shared bank details with a scammer?",
    answers: [
      { id: "a", label: "Contact your bank immediately and follow their safety steps", points: 4 },
      { id: "b", label: "Wait a few days to see what happens", points: 0 },
      { id: "c", label: "Only tell friends online", points: 1 },
      { id: "d", label: "Delete the message and do nothing else", points: 0 },
    ],
  },
  {
    id: "pay-1",
    category: "payslipsTaxNi",
    prompt: "You get your first payslip from a job. Why should you check it?",
    answers: [
      { id: "a", label: "It shows pay earned, deductions and take-home pay", points: 4 },
      { id: "b", label: "It only shows your employer's logo", points: 0 },
      { id: "c", label: "It replaces a bank statement", points: 0 },
      { id: "d", label: "It only shows how many hours your friends worked", points: 0 },
    ],
  },
  {
    id: "pay-2",
    category: "payslipsTaxNi",
    prompt: "When you receive your pay, what does 'take-home pay' mean?",
    answers: [
      { id: "a", label: "The amount paid to you after deductions such as tax or National Insurance", points: 4 },
      { id: "b", label: "The amount before any deductions", points: 1 },
      { id: "c", label: "Only cash tips", points: 0 },
      { id: "d", label: "Money your employer keeps", points: 0 },
    ],
  },
  {
    id: "pay-3",
    category: "payslipsTaxNi",
    prompt: "If your pay looks lower than expected, what should you check first?",
    answers: [
      { id: "a", label: "Hours, rate of pay, tax code, deductions and whether anything changed", points: 4 },
      { id: "b", label: "Nothing, payslips are always wrong", points: 0 },
      { id: "c", label: "Only whether you spent too much", points: 1 },
      { id: "d", label: "Delete the payslip", points: 0 },
    ],
  },
  {
    id: "moving-1",
    category: "movingOutRentBills",
    prompt: "You are preparing to move into your first place. Which costs should you plan for before you move in?",
    answers: [
      { id: "a", label: "Deposit, first rent, travel, basic items and possible setup costs", points: 4 },
      { id: "b", label: "Only food for the first week", points: 1 },
      { id: "c", label: "Only streaming subscriptions", points: 0 },
      { id: "d", label: "Nothing until after moving day", points: 0 },
    ],
  },
  {
    id: "moving-3",
    category: "movingOutRentBills",
    prompt: "Why should you read a tenancy agreement before signing?",
    answers: [
      { id: "a", label: "It explains responsibilities, rent, deposits, notice and rules", points: 4 },
      { id: "b", label: "It is only paperwork and never matters", points: 0 },
      { id: "c", label: "Only to find the Wi-Fi password", points: 0 },
      { id: "d", label: "To see if it has nice formatting", points: 1 },
    ],
  },
  {
    id: "moving-4",
    category: "movingOutRentBills",
    prompt: "Which household bill can change depending on how much you use and who supplies it?",
    answers: [
      { id: "a", label: "Energy, water, broadband or mobile costs", points: 4 },
      { id: "b", label: "Every bill is always fixed forever", points: 0 },
      { id: "c", label: "Only clothes shopping", points: 0 },
      { id: "d", label: "I am not sure, but I know bills can vary", points: 2 },
    ],
  },
  {
    id: "confidence-1",
    category: "moneyConfidence",
    prompt: "You see a money term online that you do not understand. What is the best thing to do?",
    answers: [
      { id: "a", label: "Ask a trusted person or check a reliable source", points: 4 },
      { id: "b", label: "Pretend I understand and carry on", points: 0 },
      { id: "c", label: "Guess from social media comments", points: 1 },
      { id: "d", label: "Save the question and look it up later", points: 3 },
    ],
  },
  {
    id: "confidence-3",
    category: "moneyConfidence",
    prompt: "Before making an important money decision, what is the smartest approach?",
    answers: [
      { id: "a", label: "Compare options, costs and consequences before deciding", points: 4 },
      { id: "b", label: "Choose whatever feels easiest in the moment", points: 1 },
      { id: "c", label: "Copy what a friend did without checking if it fits me", points: 0 },
      { id: "d", label: "Keep putting it off because it feels confusing", points: 1 },
    ],
  },
  {
    id: "confidence-4",
    category: "moneyConfidence",
    prompt: "If you make a money mistake, what is the most helpful response?",
    answers: [
      { id: "a", label: "Work out what happened, get help if needed and make a recovery plan", points: 4 },
      { id: "b", label: "Hide it from everyone and hope it disappears", points: 0 },
      { id: "c", label: "Blame yourself and stop checking your money", points: 0 },
      { id: "d", label: "Notice it but avoid changing anything", points: 1 },
    ],
  },
];
