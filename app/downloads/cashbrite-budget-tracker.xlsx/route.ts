import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getRegisteredReport, reportCookieName } from "@/lib/reportAccess";
import { verifyPaidPurchase } from "@/lib/verifiedPurchase";
import { reportSpreadsheet } from "@/lib/reportSpreadsheet";
import { privateHeaders } from "@/lib/purchaseSafety";
// Historical report links remain valid, but the asset is no longer publicly served.
export async function GET(request: Request) {
  try {
    const registered = await getRegisteredReport((await cookies()).get(reportCookieName)?.value ?? "");
    if (!registered) await verifyPaidPurchase(new URL(request.url).searchParams.get("session_id") ?? "");
    return await reportSpreadsheet();
  } catch { return NextResponse.json({ error: "Please open your original report link to download the tracker." }, { status: 403, headers: privateHeaders }); }
}
