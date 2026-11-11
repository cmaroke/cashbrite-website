"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileNavigation({ items }: { items: { href: string; label: string }[] }) {
  const pathname = usePathname();
  return (
    <details className="mobile-menu lg:hidden" onKeyDown={(event) => {
      if (event.key === "Escape") {
        event.currentTarget.removeAttribute("open");
        event.currentTarget.querySelector("summary")?.focus();
      }
    }}>
      <summary className="focus-ring flex min-h-11 cursor-pointer items-center gap-2 rounded-md border border-ink/25 px-3 text-sm font-medium">
        Menu <span aria-hidden="true">+</span>
      </summary>
      <div className="absolute inset-x-0 top-full border-b border-ink/20 bg-cream px-5 py-4 shadow-sm">
        {items.map((item) => <Link key={item.href} href={item.href}
          aria-current={pathname === item.href ? "page" : undefined}
          className="focus-ring flex min-h-12 items-center justify-between border-b border-ink/10 px-2 text-base last:border-0 aria-[current=page]:bg-lime/35"
          onClick={(event) => event.currentTarget.closest("details")?.removeAttribute("open")}>
          {item.label}<span aria-hidden="true">→</span>
        </Link>)}
      </div>
    </details>
  );
}
