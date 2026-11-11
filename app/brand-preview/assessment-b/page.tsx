import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AssessmentPrototype } from "@/components/assessment-prototype/AssessmentPrototype";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Assessment B | Development Preview",
  robots: { index: false, follow: false },
};

export default function AssessmentBPreview() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <AssessmentPrototype key="b" mode="b" />;
}
