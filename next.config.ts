import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return ["/quiz", "/results", "/report/:path*", "/downloads/:path*", "/checkout/:path*", "/money-ready-plan/:path*", "/premium-plan-preview", "/api/:path*"].map((source) => ({
      source,
      headers: [
        { key: "Cache-Control", value: "private, no-store, max-age=0" },
        { key: "Referrer-Policy", value: "no-referrer" },
        { key: "X-Robots-Tag", value: "noindex, nofollow" },
        { key: "X-Content-Type-Options", value: "nosniff" },
      ],
    }));
  },
  outputFileTracingIncludes: { "/api/reports/excel": ["./assets/downloads/*.xlsx"], "/downloads/cashbrite-budget-tracker.xlsx": ["./assets/downloads/*.xlsx"] },
};

export default nextConfig;
