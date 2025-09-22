import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, AlertTriangle, Users } from 'lucide-react';
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
  telegram: string | null;
  discord: string | null;
  bio: string | null;
  skills: string[] | null;
  roles: string[] | null;
  participation_status: string | null;
  is_profile_complete: boolean;
  created_at: string;
  [key: string]: any; // Allow additional properties from database
}

export default function UsersManagement() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);
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
          <Users className="h-5 w-5" />
          Керування користувачами
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Всього користувачів: {users.length}
        </p>
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
    </Card>
  );
}