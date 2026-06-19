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
      return siteUrl.toString().replace(/\/$/, "");
    } catch {
      console.error("NEXT_PUBLIC_SITE_URL is invalid. Falling back to the request origin.");
    }
  }

  if (!fallbackUrl) {
    throw new Error("NEXT_PUBLIC_SITE_URL is not configured.");
  }

  return new URL(fallbackUrl).toString().replace(/\/$/, "");
}
