import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import { serverLoader } from "./server-runtime.mjs";

const require = createRequire(import.meta.url);
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const records = new Map();
const overrides = new Map([
  ["@/lib/assessmentDb", { getAssessment: async (id) => records.get(id) ?? null }],
  ["@/lib/seo", { createSeoMetadata: (value) => value }],
  ["next/link", { __esModule: true, default: ({ children, ...props }) => React.createElement("a", props, children) }],
]);
// No environment secrets, storage adapters or provider calls are available to this render harness.
const load = serverLoader(overrides, { NODE_ENV: "test" });
const ActualButton = load("components/PremiumPlanCtas.tsx").UnlockPlanButton;
overrides.set("@/components/PremiumPlanCtas", { UnlockPlanButton: (props) => React.createElement("div", { "data-assessment-id": props.assessmentId }, React.createElement(ActualButton, props)) });
const ResultsPage = load("app/results/page.tsx").default;
const { quizQuestions, categoryLabels } = load("data/quizQuestions.ts");
const { scoreQuiz } = load("lib/quizScoring.ts");
const { generateActionPlan } = load("lib/actionPlan.ts");
const { generatePremiumActionPlan } = load("lib/premiumActionPlan.ts");
const { selectPriorityCategories } = load("lib/assessmentPriorities.ts");
const { demoPremiumAssessment, demoPremiumAnswers } = load("lib/premiumPlanDemo.ts");
const categories = Object.keys(categoryLabels);
const plain = (value) => JSON.parse(JSON.stringify(value));
const answersAt = (points) => Object.fromEntries(quizQuestions.map((q) => [q.id, q.answers.find((a) => a.points === points).id]));
const cases = [
  ["low", answersAt(0)],
  ["middle", answersAt(2)],
  ["high", answersAt(3)],
  ["demo", demoPremiumAnswers],
  ["building", Object.fromEntries(quizQuestions.map((q, i) => [q.id, q.answers.find((a) => a.points === (i % 2 ? 2 : 3)).id]))],
  ["mixed", Object.fromEntries(quizQuestions.map((q, i) => [q.id, q.answers.find((a) => a.points === (i % 4)).id]))],
];
// Include each category as the weakest, exercising all real excerpts and long labels.
for (const category of categories) cases.push([`priority-${category}`, Object.fromEntries(quizQuestions.map((q) => [q.id, q.answers.find((a) => a.points === (q.category === category ? 0 : 3)).id]))]);
if (process.argv.includes("--write-fixtures")) fs.mkdirSync("tmp/results-phase3c3", { recursive: true });
const results = [];
for (let i = 0; i < cases.length; i++) {
  const [name, answers] = cases[i];
  const scores = scoreQuiz(answers);
  const registration = { ...plain(demoPremiumAssessment.registration), firstName: name === "mixed" ? "Alexandra-Christina" : "Alex" };
  const id = `00000000-0000-4000-8000-${String(i + 1).padStart(12, "0")}`;
  const record = { ...plain(demoPremiumAssessment), id, registration, scores, actionPlan: generateActionPlan(registration, scores) };
  const unchanged = JSON.stringify(record);
  records.set(id, record);
  const html = renderToStaticMarkup(await ResultsPage({ searchParams: Promise.resolve({ id }) }));
  assert.equal(JSON.stringify(record), unchanged, "presentation must not mutate assessment");
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert(html.includes('text-3xl md:text-5xl">Your Money Confidence Snapshot</h1>'));
  assert(!html.includes("£39") && !/launch offer|future price|line-through/i.test(html));
  assert(html.includes("One-off payment. No subscription."));
  assert(html.includes("Personalised Money Action Plan"));
  assert(html.includes("<details ") && !/<details[^>]*\bopen\b/.test(html));
  assert(html.includes("How your priorities are selected</summary>"));
  assert(html.includes(`aria-label="${scores.readinessScore} out of 100"`));
  assert(html.includes(scores.band));
  assert(html.includes(`data-assessment-id="${id}"`));
  assert.equal((html.match(/Get My £19 Action Plan/g) ?? []).length, 1);
  assert(!html.includes(registration.email));
  assert(!html.includes("Cashbrite-Money-Ready-Plan-"));
  assert(html.includes('href="/contact"') && html.includes('href="/resources"') && html.includes('href="/student-budget-calculator"'));
  assert(html.includes(scores.strengths.length ? "Your strengths" : "Your strongest starting points"));
  const ranked = [...categories].sort((a, b) => scores.categoryScores[b].percentage - scores.categoryScores[a].percentage || categories.indexOf(a) - categories.indexOf(b));
  const expectedStrengths = (scores.strengths.length ? ranked.filter((category) => scores.strengths.includes(category)) : ranked).slice(0, 3);
  const strengthHtml = html.split("What to carry forward")[1].split("Where to focus next")[0];
  assert.equal((strengthHtml.match(/<li\b/g) ?? []).length, expectedStrengths.length);
  for (const category of expectedStrengths) assert(strengthHtml.includes(categoryLabels[category]));
  assert(html.includes(categories.every((category) => scores.categoryScores[category].percentage >= 75) ? "Areas to build on" : "Your priorities"));
  const priorities = plain(selectPriorityCategories(scores));
  const priorityHtml = html.split('Where to focus next')[1].split('</section>')[0];
  assert.equal((priorityHtml.match(/<li\b/g) ?? []).length, 3);
  for (const category of priorities) assert(priorityHtml.includes(categoryLabels[category]));
  if (["low", "middle", "high"].includes(name)) assert.deepEqual(priorities, categories.slice(0, 3), "ties follow canonical order");
  const premium = generatePremiumActionPlan(registration, scores);
  const sample = premium.priorityAreas[0];
  const sampleHtml = html.split('id="sample-heading"')[1].split('</section>')[0];
  assert(sampleHtml.includes(sample.whatToLearn));
  if (sample.creditLearningGuide) assert(sampleHtml.includes(sample.realLifeExample.summary));
  const actionIndex = sample.creditLearningGuide ? 2 : 0;
  assert(sampleHtml.includes(sample.actions[actionIndex]));
  for (let action = 0; action < sample.actions.length; action++) {
    if (action !== actionIndex) assert(!sampleHtml.includes(sample.actions[action]), "only one premium action is exposed");
  }
  assert(!html.includes(premium.roadmap[0].actions[0]));
  assert(!html.includes(premium.personalMoneyProfile));
  if (process.argv.includes("--write-fixtures")) fs.writeFileSync(`tmp/results-phase3c3/${name}.html`, html);
  results.push({ name, score: scores.readinessScore, band: scores.band, sample: sample.category, priorities });
}
for (const params of [{}, { id: "missing" }]) {
  const unavailable = renderToStaticMarkup(await ResultsPage({ searchParams: Promise.resolve(params) }));
  assert(unavailable.includes("Your report is not available yet"));
  assert(!unavailable.includes("Get My £19 Action Plan"));
}
console.log(JSON.stringify({ results, checks: `${cases.length} synthetic renders; unchanged scoring/data, all category excerpts, threshold/fallback/high-score copy, deterministic ties, limited server-rendered sample, actual checkout button props, free routes and unavailable states. No database, payments or emails.` }, null, 2));
