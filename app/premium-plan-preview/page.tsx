import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PremiumReport } from "@/components/PremiumReport";
import { demoPremiumAssessment } from "@/lib/premiumPlanDemo";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Cashbrite Personalised Money Action Plan Preview", robots: { index: false, follow: false } };
export default async function PremiumPlanPreviewPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  // This public route only renders synthetic data. Real reports require verified paid access.
  if (params.demo !== "true") notFound();
  return <PremiumReport assessment={demoPremiumAssessment} isDemo />;
}
