import Link from "next/link";

type LogoProps = {
  href?: string;
  light?: boolean;
  compact?: boolean;
};

function LogoMark({ light = false }: Pick<LogoProps, "light">) {
  return (
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
        light ? "bg-mint text-navy" : "bg-mint/70 text-navy"
      }`}
      aria-hidden="true"
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" role="img">
        <path
          d="M12 2.75l1.9 5.38 5.35 1.87-5.35 1.87L12 17.25l-1.9-5.38L4.75 10l5.35-1.87L12 2.75Z"
          fill="currentColor"
        />
        <path d="M18.5 14.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z" fill="currentColor" />
      </svg>
    </span>
  );
}

export function Logo({ href = "/", light = false, compact = false }: LogoProps) {
  const content = (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark light={light} />
      <span className={`${compact ? "text-2xl" : "text-3xl"} font-black tracking-normal`}>Cashbrite</span>
    </span>
  );

  if (!href) {
    return <span className={light ? "text-white" : "text-navy"}>{content}</span>;
  }

  return (
    <Link
      href={href}
      className={`focus-ring inline-flex rounded-sm ${light ? "text-white" : "text-navy"} transition hover:opacity-85`}
      aria-label="Cashbrite home"
    >
      {content}
    </Link>
  );
}
