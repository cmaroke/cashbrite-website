import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import { serverLoader } from "./server-runtime.mjs";

const require = createRequire(import.meta.url);
const { PGlite } = require(process.env.PGLITE_MODULE_PATH ?? "/tmp/cashbrite-pg-test/node_modules/@electric-sql/pglite");
const Stripe = require("stripe");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const stripeSdk = new Stripe("sk_test_mock_never_calls_network");
const db = new PGlite();
const assessmentId = "00000000-0000-4000-8000-000000000001";
const product = "cashbrite_money_ready_plan";
const env = { NODE_ENV: "production", DATABASE_URL: "synthetic-local-adapter", STRIPE_PRICE_ID: "price_mock",
  STRIPE_WEBHOOK_SECRET: "whsec_mock", NEXT_PUBLIC_SITE_URL: "https://cashbrite.example",
  CONTACT_FROM_EMAIL: "Cashbrite <test@cashbrite.example>", RESEND_API_KEY: "mock" };
const sessions = new Map();
const keys = new Map();
const logs = [];
let sends = 0, creates = 0, pdfCalls = 0, mode = "accepted", pdfFailure = false, failSentCommit = false;
let requireSendingClaim = true;
let failCheckoutSave = false;
let internalMode = "accepted", internalCalls = 0, internalStarted;
let verificationGate;
const fixtures = new Map();
const overrides = new Map();
overrides.set("@neondatabase/serverless", { neon: () => async (strings, ...values) => {
  const text = strings.reduce((sql, part, index) => sql + (index ? `$${index}` : "") + part, "");
  if (failCheckoutSave && text.includes("'checkout_created'")) throw new Error("synthetic_checkout_save_failure");
  if (failSentCommit && text.includes("delivery_sent_at=CASE") && values.includes("sent")) {
    failSentCommit = false; throw new Error("synthetic_commit_failure");
  }
  try { return (await db.query(text, values)).rows; }
  catch (error) { console.error("Synthetic SQL test failure:", error.message); throw error; }
} });
overrides.set("@/lib/assessmentDb", { getAssessment: async (id) => fixtures.get(id) ?? null, recordPremiumInterest: async () => true });
overrides.set("@/lib/moneyReadyPlanPdf", { generateMoneyReadyPlanPdf: async () => {
  pdfCalls++;
  const paid = await db.query("SELECT id FROM premium_purchases WHERE payment_status='paid' AND delivery_status='sending'");
  if (requireSendingClaim) assert(paid.rows.length > 0, "payment must be committed before PDF generation");
  if (pdfFailure) throw new Error("synthetic_pdf_failure");
  return Buffer.from("synthetic attachment; no real PDF");
} });
overrides.set("resend", { Resend: class { emails = { send: async (_message, options) => {
  if (options.idempotencyKey.endsWith("/internal")) {
    internalCalls++;
    const persisted = await db.query("SELECT delivery_status FROM premium_purchases WHERE id=$1", [_message.text.match(/purchase (\d+)/)[1]]);
    assert.equal(persisted.rows[0].delivery_status, "sent", "customer acceptance must precede internal notification");
    internalStarted?.();
    if (internalMode === "hang") return new Promise(() => {});
    if (internalMode === "throw") throw new Error("synthetic_internal_failure");
    return internalMode === "rejected" ? { error: { name: "validation_error" } } : { data: { id: "internal_mock" } };
  }
  sends++; assert(options.idempotencyKey.startsWith("cashbrite-plan/"));
  assert.equal(_message.to, "alex.demo@cashbrite.example");
  assert.equal(_message.attachments[0].filename, "Cashbrite-Money-Ready-Plan-Alex.pdf");
  if (mode === "throw") throw new Error("synthetic_timeout");
  if (mode === "rejected") return { data: null, error: { name: "validation_error" } };
  if (mode === "ambiguous") return { data: null, error: { name: "internal_server_error" } };
  return { data: { id: "11111111-1111-4111-8111-111111111111" }, error: null };
} }; } });
overrides.set("@/lib/stripe", {
  moneyReadyPlanProduct: product,
  getSiteUrl: () => { if (!env.NEXT_PUBLIC_SITE_URL) throw new Error("synthetic_configuration_error"); return env.NEXT_PUBLIC_SITE_URL; },
  getStripe: () => ({ webhooks: stripeSdk.webhooks, prices: { retrieve: async () => ({ id: "price_mock", active: true, unit_amount: 1900, currency: "gbp", recurring: null }) },
    checkout: { sessions: {
      retrieve: async (id) => { if (verificationGate) { const gate = verificationGate; verificationGate = undefined; await gate; } if (!sessions.has(id)) throw new Error("synthetic_unknown"); return sessions.get(id); },
      create: async (params, options) => {
        assert(options?.idempotencyKey);
        if (keys.has(options.idempotencyKey)) return keys.get(options.idempotencyKey);
        creates++; const session = makeSession(`Checkout${creates}`, { status: "open", payment_status: "unpaid", metadata: params.metadata, client_reference_id: params.client_reference_id });
        keys.set(options.idempotencyKey, session); return session;
      },
    } },
  }),
});
overrides.set("next/image", { __esModule: true, default: ({ src, alt }) => React.createElement("img", { src, alt }) });
overrides.set("next/link", { __esModule: true, default: ({ children, ...props }) => React.createElement("a", props, children) });
overrides.set("@/components/Logo", { Logo: () => React.createElement("span", null, "Cashbrite") });
const load = serverLoader(overrides, env, { error: (...args) => logs.push(args) });
const demo = load("lib/premiumPlanDemo.ts").demoPremiumAssessment;
fixtures.set(assessmentId, { ...demo, id: assessmentId });
function makeSession(suffix, changes = {}) {
  const session = { id: `cs_test_${suffix}`, status: "complete", payment_status: "paid", mode: "payment", currency: "gbp", amount_total: 1900,
    client_reference_id: assessmentId, metadata: { assessment_id: assessmentId, product }, payment_intent: `pi_${suffix}`,
    line_items: { has_more: false, data: [{ quantity: 1, price: { id: "price_mock", unit_amount: 1900, currency: "gbp", recurring: null } }] },
    url: "https://checkout.stripe.com/mock", ...changes };
  sessions.set(session.id, session); return session;
}
const { POST: webhook } = load("app/api/stripe/webhook/route.ts");
const { POST: checkout } = load("app/api/stripe/checkout/route.ts");
const { GET: download } = load("app/api/money-ready-plan/pdf/route.ts");
const SuccessPage = load("app/money-ready-plan/success/page.tsx").default;
const storage = load("lib/premiumPurchaseDb.ts");
const { runRecovery } = load("lib/operatorRecovery.ts");
const { sanitiseAnalyticsUrl } = load("lib/analyticsPrivacy.ts");
async function deliver(object, type = "checkout.session.completed", valid = true) {
  const payload = JSON.stringify({ id: "evt_mock", type, data: { object } });
  return webhook(new Request("https://cashbrite.example/api/stripe/webhook", { method: "POST", body: payload,
    headers: { "stripe-signature": valid ? stripeSdk.webhooks.generateTestHeaderString({ payload, secret: env.STRIPE_WEBHOOK_SECRET }) : "invalid" } }));
}
async function row(session) { return storage.findSessionPurchase(session.id); }
async function due(purchase) { await db.query("UPDATE premium_purchases SET delivery_next_attempt_at=NOW()-INTERVAL '1 minute' WHERE id=$1", [purchase.id]); }
const passed = [];

