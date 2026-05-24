/**
 * Compact property facts — text-first; icons optional and small.
 */
export function PropertyLocation({ city, state, country, address, className = "" }) {
  const region = [city || "Abuja", state, country || "Nigeria"].filter(Boolean).join(", ");

  if (address) {
    return (
      <div className={className}>
        <p className="text-caption">{address}</p>
        <p className="text-caption mt-0.5">{region}</p>
      </div>
    );
  }

  return <p className={`text-caption ${className}`}>{region}</p>;
}

export function PropertyFacts({ bedrooms, bathrooms, areaSqft, className = "" }) {
  const parts = [];
  if (bedrooms != null) parts.push(`${bedrooms} bed${bedrooms !== 1 ? "s" : ""}`);
  if (bathrooms != null) parts.push(`${bathrooms} bath${bathrooms !== 1 ? "s" : ""}`);
  if (areaSqft) parts.push(`${areaSqft.toLocaleString()} sq ft`);

  if (parts.length === 0) return null;

  return (
    <p className={`text-caption ${className}`}>
      {parts.join(" · ")}
    </p>
  );
}

export function PropertyFactsDetail({ bedrooms, bathrooms, areaSqft }) {
  const items = [];
  if (bedrooms != null) items.push({ label: "Bedrooms", value: bedrooms });
  if (bathrooms != null) items.push({ label: "Bathrooms", value: bathrooms });
  if (areaSqft) items.push({ label: "Area", value: `${areaSqft.toLocaleString()} sq ft` });

  return (
    <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-lg bg-[var(--color-surface-subtle)] px-4 py-3">
          <dt className="text-meta text-[var(--color-ink-faint)]">{item.label}</dt>
          <dd className="mt-1 text-body font-semibold text-[var(--color-ink)] tabular-nums">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
