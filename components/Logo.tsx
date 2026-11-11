import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  href?: string;
  light?: boolean;
  compact?: boolean;
};

export function Logo({ href = "/", light = false, compact = false }: LogoProps) {
  const width = compact ? 190 : 264;
  const height = compact ? 45 : 63;
  const logo = (
    <Image
      src={light ? "/brand/v2/wordmark-white.svg" : compact ? "/brand/v2/wordmark-compact.svg" : "/brand/v2/wordmark.svg"}
      alt="Cashbrite"
      width={width}
      height={height}
      priority={compact}
      className="h-auto w-full"
    />
  );

  if (!href) {
    return <span className={`inline-flex shrink-0 items-center ${compact ? "w-[168px] sm:w-[190px]" : "w-[220px] sm:w-[264px]"}`}>{logo}</span>;
  }

  return (
    <Link
      href={href}
      className={`focus-ring inline-flex shrink-0 items-center rounded-sm transition hover:opacity-85 ${compact ? "w-[168px] sm:w-[190px]" : "w-[220px] sm:w-[264px]"}`}
      aria-label="Cashbrite home"
    >
      {logo}
    </Link>
  );
}
