import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import vm from "node:vm";
import { execFileSync } from "node:child_process";
import ts from "typescript";

// Offline packaging only: no credentials, provider calls or production writes.
const root = "output/release-candidate/cashbrite-2-2026-11-12";
const digest = value => crypto.createHash("sha256").update(value).digest("hex");
const archive = path.join(root, "source.tar.gz");
assert.equal(digest(fs.readFileSync(archive)), "26285a764d79d452248b47eebac072d2ce26bd2501f74b7f20e29971b9b895d4");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "manifest.json"), "utf8"));
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "cashbrite-cutover-"));
try {
  execFileSync("tar", ["-xzf", path.resolve(archive), "-C", temporary]);
  for (const file of manifest.files) {
    assert.equal(digest(fs.readFileSync(path.join(temporary, file.path))), file.sha256, file.path);
    if (/^(app|components|lib|data|public)\//.test(file.path)) {
      assert.equal(digest(fs.readFileSync(file.path)), file.sha256, `application drift: ${file.path}`);
    }
  }
  const changes = [];
  for (const [name, target] of [
    ["checkout", "app/api/stripe/checkout/route.ts"],
    ["webhook", "app/api/stripe/webhook/route.ts"],
  ]) {
    const source = fs.readFileSync(path.join(root, "maintenance", `${name}-route.ts.txt`), "utf8");
    const result = ts.transpileModule(source, {
      reportDiagnostics: true,
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    });
    assert.equal(result.diagnostics?.filter(d => d.category === ts.DiagnosticCategory.Error).length, 0);
    const loaded = { exports: {} };
    vm.runInNewContext(result.outputText, {
      exports: loaded.exports, module: loaded, Response,
      require: () => { throw new Error("Maintenance ingress must not import business/provider code"); },
    });
    for (let attempt = 0; attempt < 30; attempt++) {
      const response = await loaded.exports.POST();
      assert.equal(response.status, 503);
      assert.equal(response.headers.get("retry-after"), "60");
      assert.match(response.headers.get("cache-control"), /no-store/);
      assert.equal(response.headers.get("referrer-policy"), "no-referrer");
    }
    fs.writeFileSync(path.join(temporary, target), source);
    changes.push({ path: target, sha256: digest(source) });
  }
  for (const file of manifest.files.filter(f => /^lib\//.test(f.path) || /money-ready-plan/.test(f.path))) {
    assert.equal(digest(fs.readFileSync(path.join(temporary, file.path))), file.sha256, `rollback safety drift: ${file.path}`);
  }
  assert.match(fs.readFileSync(path.join(temporary, "lib/purchaseDelivery.ts"), "utf8"), /claimDelivery/);
  assert.match(fs.readFileSync(path.join(temporary, "lib/premiumPurchaseDb.ts"), "utf8"), /delivery_claim_token/);
  assert.match(fs.readFileSync(path.join(temporary, "app/money-ready-plan/success/page.tsx"), "utf8"), /verifyPaidPurchase/);
  const output = path.join(root, "rollback-paused-source.tar.gz");
  execFileSync("tar", ["-czf", path.resolve(output), "-C", temporary, "."]);
  fs.writeFileSync(path.join(root, "rollback-paused-manifest.json"), JSON.stringify({
    sourceArchiveSha256: digest(fs.readFileSync(archive)),
    rollbackArchiveSha256: digest(fs.readFileSync(output)),
    sourceBaseCommit: manifest.baseCommit,
    containsUncommittedApprovedSource: true,
    changedFiles: changes,
    mode: "payments-paused containment; paid access and claim-aware recovery code retained",
    limitations: "Not a previously deployed full-service rollback. Deploy only after production approval; retain migrated database and delivery state.",
  }, null, 2) + "\n");
  console.log("PASS: frozen source integrity; approved application unchanged; 60 retryable maintenance responses; claim-aware code/access preserved; rollback archive prepared.");
} finally {
  fs.rmSync(temporary, { recursive: true, force: true });
}
