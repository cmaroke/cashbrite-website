import type { Metadata } from "next";

// Public search identity must match the live preferred host, including when
// operational links use a different NEXT_PUBLIC_SITE_URL in a preview.
export const siteUrl = "https://www.cashbrite.co.uk";
export const siteName = "Cashbrite";
export const defaultDescription =
  "Cashbrite helps UK students and school leavers build money confidence through financial education, practical resources and a free Money Readiness Assessment.";

type SeoMetadataOptions = {
  description: string;
  noIndex?: boolean;
  path: string;
  title: string;
};

export function createSeoMetadata({ description, noIndex = false, path, title }: SeoMetadataOptions): Metadata {
  const canonical = new URL(path, siteUrl).toString();

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName,
      images: [
        {
          url: new URL("/brand/v2/social.png", siteUrl).toString(),
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
      title,
      description,
      images: [new URL("/brand/v2/social.png", siteUrl).toString()],
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
