const STYLES = {
  PENDING: "bg-[var(--color-brand-muted)] text-[var(--color-brand-hover)] border-[var(--color-brand-muted)]",
  CONFIRMED: "bg-[var(--color-brand-soft)] text-[var(--color-brand)] border-[var(--color-brand-muted)]",
  COMPLETED: "bg-[var(--color-brand-soft)] text-[var(--color-brand)] border-[var(--color-brand-muted)]",
  CANCELLED: "bg-slate-100 text-slate-600 border-slate-200",
};

const LABELS = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export default function ReservationStatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${
        STYLES[status] ?? STYLES.PENDING
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {LABELS[status] ?? status}
    </span>
  );
}
