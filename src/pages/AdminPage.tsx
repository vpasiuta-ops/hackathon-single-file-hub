import { Routes, Route } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminLoginPage from '@/pages/admin/AdminLoginPage';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';

export default function AdminPage() {
  console.log('AdminPage: Rendering admin routes');
  return (
    <Routes>
      <Route path="login" element={<AdminLoginPage />} />
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
      </Route>
    </Routes>
  );
}