type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  body?: string;
  align?: "left" | "center";
  headingLevel?: "h1" | "h2";
  light?: boolean;
};

export function SectionHeader({
  eyebrow,
  title,
  body,
  align = "left",
  headingLevel = "h2",
  light = false,
}: SectionHeaderProps) {
  const Heading = headingLevel;
  const headingStyles =
    headingLevel === "h1"
      ? "editorial-heading text-4xl md:text-5xl"
      : "editorial-heading text-2xl md:text-3xl";

  return (
    <div className={`${align === "center" ? "mx-auto text-center" : ""} max-w-3xl`}>
      {eyebrow ? (
        <p className={`mb-3 text-sm font-bold uppercase tracking-[0.14em] ${light ? "text-mint" : "text-sea"}`}>
          {eyebrow}
        </p>
      ) : null}
      <Heading className={`${headingStyles} ${light ? "text-white" : "text-navy"}`}>{title}</Heading>
      {body ? <p className={`mt-heading-copy text-lg leading-8 ${light ? "text-white/72" : "text-navy/72"}`}>{body}</p> : null}
    </div>
  );
}
