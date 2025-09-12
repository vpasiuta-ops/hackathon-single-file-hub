import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Users, Crown, UserPlus } from 'lucide-react';
import { useTeams, type Team } from '@/hooks/useTeams';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function TeamDetailPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { applyToTeam, userTeam } = useTeams();
  const { toast } = useToast();
  
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);

  const fetchTeam = async () => {
    if (!teamId) return;
    
    const { data, error } = await supabase
      .from('teams')
      .select(`
        *,
        captain:profiles!teams_captain_id_fkey(first_name, last_name),
        team_members(
          user_id,
          profiles!team_members_user_id_fkey(first_name, last_name)
        )
      `)
      .eq('id', teamId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching team:', error);
      return;
    }

    if (data) {
      const teamWithMembers = {
        ...data,
        members: data.team_members?.map((member: any) => ({
          user_id: member.user_id,
          first_name: member.profiles.first_name,
          last_name: member.profiles.last_name,
        })) || [],
        member_count: (data.team_members?.length || 0) + 1, // +1 for captain
      };
      
      setTeam(teamWithMembers);
    }
  };

  const checkUserApplication = async () => {
    if (!user || !teamId) return;
    
    const { data, error } = await supabase
      .from('team_applications')
      .select('id, status')
      .eq('team_id', teamId)
      .eq('user_id', user.id)
      .maybeSingle();
      
    if (!error && data) {
      setHasApplied(true);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchTeam(), checkUserApplication()]);
      setLoading(false);
    };
    
    init();
  }, [teamId, user]);

  const handleApply = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!teamId) return;

    try {
      await applyToTeam(teamId);
      setHasApplied(true);
      toast({
        title: 'Заявку надіслано!',
        description: 'Ваша заявка відправлена капітану команди'
      });
    } catch (error) {
      toast({
        title: 'Помилка',
        description: 'Не вдалося надіслати заявку',
        variant: 'destructive'
      });
    }
  };

  const statusColors: Record<string, string> = {
    'формується': 'bg-amber-500',
    'готова': 'bg-green-500',
    'учасник хакатону': 'bg-blue-500',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-foreground-secondary">Завантаження...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-foreground-secondary">Команду не знайдено</p>
            <Button variant="outline" onClick={() => navigate('/teams')} className="mt-4">
              Повернутися до каталогу
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const canApply = user && !userTeam && !hasApplied && team.looking_for && team.looking_for.length > 0;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/teams')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад до каталогу
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {team.name}
              </h1>
              <div className="flex items-center gap-3 mb-4">
                <Badge 
                  variant="secondary" 
                  className={`${statusColors[team.status || 'формується']} text-white border-none`}
                >
                  {team.status || 'формується'}
                </Badge>
                <div className="flex items-center text-sm text-foreground-secondary">
                  <Users className="w-4 h-4 mr-1" />
                  {team.member_count} учасників
                </div>
              </div>
            </div>
            
            {canApply && (
              <Button size="lg" onClick={handleApply}>
                <UserPlus className="w-4 h-4 mr-2" />
                Подати заявку
              </Button>
            )}
            
            {hasApplied && (
              <Button size="lg" disabled>
                Заявку надіслано
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Про команду</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground-secondary leading-relaxed">
                  {team.description}
                </p>
              </CardContent>
            </Card>

            {/* Looking for */}
            {team.looking_for && team.looking_for.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Шукаємо учасників</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {team.looking_for.map((role, index) => (
                      <Badge key={index} variant="outline">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Captain */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  Капітан команди
                </CardTitle>
              </CardHeader>
              <CardContent>
                {team.captain && (
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {team.captain.first_name?.[0]}{team.captain.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {team.captain.first_name} {team.captain.last_name}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Members */}
            {team.members && team.members.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Учасники ({team.members.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {team.members.map((member) => (
                    <div key={member.user_id} className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {member.first_name?.[0]}{member.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {member.first_name} {member.last_name}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}