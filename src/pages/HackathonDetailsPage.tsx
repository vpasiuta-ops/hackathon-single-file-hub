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
  FileText
} from "lucide-react";
import { hackathons } from "@/data/mockData";
import type { UserRole } from "@/data/mockData";
import { useAuth } from '@/hooks/useAuth';
import { useTeams } from '@/hooks/useTeams';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface HackathonDetailsPageProps {
  hackathonId: number | null;
  currentRole: UserRole;
  onBack: () => void;
}

export default function HackathonDetailsPage({ hackathonId, currentRole, onBack }: HackathonDetailsPageProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  
  const hackathon = hackathons.find(h => h.id === hackathonId);
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
        .eq('hackathon_id', hackathonId?.toString())
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
        hackathon_id: hackathonId?.toString(),
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

  if (!hackathon) {
    return (
      <div className="min-h-screen bg-background py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Хакатон не знайдено
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
                  <span>{formatDate(hackathon.startDate)} - {formatDate(hackathon.endDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-foreground-secondary">
                  <Users className="w-5 h-5" />
                  <span>Команди до {hackathon.maxTeamSize} осіб</span>
                </div>
                {hackathon.prizes.length > 0 && (
                  <div className="flex items-center gap-2 text-foreground-secondary">
                    <Trophy className="w-5 h-5" />
                    <span>Призовий фонд: {hackathon.prizes[0].amount}</span>
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
                      Дедлайн: {formatDate(hackathon.registrationDeadline)}
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
                  {Object.entries(hackathon.timeline).map(([key, value], index) => (
                    <div key={key} className="flex items-center gap-4">
                      <div className={`
                        w-4 h-4 rounded-full flex-shrink-0
                        ${index === 0 ? 'bg-primary animate-pulse' : 'bg-secondary'}
                      `} />
                      <div className="flex-1">
                        <div className="font-medium text-foreground capitalize">
                          {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </div>
                        <div className="text-sm text-foreground-secondary">{value}</div>
                      </div>
                      {index === 0 && (
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
            {hackathon.cases.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Кейси від партнерів
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {hackathon.cases.map((case_, index) => (
                      <Card key={case_.id} className="bg-background-secondary">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="font-semibold text-foreground">{case_.title}</h4>
                            <Badge className="bg-green-500 text-white">
                              {case_.prize}
                            </Badge>
                          </div>
                          <p className="text-foreground-secondary mb-3">
                            {case_.description}
                          </p>
                          <div className="text-sm text-primary font-medium">
                            Партнер: {case_.sponsor}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Rules */}
            {hackathon.rules.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Правила та вимоги
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {hackathon.rules.map((rule, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-foreground-secondary">{rule}</span>
                      </div>
                    ))}
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
                    {hackathon.prizes.map((prize, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-background-secondary rounded-lg">
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
            {hackathon.criteria.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Критерії оцінки
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {hackathon.criteria.map((criterion, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-foreground">{criterion.name}</span>
                          <span className="text-sm text-foreground-secondary">{criterion.weight}%</span>
                        </div>
                        <p className="text-sm text-foreground-secondary">{criterion.description}</p>
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
            {hackathon.judges.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Журі
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {hackathon.judges.map((judgeId, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">Суддя #{judgeId}</div>
                          <div className="text-sm text-foreground-secondary">Експерт галузі</div>
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