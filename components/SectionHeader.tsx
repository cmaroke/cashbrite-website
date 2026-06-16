type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  body?: string;
  align?: "left" | "center";
  light?: boolean;
};

export function SectionHeader({ eyebrow, title, body, align = "left", light = false }: SectionHeaderProps) {
  return (
    <div className={`${align === "center" ? "mx-auto text-center" : ""} max-w-3xl`}>
      {eyebrow ? (
        <p className={`mb-3 text-sm font-black uppercase tracking-[0.14em] ${light ? "text-mint" : "text-sea"}`}>
          {eyebrow}
        </p>
      ) : null}
      <h2 className={`text-3xl font-black tracking-normal sm:text-4xl ${light ? "text-white" : "text-navy"}`}>
        {title}
      </h2>
      {body ? <p className={`mt-4 text-lg leading-8 ${light ? "text-white/72" : "text-navy/72"}`}>{body}</p> : null}
    </div>
  );
}
