import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { reservationApi } from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import ReservationStatusBadge from "../../components/admin/ReservationStatusBadge";

export default function ReservationsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reservationApi.mine().then((res) => setItems(res.data.data ?? [])).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="dash-page-stack">
    <div className="dash-panel">
      <div className="dash-panel-header">
        <h2 className="dash-panel-title">Your visits</h2>
        <p className="text-sm text-slate-500">{items.length} scheduled</p>
      </div>
      {items.length === 0 ? (
        <p className="px-5 py-12 text-center text-slate-500 text-sm">
          No visits yet.{" "}
          <Link to="/listings" className="link-brand">
            Browse properties
          </Link>
        </p>
      ) : (
        <ul>
          {items.map((r) => (
            <li key={r.id} className="dash-row-card flex-wrap">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900">{r.property.title}</p>
                <p className="text-sm text-slate-500 mt-1">
                  {new Date(r.startDate).toLocaleDateString()} – {new Date(r.endDate).toLocaleDateString()}
                </p>
              </div>
              <ReservationStatusBadge status={r.status} />
            </li>
          ))}
        </ul>
      )}
    </div>
    </div>
  );
}