try {
  await db.exec(`CREATE TABLE assessment_results (id UUID PRIMARY KEY);
    CREATE TABLE premium_purchases (id BIGSERIAL PRIMARY KEY, assessment_id UUID NOT NULL REFERENCES assessment_results(id) ON DELETE CASCADE,
    email TEXT NOT NULL,stripe_checkout_session_id TEXT NOT NULL UNIQUE,stripe_payment_intent_id TEXT,amount INTEGER NOT NULL,currency TEXT NOT NULL,
    payment_status TEXT NOT NULL,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW());`);
  await db.query("INSERT INTO assessment_results VALUES ($1)", [assessmentId]);
  await db.query("INSERT INTO premium_purchases (assessment_id,email,stripe_checkout_session_id,amount,currency,payment_status) VALUES ($1,'legacy@cashbrite.example','cs_test_Legacy',1900,'gbp','paid')", [assessmentId]);
  await db.exec(fs.readFileSync("db/migrations/003_premium_delivery.sql", "utf8"));
  makeSession("Legacy");
  assert.equal((await row(sessions.get("cs_test_Legacy"))).delivery_status, "needs_review");
  const beforeLegacy = sends; await deliver(sessions.get("cs_test_Legacy")); assert.equal(sends, beforeLegacy);
  passed.push("real migration preserves legacy paid record as needs_review; no resend");

  const success = makeSession("Success"); assert.equal((await deliver(success)).status, 200);
  assert.equal((await row(success)).delivery_status, "sent");
  const beforeDuplicate = [sends, pdfCalls]; await Promise.all([deliver(success), deliver(success)]);
  assert.deepEqual([sends, pdfCalls], beforeDuplicate);
  const concurrent = makeSession("Concurrent"); const beforeConcurrent = sends;
  await Promise.all([deliver(concurrent), deliver(concurrent), deliver(concurrent)]);
  assert.equal(sends, beforeConcurrent + 1);
  passed.push("payment committed before generation; duplicate/concurrent webhooks send once using actual SQL claims");

  const brokenPdf = makeSession("PdfFailure"); pdfFailure = true;
  assert.equal((await deliver(brokenPdf)).status, 503); assert.equal((await row(brokenPdf)).payment_status, "paid");
  pdfFailure = false; await due(await row(brokenPdf)); await deliver(brokenPdf);
  assert.equal((await row(brokenPdf)).delivery_status, "sent");
  passed.push("PDF failure preserves payment; eligible retry succeeds");

  const rejection = makeSession("Rejected"); mode = "rejected";
  assert.equal((await deliver(rejection)).status, 503); assert.equal((await row(rejection)).delivery_status, "failed");
  const beforeBackoff = sends; await deliver(rejection); assert.equal(sends, beforeBackoff);
  mode = "accepted"; await due(await row(rejection)); await deliver(rejection); assert.equal((await row(rejection)).delivery_status, "sent");
  for (const failure of ["throw", "ambiguous"]) {
    const session = makeSession(`Ambiguous${failure}`); mode = failure; await deliver(session);
    assert.equal((await row(session)).delivery_status, "needs_review");
    const beforeReplay = sends; mode = "accepted"; await deliver(session); assert.equal(sends, beforeReplay);
  }
  const missingConfig = makeSession("Config"); delete env.RESEND_API_KEY; await deliver(missingConfig);
  assert.equal((await row(missingConfig)).delivery_status, "failed"); env.RESEND_API_KEY = "mock";
  passed.push("returned rejection, backoff, exceptions, ambiguous response and missing configuration handled conservatively");

  const bounded = makeSession("Bounded"); mode = "rejected";
  for (let i = 0; i < 5; i++) { await deliver(bounded); await due(await row(bounded)); }
  assert.equal((await row(bounded)).delivery_status, "needs_review");
  assert.equal((await row(bounded)).delivery_attempts, 5);
  const beforeLimit = sends; await deliver(bounded); assert.equal(sends, beforeLimit); mode = "accepted";
  const boundedRow = await row(bounded);
  const notSentArgs = ["reconcile", "--purchase-id", boundedRow.id, "--outcome", "not_sent", "--reason", "provider_confirmed_not_sent", "--evidence", "CASE-456"];
  await runRecovery([...notSentArgs, "--execute"], "synthetic-os-user");
  await runRecovery(["retry", "--purchase-id", boundedRow.id], "synthetic-os-user"); assert.equal(sends, beforeLimit);
  await runRecovery(["retry", "--purchase-id", boundedRow.id, "--execute"], "synthetic-os-user");
  assert.equal((await row(bounded)).delivery_status, "sent");
  passed.push("five-attempt limit and explicit not-sent reconciliation; CLI dry-run does not send, authorised retry uses shared service");

  const lostCommit = makeSession("CommitUnknown"); failSentCommit = true; await deliver(lostCommit);
  assert.equal((await row(lostCommit)).delivery_status, "needs_review");
  const beforeCommitReplay = sends; await deliver(lostCommit); assert.equal(sends, beforeCommitReplay);
  for (const afterProvider of [false, true]) {
    const session = makeSession(`Lease${afterProvider}`);
    const purchase = await storage.markPurchasePaid({ assessmentId, email: demo.registration.email, checkoutSessionId: session.id, amount: 1900, currency: "gbp" });
    await db.query("UPDATE premium_purchases SET delivery_status='sending',delivery_claim_token='00000000-0000-4000-8000-000000000099',delivery_lease_until=NOW()-INTERVAL '1 minute',delivery_provider_started_at=$1 WHERE id=$2", [afterProvider ? new Date().toISOString() : null, purchase.id]);
    const beforeLease = sends; await deliver(session);
    assert.equal((await row(session)).delivery_status, afterProvider ? "needs_review" : "sent");
    assert.equal(sends, beforeLease + (afterProvider ? 0 : 1));
  }
  passed.push("accepted-but-uncommitted and abandoned provider-started leases require review; pre-send lease safely reclaimed");

  const old = await row(sessions.get("cs_test_Legacy"));
  assert.equal((await runRecovery(["inspect", "--purchase-id", old.id], "synthetic-os-user")).delivery, "needs_review");
  await assert.rejects(() => runRecovery(["retry", "--purchase-id", old.id, "--execute"], "synthetic-os-user"));
  await assert.rejects(() => runRecovery(["reconcile", "--purchase-id", old.id, "--execute"], "synthetic-os-user"));
  const reconcileArgs = ["reconcile", "--purchase-id", old.id, "--outcome", "accepted", "--provider-id", "11111111-1111-4111-8111-111111111111", "--reason", "provider_accepted", "--evidence", "CASE-123"];
  await runRecovery(reconcileArgs, "synthetic-os-user"); assert.equal((await storage.getPurchase(old.id)).delivery_status, "needs_review");
  await runRecovery([...reconcileArgs, "--execute"], "synthetic-os-user"); assert.equal((await storage.getPurchase(old.id)).delivery_status, "sent");
  const audit = await db.query("SELECT delivery_audit FROM premium_purchases WHERE id=$1", [old.id]); assert.equal(audit.rows[0].delivery_audit.length, 1);
  await assert.rejects(() => runRecovery(["retry", "--purchase-id", old.id, "--execute"], "synthetic-os-user"));
  passed.push("operator dry-run, evidence requirement, auditable reconciliation and no retry of sent/legacy state");
  // Operator A reviews legacy evidence; B reconciles and starts a new ambiguous attempt before A resumes.
  const race = makeSession("StaleEvidence");
  const racePurchase = await storage.markPurchasePaid({ assessmentId, email: demo.registration.email, checkoutSessionId: race.id, amount: 1900, currency: "gbp" });
  await db.query("UPDATE premium_purchases SET delivery_status='needs_review' WHERE id=$1", [racePurchase.id]);
  const staleSnapshot = await storage.getPurchase(racePurchase.id);
  let resume;
  verificationGate = new Promise((resolve) => { resume = resolve; });
  const raceAccepted = ["reconcile", "--purchase-id", racePurchase.id, "--outcome", "accepted", "--provider-id", "11111111-1111-4111-8111-111111111111", "--reason", "provider_accepted", "--evidence", "OLD-CASE", "--execute"];
  const staleOperation = runRecovery(raceAccepted, "operator-A");
  // Wait until A has read the row and entered remote verification.
  while (verificationGate) await new Promise((resolve) => setTimeout(resolve, 1));
  await runRecovery(["reconcile", "--purchase-id", racePurchase.id, "--outcome", "not_sent", "--reason", "provider_confirmed_not_sent", "--evidence", "B-CASE", "--execute"], "operator-B");
  // Null-token ABA: same attempt count must still reject an obsolete legacy row version.
  await db.query("UPDATE premium_purchases SET delivery_status='needs_review',updated_at=NOW() WHERE id=$1", [racePurchase.id]);
  await assert.rejects(() => storage.reconcileDelivery(racePurchase.id, "accepted", "old", {}, staleSnapshot));
  await runRecovery(["reconcile", "--purchase-id", racePurchase.id, "--outcome", "not_sent", "--reason", "provider_confirmed_not_sent", "--evidence", "C-CASE", "--execute"], "operator-B");
  mode = "throw"; await deliver(race); mode = "accepted";
  const newAttempt = await storage.getPurchase(racePurchase.id);
  resume(); await assert.rejects(() => staleOperation);
  const afterRace = await storage.getPurchase(racePurchase.id);
  assert.equal(afterRace.delivery_status, "needs_review");
  assert.equal(afterRace.delivery_claim_token, newAttempt.delivery_claim_token);
  assert.equal(afterRace.delivery_provider_id, null);
  const raceAudit = (await db.query("SELECT delivery_audit FROM premium_purchases WHERE id=$1", [racePurchase.id])).rows[0].delivery_audit;
  assert.equal(raceAudit.length, 2); assert(raceAudit.every((entry) => entry.evidence !== "OLD-CASE"));
  passed.push("concurrent operators reject stale claim/attempt evidence and legacy null-token ABA; no false sent state or stale audit");

  const disabledCount = internalCalls;
  await deliver(makeSession("InternalDisabled")); assert.equal(internalCalls, disabledCount);
  env.CONTACT_TO_EMAIL = "internal@cashbrite.example";
  for (const outcome of ["accepted", "rejected", "throw", "hang"]) {
    internalMode = outcome;
    const session = makeSession(`Internal${outcome}`);
    let started;
    const began = new Promise((resolve) => { started = resolve; }); internalStarted = started;
    const customerBefore = sends;
    const operation = deliver(session);
    await began;
    assert.equal((await row(session)).delivery_status, "sent");
    assert.equal((await deliver(session)).status, 200);
    assert.equal((await operation).status, 200);
    assert.equal(sends, customerBefore + 1);
    assert.equal((await row(session)).delivery_status, "sent");
  }
  delete env.CONTACT_TO_EMAIL; internalStarted = undefined;
  passed.push("internal disabled/success/rejection/exception/hang cannot delay sent persistence or duplicate customer delivery");

  const healthCases = [
    ["pending_overdue", "paid", "pending", 0],
    ["retry_overdue", "paid", "failed", 1],
    ["expired_lease", "paid", "sending", 1],
    ["attempts_exhausted", "paid", "failed", 5],
    ["payment_confirmation_check", "checkout_created", "pending", 0],
  ];
  for (const [reason, payment, state, attempts] of healthCases) {
    await db.query(`INSERT INTO premium_purchases (assessment_id,email,stripe_checkout_session_id,amount,currency,payment_status,
      delivery_status,delivery_attempts,created_at,updated_at,delivery_next_attempt_at,delivery_lease_until)
      VALUES ($1,'synthetic@cashbrite.example',$2,1900,'gbp',$3,$4,$5,NOW()-INTERVAL '2 hours',NOW(),NOW()-INTERVAL '10 minutes',NOW()-INTERVAL '10 minutes')`,
      [assessmentId, `cs_test_Health${reason}`, payment, state, attempts]);
  }
  const healthBefore = JSON.stringify((await db.query("SELECT * FROM premium_purchases ORDER BY id")).rows);
  const health = await load("lib/deliveryHealth.ts").checkDeliveryHealth();
  assert(health.total > 0); assert(health.exceptions.some((entry) => entry.reason === "needs_review"));
  for (const [reason] of healthCases) assert(health.exceptions.some((entry) => entry.reason === reason), reason);
  assert(!JSON.stringify(health).includes("cs_test_")); assert(!JSON.stringify(health).includes("@"));
  assert.equal(JSON.stringify((await db.query("SELECT * FROM premium_purchases ORDER BY id")).rows), healthBefore);
  // FK prevents a missing reference in the live schema; simulate an inconsistent imported database locally.
  await db.exec("BEGIN; ALTER TABLE premium_purchases DROP CONSTRAINT premium_purchases_assessment_id_fkey;");
  await db.query("UPDATE premium_purchases SET assessment_id='00000000-0000-4000-8000-000000000099' WHERE id=$1", [racePurchase.id]);
  assert((await load("lib/deliveryHealth.ts").checkDeliveryHealth()).exceptions.some((entry) => entry.reason === "missing_assessment_reference"));
  await db.exec("ROLLBACK");
  passed.push("read-only health scan detects pending/retry/lease/review/exhaustion/reference exceptions without PII or mutations");
  const blockedCli = spawnSync(process.execPath, ["scripts/premium-recovery.mjs", "retry", "--purchase-id", "1", "--execute"],
    { env: { PATH: process.env.PATH }, encoding: "utf8" });
  assert.equal(blockedCli.status, 1); assert.equal(blockedCli.stdout, "");
  assert(blockedCli.stderr.includes("recovery_failed_or_not_eligible"));

  assert.equal((await deliver(success, "checkout.session.completed", false)).status, 400);
  for (const change of [{ amount_total: 1 }, { currency: "usd" }, { mode: "subscription" }, { metadata: { product } },
    { line_items: { has_more: false, data: [{ quantity: 1, price: { id: "wrong_price", unit_amount: 1900, currency: "gbp" } }] } }]) {
    const bad = makeSession(`Invalid${sessions.size}`, change); assert.equal((await deliver(bad)).status, 500); assert.equal(await row(bad), null);
  }
  const missing = makeSession("Missing"); fixtures.delete(assessmentId); assert.equal((await deliver(missing)).status, 500); fixtures.set(assessmentId, { ...demo, id: assessmentId });
  await deliver({ id: "pi_Success", metadata: { product, assessment_id: assessmentId } }, "payment_intent.payment_failed");
  assert.equal((await row(success)).payment_status, "paid");
  for (const suffix of ["PendingA", "PendingB"]) await storage.saveCheckoutPurchase({ assessmentId, email: demo.registration.email,
    checkoutSessionId: `cs_test_${suffix}`, paymentIntentId: `pi_${suffix}`, amount: 1900, currency: "gbp" });
  await deliver({ id: "pi_PendingA", metadata: { product, assessment_id: assessmentId } }, "payment_intent.payment_failed");
  assert.equal((await storage.findSessionPurchase("cs_test_PendingA")).payment_status, "failed");
  assert.equal((await storage.findSessionPurchase("cs_test_PendingB")).payment_status, "checkout_created");
  const delayed = makeSession("Delayed", { payment_status: "unpaid" });
  assert.equal((await deliver(delayed)).status, 200); assert.equal(await row(delayed), null);
  delayed.payment_status = "paid"; await deliver(delayed, "checkout.session.async_payment_succeeded");
  assert.equal((await row(delayed)).delivery_status, "sent");
  passed.push("invalid signature, amount/currency/mode/reference, missing assessment and late payment failure");

  for (const query of ["", "?session_id=invalid", "?demo=true", `?session_id=${makeSession("Unpaid", { payment_status: "unpaid" }).id}`]) {
    assert.equal((await download(new Request(`https://cashbrite.example/api/money-ready-plan/pdf${query}`))).status, 403);
  }
  requireSendingClaim = false;
  for (const accessible of [success, sessions.get("cs_test_Ambiguousthrow")]) {
    for (let i = 0; i < 2; i++) {
      const html = renderToStaticMarkup(await SuccessPage({ searchParams: Promise.resolve({ session_id: accessible.id }) }));
      assert(html.includes("is unlocked")); assert(html.includes("No further payment is needed"));
      const response = await download(new Request(`https://cashbrite.example/api/money-ready-plan/pdf?session_id=${accessible.id}`));
      assert.equal(response.status, 200); assert.equal(response.headers.get("Referrer-Policy"), "no-referrer");
    }
  }
  for (const url of ["https://cashbrite.example/money-ready-plan/success?session_id=secret", "https://cashbrite.example/results?id=secret", "https://cashbrite.example/premium-plan-preview?key=secret"]) assert.equal(sanitiseAnalyticsUrl(url), null);
  assert.equal(sanitiseAnalyticsUrl("https://cashbrite.example/resources?token=secret#secret"), "https://cashbrite.example/resources");
  assert.equal(sanitiseAnalyticsUrl("malformed"), null);
  await assert.rejects(() => runRecovery(["retry", "--purchase-id", "1", "--operator", "fake-admin"], "synthetic-os-user"));
  const gaSource = fs.readFileSync("components/GoogleAnalytics.tsx", "utf8");
  assert(!gaSource.includes("window.location.search")); assert(!gaSource.includes("window.location.hash"));
  assert(!JSON.stringify(logs).includes("cs_test_")); assert(!JSON.stringify(logs).includes(demo.registration.email));
  passed.push("secure repeated access, production demo rejection, private response headers and analytics URL sanitisation");

  // A fresh synthetic assessment tests initial concurrent checkout, separate from paid delivery cases.
  const freshId = "00000000-0000-4000-8000-000000000002";
  await db.query("INSERT INTO assessment_results VALUES ($1)", [freshId]); fixtures.set(freshId, { ...demo, id: freshId });
  const request = () => new Request("https://cashbrite.example/api/stripe/checkout", { method: "POST", body: JSON.stringify({ assessmentId: freshId }), headers: { "Content-Type": "application/json" } });
  const results = await Promise.all([checkout(request()), checkout(request())]);
  assert(results.every((r) => r.status === 200)); assert.equal(creates, 1);
  await checkout(request()); assert.equal(creates, 1);
  assert.equal((await checkout(new Request("https://cashbrite.example/api/stripe/checkout", { method: "POST", body: JSON.stringify({ assessmentId }) }))).status, 409);
  const thirdId = "00000000-0000-4000-8000-000000000003";
  await db.query("INSERT INTO assessment_results VALUES ($1)", [thirdId]); fixtures.set(thirdId, { ...demo, id: thirdId });
  const thirdRequest = () => new Request("https://cashbrite.example/api/stripe/checkout", { method: "POST", body: JSON.stringify({ assessmentId: thirdId }) });
  failCheckoutSave = true; const unsafeRedirect = await checkout(thirdRequest());
  assert.equal(unsafeRedirect.status, 503); assert(!JSON.stringify(await unsafeRedirect.json()).includes("checkout.stripe.com"));
  const createdBeforeRetry = creates; failCheckoutSave = false;
  assert.equal((await checkout(thirdRequest())).status, 200); assert.equal(creates, createdBeforeRetry);
  passed.push("concurrent checkout provider idempotency, open-session reuse, already-paid no-second-charge guard");
  console.log(JSON.stringify({ passed, database: "disposable in-memory PGlite; actual migration and SQL executed; not multi-process Neon load testing", safety: "No real payments, emails, credentials, records or PDF generation" }, null, 2));
} finally { await db.close(); }
