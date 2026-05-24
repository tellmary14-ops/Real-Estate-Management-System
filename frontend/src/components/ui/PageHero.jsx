export default function PageHero({ image, eyebrow, title, description }) {
  return (
    <section className="relative min-h-[280px] md:min-h-[340px] flex items-end overflow-hidden">
      <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-slate-950/55" />
      <div className="relative container-page w-full py-16 md:py-20 lg:py-24">
        {eyebrow && <p className="hero-eyebrow text-meta mb-2 tracking-[0.15em]">{eyebrow}</p>}
        <h1 className="hero-title text-3xl md:text-4xl lg:text-[2.75rem]">{title}</h1>
        {description && (
          <p className="hero-subtitle mt-4 text-base md:text-lg max-w-xl leading-relaxed">{description}</p>
        )}
      </div>
    </section>
  );
}
