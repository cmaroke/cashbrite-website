import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

const publicRoutes = [
  "",
  "/students",
  "/schools",
  "/resources",
  "/quiz",
  "/contact",
  "/privacy-policy",
  "/terms-and-conditions",
  "/financial-disclaimer",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return publicRoutes.map((route) => ({
    url: new URL(route, siteUrl).toString(),
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/quiz" ? 0.9 : 0.7,
  }));
}
