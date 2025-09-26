import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  Trophy, 
  Clock,
  MapPin,
  ExternalLink,
  User,
  Target,
  Award,
  CheckCircle2,
  FileText,
  Loader2
} from "lucide-react";
import { useHackathon } from "@/hooks/useHackathons";
import type { UserRole } from "@/types/auth";
import { useAuth } from '@/hooks/useAuth';
import { useTeams } from '@/hooks/useTeams';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface HackathonDetailsPageProps {
  hackathonId: string | null;
  currentRole: UserRole;
  onBack: () => void;
}

export default function HackathonDetailsPage({ hackathonId, currentRole, onBack }: HackathonDetailsPageProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  
  const { hackathon, loading, error } = useHackathon(hackathonId);
  const { user } = useAuth();
  const { userTeam, isUserTeamCaptain } = useTeams();
  const { toast } = useToast();

  // Check if team is registered for this hackathon
  useEffect(() => {
    const checkRegistration = async () => {
      if (!userTeam) return;
      
      const { data } = await supabase
        .from('hackathon_registrations')
        .select('id')
        .eq('team_id', userTeam.id)
        .eq('hackathon_id', hackathonId)
        .maybeSingle();
      
      setIsRegistered(!!data);
    };

    checkRegistration();
  }, [userTeam, hackathonId]);

  const handleRegisterTeam = async () => {
    if (!user || !userTeam || !isUserTeamCaptain) {
      toast({
        title: 'Помилка',
        description: 'Тільки капітан команди може зареєструвати команду',
        variant: 'destructive'
      });
      return;
    }

    setIsRegistering(true);
    
    const { error } = await supabase
      .from('hackathon_registrations')
      .insert([{
        hackathon_id: hackathonId,
        team_id: userTeam.id,
        registered_by: user.id
      }]);

    if (error) {
      toast({
        title: 'Помилка',
        description: 'Не вдалося зареєструвати команду',
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Успішно!',
        description: 'Команду зареєстровано на хакатон'
      });
      setIsRegistered(true);
    }
    
    setIsRegistering(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Завантажуємо хакатон...
          </h1>
        </div>
      </div>
    );
  }

  if (error || !hackathon) {
    return (
      <div className="min-h-screen bg-background py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {error || 'Хакатон не знайдено'}
          </h1>
          <Button onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Повернутись назад
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uk-UA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const statusColors = {
    'Активний': 'bg-green-500',
    'Майбутній': 'bg-blue-500', 
    'Завершений': 'bg-gray-500',
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-hero py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад до хакатонів
          </Button>
          
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Badge 
                  className={`${statusColors[hackathon.status]} text-white border-none`}
                >
                  {hackathon.status}
                </Badge>
                {hackathon.status === 'Активний' && (
                  <Badge variant="outline" className="border-green-500 text-green-500">
                    <Clock className="w-3 h-3 mr-1" />
                    Триває зараз
                  </Badge>
                )}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                {hackathon.title}
              </h1>
              
              <p className="text-lg text-foreground-secondary max-w-3xl">
                {hackathon.description}
              </p>
              
              <div className="flex flex-wrap gap-4 mt-6">
                <div className="flex items-center gap-2 text-foreground-secondary">
                  <Calendar className="w-5 h-5" />
                  <span>{formatDate(hackathon.start_date)} - {formatDate(hackathon.end_date)}</span>
                </div>
                <div className="flex items-center gap-2 text-foreground-secondary">
                  <Users className="w-5 h-5" />
                  <span>Команди до {hackathon.max_team_size} осіб</span>
                </div>
                {(hackathon.prize_fund || hackathon.prizes.length > 0) && (
                  <div className="flex items-center gap-2 text-foreground-secondary">
                    <Trophy className="w-5 h-5" />
                    <span>Призовий фонд: {hackathon.prize_fund || hackathon.prizes[0]?.amount}</span>
                  </div>
                )}
              </div>
            </div>
            
            {hackathon.status !== 'Завершений' && user && (
              <div className="flex-shrink-0">
                <Card className="bg-gradient-card border-primary/20">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-4">
                      {hackathon.status === 'Активний' ? 'Взяти участь' : 'Зареєструватися'}
                    </h3>
                    
                    {!userTeam ? (
                      <div className="text-center">
                        <p className="text-sm text-foreground-secondary mb-3">
                          Для участі потрібна команда
                        </p>
                        <Button variant="outline" size="lg" className="w-full" disabled>
                          Створіть команду спочатку
                        </Button>
                      </div>
                    ) : !isUserTeamCaptain ? (
                      <div className="text-center">
                        <p className="text-sm text-foreground-secondary mb-3">
                          Тільки капітан може зареєструвати команду
                        </p>
                        <Button variant="outline" size="lg" className="w-full" disabled>
                          Тільки для капітанів
                        </Button>
                      </div>
                    ) : isRegistered ? (
                      <div className="text-center">
                        <Badge className="bg-green-500 text-white mb-3">
                          Команда зареєстрована
                        </Badge>
                        <p className="text-sm text-foreground-secondary">
                          Ваша команда "{userTeam.name}" вже зареєстрована
                        </p>
                      </div>
                    ) : (
                      <>
                        <Button 
                          variant="hero" 
                          size="lg" 
                          className="w-full"
                          onClick={handleRegisterTeam}
                          disabled={isRegistering}
                        >
                          {isRegistering ? 'Реєструємо...' : 
                           hackathon.status === 'Активний' ? 'Зареєструвати команду' : 'Зареєструвати команду'}
                        </Button>
                        <p className="text-xs text-foreground-secondary mt-2 text-center">
                          Команда: {userTeam.name}
                        </p>
                      </>
                    )}
                    
                    <p className="text-xs text-foreground-secondary mt-2 text-center">
                      Дедлайн: {formatDate(hackathon.registration_deadline)}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Таймлайн події
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {hackathon.timeline.map((item: any, index: number) => (
                    <div key={item.id || index} className="flex items-center gap-4">
                      <div className={`
                        w-4 h-4 rounded-full flex-shrink-0
                        ${item.is_current ? 'bg-primary animate-pulse' : 'bg-secondary'}
                      `} />
                      <div className="flex-1">
                        <div className="font-medium text-foreground">
                          {item.name}
                        </div>
                        <div className="text-sm text-foreground-secondary">
                          {item.start_datetime && item.end_datetime 
                            ? `${new Date(item.start_datetime).toLocaleString('uk-UA')} - ${new Date(item.end_datetime).toLocaleString('uk-UA')}`
                            : 'Час буде оголошено'
                          }
                        </div>
                      </div>
                      {item.is_current && (
                        <Badge variant="secondary" className="bg-primary text-white">
                          Поточний етап
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cases */}
            {hackathon.partner_cases.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Кейси від партнерів
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {hackathon.partner_cases.map((case_: any, index: number) => (
                      <Card key={case_.id || index} className="bg-background-secondary">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="font-semibold text-foreground">{case_.name}</h4>
                            <Badge className="bg-green-500 text-white">
                              {case_.reward}
                            </Badge>
                          </div>
                          <p className="text-foreground-secondary mb-3">
                            {case_.description}
                          </p>
                          <div className="text-sm text-primary font-medium">
                            Партнер: {case_.partner}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Rules */}
            {hackathon.rules_and_requirements && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Правила та вимоги
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-foreground-secondary whitespace-pre-wrap">
                      {hackathon.rules_and_requirements}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Prizes */}
            {hackathon.prizes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    Призи
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {hackathon.prizes.map((prize: any, index: number) => (
                      <div key={prize.id || index} className="flex justify-between items-center p-3 bg-background-secondary rounded-lg">
                        <div>
                          <div className="font-medium text-foreground">{prize.place}</div>
                          <div className="text-sm text-foreground-secondary">{prize.description}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-primary">{prize.amount}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Criteria */}
            {hackathon.evaluation_criteria.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Критерії оцінки
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {hackathon.evaluation_criteria.map((criterion: any, index: number) => (
                      <div key={criterion.id || index}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-foreground">{criterion.name}</span>
                          <span className="text-sm text-foreground-secondary">{criterion.weight}%</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2 mt-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${criterion.weight}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Partners */}
            {hackathon.partners.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Партнери</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {hackathon.partners.map((partner, index) => (
                      <div 
                        key={index}
                        className="p-3 bg-background-secondary rounded-lg text-center text-sm font-medium text-foreground hover:bg-secondary-hover transition-colors"
                      >
                        {partner}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Judges */}
            {hackathon.jury.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Журі
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {hackathon.jury.map((judge: any, index: number) => (
                      <div key={judge.id || index} className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center overflow-hidden">
                          {judge.photo ? (
                            <img src={judge.photo} alt={judge.name} className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{judge.name}</div>
                          <div className="text-sm text-foreground-secondary">{judge.position}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}