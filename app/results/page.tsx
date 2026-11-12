import type { Metadata } from "next";
import { ResultsExperience } from "@/components/ResultsExperience";
import { getAssessment } from "@/lib/assessmentDb";
import { createSeoMetadata } from "@/lib/seo";
export const dynamic = "force-dynamic";
export const metadata: Metadata = createSeoMetadata({ title: "Your Cashbrite Money Confidence Snapshot", description: "Your Cashbrite Score, strengths and priorities. Register for your complete personalised Money Action Plan without payment.", path: "/results", noIndex: true });
export default async function ResultsPage({ searchParams }: { searchParams: Promise<Record<string,string|string[]|undefined>> }) {
  const { id } = await searchParams;
  let scores;
  if (typeof id === "string" && /^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(id)) {
    try { scores = (await getAssessment(id))?.scores; } catch { /* The anonymous journey remains available without database access. */ }
  }
  // Never pass identity, report content or an access grant to the public Snapshot.
  return <ResultsExperience savedScores={scores} />;
}
