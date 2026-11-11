import { NextResponse } from "next/server";
import { generateMoneyReadyPlanPdf } from "@/lib/moneyReadyPlanPdf";
import { demoPremiumAssessment } from "@/lib/premiumPlanDemo";
import { verifyPaidPurchase } from "@/lib/verifiedPurchase";
import { privateHeaders, purchaseLog, PurchaseError } from "@/lib/purchaseSafety";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";


export async function GET(request: Request) {
  const url = new URL(request.url);
  const isDevelopmentDemo = process.env.NODE_ENV !== "production" && url.searchParams.get("demo") === "true";

  try {
    const assessment = isDevelopmentDemo
      ? demoPremiumAssessment
      : (await verifyPaidPurchase(url.searchParams.get("session_id") ?? "")).assessment;

    if (!assessment) {
      return NextResponse.json({ error: "A confirmed purchase is required to download this plan." }, { status: 403 });
    }

    const pdf = await generateMoneyReadyPlanPdf(assessment);
    const firstName = assessment.registration.firstName.replace(/[^a-z0-9-]/gi, "-");

    return new Response(pdf, {
      headers: {
        ...privateHeaders,
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Cashbrite-Money-Ready-Plan-${firstName}.pdf"`,
        "Content-Length": String(pdf.length),
        "Cache-Control": "private, no-store, max-age=0",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    const denied = error instanceof PurchaseError;
    purchaseLog(denied ? "pdf_access_denied" : "pdf_unavailable");
    return NextResponse.json({ error: denied ? "A confirmed purchase is required. Use your original access link." : "Your PDF is temporarily unavailable. Try again or contact Cashbrite; do not pay again." }, { status: denied ? 403 : 503, headers: privateHeaders });
  }
}
