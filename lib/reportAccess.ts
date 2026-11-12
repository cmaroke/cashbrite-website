import "server-only";
import { createHash } from "node:crypto";
import { findRegisteredReport, getAssessment } from "@/lib/assessmentDb";

export const reportCookieName = "cashbrite_report_access";
export const reportKeyPattern = /^[a-f0-9]{64}$/;
export const reportCookieOptions = {
  httpOnly: true, secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const, path: "/", maxAge: 30 * 86400,
};
export function hashReportKey(key: string) {
  return createHash("sha256").update(`cashbrite-report-v1/${key}`).digest("hex");
}
export function reportAssessmentId(key: string) {
  const hex = hashReportKey(key).slice(0, 32).split("");
  hex[12] = "5";
  hex[16] = ((parseInt(hex[16], 16) & 3) | 8).toString(16);
  const id = hex.join("");
  return `${id.slice(0,8)}-${id.slice(8,12)}-${id.slice(12,16)}-${id.slice(16,20)}-${id.slice(20)}`;
}
export async function getRegisteredReport(key: string) {
  if (!reportKeyPattern.test(key)) return null;
  const record = await findRegisteredReport(hashReportKey(key));
  return record ? getAssessment(record.id) : null;
}
