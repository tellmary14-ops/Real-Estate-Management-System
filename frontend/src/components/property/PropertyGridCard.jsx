import { Link } from "react-router-dom";
import { IconLocation } from "../ui/Icons";
import { formatPrice, formatCategory } from "../../utils/format";
import { propertyImage, propertyImageKey } from "../../constants/images";
import { PropertyFacts } from "./PropertyMeta";

export default function PropertyGridCard({ property }) {
  const image = propertyImage(property);
  const imageKey = propertyImageKey(property);
  const region = [property.city, property.state].filter(Boolean).join(", ");

  return (
    <article className="kith-property-card group">
      <Link to={`/listings/${property.id}`} className="block overflow-hidden rounded-2xl bg-slate-100">
        <img
          key={`${property.id}-${imageKey}`}
          src={image}
          alt={property.title}
          className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
      </Link>
      <div className="pt-5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-brand)]">
          {formatCategory(property.category)}
        </p>
        <Link to={`/listings/${property.id}`}>
          <h3 className="mt-1 text-lg font-bold text-[var(--color-ink)] leading-snug group-hover:text-[var(--color-brand)] transition-colors line-clamp-2">
            {property.title}
          </h3>
        </Link>
        {region && (
          <p className="mt-2 flex items-center gap-1.5 text-caption">
            <IconLocation size="xs" className="text-[var(--color-ink-faint)]" />
            <span>{region}</span>
          </p>
        )}
        <PropertyFacts
          bedrooms={property.bedrooms}
          bathrooms={property.bathrooms}
          areaSqft={property.areaSqft}
          className="mt-3"
        />
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-base font-bold text-[var(--color-ink)]">{formatPrice(property.price, property.currency)}</p>
          <Link
            to={`/listings/${property.id}`}
            className="text-sm font-semibold text-[var(--color-brand)] hover:underline shrink-0"
          >
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}
