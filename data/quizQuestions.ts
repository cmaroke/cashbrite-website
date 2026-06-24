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
    prompt: "When money comes in, what would you most likely do first?",
    answers: [
      { id: "a", label: "Spend first and think about it later", points: 0 },
      { id: "b", label: "Keep it while I decide", points: 2 },
      { id: "c", label: "Split it between spending, saving and needs", points: 3 },
      { id: "d", label: "Spend some and save what is left", points: 1 },
    ],
  },
  {
    id: "budgeting-3",
    category: "budgetingSpending",
    prompt: "You realise your money is running out faster than expected. What would you most likely do?",
    answers: [
      { id: "a", label: "Ignore it and hope it works out", points: 0 },
      { id: "b", label: "Check where it went and adjust my spending", points: 3 },
      { id: "c", label: "Use credit or BNPL to cover the gap", points: 1 },
      { id: "d", label: "Cut back until I next get money", points: 2 },
    ],
  },
  {
    id: "budgeting-5",
    category: "budgetingSpending",
    prompt: "You have £30 left until your next money comes in, and something you want costs £25. What would you most likely do?",
    answers: [
      { id: "a", label: "Buy it now and sort the rest later", points: 0 },
      { id: "b", label: "Check what money I still need for essentials before deciding", points: 3 },
      { id: "c", label: "Wait and see if I still want it", points: 2 },
      { id: "d", label: "Use credit or BNPL instead", points: 1 },
    ],
  },
  {
    id: "saving-2",
    category: "savingHabits",
    prompt: "You know you need money for a birthday, travel or course item next month. What do you do?",
    answers: [
      { id: "a", label: "Save a set amount each week", points: 3 },
      { id: "b", label: "Use what I have when it comes up", points: 0 },
      { id: "c", label: "Wait, then cut back nearer the time", points: 1 },
      { id: "d", label: "Save what is left each week", points: 2 },
    ],
  },
  {
    id: "saving-3",
    category: "savingHabits",
    prompt: "What is an emergency fund mainly for?",
    answers: [
      { id: "a", label: "Unexpected essential costs", points: 3 },
      { id: "b", label: "Everyday spending when money runs out", points: 0 },
      { id: "c", label: "Planned costs I know are coming", points: 2 },
      { id: "d", label: "Overspending between payments", points: 1 },
    ],
  },
  {
    id: "saving-4",
    category: "savingHabits",
    prompt: "You want to save £500 for something important. What would you most likely do?",
    answers: [
      { id: "a", label: "Keep it in my account and try not to spend it", points: 1 },
      { id: "b", label: "Put money regularly into a separate savings pot", points: 3 },
      { id: "c", label: "Save whatever I have left over", points: 2 },
      { id: "d", label: "Wait until closer to the time to start saving", points: 0 },
    ],
  },
  {
    id: "student-finance-1",
    category: "studentFinance",
    prompt: "If you receive student maintenance money, what is it mainly designed to help pay for?",
    answers: [
      { id: "a", label: "Living costs such as rent, food, travel and course needs", points: 3 },
      { id: "b", label: "Mainly social activities and personal spending", points: 1 },
      { id: "c", label: "Course costs such as books and equipment", points: 2 },
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
    prompt: "What is an overdraft?",
    answers: [
      { id: "a", label: "Borrowing through your account that may cost money", points: 3 },
      { id: "b", label: "Extra money added to your account", points: 0 },
      { id: "c", label: "A balance boost that clears itself later", points: 1 },
      { id: "d", label: "Agreed borrowing linked to your bank account", points: 2 },
    ],
  },
  {
    id: "banking-3",
    category: "bankAccountsOverdrafts",
    prompt: "You keep losing track of weekly spending. What would you most likely do?",
    answers: [
      { id: "a", label: "Use spending alerts, notifications or separate money pots", points: 3 },
      { id: "b", label: "Check my balance only when it looks low", points: 1 },
      { id: "c", label: "Check my balance sometimes but not individual spending", points: 2 },
      { id: "d", label: "Move money around when it runs low", points: 0 },
    ],
  },
  {
    id: "banking-4",
    category: "bankAccountsOverdrafts",
    prompt: "You are in your overdraft. What would you most likely do next?",
    answers: [
      { id: "a", label: "Check the cost and make a plan to repay it", points: 3 },
      { id: "b", label: "Wait for my next payment to reduce it", points: 1 },
      { id: "c", label: "Spend less, but set no repayment plan", points: 2 },
      { id: "d", label: "Keep using it while I am within the limit", points: 0 },
    ],
  },
  {
    id: "credit-1",
    category: "creditBorrowing",
    prompt: "What happens when you buy something on a credit card?",
    answers: [
      { id: "a", label: "You borrow money and agree to repay it", points: 3 },
      { id: "b", label: "You get a discount from the card provider", points: 0 },
      { id: "c", label: "Extra money is added to your bank account", points: 1 },
      { id: "d", label: "You can pay later, but need a plan", points: 2 },
    ],
  },
  {
    id: "credit-3",
    category: "creditBorrowing",
    prompt: "You receive your monthly credit card statement. What is usually the best way to manage it?",
    answers: [
      { id: "a", label: "Pay the full statement balance when possible", points: 3 },
      { id: "b", label: "Pay the minimum payment only", points: 1 },
      { id: "c", label: "Leave it unpaid while I am within my limit", points: 0 },
      { id: "d", label: "Assume automatic payment will clear it without checking", points: 2 },
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
      { id: "b", label: "Wait for it to fail, then contact them", points: 2 },
      { id: "c", label: "Use other short-term credit to cover it", points: 0 },
      { id: "d", label: "Deal with it when I next receive money", points: 1 },
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
      { id: "d", label: "Pause and check the message details first", points: 2 },
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
      { id: "b", label: "To compare it with what reaches my bank", points: 1 },
      { id: "c", label: "Only check it if something looks wrong", points: 0 },
      { id: "d", label: "To check hours and rate, but not deductions", points: 2 },
    ],
  },
  {
    id: "pay-2",
    category: "payslipsTaxNi",
    prompt: "What is the difference between gross pay and net pay?",
    answers: [
      { id: "a", label: "Gross is before deductions; net is after", points: 3 },
      { id: "b", label: "Net pay is what reaches my bank", points: 2 },
      { id: "c", label: "Gross pay is my usual hourly rate", points: 1 },
      { id: "d", label: "They mean the same thing", points: 0 },
    ],
  },
  {
    id: "pay-3",
    category: "payslipsTaxNi",
    prompt: "Which deductions might appear on a payslip?",
    answers: [
      { id: "a", label: "Tax, National Insurance and pension contributions", points: 3 },
      { id: "b", label: "Whatever my employer decides to take", points: 1 },
      { id: "c", label: "Tax and National Insurance, but I am unsure", points: 2 },
      { id: "d", label: "Rent, phone bills and subscriptions", points: 0 },
    ],
  },
  {
    id: "moving-1",
    category: "movingOutRentBills",
    prompt: "Before moving into your first place, which costs are most important to plan for?",
    answers: [
      { id: "a", label: "Deposit, first rent, bills and setup costs", points: 3 },
      { id: "b", label: "Deposit and first rent, then other costs", points: 2 },
      { id: "c", label: "Furniture first, then rent and deposit", points: 0 },
      { id: "d", label: "Monthly rent first, then everything else", points: 1 },
    ],
  },
  {
    id: "moving-3",
    category: "movingOutRentBills",
    prompt: "Why should you read a tenancy agreement before signing?",
    answers: [
      { id: "a", label: "Rent, deposit, rules and responsibilities", points: 3 },
      { id: "b", label: "Rent and move-in date only", points: 1 },
      { id: "c", label: "What was agreed verbally should be enough", points: 0 },
      { id: "d", label: "Main terms, then ask about unclear points", points: 2 },
    ],
  },
  {
    id: "moving-4",
    category: "movingOutRentBills",
    prompt: "Which household bill can change depending on how much you use and who supplies it?",
    answers: [
      { id: "a", label: "Energy, because use and tariff affect cost", points: 3 },
      { id: "b", label: "Council Tax, because properties can differ", points: 1 },
      { id: "c", label: "Rent, because household use changes it", points: 0 },
      { id: "d", label: "Some bills vary, but I am unsure which", points: 2 },
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
      { id: "b", label: "Replace the money quickly without reviewing what happened", points: 2 },
      { id: "c", label: "Stop checking my money for a while", points: 0 },
      { id: "d", label: "Note the mistake but keep the same approach", points: 1 },
    ],
  },
];
