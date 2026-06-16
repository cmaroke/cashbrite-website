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
    prompt: "When money comes in, what do you usually do first?",
    answers: [
      { id: "a", label: "I spend normally and see what is left later", points: 0 },
      { id: "b", label: "I keep a rough idea in my head", points: 2 },
      { id: "c", label: "I set aside money for essentials before flexible spending", points: 4 },
      { id: "d", label: "I avoid checking because it feels stressful", points: 1 },
    ],
  },
  {
    id: "budgeting-2",
    category: "budgetingSpending",
    prompt: "How often do you check your balance or banking app?",
    answers: [
      { id: "a", label: "Most days or before I spend", points: 4 },
      { id: "b", label: "About once a week", points: 3 },
      { id: "c", label: "Only when I think money might be low", points: 1 },
      { id: "d", label: "Almost never", points: 0 },
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
    id: "budgeting-4",
    category: "budgetingSpending",
    prompt: "Which cost is easiest to forget when planning a week?",
    answers: [
      { id: "a", label: "Small regular spends like snacks, subscriptions and travel top-ups", points: 4 },
      { id: "b", label: "Only rent or big bills", points: 1 },
      { id: "c", label: "Nothing, because plans always work out exactly", points: 0 },
      { id: "d", label: "I am not sure, but I know some costs can sneak up", points: 2 },
    ],
  },
  {
    id: "budgeting-5",
    category: "budgetingSpending",
    prompt: "If your spending plan stops working halfway through the month, what would help most?",
    answers: [
      { id: "a", label: "Ignore it until next month", points: 0 },
      { id: "b", label: "Review what changed and adjust the remaining spending", points: 4 },
      { id: "c", label: "Cut every non-essential cost without checking what is realistic", points: 2 },
      { id: "d", label: "Use credit to cover the gap without checking the cost", points: 1 },
    ],
  },
  {
    id: "saving-1",
    category: "savingHabits",
    prompt: "What does saving money mainly mean to you right now?",
    answers: [
      { id: "a", label: "Only something to think about when I earn a lot", points: 0 },
      { id: "b", label: "Putting away small amounts when I can", points: 3 },
      { id: "c", label: "Having a plan for short-term goals and emergencies", points: 4 },
      { id: "d", label: "Whatever is accidentally left over", points: 1 },
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
      { id: "a", label: "To cover unexpected essentials without panic borrowing", points: 4 },
      { id: "b", label: "To spend on treats whenever I want", points: 0 },
      { id: "c", label: "Only to use for holidays", points: 1 },
      { id: "d", label: "I have heard of it but I am not sure", points: 2 },
    ],
  },
  {
    id: "saving-4",
    category: "savingHabits",
    prompt: "How do you usually separate money you want to save?",
    answers: [
      { id: "a", label: "I keep it in the same balance and try not to touch it", points: 1 },
      { id: "b", label: "I use a separate pot, account or clear note in my banking app", points: 4 },
      { id: "c", label: "I withdraw cash and hope I do not spend it", points: 2 },
      { id: "d", label: "I do not separate it at all", points: 0 },
    ],
  },
  {
    id: "saving-5",
    category: "savingHabits",
    prompt: "What is a realistic first savings goal for many students?",
    answers: [
      { id: "a", label: "A small buffer such as £50 to £100 for unexpected costs", points: 4 },
      { id: "b", label: "A huge amount straight away or nothing", points: 1 },
      { id: "c", label: "Only saving once every bill is gone forever", points: 0 },
      { id: "d", label: "Saving without knowing what the money is for", points: 2 },
    ],
  },
  {
    id: "student-finance-1",
    category: "studentFinance",
    prompt: "What is maintenance money usually meant to help with?",
    answers: [
      { id: "a", label: "Living costs such as rent, food, travel and course needs", points: 4 },
      { id: "b", label: "Only nights out during freshers' week", points: 0 },
      { id: "c", label: "Only tuition fees", points: 1 },
      { id: "d", label: "Anything, because it does not need planning", points: 0 },
    ],
  },
  {
    id: "student-finance-2",
    category: "studentFinance",
    prompt: "Before choosing a university or course, what money question is useful to ask?",
    answers: [
      { id: "a", label: "What are the likely rent, travel and living costs in that area?", points: 4 },
      { id: "b", label: "Which place has the best social media posts?", points: 0 },
      { id: "c", label: "Can I ignore costs until I arrive?", points: 0 },
      { id: "d", label: "Only how much the hoodie costs", points: 1 },
    ],
  },
  {
    id: "student-finance-3",
    category: "studentFinance",
    prompt: "What should you do if student finance payments are delayed?",
    answers: [
      { id: "a", label: "Contact student finance, the university/college and plan essential spending", points: 4 },
      { id: "b", label: "Take any loan advertised online immediately", points: 0 },
      { id: "c", label: "Ignore rent or bills without speaking to anyone", points: 1 },
      { id: "d", label: "Ask friends for money without knowing when you can repay", points: 1 },
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
      { id: "d", label: "Only asking classmates to solve it", points: 1 },
    ],
  },
  {
    id: "student-finance-5",
    category: "studentFinance",
    prompt: "How should a large termly payment be handled?",
    answers: [
      { id: "a", label: "Split it across the weeks or months it needs to cover", points: 4 },
      { id: "b", label: "Spend freely at first and plan later", points: 0 },
      { id: "c", label: "Keep a rough note but do not include rent or bills", points: 1 },
      { id: "d", label: "Set aside obvious essentials and review often", points: 3 },
    ],
  },
  {
    id: "banking-1",
    category: "bankAccountsOverdrafts",
    prompt: "What should you check before opening a student bank account?",
    answers: [
      { id: "a", label: "Overdraft limits, fees, repayment rules and useful features", points: 4 },
      { id: "b", label: "Only the free gift", points: 0 },
      { id: "c", label: "Only whether a friend uses the same bank", points: 1 },
      { id: "d", label: "Nothing, all accounts are exactly the same", points: 0 },
    ],
  },
  {
    id: "banking-2",
    category: "bankAccountsOverdrafts",
    prompt: "What is an overdraft?",
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
    prompt: "Which banking feature can help prevent surprise overspending?",
    answers: [
      { id: "a", label: "Balance alerts, spending notifications or pots", points: 4 },
      { id: "b", label: "Turning off all notifications and never checking", points: 0 },
      { id: "c", label: "Using only contactless without tracking", points: 1 },
      { id: "d", label: "Saving passwords in public places", points: 0 },
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
    id: "banking-5",
    category: "bankAccountsOverdrafts",
    prompt: "Why is it risky to share your card, PIN or banking login?",
    answers: [
      { id: "a", label: "Someone could access money or make payments in your name", points: 4 },
      { id: "b", label: "It is only risky with strangers, never friends", points: 1 },
      { id: "c", label: "It helps the bank trust you more", points: 0 },
      { id: "d", label: "There is no risk if you trust the person", points: 0 },
    ],
  },
  {
    id: "credit-1",
    category: "creditBorrowing",
    prompt: "What is credit?",
    answers: [
      { id: "a", label: "Borrowed money or a payment agreement that usually needs repaying", points: 4 },
      { id: "b", label: "Income you have earned", points: 0 },
      { id: "c", label: "A discount code", points: 0 },
      { id: "d", label: "Money that only adults need to understand", points: 1 },
    ],
  },
  {
    id: "credit-2",
    category: "creditBorrowing",
    prompt: "Which habit can support a healthier credit history?",
    answers: [
      { id: "a", label: "Paying agreed bills and repayments on time", points: 4 },
      { id: "b", label: "Applying for lots of credit in a short time", points: 0 },
      { id: "c", label: "Ignoring letters and app messages", points: 0 },
      { id: "d", label: "Only making payments when reminded by friends", points: 1 },
    ],
  },
  {
    id: "credit-3",
    category: "creditBorrowing",
    prompt: "If you use a credit card, what is usually the safest habit?",
    answers: [
      { id: "a", label: "Pay the full statement balance when possible", points: 4 },
      { id: "b", label: "Only pay the minimum forever", points: 1 },
      { id: "c", label: "Treat the limit as extra income", points: 0 },
      { id: "d", label: "Use it for friends and hope they pay you back", points: 0 },
    ],
  },
  {
    id: "credit-4",
    category: "creditBorrowing",
    prompt: "Before borrowing money, what should you compare?",
    answers: [
      { id: "a", label: "Total repayment, interest, fees and what happens if you miss a payment", points: 4 },
      { id: "b", label: "Only the monthly payment if it looks small", points: 1 },
      { id: "c", label: "Only whether the advert looks friendly", points: 0 },
      { id: "d", label: "Nothing if the lender approves you", points: 0 },
    ],
  },
  {
    id: "credit-5",
    category: "creditBorrowing",
    prompt: "What should you do if you think you cannot make a repayment?",
    answers: [
      { id: "a", label: "Contact the lender or a free debt advice service early", points: 4 },
      { id: "b", label: "Wait until missed payments build up", points: 0 },
      { id: "c", label: "Borrow more without checking the cost", points: 1 },
      { id: "d", label: "Delete the app and avoid messages", points: 0 },
    ],
  },
  {
    id: "bnpl-1",
    category: "buyNowPayLater",
    prompt: "What does buy now pay later usually let you do?",
    answers: [
      { id: "a", label: "Get something now and pay later or in instalments", points: 4 },
      { id: "b", label: "Get things for free", points: 0 },
      { id: "c", label: "Avoid needing a budget", points: 0 },
      { id: "d", label: "Earn wages earlier", points: 0 },
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
    id: "bnpl-3",
    category: "buyNowPayLater",
    prompt: "Before using buy now pay later, what should you check?",
    answers: [
      { id: "a", label: "Payment dates, late fees and whether you can afford each payment", points: 4 },
      { id: "b", label: "Only whether checkout is faster", points: 0 },
      { id: "c", label: "Only whether friends use it", points: 1 },
      { id: "d", label: "Nothing, because it is not borrowing", points: 0 },
    ],
  },
  {
    id: "bnpl-4",
    category: "buyNowPayLater",
    prompt: "Which purchase is the strongest reason to pause before using buy now pay later?",
    answers: [
      { id: "a", label: "Something you want but could not afford if the payment came out today", points: 4 },
      { id: "b", label: "A planned essential with money already set aside", points: 2 },
      { id: "c", label: "A purchase you have compared and budgeted for", points: 3 },
      { id: "d", label: "A small item you forgot to include in your budget", points: 1 },
    ],
  },
  {
    id: "bnpl-5",
    category: "buyNowPayLater",
    prompt: "If a buy now pay later payment is due tomorrow and you are short, what is best?",
    answers: [
      { id: "a", label: "Check the provider options and seek help before missing it", points: 4 },
      { id: "b", label: "Ignore it because it is not a real bill", points: 0 },
      { id: "c", label: "Use another BNPL purchase to cover the problem", points: 0 },
      { id: "d", label: "Hope it does not matter", points: 1 },
    ],
  },
  {
    id: "scams-1",
    category: "fraudScamsOnlineSafety",
    prompt: "A message says your bank needs your PIN urgently. What should you do?",
    answers: [
      { id: "a", label: "Reply quickly so the account is safe", points: 0 },
      { id: "b", label: "Use official bank contact details or the app to check", points: 4 },
      { id: "c", label: "Click the link but enter only some details", points: 0 },
      { id: "d", label: "Forward it to friends first", points: 1 },
    ],
  },
  {
    id: "scams-2",
    category: "fraudScamsOnlineSafety",
    prompt: "Which job offer should make you pause?",
    answers: [
      { id: "a", label: "One asking you to receive and move money through your account", points: 4 },
      { id: "b", label: "One with normal interview details and a clear employer", points: 1 },
      { id: "c", label: "One asking for your availability", points: 0 },
      { id: "d", label: "One from your school careers portal", points: 0 },
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
    id: "scams-4",
    category: "fraudScamsOnlineSafety",
    prompt: "Before buying from a seller you do not know, what should you do?",
    answers: [
      { id: "a", label: "Check reviews, payment protection and whether the deal seems realistic", points: 4 },
      { id: "b", label: "Pay by bank transfer quickly to secure it", points: 0 },
      { id: "c", label: "Trust it if the item picture looks good", points: 1 },
      { id: "d", label: "Send personal details before asking questions", points: 0 },
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
    prompt: "What is a payslip for?",
    answers: [
      { id: "a", label: "Showing pay earned, deductions and take-home pay", points: 4 },
      { id: "b", label: "Only showing your employer's logo", points: 0 },
      { id: "c", label: "Replacing a bank statement", points: 0 },
      { id: "d", label: "Showing only how many hours your friends worked", points: 0 },
    ],
  },
  {
    id: "pay-2",
    category: "payslipsTaxNi",
    prompt: "What does take-home pay mean?",
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
    id: "pay-4",
    category: "payslipsTaxNi",
    prompt: "What is National Insurance linked to?",
    answers: [
      { id: "a", label: "UK contributions connected to earnings and some state benefits", points: 4 },
      { id: "b", label: "Home contents insurance", points: 0 },
      { id: "c", label: "A student discount scheme", points: 0 },
      { id: "d", label: "A bank account password", points: 0 },
    ],
  },
  {
    id: "pay-5",
    category: "payslipsTaxNi",
    prompt: "Why is it useful to keep payslips or download copies?",
    answers: [
      { id: "a", label: "They can help check pay, tax, applications and employment records", points: 4 },
      { id: "b", label: "There is no reason to keep them", points: 0 },
      { id: "c", label: "Only to compare with friends", points: 1 },
      { id: "d", label: "To share online as proof of income", points: 0 },
    ],
  },
  {
    id: "moving-1",
    category: "movingOutRentBills",
    prompt: "Before moving out, which upfront costs should you plan for?",
    answers: [
      { id: "a", label: "Deposit, first rent, travel, basic items and possible setup costs", points: 4 },
      { id: "b", label: "Only food for the first week", points: 1 },
      { id: "c", label: "Only streaming subscriptions", points: 0 },
      { id: "d", label: "Nothing until after moving day", points: 0 },
    ],
  },
  {
    id: "moving-2",
    category: "movingOutRentBills",
    prompt: "In shared housing, what should be agreed early?",
    answers: [
      { id: "a", label: "How rent, bills, council tax rules and shared items will be handled", points: 4 },
      { id: "b", label: "Only who gets the biggest room", points: 1 },
      { id: "c", label: "Nothing, because it always works itself out", points: 0 },
      { id: "d", label: "Who can ignore bills if they are busy", points: 0 },
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
    prompt: "Which bill can change depending on use or supplier?",
    answers: [
      { id: "a", label: "Energy, water, broadband or mobile costs", points: 4 },
      { id: "b", label: "Every bill is always fixed forever", points: 0 },
      { id: "c", label: "Only clothes shopping", points: 0 },
      { id: "d", label: "I am not sure, but I know bills can vary", points: 2 },
    ],
  },
  {
    id: "moving-5",
    category: "movingOutRentBills",
    prompt: "What is a sensible way to prepare for monthly bills?",
    answers: [
      { id: "a", label: "List expected bills, due dates and who pays what", points: 4 },
      { id: "b", label: "Wait for reminders and hope there is enough money", points: 0 },
      { id: "c", label: "Pay whoever asks first", points: 1 },
      { id: "d", label: "Only plan rent and ignore smaller bills", points: 2 },
    ],
  },
  {
    id: "confidence-1",
    category: "moneyConfidence",
    prompt: "When you do not understand a money word or product, what do you usually do?",
    answers: [
      { id: "a", label: "Ask a trusted person or check a reliable source", points: 4 },
      { id: "b", label: "Pretend I understand and carry on", points: 0 },
      { id: "c", label: "Guess from social media comments", points: 1 },
      { id: "d", label: "Save the question and look it up later", points: 3 },
    ],
  },
  {
    id: "confidence-2",
    category: "moneyConfidence",
    prompt: "How do you feel about talking about money with a trusted adult, teacher or adviser?",
    answers: [
      { id: "a", label: "Comfortable enough to ask when needed", points: 4 },
      { id: "b", label: "A bit awkward, but I could do it", points: 3 },
      { id: "c", label: "I would avoid it unless things got serious", points: 1 },
      { id: "d", label: "I would never ask", points: 0 },
    ],
  },
  {
    id: "confidence-3",
    category: "moneyConfidence",
    prompt: "Before making a bigger money decision, what helps most?",
    answers: [
      { id: "a", label: "Compare options, costs and consequences before deciding", points: 4 },
      { id: "b", label: "Choose whatever feels easiest in the moment", points: 1 },
      { id: "c", label: "Copy what a friend did without checking if it fits me", points: 0 },
      { id: "d", label: "Delay forever because all money choices feel scary", points: 1 },
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
  {
    id: "confidence-5",
    category: "moneyConfidence",
    prompt: "Which statement feels closest to you right now?",
    answers: [
      { id: "a", label: "I can make everyday money decisions and know where to get help", points: 4 },
      { id: "b", label: "I understand some things but want clearer guidance", points: 3 },
      { id: "c", label: "I feel unsure about most money decisions", points: 1 },
      { id: "d", label: "I do not think money skills matter yet", points: 0 },
    ],
  },
];
