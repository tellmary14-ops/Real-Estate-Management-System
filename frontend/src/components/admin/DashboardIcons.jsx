const SIZES = { xs: "w-3.5 h-3.5", sm: "w-4 h-4", md: "w-[18px] h-[18px]" };

function I({ size = "sm", className = "", children }) {
  return (
    <svg
      className={`${SIZES[size] ?? SIZES.sm} shrink-0 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      {children}
    </svg>
  );
}

export function IconDashboard({ size, className }) {
  return (
    <I size={size} className={className}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </I>
  );
}

export function IconProperties({ size, className }) {
  return (
    <I size={size} className={className}>
      <path d="M4 10.5L12 4l8 6.5V20a1 1 0 01-1 1h-5v-6H10v6H5a1 1 0 01-1-1v-9.5z" strokeLinejoin="round" />
    </I>
  );
}

export function IconUsers({ size, className }) {
  return (
    <I size={size} className={className}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" strokeLinecap="round" />
      <path d="M16 11h5M18.5 8.5v5" strokeLinecap="round" />
    </I>
  );
}

export function IconCalendar({ size, className }) {
  return (
    <I size={size} className={className}>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 10h16" strokeLinecap="round" />
    </I>
  );
}

export function IconPayments({ size, className }) {
  return (
    <I size={size} className={className}>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10h18" />
      <path d="M7 15h4" strokeLinecap="round" />
    </I>
  );
}

export function IconSettings({ size, className }) {
  return (
    <I size={size} className={className}>
      <circle cx="12" cy="12" r="3" />
      <path
        d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
        strokeLinecap="round"
      />
    </I>
  );
}

export function IconSearch({ size, className }) {
  return (
    <I size={size} className={className} strokeWidth={2}>
      <circle cx="11" cy="11" r="6" />
      <path d="M20 20l-3-3" strokeLinecap="round" />
    </I>
  );
}

export function IconBell({ size, className }) {
  return (
    <I size={size} className={className}>
      <path d="M18 16v-5a6 6 0 10-12 0v5l-2 2h16l-2-2z" strokeLinejoin="round" />
      <path d="M10 20a2 2 0 004 0" strokeLinecap="round" />
    </I>
  );
}

export function IconChevron({ size, className }) {
  return (
    <I size={size} className={className}>
      <path d="M10 8l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </I>
  );
}

export function IconRevenue({ size, className }) {
  return (
    <I size={size} className={className}>
      <path d="M12 3v18M7 8l5-5 5 5M7 16l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
    </I>
  );
}

export function IconHome({ size, className }) {
  return <IconProperties size={size} className={className} />;
}

export function IconTrend({ size, className }) {
  return (
    <I size={size} className={className}>
      <path d="M4 16l5-5 4 4 7-8" strokeLinecap="round" strokeLinejoin="round" />
    </I>
  );
}

export function IconPlus({ size, className }) {
  return (
    <I size={size} className={className}>
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </I>
  );
}

export function IconMenu({ size, className }) {
  return (
    <I size={size} className={className}>
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </I>
  );
}

export function IconClose({ size, className }) {
  return (
    <I size={size} className={className}>
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </I>
  );
}
