import Link from "next/link";
import type { ReactNode } from "react";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "light";
};

export function ButtonLink({ href, children, variant = "primary" }: ButtonLinkProps) {
  const styles = {
    primary: "bg-navy text-white shadow-[0_14px_30px_rgba(7,29,43,0.22)] hover:-translate-y-0.5 hover:bg-ink",
    secondary: "bg-mint text-navy shadow-[0_12px_24px_rgba(35,133,111,0.18)] hover:-translate-y-0.5 hover:bg-[#a7dfcd]",
    light:
      "border border-navy/10 bg-white text-navy shadow-[0_12px_24px_rgba(7,29,43,0.08)] hover:-translate-y-0.5 hover:bg-cream",
  };

  return (
    <Link
      href={href}
      className={`focus-ring inline-flex items-center justify-center rounded-full px-6 py-3.5 text-base font-black transition duration-200 ${styles[variant]}`}
    >
      {children}
    </Link>
  );
}
