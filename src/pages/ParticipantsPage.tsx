import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, UserPlus } from "lucide-react";
import UserCard from "@/components/UserCard";
import { useProfiles } from "@/hooks/useProfiles";
import type { Profile } from "@/hooks/useProfiles";

interface ParticipantsPageProps {
  currentRole?: string;
}

export default function ParticipantsPage({ currentRole }: ParticipantsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [skillFilter, setSkillFilter] = useState<string | null>(null);
  
  const { profiles, loading, error } = useProfiles();

  const filteredProfiles = profiles.filter(profile => {
    const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(' ').toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         (profile.skills || []).some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = !statusFilter || profile.participation_status === statusFilter;
    const matchesSkill = !skillFilter || (profile.skills || []).includes(skillFilter);
    return matchesSearch && matchesStatus && matchesSkill;
  });

  const statusCounts = {
    'looking_for_team': profiles.filter(p => p.participation_status === 'looking_for_team').length,
    'in_team': profiles.filter(p => p.participation_status === 'in_team').length,
    'ready': profiles.filter(p => p.participation_status === 'ready').length,
  };

  const statusLabels = {
    'looking_for_team': 'шукаю команду',
    'in_team': 'в команді', 
    'ready': 'готовий',
  };

  // Отримуємо всі унікальні навички
  const allSkills = [...new Set(profiles.flatMap(profile => profile.skills || []))];

  const handleInviteToTeam = (userId: string) => {
    console.log('Invite user to team:', userId);
    // Тут буде логіка запрошення в команду
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-foreground-secondary">Завантаження учасників...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <UserPlus className="w-12 h-12 mx-auto mb-4 text-foreground-secondary opacity-50" />
            <p className="text-lg text-foreground mb-2">Помилка завантаження</p>
            <p className="text-sm text-foreground-secondary">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Учасники
          </h1>
          <p className="text-foreground-secondary">
            Знайдіть талановитих розробників для вашої команди
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-secondary w-4 h-4" />
                <Input
                  placeholder="Пошук за ім'ям або навичками..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Статус</h4>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={statusFilter === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter(null)}
                  >
                    Всі ({profiles.length})
                  </Button>
                  {Object.entries(statusCounts).map(([status, count]) => (
                    <Button
                      key={status}
                      variant={statusFilter === status ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStatusFilter(status === statusFilter ? null : status)}
                    >
                      {statusLabels[status as keyof typeof statusLabels]} ({count})
                    </Button>
                  ))}
                </div>
              </div>

              {/* Skills Filter */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Навички</h4>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  <Button
                    variant={skillFilter === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSkillFilter(null)}
                  >
                    Всі навички
                  </Button>
                  {allSkills.slice(0, 15).map((skill) => (
                    <Button
                      key={skill}
                      variant={skillFilter === skill ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSkillFilter(skill === skillFilter ? null : skill)}
                    >
                      {skill}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {filteredProfiles.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-foreground-secondary mb-4">
                <UserPlus className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Учасників не знайдено</p>
                <p className="text-sm">Спробуйте змінити параметри пошуку</p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter(null);
                  setSkillFilter(null);
                }}
              >
                Очистити фільтри
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-foreground-secondary">
                Знайдено {filteredProfiles.length} учасників
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProfiles.map((profile) => (
                <UserCard
                  key={profile.id}
                  profile={profile}
                  showTeamActions={currentRole === 'captain'}
                  onInviteToTeam={handleInviteToTeam}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}