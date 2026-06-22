import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "5-Minute Money Readiness Assessment | Cashbrite",
  description:
    "Answer 30 practical questions across 10 real-life money areas and discover your Cashbrite Money Readiness Score.",
};

export default function QuizLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
