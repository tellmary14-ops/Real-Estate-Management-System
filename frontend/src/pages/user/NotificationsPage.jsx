import { useEffect, useState } from "react";
import { notificationApi } from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function NotificationsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => notificationApi.list().then((res) => setItems(res.data.data ?? []));

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="dash-page-stack">
    <div className="dash-panel">
      <div className="dash-panel-header">
        <h2 className="dash-panel-title">Notifications</h2>
        <button
          type="button"
          onClick={() => notificationApi.markAllRead().then(load)}
          className="link-brand text-sm"
        >
          Mark all read
        </button>
      </div>
      {items.length === 0 ? (
        <p className="px-5 py-12 text-center text-slate-500 text-sm">No notifications yet.</p>
      ) : (
        <ul className="px-2">
          {items.map((n) => (
            <li
              key={n.id}
              className={`dash-activity-item mx-3 ${n.isRead ? "opacity-60" : ""}`}
            >
              <span className="dash-activity-avatar">!</span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900">{n.title}</p>
                <p className="text-sm text-slate-500 mt-0.5">{n.message}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
    </div>
  );
}
