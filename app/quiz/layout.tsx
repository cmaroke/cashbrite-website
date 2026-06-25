import type { Metadata } from "next";
import { createSeoMetadata, JsonLd, siteUrl } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "5-Minute Money Readiness Assessment",
  description:
    "Take Cashbrite's free 30-question Money Readiness Assessment for UK students and young people to understand your money confidence.",
  path: "/quiz",
});

export default function QuizLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "LearningResource",
          name: "Cashbrite Money Readiness Assessment",
          url: `${siteUrl}/quiz`,
          description:
            "A free 5-minute financial education assessment covering budgeting, saving, student finance, credit, fraud awareness, payslips and moving out.",
          learningResourceType: "Assessment",
          teaches: [
            "budgeting for teenagers",
            "student money skills",
            "credit awareness",
            "fraud and scam awareness",
            "life after school money skills",
          ],
          inLanguage: "en-GB",
        }}
      />
      {children}
    </>
  );
}
