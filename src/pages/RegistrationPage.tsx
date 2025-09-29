import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { useRegistration, RegistrationFormData } from '@/hooks/useRegistration';
import { useToast } from '@/hooks/use-toast';
import {
  User, 
  Mail, 
  Users, 
  Award, 
  Code, 
  Globe, 
  MapPin, 
  Target,
  CheckCircle,
  X,
  Plus,
  AlertTriangle
} from 'lucide-react';

const ROLES = [
  'Data Scientist',
  'ML Engineer', 
  'Backend',
  'Frontend',
  'UX/UI',
  'Product/PM',
  'BA',
  'DevOps/MLOps',
  'QA',
  'Research/NLP',
  'ІНШЕ'
];

const CATEGORIES = [
  'держсервіси',
  'освіта',
  'медіа',
  'безпека/оборона',
  'міські сервіси',
  'охорона здоров\'я'
];

export default function RegistrationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const { loading, tokenValid, email, validateToken, completeRegistration } = useRegistration();
  const { toast } = useToast();

  const [formData, setFormData] = useState<RegistrationFormData>({
    first_name: '',
    last_name: '',
    email: '',
    participation_status: 'looking_for_team',
    roles: [],
    skills: [],
    experience_level: 'intermediate',
    portfolio_url: '',
    bio: '',
    ready_to_lead: null,
    location: '',
    interested_categories: [],
    existing_team_name: '',
    looking_for_roles: [],
    team_description: '',
    privacy_policy: false,
    participation_rules: false,
    email_notifications: false
  });

  const [newSkill, setNewSkill] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }

    validateToken(token);
  }, [token]);

  useEffect(() => {
    if (email) {
      setFormData(prev => ({ ...prev, email }));
    }
  }, [email]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!formData.first_name.trim()) {
      newErrors.first_name = "Ім'я обов'язкове";
    } else if (formData.first_name.length < 2 || formData.first_name.length > 60) {
      newErrors.first_name = "Ім'я має бути від 2 до 60 символів";
    } else if (!/^[А-Яа-яA-Za-z\s\-']+$/.test(formData.first_name)) {
      newErrors.first_name = "Ім'я може містити тільки літери, пробіли та дефіси";
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = "Прізвище обов'язкове";
    } else if (formData.last_name.length < 2 || formData.last_name.length > 60) {
      newErrors.last_name = "Прізвище має бути від 2 до 60 символів";
    } else if (!/^[А-Яа-яA-Za-z\s\-']+$/.test(formData.last_name)) {
      newErrors.last_name = "Прізвище може містити тільки літери, пробіли та дефіси";
    }

    if (formData.roles.length === 0) {
      newErrors.roles = "Оберіть хоча б одну роль";
    } else if (formData.roles.length > 3) {
      newErrors.roles = "Можна обрати не більше 3 ролей";
    }

    if (formData.skills.length < 3) {
      newErrors.skills = "Додайте принаймні 3 навички";
    } else if (formData.skills.length > 10) {
      newErrors.skills = "Можна додати не більше 10 навичок";
    }

    if (formData.portfolio_url && !formData.portfolio_url.startsWith('https://')) {
      newErrors.portfolio_url = "Посилання має починатися з https://";
    }

    if (formData.bio && formData.bio.length > 300) {
      newErrors.bio = "Опис не може перевищувати 300 символів";
    }

    // Team-specific validation
    if (formData.participation_status === 'have_team') {
      if (!formData.existing_team_name?.trim()) {
        newErrors.existing_team_name = "Назва команди обов'язкова";
      } else if (formData.existing_team_name.length > 50) {
        newErrors.existing_team_name = "Назва команди не може перевищувати 50 символів";
      }

      if (formData.team_description && formData.team_description.length > 140) {
        newErrors.team_description = "Опис не може перевищувати 140 символів";
      }
    }

    // Required checkboxes
    if (!formData.privacy_policy) {
      newErrors.privacy_policy = "Потрібна згода з політикою конфіденційності";
    }
    if (!formData.participation_rules) {
      newErrors.participation_rules = "Потрібна згода з правилами участі";
    }
    if (!formData.email_notifications) {
      newErrors.email_notifications = "Потрібна згода на отримання email-листів";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim()) && formData.skills.length < 10) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
      if (errors.skills) {
        setErrors(prev => ({ ...prev, skills: '' }));
      }
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleRoleChange = (role: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      roles: checked 
        ? [...prev.roles, role]
        : prev.roles.filter(r => r !== role)
    }));
    if (errors.roles) {
      setErrors(prev => ({ ...prev, roles: '' }));
    }
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      interested_categories: checked
        ? [...prev.interested_categories, category]
        : prev.interested_categories.filter(c => c !== category)
    }));
  };

  const handleLookingForRoleChange = (role: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      looking_for_roles: checked
        ? [...(prev.looking_for_roles || []), role]
        : (prev.looking_for_roles || []).filter(r => r !== role)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: 'Помилки валідації',
        description: 'Будь ласка, виправте помилки у формі',
        variant: 'destructive'
      });
      return;
    }

    if (!token) return;

    setIsSubmitting(true);
    const result = await completeRegistration(token, formData);
    
    if (result.success) {
      navigate('/auth');
    }
    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground-secondary">Перевіряємо посилання...</p>
        </div>
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h1 className="text-xl font-semibold mb-2">Недійсне посилання</h1>
            <p className="text-foreground-secondary mb-4">
              Це посилання для реєстрації недійсне, прострочене або вже використане.
            </p>
            <Button onClick={() => navigate('/')} variant="outline">
              Повернутися на головну
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Реєстрація на хакатон
          </h1>
          <p className="text-foreground-secondary">
            Заповніть інформацію про себе для участі
          </p>
        </div>

        <Card className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Форма реєстрації
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Основна інформація</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">
                      Ім'я *
                      <span className="text-xs text-foreground-secondary block">
                        Як у ваших документах або профілі LinkedIn
                      </span>
                    </Label>
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, first_name: e.target.value }));
                        if (errors.first_name) setErrors(prev => ({ ...prev, first_name: '' }));
                      }}
                      className={errors.first_name ? 'border-destructive' : ''}
                    />
                    {errors.first_name && (
                      <p className="text-sm text-destructive">{errors.first_name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="last_name">Прізвище *</Label>
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, last_name: e.target.value }));
                        if (errors.last_name) setErrors(prev => ({ ...prev, last_name: '' }));
                      }}
                      className={errors.last_name ? 'border-destructive' : ''}
                    />
                    {errors.last_name && (
                      <p className="text-sm text-destructive">{errors.last_name}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>
                    <Mail className="w-4 h-4 inline mr-2" />
                    E-mail
                    <span className="text-xs text-foreground-secondary block">
                      Сюди надсилатимемо підтвердження та інструкції
                    </span>
                  </Label>
                  <Input value={email} disabled className="bg-muted" />
                </div>
              </div>

              {/* Participation Status */}
              <div className="space-y-4">
                <Label>Статус участі *</Label>
                <RadioGroup
                  value={formData.participation_status}
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    participation_status: value as 'looking_for_team' | 'have_team'
                  }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="looking_for_team" id="looking" />
                    <Label htmlFor="looking">Шукаю команду</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="have_team" id="have_team" />
                    <Label htmlFor="have_team">У мене вже є команда</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Roles */}
              <div className="space-y-4">
                <Label>
                  Ваші ролі * 
                  <span className="text-xs text-foreground-secondary block">
                    Оберіть не більше 3 ролей
                  </span>
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {ROLES.map((role) => (
                    <div key={role} className="flex items-center space-x-2">
                      <Checkbox
                        id={`role-${role}`}
                        checked={formData.roles.includes(role)}
                        onCheckedChange={(checked) => handleRoleChange(role, checked as boolean)}
                        disabled={!formData.roles.includes(role) && formData.roles.length >= 3}
                      />
                      <Label htmlFor={`role-${role}`} className="text-sm">{role}</Label>
                    </div>
                  ))}
                </div>
                {errors.roles && (
                  <p className="text-sm text-destructive">{errors.roles}</p>
                )}
              </div>

              {/* Skills */}
              <div className="space-y-4">
                <Label>
                  <Code className="w-4 h-4 inline mr-2" />
                  Навички *
                  <span className="text-xs text-foreground-secondary block">
                    Python, PyTorch, SQL, FastAPI, Docker, LLM, LangChain тощо (від 3 до 10 тегів)
                  </span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Додати навичку"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    onClick={addSkill}
                    variant="outline"
                    size="icon"
                    disabled={formData.skills.length >= 10}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill) => (
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
                <p className="text-xs text-foreground-secondary">
                  {formData.skills.length}/10 навичок
                </p>
                {errors.skills && (
                  <p className="text-sm text-destructive">{errors.skills}</p>
                )}
              </div>

              {/* Experience Level */}
              <div className="space-y-4">
                <Label>Рівень *</Label>
                <RadioGroup
                  value={formData.experience_level}
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    experience_level: value as 'beginner' | 'intermediate' | 'advanced'
                  }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="beginner" id="beginner" />
                    <Label htmlFor="beginner">Початковий</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="intermediate" id="intermediate" />
                    <Label htmlFor="intermediate">Середній</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="advanced" id="advanced" />
                    <Label htmlFor="advanced">Досвідчений</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Portfolio URL */}
              <div className="space-y-2">
                <Label htmlFor="portfolio">
                  <Globe className="w-4 h-4 inline mr-2" />
                  Посилання (одне на вибір) *
                  <span className="text-xs text-foreground-secondary block">
                    Вставте посилання на ваш GitHub, LinkedIn або портфоліо
                  </span>
                </Label>
                <Input
                  id="portfolio"
                  value={formData.portfolio_url}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, portfolio_url: e.target.value }));
                    if (errors.portfolio_url) setErrors(prev => ({ ...prev, portfolio_url: '' }));
                  }}
                  placeholder="https://"
                  className={errors.portfolio_url ? 'border-destructive' : ''}
                />
                {errors.portfolio_url && (
                  <p className="text-sm text-destructive">{errors.portfolio_url}</p>
                )}
              </div>

              {/* Dynamic Team Fields */}
              {formData.participation_status === 'have_team' && (
                <div className="space-y-4 p-4 border border-border rounded-lg">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Інформація про команду
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="team_name">Назва команди *</Label>
                    <Input
                      id="team_name"
                      value={formData.existing_team_name || ''}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, existing_team_name: e.target.value }));
                        if (errors.existing_team_name) setErrors(prev => ({ ...prev, existing_team_name: '' }));
                      }}
                      className={errors.existing_team_name ? 'border-destructive' : ''}
                      maxLength={50}
                    />
                    {errors.existing_team_name && (
                      <p className="text-sm text-destructive">{errors.existing_team_name}</p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <Label>Кого шукаєте в команду?</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {ROLES.map((role) => (
                        <div key={role} className="flex items-center space-x-2">
                          <Checkbox
                            id={`looking-${role}`}
                            checked={(formData.looking_for_roles || []).includes(role)}
                            onCheckedChange={(checked) => handleLookingForRoleChange(role, checked as boolean)}
                          />
                          <Label htmlFor={`looking-${role}`} className="text-sm">{role}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="team_desc">
                      Короткий опис команди
                      <span className="text-xs text-foreground-secondary block">
                        До 140 символів
                      </span>
                    </Label>
                    <Textarea
                      id="team_desc"
                      value={formData.team_description || ''}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, team_description: e.target.value }));
                        if (errors.team_description) setErrors(prev => ({ ...prev, team_description: '' }));
                      }}
                      className={errors.team_description ? 'border-destructive' : ''}
                      maxLength={140}
                      rows={3}
                    />
                    <p className="text-xs text-foreground-secondary">
                      {(formData.team_description || '').length}/140 символів
                    </p>
                    {errors.team_description && (
                      <p className="text-sm text-destructive">{errors.team_description}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Optional Fields */}
              <div className="space-y-4 p-4 border border-border rounded-lg">
                <h3 className="text-lg font-semibold">Додаткова інформація (необов'язково)</h3>

                <div className="space-y-2">
                  <Label htmlFor="bio">
                    Коротко про себе
                    <span className="text-xs text-foreground-secondary block">
                      До 300 символів
                    </span>
                  </Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, bio: e.target.value }));
                      if (errors.bio) setErrors(prev => ({ ...prev, bio: '' }));
                    }}
                    className={errors.bio ? 'border-destructive' : ''}
                    maxLength={300}
                    rows={4}
                    placeholder="Розкажіть коротко про себе, свій досвід та цілі..."
                  />
                  <p className="text-xs text-foreground-secondary">
                    {formData.bio.length}/300 символів
                  </p>
                  {errors.bio && (
                    <p className="text-sm text-destructive">{errors.bio}</p>
                  )}
                </div>

                <div className="space-y-4">
                  <Label>Готовність бути капітаном</Label>
                  <RadioGroup
                    value={formData.ready_to_lead === null ? '' : formData.ready_to_lead.toString()}
                    onValueChange={(value) => setFormData(prev => ({ 
                      ...prev, 
                      ready_to_lead: value === '' ? null : value === 'true'
                    }))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id="lead_yes" />
                      <Label htmlFor="lead_yes">Так</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id="lead_no" />
                      <Label htmlFor="lead_no">Ні</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Локація (країна/місто)
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Київ, Україна"
                  />
                </div>

                <div className="space-y-4">
                  <Label>
                    <Target className="w-4 h-4 inline mr-2" />
                    Над якими кейсами хочете працювати?
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {CATEGORIES.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category}`}
                          checked={formData.interested_categories.includes(category)}
                          onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                        />
                        <Label htmlFor={`category-${category}`} className="text-sm capitalize">
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Agreements */}
              <div className="space-y-4 p-4 border border-border rounded-lg">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Згоди (обов'язково)
                </h3>

                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="rules"
                      checked={formData.participation_rules}
                      onCheckedChange={(checked) => {
                        setFormData(prev => ({ ...prev, participation_rules: checked as boolean }));
                        if (errors.participation_rules) setErrors(prev => ({ ...prev, participation_rules: '' }));
                      }}
                      className={errors.participation_rules ? 'border-destructive' : ''}
                    />
                    <Label htmlFor="rules" className="text-sm leading-relaxed">
                      Погоджуюсь із Правилами участі *
                    </Label>
                  </div>
                  {errors.participation_rules && (
                    <p className="text-sm text-destructive ml-6">{errors.participation_rules}</p>
                  )}

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="privacy"
                      checked={formData.privacy_policy}
                      onCheckedChange={(checked) => {
                        setFormData(prev => ({ ...prev, privacy_policy: checked as boolean }));
                        if (errors.privacy_policy) setErrors(prev => ({ ...prev, privacy_policy: '' }));
                      }}
                      className={errors.privacy_policy ? 'border-destructive' : ''}
                    />
                    <Label htmlFor="privacy" className="text-sm leading-relaxed">
                      Погоджуюсь із Політикою конфіденційності *
                    </Label>
                  </div>
                  {errors.privacy_policy && (
                    <p className="text-sm text-destructive ml-6">{errors.privacy_policy}</p>
                  )}

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="emails"
                      checked={formData.email_notifications}
                      onCheckedChange={(checked) => {
                        setFormData(prev => ({ ...prev, email_notifications: checked as boolean }));
                        if (errors.email_notifications) setErrors(prev => ({ ...prev, email_notifications: '' }));
                      }}
                      className={errors.email_notifications ? 'border-destructive' : ''}
                    />
                    <Label htmlFor="emails" className="text-sm leading-relaxed">
                      Погоджуюсь отримувати e-mail-листи щодо хакатону *
                    </Label>
                  </div>
                  {errors.email_notifications && (
                    <p className="text-sm text-destructive ml-6">{errors.email_notifications}</p>
                  )}
                </div>
              </div>

              <Button
                type="submit" 
                className="w-full"
                disabled={isSubmitting || loading}
                size="lg"
              >
                {isSubmitting ? 'Завершуємо реєстрацію...' : 'Завершити реєстрацію'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}