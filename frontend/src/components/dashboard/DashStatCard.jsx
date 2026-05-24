export default function DashStatCard({ label, value, hint, hintTone = "neutral", icon: Icon }) {
  const toneClass =
    hintTone === "success"
      ? "text-[var(--color-brand)]"
      : hintTone === "warning"
        ? "text-[var(--color-brand-light)]"
        : hintTone === "danger"
          ? "text-red-600"
          : "text-slate-500";

  return (
    <div className="dash-stat-card">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-slate-500">{label}</p>
          <p className="dash-stat-value mt-2">{value}</p>
          {hint && <p className={`text-xs font-medium mt-2 ${toneClass}`}>{hint}</p>}
        </div>
        {Icon && (
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-brand-soft)] text-[var(--color-brand)] shrink-0">
            <Icon size="sm" />
          </span>
        )}
      </div>
    </div>
  );
}
