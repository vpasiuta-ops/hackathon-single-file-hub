import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Edit, Plus, Calendar, AlertTriangle, X, GripVertical } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { HackathonFormDialog } from './HackathonFormDialog';
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

interface TimelineItem {
  id: string;
  name: string;
  start_datetime: string;
  end_datetime: string;
  is_current: boolean;
}

interface Prize {
  id: string;
  place: string;
  description: string;
  amount: string;
}

interface PartnerCase {
  id: string;
  name: string;
  description: string;
  partner: string;
  reward: string;
}

interface EvaluationCriterion {
  id: string;
  name: string;
  weight: number;
}

interface JuryMember {
  id: string;
  name: string;
  position: string;
  photo?: string;
}

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
  prize_fund?: string;
  timeline?: TimelineItem[];
  prizes?: Prize[];
  partner_cases?: PartnerCase[];
  evaluation_criteria?: EvaluationCriterion[];
  rules_and_requirements?: string;
  partners?: string[];
  jury?: JuryMember[];
  created_at: string;
}

interface HackathonFormData {
  title: string;
  description: string;
  status: string;
  start_date: string;
  end_date: string;
  registration_deadline: string;
  max_team_size: string;
  prize_fund: string;
  timeline: TimelineItem[];
  prizes: Prize[];
  partner_cases: PartnerCase[];
  evaluation_criteria: EvaluationCriterion[];
  rules_and_requirements: string;
  partners: string[];
  jury: JuryMember[];
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
    description: '',
    status: 'Чернетка',
    start_date: '',
    end_date: '',
    registration_deadline: '',
    max_team_size: '5',
    prize_fund: '',
    timeline: [],
    prizes: [],
    partner_cases: [],
    evaluation_criteria: [],
    rules_and_requirements: '',
    partners: [],
    jury: []
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
      
      // Cast the JSON fields to the proper types
      const typedData = (data || []).map(hackathon => ({
        ...hackathon,
        timeline: (hackathon.timeline as any) || [],
        prizes: (hackathon.prizes as any) || [],
        partner_cases: (hackathon.partner_cases as any) || [],
        evaluation_criteria: (hackathon.evaluation_criteria as any) || [],
        partners: (hackathon.partners as any) || [],
        jury: (hackathon.jury as any) || []
      })) as Hackathon[];
      
      setHackathons(typedData);
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

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      status: 'Чернетka',
      start_date: '',
      end_date: '',
      registration_deadline: '',
      max_team_size: '5',
      prize_fund: '',
      timeline: [],
      prizes: [],
      partner_cases: [],
      evaluation_criteria: [],
      rules_and_requirements: '',
      partners: [],
      jury: []
    });
  };

  const handleCreateHackathon = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-hackathons', {
        body: {
          action: 'create',
          hackathonData: {
            title: formData.title,
            description: formData.description,
            status: formData.status,
            start_date: formData.start_date,
            end_date: formData.end_date,
            registration_deadline: formData.registration_deadline,
            max_team_size: parseInt(formData.max_team_size),
            prize_fund: formData.prize_fund,
            timeline: formData.timeline,
            prizes: formData.prizes,
            partner_cases: formData.partner_cases,
            evaluation_criteria: formData.evaluation_criteria,
            rules_and_requirements: formData.rules_and_requirements,
            partners: formData.partners,
            jury: formData.jury
          }
        }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

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
      description: hackathon.description,
      status: hackathon.status,
      start_date: hackathon.start_date.split('T')[0],
      end_date: hackathon.end_date.split('T')[0],
      registration_deadline: hackathon.registration_deadline.split('T')[0],
      max_team_size: hackathon.max_team_size.toString(),
      prize_fund: hackathon.prize_fund || '',
      timeline: hackathon.timeline || [],
      prizes: hackathon.prizes || [],
      partner_cases: hackathon.partner_cases || [],
      evaluation_criteria: hackathon.evaluation_criteria || [],
      rules_and_requirements: hackathon.rules_and_requirements || '',
      partners: hackathon.partners || [],
      jury: hackathon.jury || []
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateHackathon = async () => {
    if (!editingHackathon) return;

    try {
      const { data, error } = await supabase.functions.invoke('admin-hackathons', {
        body: {
          action: 'update',
          hackathonData: {
            id: editingHackathon.id,
            title: formData.title,
            description: formData.description,
            status: formData.status,
            start_date: formData.start_date,
            end_date: formData.end_date,
            registration_deadline: formData.registration_deadline,
            max_team_size: parseInt(formData.max_team_size),
            prize_fund: formData.prize_fund,
            timeline: formData.timeline,
            prizes: formData.prizes,
            partner_cases: formData.partner_cases,
            evaluation_criteria: formData.evaluation_criteria,
            rules_and_requirements: formData.rules_and_requirements,
            partners: formData.partners,
            jury: formData.jury
          }
        }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

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

  const handleDeleteHackathon = async (hackathonId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-hackathons', {
        body: {
          action: 'delete',
          hackathonData: { id: hackathonId }
        }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

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

      const getStatusVariant = (status: string) => {
        switch (status) {
          case 'Активний': return 'default';
          case 'Чернетка': return 'secondary';
          case 'Триває зараз': return 'default';
          case 'Завершено': return 'outline';
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
            <HackathonFormDialog
              title="Створити новий хакатон"
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleCreateHackathon}
              onCancel={() => {
                setIsCreateModalOpen(false);
                resetForm();
              }}
            />
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
                  <p><strong>Опис:</strong> {hackathon.description.substring(0, 100)}...</p>
                  <p><strong>Початок:</strong> {new Date(hackathon.start_date).toLocaleDateString('uk-UA')}</p>
                  <p><strong>Кінець:</strong> {new Date(hackathon.end_date).toLocaleDateString('uk-UA')}</p>
                  <p><strong>Макс. розмір команди:</strong> {hackathon.max_team_size}</p>
                  {hackathon.prize_fund && <p><strong>Призовий фонд:</strong> {hackathon.prize_fund}</p>}
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
        <HackathonFormDialog
          title="Редагувати хакатон"
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleUpdateHackathon}
          onCancel={() => {
            setIsEditModalOpen(false);
            setEditingHackathon(null);
            resetForm();
          }}
        />
      </Dialog>
    </Card>
  );
}