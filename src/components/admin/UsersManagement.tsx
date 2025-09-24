import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Trash2, Edit, AlertTriangle, Users, UserPlus, Phone, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
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

interface UserProfile {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  bio: string | null;
  skills: string[] | null;
  roles: string[] | null;
  experience_level: string | null;
  participation_status: string | null;
  is_profile_complete: boolean;
  created_at: string;
  [key: string]: any;
}

interface UserFormData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  telegram: string;
  discord: string;
  participation_status: string;
  roles: string;
  skills: string;
  technologies: string;
  experience_level: string;
  portfolio_url: string;
  bio: string;
  location: string;
  ready_to_lead: boolean;
  interested_categories: string;
  existing_team_name: string;
  looking_for_roles: string;
  team_description: string;
}

export default function UsersManagement() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    telegram: '',
    discord: '',
    participation_status: 'looking_for_team',
    roles: '',
    skills: '',
    technologies: '',
    experience_level: 'intermediate',
    portfolio_url: '',
    bio: '',
    location: '',
    ready_to_lead: false,
    interested_categories: '',
    existing_team_name: '',
    looking_for_roles: '',
    team_description: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers((data || []) as unknown as UserProfile[]);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося завантажити список користувачів',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setDeletingUserId(userId);
    
    try {
      const { data, error } = await supabase.functions.invoke('delete-user-completely', {
        body: { userId }
      });

      if (error) throw error;

      toast({
        title: 'Успішно',
        description: 'Користувача повністю видалено з системи'
      });

      await fetchUsers();
      setUserToDelete(null);
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Помилка',
        description: error.message || 'Не вдалося видалити користувача',
        variant: 'destructive'
      });
    } finally {
      setDeletingUserId(null);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      phone: '',
      telegram: '',
      discord: '',
      participation_status: 'looking_for_team',
      roles: '',
      skills: '',
      technologies: '',
      experience_level: 'intermediate',
      portfolio_url: '',
      bio: '',
      location: '',
      ready_to_lead: false,
      interested_categories: '',
      existing_team_name: '',
      looking_for_roles: '',
      team_description: ''
    });
  };

  const handleCreateUser = async () => {
    try {
      // Create user in auth with email confirmation disabled
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: formData.email,
        password: formData.password,
        email_confirm: true, // Skip email confirmation
        user_metadata: {
          first_name: formData.first_name,
          last_name: formData.last_name
        }
      });

      if (authError) throw authError;

      // Create complete profile
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone: formData.phone || null,
            bio: formData.bio || null,
            skills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : null,
            technologies: formData.technologies ? formData.technologies.split(',').map(s => s.trim()).filter(Boolean) : null,
            roles: formData.roles ? formData.roles.split(',').map(s => s.trim()).filter(Boolean) : null,
            experience_level: formData.experience_level,
            participation_status: formData.participation_status,
            portfolio_url: formData.portfolio_url || null,
            location: formData.location || null,
            ready_to_lead: formData.ready_to_lead,
            interested_categories: formData.interested_categories ? formData.interested_categories.split(',').map(s => s.trim()).filter(Boolean) : null,
            existing_team_name: formData.participation_status === 'has_team' ? formData.existing_team_name : null,
            looking_for_roles: formData.participation_status === 'has_team' && formData.looking_for_roles 
              ? formData.looking_for_roles.split(',').map(s => s.trim()).filter(Boolean) : null,
            team_description: formData.participation_status === 'has_team' ? formData.team_description : null,
            is_profile_complete: true
          })
          .eq('user_id', authData.user.id);

        if (profileError) throw profileError;
      }

      toast({
        title: 'Успішно',
        description: `Користувача ${formData.first_name} ${formData.last_name} успішно створено`
      });

      setIsCreateModalOpen(false);
      resetForm();
      await fetchUsers();
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast({
        title: 'Помилка',
        description: error.message || 'Не вдалося створити користувача',
        variant: 'destructive'
      });
    }
  };

  const handleEditUser = (user: UserProfile) => {
    setEditingUser(user);
    setFormData({
      email: '',
      password: '',
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      phone: user.phone || '',
      telegram: user.telegram || '',
      discord: user.discord || '',
      participation_status: user.participation_status || 'looking_for_team',
      roles: user.roles?.join(', ') || '',
      skills: user.skills?.join(', ') || '',
      technologies: user.technologies?.join(', ') || '',
      experience_level: user.experience_level || 'intermediate',
      portfolio_url: user.portfolio_url || '',
      bio: user.bio || '',
      location: user.location || '',
      ready_to_lead: user.ready_to_lead || false,
      interested_categories: user.interested_categories?.join(', ') || '',
      existing_team_name: user.existing_team_name || '',
      looking_for_roles: user.looking_for_roles?.join(', ') || '',
      team_description: user.team_description || ''
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async () => {
    console.log('UsersManagement: updating user with data:', formData);
    if (!editingUser) return;

    try {
      // Update profile data
      console.log('UsersManagement: updating profile for user:', editingUser.user_id);
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone || null,
          bio: formData.bio || null,
          skills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : null,
          technologies: formData.technologies ? formData.technologies.split(',').map(s => s.trim()).filter(Boolean) : null,
          roles: formData.roles ? formData.roles.split(',').map(s => s.trim()).filter(Boolean) : null,
          experience_level: formData.experience_level,
          participation_status: formData.participation_status,
          portfolio_url: formData.portfolio_url || null,
          location: formData.location || null,
          ready_to_lead: formData.ready_to_lead,
          interested_categories: formData.interested_categories ? formData.interested_categories.split(',').map(s => s.trim()).filter(Boolean) : null,
          existing_team_name: formData.participation_status === 'has_team' ? formData.existing_team_name : null,
          looking_for_roles: formData.participation_status === 'has_team' && formData.looking_for_roles 
            ? formData.looking_for_roles.split(',').map(s => s.trim()).filter(Boolean) : null,
          team_description: formData.participation_status === 'has_team' ? formData.team_description : null,
          is_profile_complete: true
        })
        .eq('user_id', editingUser.user_id);

      if (error) throw error;

      console.log('UsersManagement: user updated successfully');
      toast({
        title: 'Успішно',
        description: 'Профіль користувача оновлено'
      });

      setIsEditModalOpen(false);
      setEditingUser(null);
      resetForm();
      await fetchUsers();
    } catch (error: any) {
      console.error('UsersManagement: Error updating user:', error);
      toast({
        title: 'Помилка',
        description: error.message || 'Не вдалося оновити профіль користувача',
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
              <Users className="h-5 w-5" />
              Керування користувачами
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Всього користувачів: {users.length}
            </p>
          </div>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Створити користувача
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Створити нового користувача</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                {/* Обов'язкові поля */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Обов'язкові поля</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="email@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Пароль *</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        placeholder="Мінімум 6 символів"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="first_name">Ім'я *</Label>
                      <Input
                        id="first_name"
                        value={formData.first_name}
                        onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                        placeholder="Ім'я"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name">Прізвище *</Label>
                      <Input
                        id="last_name"
                        value={formData.last_name}
                        onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                        placeholder="Прізвище"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Телефон</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+380..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telegram">Telegram</Label>
                      <Input
                        id="telegram"
                        value={formData.telegram}
                        onChange={(e) => setFormData({...formData, telegram: e.target.value})}
                        placeholder="@username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="discord">Discord</Label>
                      <Input
                        id="discord"
                        value={formData.discord}
                        onChange={(e) => setFormData({...formData, discord: e.target.value})}
                        placeholder="username#1234"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="participation_status">Статус участі *</Label>
                      <Select value={formData.participation_status} onValueChange={(value) => setFormData({...formData, participation_status: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="looking_for_team">Шукаю команду</SelectItem>
                          <SelectItem value="has_team">Маю команду</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="roles">Ролі *</Label>
                      <Input
                        id="roles"
                        value={formData.roles}
                        onChange={(e) => setFormData({...formData, roles: e.target.value})}
                        placeholder="Frontend Developer, UI/UX Designer"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="skills">Навички *</Label>
                      <Input
                        id="skills"
                        value={formData.skills}
                        onChange={(e) => setFormData({...formData, skills: e.target.value})}
                        placeholder="React, TypeScript, Figma"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="technologies">Технології</Label>
                      <Input
                        id="technologies"
                        value={formData.technologies}
                        onChange={(e) => setFormData({...formData, technologies: e.target.value})}
                        placeholder="Python, Docker, AWS"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience_level">Рівень досвіду *</Label>
                      <Select value={formData.experience_level} onValueChange={(value) => setFormData({...formData, experience_level: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Початковий</SelectItem>
                          <SelectItem value="intermediate">Середній</SelectItem>
                          <SelectItem value="advanced">Досвідчений</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="portfolio_url">Посилання на профіль/портфоліо *</Label>
                      <Input
                        id="portfolio_url"
                        value={formData.portfolio_url}
                        onChange={(e) => setFormData({...formData, portfolio_url: e.target.value})}
                        placeholder="https://github.com/username або https://linkedin.com/in/username"
                      />
                    </div>
                  </div>
                </div>

                {/* Необов'язкові поля */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Необов'язкові поля</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Локація</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        placeholder="Київ, Україна"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="interested_categories">Цікаві категорії</Label>
                      <Input
                        id="interested_categories"
                        value={formData.interested_categories}
                        onChange={(e) => setFormData({...formData, interested_categories: e.target.value})}
                        placeholder="держсервіси, освіта, медіа"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Готовність бути капітаном</Label>
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="ready_to_lead"
                            checked={formData.ready_to_lead === true}
                            onChange={() => setFormData({...formData, ready_to_lead: true})}
                          />
                          <span>Так</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="ready_to_lead"
                            checked={formData.ready_to_lead === false}
                            onChange={() => setFormData({...formData, ready_to_lead: false})}
                          />
                          <span>Ні</span>
                        </label>
                      </div>
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="bio">Коротко про себе</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        placeholder="Розкажіть про себе..."
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                {/* Поля для команди */}
                {formData.participation_status === 'has_team' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Інформація про команду</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="existing_team_name">Назва команди</Label>
                        <Input
                          id="existing_team_name"
                          value={formData.existing_team_name}
                          onChange={(e) => setFormData({...formData, existing_team_name: e.target.value})}
                          placeholder="Назва вашої команди"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="looking_for_roles">Шукають ролі</Label>
                        <Input
                          id="looking_for_roles"
                          value={formData.looking_for_roles}
                          onChange={(e) => setFormData({...formData, looking_for_roles: e.target.value})}
                          placeholder="Data Scientist, Frontend Developer"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="team_description">Опис команди</Label>
                        <Textarea
                          id="team_description"
                          value={formData.team_description}
                          onChange={(e) => setFormData({...formData, team_description: e.target.value})}
                          placeholder="Коротко про команду та її проект"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {setIsCreateModalOpen(false); resetForm();}}>
                  Скасувати
                </Button>
                <Button onClick={handleCreateUser}>
                  Створити користувача
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-medium">
                    {user.first_name && user.last_name 
                      ? `${user.first_name} ${user.last_name}`
                      : 'Без імені'
                    }
                  </h3>
                  <Badge variant={user.is_profile_complete ? 'default' : 'secondary'}>
                    {user.is_profile_complete ? 'Профіль завершено' : 'Профіль не завершено'}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p><strong>ID:</strong> {user.user_id}</p>
                  <p><strong>Статус:</strong> {user.participation_status || 'Не вказано'}</p>
                  {user.phone && <p><strong>Телефон:</strong> {user.phone}</p>}
                  {user.telegram && <p><strong>Telegram:</strong> {user.telegram}</p>}
                  {user.roles && user.roles.length > 0 && (
                    <p><strong>Ролі:</strong> {user.roles.join(', ')}</p>
                  )}
                  {user.skills && user.skills.length > 0 && (
                    <p><strong>Навички:</strong> {user.skills.join(', ')}</p>
                  )}
                  <p><strong>Створено:</strong> {new Date(user.created_at).toLocaleDateString('uk-UA')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="mr-2"
                  onClick={() => handleEditUser(user)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Редагувати
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setUserToDelete(user)}
                  disabled={deletingUserId === user.user_id}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {deletingUserId === user.user_id ? 'Видалення...' : 'Видалити'}
                </Button>
              </div>
            </div>
          ))}
          
          {users.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Користувачі не знайдені
            </div>
          )}
        </div>
      </CardContent>

      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Підтвердження видалення
            </AlertDialogTitle>
            <AlertDialogDescription>
              Ви збираєтесь <strong>повністю та безповоротно</strong> видалити користувача:
              <br />
              <strong>
                {userToDelete?.first_name && userToDelete?.last_name 
                  ? `${userToDelete.first_name} ${userToDelete.last_name}`
                  : 'Користувач без імені'
                }
              </strong>
              <br />
              <br />
              Це дію <strong>НЕ МОЖНА СКАСУВАТИ</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Скасувати</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => userToDelete && handleDeleteUser(userToDelete.user_id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Видалити повністю
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Редагувати користувача</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Обов'язкові поля */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Обов'язкові поля</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_first_name">Ім'я *</Label>
                  <Input
                    id="edit_first_name"
                    value={formData.first_name}
                    onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                    placeholder="Ім'я"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_last_name">Прізвище *</Label>
                  <Input
                    id="edit_last_name"
                    value={formData.last_name}
                    onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                    placeholder="Прізвище"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_phone">Телефон</Label>
                  <Input
                    id="edit_phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+380..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_telegram">Telegram</Label>
                  <Input
                    id="edit_telegram"
                    value={formData.telegram}
                    onChange={(e) => setFormData({...formData, telegram: e.target.value})}
                    placeholder="@username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_discord">Discord</Label>
                  <Input
                    id="edit_discord"
                    value={formData.discord}
                    onChange={(e) => setFormData({...formData, discord: e.target.value})}
                    placeholder="username#1234"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_participation_status">Статус участі *</Label>
                  <Select value={formData.participation_status} onValueChange={(value) => setFormData({...formData, participation_status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="looking_for_team">Шукаю команду</SelectItem>
                      <SelectItem value="has_team">Маю команду</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_roles">Ролі *</Label>
                  <Input
                    id="edit_roles"
                    value={formData.roles}
                    onChange={(e) => setFormData({...formData, roles: e.target.value})}
                    placeholder="Frontend Developer, UI/UX Designer"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_skills">Навички *</Label>
                  <Input
                    id="edit_skills"
                    value={formData.skills}
                    onChange={(e) => setFormData({...formData, skills: e.target.value})}
                    placeholder="React, TypeScript, Figma"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_technologies">Технології</Label>
                  <Input
                    id="edit_technologies"
                    value={formData.technologies}
                    onChange={(e) => setFormData({...formData, technologies: e.target.value})}
                    placeholder="Python, Docker, AWS"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_experience_level">Рівень досвіду *</Label>
                  <Select value={formData.experience_level} onValueChange={(value) => setFormData({...formData, experience_level: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Початковий</SelectItem>
                      <SelectItem value="intermediate">Середній</SelectItem>
                      <SelectItem value="advanced">Досвідчений</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="edit_portfolio_url">Посилання на профіль/портфоліо *</Label>
                  <Input
                    id="edit_portfolio_url"
                    value={formData.portfolio_url}
                    onChange={(e) => setFormData({...formData, portfolio_url: e.target.value})}
                    placeholder="https://github.com/username або https://linkedin.com/in/username"
                  />
                </div>
              </div>
            </div>

            {/* Необов'язкові поля */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Необов'язкові поля</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_location">Локація</Label>
                  <Input
                    id="edit_location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="Київ, Україна"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_interested_categories">Цікаві категорії</Label>
                  <Input
                    id="edit_interested_categories"
                    value={formData.interested_categories}
                    onChange={(e) => setFormData({...formData, interested_categories: e.target.value})}
                    placeholder="держсервіси, освіта, медіа"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Готовність бути капітаном</Label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="edit_ready_to_lead"
                        checked={formData.ready_to_lead === true}
                        onChange={() => setFormData({...formData, ready_to_lead: true})}
                      />
                      <span>Так</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="edit_ready_to_lead"
                        checked={formData.ready_to_lead === false}
                        onChange={() => setFormData({...formData, ready_to_lead: false})}
                      />
                      <span>Ні</span>
                    </label>
                  </div>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="edit_bio">Коротко про себе</Label>
                  <Textarea
                    id="edit_bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    placeholder="Розкажіть про себе..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Поля для команди */}
            {formData.participation_status === 'has_team' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Інформація про команду</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit_existing_team_name">Назва команди</Label>
                    <Input
                      id="edit_existing_team_name"
                      value={formData.existing_team_name}
                      onChange={(e) => setFormData({...formData, existing_team_name: e.target.value})}
                      placeholder="Назва вашої команди"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_looking_for_roles">Шукають ролі</Label>
                    <Input
                      id="edit_looking_for_roles"
                      value={formData.looking_for_roles}
                      onChange={(e) => setFormData({...formData, looking_for_roles: e.target.value})}
                      placeholder="Data Scientist, Frontend Developer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_team_description">Опис команди</Label>
                    <Textarea
                      id="edit_team_description"
                      value={formData.team_description}
                      onChange={(e) => setFormData({...formData, team_description: e.target.value})}
                      placeholder="Коротко про команду та її проект"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {setIsEditModalOpen(false); setEditingUser(null); resetForm();}}>
              Скасувати
            </Button>
            <Button onClick={handleUpdateUser}>
              Зберегти зміни
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}