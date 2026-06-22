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
      { id: "a", label: "I go and assume I can cut back on something else later", points: 0 },
      { id: "b", label: "I suggest a cheaper option or say I need to skip it", points: 4 },
      { id: "c", label: "I ask someone to cover me and plan to sort it out later", points: 1 },
      { id: "d", label: "I check my budget and decide after that", points: 3 },
    ],
  },
  {
    id: "budgeting-5",
    category: "budgetingSpending",
    prompt: "You have £30 left until you next receive money, but you see something you really want for £25. What do you do?",
    answers: [
      { id: "a", label: "Buy it now and plan to manage with the remaining £5", points: 0 },
      { id: "b", label: "Pause and keep enough money for essentials until I next receive money", points: 4 },
      { id: "c", label: "Check the obvious things I need money for, then decide", points: 2 },
      { id: "d", label: "Use credit or Buy Now Pay Later so I can keep the £30", points: 1 },
    ],
  },
  {
    id: "saving-2",
    category: "savingHabits",
    prompt: "You know you need money for a birthday, travel or course item next month. What do you do?",
    answers: [
      { id: "a", label: "Break the cost into smaller weekly amounts", points: 4 },
      { id: "b", label: "Wait until next month and use whatever money I have then", points: 0 },
      { id: "c", label: "Plan to spend less nearer the time, without setting an amount aside now", points: 1 },
      { id: "d", label: "Put aside whatever is left at the end of each week", points: 2 },
    ],
  },
  {
    id: "saving-3",
    category: "savingHabits",
    prompt: "What is the main purpose of an emergency fund?",
    answers: [
      { id: "a", label: "To cover an unexpected important cost without having to panic or borrow", points: 4 },
      { id: "b", label: "To pay for planned spending when my usual money runs low", points: 0 },
      { id: "c", label: "To save towards a future goal, even if it is not unexpected", points: 1 },
      { id: "d", label: "To provide some backup when normal spending costs more than expected", points: 2 },
    ],
  },
  {
    id: "saving-4",
    category: "savingHabits",
    prompt: "You want to save money for something important. What is the best way to stop yourself spending it?",
    answers: [
      { id: "a", label: "Keep it in my usual balance and rely on myself not to spend it", points: 1 },
      { id: "b", label: "Move it to a separate savings pot, account or safe place", points: 4 },
      { id: "c", label: "Put the cash somewhere separate, without tracking how close I am to my goal", points: 2 },
      { id: "d", label: "Use the same balance and plan to replace any savings I spend", points: 0 },
    ],
  },
  {
    id: "student-finance-1",
    category: "studentFinance",
    prompt: "If you receive student maintenance money, what is it mainly designed to help pay for?",
    answers: [
      { id: "a", label: "Living costs such as rent, food, travel and course needs", points: 4 },
      { id: "b", label: "Mainly social activities and personal spending", points: 0 },
      { id: "c", label: "Only academic costs such as tuition, books and equipment", points: 1 },
      { id: "d", label: "General spending during term, with no need to divide it across essential costs", points: 0 },
    ],
  },
  {
    id: "student-finance-4",
    category: "studentFinance",
    prompt: "Which support might be worth checking if money is tight while studying?",
    answers: [
      { id: "a", label: "Hardship funds, bursaries, scholarships or student support services", points: 4 },
      { id: "b", label: "A short-term high-cost loan to cover the gap quickly", points: 0 },
      { id: "c", label: "An extra student finance payment that is automatically available to everyone", points: 0 },
      { id: "d", label: "Ask friends or family for help before checking what student support is available", points: 1 },
    ],
  },
  {
    id: "student-finance-5",
    category: "studentFinance",
    prompt: "You receive a large student finance payment at the start of term. What is the smartest way to manage it?",
    answers: [
      { id: "a", label: "Split it across the weeks or months it needs to cover", points: 4 },
      { id: "b", label: "Use what I need during the first few weeks and budget whatever remains", points: 0 },
      { id: "c", label: "Keep a rough idea of my spending without setting a weekly or monthly amount", points: 1 },
      { id: "d", label: "Set aside obvious essentials and review often", points: 3 },
    ],
  },
  {
    id: "banking-2",
    category: "bankAccountsOverdrafts",
    prompt: "You spend more money than you have in your bank account and go into your arranged overdraft. What does this mean?",
    answers: [
      { id: "a", label: "Borrowing through your current account that must be repaid and may have charges", points: 4 },
      { id: "b", label: "An extra amount added to my balance because the bank has approved it", points: 0 },
      { id: "c", label: "A temporary extension of my balance that clears without needing a repayment plan", points: 0 },
      { id: "d", label: "Agreed borrowing that will sort itself out when money next enters my account", points: 1 },
    ],
  },
  {
    id: "banking-3",
    category: "bankAccountsOverdrafts",
    prompt: "You keep wondering where your money disappears each week. What could help you stay on track?",
    answers: [
      { id: "a", label: "Use balance alerts, spending notifications or separate pots", points: 4 },
      { id: "b", label: "Check my balance only when a payment is declined", points: 0 },
      { id: "c", label: "Look at my balance occasionally without checking individual spending", points: 1 },
      { id: "d", label: "Move money between accounts when one balance gets low without reviewing my spending", points: 0 },
    ],
  },
  {
    id: "banking-4",
    category: "bankAccountsOverdrafts",
    prompt: "If you go into an arranged overdraft, what is a sensible next step?",
    answers: [
      { id: "a", label: "Check any charges and make a plan to reduce it", points: 4 },
      { id: "b", label: "Leave it until money next enters my account because it is already arranged", points: 0 },
      { id: "c", label: "Reduce some spending but wait for the account to return above zero on its own", points: 1 },
      { id: "d", label: "Keep using it within the agreed limit because that means it is part of my available money", points: 0 },
    ],
  },
  {
    id: "credit-1",
    category: "creditBorrowing",
    prompt: "You buy something using money you will pay back later. What does this mean?",
    answers: [
      { id: "a", label: "Borrowed money or a payment agreement that usually needs repaying", points: 4 },
      { id: "b", label: "Money added to my available balance once the purchase is approved", points: 0 },
      { id: "c", label: "A way to delay paying without taking on a repayment commitment", points: 0 },
      { id: "d", label: "Money I can use now and plan how to repay after the bill arrives", points: 1 },
    ],
  },
  {
    id: "credit-3",
    category: "creditBorrowing",
    prompt: "You receive your monthly credit card statement. What is usually the best way to manage it?",
    answers: [
      { id: "a", label: "Pay the full statement balance when possible", points: 4 },
      { id: "b", label: "Pay the minimum because I think that means I am managing it properly", points: 1 },
      { id: "c", label: "Leave the balance until next month if I am still within my credit limit", points: 0 },
      { id: "d", label: "Assume an automatic payment will clear the full balance without checking", points: 0 },
    ],
  },
  {
    id: "credit-5",
    category: "creditBorrowing",
    prompt: "What should you do if you think you cannot make a repayment?",
    answers: [
      { id: "a", label: "Tell the lender early or ask a trusted person or free debt adviser for help", points: 4 },
      { id: "b", label: "Wait until the payment is missed, then explain what happened", points: 0 },
      { id: "c", label: "Use another form of borrowing to make this repayment", points: 1 },
      { id: "d", label: "Cancel the payment and wait for the lender to contact me with another option", points: 0 },
    ],
  },
  {
    id: "bnpl-1",
    category: "buyNowPayLater",
    prompt: "You see trainers online with a 'Buy Now Pay Later' option. What does this usually mean?",
    answers: [
      { id: "a", label: "Get something now and pay later or in instalments", points: 4 },
      { id: "b", label: "Reserve the item now and decide later whether to complete the purchase", points: 0 },
      { id: "c", label: "Split the cost into smaller amounts that do not count as borrowing", points: 0 },
      { id: "d", label: "Receive the item before deciding how and when to pay for it", points: 0 },
    ],
  },
  {
    id: "bnpl-2",
    category: "buyNowPayLater",
    prompt: "What is a risk of having several buy now pay later purchases at once?",
    answers: [
      { id: "a", label: "Small payments can stack up and become hard to track", points: 4 },
      { id: "b", label: "Each payment stays small, so the total should remain affordable", points: 0 },
      { id: "c", label: "Each provider checks my other plans before approving another purchase", points: 0 },
      { id: "d", label: "The risk should stay low as long as every individual payment is small", points: 1 },
    ],
  },
  {
    id: "bnpl-5",
    category: "buyNowPayLater",
    prompt: "Your Buy Now Pay Later payment is due tomorrow but you do not have enough money. What should you do?",
    answers: [
      { id: "a", label: "Contact the provider, check my options and ask for help before I miss it", points: 4 },
      { id: "b", label: "Wait for the payment to fail and contact the provider afterwards", points: 0 },
      { id: "c", label: "Use another form of short-term credit to cover the payment", points: 0 },
      { id: "d", label: "Check when I next receive money and plan to deal with the payment then", points: 1 },
    ],
  },
  {
    id: "scams-1",
    category: "fraudScamsOnlineSafety",
    prompt: "You receive a text saying your bank account is at risk and asking for your PIN. What should you do?",
    answers: [
      { id: "a", label: "Follow the instructions because the message includes my bank's name and sounds urgent", points: 0 },
      { id: "b", label: "Use official bank contact details or the app to check", points: 4 },
      { id: "c", label: "Open the link to check whether the page looks like my bank's website", points: 0 },
      { id: "d", label: "Search the phone number online and trust the message if nobody has reported it", points: 1 },
    ],
  },
  {
    id: "scams-3",
    category: "fraudScamsOnlineSafety",
    prompt: "What is a common warning sign of a scam?",
    answers: [
      { id: "a", label: "Pressure to act immediately or keep it secret", points: 4 },
      { id: "b", label: "A company offering a normal introductory discount to new customers", points: 0 },
      { id: "c", label: "A message that looks professional and includes personal details such as your name", points: 0 },
      { id: "d", label: "An unfamiliar website that shows contact details and customer reviews", points: 1 },
    ],
  },
  {
    id: "scams-5",
    category: "fraudScamsOnlineSafety",
    prompt: "What should you do if you think you have shared bank details with a scammer?",
    answers: [
      { id: "a", label: "Contact your bank immediately and follow their safety steps", points: 4 },
      { id: "b", label: "Monitor the account for a few days and contact the bank only if money leaves", points: 0 },
      { id: "c", label: "Change my banking password first and ask someone I trust what else to do", points: 1 },
      { id: "d", label: "Block the sender and assume that prevents the details from being used", points: 0 },
    ],
  },
  {
    id: "pay-1",
    category: "payslipsTaxNi",
    prompt: "You get your first payslip from a job. Why should you check it?",
    answers: [
      { id: "a", label: "It shows pay earned, deductions and take-home pay", points: 4 },
      { id: "b", label: "It confirms the amount paid, so I only need to compare that with my bank account", points: 0 },
      { id: "c", label: "It is mainly a payroll record, so I assume the figures are correct unless the total looks very wrong", points: 0 },
      { id: "d", label: "It lets me check my hours and rate, while tax and other deductions are fixed automatically", points: 0 },
    ],
  },
  {
    id: "pay-2",
    category: "payslipsTaxNi",
    prompt: "When you receive your pay, what does 'take-home pay' mean?",
    answers: [
      { id: "a", label: "The amount paid to you after deductions such as tax or National Insurance", points: 4 },
      { id: "b", label: "The amount before any deductions", points: 1 },
      { id: "c", label: "Your basic pay before overtime or bonuses are added", points: 0 },
      { id: "d", label: "The amount left after your regular spending and bills", points: 0 },
    ],
  },
  {
    id: "pay-3",
    category: "payslipsTaxNi",
    prompt: "If your pay looks lower than expected, what should you check first?",
    answers: [
      { id: "a", label: "Hours, rate of pay, tax code, deductions and whether anything changed", points: 4 },
      { id: "b", label: "The amount in my bank account, because that confirms payroll was correct", points: 0 },
      { id: "c", label: "My hours and rate of pay, because deductions should always stay the same", points: 1 },
      { id: "d", label: "Assume payroll has calculated it correctly unless the difference happens again", points: 0 },
    ],
  },
  {
    id: "moving-1",
    category: "movingOutRentBills",
    prompt: "You are preparing to move into your first place. Which costs should you plan for before you move in?",
    answers: [
      { id: "a", label: "Deposit, first rent, travel, basic items and possible setup costs", points: 4 },
      { id: "b", label: "The deposit and first rent, because everyday costs can come from my usual spending money", points: 1 },
      { id: "c", label: "The first rent payment and furniture, assuming the deposit can be arranged later", points: 0 },
      { id: "d", label: "The advertised monthly rent, then work out deposits and setup costs after I agree to move", points: 0 },
    ],
  },
  {
    id: "moving-3",
    category: "movingOutRentBills",
    prompt: "Why should you read a tenancy agreement before signing?",
    answers: [
      { id: "a", label: "It explains responsibilities, rent, deposits, notice and rules", points: 4 },
      { id: "b", label: "To check the rent and move-in date, while assuming the remaining terms are standard", points: 0 },
      { id: "c", label: "To confirm the main costs, because anything discussed verbally should be enough", points: 0 },
      { id: "d", label: "To skim the main terms and ask about something only if it looks unusual", points: 1 },
    ],
  },
  {
    id: "moving-4",
    category: "movingOutRentBills",
    prompt: "Which household bill can change depending on how much you use and who supplies it?",
    answers: [
      { id: "a", label: "Energy bills, because usage and the supplier's tariff can affect the cost", points: 4 },
      { id: "b", label: "Council Tax, because it changes each month with household usage", points: 0 },
      { id: "c", label: "Rent, because it normally changes each month with household usage", points: 0 },
      { id: "d", label: "I am not sure, but I know bills can vary", points: 2 },
    ],
  },
  {
    id: "confidence-1",
    category: "moneyConfidence",
    prompt: "You see a money term online that you do not understand. What is the best thing to do?",
    answers: [
      { id: "a", label: "Ask a trusted person or check a reliable source", points: 4 },
      { id: "b", label: "Use the first clear explanation I find without checking who published it", points: 0 },
      { id: "c", label: "Work out the meaning from comments by people discussing it online", points: 1 },
      { id: "d", label: "Save the question and look it up later", points: 3 },
    ],
  },
  {
    id: "confidence-3",
    category: "moneyConfidence",
    prompt: "Before making an important money decision, what is the smartest approach?",
    answers: [
      { id: "a", label: "Compare options, costs and consequences before deciding", points: 4 },
      { id: "b", label: "Choose the option with the lowest immediate cost", points: 1 },
      { id: "c", label: "Choose the option that worked for someone I trust because our needs seem similar", points: 0 },
      { id: "d", label: "Keep putting it off because it feels confusing", points: 1 },
    ],
  },
  {
    id: "confidence-4",
    category: "moneyConfidence",
    prompt: "If you make a money mistake, what is the most helpful response?",
    answers: [
      { id: "a", label: "Work out what happened, get help if needed and make a recovery plan", points: 4 },
      { id: "b", label: "Focus on replacing the money quickly without first working out what caused the mistake", points: 0 },
      { id: "c", label: "Pause checking my money for a while because I feel less likely to make another mistake", points: 0 },
      { id: "d", label: "Make a note of what happened but continue with the same approach", points: 1 },
    ],
  },
];
