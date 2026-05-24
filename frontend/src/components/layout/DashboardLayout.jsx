import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
export default function DashboardLayout({ links, title, description }) {
  const { user } = useAuth();

  const linkClass = ({ isActive }) =>
    isActive ? "dashboard-nav-active" : "dashboard-nav-item";

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[var(--color-surface-subtle)]">
      <div className="page-header">
        <div className="container-page py-8 md:py-10">
          <p className="text-meta text-[var(--color-brand)] mb-2">Account</p>
          <h1 className="heading-display text-3xl md:text-4xl">{title}</h1>
          <p className="mt-3 text-lead">
            {description ?? `Hello, ${user?.firstName}. Manage everything in one place.`}
          </p>
        </div>
      </div>

      <div className="container-page py-8 md:py-10">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="card p-3 h-fit lg:sticky lg:top-24">
            <nav className="space-y-1">
              {links.map((l) => (
                <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
                  {l.label}
                </NavLink>
              ))}
            </nav>
          </aside>
          <section className="card p-6 md:p-8 min-h-[400px]">
            <Outlet />
          </section>
        </div>
      </div>
    </div>
  );
}
