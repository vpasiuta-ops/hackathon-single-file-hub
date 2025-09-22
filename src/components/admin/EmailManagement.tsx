import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Edit, Plus, Mail, Send, TestTube } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html_content: string;
  created_at: string;
  created_by: string;
}

export default function EmailManagement() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [testEmailDialog, setTestEmailDialog] = useState<string | null>(null);
  const [massEmailDialog, setMassEmailDialog] = useState<string | null>(null);
  const [testEmail, setTestEmail] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    html_content: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося завантажити шаблони листів',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = async () => {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .insert([formData])
        .select();

      if (error) throw error;

      toast({
        title: 'Успішно',
        description: 'Шаблон створено'
      });

      setCreateDialogOpen(false);
      setFormData({ name: '', subject: '', html_content: '' });
      await fetchTemplates();
    } catch (error: any) {
      console.error('Error creating template:', error);
      toast({
        title: 'Помилка',
        description: error.message || 'Не вдалося створити шаблон',
        variant: 'destructive'
      });
    }
  };

  const handleSendTestEmail = async (templateId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: { 
          templateId, 
          recipientEmail: testEmail,
          type: 'test'
        }
      });

      if (error) throw error;

      toast({
        title: 'Успішно',
        description: 'Тестовий лист надіслано'
      });

      setTestEmailDialog(null);
      setTestEmail('');
    } catch (error: any) {
      console.error('Error sending test email:', error);
      toast({
        title: 'Помилка',
        description: error.message || 'Не вдалося надіслати тестовий лист',
        variant: 'destructive'
      });
    }
  };

  const handleMassEmail = async (templateId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: { 
          templateId,
          type: 'mass'
        }
      });

      if (error) throw error;

      toast({
        title: 'Успішно',
        description: 'Масову розсилку розпочато'
      });

      setMassEmailDialog(null);
    } catch (error: any) {
      console.error('Error sending mass email:', error);
      toast({
        title: 'Помилка',
        description: error.message || 'Не вдалося розпочати масову розсилку',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      const { error } = await supabase
        .from('email_templates')
        .delete()
        .eq('id', templateId);

      if (error) throw error;

      toast({
        title: 'Успішно',
        description: 'Шаблон видалено'
      });

      await fetchTemplates();
    } catch (error: any) {
      console.error('Error deleting template:', error);
      toast({
        title: 'Помилка',
        description: error.message || 'Не вдалося видалити шаблон',
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
              <Mail className="h-5 w-5" />
              Email-розсилки
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Всього шаблонів: {templates.length}
            </p>
          </div>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Створити шаблон
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Створити новий шаблон</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Назва шаблону</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Наприклад: Запрошення на хакатон"
                  />
                </div>
                <div>
                  <Label htmlFor="subject">Тема листа</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Наприклад: Запрошуємо на хакатон!"
                  />
                </div>
                <div>
                  <Label htmlFor="content">HTML-контент</Label>
                  <Textarea
                    id="content"
                    value={formData.html_content}
                    onChange={(e) => setFormData({ ...formData, html_content: e.target.value })}
                    placeholder="Вставте HTML-код листа тут..."
                    className="min-h-[200px]"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                    Скасувати
                  </Button>
                  <Button onClick={handleCreateTemplate}>
                    Створити шаблон
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex-1">
                <h3 className="font-medium mb-1">{template.name}</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p><strong>Тема:</strong> {template.subject}</p>
                  <p><strong>Створено:</strong> {new Date(template.created_at).toLocaleDateString('uk-UA')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTestEmailDialog(template.id)}
                >
                  <TestTube className="h-4 w-4 mr-2" />
                  Тест
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setMassEmailDialog(template.id)}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Надіслати всім
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Редагувати
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteTemplate(template.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          
          {templates.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Шаблони не знайдені
            </div>
          )}
        </div>
      </CardContent>

      {/* Test Email Dialog */}
      <Dialog open={!!testEmailDialog} onOpenChange={() => setTestEmailDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Тестова відправка</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="testEmail">Email для тестування</Label>
              <Input
                id="testEmail"
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="test@example.com"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setTestEmailDialog(null)}>
                Скасувати
              </Button>
              <Button onClick={() => testEmailDialog && handleSendTestEmail(testEmailDialog)}>
                Надіслати
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mass Email Confirmation Dialog */}
      <AlertDialog open={!!massEmailDialog} onOpenChange={() => setMassEmailDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Підтвердження масової розсилки</AlertDialogTitle>
            <AlertDialogDescription>
              Ви збираєтесь надіслати цей лист усім зареєстрованим користувачам. 
              Цю дію не можна скасувати. Продовжити?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Скасувати</AlertDialogCancel>
            <AlertDialogAction onClick={() => massEmailDialog && handleMassEmail(massEmailDialog)}>
              Надіслати всім
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}