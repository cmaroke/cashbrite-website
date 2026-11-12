// Local packaging only: never deploys, reads credentials or connects to providers.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { serverLoader } from "./server-runtime.mjs";

const root = process.cwd();
const output = path.resolve("output/release-candidate/free-model-2026-11-12-final");
assert(!fs.existsSync(output), "Refusing to overwrite an existing frozen release");
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "cashbrite-free-release-package-"));
fs.chmodSync(temp, 0o700);
const candidate = path.join(temp, "candidate"), rollback = path.join(temp, "rollback");
const excluded = fs.readFileSync(".vercelignore", "utf8").split(/\r?\n/).filter(x => x && !x.startsWith("#"));
const files = [];
function walk(relative = "") {
  for (const entry of fs.readdirSync(path.join(root, relative), {withFileTypes:true})) {
    const file = relative ? relative + "/" + entry.name : entry.name;
    if (entry.name.startsWith(".env") || file === ".vercel" || file.startsWith(".vercel/") || excluded.some(p => p !== ".env*" && (file === p || file.startsWith(p + "/")))) continue;
    if (entry.isDirectory()) walk(file);
    else if (entry.isFile()) files.push(file);
    else throw Error("Unexpected symlink or special source file: " + file);
  }
}
walk();
for (const file of files) { fs.mkdirSync(path.dirname(path.join(candidate,file)),{recursive:true}); fs.copyFileSync(path.join(root,file),path.join(candidate,file)); }
fs.cpSync(candidate, rollback, {recursive:true});
const pause = `import { NextResponse } from "next/server";
import { privateHeaders } from "@/lib/purchaseSafety";
export const runtime = "nodejs";
export async function POST() {
  return NextResponse.json({ error: "New report registration is temporarily paused. Your answers will be kept; please try again shortly." }, { status: 503, headers: { ...privateHeaders, "Retry-After": "300" } });
}
`;
fs.writeFileSync(path.join(rollback,"app/api/assessments/route.ts"), pause);
const hash = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const manifest = directory => files.sort().map(file => ({file,sha256:hash(fs.readFileSync(path.join(directory,file)))}));
const normal = manifest(candidate), contained = manifest(rollback);
const differences = normal.filter((x,i) => x.sha256 !== contained[i].sha256).map(x => x.file);
assert.deepEqual(differences,["app/api/assessments/route.ts"]);
assert(normal.some(x=>x.file==="app/report/page.tsx"));
assert(normal.some(x=>x.file==="assets/downloads/cashbrite-budget-tracker.xlsx"));
const load = serverLoader();
const held = await load(path.join(rollback,"app/api/assessments/route.ts")).POST();
assert.equal(held.status,503);
assert.equal(held.headers.get("Retry-After"),"300");
assert.equal((await load(path.join(rollback,"app/api/stripe/checkout/route.ts")).POST()).status,410);
// Verify every archived byte after tar extraction, not just the source directory.
fs.mkdirSync(output,{recursive:true});
for (const [name,directory,entries] of [["candidate",candidate,normal],["rollback",rollback,contained]]) {
  const archive=path.join(output,name+".tar.gz");
  execFileSync("tar",["-czf",archive,"-C",directory,"."]);
  const verify=path.join(temp,"verify-"+name);fs.mkdirSync(verify);
  execFileSync("tar",["-xzf",archive,"-C",verify]);
  for(const entry of entries) assert.equal(hash(fs.readFileSync(path.join(verify,entry.file))),entry.sha256);
  fs.writeFileSync(path.join(output,name+"-manifest.json"),JSON.stringify({archiveSha256:hash(fs.readFileSync(archive)),files:entries},null,2));
}
fs.writeFileSync(path.join(output,"verification.json"),JSON.stringify({createdAt:new Date().toISOString(),candidateDirectory:candidate,rollbackDirectory:rollback,archiveBytesVerified:true,onlyRollbackDifference:differences,registrationPaused503:true,checkoutDisabled410:true,reportAndLegacyAccessUnchanged:true,migration004Hash:hash(fs.readFileSync("db/migrations/004_free_report_access.sql"))},null,2));
console.log(JSON.stringify({output,rollbackDirectory:rollback,files:files.length,archiveBytesVerified:true,onlyRollbackDifference:differences,registrationStatus:503,checkoutStatus:410}));
