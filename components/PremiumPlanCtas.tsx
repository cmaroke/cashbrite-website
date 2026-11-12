import Link from "next/link";
// Compatibility for old design previews. There is deliberately no payment handler.
export function UnlockPlanButton({ assessmentId }: { assessmentId: string; label?: string; showReassurance?: boolean }) {
  return <Link href={`/results?id=${encodeURIComponent(assessmentId)}`} className="focus-ring inline-flex min-h-12 items-center justify-center rounded-md bg-lime px-6 py-4 font-semibold text-ink">Get My Full Report</Link>;
}
