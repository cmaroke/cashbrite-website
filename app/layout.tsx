import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cashbrite | Money confidence for life after school",
  description:
    "Cashbrite helps UK students understand budgeting, credit, student finance, scams and real-world money decisions.",
};

const navItems = [
  { href: "/", label: "Home" },
  { href: "/students", label: "Students" },
  { href: "/schools", label: "Schools" },
  { href: "/quiz", label: "Quiz" },
  { href: "/contact", label: "Contact" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <body className="min-h-screen font-sans antialiased">
        <header className="sticky top-0 z-30 border-b border-navy/10 bg-cream/92 shadow-[0_8px_30px_rgba(7,29,43,0.04)] backdrop-blur">
          <nav
            className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8"
            aria-label="Main navigation"
          >
            <Logo compact />
            <div className="hidden items-center gap-6 md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="focus-ring rounded-sm text-sm font-semibold text-navy/75 transition hover:text-navy"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <Link
              href="/quiz"
              className="focus-ring rounded-full bg-navy px-4 py-2 text-sm font-bold text-white transition hover:bg-ink"
            >
              Start quiz
            </Link>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="border-t border-navy/10 bg-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-10 text-sm text-navy/70 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <div className="grid gap-3">
              <Logo compact />
              <p>Built for UK students preparing for life after school.</p>
            </div>
            <div className="flex gap-5 font-semibold">
              <Link href="/schools" className="focus-ring rounded-sm hover:text-navy">
                For schools
              </Link>
              <Link href="/contact" className="focus-ring rounded-sm hover:text-navy">
                Contact
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
