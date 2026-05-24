import { useEffect, useState, useMemo } from "react";
import { paymentApi } from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import DashStatCard from "../../components/dashboard/DashStatCard";
import PaymentStatusBadge from "../../components/dashboard/PaymentStatusBadge";
import { IconPayments } from "../../components/dashboard/DashboardNavIcons";
import { formatPrice } from "../../utils/format";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");

  useEffect(() => {
    paymentApi.listAll().then((res) => setPayments(res.data.data ?? [])).finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const total = payments.reduce((s, p) => s + Number(p.amount), 0);
    const paid = payments.filter((p) => p.status === "COMPLETED");
    const pending = payments.filter((p) => p.status === "PENDING");
    const failed = payments.filter((p) => p.status === "FAILED");
    const paidSum = paid.reduce((s, p) => s + Number(p.amount), 0);
    const pendingSum = pending.reduce((s, p) => s + Number(p.amount), 0);
    const failedSum = failed.reduce((s, p) => s + Number(p.amount), 0);
    return {
      total,
      paidCount: paid.length,
      paidSum,
      pendingCount: pending.length,
      pendingSum,
      failedCount: failed.length,
      failedSum,
    };
  }, [payments]);

  const filtered = useMemo(() => {
    if (tab === "paid") return payments.filter((p) => p.status === "COMPLETED");
    if (tab === "pending") return payments.filter((p) => p.status === "PENDING");
    if (tab === "failed") return payments.filter((p) => p.status === "FAILED");
    return payments;
  }, [payments, tab]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="dash-page-stack">
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <DashStatCard
          label="Total amount"
          value={formatPrice(stats.total)}
          hint={`${payments.length} transactions`}
          icon={IconPayments}
        />
        <DashStatCard
          label="Paid"
          value={String(stats.paidCount).padStart(2, "0")}
          hint={`${formatPrice(stats.paidSum)} collected`}
          hintTone="success"
        />
        <DashStatCard
          label="Pending"
          value={String(stats.pendingCount).padStart(2, "0")}
          hint={`${formatPrice(stats.pendingSum)} outstanding`}
          hintTone="warning"
        />
        <DashStatCard
          label="Failed"
          value={String(stats.failedCount).padStart(2, "0")}
          hint={stats.failedSum ? formatPrice(stats.failedSum) : "None"}
          hintTone="danger"
        />
      </div>

      <div className="dash-tabs">
        {[
          { id: "all", label: "All" },
          { id: "paid", label: "Paid" },
          { id: "pending", label: "Pending" },
          { id: "failed", label: "Failed" },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`dash-tab ${tab === t.id ? "dash-tab-active" : ""}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="dash-panel">
        <div className="dash-panel-header">
          <h2 className="dash-panel-title">All transactions</h2>
        </div>
        {filtered.length === 0 ? (
          <p className="px-5 py-12 text-center text-slate-500 text-sm">No transactions in this view.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Client</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td className="font-medium text-slate-900">{p.invoiceNumber ?? p.id.slice(0, 8)}</td>
                    <td>{p.user?.email ?? "—"}</td>
                    <td className="font-semibold text-slate-900">{formatPrice(p.amount, p.currency)}</td>
                    <td>
                      <PaymentStatusBadge status={p.status} />
                    </td>
                    <td className="text-slate-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
