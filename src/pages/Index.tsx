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
  
  console.log('Index component rendering, current path:', window.location.pathname);
  
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
          <Route path="/admin/login" element={
            <>
              {console.log('AdminLoginPage route matched')}
              <AdminLoginPage />
            </>
          } />
          <Route path="/admin/*" element={
            <>
              {console.log('AdminLayout route matched')}
              <AdminLayout />
            </>
          }>
            <Route index element={<AdminDashboardPage />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
          </Route>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/complete-profile" element={<ProfileCompletionPage />} />
          <Route path="/*" element={
            <>
              {console.log('HackathonApp fallback route matched')}
              <HackathonApp isAuthenticated={false} />
            </>
          } />
        </Routes>
        <Toaster />
      </div>
    </AdminAuthProvider>
  );
};

export default Index;