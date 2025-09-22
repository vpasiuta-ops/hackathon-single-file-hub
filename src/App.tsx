import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import ProfileCompletionPage from "./pages/ProfileCompletionPage";
import NotFound from "./pages/NotFound";
import AdminPage from "./pages/AdminPage";
import { AdminAuthProvider } from "./hooks/useAdminAuth";
import RegistrationPage from "./pages/RegistrationPage";
import TeamDetailPage from "./pages/TeamDetailPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/admin/*" element={
                <AdminAuthProvider>
                  <AdminPage />
                </AdminAuthProvider>
              } />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/complete-profile" element={<ProfileCompletionPage />} />
              <Route path="/register" element={<RegistrationPage />} />
              <Route path="/team/:teamId" element={<TeamDetailPage />} />
              <Route path="/*" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
