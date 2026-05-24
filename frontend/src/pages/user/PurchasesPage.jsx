import { useEffect, useState } from "react";
import { purchaseApi } from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import { formatPrice } from "../../utils/format";
import { propertyImage } from "../../constants/images";

export default function PurchasesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    purchaseApi.mine().then((res) => setItems(res.data.data ?? [])).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="dash-page-stack">
    <div className="dash-panel">
      <div className="dash-panel-header">
        <h2 className="dash-panel-title">Your purchases</h2>
        <p className="text-sm text-slate-500">{items.length} properties</p>
      </div>
      {items.length === 0 ? (
        <p className="px-5 py-12 text-center text-slate-500 text-sm">No purchases yet.</p>
      ) : (
        <ul>
          {items.map((p) => (
            <li key={p.id} className="dash-row-card">
              <img src={propertyImage(p.property)} alt="" className="w-24 h-20 rounded-xl object-cover shrink-0" />
              <div>
                <p className="font-semibold text-slate-900">{p.property.title}</p>
                <p className="text-lg font-bold text-[var(--color-brand)] mt-1">{formatPrice(p.amount, p.currency)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
    </div>
  );
}
