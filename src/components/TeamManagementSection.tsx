import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings, Edit3, Plus, X, Check, UserPlus, UserMinus } from 'lucide-react';
import { useTeams, type Team } from '@/hooks/useTeams';
import { useToast } from '@/hooks/use-toast';

interface TeamManagementSectionProps {
  team: Team;
  isUserTeamCaptain: boolean;
}

interface TeamApplication {
  id: string;
  user_id: string;
  message: string;
  status: string;
  created_at: string;
  profiles: {
    first_name: string;
    last_name: string;
    bio: string | null;
    skills: string[] | null;
    technologies: string[] | null;
  };
}

export default function TeamManagementSection({ team, isUserTeamCaptain }: TeamManagementSectionProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [applications, setApplications] = useState<TeamApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const { updateTeam, getTeamApplications, respondToApplication } = useTeams();
  const { toast } = useToast();

  const [editData, setEditData] = useState({
    name: team.name,
    description: team.description,
    looking_for: team.looking_for || []
  });
  const [currentRole, setCurrentRole] = useState('');

  const fetchApplications = async () => {
    if (!isUserTeamCaptain) return;
    
    setLoading(true);
    try {
      const apps = await getTeamApplications(team.id);
      setApplications(apps);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [team.id, isUserTeamCaptain]);

  const handleSaveTeam = async () => {
    try {
      const success = await updateTeam(team.id, editData);
      if (success) {
        setEditDialogOpen(false);
        toast({
          title: 'Успішно!',
          description: 'Інформацію про команду оновлено'
        });
      }
    } catch (error) {
      toast({
        title: 'Помилка',
        description: 'Не вдалося оновити команду',
        variant: 'destructive'
      });
    }
  };

  const addRole = () => {
    if (currentRole.trim() && !editData.looking_for.includes(currentRole.trim())) {
      setEditData(prev => ({
        ...prev,
        looking_for: [...prev.looking_for, currentRole.trim()]
      }));
      setCurrentRole('');
    }
  };

  const removeRole = (role: string) => {
    setEditData(prev => ({
      ...prev,
      looking_for: prev.looking_for.filter(r => r !== role)
    }));
  };

  const handleApplicationResponse = async (applicationId: string, status: 'accepted' | 'rejected') => {
    try {
      await respondToApplication(applicationId, status);
      toast({
        title: status === 'accepted' ? 'Заявку прийнято!' : 'Заявку відхилено',
        description: status === 'accepted' ? 'Користувача додано до команди' : 'Заявку відхилено'
      });
      fetchApplications(); // Refresh applications
    } catch (error) {
      toast({
        title: 'Помилка',
        description: 'Не вдалося обробити заявку',
        variant: 'destructive'
      });
    }
  };

  if (!isUserTeamCaptain) {
    return null;
  }

  return (
    <div className="pt-2">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Огляд</TabsTrigger>
          <TabsTrigger value="applications">
            Заявки {applications.length > 0 && `(${applications.length})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Edit3 className="w-4 h-4 mr-2" />
                Редагувати команду
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Редагувати команду</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Назва команди</label>
                  <Input
                    value={editData.name}
                    onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Назва команди"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Опис</label>
                  <Textarea
                    value={editData.description}
                    onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Опис команди"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Шукаємо учасників</label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={currentRole}
                        onChange={(e) => setCurrentRole(e.target.value)}
                        placeholder="Додати роль"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRole())}
                      />
                      <Button onClick={addRole} size="icon" variant="outline">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {editData.looking_for.map((role, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                          {role}
                          <button
                            onClick={() => removeRole(role)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSaveTeam} className="flex-1">
                    Зберегти
                  </Button>
                  <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                    Скасувати
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          {loading ? (
            <div className="text-center py-4">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : applications.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <UserPlus className="w-12 h-12 mx-auto text-foreground-secondary mb-4" />
                <p className="text-foreground-secondary">Поки немає заявок на вступ</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {applications.map((application) => (
                <Card key={application.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <Avatar>
                          <AvatarFallback>
                            {application.profiles.first_name?.[0]}{application.profiles.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium">
                            {application.profiles.first_name} {application.profiles.last_name}
                          </h4>
                          {application.profiles.bio && (
                            <p className="text-sm text-foreground-secondary mt-1">
                              {application.profiles.bio}
                            </p>
                          )}
                          {application.message && (
                            <p className="text-sm mt-2 p-2 bg-secondary/20 rounded">
                              {application.message}
                            </p>
                          )}
                          {application.profiles.skills && application.profiles.skills.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-foreground-secondary mb-1">Навички:</p>
                              <div className="flex flex-wrap gap-1">
                                {application.profiles.skills.map((skill, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {application.profiles.technologies && application.profiles.technologies.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-foreground-secondary mb-1">Технології:</p>
                              <div className="flex flex-wrap gap-1">
                                {application.profiles.technologies.map((tech, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {tech}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApplicationResponse(application.id, 'accepted')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleApplicationResponse(application.id, 'rejected')}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}