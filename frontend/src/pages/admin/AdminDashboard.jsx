import { useCallback, useEffect, useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { analyticsApi } from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import DashStatCard from "../../components/dashboard/DashStatCard";
import ReservationStatusBadge from "../../components/admin/ReservationStatusBadge";
import { AreaChart, BarChart, DonutChart } from "../../components/admin/charts/DashboardCharts";
import {
  IconProperties,
  IconUsers,
  IconCalendar,
  IconPayments,
} from "../../components/dashboard/DashboardNavIcons";
import { formatPrice } from "../../utils/format";
import { logger } from "../../utils/logger";

const EMPTY = {
  users: { total: 0 },
  properties: { total: 0, available: 0, pending: 0, sold: 0 },
  reservations: { total: 0, pending: 0 },
  payments: { total: 0, completed: 0, revenue: 0, revenueThisMonth: 0, revenueChange: 0 },
  charts: {
    revenueByMonth: [],
    reservationsByDay: [],
    propertyStatus: [],
    propertyStatusAll: [],
  },
  recentReservations: [],
};

function normalize(raw) {
  if (!raw) return EMPTY;
  const statusAll =
    raw.charts?.propertyStatusAll?.length > 0
      ? raw.charts.propertyStatusAll
      : raw.charts?.propertyStatus ?? [];

  return {
    users: { total: raw.users?.total ?? 0 },
    properties: {
      total: raw.properties?.total ?? 0,
      available: raw.properties?.available ?? 0,
      pending: raw.properties?.pending ?? 0,
      sold: raw.properties?.sold ?? 0,
    },
    reservations: { total: raw.reservations?.total ?? 0, pending: raw.reservations?.pending ?? 0 },
    payments: {
      total: raw.payments?.total ?? 0,
      completed: raw.payments?.completed ?? 0,
      revenue: raw.payments?.revenue ?? 0,
      revenueThisMonth: raw.payments?.revenueThisMonth ?? 0,
      revenueChange: raw.payments?.revenueChange ?? 0,
    },
    charts: {
      revenueByMonth: raw.charts?.revenueByMonth ?? [],
      reservationsByDay: raw.charts?.reservationsByDay ?? [],
      propertyStatus: raw.charts?.propertyStatus ?? statusAll.filter((s) => s.value > 0),
      propertyStatusAll: statusAll,
    },
    recentReservations: raw.recentReservations ?? [],
  };
}

export default function AdminDashboard() {
  const [data, setData] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const location = useLocation();

  const loadDashboard = useCallback(() => {
    logger.info("admin:dashboard:load");
    setLoading(true);
    return analyticsApi
      .dashboard()
      .then((res) => {
        const normalized = normalize(res.data?.data ?? res.data);
        setData(normalized);
        logger.info("admin:dashboard:loaded", {
          properties: normalized.properties,
          recent: normalized.recentReservations.length,
        });
      })
      .catch((err) => {
        logger.error("admin:dashboard:error", err.message);
        toast.error("Could not refresh overview.");
      })
      .finally(() => {
        setLoading(false);
        setReady(true);
      });
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard, location.pathname]);

  useEffect(() => {
    const onFocus = () => loadDashboard();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [loadDashboard]);

  const statusBreakdown = useMemo(() => {
    const rows = data.charts.propertyStatusAll.length
      ? data.charts.propertyStatusAll
      : [
          { label: "Available", value: data.properties.available },
          { label: "Pending", value: data.properties.pending },
          { label: "Sold", value: data.properties.sold },
        ];
    return rows;
  }, [data]);

  if (!ready && loading) {
    return <LoadingSpinner label="Loading dashboard…" />;
  }

  return (
    <div className="dash-page-stack">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">Live overview — refreshes when you open this page</p>
        <button type="button" className="btn-secondary text-sm py-2" onClick={loadDashboard} disabled={loading}>
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <DashStatCard
          label="Total revenue"
          value={formatPrice(data.payments.revenue)}
          hint={`${formatPrice(data.payments.revenueThisMonth)} this month · ${data.payments.completed} paid`}
          hintTone="success"
          icon={IconPayments}
        />
        <DashStatCard
          label="Properties"
          value={data.properties.total}
          hint={`${data.properties.available} available · ${data.properties.sold} sold`}
          icon={IconProperties}
        />
        <DashStatCard
          label="Pending visits"
          value={data.reservations.pending}
          hint={`${data.reservations.total} total visit requests`}
          hintTone="warning"
          icon={IconCalendar}
        />
        <DashStatCard
          label="Users"
          value={data.users.total}
          hint="Registered accounts"
          icon={IconUsers}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="dash-panel xl:col-span-2 dash-panel-pad" id="analytics">
          <h2 className="dash-panel-title mb-1">Revenue overview</h2>
          <p className="text-sm text-slate-500 mb-6">
            Paid amounts by month (last 6 months) — {formatPrice(data.payments.revenueThisMonth)} received this
            month
          </p>
          {data.charts.revenueByMonth.length === 0 ? (
            <p className="text-sm text-slate-500 py-8 text-center">No paid invoices in the last 6 months yet.</p>
          ) : (
            <AreaChart data={data.charts.revenueByMonth} height={200} />
          )}
        </div>
        <div className="dash-panel dash-panel-pad">
          <h2 className="dash-panel-title mb-1">Property status</h2>
          <p className="text-sm text-slate-500 mb-6">{data.properties.total} listings</p>
          <DonutChart
            segments={data.charts.propertyStatus}
            listingsTotal={data.properties.total}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="dash-panel lg:col-span-2">
          <div className="dash-panel-header">
            <h2 className="dash-panel-title">Recent reservations</h2>
            <Link to="/admin/reservations" className="text-sm font-semibold text-[var(--color-brand)] hover:underline">
              View all ({data.reservations.total})
            </Link>
          </div>
          {data.recentReservations.length === 0 ? (
            <p className="px-5 py-10 text-center text-slate-500 text-sm">No visit requests yet.</p>
          ) : (
            <ul>
              {data.recentReservations.map((r) => (
                <li key={r.id} className="dash-row-card">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900">{r.guestName}</p>
                    <p className="text-sm text-slate-500 truncate">{r.propertyTitle}</p>
                  </div>
                  <ReservationStatusBadge status={r.status} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-6">
          <div className="dash-panel dash-panel-pad">
            <h2 className="dash-panel-title mb-1">Weekly activity</h2>
            <p className="text-sm text-slate-500 mb-4">New visit requests per day</p>
            {data.charts.reservationsByDay.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-6">No visits in the last 7 days.</p>
            ) : (
              <BarChart data={data.charts.reservationsByDay} height={160} />
            )}
          </div>
          <div className="dash-panel dash-panel-pad">
            <h2 className="dash-panel-title mb-4">Quick summary</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between">
                <span className="text-slate-500">Total listings</span>
                <span className="font-semibold text-slate-900">{data.properties.total}</span>
              </li>
              {statusBreakdown.map((row) => (
                <li key={row.label} className="flex justify-between">
                  <span className="text-slate-500">{row.label}</span>
                  <span className="font-semibold text-slate-900">{row.value}</span>
                </li>
              ))}
              <li className="flex justify-between border-t border-slate-100 pt-3">
                <span className="text-slate-500">Visit requests</span>
                <span className="font-semibold text-slate-900">{data.reservations.total}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-500">Paid invoices</span>
                <span className="font-semibold text-[var(--color-brand)]">{data.payments.completed}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-500">Revenue this month</span>
                <span className="font-semibold text-[var(--color-brand)]">
                  {formatPrice(data.payments.revenueThisMonth)}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
