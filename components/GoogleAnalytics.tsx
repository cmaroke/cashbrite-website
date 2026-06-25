"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";

const GA_MEASUREMENT_ID = "G-XSGSX4EXY6";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function GoogleAnalyticsPageView() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    const trackPageView = () => {
      if (!window.gtag) return false;

      const pagePath = `${pathname}${window.location.search}${window.location.hash}`;
      window.gtag("config", GA_MEASUREMENT_ID, {
        page_path: pagePath,
      });
      return true;
    };

    if (trackPageView()) return;

    const timeout = window.setTimeout(trackPageView, 600);
    return () => window.clearTimeout(timeout);
  }, [pathname]);

  return null;
}

export function GoogleAnalytics() {
  if (process.env.NODE_ENV !== "production") return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="cashbrite-ga4"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
          `,
        }}
      />
      <GoogleAnalyticsPageView />
    </>
  );
}
