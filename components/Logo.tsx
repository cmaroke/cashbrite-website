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
      src={light ? "/brand/cashbrite-logo-white.svg" : "/brand/cashbrite-logo.svg"}
      alt="Cashbrite"
      width={width}
      height={height}
      priority={compact}
      className="h-auto w-auto max-w-full"
    />
  );

  if (!href) {
    return <span className="inline-flex max-w-[264px] items-center">{logo}</span>;
  }

  return (
    <Link
      href={href}
      className="focus-ring inline-flex max-w-[188px] items-center rounded-sm transition hover:opacity-85 sm:max-w-[264px]"
      aria-label="Cashbrite home"
    >
      {logo}
    </Link>
  );
}
