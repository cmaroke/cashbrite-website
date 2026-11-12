import assert from "node:assert/strict";
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { PGlite } = require(process.env.PGLITE_MODULE_PATH ?? "/tmp/cashbrite-pg-test/node_modules/@electric-sql/pglite");
const db = new PGlite();
try {
  const schema = execFileSync("tar", ["-xOf", "output/release-candidate/cashbrite-2-2026-11-12/source.tar.gz", "./db/schema.sql"], { encoding: "utf8" });
  await db.exec(schema);
  await db.exec(`INSERT INTO assessment_results(id,first_name,last_name,age,email,report_consent,marketing_consent,readiness_score,result_band,category_scores,strengths,risk_areas,priority_areas,action_plan,action_plan_summary)
    VALUES('00000000-0000-4000-8000-000000000004','Historical','Synthetic',18,'historical@cashbrite.example',true,false,57,'Developing Money Skills','{}','[]','[]','[]','{}','Synthetic legacy fixture');
    INSERT INTO premium_purchases(assessment_id,email,stripe_checkout_session_id,amount,currency,payment_status,delivery_status,delivery_attempts,delivery_audit)
    VALUES('00000000-0000-4000-8000-000000000004','historical@cashbrite.example','cs_test_synthetic_history',1900,'gbp','paid','sent',1,'[{"synthetic":true}]');`);
  const before = (await db.query("SELECT * FROM premium_purchases")).rows;
  const assessmentBefore = (await db.query("SELECT * FROM assessment_results")).rows[0];
  await db.exec(fs.readFileSync("db/migrations/004_free_report_access.sql", "utf8"));
  await db.exec(fs.readFileSync("db/migrations/004_free_report_access_verify.sql", "utf8"));
  assert.deepEqual((await db.query("SELECT * FROM premium_purchases")).rows, before);
  const after = (await db.query("SELECT * FROM assessment_results")).rows[0];
  for (const [key,value] of Object.entries(assessmentBefore)) assert.deepEqual(after[key], value);
  for (const key of ["report_access_hash","report_request_hash","report_email_status"]) assert.equal(after[key], null);
  assert.equal((await db.query("SELECT count(*)::int AS n FROM pg_indexes WHERE indexname='assessment_report_access_idx'")).rows[0].n,1);
  const fk = (await db.query("SELECT count(*)::int AS n FROM pg_constraint WHERE conrelid='premium_purchases'::regclass AND contype='f'")).rows[0].n;
  assert(fk > 0);
  console.log(JSON.stringify({passed:true,baseline:"frozen deployed source schema",historicalPaidPurchaseUnchanged:true,historicalAssessmentUnchanged:true,noLegacyFreeGrant:true,foreignKeysPreserved:true,productionAccess:false}));
} finally { await db.close(); }
