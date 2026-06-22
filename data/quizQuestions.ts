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
  points: 0 | 1 | 2 | 3;
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
      { id: "b", label: "I keep a rough idea of what I want to use it for", points: 2 },
      { id: "c", label: "I decide what to save, spend and keep aside first", points: 3 },
      { id: "d", label: "I spend some and hope enough remains for what I need later", points: 1 },
    ],
  },
  {
    id: "budgeting-3",
    category: "budgetingSpending",
    prompt: "A friend invites you to something you cannot really afford. What is closest to your response?",
    answers: [
      { id: "a", label: "I go and work out the cost later", points: 0 },
      { id: "b", label: "I suggest something cheaper or say I cannot go", points: 3 },
      { id: "c", label: "I ask someone to pay and repay them later", points: 1 },
      { id: "d", label: "I check my spending plan before deciding", points: 2 },
    ],
  },
  {
    id: "budgeting-5",
    category: "budgetingSpending",
    prompt: "You have £30 left until you next receive money, but you see something you really want for £25. What do you do?",
    answers: [
      { id: "a", label: "Buy it now and worry about the rest later", points: 0 },
      { id: "b", label: "Keep needed money aside, then see if I can afford it", points: 3 },
      { id: "c", label: "Check what I still need money for before deciding", points: 2 },
      { id: "d", label: "Use credit or BNPL so I can keep the £30", points: 1 },
    ],
  },
  {
    id: "saving-2",
    category: "savingHabits",
    prompt: "You know you need money for a birthday, travel or course item next month. What do you do?",
    answers: [
      { id: "a", label: "Save a set amount towards it each week", points: 3 },
      { id: "b", label: "Wait and use whatever money I have next month", points: 0 },
      { id: "c", label: "Plan to spend less when the date gets closer", points: 1 },
      { id: "d", label: "Save whatever is left at the end of each week", points: 2 },
    ],
  },
  {
    id: "saving-3",
    category: "savingHabits",
    prompt: "What is the main purpose of an emergency fund?",
    answers: [
      { id: "a", label: "To cover an unexpected important cost without needing to borrow", points: 3 },
      { id: "b", label: "To cover planned spending when my usual money runs out", points: 0 },
      { id: "c", label: "To save for a future goal or planned purchase", points: 1 },
      { id: "d", label: "To cover small overspending at the end of a month", points: 2 },
    ],
  },
  {
    id: "saving-4",
    category: "savingHabits",
    prompt: "You want to save money for something important. What is the best way to stop yourself spending it?",
    answers: [
      { id: "a", label: "Leave it in my usual balance and try not to spend it", points: 1 },
      { id: "b", label: "Move it to a separate savings pot or account", points: 3 },
      { id: "c", label: "Keep the cash separately but do not track my progress", points: 2 },
      { id: "d", label: "Spend from it now and plan to replace it later", points: 0 },
    ],
  },
  {
    id: "student-finance-1",
    category: "studentFinance",
    prompt: "If you receive student maintenance money, what is it mainly designed to help pay for?",
    answers: [
      { id: "a", label: "Living costs such as rent, food, travel and course needs", points: 3 },
      { id: "b", label: "Mainly social activities and personal spending", points: 1 },
      { id: "c", label: "Only course costs such as books and equipment", points: 2 },
      { id: "d", label: "Any term-time spending, without needing a plan", points: 0 },
    ],
  },
  {
    id: "student-finance-4",
    category: "studentFinance",
    prompt: "Which support might be worth checking if money is tight while studying?",
    answers: [
      { id: "a", label: "Hardship funds, bursaries or student support services", points: 3 },
      { id: "b", label: "A short-term loan to cover the gap quickly", points: 0 },
      { id: "c", label: "An automatic extra student finance payment", points: 1 },
      { id: "d", label: "Help from friends or family before checking student support", points: 2 },
    ],
  },
  {
    id: "student-finance-5",
    category: "studentFinance",
    prompt: "You receive a large student finance payment at the start of term. What is the smartest way to manage it?",
    answers: [
      { id: "a", label: "Divide it across every week or month it must cover", points: 3 },
      { id: "b", label: "Spend what I need first, then budget what remains", points: 0 },
      { id: "c", label: "Keep a rough spending limit in my head", points: 1 },
      { id: "d", label: "Set aside essentials and check the balance regularly", points: 2 },
    ],
  },
  {
    id: "banking-2",
    category: "bankAccountsOverdrafts",
    prompt: "You spend more money than you have in your bank account and go into your arranged overdraft. What does this mean?",
    answers: [
      { id: "a", label: "Borrowing through my account that must be repaid and may cost money", points: 3 },
      { id: "b", label: "Extra account money I can use once the bank approves it", points: 0 },
      { id: "c", label: "A temporary balance extension that clears automatically", points: 1 },
      { id: "d", label: "Agreed borrowing repaid when money next enters my account", points: 2 },
    ],
  },
  {
    id: "banking-3",
    category: "bankAccountsOverdrafts",
    prompt: "You keep wondering where your money disappears each week. What could help you stay on track?",
    answers: [
      { id: "a", label: "Use spending alerts, notifications or separate money pots", points: 3 },
      { id: "b", label: "Check my balance only when it looks low", points: 1 },
      { id: "c", label: "Check my balance sometimes but not individual spending", points: 2 },
      { id: "d", label: "Move money between accounts when one runs low", points: 0 },
    ],
  },
  {
    id: "banking-4",
    category: "bankAccountsOverdrafts",
    prompt: "If you go into an arranged overdraft, what is a sensible next step?",
    answers: [
      { id: "a", label: "Check the cost and make a plan to repay it", points: 3 },
      { id: "b", label: "Wait for my next payment to clear it", points: 1 },
      { id: "c", label: "Spend less but set no repayment target", points: 2 },
      { id: "d", label: "Keep using it while I am within the limit", points: 0 },
    ],
  },
  {
    id: "credit-1",
    category: "creditBorrowing",
    prompt: "You buy something using money you will pay back later. What does this mean?",
    answers: [
      { id: "a", label: "I am borrowing money and agreeing to repay it", points: 3 },
      { id: "b", label: "The money becomes part of my available balance", points: 0 },
      { id: "c", label: "The payment is delayed without creating a debt", points: 1 },
      { id: "d", label: "I can decide how to repay after the bill arrives", points: 2 },
    ],
  },
  {
    id: "credit-3",
    category: "creditBorrowing",
    prompt: "You receive your monthly credit card statement. What is usually the best way to manage it?",
    answers: [
      { id: "a", label: "Pay the full statement balance when possible", points: 3 },
      { id: "b", label: "Pay the minimum and assume that is enough", points: 2 },
      { id: "c", label: "Leave it unpaid while I am within my limit", points: 0 },
      { id: "d", label: "Assume automatic payment will clear it without checking", points: 1 },
    ],
  },
  {
    id: "credit-5",
    category: "creditBorrowing",
    prompt: "What should you do if you think you cannot make a repayment?",
    answers: [
      { id: "a", label: "Contact the lender early or ask a free debt adviser", points: 3 },
      { id: "b", label: "Wait until I miss it, then explain", points: 2 },
      { id: "c", label: "Borrow elsewhere to make the repayment", points: 1 },
      { id: "d", label: "Cancel the payment and wait for the lender", points: 0 },
    ],
  },
  {
    id: "bnpl-1",
    category: "buyNowPayLater",
    prompt: "You see trainers online with a 'Buy Now Pay Later' option. What does this usually mean?",
    answers: [
      { id: "a", label: "Buy it now and repay later or in instalments", points: 3 },
      { id: "b", label: "Reserve it now and decide later whether to buy", points: 0 },
      { id: "c", label: "Split the cost without it counting as borrowing", points: 2 },
      { id: "d", label: "Receive it before choosing when to pay", points: 1 },
    ],
  },
  {
    id: "bnpl-2",
    category: "buyNowPayLater",
    prompt: "What is a risk of having several buy now pay later purchases at once?",
    answers: [
      { id: "a", label: "The payments can add up and become hard to track", points: 3 },
      { id: "b", label: "There is little risk if each payment looks affordable", points: 1 },
      { id: "c", label: "Providers may change all my due dates", points: 0 },
      { id: "d", label: "I might miss one, but the total should stay small", points: 2 },
    ],
  },
  {
    id: "bnpl-5",
    category: "buyNowPayLater",
    prompt: "Your Buy Now Pay Later payment is due tomorrow but you do not have enough money. What should you do?",
    answers: [
      { id: "a", label: "Contact the provider before I miss the payment", points: 3 },
      { id: "b", label: "Wait for it to fail, then contact them", points: 1 },
      { id: "c", label: "Use other short-term credit to cover it", points: 0 },
      { id: "d", label: "Deal with it when I next receive money", points: 2 },
    ],
  },
  {
    id: "scams-1",
    category: "fraudScamsOnlineSafety",
    prompt: "You receive a text saying your bank account is at risk and asking for your PIN. What should you do?",
    answers: [
      { id: "a", label: "Follow the instructions because it names my bank", points: 0 },
      { id: "b", label: "Check through the bank's official app or contact details", points: 3 },
      { id: "c", label: "Open the link and check whether the page looks genuine", points: 1 },
      { id: "d", label: "Search the number online before deciding whether to reply", points: 2 },
    ],
  },
  {
    id: "scams-3",
    category: "fraudScamsOnlineSafety",
    prompt: "What is a common warning sign of a scam?",
    answers: [
      { id: "a", label: "Pressure to act quickly or keep something secret", points: 3 },
      { id: "b", label: "A normal introductory offer for new customers", points: 0 },
      { id: "c", label: "A professional message that includes my name", points: 1 },
      { id: "d", label: "An unfamiliar website with contact details and reviews", points: 2 },
    ],
  },
  {
    id: "scams-5",
    category: "fraudScamsOnlineSafety",
    prompt: "What should you do if you think you have shared bank details with a scammer?",
    answers: [
      { id: "a", label: "Contact my bank immediately and follow its safety steps", points: 3 },
      { id: "b", label: "Watch the account and call only if money leaves", points: 0 },
      { id: "c", label: "Change my password and ask someone I trust", points: 2 },
      { id: "d", label: "Block the sender and assume my details are safe", points: 1 },
    ],
  },
  {
    id: "pay-1",
    category: "payslipsTaxNi",
    prompt: "You get your first payslip from a job. Why should you check it?",
    answers: [
      { id: "a", label: "To check my pay, deductions and take-home amount", points: 3 },
      { id: "b", label: "To compare the final amount with my bank account", points: 1 },
      { id: "c", label: "Only if the total looks clearly wrong", points: 0 },
      { id: "d", label: "To check my hours and rate, but not deductions", points: 2 },
    ],
  },
  {
    id: "pay-2",
    category: "payslipsTaxNi",
    prompt: "When you receive your pay, what does 'take-home pay' mean?",
    answers: [
      { id: "a", label: "Pay after deductions such as tax or National Insurance", points: 3 },
      { id: "b", label: "Pay before any deductions", points: 2 },
      { id: "c", label: "Basic pay before overtime or bonuses", points: 1 },
      { id: "d", label: "Money left after regular spending and bills", points: 0 },
    ],
  },
  {
    id: "pay-3",
    category: "payslipsTaxNi",
    prompt: "If your pay looks lower than expected, what should you check first?",
    answers: [
      { id: "a", label: "My hours, pay rate, tax code and deductions", points: 3 },
      { id: "b", label: "Only the amount paid into my bank", points: 1 },
      { id: "c", label: "My hours and pay rate, but not deductions", points: 2 },
      { id: "d", label: "Wait to see whether next month's pay is different", points: 0 },
    ],
  },
  {
    id: "moving-1",
    category: "movingOutRentBills",
    prompt: "You are preparing to move into your first place. Which costs should you plan for before you move in?",
    answers: [
      { id: "a", label: "Deposit, first rent, travel, basic items and setup costs", points: 3 },
      { id: "b", label: "Deposit and first rent, then work out everything else", points: 2 },
      { id: "c", label: "First rent and furniture, then arrange the deposit", points: 0 },
      { id: "d", label: "The advertised rent, with other costs planned after moving", points: 1 },
    ],
  },
  {
    id: "moving-3",
    category: "movingOutRentBills",
    prompt: "Why should you read a tenancy agreement before signing?",
    answers: [
      { id: "a", label: "To understand the costs, responsibilities, notice and rules", points: 3 },
      { id: "b", label: "To check the rent and move-in date only", points: 1 },
      { id: "c", label: "To confirm the costs, then rely on verbal agreements", points: 0 },
      { id: "d", label: "To skim the main terms and question anything unusual", points: 2 },
    ],
  },
  {
    id: "moving-4",
    category: "movingOutRentBills",
    prompt: "Which household bill can change depending on how much you use and who supplies it?",
    answers: [
      { id: "a", label: "Energy, because usage and the supplier's tariff affect the cost", points: 3 },
      { id: "b", label: "Council Tax, because it changes with monthly usage", points: 1 },
      { id: "c", label: "Rent, because it changes with household usage", points: 0 },
      { id: "d", label: "I know bills vary, but I am unsure which ones", points: 2 },
    ],
  },
  {
    id: "confidence-1",
    category: "moneyConfidence",
    prompt: "You see a money term online that you do not understand. What is the best thing to do?",
    answers: [
      { id: "a", label: "Ask someone trusted or check a reliable source", points: 3 },
      { id: "b", label: "Use the first clear explanation I find", points: 0 },
      { id: "c", label: "Work it out from comments online", points: 1 },
      { id: "d", label: "Save it and check a reliable source later", points: 2 },
    ],
  },
  {
    id: "confidence-3",
    category: "moneyConfidence",
    prompt: "Before making an important money decision, what is the smartest approach?",
    answers: [
      { id: "a", label: "Compare the options, full costs and possible consequences", points: 3 },
      { id: "b", label: "Choose the option with the lowest upfront cost", points: 2 },
      { id: "c", label: "Choose what worked for someone with similar needs", points: 0 },
      { id: "d", label: "Put off deciding because the options feel confusing", points: 1 },
    ],
  },
  {
    id: "confidence-4",
    category: "moneyConfidence",
    prompt: "If you make a money mistake, what is the most helpful response?",
    answers: [
      { id: "a", label: "Understand what happened, get help and make a recovery plan", points: 3 },
      { id: "b", label: "Replace the money quickly without reviewing what happened", points: 1 },
      { id: "c", label: "Stop checking my money for a while", points: 0 },
      { id: "d", label: "Note the mistake but keep the same approach", points: 2 },
    ],
  },
];
