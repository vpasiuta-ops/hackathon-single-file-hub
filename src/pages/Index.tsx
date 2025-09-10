import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import HackathonApp from "@/components/HackathonApp";

const Index = () => {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  
  // Handle authentication redirects
  if (!loading) {
    if (user && profile && !profile.is_profile_complete) {
      navigate('/complete-profile');
      return null;
    }
    
    if (user && (!profile || profile.is_profile_complete)) {
      return <HackathonApp />;
    }
    
    if (window.location.pathname === '/auth') {
      navigate('/auth');
      return null;
    }
  }
  
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

  return <HackathonApp />;
};

export default Index;