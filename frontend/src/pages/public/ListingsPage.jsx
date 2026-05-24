import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { propertyApi } from "../../services/api";
import PropertyCard from "../../components/PropertyCard";
import { propertyImageKey } from "../../constants/images";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";
import PageHero from "../../components/ui/PageHero";
import { formatCategory } from "../../utils/format";
import { images } from "../../constants/images";
import { locale } from "../../constants/locale";

const CATEGORIES = ["", "HOUSE", "APARTMENT", "VILLA", "LAND", "COMMERCIAL", "OTHER"];

function filtersFromParams(searchParams) {
  return {
    search: searchParams.get("search") ?? "",
    city: searchParams.get("city") ?? "",
    category: searchParams.get("category") ?? "",
    minPrice: searchParams.get("minPrice") ?? "",
    maxPrice: searchParams.get("maxPrice") ?? "",
    sort: searchParams.get("sort") ?? "newest",
  };
}

export default function ListingsPage() {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(() => filtersFromParams(searchParams));

  const load = (f = filters) => {
    setLoading(true);
    const params = { ...f, status: "AVAILABLE", limit: "24" };
    Object.keys(params).forEach((k) => {
      if (params[k] === "") delete params[k];
    });
    propertyApi
      .list(params)
      .then((res) => setProperties(res.data.data ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const next = filtersFromParams(searchParams);
    setFilters(next);
    load(next);
  }, [searchParams]);

  return (
    <div className="bg-[var(--color-surface-subtle)] min-h-screen">
      <PageHero
        image={images.listingsHero}
        eyebrow="Our portfolio"
        title="Properties for sale"
        description={`Browse homes in ${locale.locationLabel}. Filter by area, type, and price in naira.`}
      />

      <div className="container-page py-12 md:py-16 lg:py-20">
        <div className="grid gap-8 lg:gap-12 lg:grid-cols-[300px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                load();
              }}
              className="kith-property-card p-6 md:p-7 space-y-6"
            >
              <h3 className="text-label text-ink text-base font-semibold">Filters</h3>
              <div>
                <label className="text-meta block mb-2">Keyword</label>
                <input
                  className="input-field"
                  placeholder="Pool, gated estate…"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
              <div>
                <label className="text-meta block mb-2">Area</label>
                <input
                  className="input-field"
                  placeholder={locale.city}
                  value={filters.city}
                  onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                />
              </div>
              <div>
                <label className="text-meta block mb-2">Type</label>
                <select
                  className="input-field"
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                >
                  <option value="">All types</option>
                  {CATEGORIES.filter(Boolean).map((c) => (
                    <option key={c} value={c}>{formatCategory(c)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-meta block mb-2">Sort</label>
                <select
                  className="input-field"
                  value={filters.sort}
                  onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                >
                  <option value="newest">Newest first</option>
                  <option value="price_asc">Price: low to high</option>
                  <option value="price_desc">Price: high to low</option>
                </select>
              </div>
              <button type="submit" className="btn-primary w-full">Apply filters</button>
            </form>
          </aside>

          <div>
            {!loading && (
              <p className="text-caption mb-6">
                {properties.length} {properties.length === 1 ? "property" : "properties"} found
              </p>
            )}
            {loading ? (
              <LoadingSpinner label="Searching properties…" />
            ) : properties.length === 0 ? (
              <EmptyState
                title="No matches"
                message="Try adjusting your filters or browse all available homes."
                action={
                  <button
                    type="button"
                    onClick={() => {
                      const cleared = { search: "", city: "", category: "", minPrice: "", maxPrice: "", sort: "newest" };
                      setFilters(cleared);
                      load(cleared);
                    }}
                    className="btn-primary"
                  >
                    Clear filters
                  </button>
                }
              />
            ) : (
              <div className="grid gap-8 sm:gap-10 sm:grid-cols-2 xl:grid-cols-3">
                {properties.map((p) => (
                  <PropertyCard key={`${p.id}-${propertyImageKey(p)}`} property={p} variant="grid" />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
