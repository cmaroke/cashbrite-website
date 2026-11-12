import { NextResponse } from "next/server";
import { getRegisteredReport, reportCookieName, reportCookieOptions } from "@/lib/reportAccess";
import { privateHeaders } from "@/lib/purchaseSafety";
import { assessmentLog } from "@/lib/assessmentSubmission";
export async function POST(request: Request) {
  try {
    const origin = request.headers.get("origin");
    if (origin && new URL(origin).host !== (request.headers.get("host") ?? new URL(request.url).host)) return NextResponse.json({ error: "Please use your Cashbrite report link." }, { status: 403, headers: privateHeaders });
    const text = await request.text();
    if (text.length > 256) return NextResponse.json({ error: "This link is not valid." }, { status: 400, headers: privateHeaders });
    const { token } = JSON.parse(text);
    if (typeof token !== "string" || !await getRegisteredReport(token)) return NextResponse.json({ error: "This report link is unavailable. Please use the link in your report email." }, { status: 403, headers: privateHeaders });
    const response = NextResponse.json({ reportUrl: "/report" }, { headers: privateHeaders });
    response.cookies.set(reportCookieName, token, reportCookieOptions);
    return response;
  } catch {
    assessmentLog("report_link_unavailable");
    return NextResponse.json({ error: "Your report link is temporarily unavailable. Please try again shortly." }, { status: 503, headers: privateHeaders });
  }
}
