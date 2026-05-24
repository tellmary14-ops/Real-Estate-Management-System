export default function StatCard({ label, value, change, changeLabel, icon: Icon, iconBg, iconColor }) {
  const isPositive = change != null && change >= 0;

  return (
    <div className="admin-stat-card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-caption font-medium">{label}</p>
          <p className="admin-stat-value mt-2">{value}</p>
          {change != null && (
            <p className={`text-[11px] mt-2 font-medium ${isPositive ? "text-[var(--color-brand)]" : "text-red-500"}`}>
              {isPositive ? "+" : ""}
              {change}% {changeLabel ?? "vs last month"}
            </p>
          )}
        </div>
        {Icon && (
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-lg shrink-0 ${iconBg}`}
            style={iconColor ? { color: iconColor } : undefined}
          >
            <Icon size="sm" />
          </span>
        )}
      </div>
    </div>
  );
}
