import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AssessmentPrototype } from "@/components/assessment-prototype/AssessmentPrototype";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Assessment A | Development Preview",
  robots: { index: false, follow: false },
};

export default function AssessmentAPreview() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <AssessmentPrototype key="a" mode="a" />;
}
