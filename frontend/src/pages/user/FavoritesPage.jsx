import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { favoriteApi } from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import { formatPrice } from "../../utils/format";
import { propertyImage } from "../../constants/images";

export default function FavoritesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    favoriteApi.list().then((res) => setItems(res.data.data ?? [])).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="dash-page-stack">
    <div className="dash-panel">
      <div className="dash-panel-header">
        <h2 className="dash-panel-title">Saved homes</h2>
        <p className="text-sm text-slate-500">{items.length} saved</p>
      </div>
      {items.length === 0 ? (
        <p className="px-5 py-12 text-center text-slate-500 text-sm">
          No favorites yet.{" "}
          <Link to="/listings" className="link-brand">
            Browse listings
          </Link>
        </p>
      ) : (
        <ul>
          {items.map((f) => (
            <li key={f.id}>
              <Link to={`/listings/${f.property.id}`} className="dash-row-card">
                <img src={propertyImage(f.property)} alt="" className="h-16 w-24 rounded-xl object-cover shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900">{f.property.title}</p>
                  <p className="text-sm font-semibold text-[var(--color-brand)] mt-1">
                    {formatPrice(f.property.price, f.property.currency)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
    </div>
  );
}
