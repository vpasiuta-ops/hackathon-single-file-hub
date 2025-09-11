import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, X, Users } from 'lucide-react';
import { useTeams, CreateTeamData } from '@/hooks/useTeams';

interface CreateTeamDialogProps {
  children: React.ReactNode;
}

export default function CreateTeamDialog({ children }: CreateTeamDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<CreateTeamData>({
    name: '',
    description: '',
    looking_for: []
  });
  const [currentSkill, setCurrentSkill] = useState('');
  const { createTeam } = useTeams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.name.trim() === '' || formData.description.trim() === '') {
      return;
    }

    const success = await createTeam(formData);
    if (success) {
      setOpen(false);
      setFormData({ name: '', description: '', looking_for: [] });
      setCurrentSkill('');
    }
  };

  const addSkill = () => {
    if (currentSkill.trim() && !formData.looking_for.includes(currentSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        looking_for: [...prev.looking_for, currentSkill.trim()]
      }));
      setCurrentSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      looking_for: prev.looking_for.filter(s => s !== skill)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Створити команду
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Назва команди</Label>
            <Input
              id="name"
              placeholder="Введіть назву команди"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Опис</Label>
            <Textarea
              id="description"
              placeholder="Розкажіть про вашу команду та проект"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Шукаємо</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Наприклад: Frontend розробник"
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button 
                type="button"
                onClick={addSkill}
                size="icon"
                variant="outline"
                disabled={!currentSkill.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {formData.looking_for.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.looking_for.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Скасувати
            </Button>
            <Button 
              type="submit"
              className="flex-1"
              disabled={!formData.name.trim() || !formData.description.trim()}
            >
              Створити
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}