import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Crown, 
  Users, 
  Plus,
  Phone,
  Mail,
  Edit,
  ExternalLink,
  MapPin,
  Briefcase,
  Target,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTeams } from '@/hooks/useTeams';
import CreateTeamDialog from '@/components/CreateTeamDialog';
import TeamManagementSection from '@/components/TeamManagementSection';
import { useNavigate } from 'react-router-dom';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { useState } from 'react';

export default function ProfilePage() {
  const { user, profile } = useAuth();
  const { userTeam, isUserTeamCaptain, loading: teamsLoading, leaveTeam } = useTeams();
  const navigate = useNavigate();
  const [isLeavingTeam, setIsLeavingTeam] = useState(false);

  const getUserInitials = () => {
    const firstName = profile?.first_name || '';
    const lastName = profile?.last_name || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  };

  const getUserFullName = () => {
    return `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'Користувач';
  };

  const getExperienceLevel = () => {
    const levels = {
      'beginner': 'Початковий',
      'intermediate': 'Середній',
      'advanced': 'Досвідчений'
    };
    return levels[profile?.experience_level as keyof typeof levels] || profile?.experience_level;
  };

  const getParticipationStatus = () => {
    const statuses = {
      'looking_for_team': 'Шукаю команду',
      'have_team': 'У мене вже є команда'
    };
    return statuses[profile?.participation_status as keyof typeof statuses] || profile?.participation_status;
  };

  const handleLeaveTeam = async () => {
    setIsLeavingTeam(true);
    await leaveTeam();
    setIsLeavingTeam(false);
  };

  if (!user || !profile) {
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
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">Мій профіль</h1>
          <Button 
            variant="outline"
            onClick={() => navigate('/create-profile')}
          >
            <Edit className="w-4 h-4 mr-2" />
            Редагувати профіль
          </Button>
        </div>

        <div className="space-y-6">
          {/* Основна інформація */}
          <Card>
            <CardHeader>
              <CardTitle>Основна інформація</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="" alt={getUserFullName()} />
                  <AvatarFallback className="text-lg">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      {getUserFullName()}
                    </h3>
                    {profile.experience_level && (
                      <Badge variant="secondary" className="mb-2">
                        {getExperienceLevel()}
                      </Badge>
                    )}
                    {profile.participation_status && (
                      <div className="flex items-center gap-2 text-sm text-foreground-secondary">
                        <Users className="w-4 h-4" />
                        {getParticipationStatus()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Контактна інформація */}
          <Card>
            <CardHeader>
              <CardTitle>Контактна інформація</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-foreground-secondary" />
                  <span>{user.email}</span>
                </div>
                
                {profile.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-foreground-secondary" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                
                {profile.portfolio_url && (
                  <div className="flex items-center gap-2 text-sm">
                    <ExternalLink className="w-4 h-4 text-foreground-secondary" />
                    <a 
                      href={profile.portfolio_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Портфоліо / GitHub / LinkedIn
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Професійна інформація */}
          <Card>
            <CardHeader>
              <CardTitle>Професійна інформація</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {profile.roles && profile.roles.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Ролі
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.roles.map((role, index) => (
                        <Badge key={index} variant="outline">{role}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {profile.skills && profile.skills.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Навички</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {profile.bio && (
                  <div>
                    <h4 className="font-medium mb-2">Коротко про себе</h4>
                    <p className="text-foreground-secondary">{profile.bio}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Додаткова інформація */}
          {(profile.ready_to_lead !== null || profile.location || (profile.interested_categories && profile.interested_categories.length > 0) || profile.looking_for_roles?.length || profile.team_description) && (
            <Card>
              <CardHeader>
                <CardTitle>Додаткова інформація</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profile.ready_to_lead !== null && (
                    <div className="flex items-center gap-2 text-sm">
                      <Crown className="w-4 h-4 text-foreground-secondary" />
                      <span>Готовність бути капітаном: {profile.ready_to_lead ? 'Так' : 'Ні'}</span>
                    </div>
                  )}
                  
                  {profile.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-foreground-secondary" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  
                  {profile.looking_for_roles && profile.looking_for_roles.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Шукає в команду</h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.looking_for_roles.map((role, index) => (
                          <Badge key={index} variant="outline">{role}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {profile.team_description && (
                    <div className="flex items-start gap-2 text-sm">
                      <Target className="w-4 h-4 text-foreground-secondary mt-1" />
                      <div>
                        <div className="font-medium mb-1">Опис команди</div>
                        <div className="text-foreground-secondary">{profile.team_description}</div>
                      </div>
                    </div>
                  )}
                  
                  {profile.interested_categories && profile.interested_categories.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Бажані кейси для роботи</h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.interested_categories.map((category, index) => (
                          <Badge key={index} variant="outline">{category}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Team Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Статус команди
            </CardTitle>
          </CardHeader>
          <CardContent>
            {teamsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : userTeam ? (
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      {isUserTeamCaptain && <Crown className="w-5 h-5 text-amber-500" />}
                      {userTeam.name}
                    </h3>
                    <p className="text-sm text-foreground-secondary mb-2">
                      {isUserTeamCaptain ? 'Ви капітан цієї команди' : 'Ви учасник цієї команди'}
                    </p>
                    <p className="text-foreground-secondary">{userTeam.description}</p>
                  </div>
                  <Badge className={`
                    ${userTeam.status === 'формується' ? 'bg-amber-500' : 
                      userTeam.status === 'готова' ? 'bg-green-500' : 'bg-blue-500'} 
                    text-white
                  `}>
                    {userTeam.status}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Учасники ({userTeam.member_count || 1})</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        {userTeam.captain?.first_name} {userTeam.captain?.last_name} (Капітан)
                      </Badge>
                      {userTeam.members?.map((member, index) => (
                        <Badge key={index} variant="outline">
                          {member.first_name} {member.last_name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {userTeam.looking_for && userTeam.looking_for.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Шукаємо</h4>
                      <div className="flex flex-wrap gap-1">
                        {userTeam.looking_for.map((role, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {isUserTeamCaptain && userTeam && (
                    <TeamManagementSection team={userTeam} isUserTeamCaptain={isUserTeamCaptain} />
                  )}

                  {/* Leave team button for regular members and captains */}
                  <div className="pt-3 border-t">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                          disabled={isLeavingTeam}
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          {isLeavingTeam ? 'Виходжу...' : 'Вийти з команди'}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Вийти з команди?</AlertDialogTitle>
                          <AlertDialogDescription>
                            {isUserTeamCaptain 
                              ? userTeam.members && userTeam.members.length > 0
                                ? `Ви впевнені, що хочете вийти з команди "${userTeam.name}"? Капітанство буде передано ${userTeam.members[0]?.first_name} ${userTeam.members[0]?.last_name}.`
                                : `Ви впевнені, що хочете вийти з команди "${userTeam.name}"? Команда буде розформована, оскільки ви єдиний учасник.`
                              : `Ви впевнені, що хочете вийти з команди "${userTeam.name}"?`
                            }
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Скасувати</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={handleLeaveTeam}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Так, вийти
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 mx-auto text-foreground-secondary mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Ви поки не в команді
                </h3>
                <p className="text-foreground-secondary mb-4">
                  Створіть команду або приєднуйтесь до існуючої
                </p>
                <div className="flex gap-3 justify-center">
                  <CreateTeamDialog>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Створити команду
                    </Button>
                  </CreateTeamDialog>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}