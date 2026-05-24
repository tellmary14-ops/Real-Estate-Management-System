const STYLES = {
  COMPLETED: "dash-badge dash-badge-success",
  PENDING: "dash-badge dash-badge-warning",
  FAILED: "dash-badge dash-badge-danger",
  REFUNDED: "dash-badge bg-slate-100 text-slate-600",
};

const LABELS = {
  COMPLETED: "Paid",
  PENDING: "Pending",
  FAILED: "Failed",
  REFUNDED: "Refunded",
};

export default function PaymentStatusBadge({ status }) {
  return <span className={STYLES[status] ?? STYLES.PENDING}>{LABELS[status] ?? status}</span>;
}
