import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getRegisteredReport, reportCookieName } from "@/lib/reportAccess";
import { generateMoneyReadyPlanPdf } from "@/lib/moneyReadyPlanPdf";
import { privateHeaders } from "@/lib/purchaseSafety";
import { assessmentLog } from "@/lib/assessmentSubmission";
export async function GET() {
  try {
    const assessment = await getRegisteredReport((await cookies()).get(reportCookieName)?.value ?? "");
    if (!assessment) return NextResponse.json({ error: "Please use your private report link." }, { status: 403, headers: privateHeaders });
    const pdf = await generateMoneyReadyPlanPdf(assessment);
    const name = assessment.registration.firstName.replace(/[^a-z0-9-]/gi, "-");
    return new Response(pdf, { headers: { ...privateHeaders, "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="Cashbrite-Money-Ready-Plan-${name}.pdf"`, "Content-Length": String(pdf.length) } });
  } catch {
    assessmentLog("registered_pdf_unavailable");
    return NextResponse.json({ error: "Your PDF is temporarily unavailable. Your online report is still available; please try again shortly." }, { status: 503, headers: privateHeaders });
  }
}
