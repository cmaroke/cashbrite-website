import { createHash } from "node:crypto";

export class PurchaseError extends Error {
  constructor(public readonly code: string) { super(code); }
}

export function purchaseLog(code: string, reference?: string) {
  console.error("Cashbrite purchase", { code, correlation: reference ? createHash("sha256").update(String(reference)).digest("hex").slice(0, 16) : undefined });
}

export const privateHeaders = {
  "Cache-Control": "private, no-store, max-age=0",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
};
