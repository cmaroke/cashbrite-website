import type { Metadata } from "next";
import Link from "next/link";
import { DM_Serif_Display, Inter, Manrope } from "next/font/google";
import { SiteAnalytics } from "@/components/SiteAnalytics";
import { Logo } from "@/components/Logo";
import { MobileNavigation } from "@/components/MobileNavigation";
import { defaultDescription, JsonLd, siteName, siteUrl } from "@/lib/seo";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const editorial = DM_Serif_Display({ subsets: ["latin"], weight: "400", variable: "--font-editorial" });

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
        url: "/brand/v2/social.png",
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
    images: ["/brand/v2/social.png"],
  },
  verification: {
    google: "BYtvsmubG5ED1Fc85lBFkoWjt4wHqUQ62oNn7PBm6_M",
  },
  icons: {
    icon: [
      { url: "/brand/v2/favicon-light.svg", type: "image/svg+xml", media: "(prefers-color-scheme: light)" },
      { url: "/brand/v2/favicon-dark.svg", type: "image/svg+xml", media: "(prefers-color-scheme: dark)" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: ["/brand/v2/favicon-light.svg"],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

const organisationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Cashbrite",
  url: siteUrl,
  logo: `${siteUrl}/brand/v2/wordmark.svg`,
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
  { href: "/quiz", label: "Quiz" },
  { href: "/calculators", label: "Calculators" },
  { href: "/resources", label: "Resources" },
  { href: "/students", label: "Students" },
  { href: "/schools", label: "Schools" },
  { href: "/contact", label: "Contact" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <body className={`${inter.variable} ${manrope.variable} ${editorial.variable} min-h-screen font-sans antialiased`}>
        <JsonLd data={organisationSchema} />
        <JsonLd data={websiteSchema} />
        <header className="sticky top-0 z-30 border-b border-ink/10 bg-cream/95 backdrop-blur">
          <nav
            className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-3 font-display sm:px-8 md:py-4"
            aria-label="Main navigation"
          >
            <div className="flex w-full items-center justify-between gap-4">
              <Logo compact />
              <MobileNavigation items={navItems} />
              <div className="hidden items-center gap-5 lg:flex lg:gap-6">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="focus-ring inline-flex min-h-11 items-center rounded-sm text-sm font-semibold text-navy/75 transition hover:text-navy"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <Link
                href="/quiz"
                className="focus-ring hidden min-h-11 shrink-0 items-center rounded-md bg-lime px-4 py-2 font-sans text-sm font-semibold text-ink transition hover:bg-lime/80 lg:inline-flex"
              >
                Start quiz
              </Link>
            </div>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="border-t border-ink/15 bg-mist">
          <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-10 text-sm text-navy/70 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-8">
            <div className="grid gap-3">
              <Logo compact />
              <p>Built for UK students preparing for life after school.</p>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1 font-display font-semibold [&_a]:inline-flex [&_a]:min-h-11 [&_a]:items-center">
              <Link href="/" className="focus-ring rounded-sm hover:text-navy">
                Home
              </Link>
              <Link href="/quiz" className="focus-ring rounded-sm hover:text-navy">
                Quiz
              </Link>
              <Link href="/calculators" className="focus-ring rounded-sm hover:text-navy">
                Calculators
              </Link>
              <Link href="/resources" className="focus-ring rounded-sm hover:text-navy">
                Resources
              </Link>
              <Link href="/students" className="focus-ring rounded-sm hover:text-navy">
                Students
              </Link>
              <Link href="/schools" className="focus-ring rounded-sm hover:text-navy">
                Schools
              </Link>
              <Link href="/contact" className="focus-ring rounded-sm hover:text-navy">
                Contact
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
        <SiteAnalytics />
      </body>
    </html>
  );
}
