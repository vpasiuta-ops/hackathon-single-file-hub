import { Routes, Route } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Toaster } from "@/components/ui/toaster";
import HackathonApp from "@/components/HackathonApp";
import AuthPage from "@/pages/AuthPage";
import RegistrationPage from "@/pages/RegistrationPage";
import AdminPage from "@/pages/AdminPage";
import ProfileCompletionPage from "@/pages/ProfileCompletionPage";
import { AdminAuthProvider } from "@/hooks/useAdminAuth";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminLoginPage from "@/pages/admin/AdminLoginPage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";

const Index = () => {
  const { loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground-secondary">Завантаження...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminAuthProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/*" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route index element={<AdminDashboardPage />} />
          </Route>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/complete-profile" element={<ProfileCompletionPage />} />
          <Route path="/*" element={<HackathonApp isAuthenticated={false} />} />
        </Routes>
        <Toaster />
      </div>
    </AdminAuthProvider>
  );
};

export default Index;