import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Trash2, Edit, Plus, Calendar, AlertTriangle } from 'lucide-react';
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

interface Hackathon {
  id: string;
  title: string;
  description: string;
  short_description: string | null;
  status: string;
  start_date: string;
  end_date: string;
  registration_deadline: string;
  max_team_size: number;
  created_at: string;
}

interface HackathonFormData {
  title: string;
  short_description: string;
  description: string;
  status: string;
  start_date: string;
  end_date: string;
  registration_deadline: string;
  max_team_size: string;
}

export default function HackathonsManagement() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingHackathon, setEditingHackathon] = useState<Hackathon | null>(null);
  const [hackathonToDelete, setHackathonToDelete] = useState<Hackathon | null>(null);
  const [formData, setFormData] = useState<HackathonFormData>({
    title: '',
    short_description: '',
    description: '',
    status: 'Майбутній',
    start_date: '',
    end_date: '',
    registration_deadline: '',
    max_team_size: '5'
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchHackathons();
  }, []);

  const fetchHackathons = async () => {
    try {
      const { data, error } = await supabase
        .from('hackathons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHackathons(data || []);
    } catch (error) {
      console.error('Error fetching hackathons:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося завантажити список хакатонів',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHackathon = async (hackathonId: string) => {
    try {
      const { error } = await supabase
        .from('hackathons')
        .delete()
        .eq('id', hackathonId);

      if (error) throw error;

      toast({
        title: 'Успішно',
        description: 'Хакатон видалено'
      });

      await fetchHackathons();
      setHackathonToDelete(null);
    } catch (error: any) {
      console.error('Error deleting hackathon:', error);
      toast({
        title: 'Помилка',
        description: error.message || 'Не вдалося видалити хакатон',
        variant: 'destructive'
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      short_description: '',
      description: '',
      status: 'Майбутній',
      start_date: '',
      end_date: '',
      registration_deadline: '',
      max_team_size: '5'
    });
  };

  const handleCreateHackathon = async () => {
    try {
      const { error } = await supabase
        .from('hackathons')
        .insert({
          title: formData.title,
          short_description: formData.short_description,
          description: formData.description,
          status: formData.status,
          start_date: formData.start_date,
          end_date: formData.end_date,
          registration_deadline: formData.registration_deadline,
          max_team_size: parseInt(formData.max_team_size)
        });

      if (error) throw error;

      toast({
        title: 'Успішно',
        description: 'Хакатон створено'
      });

      setIsCreateModalOpen(false);
      resetForm();
      await fetchHackathons();
    } catch (error: any) {
      console.error('Error creating hackathon:', error);
      toast({
        title: 'Помилка',
        description: error.message || 'Не вдалося створити хакатон',
        variant: 'destructive'
      });
    }
  };

  const handleEditHackathon = (hackathon: Hackathon) => {
    setEditingHackathon(hackathon);
    setFormData({
      title: hackathon.title,
      short_description: hackathon.short_description || '',
      description: hackathon.description,
      status: hackathon.status,
      start_date: hackathon.start_date.split('T')[0],
      end_date: hackathon.end_date.split('T')[0],
      registration_deadline: hackathon.registration_deadline.split('T')[0],
      max_team_size: hackathon.max_team_size.toString()
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateHackathon = async () => {
    if (!editingHackathon) return;

    try {
      const { error } = await supabase
        .from('hackathons')
        .update({
          title: formData.title,
          short_description: formData.short_description,
          description: formData.description,
          status: formData.status,
          start_date: formData.start_date,
          end_date: formData.end_date,
          registration_deadline: formData.registration_deadline,
          max_team_size: parseInt(formData.max_team_size)
        })
        .eq('id', editingHackathon.id);

      if (error) throw error;

      toast({
        title: 'Успішно',
        description: 'Дані хакатону оновлено'
      });

      setIsEditModalOpen(false);
      setEditingHackathon(null);
      resetForm();
      await fetchHackathons();
    } catch (error: any) {
      console.error('Error updating hackathon:', error);
      toast({
        title: 'Помилка',
        description: error.message || 'Не вдалося оновити дані хакатону',
        variant: 'destructive'
      });
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Активний': return 'default';
      case 'Майбутній': return 'secondary';
      case 'Завершений': return 'outline';
      default: return 'secondary';
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
              <Calendar className="h-5 w-5" />
              Керування хакатонами
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Всього хакатонів: {hackathons.length}
            </p>
          </div>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Створити хакатон
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Створити новий хакатон</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Назва хакатону *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Назва хакатону"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Статус</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Майбутній">Майбутній</SelectItem>
                      <SelectItem value="Активний">Активний</SelectItem>
                      <SelectItem value="Завершений">Завершений</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start_date">Дата початку *</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">Дата завершення *</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registration_deadline">Дедлайн реєстрації *</Label>
                  <Input
                    id="registration_deadline"
                    type="date"
                    value={formData.registration_deadline}
                    onChange={(e) => setFormData({...formData, registration_deadline: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_team_size">Макс. розмір команди</Label>
                  <Input
                    id="max_team_size"
                    type="number"
                    min="1"
                    value={formData.max_team_size}
                    onChange={(e) => setFormData({...formData, max_team_size: e.target.value})}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="short_description">Короткий опис</Label>
                  <Input
                    id="short_description"
                    value={formData.short_description}
                    onChange={(e) => setFormData({...formData, short_description: e.target.value})}
                    placeholder="Короткий опис для карток"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="description">Повний опис *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Детальний опис хакатону..."
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {setIsCreateModalOpen(false); resetForm();}}>
                  Скасувати
                </Button>
                <Button onClick={handleCreateHackathon}>
                  Створити хакатон
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {hackathons.map((hackathon) => (
            <div
              key={hackathon.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-medium">{hackathon.title}</h3>
                  <Badge variant={getStatusVariant(hackathon.status)}>
                    {hackathon.status}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p><strong>Опис:</strong> {hackathon.short_description || 'Не вказано'}</p>
                  <p><strong>Початок:</strong> {new Date(hackathon.start_date).toLocaleDateString('uk-UA')}</p>
                  <p><strong>Кінець:</strong> {new Date(hackathon.end_date).toLocaleDateString('uk-UA')}</p>
                  <p><strong>Дедлайн реєстрації:</strong> {new Date(hackathon.registration_deadline).toLocaleDateString('uk-UA')}</p>
                  <p><strong>Макс. розмір команди:</strong> {hackathon.max_team_size}</p>
                  <p><strong>Створено:</strong> {new Date(hackathon.created_at).toLocaleDateString('uk-UA')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="mr-2"
                  onClick={() => handleEditHackathon(hackathon)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Редагувати
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setHackathonToDelete(hackathon)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Видалити
                </Button>
              </div>
            </div>
          ))}
          
          {hackathons.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Хакатони не знайдені
            </div>
          )}
        </div>
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!hackathonToDelete} onOpenChange={() => setHackathonToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Підтвердження видалення
            </AlertDialogTitle>
            <AlertDialogDescription>
              Ви збираєтесь видалити хакатон:
              <br />
              <strong>{hackathonToDelete?.title}</strong>
              <br />
              <br />
              Це дію НЕ МОЖНА СКАСУВАТИ.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Скасувати</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => hackathonToDelete && handleDeleteHackathon(hackathonToDelete.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Видалити хакатон
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Hackathon Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Редагувати хакатон</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit_title">Назва хакатону *</Label>
              <Input
                id="edit_title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Назва хакатону"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_status">Статус</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Майбутній">Майбутній</SelectItem>
                  <SelectItem value="Активний">Активний</SelectItem>
                  <SelectItem value="Завершений">Завершений</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_start_date">Дата початку *</Label>
              <Input
                id="edit_start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({...formData, start_date: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_end_date">Дата завершення *</Label>
              <Input
                id="edit_end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({...formData, end_date: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_registration_deadline">Дедлайн реєстрації *</Label>
              <Input
                id="edit_registration_deadline"
                type="date"
                value={formData.registration_deadline}
                onChange={(e) => setFormData({...formData, registration_deadline: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_max_team_size">Макс. розмір команди</Label>
              <Input
                id="edit_max_team_size"
                type="number"
                min="1"
                value={formData.max_team_size}
                onChange={(e) => setFormData({...formData, max_team_size: e.target.value})}
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="edit_short_description">Короткий опис</Label>
              <Input
                id="edit_short_description"
                value={formData.short_description}
                onChange={(e) => setFormData({...formData, short_description: e.target.value})}
                placeholder="Короткий опис для карток"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="edit_description">Повний опис *</Label>
              <Textarea
                id="edit_description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Детальний опис хакатону..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {setIsEditModalOpen(false); setEditingHackathon(null); resetForm();}}>
              Скасувати
            </Button>
            <Button onClick={handleUpdateHackathon}>
              Зберегти зміни
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}