"use client";

import { useEffect, useLayoutEffect } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { isSensitivePath, sanitiseAnalyticsUrl } from "@/lib/analyticsPrivacy";
import { gaMeasurementId, getAnalyticsChoice } from "@/lib/analyticsConsent";

const GA_MEASUREMENT_ID = gaMeasurementId;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function GoogleAnalyticsPageView() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || isSensitivePath(pathname) || getAnalyticsChoice() !== "granted") return;

    const trackPageView = () => {
      if (!window.gtag || getAnalyticsChoice() !== "granted" || isSensitivePath(location.pathname)) return false;

      window.gtag("event", "page_view", {
        page_path: pathname,
        page_location: `${window.location.origin}${pathname}`,
        page_referrer: document.referrer ? sanitiseAnalyticsUrl(document.referrer) ?? "" : "",
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
  const pathname = usePathname();
  const sensitive = isSensitivePath(pathname ?? "/");
  useLayoutEffect(() => {
    (window as unknown as Record<string, unknown>)[`ga-disable-${GA_MEASUREMENT_ID}`] = sensitive || getAnalyticsChoice() !== "granted";
    return () => { (window as unknown as Record<string, unknown>)[`ga-disable-${GA_MEASUREMENT_ID}`] = true; };
  }, [sensitive]);
  if (process.env.NODE_ENV !== "production" || sensitive || getAnalyticsChoice() !== "granted") return null;

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
            gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
            gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false, page_location: location.origin + location.pathname, page_referrer: '' });
          `,
        }}
      />
      <GoogleAnalyticsPageView />
    </>
  );
}
