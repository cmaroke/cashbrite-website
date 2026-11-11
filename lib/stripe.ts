import Stripe from "stripe";

export const moneyReadyPlanProduct = "cashbrite_money_ready_plan";

let stripeClient: Stripe | null = null;

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }

  stripeClient ??= new Stripe(secretKey);
  return stripeClient;
}

export function getSiteUrl(fallbackUrl?: string) {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (configuredUrl) {
    try {
      const siteUrl = new URL(configuredUrl);
      if (siteUrl.pathname !== "/" || siteUrl.search || siteUrl.hash || siteUrl.username || siteUrl.password ||
          (siteUrl.protocol !== "https:" && !(process.env.NODE_ENV !== "production" && siteUrl.hostname === "localhost"))) {
        throw new Error("invalid_origin");
      }
      return siteUrl.origin;
    } catch {
      throw new Error("site_origin_invalid");
    }
  }

  if (!fallbackUrl) {
    throw new Error("NEXT_PUBLIC_SITE_URL is not configured.");
  }

  return new URL(fallbackUrl).toString().replace(/\/$/, "");
}
