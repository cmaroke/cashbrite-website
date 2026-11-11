import type { ReactNode } from "react";

type InfoCardProps = {
  title: string;
  children: ReactNode;
  tone?: "default" | "mint" | "navy";
};

export function InfoCard({ title, children, tone = "default" }: InfoCardProps) {
  const styles = {
    default: "border-ink/20 text-ink",
    mint: "border-sage/30 text-ink",
    navy: "border-ink/20 text-ink",
  };

  return (
    <article className={`border-t py-5 ${styles[tone]}`}>
      <h3 className="text-xl font-semibold text-ink">
        {title}
      </h3>
      <div className="mt-3 text-base leading-7 text-ink/80">
        {children}
      </div>
    </article>
  );
}
