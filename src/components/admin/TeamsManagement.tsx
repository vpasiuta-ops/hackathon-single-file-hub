import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Trash2, Edit, UserPlus, Users, Plus, AlertTriangle, Check, ChevronsUpDown, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

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

interface TeamFormData {
  name: string;
  description: string;
  status: string;
  captain_id: string;
  looking_for: string;
  members: string[];
}

interface User {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
}

export default function TeamsManagement() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);
  const [openCombobox, setOpenCombobox] = useState(false);
  const [formData, setFormData] = useState<TeamFormData>({
    name: '',
    description: '',
    status: 'формується',
    captain_id: '',
    looking_for: '',
    members: []
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTeams();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    console.log('TeamsManagement: fetching users...');
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name')
        .order('first_name');

      if (error) throw error;
      console.log('TeamsManagement: users fetched:', data?.length);
      setUsers(data || []);
    } catch (error) {
      console.error('TeamsManagement: Error fetching users:', error);
    }
  };

  const fetchTeams = async () => {
    console.log('TeamsManagement: fetching teams...');
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
      
      console.log('TeamsManagement: teams fetched:', teamsWithCount.length);
      setTeams(teamsWithCount);
    } catch (error) {
      console.error('TeamsManagement: Error fetching teams:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося завантажити список команд',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      status: 'формується',
      captain_id: '',
      looking_for: '',
      members: []
    });
  };

  const handleCreateTeam = async () => {
    console.log('TeamsManagement: creating team with data:', formData);
    try {
      const { data, error } = await supabase.functions.invoke('admin-teams', {
        body: {
          action: 'create',
          teamData: {
            name: formData.name,
            description: formData.description,
            status: formData.status,
            captain_id: formData.captain_id,
            looking_for: formData.looking_for.split(',').map(s => s.trim()).filter(Boolean),
            members: formData.members
          }
        }
      });

      console.log('TeamsManagement: create team response:', data);
      if (error) throw error;
      if (data.error) throw new Error(data.error);

      toast({
        title: 'Успішно',
        description: 'Команду створено'
      });

      setIsCreateModalOpen(false);
      resetForm();
      await fetchTeams();
    } catch (error: any) {
      console.error('TeamsManagement: Error creating team:', error);
      toast({
        title: 'Помилка',
        description: error.message || 'Не вдалося створити команду',
        variant: 'destructive'
      });
    }
  };

  const handleEditTeam = async (team: Team) => {
    // Fetch current team members
    const { data: members } = await supabase
      .from('team_members')
      .select('user_id')
      .eq('team_id', team.id);

    setEditingTeam(team);
    setFormData({
      name: team.name,
      description: team.description,
      status: team.status,
      captain_id: team.captain_id,
      looking_for: team.looking_for?.join(', ') || '',
      members: members?.map(m => m.user_id) || []
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateTeam = async () => {
    if (!editingTeam) return;

    try {
      const { data, error } = await supabase.functions.invoke('admin-teams', {
        body: {
          action: 'update',
          teamData: {
            id: editingTeam.id,
            name: formData.name,
            description: formData.description,
            status: formData.status,
            captain_id: formData.captain_id,
            looking_for: formData.looking_for.split(',').map(s => s.trim()).filter(Boolean),
            members: formData.members
          }
        }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      toast({
        title: 'Успішно',
        description: 'Дані команди оновлено'
      });

      setIsEditModalOpen(false);
      setEditingTeam(null);
      resetForm();
      await fetchTeams();
    } catch (error: any) {
      console.error('Error updating team:', error);
      toast({
        title: 'Помилка',
        description: error.message || 'Не вдалося оновити дані команди',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-teams', {
        body: {
          action: 'delete',
          teamData: { id: teamId }
        }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      toast({
        title: 'Успішно',
        description: 'Команду видалено'
      });

      await fetchTeams();
      setTeamToDelete(null);
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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Керування командами
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Всього команд: {teams.length}
            </p>
          </div>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Створити команду
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Створити нову команду</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Назва команди *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Назва команди"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="captain">Капітан команди *</Label>
                  <Select value={formData.captain_id} onValueChange={(value) => setFormData({...formData, captain_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Оберіть капітана" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.user_id} value={user.user_id}>
                          {user.first_name && user.last_name 
                            ? `${user.first_name} ${user.last_name}`
                            : `ID: ${user.user_id}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Статус</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="формується">Формується</SelectItem>
                      <SelectItem value="готова">Готова</SelectItem>
                      <SelectItem value="зареєстрована">Зареєстрована</SelectItem>
                      <SelectItem value="завершила">Завершила</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="looking_for">Шукають (через кому)</Label>
                  <Input
                    id="looking_for"
                    value={formData.looking_for}
                    onChange={(e) => setFormData({...formData, looking_for: e.target.value})}
                    placeholder="Frontend Developer, Designer"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Учасники команди</Label>
                  <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openCombobox}
                        className="w-full justify-between"
                      >
                        {formData.members.length > 0
                          ? `Обрано ${formData.members.length} учасників`
                          : "Оберіть учасників..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Пошук учасників..." />
                        <CommandEmpty>Учасників не знайдено.</CommandEmpty>
                        <CommandGroup className="max-h-60 overflow-auto">
                          {users.map((user) => (
                            <CommandItem
                              key={user.user_id}
                              onSelect={() => {
                                const isSelected = formData.members.includes(user.user_id);
                                setFormData({
                                  ...formData,
                                  members: isSelected
                                    ? formData.members.filter(id => id !== user.user_id)
                                    : [...formData.members, user.user_id]
                                });
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.members.includes(user.user_id) ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {user.first_name && user.last_name 
                                ? `${user.first_name} ${user.last_name}`
                                : `ID: ${user.user_id}`}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {formData.members.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.members.map((memberId) => {
                        const user = users.find(u => u.user_id === memberId);
                        return (
                          <Badge key={memberId} variant="secondary" className="flex items-center gap-1">
                            {user?.first_name && user?.last_name 
                              ? `${user.first_name} ${user.last_name}`
                              : `ID: ${memberId}`}
                            <X 
                              className="h-3 w-3 cursor-pointer" 
                              onClick={() => setFormData({
                                ...formData,
                                members: formData.members.filter(id => id !== memberId)
                              })}
                            />
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Опис команди *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Опишіть вашу команду..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {setIsCreateModalOpen(false); resetForm();}}>
                  Скасувати
                </Button>
                <Button onClick={handleCreateTeam}>
                  Створити команду
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
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
                  onClick={() => handleEditTeam(team)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Редагувати
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setTeamToDelete(team)}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!teamToDelete} onOpenChange={() => setTeamToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Підтвердження видалення
            </AlertDialogTitle>
            <AlertDialogDescription>
              Ви збираєтесь видалити команду:
              <br />
              <strong>{teamToDelete?.name}</strong>
              <br />
              <br />
              Це дію НЕ МОЖНА СКАСУВАТИ.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Скасувати</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => teamToDelete && handleDeleteTeam(teamToDelete.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Видалити команду
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Team Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Редагувати команду</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit_name">Назва команди *</Label>
              <Input
                id="edit_name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Назва команди"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_captain">Капітан команди *</Label>
              <Select value={formData.captain_id} onValueChange={(value) => setFormData({...formData, captain_id: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Оберіть капітана" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.user_id} value={user.user_id}>
                      {user.first_name && user.last_name 
                        ? `${user.first_name} ${user.last_name}`
                        : `ID: ${user.user_id}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_status">Статус</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="формується">Формується</SelectItem>
                  <SelectItem value="готова">Готова</SelectItem>
                  <SelectItem value="зареєстрована">Зареєстрована</SelectItem>
                  <SelectItem value="завершила">Завершила</SelectItem>
                </SelectContent>
              </Select>
            </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_looking_for">Шукають (через кому)</Label>
                  <Input
                    id="edit_looking_for"
                    value={formData.looking_for}
                    onChange={(e) => setFormData({...formData, looking_for: e.target.value})}
                    placeholder="Frontend Developer, Designer"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Учасники команди</Label>
                  <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openCombobox}
                        className="w-full justify-between"
                      >
                        {formData.members.length > 0
                          ? `Обрано ${formData.members.length} учасників`
                          : "Оберіть учасників..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Пошук учасників..." />
                        <CommandEmpty>Учасників не знайдено.</CommandEmpty>
                        <CommandGroup className="max-h-60 overflow-auto">
                          {users.map((user) => (
                            <CommandItem
                              key={user.user_id}
                              onSelect={() => {
                                const isSelected = formData.members.includes(user.user_id);
                                setFormData({
                                  ...formData,
                                  members: isSelected
                                    ? formData.members.filter(id => id !== user.user_id)
                                    : [...formData.members, user.user_id]
                                });
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.members.includes(user.user_id) ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {user.first_name && user.last_name 
                                ? `${user.first_name} ${user.last_name}`
                                : `ID: ${user.user_id}`}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {formData.members.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.members.map((memberId) => {
                        const user = users.find(u => u.user_id === memberId);
                        return (
                          <Badge key={memberId} variant="secondary" className="flex items-center gap-1">
                            {user?.first_name && user?.last_name 
                              ? `${user.first_name} ${user.last_name}`
                              : `ID: ${memberId}`}
                            <X 
                              className="h-3 w-3 cursor-pointer" 
                              onClick={() => setFormData({
                                ...formData,
                                members: formData.members.filter(id => id !== memberId)
                              })}
                            />
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                </div>
            <div className="space-y-2">
              <Label htmlFor="edit_description">Опис команди *</Label>
              <Textarea
                id="edit_description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Опишіть вашу команду..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {setIsEditModalOpen(false); setEditingTeam(null); resetForm();}}>
              Скасувати
            </Button>
            <Button onClick={handleUpdateTeam}>
              Зберегти зміни
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}