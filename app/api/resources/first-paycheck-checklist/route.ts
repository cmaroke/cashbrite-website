import { generateFirstPaycheckChecklistPdf } from "@/lib/firstPaycheckChecklistPdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const pdf = await generateFirstPaycheckChecklistPdf();

    return new Response(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="cashbrite-first-paycheck-checklist.pdf"',
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    });
  } catch (error) {
    console.error("Unable to generate the First Paycheck Checklist PDF", error);
    return Response.json({ error: "The checklist could not be generated right now." }, { status: 500 });
  }
}
