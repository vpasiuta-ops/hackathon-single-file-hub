import { Routes, Route } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Toaster } from "@/components/ui/toaster";
import HackathonApp from "@/components/HackathonApp";
import AuthPage from "@/pages/AuthPage";
import RegistrationPage from "@/pages/RegistrationPage";
import AdminPage from "@/pages/AdminPage";
import ProfileCompletionPage from "@/pages/ProfileCompletionPage";
import { AdminAuthProvider } from "@/hooks/useAdminAuth";

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
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/complete-profile" element={<ProfileCompletionPage />} />
          <Route path="*" element={<HackathonApp isAuthenticated={false} />} />
        </Routes>
        <Toaster />
      </div>
    </AdminAuthProvider>
  );
};

export default Index;