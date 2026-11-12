import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import { NextResponse } from "next/server.js";
import { serverLoader } from "./server-runtime.mjs";
const require = createRequire(import.meta.url);
const { PGlite } = require(process.env.PGLITE_MODULE_PATH ?? "/tmp/cashbrite-pg-test/node_modules/@electric-sql/pglite");
const db = new PGlite();
await db.exec(fs.readFileSync("db/schema.sql", "utf8"));
const background = [], messages = [], logs = [];
let provider = "accepted", pdfFailure = false, insertFailure = false, lostAcknowledgement = false, schedulingFailure = false, cookie = "";
const env = { NODE_ENV: "production", DATABASE_URL: "synthetic-only", NEXT_PUBLIC_SITE_URL: "https://cashbrite.example", RESEND_API_KEY: "mock", CONTACT_FROM_EMAIL: "Cashbrite <test@cashbrite.example>" };
const overrides = new Map([
  ["next/server", { NextResponse, after: task => { if (schedulingFailure) throw Error("PRIVATE_SCHEDULER"); background.push(task); } }],
  ["next/headers", { cookies: async () => ({ get: () => cookie ? { value: cookie } : undefined }) }],
  ["@neondatabase/serverless", { neon: () => async (strings, ...values) => {
    const sql = strings.reduce((s, part, i) => s + (i ? `$${i}` : "") + part, "");
    if (insertFailure && sql.includes("INSERT INTO assessment_results")) throw Error("PRIVATE_DATABASE");
    const result = await db.query(sql, values);
    if (lostAcknowledgement && sql.includes("INSERT INTO assessment_results")) { lostAcknowledgement = false; throw Error("PRIVATE_LOST_ACK"); }
    return result.rows;
  } }],
  ["@/lib/moneyReadyPlanPdf", { generateMoneyReadyPlanPdf: async () => { if (pdfFailure) throw Error("PRIVATE_PDF"); return Buffer.from("%PDF-synthetic-unit-fixture"); } }],
  ["resend", { Resend: class { emails = { send: async (message, options) => {
    messages.push({ message, options });
    if (provider === "hang") return new Promise(() => {});
    if (provider === "throw") throw Error("PRIVATE_PROVIDER");
    return provider === "rejected" ? { error: { name: "validation_error" } } : { data: { id: "synthetic-accepted" } };
  } }; } }],
]);
const load = serverLoader(overrides, env, { error: (...args) => logs.push(args) });
const { POST } = load("app/api/assessments/route.ts");
const access = load("lib/reportAccess.ts");
const { demoPremiumAnswers } = load("lib/premiumPlanDemo.ts");
const { quizQuestions } = load("data/quizQuestions.ts");
const { scoreQuiz } = load("lib/quizScoring.ts");
const expected = scoreQuiz(demoPremiumAnswers);
const registration = { firstName: "Alex", lastName: "Synthetic", age: 17, email: "alex@cashbrite.example", educationStage: "", referralSource: "", reportConsent: true, marketingConsent: false };
const key = n => n.toString(16).padStart(64,"0");
const body = (n, extra = {}) => ({ registration, selectedAnswers: demoPremiumAnswers, reportKey: key(n), ...extra });
const request = (payload, origin = "https://cashbrite.example") => new Request("https://cashbrite.example/api/assessments", { method: "POST", headers: { "Content-Type": "application/json", Origin: origin }, body: JSON.stringify(payload) });
const count = async () => Number((await db.query("SELECT count(*) AS n FROM assessment_results")).rows[0].n);
const drain = async () => { const tasks = background.splice(0); await Promise.all(tasks.map(task => task())); };
const checks = [];
try {
  assert.equal(quizQuestions.length, 30);
  assert.equal((await POST(request({ selectedAnswers: demoPremiumAnswers }))).status,400);
  assert.equal(await count(),0);
  const response = await POST(request(body(1)));
  assert.equal(response.status,200); assert.equal(messages.length,0,"email must not hold up registration response");
  assert.equal((await response.json()).reportUrl,"/report");
  assert.match(response.headers.get("set-cookie"), /HttpOnly/); assert.match(response.headers.get("set-cookie"), /Secure/);
  await drain();
  const rows = (await db.query("SELECT * FROM assessment_results")).rows;
  assert.equal(rows.length,1); assert.equal(rows[0].readiness_score,expected.readinessScore);
  assert.equal(rows[0].marketing_consent,false); assert.equal(rows[0].age,17);
  assert.equal(rows[0].report_access_hash,access.hashReportKey(key(1))); assert.notEqual(rows[0].report_access_hash,key(1));
  assert.equal(rows[0].report_email_status,"sent");
  assert.equal(messages.length,1); assert(messages[0].message.html.includes("#token="));
  assert(!/£19|purchas|checkout|upgrade/i.test(messages[0].message.html+messages[0].message.text));
  assert(messages[0].message.attachments[0].filename.endsWith(".pdf"));
  checks.push("30 questions; server scoring; age 17; optional marketing; response before email; hashed grant; branded PDF email");

  const repeats = await Promise.all([1,2,3].map(() => POST(request(body(1)))));
  assert(repeats.every(r => r.status===200)); await drain(); assert.equal(messages.length,1); assert.equal(await count(),1);
  assert.equal((await POST(request(body(1,{registration:{...registration,email:"changed@cashbrite.example"}})))).status,409);
  assert.equal((await POST(request(body(1),"https://untrusted.example"))).status,403);
  checks.push("Sequential/concurrent duplicate registration; conflicting retry; cross-origin rejection");

  const simultaneous = await Promise.all([1,2,3].map(() => POST(request(body(2)))));
  assert(simultaneous.every(r => r.status===200)); await drain(); assert.equal(await count(),2); assert.equal(messages.length,2);
  lostAcknowledgement=true; assert.equal((await POST(request(body(3)))).status,503);
  assert.equal((await POST(request(body(3)))).status,200); assert.equal(await count(),3);
  assert.equal(background.length,0,"lost scheduling acknowledgement must not cause an unreviewed duplicate email");
  checks.push("Concurrent first registration; lost save acknowledgement retry without duplicate rows/sends");

  for (const invalid of [null,[],{},body(4,{reportKey:"guess"}),body(4,{registration:{...registration,reportConsent:false}}),body(4,{selectedAnswers:{}}),body(4,{registration:{...registration,age:12}}),body(4,{registration:{...registration,email:"invalid"}})]) {
    assert.equal((await POST(request(invalid))).status,400);
  }
  insertFailure=true; const failure=await POST(request(body(4))); assert.equal(failure.status,503); assert(!JSON.stringify(await failure.json()).includes("PRIVATE")); insertFailure=false;
  checks.push("Invalid forms/answers/age/key/consent and sanitised storage failures");

  provider="rejected"; assert.equal((await POST(request(body(5)))).status,200); await drain();
  assert.equal((await db.query("SELECT report_email_status FROM assessment_results WHERE id=$1",[access.reportAssessmentId(key(5))])).rows[0].report_email_status,"needs_review");
  assert(await access.getRegisteredReport(key(5)),"email failure must not remove online access");
  provider="accepted"; pdfFailure=true; assert.equal((await POST(request(body(6)))).status,200); await drain(); pdfFailure=false;
  assert(await access.getRegisteredReport(key(6)));
  schedulingFailure=true; assert.equal((await POST(request(body(7)))).status,200); schedulingFailure=false;
  checks.push("Email rejection, PDF failure and background scheduling failure preserve report access");

  cookie=key(1);
  const pdf=load("app/api/reports/pdf/route.ts").GET;
  const excel=load("app/api/reports/excel/route.ts").GET;
  assert.equal((await pdf()).status,200); const spreadsheet=await excel(); assert.equal(spreadsheet.status,200);
  assert.equal(Buffer.from(await spreadsheet.arrayBuffer()).subarray(0,2).toString(),"PK");
  cookie=""; assert.equal((await pdf()).status,403); assert.equal((await excel()).status,403);
  cookie=key(999); assert.equal((await pdf()).status,403);
  const exchange=load("app/api/reports/access/route.ts").POST;
  assert.equal((await exchange(new Request("https://cashbrite.example/api/reports/access",{method:"POST",body:JSON.stringify({token:key(1)})}))).status,200);
  assert.equal((await exchange(new Request("https://cashbrite.example/api/reports/access",{method:"POST",body:JSON.stringify({token:key(999)})}))).status,403);
  checks.push("Private web lookup, email-link exchange, protected PDF/Excel and unauthorised access rejection");

  provider="hang";
  const {deliverFullReport}=load("lib/fullReportDelivery.ts");
  const assessment=await access.getRegisteredReport(key(7));
  await deliverFullReport(assessment,"https://cashbrite.example/report/access#token="+key(7),10);
  assert.equal((await db.query("SELECT report_email_status FROM assessment_results WHERE id=$1",[assessment.id])).rows[0].report_email_status,"needs_review");
  const retired=load("app/api/stripe/checkout/route.ts").POST;
  assert.equal((await retired()).status,410);
  assert(!JSON.stringify(logs).includes(registration.email)); assert(!JSON.stringify(logs).includes(key(1)));
  checks.push("Bounded ambiguous delivery; no secret/identity logs; retired Checkout cannot contact Stripe");

  const legacy = new PGlite();
  await legacy.exec("CREATE TABLE assessment_results(id UUID PRIMARY KEY,email TEXT NOT NULL); INSERT INTO assessment_results VALUES('00000000-0000-4000-8000-000000000001','historical@cashbrite.example');");
  await legacy.exec(fs.readFileSync("db/migrations/004_free_report_access.sql","utf8"));
  const preserved=(await legacy.query("SELECT email,report_access_hash FROM assessment_results")).rows[0];
  assert.equal(preserved.email,"historical@cashbrite.example"); assert.equal(preserved.report_access_hash,null);
  await legacy.close();
  checks.push("Additive migration preserves legacy rows without granting report access");
  console.log(JSON.stringify({passed:checks,externalProviderCalls:0,questionCount:quizQuestions.length,expectedScore:expected.readinessScore}));
} finally { await db.close(); }
