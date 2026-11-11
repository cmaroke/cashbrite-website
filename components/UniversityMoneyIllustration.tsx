"use client";

import { useId, useState } from "react";

const expenses = [
  { id: "rent", className: "rent-slip", label: "A place to live", amount: 650, detail: "Rent + bills", highlighted: true,
    title: "What does your rent include?", insight: "Check which bills are included before comparing rooms. Energy, water and internet can change the real cost." },
  { id: "food", className: "food-slip", label: "Food + essentials", amount: 220, detail: "The everyday stuff", highlighted: false,
    title: "The little shops count, too.", insight: "Include toiletries and household basics alongside groceries. A few small top-ups can add up." },
  { id: "life", className: "life-slip", label: "Getting out & about", amount: 180, detail: "Travel + social plans", highlighted: true,
    title: "A bus ride. A coffee. Another night out.", insight: "Travel and social plans share this example pot. Deciding what to keep aside makes the trade-offs clearer." },
] as const;

type ExpenseId = typeof expenses[number]["id"];

export function UniversityMoneyIllustration() {
  const id = useId();
  const [active, setActive] = useState<ExpenseId | null>(null);
  const [pinned, setPinned] = useState<ExpenseId | null>(null);
  const [unexpected, setUnexpected] = useState(false);
  const insight = expenses.find(expense => expense.id === active);
  const remaining = 1200 - expenses.reduce((total, expense) => total + expense.amount, 0) - (unexpected ? 60 : 0);

  return (
    <figure className="money-scene" aria-labelledby={`${id}-title`}>
      <div className="margin-question hand">New city.<br />New freedom.<br />Same money?</div>
      <svg className="scene-arrow" viewBox="0 0 130 75" fill="none" aria-hidden="true"><path d="M8 9C55 0 116 12 103 56M91 46l12 12 13-12" /></svg>
      <div className="student-note">
        <header className="note-header"><span className="tag">University / Month 01</span><span className="note-stamp">A worked example</span></header>
        <h2 id={`${id}-title`}>My money.<br />My first month.</h2>
        <div className="incoming"><span>Money coming in</span><strong>£1,200</strong><small>Student support + part-time work</small></div>
        <p className="hand pencil-note">Looks like a lot. But...</p>
        <div className="expense-cluster" aria-label="Explore the example expenses">
          {expenses.map(expense => <button key={expense.id} type="button" className={`expense ${expense.className}`} data-expense={expense.id}
            aria-expanded={active === expense.id} aria-controls={`${id}-insight`}
            onPointerEnter={event => { if (event.pointerType === "mouse") setActive(expense.id); }}
            onPointerLeave={() => setActive(pinned)} onFocus={() => setActive(expense.id)} onBlur={() => setActive(pinned)}
            onClick={() => { const next = pinned === expense.id ? null : expense.id; setPinned(next); setActive(next); }}
            onKeyDown={event => { if (event.key === "Escape") { setPinned(null); setActive(null); } }}>
            <span>{expense.label}</span><strong>{expense.highlighted ? <mark>£{expense.amount}</mark> : <>£{expense.amount}</>}</strong><small>{expense.detail}</small>
          </button>)}
        </div>
        <div id={`${id}-insight`} className="expense-insight" role="status" aria-live="polite" aria-atomic="true">
          <strong>{insight?.title ?? "What is hiding in the small print?"}</strong>
          <span>{insight?.insight ?? "Hover, tap or focus an expense to explore it."}</span>
        </div>
        <div className="remaining"><div><span>Money remaining</span><strong data-money-remaining>£{remaining}</strong></div><p className="hand">Still the whole<br />month to go...</p></div>
        <svg className="remaining-arrow" viewBox="0 0 90 45" fill="none" aria-hidden="true"><path d="M83 8C70 38 30 39 10 19M10 19l2 14M10 19l16 1" /></svg>
        <div className="surprise"><label><input type="checkbox" checked={unexpected} onChange={event => setUnexpected(event.target.checked)} /><span>A surprise £60 trip home?</span></label>
          <p aria-live="polite" aria-atomic="true">{unexpected ? "£150 − £60 = £90 left. The trip uses 40% of your remaining money. A little breathing room matters." : "Try adding it. What happens to your breathing room?"}</p>
        </div>
        <footer className="note-footer">Illustrative figures, not a typical or recommended budget.</footer>
      </div>
      <figcaption className="hand scene-caption">The numbers are simple.<br />The decisions? That takes confidence.</figcaption>
    </figure>
  );
}
