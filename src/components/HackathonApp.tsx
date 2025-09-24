import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Navigation from "./Navigation";
import HomePage from "@/pages/HomePage";
import HackathonsPage from "@/pages/HackathonsPage";
import ParticipantsPage from "@/pages/ParticipantsPage";
import TeamsPage from "@/pages/TeamsPage";
import TeamDetailPage from "@/pages/TeamDetailPage";
import ProfilePage from "@/pages/ProfilePage";
import LeaderboardPage from "@/pages/LeaderboardPage";
import HackathonDetailsPage from "@/pages/HackathonDetailsPage";
import RegistrationPage from "@/pages/RegistrationPage";
import AdminPage from "@/pages/AdminPage";
import { useAuth } from "@/hooks/useAuth";
import type { UserRole } from "@/data/mockData";

interface HackathonAppProps {
  isAuthenticated: boolean;
}

export default function HackathonApp({ isAuthenticated }: HackathonAppProps) {
  // Check if current route is registration page
  const isRegistrationPage = window.location.pathname.startsWith('/register');
  
  // If on registration page, render only the registration component
  if (isRegistrationPage) {
    return <RegistrationPage />;
  }
  
  // Start with correct page based on auth status
  const [currentPage, setCurrentPage] = useState(isAuthenticated ? 'hackathons' : 'home');
  const [currentRole, setCurrentRole] = useState<UserRole>('guest');
  const [selectedHackathonId, setSelectedHackathonId] = useState<string | null>(null);
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  // Handle authentication redirects
  useEffect(() => {
    if (loading) return;
    
    if (user && profile && !profile.is_profile_complete) {
      navigate('/complete-profile');
      return;
    }
    
    // Redirect unauthenticated users trying to access protected routes
    if (!user && currentPage !== 'home') {
      navigate('/auth');
      return;
    }
  }, [user, profile, loading, currentPage, navigate]);

  const handlePageChange = (page: string) => {
    // Check if user is authenticated for protected routes
    if (!user && page !== 'home') {
      navigate('/auth');
      return;
    }
    
    setCurrentPage(page);
    if (page !== 'hackathon-details') {
      setSelectedHackathonId(null);
    }
  };

  const handleViewTeam = (teamId: string) => {
    navigate(`/team/${teamId}`);
  };

  const handleViewHackathon = (id: string) => {
    // Check if user is authenticated
    if (!user) {
      navigate('/auth');
      return;
    }
    
    setSelectedHackathonId(id);
    setCurrentPage('hackathon-details');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage 
            currentRole={currentRole}
            onPageChange={handlePageChange}
            onViewHackathon={handleViewHackathon}
          />
        );
      case 'hackathons':
        return (
          <HackathonsPage
            currentRole={currentRole}
            onViewHackathon={handleViewHackathon}
          />
        );
      case 'participants':
        return (
          <ParticipantsPage
            currentRole={currentRole}
          />
        );
      case 'teams':
        return <TeamsPage />;
      case 'team-detail':
        return <TeamDetailPage />;
      case 'admin':
        return <AdminPage />;
      case 'dashboard':
        return <ProfilePage />;
      case 'leaderboard':
        return (
          <LeaderboardPage
            currentRole={currentRole}
          />
        );
      case 'hackathon-details':
        return (
          <HackathonDetailsPage
            hackathonId={selectedHackathonId}
            currentRole={currentRole}
            onBack={() => handlePageChange('hackathons')}
          />
        );
      default:
        return (
          <HomePage 
            currentRole={currentRole}
            onPageChange={handlePageChange}
            onViewHackathon={handleViewHackathon}
          />
        );
    }
  };

  // Show loading state
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
    <div className="min-h-screen bg-background text-foreground">
      <Navigation
        currentPage={currentPage}
        onPageChange={handlePageChange}
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
      />
      <main>
        {renderCurrentPage()}
      </main>
      <Toaster />
    </div>
  );
}