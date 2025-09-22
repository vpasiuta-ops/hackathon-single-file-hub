import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, UserPlus, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Team {
  id: string;
  name: string;
  description: string;
  status: string;
  captain_id: string;
  looking_for: string[] | null;
  created_at: string;
  captain?: {
    first_name: string | null;
    last_name: string | null;
  };
  members_count: number;
}

export default function TeamsManagement() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select(`
          *,
          captain:profiles!teams_captain_id_fkey(first_name, last_name),
          members:team_members(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const teamsWithCount = (data || []).map(team => ({
        ...team,
        members_count: team.members?.[0]?.count || 0
      }));
      
      setTeams(teamsWithCount);
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося завантажити список команд',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    try {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', teamId);

      if (error) throw error;

      toast({
        title: 'Успішно',
        description: 'Команду видалено'
      });

      await fetchTeams();
    } catch (error: any) {
      console.error('Error deleting team:', error);
      toast({
        title: 'Помилка',
        description: error.message || 'Не вдалося видалити команду',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">Завантаження...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Керування командами
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Всього команд: {teams.length}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {teams.map((team) => (
            <div
              key={team.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-medium">{team.name}</h3>
                  <Badge variant="outline">
                    {team.status}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {team.members_count} учасників
                  </div>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p><strong>Капітан:</strong> {
                    team.captain?.first_name && team.captain?.last_name
                      ? `${team.captain.first_name} ${team.captain.last_name}`
                      : 'Не вказано'
                  }</p>
                  <p><strong>Опис:</strong> {team.description}</p>
                  {team.looking_for && team.looking_for.length > 0 && (
                    <p><strong>Шукають:</strong> {team.looking_for.join(', ')}</p>
                  )}
                  <p><strong>Створено:</strong> {new Date(team.created_at).toLocaleDateString('uk-UA')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="mr-2"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Редагувати
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteTeam(team.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Видалити
                </Button>
              </div>
            </div>
          ))}
          
          {teams.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Команди не знайдені
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}