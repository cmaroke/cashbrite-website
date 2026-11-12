import { NextResponse } from "next/server";
import { privateHeaders } from "@/lib/purchaseSafety";
export async function POST() {
  return NextResponse.json({ error: "Reports are now available without payment. Complete the assessment and choose Get My Full Report.", assessmentUrl: "/quiz" }, { status: 410, headers: privateHeaders });
}
