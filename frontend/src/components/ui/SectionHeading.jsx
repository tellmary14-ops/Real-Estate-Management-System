export default function SectionHeading({ eyebrow, title, description, align = "left" }) {
  const alignClass = align === "center" ? "text-center mx-auto" : "";

  return (
    <div className={`max-w-2xl mb-8 md:mb-10 ${alignClass}`}>
      {eyebrow && <p className="text-meta text-[var(--color-brand)] mb-3">{eyebrow}</p>}
      <h2 className="heading-display text-3xl md:text-4xl lg:text-[2.75rem]">{title}</h2>
      {description && <p className="mt-4 text-lead max-w-xl">{description}</p>}
    </div>
  );
}
