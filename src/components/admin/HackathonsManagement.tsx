import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

export default function HackathonsManagement() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
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
    } catch (error: any) {
      console.error('Error deleting hackathon:', error);
      toast({
        title: 'Помилка',
        description: error.message || 'Не вдалося видалити хакатон',
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
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Створити хакатон
          </Button>
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
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Редагувати
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteHackathon(hackathon.id)}
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
    </Card>
  );
}