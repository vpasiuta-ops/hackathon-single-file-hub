import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { SkillsSelector } from '@/components/SkillsSelector';
import { User, Mail, Phone, MessageCircle, Users, Briefcase, Award, Link, FileText, MapPin, Clock, Target, Shield } from 'lucide-react';

export default function ProfileCompletionPage() {
  const { user, profile, completeProfile } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    // Обов'язкові поля
    full_name: '',
    email: '',
    phone: '',
    telegram: '',
    discord: '',
    participation_status: '',
    roles: [] as string[],
    skills: [] as string[],
    experience_level: '',
    portfolio_url: '',
    rules_consent: false,
    privacy_consent: false,
    email_consent: false,
    
    // Поля для команди (коли "У мене вже є команда")
    team_name: '',
    team_composition: '',
    looking_for_roles: [] as string[],
    team_description: '',
    
    // Необов'язкові поля
    bio: '',
    timezone: '',
    location: '',
    ready_to_lead: '',
    expected_role: '',
    interested_categories: [] as string[]
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Ініціалізуємо форму з існуючими даними профілю
  useEffect(() => {
    if (user && profile) {
      setFormData(prev => ({
        ...prev,
        full_name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
        email: user.email || '',
        phone: profile.phone || '',
        telegram: profile.telegram || '',
        discord: profile.discord || '',
        participation_status: profile.participation_status || '',
        roles: profile.roles || [],
        skills: profile.skills || [],
        experience_level: profile.experience_level || '',
        portfolio_url: profile.portfolio_url || '',
        bio: profile.bio || '',
        location: profile.location || '',
        ready_to_lead: profile.ready_to_lead ? 'Так' : profile.ready_to_lead === false ? 'Ні' : '',
        interested_categories: profile.interested_categories || [],
        team_name: profile.existing_team_name || '',
        team_description: profile.team_description || '',
        looking_for_roles: profile.looking_for_roles || [],
        // Згоди залишаємо як є, щоб користувач міг їх оновити
        rules_consent: true,
        privacy_consent: true,
        email_consent: true
      }));
    }
  }, [user, profile]);

  const roleOptions = [
    'Data Scientist', 'ML Engineer', 'Backend', 'Frontend', 
    'UX/UI', 'Product/PM', 'BA', 'DevOps/MLOps', 'QA', 'Research/NLP', 'ІНШЕ'
  ];

  const categoryOptions = [
    'держсервіси', 'освіта', 'медіа', 'безпека/оборона', 'міські сервіси', 'охорона здоров\'я'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Обов'язкові поля
    if (!formData.full_name.trim() || formData.full_name.length < 2 || formData.full_name.length > 60) {
      newErrors.full_name = 'ПІБ має містити від 2 до 60 символів';
    }
    if (!/^[a-zA-Zа-яА-ЯёЁіІїЇєЄ\s\-']+$/.test(formData.full_name.trim())) {
      newErrors.full_name = 'ПІБ може містити тільки літери, дефіси та пробіли';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Номер телефону є обов\'язковим';
    }
    if (!formData.telegram.trim()) {
      newErrors.telegram = 'Telegram є обов\'язковим';
    }
    if (!formData.discord.trim()) {
      newErrors.discord = 'Discord є обов\'язковим';
    }
    if (!formData.participation_status) {
      newErrors.participation_status = 'Оберіть статус участі';
    }
    if (formData.roles.length === 0) {
      newErrors.roles = 'Оберіть хоча б одну роль';
    }
    if (formData.roles.length > 3) {
      newErrors.roles = 'Можна обрати не більше 3 ролей';
    }
    if (formData.skills.length < 3) {
      newErrors.skills = 'Оберіть мінімум 3 навички';
    }
    if (formData.skills.length > 10) {
      newErrors.skills = 'Можна обрати не більше 10 навичок';
    }
    if (!formData.experience_level) {
      newErrors.experience_level = 'Оберіть рівень досвіду';
    }
    if (!formData.portfolio_url.trim() || !formData.portfolio_url.startsWith('https://')) {
      newErrors.portfolio_url = 'Введіть валідний URL (має починатися з https://)';
    }
    if (!formData.rules_consent) {
      newErrors.rules_consent = 'Потрібна згода з правилами участі';
    }
    if (!formData.privacy_consent) {
      newErrors.privacy_consent = 'Потрібна згода з політикою конфіденційності';
    }
    if (!formData.email_consent) {
      newErrors.email_consent = 'Потрібна згода на отримання email-сповіщень';
    }

    // Валідація полів команди (якщо обрано "У мене вже є команда")
    if (formData.participation_status === 'have_team') {
      if (!formData.team_name.trim()) {
        newErrors.team_name = 'Назва команди є обов\'язковою';
      }
      if (formData.team_name.length > 50) {
        newErrors.team_name = 'Назва команди не може перевищувати 50 символів';
      }
      if (!formData.team_composition.trim()) {
        newErrors.team_composition = 'Склад команди є обов\'язковим';
      }
    }

    // Необов'язкові поля з валідацією
    if (formData.bio && formData.bio.length > 300) {
      newErrors.bio = 'Опис не може перевищувати 300 символів';
    }
    if (formData.expected_role && formData.expected_role.length > 100) {
      newErrors.expected_role = 'Очікувана роль не може перевишувати 100 символів';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRoleChange = (role: string, checked: boolean) => {
    if (checked && formData.roles.length < 3) {
      setFormData(prev => ({
        ...prev,
        roles: [...prev.roles, role]
      }));
    } else if (!checked) {
      setFormData(prev => ({
        ...prev,
        roles: prev.roles.filter(r => r !== role)
      }));
    }
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        interested_categories: [...prev.interested_categories, category]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        interested_categories: prev.interested_categories.filter(c => c !== category)
      }));
    }
  };

  const handleLookingForRoleChange = (role: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        looking_for_roles: [...prev.looking_for_roles, role]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        looking_for_roles: prev.looking_for_roles.filter(r => r !== role)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: 'Помилка валідації',
        description: 'Будь ласка, виправте помилки у формі',
        variant: 'destructive'
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Розділяємо ПІБ на частини
      const nameParts = formData.full_name.trim().split(' ');
      const first_name = nameParts[0] || '';
      const last_name = nameParts.slice(1).join(' ') || '';

      const profileData = {
        first_name,
        last_name,
        phone: formData.phone,
        email: formData.email,
        telegram: formData.telegram,
        discord: formData.discord,
        bio: formData.bio,
        skills: formData.skills,
        participation_status: formData.participation_status,
        roles: formData.roles,
        experience_level: formData.experience_level,
        portfolio_url: formData.portfolio_url,
        location: formData.location,
        ready_to_lead: formData.ready_to_lead === 'Так',
        interested_categories: formData.interested_categories,
        // Додаткові поля для команди
        existing_team_name: formData.participation_status === 'have_team' ? formData.team_name : null,
        team_description: formData.participation_status === 'have_team' ? formData.team_description : null,
        looking_for_roles: formData.participation_status === 'have_team' ? formData.looking_for_roles : []
      };
      
      const { error } = await completeProfile(profileData);
      
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

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {profile?.is_profile_complete ? 'Редагування профілю' : 'Завершіть свій профіль'}
          </h1>
          <p className="text-foreground-secondary">
            {profile?.is_profile_complete 
              ? 'Оновіть інформацію про себе'
              : 'Заповніть інформацію про себе, щоб інші учасники могли знайти вас'
            }
          </p>
        </div>

        <Card className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <User className="w-5 h-5" />
              Реєстраційна форма
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Обов'язкові поля */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Обов'язкові поля
                </h3>

                {/* ПІБ */}
                <div className="space-y-2">
                  <Label htmlFor="full-name">
                    <User className="w-4 h-4 inline mr-2" />
                    ПІБ *
                  </Label>
                  <Input
                    id="full-name"
                    type="text"
                    placeholder="Як у документах / LinkedIn"
                    value={formData.full_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                    className={errors.full_name ? "border-destructive" : ""}
                  />
                  {errors.full_name && <p className="text-sm text-destructive">{errors.full_name}</p>}
                </div>

                {/* E-mail */}
                <div className="space-y-2">
                  <Label htmlFor="email">
                    <Mail className="w-4 h-4 inline mr-2" />
                    E-mail *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Сюди надсилатимемо підтвердження та інструкції"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-sm text-muted-foreground">
                    E-mail підтягується автоматично з вашого акаунту
                  </p>
                </div>

                {/* Контакти */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Номер телефону *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+380123456789"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className={errors.phone ? "border-destructive" : ""}
                    />
                    {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telegram">
                      <MessageCircle className="w-4 h-4 inline mr-2" />
                      Telegram *
                    </Label>
                    <Input
                      id="telegram"
                      type="text"
                      placeholder="@username"
                      value={formData.telegram}
                      onChange={(e) => setFormData(prev => ({ ...prev, telegram: e.target.value }))}
                      className={errors.telegram ? "border-destructive" : ""}
                    />
                    {errors.telegram && <p className="text-sm text-destructive">{errors.telegram}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discord">
                      <MessageCircle className="w-4 h-4 inline mr-2" />
                      Discord *
                    </Label>
                    <Input
                      id="discord"
                      type="text"
                      placeholder="username#1234"
                      value={formData.discord}
                      onChange={(e) => setFormData(prev => ({ ...prev, discord: e.target.value }))}
                      className={errors.discord ? "border-destructive" : ""}
                    />
                    {errors.discord && <p className="text-sm text-destructive">{errors.discord}</p>}
                  </div>
                </div>

                 {/* Статус участі */}
                <div className="space-y-2">
                  <Label>
                    <Users className="w-4 h-4 inline mr-2" />
                    Статус участі *
                  </Label>
                  <RadioGroup
                    value={formData.participation_status}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, participation_status: value }))}
                    className="flex flex-col gap-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="looking_for_team" id="looking_for_team" />
                      <Label htmlFor="looking_for_team">Шукаю команду</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="have_team" id="have_team" />
                      <Label htmlFor="have_team">У мене вже є команда</Label>
                    </div>
                  </RadioGroup>
                  {errors.participation_status && <p className="text-sm text-destructive">{errors.participation_status}</p>}
                </div>

                {/* Динамічний блок для реєстрації команди */}
                {formData.participation_status === 'have_team' && (
                  <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/30 animate-accordion-down">
                    <h4 className="font-medium text-foreground flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Інформація про команду
                    </h4>

                    {/* Назва команди */}
                    <div className="space-y-2">
                      <Label htmlFor="team_name">
                        Назва команди *
                      </Label>
                      <Input
                        id="team_name"
                        type="text"
                        placeholder="Введіть назву вашої команди"
                        value={formData.team_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, team_name: e.target.value }))}
                        maxLength={50}
                        className={errors.team_name ? "border-destructive" : ""}
                      />
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          {formData.team_name.length}/50 символів
                        </span>
                        {errors.team_name && <p className="text-sm text-destructive">{errors.team_name}</p>}
                      </div>
                    </div>

                    {/* Склад команди */}
                    <div className="space-y-2">
                      <Label htmlFor="team_composition">
                        Склад команди *
                      </Label>
                      <Textarea
                        id="team_composition"
                        placeholder="Вкажіть список учасників: ім'я + e-mail + роль кожного. Мінімум 2 учасники. Ви можете додати інших пізніше."
                        value={formData.team_composition}
                        onChange={(e) => setFormData(prev => ({ ...prev, team_composition: e.target.value }))}
                        rows={4}
                        className={errors.team_composition ? "border-destructive" : ""}
                      />
                      {errors.team_composition && <p className="text-sm text-destructive">{errors.team_composition}</p>}
                    </div>

                    {/* Інструкція про капітана */}
                    <div className="p-3 bg-muted rounded-md">
                      <p className="text-sm text-muted-foreground">
                        <strong>Капітан команди:</strong> Вкажіть у списку вище, хто є капітаном.
                      </p>
                    </div>

                    {/* Кого шукаємо в команду */}
                    <div className="space-y-3">
                      <Label>
                        Кого шукаємо в команду
                      </Label>
                      
                      {/* Ролі */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Ролі:</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {roleOptions.map((role) => (
                            <div key={role} className="flex items-center space-x-2">
                              <Checkbox
                                id={`looking-for-${role}`}
                                checked={formData.looking_for_roles.includes(role)}
                                onCheckedChange={(checked) => handleLookingForRoleChange(role, checked as boolean)}
                              />
                              <Label htmlFor={`looking-for-${role}`} className="text-sm">{role}</Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Короткий опис */}
                      <div className="space-y-2">
                        <Label htmlFor="team_description">
                          Короткий опис:
                        </Label>
                        <Textarea
                          id="team_description"
                          placeholder="Опишіть, яких людей ви шукаєте, які навички потрібні..."
                          value={formData.team_description}
                          onChange={(e) => setFormData(prev => ({ ...prev, team_description: e.target.value }))}
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Ролі */}
                <div className="space-y-2">
                  <Label>
                    <Briefcase className="w-4 h-4 inline mr-2" />
                    Ролі * (не більше 3)
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {roleOptions.map((role) => (
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
                  {errors.roles && <p className="text-sm text-destructive">{errors.roles}</p>}
                  <p className="text-sm text-muted-foreground">
                    Обрано: {formData.roles.length}/3
                  </p>
                </div>

                {/* Навички */}
                <div className="space-y-2">
                  <Label>
                    <Award className="w-4 h-4 inline mr-2" />
                    Навички *
                  </Label>
                  <SkillsSelector
                    value={formData.skills}
                    onChange={(skills) => setFormData(prev => ({ ...prev, skills }))}
                    error={errors.skills}
                  />
                </div>

                {/* Рівень */}
                <div className="space-y-2">
                  <Label>
                    <Award className="w-4 h-4 inline mr-2" />
                    Рівень *
                  </Label>
                  <RadioGroup
                    value={formData.experience_level}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, experience_level: value }))}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Початковий" id="beginner" />
                      <Label htmlFor="beginner">Початковий</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Середній" id="intermediate" />
                      <Label htmlFor="intermediate">Середній</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Досвідчений" id="experienced" />
                      <Label htmlFor="experienced">Досвідчений</Label>
                    </div>
                  </RadioGroup>
                  {errors.experience_level && <p className="text-sm text-destructive">{errors.experience_level}</p>}
                </div>

                {/* Посилання */}
                <div className="space-y-2">
                  <Label htmlFor="portfolio">
                    <Link className="w-4 h-4 inline mr-2" />
                    Посилання *
                  </Label>
                  <Input
                    id="portfolio"
                    type="url"
                    placeholder="GitHub / LinkedIn / портфоліо"
                    value={formData.portfolio_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, portfolio_url: e.target.value }))}
                    className={errors.portfolio_url ? "border-destructive" : ""}
                  />
                  {errors.portfolio_url && <p className="text-sm text-destructive">{errors.portfolio_url}</p>}
                </div>

                {/* Згоди */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">Згоди *</Label>
                  
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="rules_consent"
                        checked={formData.rules_consent}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, rules_consent: checked as boolean }))}
                      />
                      <Label htmlFor="rules_consent" className="text-sm leading-relaxed">
                        Погоджуюсь із Правилами участі
                      </Label>
                    </div>
                    {errors.rules_consent && <p className="text-sm text-destructive ml-6">{errors.rules_consent}</p>}

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="privacy_consent"
                        checked={formData.privacy_consent}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, privacy_consent: checked as boolean }))}
                      />
                      <Label htmlFor="privacy_consent" className="text-sm leading-relaxed">
                        Погоджуюсь із Політикою конфіденційності
                      </Label>
                    </div>
                    {errors.privacy_consent && <p className="text-sm text-destructive ml-6">{errors.privacy_consent}</p>}

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="email_consent"
                        checked={formData.email_consent}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, email_consent: checked as boolean }))}
                      />
                      <Label htmlFor="email_consent" className="text-sm leading-relaxed">
                        Погоджуюсь отримувати e-mail-сповіщення щодо хакатону
                      </Label>
                    </div>
                    {errors.email_consent && <p className="text-sm text-destructive ml-6">{errors.email_consent}</p>}
                  </div>
                </div>
              </div>

              {/* Необов'язкові поля */}
              <div className="space-y-6 pt-6 border-t">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Необов'язкові поля
                </h3>

                {/* Про себе */}
                <div className="space-y-2">
                  <Label htmlFor="bio">
                    <FileText className="w-4 h-4 inline mr-2" />
                    Коротко про себе
                  </Label>
                  <Textarea
                    id="bio"
                    placeholder="Розкажіть коротко про себе, свій досвід та цілі..."
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                    maxLength={300}
                    className={errors.bio ? "border-destructive" : ""}
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {formData.bio.length}/300 символів
                    </span>
                    {errors.bio && <p className="text-sm text-destructive">{errors.bio}</p>}
                  </div>
                </div>

                {/* Часовий пояс */}
                <div className="space-y-2">
                  <Label htmlFor="timezone">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Часовий пояс / доступність
                  </Label>
                  <Input
                    id="timezone"
                    type="text"
                    placeholder="Коли вам зручно бути на зв'язку (в будні/вихідні)"
                    value={formData.timezone}
                    onChange={(e) => setFormData(prev => ({ ...prev, timezone: e.target.value }))}
                  />
                </div>

                {/* Локація */}
                <div className="space-y-2">
                  <Label htmlFor="location">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Локація (країна/місто)
                  </Label>
                  <Input
                    id="location"
                    type="text"
                    placeholder="Київ, Україна"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>

                {/* Готовність бути капітаном */}
                <div className="space-y-2">
                  <Label>
                    <Users className="w-4 h-4 inline mr-2" />
                    Готовність бути капітаном
                  </Label>
                  <RadioGroup
                    value={formData.ready_to_lead}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, ready_to_lead: value }))}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Так" id="lead_yes" />
                      <Label htmlFor="lead_yes">Так</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Ні" id="lead_no" />
                      <Label htmlFor="lead_no">Ні</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Очікувана роль у команді */}
                <div className="space-y-2">
                  <Label htmlFor="expected_role">
                    <Target className="w-4 h-4 inline mr-2" />
                    Очікувана роль у команді
                  </Label>
                  <Input
                    id="expected_role"
                    type="text"
                    placeholder="Опишіть, яку роль ви хочете виконувати в команді"
                    value={formData.expected_role}
                    onChange={(e) => setFormData(prev => ({ ...prev, expected_role: e.target.value }))}
                    maxLength={100}
                    className={errors.expected_role ? "border-destructive" : ""}
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {formData.expected_role.length}/100 символів
                    </span>
                    {errors.expected_role && <p className="text-sm text-destructive">{errors.expected_role}</p>}
                  </div>
                </div>

                {/* Цікаві кейси */}
                <div className="space-y-2">
                  <Label>
                    <Target className="w-4 h-4 inline mr-2" />
                    Хочу працювати над кейсами
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {categoryOptions.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category}`}
                          checked={formData.interested_categories.includes(category)}
                          onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                        />
                        <Label htmlFor={`category-${category}`} className="text-sm">{category}</Label>
                      </div>
                    ))}
                  </div>
                </div>
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