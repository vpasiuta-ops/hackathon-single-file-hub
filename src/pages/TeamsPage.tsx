import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Plus, Users as UsersIcon } from "lucide-react";
import TeamCard from "@/components/TeamCard";
import { teams, users, getTeamMembers } from "@/data/mockData";
import type { UserRole } from "@/data/mockData";

interface TeamsPageProps {
  currentRole: UserRole;
}

export default function TeamsPage({ currentRole }: TeamsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.lookingFor.some(role => role.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = !statusFilter || team.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    'формується': teams.filter(t => t.status === 'формується').length,
    'готова': teams.filter(t => t.status === 'готова').length,
    'учасник хакатону': teams.filter(t => t.status === 'учасник хакатону').length,
  };

  const handleJoinTeam = (teamId: number) => {
    console.log('Join team:', teamId);
    // Тут буде логіка подачі заявки на вступ до команди
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Команди
              </h1>
              <p className="text-foreground-secondary">
                Приєднуйтесь до існуючої команди або створіть свою власну
              </p>
            </div>
            
            {(currentRole === 'participant' || currentRole === 'captain') && (
              <Button variant="default" size="lg">
                <Plus className="w-4 h-4 mr-2" />
                Створити команду
              </Button>
            )}
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-secondary w-4 h-4" />
                  <Input
                    placeholder="Пошук команд..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(null)}
                >
                  Всі ({teams.length})
                </Button>
                {Object.entries(statusCounts).map(([status, count]) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter(status === statusFilter ? null : status)}
                  >
                    {status} ({count})
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {filteredTeams.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-foreground-secondary mb-4">
                <UsersIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Команд не знайдено</p>
                <p className="text-sm">Спробуйте змінити параметри пошуку</p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter(null);
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
                Знайдено {filteredTeams.length} команд
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeams.map((team) => {
                const members = getTeamMembers(team.id);
                const captain = users.find(u => u.id === team.captain)!;
                
                return (
                  <TeamCard
                    key={team.id}
                    team={team}
                    members={members}
                    captain={captain}
                    showJoinAction={currentRole === 'participant' && team.lookingFor.length > 0}
                    onJoinTeam={handleJoinTeam}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}