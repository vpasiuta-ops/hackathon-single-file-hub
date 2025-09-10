import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { X, Plus, User, Phone, Code, Award, FileText } from 'lucide-react';

export default function ProfileCompletionPage() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    bio: ''
  });
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [newTechnology, setNewTechnology] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { completeProfile } = useAuth();
  const { toast } = useToast();

  const addTechnology = () => {
    if (newTechnology.trim() && !technologies.includes(newTechnology.trim())) {
      setTechnologies([...technologies, newTechnology.trim()]);
      setNewTechnology('');
    }
  };

  const removeTechnology = (tech: string) => {
    setTechnologies(technologies.filter(t => t !== tech));
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      toast({
        title: 'Помилка',
        description: "Ім'я та прізвище є обов'язковими полями",
        variant: 'destructive'
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await completeProfile({
        ...formData,
        technologies,
        skills
      });
      
      if (error) {
        toast({
          title: 'Помилка',
          description: 'Сталася помилка при збереженні профілю',
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Успішно!',
          description: 'Профіль успішно заповнено'
        });
      }
    } catch (error) {
      toast({
        title: 'Помилка',
        description: 'Сталася несподівана помилка',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, addFunction: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addFunction();
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Завершіть свій профіль
          </h1>
          <p className="text-foreground-secondary">
            Заповніть інформацію про себе, щоб інші учасники могли знайти вас
          </p>
        </div>

        <Card className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <User className="w-5 h-5" />
              Особиста інформація
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">Ім'я *</Label>
                  <Input
                    id="first-name"
                    type="text"
                    placeholder="Ваше ім'я"
                    value={formData.first_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="last-name">Прізвище *</Label>
                  <Input
                    id="last-name"
                    type="text"
                    placeholder="Ваше прізвище"
                    value={formData.last_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Номер телефону
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+380123456789"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>
                  <Code className="w-4 h-4 inline mr-2" />
                  Стек технологій
                </Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    type="text"
                    placeholder="Додати технологію"
                    value={newTechnology}
                    onChange={(e) => setNewTechnology(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, addTechnology)}
                  />
                  <Button 
                    type="button" 
                    onClick={addTechnology}
                    variant="outline"
                    size="icon"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech) => (
                    <Badge key={tech} variant="secondary" className="flex items-center gap-1">
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeTechnology(tech)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>
                  <Award className="w-4 h-4 inline mr-2" />
                  Навички
                </Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    type="text"
                    placeholder="Додати навичку"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, addSkill)}
                  />
                  <Button 
                    type="button" 
                    onClick={addSkill}
                    variant="outline"
                    size="icon"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="flex items-center gap-1">
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Про себе
                </Label>
                <Textarea
                  id="bio"
                  placeholder="Розкажіть коротко про себе, свій досвід та цілі..."
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? 'Зберігаємо...' : 'Завершити профіль'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}