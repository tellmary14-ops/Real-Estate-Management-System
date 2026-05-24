import {
  IconDashboard,
  IconProperties,
  IconUsers,
  IconCalendar,
  IconPayments,
  IconSettings,
  IconHeart,
  IconUser,
  IconBell,
  IconHelp,
  IconLogout,
  IconHome,
  IconMenu,
  IconClose,
  IconSearch,
} from "./DashboardNavIcons";

export const adminConfig = {
  basePath: "/admin",
  menuLabel: "Menu",
  generalLabel: "General",
  menuItems: [
    { to: "/admin", label: "Dashboard", icon: IconDashboard, end: true },
    { to: "/admin/properties", label: "Properties", icon: IconProperties },
    { to: "/admin/payments", label: "Financial", icon: IconPayments },
    { to: "/admin/reservations", label: "Reservations", icon: IconCalendar },
    { to: "/admin/users", label: "Users", icon: IconUsers },
  ],
  generalItems: [
    { to: "/admin/settings", label: "Settings", icon: IconSettings },
    {
      to: "/properties",
      label: "View Properties",
      icon: IconSearch,
      external: true,
    },
  ],
  pages: {
    "/admin": {
      title: "Dashboard",
      subtitle: "Overview of your platform at a glance.",
      action: { label: "Add property", to: "/admin/properties" },
    },
    "/admin/properties": {
      title: "Properties",
      subtitle: "Manage listings, photos, and availability.",
      action: { label: "Add property", to: "/admin/properties" },
    },
    "/admin/users": {
      title: "Users",
      subtitle: "All registered accounts on the platform.",
    },
    "/admin/reservations": {
      title: "Reservations",
      subtitle: "Review and update viewing requests.",
    },
    "/admin/payments": {
      title: "Financial",
      subtitle: "Manage finances, transactions, and invoices.",
      action: { label: "View properties", to: "/admin/properties" },
    },
    "/admin/settings": {
      title: "Settings",
      subtitle: "Account and system preferences.",
    },
  },
};

export const userConfig = {
  basePath: "/dashboard",
  menuLabel: "Menu",
  generalLabel: "General",
  menuItems: [
    { to: "/dashboard", label: "Dashboard", icon: IconDashboard, end: true },
    { to: "/dashboard/favorites", label: "Saved homes", icon: IconHeart },
    { to: "/dashboard/reservations", label: "Visits", icon: IconCalendar },
    { to: "/dashboard/purchases", label: "Purchases", icon: IconPayments },
    { to: "/dashboard/notifications", label: "Notifications", icon: IconBell },
  ],
  generalItems: [
    { to: "/dashboard/profile", label: "Profile", icon: IconUser },
    { to: "/listings", label: "Browse homes", icon: IconHome, external: true },
  ],
  pages: {
    "/dashboard": {
      title: "Dashboard",
      subtitle: "Your saved homes, visits, and purchases in one place.",
      action: { label: "Browse properties", to: "/listings" },
    },
    "/dashboard/profile": {
      title: "Profile",
      subtitle: "Your account details.",
    },
    "/dashboard/favorites": {
      title: "Saved homes",
      subtitle: "Properties you have saved.",
      action: { label: "Browse properties", to: "/listings" },
    },
    "/dashboard/reservations": {
      title: "Visits",
      subtitle: "Your scheduled property viewings.",
      action: { label: "Browse properties", to: "/listings" },
    },
    "/dashboard/purchases": {
      title: "Purchases",
      subtitle: "Properties you have bought.",
    },
    "/dashboard/notifications": {
      title: "Notifications",
      subtitle: "Your latest updates and alerts.",
    },
  },
};
