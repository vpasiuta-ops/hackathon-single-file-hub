import { useState } from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus, GripVertical } from 'lucide-react';

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

interface HackathonFormData {
  title: string;
  description: string;
  status: string;
  start_date: string;
  end_date: string;
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

interface HackathonFormDialogProps {
  title: string;
  formData: HackathonFormData;
  setFormData: (data: HackathonFormData) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function HackathonFormDialog({
  title,
  formData,
  setFormData,
  onSubmit,
  onCancel,
  isSubmitting = false
}: HackathonFormDialogProps) {
  
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Timeline handlers
  const addTimelineItem = () => {
    const newItem: TimelineItem = {
      id: generateId(),
      name: '',
      start_datetime: '',
      end_datetime: '',
      is_current: false
    };
    setFormData({ ...formData, timeline: [...formData.timeline, newItem] });
  };

  const removeTimelineItem = (id: string) => {
    setFormData({
      ...formData,
      timeline: formData.timeline.filter(item => item.id !== id)
    });
  };

  const updateTimelineItem = (id: string, field: keyof TimelineItem, value: any) => {
    setFormData({
      ...formData,
      timeline: formData.timeline.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    });
  };

  // Prize handlers
  const addPrize = () => {
    const newPrize: Prize = {
      id: generateId(),
      place: '',
      description: '',
      amount: ''
    };
    setFormData({ ...formData, prizes: [...formData.prizes, newPrize] });
  };

  const removePrize = (id: string) => {
    setFormData({
      ...formData,
      prizes: formData.prizes.filter(prize => prize.id !== id)
    });
  };

  const updatePrize = (id: string, field: keyof Prize, value: string) => {
    setFormData({
      ...formData,
      prizes: formData.prizes.map(prize =>
        prize.id === id ? { ...prize, [field]: value } : prize
      )
    });
  };

  // Partner case handlers
  const addPartnerCase = () => {
    const newCase: PartnerCase = {
      id: generateId(),
      name: '',
      description: '',
      partner: '',
      reward: ''
    };
    setFormData({ ...formData, partner_cases: [...formData.partner_cases, newCase] });
  };

  const removePartnerCase = (id: string) => {
    setFormData({
      ...formData,
      partner_cases: formData.partner_cases.filter(case_ => case_.id !== id)
    });
  };

  const updatePartnerCase = (id: string, field: keyof PartnerCase, value: string) => {
    setFormData({
      ...formData,
      partner_cases: formData.partner_cases.map(case_ =>
        case_.id === id ? { ...case_, [field]: value } : case_
      )
    });
  };

  // Evaluation criteria handlers
  const addEvaluationCriterion = () => {
    const newCriterion: EvaluationCriterion = {
      id: generateId(),
      name: '',
      weight: 0
    };
    setFormData({ ...formData, evaluation_criteria: [...formData.evaluation_criteria, newCriterion] });
  };

  const removeEvaluationCriterion = (id: string) => {
    setFormData({
      ...formData,
      evaluation_criteria: formData.evaluation_criteria.filter(criterion => criterion.id !== id)
    });
  };

  const updateEvaluationCriterion = (id: string, field: keyof EvaluationCriterion, value: string | number) => {
    setFormData({
      ...formData,
      evaluation_criteria: formData.evaluation_criteria.map(criterion =>
        criterion.id === id ? { ...criterion, [field]: value } : criterion
      )
    });
  };

  // Jury handlers
  const addJuryMember = () => {
    const newMember: JuryMember = {
      id: generateId(),
      name: '',
      position: '',
      photo: ''
    };
    setFormData({ ...formData, jury: [...formData.jury, newMember] });
  };

  const removeJuryMember = (id: string) => {
    setFormData({
      ...formData,
      jury: formData.jury.filter(member => member.id !== id)
    });
  };

  const updateJuryMember = (id: string, field: keyof JuryMember, value: string) => {
    setFormData({
      ...formData,
      jury: formData.jury.map(member =>
        member.id === id ? { ...member, [field]: value } : member
      )
    });
  };

  // Partners handlers
  const addPartner = () => {
    setFormData({ ...formData, partners: [...formData.partners, ''] });
  };

  const removePartner = (index: number) => {
    setFormData({
      ...formData,
      partners: formData.partners.filter((_, i) => i !== index)
    });
  };

  const updatePartner = (index: number, value: string) => {
    setFormData({
      ...formData,
      partners: formData.partners.map((partner, i) => i === index ? value : partner)
    });
  };

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Основне</TabsTrigger>
          <TabsTrigger value="timeline">Таймлайн</TabsTrigger>
          <TabsTrigger value="content">Контент</TabsTrigger>
          <TabsTrigger value="people">Люди</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Основна інформація</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Назва хакатону *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Назва хакатону"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Статус</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Чернетка">Чернетка</SelectItem>
                      <SelectItem value="Активний">Активний</SelectItem>
                      <SelectItem value="Триває зараз">Триває зараз</SelectItem>
                      <SelectItem value="Завершено">Завершено</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Дата початку *</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">Дата завершення *</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_team_size">Макс. розмір команди</Label>
                  <Input
                    id="max_team_size"
                    type="number"
                    min="1"
                    value={formData.max_team_size}
                    onChange={(e) => setFormData({ ...formData, max_team_size: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prize_fund">Загальний призовий фонд</Label>
                <Input
                  id="prize_fund"
                  value={formData.prize_fund}
                  onChange={(e) => setFormData({ ...formData, prize_fund: e.target.value })}
                  placeholder="напр., 100,000 грн"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Опис хакатону *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Детальний опис хакатону..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Таймлайн події
                <Button onClick={addTimelineItem} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Додати етап
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formData.timeline.map((item) => (
                  <Card key={item.id} className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <GripVertical className="h-4 w-4 text-gray-400 mt-2" />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeTimelineItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 space-y-2">
                        <Label>Назва етапу</Label>
                        <Input
                          value={item.name}
                          onChange={(e) => updateTimelineItem(item.id, 'name', e.target.value)}
                          placeholder="напр., Registration"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Дата і час початку</Label>
                        <Input
                          type="datetime-local"
                          value={item.start_datetime}
                          onChange={(e) => updateTimelineItem(item.id, 'start_datetime', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Дата і час кінця</Label>
                        <Input
                          type="datetime-local"
                          value={item.end_datetime}
                          onChange={(e) => updateTimelineItem(item.id, 'end_datetime', e.target.value)}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`current-${item.id}`}
                          checked={item.is_current}
                          onCheckedChange={(checked) => updateTimelineItem(item.id, 'is_current', checked)}
                        />
                        <Label htmlFor={`current-${item.id}`}>Поточний етап</Label>
                      </div>
                    </div>
                  </Card>
                ))}
                {formData.timeline.length === 0 && (
                  <p className="text-center text-gray-500 py-8">Етапи не додані</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Призи
                <Button onClick={addPrize} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Додати приз
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formData.prizes.map((prize) => (
                  <Card key={prize.id} className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Приз</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removePrize(prize.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Місце</Label>
                        <Input
                          value={prize.place}
                          onChange={(e) => updatePrize(prize.id, 'place', e.target.value)}
                          placeholder="1 місце"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Опис призу</Label>
                        <Input
                          value={prize.description}
                          onChange={(e) => updatePrize(prize.id, 'description', e.target.value)}
                          placeholder="Гран-прі + менторство"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Сума</Label>
                        <Input
                          value={prize.amount}
                          onChange={(e) => updatePrize(prize.id, 'amount', e.target.value)}
                          placeholder="100,000 грн"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
                {formData.prizes.length === 0 && (
                  <p className="text-center text-gray-500 py-8">Призи не додані</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Кейси від партнерів
                <Button onClick={addPartnerCase} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Додати кейс
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formData.partner_cases.map((case_) => (
                  <Card key={case_.id} className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Кейс від партнера</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removePartnerCase(case_.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Назва кейсу</Label>
                          <Input
                            value={case_.name}
                            onChange={(e) => updatePartnerCase(case_.id, 'name', e.target.value)}
                            placeholder="Назва кейсу"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Партнер</Label>
                          <Input
                            value={case_.partner}
                            onChange={(e) => updatePartnerCase(case_.id, 'partner', e.target.value)}
                            placeholder="Назва партнера"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Опис кейсу</Label>
                        <Textarea
                          value={case_.description}
                          onChange={(e) => updatePartnerCase(case_.id, 'description', e.target.value)}
                          placeholder="Детальний опис кейсу..."
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Нагорода за кейс</Label>
                        <Input
                          value={case_.reward}
                          onChange={(e) => updatePartnerCase(case_.id, 'reward', e.target.value)}
                          placeholder="50,000 грн"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
                {formData.partner_cases.length === 0 && (
                  <p className="text-center text-gray-500 py-8">Кейси не додані</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Критерії оцінки
                <Button onClick={addEvaluationCriterion} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Додати критерій
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formData.evaluation_criteria.map((criterion) => (
                  <Card key={criterion.id} className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Критерій оцінки</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeEvaluationCriterion(criterion.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Назва критерію</Label>
                        <Input
                          value={criterion.name}
                          onChange={(e) => updateEvaluationCriterion(criterion.id, 'name', e.target.value)}
                          placeholder="Інноваційність"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Вага у %</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={criterion.weight}
                          onChange={(e) => updateEvaluationCriterion(criterion.id, 'weight', Number(e.target.value))}
                          placeholder="25"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
                {formData.evaluation_criteria.length === 0 && (
                  <p className="text-center text-gray-500 py-8">Критерії не додані</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Правила та вимоги</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="rules">Правила та вимоги (можна використовувати Markdown)</Label>
                <Textarea
                  id="rules"
                  value={formData.rules_and_requirements}
                  onChange={(e) => setFormData({ ...formData, rules_and_requirements: e.target.value })}
                  placeholder="- Правило 1&#10;- Правило 2&#10;- Правило 3"
                  rows={8}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="people" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Партнери
                <Button onClick={addPartner} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Додати партнера
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formData.partners.map((partner, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={partner}
                      onChange={(e) => updatePartner(index, e.target.value)}
                      placeholder="Назва партнера"
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removePartner(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {formData.partners.length === 0 && (
                  <p className="text-center text-gray-500 py-8">Партнери не додані</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Журі
                <Button onClick={addJuryMember} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Додати члена журі
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formData.jury.map((member) => (
                  <Card key={member.id} className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Член журі</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeJuryMember(member.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Ім'я</Label>
                          <Input
                            value={member.name}
                            onChange={(e) => updateJuryMember(member.id, 'name', e.target.value)}
                            placeholder="Ім'я члена журі"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Посада/Опис</Label>
                          <Input
                            value={member.position}
                            onChange={(e) => updateJuryMember(member.id, 'position', e.target.value)}
                            placeholder="Експерт галузі"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>URL фото</Label>
                        <Input
                          value={member.photo || ''}
                          onChange={(e) => updateJuryMember(member.id, 'photo', e.target.value)}
                          placeholder="https://example.com/photo.jpg"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
                {formData.jury.length === 0 && (
                  <p className="text-center text-gray-500 py-8">Журі не додано</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <DialogFooter>
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Скасувати
        </Button>
        <Button onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Збереження...' : 'Зберегти хакатон'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}