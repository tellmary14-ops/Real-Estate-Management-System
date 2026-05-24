import { useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { appConfig } from "../../config";
import { IconSearch, IconMenu, IconClose, IconPlus, IconLogout } from "./DashboardNavIcons";

export default function DashboardShell({ config }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");

  const meta = config.pages[location.pathname] ?? {
    title: "Dashboard",
    subtitle: "",
  };

  const initials = [user?.firstName?.[0], user?.lastName?.[0]].filter(Boolean).join("") || "U";

  const navClass = ({ isActive }) => `dash-nav-link ${isActive ? "dash-nav-link-active" : ""}`;

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    if (config.basePath === "/admin") {
      navigate(`/admin/properties?search=${encodeURIComponent(search.trim())}`);
    } else {
      navigate(`/listings?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <div className="dash-shell min-h-screen flex bg-slate-50">
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
        />
      )}

      <aside
        className={`dash-sidebar fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-5 py-6 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-brand)] text-white font-bold text-sm">
              G
            </span>
            <span className="font-bold text-slate-900 text-[15px] leading-tight">{appConfig.appName}</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-5">
          <p className="dash-nav-section-label">{config.menuLabel}</p>
          <div className="space-y-1 mt-2">
            {config.menuItems.map((item) => (
              <NavLink
                key={`${item.to}-${item.label}`}
                to={item.to}
                end={item.end}
                className={navClass}
                onClick={(e) => {
                  setSidebarOpen(false);
                  if (item.scrollTo && location.pathname === item.to) {
                    e.preventDefault();
                    document.getElementById(item.scrollTo)?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                <item.icon size="sm" />
                {item.label}
              </NavLink>
            ))}
          </div>

          <p className="dash-nav-section-label mt-8">{config.generalLabel}</p>
          <div className="space-y-1 mt-2">
            {config.generalItems.map((item) =>
              item.external ? (
                <Link key={item.to} to={item.to} className="dash-nav-link" onClick={() => setSidebarOpen(false)}>
                  <item.icon size="sm" />
                  {item.label}
                </Link>
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={navClass}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon size="sm" />
                  {item.label}
                </NavLink>
              )
            )}
            <button type="button" onClick={logout} className="dash-nav-link w-full">
              <IconLogout size="sm" />
              Sign out
            </button>
          </div>
        </nav>

      </aside>

      <div className="flex-1 flex flex-col min-w-0 lg:pl-[260px]">
        <header className="dash-header sticky top-0 z-30 px-5 sm:px-8 lg:px-10 py-5 flex flex-wrap items-center gap-4 lg:gap-6">
          <button
            type="button"
            className="lg:hidden p-2 -ml-1 rounded-lg hover:bg-slate-100"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <IconMenu size="sm" />
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold text-slate-900">{meta.title}</h1>
            {meta.subtitle && <p className="text-sm text-slate-500 mt-0.5">{meta.subtitle}</p>}
          </div>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <IconSearch size="sm" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search properties, clients…"
                className="dash-search-input w-full pl-10"
              />
            </div>
          </form>

          {meta.action && (
            <Link to={meta.action.to} className="dash-btn-primary shrink-0">
              <IconPlus size="sm" />
              {meta.action.label}
            </Link>
          )}

          <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-slate-900 leading-tight">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-slate-500 truncate max-w-[140px]">{user?.email}</p>
            </div>
            <span className="dash-avatar">{initials}</span>
          </div>
        </header>

        <main className="dash-main flex-1">
          <div className="dash-main-inner">
            <Outlet />
          </div>
        </main>
      </div>

      {sidebarOpen && (
        <button
          type="button"
          className="fixed top-4 right-4 z-[60] lg:hidden p-2 rounded-lg bg-white shadow-lg border border-slate-200"
          onClick={() => setSidebarOpen(false)}
        >
          <IconClose size="sm" />
        </button>
      )}
    </div>
  );
}
