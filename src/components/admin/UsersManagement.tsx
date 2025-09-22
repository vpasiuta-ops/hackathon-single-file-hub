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
  bio: string;
  skills: string;
  roles: string;
  experience_level: string;
  participation_status: string;
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
    bio: '',
    skills: '',
    roles: '',
    experience_level: '',
    participation_status: 'looking_for_team'
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
      bio: '',
      skills: '',
      roles: '',
      experience_level: '',
      participation_status: 'looking_for_team'
    });
  };

  const handleCreateUser = async () => {
    try {
      // Create user in auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.first_name,
            last_name: formData.last_name
          }
        }
      });

      if (authError) throw authError;

      // Update profile with additional data
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone: formData.phone,
            bio: formData.bio,
            skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
            roles: formData.roles.split(',').map(s => s.trim()).filter(Boolean),
            experience_level: formData.experience_level,
            participation_status: formData.participation_status,
            is_profile_complete: true
          })
          .eq('user_id', authData.user.id);

        if (profileError) throw profileError;
      }

      toast({
        title: 'Успішно',
        description: 'Користувача створено'
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
      bio: user.bio || '',
      skills: user.skills?.join(', ') || '',
      roles: user.roles?.join(', ') || '',
      experience_level: user.experience_level || '',
      participation_status: user.participation_status || 'looking_for_team'
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
          bio: formData.bio,
          skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
          roles: formData.roles.split(',').map(s => s.trim()).filter(Boolean),
          experience_level: formData.experience_level,
          participation_status: formData.participation_status,
          is_profile_complete: true
        })
        .eq('user_id', editingUser.user_id);

      if (error) throw error;

      toast({
        title: 'Успішно',
        description: 'Дані користувача оновлено'
      });

      setIsEditModalOpen(false);
      setEditingUser(null);
      resetForm();
      await fetchUsers();
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast({
        title: 'Помилка',
        description: error.message || 'Не вдалося оновити дані користувача',
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
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Створити нового користувача</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
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
                  <Label htmlFor="experience_level">Рівень досвіду</Label>
                  <Select value={formData.experience_level} onValueChange={(value) => setFormData({...formData, experience_level: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Оберіть рівень" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="junior">Junior</SelectItem>
                      <SelectItem value="middle">Middle</SelectItem>
                      <SelectItem value="senior">Senior</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="participation_status">Статус участі</Label>
                  <Select value={formData.participation_status} onValueChange={(value) => setFormData({...formData, participation_status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="looking_for_team">Шукаю команду</SelectItem>
                      <SelectItem value="has_team">Маю команду</SelectItem>
                      <SelectItem value="not_participating">Не беру участь</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roles">Ролі (через кому)</Label>
                  <Input
                    id="roles"
                    value={formData.roles}
                    onChange={(e) => setFormData({...formData, roles: e.target.value})}
                    placeholder="Frontend Developer, UI/UX Designer"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="skills">Навички (через кому)</Label>
                  <Input
                    id="skills"
                    value={formData.skills}
                    onChange={(e) => setFormData({...formData, skills: e.target.value})}
                    placeholder="React, TypeScript, Figma"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="bio">Біографія</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    placeholder="Розкажіть про себе..."
                  />
                </div>
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Редагувати користувача</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
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
              <Label htmlFor="edit_experience_level">Рівень досвіду</Label>
              <Select value={formData.experience_level} onValueChange={(value) => setFormData({...formData, experience_level: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Оберіть рівень" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="junior">Junior</SelectItem>
                  <SelectItem value="middle">Middle</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_participation_status">Статус участі</Label>
              <Select value={formData.participation_status} onValueChange={(value) => setFormData({...formData, participation_status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="looking_for_team">Шукаю команду</SelectItem>
                  <SelectItem value="has_team">Маю команду</SelectItem>
                  <SelectItem value="not_participating">Не беру участь</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_roles">Ролі (через кому)</Label>
              <Input
                id="edit_roles"
                value={formData.roles}
                onChange={(e) => setFormData({...formData, roles: e.target.value})}
                placeholder="Frontend Developer, UI/UX Designer"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="edit_skills">Навички (через кому)</Label>
              <Input
                id="edit_skills"
                value={formData.skills}
                onChange={(e) => setFormData({...formData, skills: e.target.value})}
                placeholder="React, TypeScript, Figma"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="edit_bio">Біографія</Label>
              <Textarea
                id="edit_bio"
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                placeholder="Розкажіть про себе..."
              />
            </div>
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