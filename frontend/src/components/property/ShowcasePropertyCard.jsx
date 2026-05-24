import { Link } from "react-router-dom";
import { formatPrice, formatCategory } from "../../utils/format";
import { propertyImage, propertyImageKey } from "../../constants/images";
import { IconLocation, IconBed, IconBath, IconArea } from "../ui/Icons";

export default function ShowcasePropertyCard({ property }) {
  const image = propertyImage(property);
  const imageKey = propertyImageKey(property);
  const region = [property.city, property.state].filter(Boolean).join(", ");

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
          <span className="absolute top-3 left-3 kith-badge">Featured</span>
        )}
      </Link>
      <div className="p-5">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-brand)] mb-1.5">
          {formatCategory(property.category)}
        </p>
        <Link to={`/listings/${property.id}`}>
          <h3 className="text-lg font-bold text-[var(--color-ink)] leading-snug group-hover:text-[var(--color-brand)] transition-colors line-clamp-2">
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
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--color-border)]">
          <Link
            to={`/listings/${property.id}`}
            className="text-sm font-semibold text-[var(--color-brand)] hover:underline"
          >
            View details
          </Link>
          <p className="text-base font-bold text-[var(--color-ink)] tabular-nums">
            {formatPrice(property.price, property.currency)}
          </p>
        </div>
      </div>
    </article>
  );
}
