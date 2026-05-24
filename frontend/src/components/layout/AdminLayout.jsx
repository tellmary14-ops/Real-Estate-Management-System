import DashboardShell from "../dashboard/DashboardShell";
import { adminConfig } from "../dashboard/dashboardConfig";

export default function AdminLayout() {
  return <DashboardShell config={adminConfig} />;
}
