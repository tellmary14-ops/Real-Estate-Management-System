const SIZES = {
  xs: "w-3 h-3",
  sm: "w-3.5 h-3.5",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

function iconClass(size = "sm", className = "") {
  return `${SIZES[size] ?? SIZES.sm} shrink-0 ${className}`.trim();
}

function Svg({ className, children, strokeWidth = 1.5 }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      aria-hidden
    >
      {children}
    </svg>
  );
}

export function IconBed({ size = "sm", className = "" }) {
  return (
    <Svg className={iconClass(size, className)}>
      <path d="M3 14v3M3 10V8a2 2 0 012-2h14a2 2 0 012 2v2M3 14h18M7 14v-2a2 2 0 012-2h2" strokeLinecap="round" />
    </Svg>
  );
}

export function IconBath({ size = "sm", className = "" }) {
  return (
    <Svg className={iconClass(size, className)}>
      <path d="M4 12h16v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM6 12V7a2 2 0 012-2h1" strokeLinecap="round" />
    </Svg>
  );
}

export function IconArea({ size = "sm", className = "" }) {
  return (
    <Svg className={iconClass(size, className)}>
      <rect x="4" y="4" width="16" height="16" rx="1" />
    </Svg>
  );
}

export function IconLocation({ size = "sm", className = "" }) {
  return (
    <Svg className={iconClass(size, className)}>
      <path d="M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2" />
    </Svg>
  );
}

export function IconSearch({ size = "md", className = "" }) {
  return (
    <Svg className={iconClass(size, className)} strokeWidth={2}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3-3" strokeLinecap="round" />
    </Svg>
  );
}

export function IconMenu({ size = "md", className = "" }) {
  return (
    <Svg className={iconClass(size, className)} strokeWidth={2}>
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </Svg>
  );
}

export function IconClose({ size = "md", className = "" }) {
  return (
    <Svg className={iconClass(size, className)} strokeWidth={2}>
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </Svg>
  );
}

export function IconStar({ size = "sm", className = "", filled }) {
  return (
    <svg
      className={iconClass(size, className)}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path d="M12 2l3 7h7l-5.5 4.5 2 7.5L12 17l-6.5 4 2-7.5L2 9h7l3-7z" />
    </svg>
  );
}
