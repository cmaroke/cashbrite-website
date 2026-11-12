import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getRegisteredReport, reportCookieName } from "@/lib/reportAccess";
import { reportSpreadsheet } from "@/lib/reportSpreadsheet";
import { privateHeaders } from "@/lib/purchaseSafety";
export async function GET() {
  try {
    if (!await getRegisteredReport((await cookies()).get(reportCookieName)?.value ?? "")) return NextResponse.json({ error: "Please use your private report link." }, { status: 403, headers: privateHeaders });
    return await reportSpreadsheet();
  } catch { return NextResponse.json({ error: "The budget tracker is temporarily unavailable. Please try again shortly." }, { status: 503, headers: privateHeaders }); }
}
