import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Calendar, 
  Users, 
  UserCheck, 
  Trophy, 
  Settings,
  Menu,
  X
} from "lucide-react";
import type { UserRole } from "@/data/mockData";

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const roleLabels: Record<UserRole, string> = {
  participant: 'Учасник',
  captain: 'Капітан команди',
  judge: 'Суддя',
  organizer: 'Організатор',
  guest: 'Гість',
};

const roleColors: Record<UserRole, string> = {
  participant: 'bg-blue-500',
  captain: 'bg-purple-500', 
  judge: 'bg-amber-500',
  organizer: 'bg-green-500',
  guest: 'bg-gray-500',
};

export default function Navigation({ currentPage, onPageChange, currentRole, onRoleChange }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Головна', icon: Home },
    { id: 'hackathons', label: 'Хакатони', icon: Calendar },
    { id: 'participants', label: 'Учасники', icon: Users },
    { id: 'teams', label: 'Команди', icon: UserCheck },
    { id: 'dashboard', label: 'Кабінет', icon: Settings },
    { id: 'leaderboard', label: 'Лідерборд', icon: Trophy },
  ];

  const roles: UserRole[] = ['guest', 'participant', 'captain', 'judge', 'organizer'];

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-md bg-card/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              HackHub
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentPage === item.id ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => onPageChange(item.id)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Role Switcher */}
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-sm text-foreground-secondary">Роль:</span>
            <div className="flex gap-2">
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => onRoleChange(role)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    currentRole === role
                      ? `${roleColors[role]} text-white shadow-md`
                      : 'bg-secondary hover:bg-secondary-hover text-secondary-foreground'
                  }`}
                >
                  {roleLabels[role]}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentPage === item.id ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => {
                      onPageChange(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full justify-start flex items-center gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                );
              })}
              
              {/* Mobile Role Switcher */}
              <div className="pt-4 border-t border-border">
                <div className="text-sm text-foreground-secondary mb-2">Переглянути як:</div>
                <div className="grid grid-cols-2 gap-2">
                  {roles.map((role) => (
                    <button
                      key={role}
                      onClick={() => onRoleChange(role)}
                      className={`px-3 py-2 rounded-md text-xs font-medium transition-all ${
                        currentRole === role
                          ? `${roleColors[role]} text-white shadow-md`
                          : 'bg-secondary hover:bg-secondary-hover text-secondary-foreground'
                      }`}
                    >
                      {roleLabels[role]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}