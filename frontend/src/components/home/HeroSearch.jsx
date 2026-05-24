import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconSearch } from "../ui/Icons";
import { priceRanges } from "../../constants/homeContent";
import { formatCategory } from "../../utils/format";
import { locale } from "../../constants/locale";

const PROPERTY_TYPES = [
  { value: "", label: "Property type" },
  { value: "HOUSE", label: "House" },
  { value: "APARTMENT", label: "Apartment" },
  { value: "VILLA", label: "Villa" },
  { value: "COMMERCIAL", label: "Commercial" },
  { value: "LAND", label: "Land" },
];

export default function HeroSearch({ className = "" }) {
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city.trim()) params.set("city", city.trim());
    if (category) params.set("category", category);
    const range = priceRanges.find((_, i) => String(i) === priceRange);
    if (range?.min) params.set("minPrice", range.min);
    if (range?.max) params.set("maxPrice", range.max);
    navigate(`/listings?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className={`kith-search-bar ${className}`}
    >
      <div className="kith-search-field flex-1 min-w-[140px]">
        <label className="kith-search-label">Location</label>
        <input
          type="text"
          placeholder={locale.city}
          className="kith-search-input"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </div>
      <div className="kith-search-field flex-1 min-w-[140px]">
        <label className="kith-search-label">Property type</label>
        <select
          className="kith-search-input"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {PROPERTY_TYPES.map((t) => (
            <option key={t.value || "any"} value={t.value}>
              {t.value ? formatCategory(t.value) : t.label}
            </option>
          ))}
        </select>
      </div>
      <div className="kith-search-field flex-1 min-w-[140px]">
        <label className="kith-search-label">Price range</label>
        <select
          className="kith-search-input"
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
        >
          {priceRanges.map((r, i) => (
            <option key={r.label} value={String(i)}>
              {r.label}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="kith-search-btn" aria-label="Search properties">
        <IconSearch size="md" className="text-white" />
      </button>
    </form>
  );
}
