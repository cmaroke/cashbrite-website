import { NextResponse } from "next/server";
import { getAssessment } from "@/lib/assessmentDb";
import { generateMoneyReadyPlanPdf } from "@/lib/moneyReadyPlanPdf";
import { demoPremiumAssessment } from "@/lib/premiumPlanDemo";
import { getStripe, moneyReadyPlanProduct } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const sessionPattern = /^cs_(test|live)_[A-Za-z0-9]+$/;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const isDevelopmentDemo = process.env.NODE_ENV !== "production" && url.searchParams.get("demo") === "true";

  try {
    const assessment = isDevelopmentDemo
      ? demoPremiumAssessment
      : await getPaidAssessment(url.searchParams.get("session_id"));

    if (!assessment) {
      return NextResponse.json({ error: "A confirmed purchase is required to download this plan." }, { status: 403 });
    }

    const pdf = await generateMoneyReadyPlanPdf(assessment);
    const firstName = assessment.registration.firstName.replace(/[^a-z0-9-]/gi, "-");

    return new Response(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Cashbrite-Money-Ready-Plan-${firstName}.pdf"`,
        "Content-Length": String(pdf.length),
        "Cache-Control": "private, no-store, max-age=0",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Money Ready Plan PDF generation failed", {
      error: error instanceof Error ? error.message : "Unknown PDF error",
    });
    return NextResponse.json({ error: "Your PDF could not be generated. Please try again." }, { status: 500 });
  }
}

async function getPaidAssessment(sessionId: string | null) {
  if (!sessionId || !sessionPattern.test(sessionId)) return null;

  const session = await getStripe().checkout.sessions.retrieve(sessionId);
  const assessmentId = session.metadata?.assessment_id;
  if (
    session.status !== "complete" ||
    session.payment_status !== "paid" ||
    session.metadata?.product !== moneyReadyPlanProduct ||
    !assessmentId
  ) {
    return null;
  }

  return getAssessment(assessmentId);
}
