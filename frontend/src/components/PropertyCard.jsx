import { Link } from "react-router-dom";
import { formatPrice, formatCategory, formatStatus } from "../utils/format";
import { propertyImage, propertyImageKey } from "../constants/images";
import { PropertyLocation, PropertyFacts } from "./property/PropertyMeta";
import { IconLocation, IconBed, IconBath, IconArea } from "./ui/Icons";

export default function PropertyCard({ property, variant = "default" }) {
  const image = propertyImage(property);
  const imageKey = propertyImageKey(property);

  if (variant === "grid") {
    const region = [property.city || "Abuja", property.state, property.country || "Nigeria"]
      .filter(Boolean)
      .join(", ");
    return (
      <article className="kith-property-card group">
        <Link to={`/listings/${property.id}`} className="block relative aspect-[4/3] overflow-hidden bg-slate-100">
          <img
            key={`${property.id}-${imageKey}`}
            src={image}
            alt={property.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
          {property.isFeatured && (
            <span className="absolute top-3 left-3 badge-brand">Featured</span>
          )}
        </Link>
        <div className="p-5">
          <Link to={`/listings/${property.id}`}>
            <h3 className="text-base font-bold text-[var(--color-ink)] leading-snug group-hover:text-[var(--color-brand)] transition-colors line-clamp-2">
              {property.title}
            </h3>
          </Link>
          {region && (
            <p className="flex items-center gap-1.5 mt-2 text-caption">
              <IconLocation size="xs" className="text-[var(--color-ink-faint)]" />
              <span className="truncate">{region}</span>
            </p>
          )}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-caption">
            {property.bedrooms != null && (
              <span className="inline-flex items-center gap-1">
                <IconBed size="xs" className="text-[var(--color-ink-faint)]" />
                {property.bedrooms} Bed
              </span>
            )}
            {property.bathrooms != null && (
              <span className="inline-flex items-center gap-1">
                <IconBath size="xs" className="text-[var(--color-ink-faint)]" />
                {property.bathrooms} Bath
              </span>
            )}
            {property.areaSqft && (
              <span className="inline-flex items-center gap-1">
                <IconArea size="xs" className="text-[var(--color-ink-faint)]" />
                {property.areaSqft.toLocaleString()} sqft
              </span>
            )}
          </div>
          <div className="mt-4 flex items-center justify-between gap-2 pt-4 border-t border-[var(--color-border)]">
            <p className="text-sm font-bold text-[var(--color-brand)]">
              {formatPrice(property.price, property.currency)}
            </p>
            <Link
              to={`/listings/${property.id}`}
              className="text-sm font-semibold text-[var(--color-ink-secondary)] hover:text-[var(--color-brand)] transition-colors"
            >
              View details →
            </Link>
          </div>
        </div>
      </article>
    );
  }

  const isFeatured = property.isFeatured;
  const isLarge = variant === "large";

  return (
    <article
      className={`group card overflow-hidden transition-all duration-300 hover:shadow-md hover:border-slate-300 ${
        isLarge ? "md:col-span-2 md:grid md:grid-cols-2" : ""
      }`}
    >
      <Link
        to={`/listings/${property.id}`}
        className={`block relative overflow-hidden bg-slate-100 ${isLarge ? "md:min-h-[300px]" : "aspect-[4/3]"}`}
      >
        <img
          key={`${property.id}-${imageKey}`}
          src={image}
          alt={property.title}
          className={`h-full w-full object-cover transition duration-500 group-hover:scale-[1.02] ${
            isLarge ? "absolute inset-0 min-h-[260px]" : ""
          }`}
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {isFeatured && <span className="badge-brand">Featured</span>}
          <span
            className={`badge ${property.status === "AVAILABLE" ? "badge-available" : "bg-slate-900/75 text-white"}`}
          >
            {formatStatus(property.status)}
          </span>
        </div>
      </Link>

      <div className={`p-5 flex flex-col gap-3 ${isLarge ? "justify-center md:p-7" : ""}`}>
        <p className="text-meta text-[var(--color-brand)]">{formatCategory(property.category)}</p>
        <div className="space-y-1.5">
          <Link to={`/listings/${property.id}`}>
            <h3
              className={`heading-display group-hover:text-[var(--color-brand)] transition-colors ${
                isLarge ? "text-2xl md:text-[1.75rem]" : "text-xl"
              }`}
            >
              {property.title}
            </h3>
          </Link>
          <PropertyLocation city={property.city} state={property.state} />
        </div>
        <p className="font-display text-[1.375rem] leading-none font-semibold text-[var(--color-brand)] tracking-tight">
          {formatPrice(property.price, property.currency)}
        </p>
        <PropertyFacts
          bedrooms={property.bedrooms}
          bathrooms={property.bathrooms}
          areaSqft={property.areaSqft}
          className="pt-3 border-t border-[var(--color-border)]"
        />
      </div>
    </article>
  );
}
