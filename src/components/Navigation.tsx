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
  X,
  User,
  LogIn,
  LogOut
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useRefreshProfile } from "@/hooks/useRefreshProfile";
import type { UserRole } from "@/types/auth";
import { getRoleLabel, getRoleColor } from "@/types/auth";

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export default function Navigation({ currentPage, onPageChange }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, profile, userRole, signOut } = useAuth();
  const { toast } = useToast();
  const { refreshProfile } = useRefreshProfile();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: 'Успішно',
        description: 'Ви вийшли з системи',
      });
    } catch (error) {
      toast({
        title: 'Помилка',
        description: 'Не вдалося вийти з системи',
        variant: 'destructive'
      });
    }
  };

  const menuItems = [
    { id: 'home', label: 'Головна', icon: Home, public: true },
    { id: 'hackathons', label: 'Хакатони', icon: Calendar, public: false },
    { id: 'participants', label: 'Учасники', icon: Users, public: false },
    { id: 'teams', label: 'Команди', icon: UserCheck, public: false },
    { id: 'dashboard', label: 'Профіль', icon: User, public: false },
    { id: 'leaderboard', label: 'Лідерборд', icon: Trophy, public: false },
    { id: 'judging', label: 'Кабінет судді', icon: Settings, public: false, roles: ['judge'] },
  ];

  // Filter menu items based on authentication status and user role
  const visibleMenuItems = user 
    ? menuItems.filter(item => {
        if (item.roles && item.roles.length > 0) {
          return item.roles.includes(userRole);
        }
        return true;
      })
    : menuItems.filter(item => item.public);

  const handleMenuClick = (itemId: string) => {
    if (itemId === 'judging') {
      // Navigate to /judging route
      window.location.href = '/judging';
      return;
    }
    onPageChange(itemId);
  };

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
              {visibleMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentPage === item.id ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => handleMenuClick(item.id)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Auth & User Info */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-2 text-sm text-foreground">
                  <User className="w-4 h-4 text-foreground-secondary" />
                  <span>{profile?.first_name && profile?.last_name 
                    ? `${profile.first_name} ${profile.last_name}` 
                    : user.email}</span>
                  <Badge 
                    className={getRoleColor(userRole)}
                    onClick={refreshProfile}
                    style={{ cursor: 'pointer' }}
                    title="Натисніть для оновлення ролі"
                  >
                    {getRoleLabel(userRole)}
                  </Badge>
                </div>

                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Вийти
                </Button>
              </>
            ) : (
              <Button variant="default" size="sm" onClick={() => onPageChange('auth')}>
                <LogIn className="w-4 h-4 mr-2" />
                Увійти
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-card border-t border-border">
            {visibleMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => {
                    handleMenuClick(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-start gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Button>
              );
            })}

            {/* Mobile Auth Section */}
            <div className="pt-4 mt-4 border-t border-border">
              {user ? (
                <>
                  <div className="px-3 py-2 text-sm text-foreground">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4" />
                      <span>{profile?.first_name && profile?.last_name 
                        ? `${profile.first_name} ${profile.last_name}` 
                        : user.email}</span>
                    </div>
                    <Badge className={getRoleColor(userRole)}>
                      {getRoleLabel(userRole)}
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full justify-start gap-2 mt-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Вийти
                  </Button>
                </>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => {
                    onPageChange('auth');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-start gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Увійти
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}