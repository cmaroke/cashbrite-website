import Link from "next/link";
import type { ReactNode } from "react";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "light";
};

export function ButtonLink({ href, children, variant = "primary" }: ButtonLinkProps) {
  const styles = {
    primary: "bg-lime text-ink hover:bg-lime/85",
    secondary: "border border-ink/25 bg-transparent text-ink hover:bg-mist",
    light:
      "border border-ink/15 bg-white text-ink hover:bg-cream",
  };

  return (
    <Link
      href={href}
      className={`focus-ring inline-flex min-h-11 items-center justify-center rounded-md px-6 py-3 text-base font-medium transition duration-200 ${styles[variant]}`}
    >
      {children}
    </Link>
  );
}
