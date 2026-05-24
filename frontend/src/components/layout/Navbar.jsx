import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { appConfig } from "../../config";
import { IconMenu, IconClose } from "../ui/Icons";

const navLinks = [
  { to: "/", label: "Home", end: true },
  { to: "/listings", label: "Property" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isHome = location.pathname === "/";
  const onHero = isHome && !open;

  const linkClass = ({ isActive }) =>
    `text-[15px] font-medium transition-colors ${
      isActive
        ? onHero
          ? "text-white"
          : "text-[var(--color-brand)]"
        : onHero
          ? "text-white/85 hover:text-white"
          : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
    }`;

  const shellClass = onHero
    ? "absolute top-0 left-0 right-0 z-50 bg-transparent border-b border-white/10"
    : "sticky top-0 z-50 border-b border-[var(--color-border)] bg-white/95 backdrop-blur-md";

  return (
    <header className={shellClass}>
      <div className="container-page flex h-[76px] items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5 shrink-0" onClick={() => setOpen(false)}>
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-lg font-bold text-sm ${
              onHero ? "bg-white text-[var(--color-brand)]" : "bg-[var(--color-brand)] text-white"
            }`}
          >
            G
          </span>
          <span
            className={`font-bold text-lg tracking-tight hidden sm:block ${
              onHero ? "text-white" : "text-[var(--color-ink)]"
            }`}
          >
            {appConfig.appName}
          </span>
        </Link>

        <nav className="hidden xl:flex items-center gap-8">
          {navLinks.map((l) => (
            <NavLink key={`${l.to}-${l.label}`} to={l.to} end={l.end} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <>
              <NavLink
                to={isAdmin ? "/admin" : "/dashboard"}
                className={`text-sm font-medium px-4 py-2 rounded-lg transition ${
                  onHero
                    ? "text-white hover:bg-white/10"
                    : "text-[var(--color-ink-muted)] hover:text-[var(--color-brand)]"
                }`}
              >
                My account
              </NavLink>
              <button
                type="button"
                onClick={logout}
                className={onHero ? "kith-btn-hero-outline" : "btn-secondary py-2.5 px-5 text-sm"}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`text-sm font-medium px-3 py-2 hidden sm:inline ${
                  onHero ? "text-white/90 hover:text-white" : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                }`}
              >
                Sign in
              </Link>
              <Link to="/register" className={onHero ? "kith-btn-hero" : "btn-primary py-2.5 px-5 text-sm"}>
                Get started
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className={`lg:hidden p-2 -mr-2 ${onHero ? "text-white" : "text-[var(--color-ink)]"}`}
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <IconClose size="md" /> : <IconMenu size="md" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-[var(--color-border)] bg-white shadow-lg">
          <nav className="container-page py-6 flex flex-col gap-1">
            {navLinks.map((l) => (
              <NavLink
                key={`${l.to}-${l.label}-m`}
                to={l.to}
                end={l.end}
                className="block py-2.5 text-[15px] font-medium text-[var(--color-ink-muted)]"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </NavLink>
            ))}
            <hr className="my-4 border-[var(--color-border)]" />
            {user ? (
              <>
                <NavLink to={isAdmin ? "/admin" : "/dashboard"} className="py-2.5 font-medium" onClick={() => setOpen(false)}>
                  My account
                </NavLink>
                <button type="button" onClick={() => { logout(); setOpen(false); }} className="btn-primary mt-4 w-full">
                  Sign out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3 mt-2">
                <Link to="/login" className="btn-secondary w-full text-center" onClick={() => setOpen(false)}>
                  Sign in
                </Link>
                <Link to="/register" className="btn-primary w-full text-center" onClick={() => setOpen(false)}>
                  Get started
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
