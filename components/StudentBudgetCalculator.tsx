"use client";

import { useMemo, useState } from "react";
import { ButtonLink } from "@/components/ButtonLink";

type BudgetField = {
  id: string;
  label: string;
};

type BudgetSection = {
  id: "income" | "essential" | "flexible" | "savings";
  title: string;
  description: string;
  fields: BudgetField[];
};

const budgetSections: BudgetSection[] = [
  {
    id: "income",
    title: "Income",
    description: "Add the money you expect to receive each month.",
    fields: [
      { id: "maintenanceLoan", label: "Student maintenance loan / support" },
      { id: "partTimeJob", label: "Part-time job income" },
      { id: "apprenticeshipWages", label: "Apprenticeship wages" },
      { id: "familySupport", label: "Family support" },
      { id: "otherIncome", label: "Other income" },
    ],
  },
  {
    id: "essential",
    title: "Essential costs",
    description: "Include the costs you need to plan for first.",
    fields: [
      { id: "rent", label: "Rent / accommodation" },
      { id: "food", label: "Food and groceries" },
      { id: "travel", label: "Travel" },
      { id: "phone", label: "Phone" },
      { id: "bills", label: "Bills / utilities" },
      { id: "courseCosts", label: "Course costs" },
      { id: "repayments", label: "Debt or repayments" },
    ],
  },
  {
    id: "flexible",
    title: "Flexible spending",
    description: "These are the things you can usually adjust if money feels tight.",
    fields: [
      { id: "social", label: "Going out / social" },
      { id: "clothes", label: "Clothes / shopping" },
      { id: "subscriptions", label: "Subscriptions" },
      { id: "hobbies", label: "Hobbies / fitness" },
      { id: "otherFlexible", label: "Other flexible spending" },
    ],
  },
  {
    id: "savings",
    title: "Savings",
    description: "Add what you want to put aside each month.",
    fields: [{ id: "monthlySavings", label: "Monthly savings goal" }],
  },
];

const initialValues = budgetSections.reduce<Record<string, string>>((values, section) => {
  section.fields.forEach((field) => {
    values[field.id] = "";
  });
  return values;
}, {});

function toNumber(value: string) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-GB", {
    currency: "GBP",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

function getBudgetHealth(remaining: number, savingsRate: number) {
  if (remaining < 0) {
    return {
      label: "Overspending risk",
      tone: "bg-[#ffe8e1] text-[#7a2614] border-[#f4b9aa]",
      message:
        "Your planned spending is higher than your income. Try reducing flexible spending first, then review any essential costs that may be adjustable.",
    };
  }

  if (remaining <= 25) {
    return {
      label: "Tight budget",
      tone: "bg-[#fff4d6] text-[#65440a] border-[#f2d98b]",
      message:
        "Your budget is close to break-even. A small unexpected cost could make the month feel stressful, so it may help to build a little breathing room.",
    };
  }

  if (savingsRate >= 10) {
    return {
      label: "Strong budget",
      tone: "bg-mint text-navy border-sea/20",
      message:
        "You have money left over and are setting aside at least 10% of your income. That is a strong foundation for student money confidence.",
    };
  }

  return {
    label: "Good start",
    tone: "bg-white text-navy border-navy/10",
    message:
      "You have money left over, which is positive. If possible, try increasing savings gradually so future costs feel easier to handle.",
  };
}

export function StudentBudgetCalculator() {
  const [values, setValues] = useState(initialValues);

  const totals = useMemo(() => {
    const sectionTotal = (sectionId: BudgetSection["id"]) => {
      const section = budgetSections.find((item) => item.id === sectionId);
      return section?.fields.reduce((sum, field) => sum + toNumber(values[field.id]), 0) ?? 0;
    };

    const income = sectionTotal("income");
    const essential = sectionTotal("essential");
    const flexible = sectionTotal("flexible");
    const savings = sectionTotal("savings");
    const remaining = income - essential - flexible - savings;
    const savingsRate = income > 0 ? (savings / income) * 100 : 0;

    return {
      essential,
      flexible,
      income,
      remaining,
      savings,
      savingsRate,
    };
  }, [values]);

  const health = getBudgetHealth(totals.remaining, totals.savingsRate);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
      <div className="grid gap-5">
        {budgetSections.map((section) => (
          <section key={section.id} className="rounded-lg border border-navy/10 bg-white p-5 shadow-sm sm:p-6">
            <div>
              <h2 className="text-2xl font-black text-navy">{section.title}</h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-navy/62">{section.description}</p>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {section.fields.map((field) => (
                <label key={field.id} className="grid gap-2 text-sm font-bold text-navy">
                  <span>{field.label}</span>
                  <span className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base font-black text-navy/45">
                      £
                    </span>
                    <input
                      inputMode="decimal"
                      min="0"
                      name={field.id}
                      type="number"
                      value={values[field.id]}
                      onChange={(event) =>
                        setValues((current) => ({
                          ...current,
                          [field.id]: event.target.value,
                        }))
                      }
                      className="focus-ring w-full rounded-lg border border-navy/12 bg-cream/55 py-3 pl-9 pr-4 text-base font-bold text-navy outline-none transition placeholder:text-navy/30 focus:border-sea"
                      placeholder="0"
                    />
                  </span>
                </label>
              ))}
            </div>
          </section>
        ))}
      </div>

      <aside className="rounded-lg border border-navy/10 bg-navy p-5 text-white shadow-[0_24px_70px_rgba(7,29,43,0.18)] sm:p-6 lg:sticky lg:top-8">
        <p className="text-sm font-black uppercase tracking-[0.14em] text-mint">Your monthly budget</p>
        <div className="mt-5 rounded-lg border border-white/10 bg-white/8 p-4">
          <div className={`rounded-lg border p-4 ${health.tone}`}>
            <p className="text-sm font-black uppercase tracking-[0.12em] opacity-75">Budget health</p>
            <h2 className="mt-2 text-3xl font-black">{health.label}</h2>
            <p className="mt-3 text-sm font-semibold leading-6 opacity-80">{health.message}</p>
          </div>
        </div>

        <dl className="mt-6 grid gap-3">
          {[
            ["Total monthly income", totals.income],
            ["Total essential costs", totals.essential],
            ["Total flexible spending", totals.flexible],
            ["Total monthly savings", totals.savings],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
              <dt className="text-sm font-bold text-white/70">{label}</dt>
              <dd className="text-lg font-black text-white">{formatCurrency(Number(value))}</dd>
            </div>
          ))}
          <div className="flex items-center justify-between gap-4 rounded-lg bg-white p-4 text-navy">
            <dt className="text-sm font-black">Remaining money</dt>
            <dd className="text-2xl font-black">{formatCurrency(totals.remaining)}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 rounded-lg bg-mint p-4 text-navy">
            <dt className="text-sm font-black">Savings rate</dt>
            <dd className="text-2xl font-black">{formatPercent(totals.savingsRate)}</dd>
          </div>
        </dl>

        <div className="mt-6 rounded-lg border border-mint/25 bg-mint/10 p-4">
          <h3 className="text-lg font-black text-white">Want to understand your money confidence?</h3>
          <p className="mt-2 text-sm font-semibold leading-6 text-white/70">
            Your budget is one part of the picture. Take the free Cashbrite quiz to see your score and priority areas.
          </p>
          <div className="mt-4">
            <ButtonLink href="/quiz" variant="secondary">
              Take the free quiz
            </ButtonLink>
          </div>
        </div>
      </aside>
    </div>
  );
}
