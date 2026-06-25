import type { Metadata } from "next";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import { Logo } from "@/components/Logo";
import { defaultDescription, JsonLd, siteName, siteUrl } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Cashbrite | Money Confidence for Life After School",
    template: "%s | Cashbrite",
  },
  description: defaultDescription,
  applicationName: siteName,
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Cashbrite | Money Confidence for Life After School",
    description: defaultDescription,
    url: siteUrl,
    siteName,
    images: [
      {
        url: "/brand/cashbrite-logo.png",
        width: 1200,
        height: 630,
        alt: "Cashbrite",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cashbrite | Money Confidence for Life After School",
    description: defaultDescription,
    images: ["/brand/cashbrite-logo.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

const organisationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Cashbrite",
  url: siteUrl,
  logo: `${siteUrl}/brand/cashbrite-logo.png`,
  email: "cmaroke@me.com",
  areaServed: "GB",
  description: defaultDescription,
  sameAs: [],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Cashbrite",
  url: siteUrl,
  inLanguage: "en-GB",
  description: defaultDescription,
  publisher: {
    "@type": "Organization",
    name: "Cashbrite",
  },
};

const navItems = [
  { href: "/", label: "Home" },
  { href: "/students", label: "Students" },
  { href: "/schools", label: "Schools" },
  { href: "/resources", label: "Resources" },
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
        <JsonLd data={organisationSchema} />
        <JsonLd data={websiteSchema} />
        <header className="sticky top-0 z-30 border-b border-navy/10 bg-cream/92 shadow-[0_8px_30px_rgba(7,29,43,0.04)] backdrop-blur">
          <nav
            className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 md:py-4 lg:px-8"
            aria-label="Main navigation"
          >
            <div className="flex w-full items-center justify-between gap-4">
              <Logo compact />
              <div className="hidden items-center gap-5 md:flex lg:gap-6">
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
                className="focus-ring shrink-0 rounded-full bg-navy px-4 py-2 text-sm font-bold text-white transition hover:bg-ink"
              >
                Start quiz
              </Link>
            </div>
            <div className="flex w-full items-center gap-5 overflow-x-auto border-t border-navy/10 pt-3 text-sm font-semibold text-navy/72 md:hidden">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="focus-ring shrink-0 rounded-sm hover:text-navy">
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="border-t border-navy/10 bg-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-10 text-sm text-navy/70 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <div className="grid gap-3">
              <Logo compact />
              <p>Built for UK students preparing for life after school.</p>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-3 font-semibold">
              <Link href="/schools" className="focus-ring rounded-sm hover:text-navy">
                For schools
              </Link>
              <Link href="/contact" className="focus-ring rounded-sm hover:text-navy">
                Contact
              </Link>
              <Link href="/resources" className="focus-ring rounded-sm hover:text-navy">
                Resources
              </Link>
              <Link href="/privacy-policy" className="focus-ring rounded-sm hover:text-navy">
                Privacy Policy
              </Link>
              <Link href="/terms-and-conditions" className="focus-ring rounded-sm hover:text-navy">
                Terms
              </Link>
              <Link href="/financial-disclaimer" className="focus-ring rounded-sm hover:text-navy">
                Financial Disclaimer
              </Link>
            </div>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
