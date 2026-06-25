import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/results", "/checkout/", "/money-ready-plan/success", "/premium-plan-preview"],
    },
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
  };
}
