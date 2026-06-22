import fs from "node:fs";
import vm from "node:vm";
import { createRequire } from "node:module";
import ts from "typescript";

const require = createRequire(import.meta.url);

function transpile(path) {
  return ts.transpileModule(fs.readFileSync(path, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
}

function evaluateCommonJs(source, resolveModule = require) {
  const sandbox = { exports: {}, module: { exports: {} }, require: resolveModule };
  sandbox.exports = sandbox.module.exports;
  vm.runInNewContext(source, sandbox);
  return sandbox.module.exports;
}

const quizData = evaluateCommonJs(transpile("data/quizQuestions.ts"));
const scoring = evaluateCommonJs(transpile("lib/quizScoring.ts"), (moduleId) => {
  if (moduleId === "@/data/quizQuestions") return quizData;
  return require(moduleId);
});

const { quizQuestions } = quizData;
const { scoreQuiz } = scoring;

function answersFor(pointPattern) {
  return Object.fromEntries(
    quizQuestions.map((question, index) => {
      const targetPoints = pointPattern[index % pointPattern.length];
      const answer = question.answers.find((candidate) => candidate.points === targetPoints);
      if (!answer) throw new Error(`${question.id} has no ${targetPoints}-point answer.`);
      return [question.id, answer.id];
    }),
  );
}

for (const question of quizQuestions) {
  const scale = question.answers.map((answer) => answer.points).sort((a, b) => a - b);
  if (scale.join(",") !== "0,1,2,3") {
    throw new Error(`${question.id} must contain exactly one 3, 2, 1 and 0-point answer.`);
  }
}

const scenarios = {
  strong: { pattern: [3, 3, 3, 3, 3, 3, 3, 3, 3, 2], min: 85, max: 100 },
  average: { pattern: [2, 2, 1], min: 55, max: 75 },
  weak: { pattern: [1, 1, 0], min: 0, max: 54 },
  poor: { pattern: [0, 0, 0, 1], min: 0, max: 39 },
};

const results = Object.fromEntries(
  Object.entries(scenarios).map(([name, scenario]) => {
    const score = scoreQuiz(answersFor(scenario.pattern)).readinessScore;
    if (score < scenario.min || score > scenario.max) {
      throw new Error(`${name} pattern scored ${score}; expected ${scenario.min}-${scenario.max}.`);
    }
    return [name, score];
  }),
);

console.log(`Cashbrite scoring sanity check passed: ${JSON.stringify(results)}`);
