"use client";
import { usePathname } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { isSensitivePath, sanitiseAnalyticsUrl } from "@/lib/analyticsPrivacy";

export function SiteAnalytics() {
  const pathname = usePathname();
  return <>
    <GoogleAnalytics />
    {!isSensitivePath(pathname ?? "/") && <Analytics beforeSend={(event) => {
      const url = sanitiseAnalyticsUrl(event.url);
      return url ? { ...event, url } : null;
    }} />}
  </>;
}
