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
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center min-w-0">
            <div className="text-xl sm:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent truncate">
              HackHub
            </div>
          </div>

          {/* Desktop Menu - Hidden on tablets, shown on large screens */}
          <div className="hidden lg:block">
            <div className="flex items-baseline space-x-2 xl:space-x-4">
              {visibleMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentPage === item.id ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => handleMenuClick(item.id)}
                    className="flex items-center gap-1 xl:gap-2 text-xs xl:text-sm px-2 xl:px-3"
                  >
                    <Icon className="w-3 h-3 xl:w-4 xl:h-4 flex-shrink-0" />
                    <span className="hidden xl:inline truncate">{item.label}</span>
                    <span className="xl:hidden truncate">{item.label.split(' ')[0]}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Tablet Menu - Compact icons only */}
          <div className="hidden md:flex lg:hidden items-center space-x-1">
            {visibleMenuItems.slice(0, 4).map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => handleMenuClick(item.id)}
                  className="p-2"
                  title={item.label}
                >
                  <Icon className="w-4 h-4" />
                </Button>
              );
            })}
          </div>

          {/* Auth & User Info - Responsive */}
          <div className="hidden sm:flex items-center space-x-2 lg:space-x-4 min-w-0">
            {user ? (
              <>
                {/* User Info - Responsive */}
                <div className="flex items-center space-x-1 lg:space-x-2 text-xs lg:text-sm text-foreground min-w-0">
                  <User className="w-3 h-3 lg:w-4 lg:h-4 text-foreground-secondary flex-shrink-0" />
                  <span className="truncate max-w-20 sm:max-w-24 lg:max-w-32">
                    {profile?.first_name && profile?.last_name 
                      ? `${profile.first_name} ${profile.last_name}` 
                      : user.email}
                  </span>
                  <Badge 
                    className={`${getRoleColor(userRole)} text-xs px-1 lg:px-2 cursor-pointer flex-shrink-0`}
                    onClick={refreshProfile}
                    title="Натисніть для оновлення ролі"
                  >
                    <span className="hidden lg:inline">{getRoleLabel(userRole)}</span>
                    <span className="lg:hidden">
                      {userRole === 'captain' ? 'Кап.' : 
                       userRole === 'judge' ? 'Суд.' :
                       userRole === 'admin' ? 'Адм.' : 'Уч.'}
                    </span>
                  </Badge>
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="p-1 lg:px-3 lg:py-2"
                >
                  <LogOut className="w-3 h-3 lg:w-4 lg:h-4 lg:mr-2" />
                  <span className="hidden lg:inline">Вийти</span>
                </Button>
              </>
            ) : (
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => onPageChange('auth')}
                className="p-1 lg:px-3 lg:py-2"
              >
                <LogIn className="w-3 h-3 lg:w-4 lg:h-4 lg:mr-2" />
                <span className="hidden lg:inline">Увійти</span>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            {/* Mobile user indicator */}
            {user && (
              <Badge 
                className={`${getRoleColor(userRole)} text-xs px-1 mr-2 cursor-pointer`}
                onClick={refreshProfile}
                title={getRoleLabel(userRole)}
              >
                {userRole === 'captain' ? 'К' : 
                 userRole === 'judge' ? 'С' :
                 userRole === 'admin' ? 'А' : 'У'}
              </Badge>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>

          {/* Tablet/Medium screen menu button */}
          <div className="md:flex lg:hidden hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-card border-t border-border max-h-screen overflow-y-auto">
            {/* Navigation Items */}
            <div className="space-y-1">
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
                    className="w-full justify-start gap-2 text-left"
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Button>
                );
              })}
            </div>

            {/* Auth Section */}
            <div className="pt-3 mt-3 border-t border-border space-y-2">
              {user ? (
                <>
                  {/* User Info in Mobile */}
                  <div className="px-3 py-2 text-sm text-foreground bg-muted/50 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate font-medium">
                        {profile?.first_name && profile?.last_name 
                          ? `${profile.first_name} ${profile.last_name}` 
                          : user.email}
                      </span>
                    </div>
                    <Badge 
                      className={`${getRoleColor(userRole)} text-xs cursor-pointer`}
                      onClick={refreshProfile}
                      title="Натисніть для оновлення ролі"
                    >
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
                    className="w-full justify-start gap-2"
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