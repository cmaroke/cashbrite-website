import type { ReactNode } from "react";

type InfoCardProps = {
  title: string;
  children: ReactNode;
  tone?: "default" | "mint" | "navy";
};

export function InfoCard({ title, children, tone = "default" }: InfoCardProps) {
  const styles = {
    default: "border-navy/10 bg-white text-navy shadow-[0_18px_50px_rgba(7,29,43,0.07)]",
    mint: "border-sea/15 bg-mint/35 text-navy shadow-[0_18px_50px_rgba(35,133,111,0.08)]",
    navy: "border-white/10 bg-navy text-white shadow-[0_22px_60px_rgba(7,29,43,0.18)]",
  };

  return (
    <article className={`rounded-lg border p-6 transition duration-200 hover:-translate-y-0.5 ${styles[tone]}`}>
      <h3 className={`text-xl font-black ${tone === "navy" ? "text-white" : "text-navy"}`}>{title}</h3>
      <div className={`mt-3 text-base leading-7 ${tone === "navy" ? "text-white/76" : "text-navy/72"}`}>
        {children}
      </div>
    </article>
  );
}
