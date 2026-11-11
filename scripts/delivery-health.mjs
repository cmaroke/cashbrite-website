import { serverLoader } from "./server-runtime.mjs";

// No env-file loading, mutations, provider calls or automatic recovery.
try {
  if (!["development", "staging", "production"].includes(process.env.CASHBRITE_OPERATOR_ENV ?? "")) throw new Error("environment_not_selected");
  const report = await serverLoader()("lib/deliveryHealth.ts").checkDeliveryHealth();
  console.log(JSON.stringify(report));
  process.exitCode = report.total ? 2 : 0;
} catch {
  console.error(JSON.stringify({ code: "delivery_health_check_failed" }));
  process.exitCode = 1;
}
