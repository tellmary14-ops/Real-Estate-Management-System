const S = { xs: "w-4 h-4", sm: "w-[18px] h-[18px]" };

function I({ size = "sm", className = "", children }) {
  return (
    <svg className={`${S[size] ?? S.sm} shrink-0 ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      {children}
    </svg>
  );
}

export function IconDashboard(p) {
  return (
    <I {...p}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </I>
  );
}
export function IconProperties(p) {
  return (
    <I {...p}>
      <path d="M4 10.5L12 4l8 6.5V20a1 1 0 01-1 1h-5v-6H10v6H5a1 1 0 01-1-1v-9.5z" strokeLinejoin="round" />
    </I>
  );
}
export function IconUsers(p) {
  return (
    <I {...p}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" strokeLinecap="round" />
    </I>
  );
}
export function IconCalendar(p) {
  return (
    <I {...p}>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 10h16" strokeLinecap="round" />
    </I>
  );
}
export function IconPayments(p) {
  return (
    <I {...p}>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10h18" />
    </I>
  );
}
export function IconSettings(p) {
  return (
    <I {...p}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2" strokeLinecap="round" />
    </I>
  );
}
export function IconAnalytics(p) {
  return (
    <I {...p}>
      <path d="M4 18V8M10 18V4M16 18v-6M22 18H2" strokeLinecap="round" />
    </I>
  );
}
export function IconHeart(p) {
  return (
    <I {...p}>
      <path d="M12 21s-8-4.5-8-11a5 5 0 0110 0c0 6.5-8 11-8 11z" strokeLinejoin="round" />
    </I>
  );
}
export function IconUser(p) {
  return (
    <I {...p}>
      <circle cx="12" cy="8" r="4" />
      <path d="M5 20c0-4 3.6-7 7-7s7 3 7 7" strokeLinecap="round" />
    </I>
  );
}
export function IconBell(p) {
  return (
    <I {...p}>
      <path d="M18 16v-5a6 6 0 10-12 0v5l-2 2h16l-2-2z" strokeLinejoin="round" />
    </I>
  );
}
export function IconHelp(p) {
  return (
    <I {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.5 2.5 0 014.8 1c0 2-3 2-3 4M12 17h.01" strokeLinecap="round" />
    </I>
  );
}
export function IconLogout(p) {
  return (
    <I {...p}>
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
    </I>
  );
}
export function IconHome(p) {
  return <IconProperties {...p} />;
}
export function IconSearch(p) {
  return (
    <I {...p}>
      <circle cx="11" cy="11" r="6" />
      <path d="M20 20l-3-3" strokeLinecap="round" />
    </I>
  );
}
export function IconMenu(p) {
  return (
    <I {...p}>
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </I>
  );
}
export function IconClose(p) {
  return (
    <I {...p}>
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </I>
  );
}
export function IconPlus(p) {
  return (
    <I {...p}>
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </I>
  );
}
