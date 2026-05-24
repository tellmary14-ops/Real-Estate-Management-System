import DashboardShell from "../dashboard/DashboardShell";
import { userConfig } from "../dashboard/dashboardConfig";

export default function UserLayout() {
  return <DashboardShell config={userConfig} />;
}
