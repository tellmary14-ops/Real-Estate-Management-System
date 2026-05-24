import { useAuth } from "../../context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

  const fields = [
    { label: "Name", value: `${user?.firstName} ${user?.lastName}` },
    { label: "Email", value: user?.email },
    { label: "Phone", value: user?.phone || "—" },
    { label: "Account type", value: user?.role === "ADMIN" ? "Administrator" : "Member" },
  ];

  return (
    <div className="dash-page-stack">
    <div className="dash-panel dash-panel-pad max-w-lg">
      <div className="flex items-center gap-4 mb-8">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-brand-soft)] text-xl font-bold text-[var(--color-brand)]">
          {user?.firstName?.[0]}
          {user?.lastName?.[0]}
        </span>
        <div>
          <p className="text-xl font-bold text-slate-900">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-sm text-slate-500">{user?.email}</p>
        </div>
      </div>
      <dl className="space-y-4">
        {fields.map((f) => (
          <div key={f.label} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{f.label}</dt>
            <dd className="mt-1 font-semibold text-slate-900">{f.value}</dd>
          </div>
        ))}
      </dl>
    </div>
    </div>
  );
}
