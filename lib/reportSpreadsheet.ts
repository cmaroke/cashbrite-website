import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { privateHeaders } from "@/lib/purchaseSafety";
export async function reportSpreadsheet() {
  const data = await readFile(join(process.cwd(), "assets/downloads/cashbrite-budget-tracker.xlsx"));
  return new Response(data, { headers: { ...privateHeaders, "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Content-Disposition": 'attachment; filename="Cashbrite-Budget-Tracker.xlsx"', "Content-Length": String(data.length) } });
}
