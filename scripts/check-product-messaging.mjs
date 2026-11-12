import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import ts from "typescript";

const require = createRequire(import.meta.url);
const modules = new Map();
const overrides = new Map();
const deliveries = [];
const testEnvironment = {
  RESEND_API_KEY: "mock-key-no-network",
  CONTACT_FROM_EMAIL: "Cashbrite <test@cashbrite.example>",
  CONTACT_TO_EMAIL: "internal@cashbrite.example",
};

// Evaluate the real templates against an in-memory Resend replacement, never the network.
function load(relativePath) {
  const filename = path.resolve(relativePath);
  if (modules.has(filename)) return modules.get(filename).exports;
  const loadedModule = { exports: {} };
  modules.set(filename, loadedModule);
  const resolve = (id) => {
    if (overrides.has(id)) return overrides.get(id);
    if (id === "server-only") return {};
    if (id === "resend") return { Resend: class {
      emails = { send: async (message) => { deliveries.push(message); return { data: { id: "mock" }, error: null }; } };
    } };
    if (id.startsWith("@/")) {
      const base = id.slice(2);
      return load(fs.existsSync(`${base}.ts`) ? `${base}.ts` : `${base}.tsx`);
    }
    return require(id);
  };
  const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  vm.runInNewContext(compiled, {
    exports: loadedModule.exports, module: loadedModule, require: resolve, Buffer, URL,
    process: { env: testEnvironment },
  }, { filename });
  return loadedModule.exports;
}

const plain = (value) => JSON.parse(JSON.stringify(value));
const { quizQuestions } = load("data/quizQuestions.ts");
const { scoreQuiz, getResultBand } = load("lib/quizScoring.ts");
const { demoPremiumAssessment: demo, demoPremiumAnswers: answers } = load("lib/premiumPlanDemo.ts");
assert.equal(quizQuestions.length, 30);
assert.deepEqual(Object.keys(answers).sort(), plain(quizQuestions.map((q) => q.id).sort()));
for (const q of quizQuestions) assert(q.answers.some((a) => a.id === answers[q.id]), q.id);
assert.deepEqual(plain(demo.scores), plain(scoreQuiz(answers)));
assert.equal(demo.scores.band, getResultBand(demo.scores.readinessScore));
assert.equal(demo.scores.maxScore, 90);

const { generatePremiumActionPlan, getPremiumPriorityCategories } = load("lib/premiumActionPlan.ts");
const premium = generatePremiumActionPlan(demo.registration, demo.scores);
assert.deepEqual(plain(premium.priorityAreas.map((area) => area.category)), plain(getPremiumPriorityCategories(demo.scores)));
assert.equal(premium.priorityAreas.flatMap((area) => area.actions).length, 15);
assert.equal(premium.roadmap.length, 4);
assert.equal(premium.confidenceTracker.currentScore, demo.scores.readinessScore);

const { getPriorityCategories } = load("lib/actionPlan.ts");
const categoryIds = Object.keys(demo.scores.categoryScores);
const tiedScores = { ...plain(demo.scores), categoryScores: Object.fromEntries(
  [...categoryIds].reverse().map((category) => [category, { score: 5, max: 9, percentage: 41 }]),
) };
assert.deepEqual(plain(getPriorityCategories(tiedScores)), categoryIds.slice(0, 3));
assert.deepEqual(plain(getPremiumPriorityCategories(tiedScores)), categoryIds.slice(0, 3));
const boundaryTie = plain(tiedScores);
boundaryTie.categoryScores.savingHabits.percentage = 10;
boundaryTie.categoryScores.budgetingSpending.percentage = 20;
boundaryTie.categoryScores.bankAccountsOverdrafts.percentage = 30;
boundaryTie.categoryScores.creditBorrowing.percentage = 30;
assert.deepEqual(plain(getPremiumPriorityCategories(boundaryTie)), ["savingHabits", "budgetingSpending", "bankAccountsOverdrafts"]);
for (const category of categoryIds) {
  const categoryFirst = plain(demo.scores);
  categoryFirst.categoryScores[category].percentage = 0;
  const plan = generatePremiumActionPlan(demo.registration, categoryFirst);
  const chapterActions = new Set(plan.priorityAreas.flatMap((area) => area.actions));
  const weeklyActions = plan.roadmap.flatMap((week) => week.actions);
  assert.equal(new Set(weeklyActions).size, 12);
  assert(weeklyActions.every((action) => !chapterActions.has(action)), category);
  assert.equal(plan.priorityAreas.flatMap((area) => area.actions).length, 15);
}
const { validateAssessmentRequest } = load("lib/assessmentValidation.ts");
assert.equal(validateAssessmentRequest({ registration: demo.registration, selectedAnswers: answers }), null);
assert.equal(validateAssessmentRequest({ registration: { ...demo.registration, reportConsent: false }, selectedAnswers: answers }),
  "Please confirm that we may use your details to create and email your full report.");

if (process.argv.includes("--pdf-manifest")) {
  fs.mkdirSync("tmp/pdfs/phase3c1", { recursive: true });
  fs.writeFileSync("tmp/pdfs/phase3c1/manifest.json", JSON.stringify({ demo, plan: premium }, null, 2));
}

