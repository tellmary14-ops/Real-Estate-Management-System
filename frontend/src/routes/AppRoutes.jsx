import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import UserLayout from "../components/layout/UserLayout";
import AdminLayout from "../components/layout/AdminLayout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import HomePage from "../pages/public/HomePage";
import ListingsPage from "../pages/public/ListingsPage";
import PropertyDetailPage from "../pages/public/PropertyDetailPage";
import ContactPage from "../pages/public/ContactPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import UserDashboard from "../pages/user/UserDashboard";
import FavoritesPage from "../pages/user/FavoritesPage";
import ReservationsPage from "../pages/user/ReservationsPage";
import PurchasesPage from "../pages/user/PurchasesPage";
import NotificationsPage from "../pages/user/NotificationsPage";
import ProfilePage from "../pages/user/ProfilePage";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminPropertiesPage from "../pages/admin/AdminPropertiesPage";
import AdminUsersPage from "../pages/admin/AdminUsersPage";
import AdminPaymentsPage from "../pages/admin/AdminPaymentsPage";
import AdminReservationsPage from "../pages/admin/AdminReservationsPage";
import AdminSettingsPage from "../pages/admin/AdminSettingsPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="listings" element={<ListingsPage />} />
        <Route path="listings/:id" element={<PropertyDetailPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      <Route
        path="dashboard"
        element={
          <ProtectedRoute>
            <UserLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<UserDashboard />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path="reservations" element={<ReservationsPage />} />
        <Route path="purchases" element={<PurchasesPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
      </Route>

      <Route
        path="admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="properties" element={<AdminPropertiesPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="reservations" element={<AdminReservationsPage />} />
        <Route path="payments" element={<AdminPaymentsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>
    </Routes>
  );
}
