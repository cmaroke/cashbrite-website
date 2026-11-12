// Exercise real generators using synthetic data; no provider or database connection.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { PDFDocument } from 'pdf-lib';
const require = createRequire(import.meta.url);
const cache = new Map();
// PDF-lib checks native Array identity, so compile test modules in the Node realm.
function load(relative) {
  if (cache.has(relative)) return cache.get(relative);
  const loaded = { exports: {} };
  const source = ts.transpileModule(fs.readFileSync(relative, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  }).outputText;
  const resolve = id => id.startsWith('@/') ? load(`${id.slice(2)}.ts`) : require(id);
  vm.runInThisContext(`(function(require,module,exports){${source}\n})`, { filename: path.resolve(relative) })(resolve, loaded, loaded.exports);
  cache.set(relative, loaded.exports);
  return loaded.exports;
}
const demo = load('lib/premiumPlanDemo.ts').demoPremiumAssessment;
const { generateMoneyReadyPlanPdf } = load('lib/moneyReadyPlanPdf.ts');
const { generateFirstPaycheckChecklistPdf } = load('lib/firstPaycheckChecklistPdf.ts');
const plan = await generateMoneyReadyPlanPdf(demo);
const checklist = await generateFirstPaycheckChecklistPdf();
const report = await PDFDocument.load(plan);
const free = await PDFDocument.load(checklist);
assert(report.getPageCount() > 10);
assert.equal(free.getPageCount(), 2);
const tracker = fs.readFileSync('assets/downloads/cashbrite-budget-tracker.xlsx');
assert.equal(tracker.subarray(0,2).toString(), 'PK');
fs.mkdirSync('output/release-qa', { recursive: true });
fs.writeFileSync('output/release-qa/paid-plan-synthetic.pdf', plan);
fs.writeFileSync('output/release-qa/free-checklist.pdf', checklist);
console.log(JSON.stringify({ paidPlanPages: report.getPageCount(), paidPlanBytes: plan.length, freeChecklistPages: free.getPageCount(), freeChecklistBytes: checklist.length, trackerBytes: tracker.length, externalCalls: 0 }));
