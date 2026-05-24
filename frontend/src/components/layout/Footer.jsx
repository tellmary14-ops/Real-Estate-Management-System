import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { appConfig } from "../../config";
import { locale } from "../../constants/locale";

const columns = [
  {
    title: "Company",
    links: [
      { to: "/", label: "Home" },
      { to: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Properties",
    links: [
      { to: "/listings", label: "All properties" },
      { to: "/listings?category=HOUSE", label: "Houses" },
      { to: "/listings?category=APARTMENT", label: "Apartments" },
    ],
  },
  {
    title: "Account",
    links: [
      { to: "/login", label: "Sign in" },
      { to: "/register", label: "Register" },
      { to: "/dashboard", label: "Dashboard" },
    ],
  },
];

const social = [
  { label: "Facebook", href: "#" },
  { label: "Twitter", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
];

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success("You're on the list — thank you!");
    setEmail("");
  };

  return (
    <footer className="kith-footer">
      <div className="container-page pt-16 pb-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-brand)] text-white font-bold">
                G
              </span>
              <span className="text-xl font-bold text-white">{appConfig.appName}</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-400 max-w-sm">
              Premium properties in {locale.locationLabel}, with transparent pricing in naira.
            </p>
            <form onSubmit={handleNewsletter} className="mt-6 flex gap-2 max-w-sm">
              <input
                type="email"
                required
                placeholder="Your email"
                className="flex-1 rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-[var(--color-brand)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/20"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className="btn-primary shrink-0 py-2.5 px-5 text-sm">
                Subscribe
              </button>
            </form>
          </div>

          {columns.map((col) => (
            <div key={col.title} className="lg:col-span-2">
              <h4 className="text-sm font-bold text-white mb-4">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-slate-400 hover:text-white transition">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold text-white mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                {locale.addressLine}, {locale.city}, {locale.country}
              </li>
              <li>
                <a href={`tel:${locale.phone.replace(/\s/g, "")}`} className="hover:text-white transition">
                  {locale.phone}
                </a>
              </li>
              <li>
                <a href="mailto:hello@goldeneggsestate.com" className="hover:text-white transition">
                  hello@goldeneggsestate.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-slate-700 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} {appConfig.appName}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4">
            {social.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="text-xs font-medium text-slate-400 hover:text-white transition uppercase tracking-wide"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
