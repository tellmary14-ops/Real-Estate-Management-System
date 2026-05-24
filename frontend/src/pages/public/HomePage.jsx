import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { propertyApi } from "../../services/api";
import PropertyCard from "../../components/PropertyCard";
import { propertyImageKey } from "../../constants/images";
import LoadingSpinner from "../../components/LoadingSpinner";
import HeroSearch from "../../components/home/HeroSearch";
import StepIcon from "../../components/home/StepIcon";
import { appConfig } from "../../config";
import { images } from "../../constants/images";
import { locale } from "../../constants/locale";
import {
  stats,
  howItWorks,
  testimonials,
  neighborhoods,
  propertyFilterGroups,
} from "../../constants/homeContent";
import { IconStar } from "../../components/ui/Icons";

export default function HomePage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    propertyApi
      .list({ limit: "12", status: "AVAILABLE", sort: "newest" })
      .then((res) => setProperties(res.data.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const group = propertyFilterGroups.find((g) => g.id === filter);
    if (!group?.categories) return properties;
    return properties.filter((p) => group.categories.includes(p.category));
  }, [properties, filter]);

  const displayed = filtered.slice(0, 6);

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center">
        <img src={images.hero} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-slate-950/50" />
        <div className="relative container-page w-full pt-28 pb-32 lg:pt-36 lg:pb-40">
          <div className="max-w-2xl">
            <p className="hero-eyebrow text-meta mb-4 tracking-[0.2em]">Premium real estate</p>
            <h1 className="hero-title text-4xl sm:text-5xl lg:text-[3.75rem]">
              Find your dream home
            </h1>
            <p className="hero-subtitle mt-6 text-lg sm:text-xl max-w-xl leading-relaxed font-medium">
              {appConfig.tagline}. Discover handpicked homes across {locale.locationLabel}.
            </p>
            <p className="hero-subtitle mt-3 text-base max-w-lg leading-relaxed opacity-90">
              Search by city, property type, and budget — your next chapter starts here.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 z-10 px-4 sm:px-6 lg:px-8">
          <div className="container-page max-w-5xl mx-auto">
            <HeroSearch />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="kith-stats-bar mt-16 sm:mt-20">
        <div className="container-page py-8 md:py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center lg:text-left">
                <p className="text-2xl md:text-3xl font-bold text-white tracking-tight">{s.value}</p>
                <p className="mt-1 text-sm text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular properties */}
      <section className="section-pad pt-28 md:pt-32 lg:pt-36">
        <div className="container-page">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12 md:mb-14">
            <div className="max-w-xl">
              <p className="text-meta text-[var(--color-brand)]">Featured listings</p>
              <h2 className="heading-landing text-3xl md:text-4xl mt-2">Popular property</h2>
              <p className="mt-3 text-body">
                Handpicked homes with clear pricing, photos, and everything you need to decide.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {propertyFilterGroups.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setFilter(g.id)}
                  className={`kith-filter-pill ${filter === g.id ? "kith-filter-pill-active" : ""}`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <LoadingSpinner label="Loading properties…" />
          ) : displayed.length === 0 ? (
            <p className="text-center text-body py-16">No properties in this category yet.</p>
          ) : (
            <div className="grid gap-8 sm:gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {displayed.map((p) => (
                <PropertyCard key={`${p.id}-${propertyImageKey(p)}`} property={p} variant="grid" />
              ))}
            </div>
          )}

          <div className="text-center mt-14 md:mt-16">
            <Link to="/listings" className="btn-primary px-10">
              View all properties
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section-pad bg-[var(--color-surface-subtle)]">
        <div className="container-page">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-meta text-[var(--color-brand)]">Simple steps</p>
            <h2 className="heading-landing text-3xl md:text-4xl mt-2">How it works</h2>
            <p className="mt-3 text-body">From search to keys — a clear path at every stage.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {howItWorks.map((step) => (
              <div key={step.title} className="kith-step-card">
                <span className="kith-step-icon">
                  <StepIcon type={step.icon} />
                </span>
                <h3 className="text-base font-bold text-[var(--color-ink)] mt-5">{step.title}</h3>
                <p className="mt-2 text-caption leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Perfect house */}
      <section className="section-pad">
        <div className="container-page grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-md aspect-[4/3] lg:aspect-auto lg:min-h-[420px]">
            <img src={images.perfectHouse} alt="" className="h-full w-full object-cover" />
          </div>
          <div>
            <p className="text-meta text-[var(--color-brand)]">Why choose us</p>
            <h2 className="heading-landing text-3xl md:text-4xl mt-2">Find the perfect house</h2>
            <p className="mt-5 text-body leading-relaxed">
              We combine local expertise with modern tools so you can browse, compare, and book visits
              without the hassle. Every listing is verified and supported by our team.
            </p>
            <ul className="mt-8 space-y-4">
              {["Verified listings with real photos", "Schedule visits online", "Dedicated support through closing"].map(
                (item) => (
                  <li key={item} className="flex items-start gap-3 text-body">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--color-brand)] shrink-0" />
                    {item}
                  </li>
                )
              )}
            </ul>
            <Link to="/listings" className="btn-primary mt-10 inline-flex">
              Explore homes
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-pad bg-[var(--color-surface-subtle)]">
        <div className="container-page">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-meta text-[var(--color-brand)]">Testimonials</p>
            <h2 className="heading-landing text-3xl md:text-4xl mt-2">Words from our customers</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((t) => (
              <article key={t.name} className="kith-testimonial-card">
                <div className="flex gap-0.5 text-[var(--color-brand)]">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <IconStar key={i} filled size="xs" />
                  ))}
                </div>
                <p className="mt-4 text-body leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3 pt-6 border-t border-[var(--color-border)]">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-brand-soft)] text-sm font-bold text-[var(--color-brand)]">
                    {t.avatar}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-[var(--color-ink)]">{t.name}</p>
                    <p className="text-caption">{t.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Neighborhoods */}
      <section className="section-pad">
        <div className="container-page">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <p className="text-meta text-[var(--color-brand)]">Areas we serve</p>
              <h2 className="heading-landing text-3xl md:text-4xl mt-2">Explore neighborhoods</h2>
            </div>
            <Link to="/listings" className="text-sm font-semibold text-[var(--color-brand)] hover:underline shrink-0">
              View all areas →
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {neighborhoods.map((n) => (
              <Link
                key={n.name}
                to={`/listings?city=${encodeURIComponent(locale.city)}&search=${encodeURIComponent(n.name)}`}
                className="kith-neighborhood-card group"
              >
                <img src={n.image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-slate-900/35 group-hover:bg-slate-900/45 transition" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <p className="font-bold text-lg">{n.name}</p>
                  <p className="text-sm text-slate-200 mt-0.5">{n.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="kith-stats-bar">
        <div className="container-page py-14 md:py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Ready to find your next home?</h2>
          <p className="mt-3 text-slate-400 max-w-md mx-auto">
            Join thousands who trust {appConfig.appName} for their property journey.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary bg-white text-[var(--color-ink)] hover:bg-slate-100 border-0">
              Get started free
            </Link>
            <Link
              to="/listings"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-semibold text-white border border-white/30 hover:bg-white/10 transition"
            >
              Browse listings
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
