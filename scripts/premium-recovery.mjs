import os from "node:os";
import { serverLoader } from "./server-runtime.mjs";

const args = process.argv.slice(2);
if (!args.length || args.includes("--help")) {
  console.log("Trusted operator only. No environment files are loaded automatically.\nCommands: inspect|retry|reconcile --purchase-id ID [--execute]\nReconcile: --outcome accepted|not_sent --reason provider_accepted|provider_confirmed_not_sent --evidence TICKET [--provider-id UUID]\nDry run is the default. Credentials/OS access are the authorisation boundary, not an operator-name argument.");
} else {
  try {
    if (!["development", "staging", "production"].includes(process.env.CASHBRITE_OPERATOR_ENV ?? "")) throw new Error("environment_not_selected");
    const load = serverLoader();
    const { runRecovery } = load("lib/operatorRecovery.ts");
    const actor = `${os.userInfo().username}@${os.hostname()}`;
    console.log(JSON.stringify(await runRecovery(args, actor)));
  } catch {
    // Never print thrown messages, argv, database errors, secrets or bearer identifiers.
    console.error(JSON.stringify({ code: "recovery_failed_or_not_eligible", executeRequested: args.includes("--execute") }));
    process.exitCode = 1;
  }
}
