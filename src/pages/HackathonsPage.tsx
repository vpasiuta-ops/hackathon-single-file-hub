import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, Plus, Loader2 } from "lucide-react";
import HackathonCard from "@/components/HackathonCard";
import { useHackathons, type DbHackathon } from "@/hooks/useHackathons";
import type { UserRole } from "@/data/mockData";

interface HackathonsPageProps {
  currentRole: UserRole;
  onViewHackathon: (id: string) => void;
}

export default function HackathonsPage({ currentRole, onViewHackathon }: HackathonsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const { hackathons, loading, error } = useHackathons();

  const filteredHackathons = hackathons.filter(hackathon => {
    const matchesSearch = hackathon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hackathon.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || hackathon.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    'Активний': hackathons.filter(h => h.status === 'Активний').length,
    'Майбутній': hackathons.filter(h => h.status === 'Майбутній').length,
    'Завершений': hackathons.filter(h => h.status === 'Завершений').length,
  };

  const handleRegister = (hackathonId: string) => {
    console.log('Register for hackathon:', hackathonId);
    // Тут буде логіка реєстрації
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Хакатони
              </h1>
              <p className="text-foreground-secondary">
                Знайдіть ідеальний хакатон для ваших навичок та інтересів
              </p>
            </div>
            
            {currentRole === 'organizer' && (
              <Button variant="default" size="lg">
                <Plus className="w-4 h-4 mr-2" />
                Створити хакатон
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
                    placeholder="Пошук хакатонів..."
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
                  Всі ({hackathons.length})
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
        {loading ? (
          <Card className="text-center py-12">
            <CardContent>
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-lg text-foreground">Завантажуємо хакатони...</p>
            </CardContent>
          </Card>
        ) : error ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-foreground-secondary mb-4">
                <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg text-red-500">Помилка завантаження</p>
                <p className="text-sm">{error}</p>
              </div>
            </CardContent>
          </Card>
        ) : filteredHackathons.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-foreground-secondary mb-4">
                <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Хакатонів не знайдено</p>
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHackathons.map((hackathon) => (
              <HackathonCard
                key={hackathon.id}
                hackathon={hackathon}
                onViewDetails={onViewHackathon}
                onRegister={handleRegister}
                showActions={currentRole !== 'guest'}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}