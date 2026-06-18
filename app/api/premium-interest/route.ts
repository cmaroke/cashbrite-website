import { NextResponse } from "next/server";
import { recordPremiumInterest } from "@/lib/assessmentDb";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const interestType = "unlock_click";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { assessmentId?: unknown; interestType?: unknown };

    if (
      typeof body.assessmentId !== "string" ||
      !uuidPattern.test(body.assessmentId) ||
      typeof body.interestType !== "string" ||
      body.interestType !== interestType
    ) {
      return NextResponse.json({ error: "Invalid premium interest request." }, { status: 400 });
    }

    const recorded = await recordPremiumInterest({
      assessmentId: body.assessmentId,
      interestType,
    });

    if (!recorded) {
      return NextResponse.json({ error: "Assessment not found." }, { status: 404 });
    }

    return NextResponse.json({ recorded: true });
  } catch {
    return NextResponse.json({ error: "Interest could not be recorded." }, { status: 500 });
  }
}
