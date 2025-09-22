import { Routes, Route } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminLoginPage from '@/pages/admin/AdminLoginPage';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';

export default function AdminPage() {
  return (
    <Routes>
      <Route path="login" element={<AdminLoginPage />} />
      <Route element={<AdminLayout />}>
        <Route path="/" element={<AdminDashboardPage />} />
      </Route>
    </Routes>
  );
}