import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  favoriteApi,
  reservationApi,
  purchaseApi,
  notificationApi,
} from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import DashStatCard from "../../components/dashboard/DashStatCard";
import {
  IconHeart,
  IconCalendar,
  IconPayments,
  IconBell,
} from "../../components/dashboard/DashboardNavIcons";
import ReservationStatusBadge from "../../components/admin/ReservationStatusBadge";
import { formatPrice } from "../../utils/format";
import { propertyImage } from "../../constants/images";
import { logger } from "../../utils/logger";

export default function UserDashboard() {
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    logger.info("user:dashboard:load");
    Promise.all([
      favoriteApi.list(),
      reservationApi.mine(),
      purchaseApi.mine(),
      notificationApi.list(),
    ])
      .then(([f, r, p, n]) => {
        setFavorites(f.data.data ?? []);
        setReservations(r.data.data ?? []);
        setPurchases(p.data.data ?? []);
        setNotifications(n.data.data ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Loading your dashboard…" />;

  const unread = notifications.filter((x) => !x.isRead).length;
  const recentReservations = reservations.slice(0, 4);
  const recentFavorites = favorites.slice(0, 3);

  return (
    <div className="dash-page-stack">
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <DashStatCard label="Saved homes" value={favorites.length} hint="In your favorites" icon={IconHeart} />
        <DashStatCard
          label="Scheduled visits"
          value={reservations.length}
          hint={`${reservations.filter((r) => r.status === "PENDING").length} pending`}
          hintTone="warning"
          icon={IconCalendar}
        />
        <DashStatCard label="Purchases" value={purchases.length} hint="Properties you own" icon={IconPayments} />
        <DashStatCard
          label="Notifications"
          value={unread}
          hint={unread ? "Unread updates" : "All caught up"}
          hintTone={unread ? "warning" : "success"}
          icon={IconBell}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="dash-panel lg:col-span-2">
          <div className="dash-panel-header">
            <h2 className="dash-panel-title">Upcoming visits</h2>
            <Link to="/dashboard/reservations" className="text-sm font-semibold text-[var(--color-brand)] hover:underline">
              View all
            </Link>
          </div>
          {recentReservations.length === 0 ? (
            <p className="px-5 py-10 text-center text-slate-500 text-sm">
              No visits scheduled.{" "}
              <Link to="/listings" className="text-[var(--color-brand)] font-medium hover:underline">
                Browse properties
              </Link>
            </p>
          ) : (
            <ul>
              {recentReservations.map((r) => (
                <li key={r.id} className="dash-row-card">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900">{r.property?.title ?? "Property"}</p>
                    <p className="text-sm text-slate-500">
                      {new Date(r.startDate).toLocaleDateString()} – {new Date(r.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <ReservationStatusBadge status={r.status} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="dash-panel">
          <div className="dash-panel-header">
            <h2 className="dash-panel-title">Recent activity</h2>
          </div>
          {notifications.length === 0 ? (
            <p className="px-5 py-8 text-sm text-slate-500 text-center">No notifications yet.</p>
          ) : (
            <ul className="px-5 py-2">
              {notifications.slice(0, 5).map((n) => (
                <li key={n.id} className="dash-activity-item">
                  <span className="dash-activity-avatar">!</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900">{n.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="px-5 pb-4">
            <Link to="/dashboard/notifications" className="text-sm font-semibold text-[var(--color-brand)] hover:underline">
              See all notifications
            </Link>
          </div>
        </div>
      </div>

      {recentFavorites.length > 0 && (
        <div className="dash-panel">
          <div className="dash-panel-header">
            <h2 className="dash-panel-title">Saved homes</h2>
            <Link to="/dashboard/favorites" className="text-sm font-semibold text-[var(--color-brand)] hover:underline">
              View all
            </Link>
          </div>
          <ul>
            {recentFavorites.map((f) => (
              <li key={f.id}>
                <Link to={`/listings/${f.property.id}`} className="dash-row-card">
                  <img
                    src={propertyImage(f.property)}
                    alt=""
                    className="h-14 w-20 rounded-lg object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900 truncate">{f.property.title}</p>
                    <p className="text-sm font-semibold text-[var(--color-brand)] mt-0.5">
                      {formatPrice(f.property.price, f.property.currency)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