const { generateActionPlan } = load("lib/actionPlan.ts");
const actionPlan = generateActionPlan(demo.registration, demo.scores);
const { sendActionPlanEmail, sendPremiumPurchaseConfirmation } = load("lib/assessmentEmail.ts");
const resultUrl = "https://cashbrite.example/results?id=00000000-0000-4000-8000-000000000001";
const checkoutRecoveryUrl = "https://cashbrite.example/checkout/money-ready-plan?assessmentId=00000000-0000-4000-8000-000000000001&source=email";
await sendActionPlanEmail({ registration: demo.registration, scores: demo.scores, actionPlan, resultUrl, checkoutRecoveryUrl });
const free = deliveries[0];
assert.equal(free.subject, "Your Cashbrite Money Confidence Snapshot");
assert.equal(free.to, demo.registration.email);
assert.equal(free.attachments, undefined);
for (const content of [free.html, free.text]) {
  assert(content.includes("Cashbrite Money Confidence Snapshot"));
  assert(content.includes("Cashbrite Personalised Money Action Plan"));
  assert(content.includes(checkoutRecoveryUrl));
  assert(content.includes(resultUrl));
  assert(content.includes("/privacy-policy"));
  assert(content.includes("/financial-disclaimer"));
  assert(!content.includes("Money Ready Plan"));
  assert(!content.includes("90-Day Progress Tracker"));
}

const pdfAttachment = Buffer.from("mock attachment, no PDF generated");
const accessUrl = "https://cashbrite.example/money-ready-plan/success?session_id=cs_test_MockOnly";
await sendPremiumPurchaseConfirmation({ registration: demo.registration, amount: 1900, currency: "gbp", accessUrl, pdfAttachment, idempotencyKey: "cashbrite-plan/synthetic/message" });
const paid = deliveries[1];
assert.equal(paid.subject, "Your Cashbrite Personalised Money Action Plan");
assert.equal(paid.to, demo.registration.email);
assert(paid.text.includes(accessUrl));
assert(paid.text.includes("not regulated financial"));
assert.equal(paid.attachments[0].content, pdfAttachment);
assert.equal(paid.attachments[0].filename, "Cashbrite-Money-Ready-Plan-Alex.pdf");

// Render the real results/recovery pages with a synthetic record and no database client.
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const assessmentId = "00000000-0000-4000-8000-000000000001";
const interest = [];
overrides.set("@/lib/assessmentDb", {
  getAssessment: async (id) => id === assessmentId ? { ...demo, id, actionPlan } : null,
  recordPremiumInterest: async (event) => { interest.push(event); return true; },
});
overrides.set("@/lib/seo", { createSeoMetadata: (value) => value });
overrides.set("next/image", { __esModule: true, default: ({ alt, src, width, height }) => React.createElement("img", { alt, src, width, height }) });
overrides.set("next/link", { __esModule: true, default: ({ children, ...props }) => React.createElement("a", props, children) });
overrides.set("@/components/PremiumPlanCtas", {
  UnlockPlanButton: ({ assessmentId: id, label }) => React.createElement("button", { "data-assessment-id": id }, label),
});
let snapshotInput;
overrides.set("@/components/ResultsExperience", { ResultsExperience: props => {
  snapshotInput = props;
  return React.createElement("main", null, "Cashbrite Money Confidence Snapshot");
} });
const ResultsPage = load("app/results/page.tsx").default;
const resultsHtml = renderToStaticMarkup(await ResultsPage({ searchParams: Promise.resolve({ id: assessmentId }) }));
assert(resultsHtml.includes("Cashbrite Money Confidence Snapshot"));
assert.equal(snapshotInput.savedScores.readinessScore, demo.scores.readinessScore);
assert.equal(snapshotInput.registration, undefined);
assert.equal(snapshotInput.actionPlan, undefined);
overrides.set("next/navigation", { redirect: target => { throw Error(`REDIRECT:${target}`); } });
const RecoveryPage = load("app/checkout/money-ready-plan/page.tsx").default;
assert.throws(() => RecoveryPage(), /REDIRECT:\/quiz/);
assert.equal(interest.length,0);
overrides.set("next/headers", { cookies: async () => ({ get: () => ({ value: "synthetic" }) }) });
overrides.set("@/lib/reportAccess", { reportCookieName: "synthetic", getRegisteredReport: async () => demo });
const ReportPage = load("app/report/page.tsx").default;
const reportHtml = renderToStaticMarkup(await ReportPage());
assert(reportHtml.includes("/api/reports/pdf"));
assert(reportHtml.includes("/api/reports/excel"));
assert(reportHtml.includes("Cashbrite Personalised Money Action Plan"));
assert(!reportHtml.includes("Continue to Secure Checkout"));

console.log(JSON.stringify({
  demo: { rawScore: demo.scores.totalScore, max: demo.scores.maxScore, score: demo.scores.readinessScore, band: demo.scores.band },
  categories: demo.scores.categoryScores,
  priorities: premium.priorityAreas.map((area) => area.title),
  checks: "Canonical scoring, tie ordering, revised consent, 15 chapter actions and 12 distinct roadmap tasks, retained historical templates, identity-free Snapshot props, retired recovery redirect, complete registered report and protected download links passed. No network calls.",
}, null, 2));
