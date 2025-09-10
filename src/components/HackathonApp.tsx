import { useState } from "react";
import Navigation from "./Navigation";
import HomePage from "@/pages/HomePage";
import HackathonsPage from "@/pages/HackathonsPage";
import ParticipantsPage from "@/pages/ParticipantsPage";
import TeamsPage from "@/pages/TeamsPage";
import DashboardPage from "@/pages/DashboardPage";
import LeaderboardPage from "@/pages/LeaderboardPage";
import HackathonDetailsPage from "@/pages/HackathonDetailsPage";
import type { UserRole } from "@/data/mockData";

export default function HackathonApp() {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentRole, setCurrentRole] = useState<UserRole>('guest');
  const [selectedHackathonId, setSelectedHackathonId] = useState<number | null>(null);

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    if (page !== 'hackathon-details') {
      setSelectedHackathonId(null);
    }
  };

  const handleViewHackathon = (id: number) => {
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
        return (
          <TeamsPage
            currentRole={currentRole}
          />
        );
      case 'dashboard':
        return (
          <DashboardPage
            currentRole={currentRole}
            onRoleChange={setCurrentRole}
            onPageChange={handlePageChange}
          />
        );
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
    </div>
  );
}