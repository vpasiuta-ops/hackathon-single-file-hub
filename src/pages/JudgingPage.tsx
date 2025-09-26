import { useAuth } from '@/hooks/useAuth';
import { useJudgeAssignments } from '@/hooks/useJudges';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, Trophy } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { formatDistanceToNow, parseISO, isFuture, isPast } from 'date-fns';
import { uk } from 'date-fns/locale';

export default function JudgingPage() {
  const { userRole, user, loading: authLoading } = useAuth();
  const { assignments, loading, error } = useJudgeAssignments(user?.id);
  const navigate = useNavigate();

  // Redirect if user is not a judge
  if (!authLoading && userRole !== 'judge') {
    return <Navigate to="/" replace />;
  }

  const getHackathonStatusBadge = (hackathon: any) => {
    if (!hackathon) return null;
    
    const startDate = parseISO(hackathon.start_date);
    const endDate = parseISO(hackathon.end_date);
    const now = new Date();

    if (isFuture(startDate)) {
      return <Badge variant="outline">Готується</Badge>;
    } else if (isPast(endDate)) {
      return <Badge variant="secondary">Завершено</Badge>;
    } else {
      return <Badge variant="default">Активний</Badge>;
    }
  };

  const getTimeStatus = (hackathon: any) => {
    if (!hackathon) return '';
    
    const startDate = parseISO(hackathon.start_date);
    const endDate = parseISO(hackathon.end_date);
    const now = new Date();

    if (isFuture(startDate)) {
      return `Почнється ${formatDistanceToNow(startDate, { 
        addSuffix: true, 
        locale: uk 
      })}`;
    } else if (isPast(endDate)) {
      return `Завершився ${formatDistanceToNow(endDate, { 
        addSuffix: true, 
        locale: uk 
      })}`;
    } else {
      return `Завершується ${formatDistanceToNow(endDate, { 
        addSuffix: true, 
        locale: uk 
      })}`;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground-secondary">Завантаження кабінету судді...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Помилка завантаження: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Trophy className="h-8 w-8 text-primary" />
            Кабінет судді
          </h1>
          <p className="text-muted-foreground mt-2">
            Управління та оцінювання хакатонів
          </p>
        </div>
      </div>

      {assignments.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Призначень поки немає</h3>
            <p className="text-muted-foreground mb-4">
              Ви ще не призначені суддею жодного хакатону. 
              Зверніться до адміністратора для отримання призначень.
            </p>
            <Button onClick={() => navigate('/')} variant="outline">
              Повернутися на головну
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {assignments.map((assignment) => (
            <Card key={assignment.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">
                    {assignment.hackathon?.title || 'Невідомий хакатон'}
                  </CardTitle>
                  {getHackathonStatusBadge(assignment.hackathon)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  {assignment.hackathon?.description || 'Опис недоступний'}
                </p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {assignment.hackathon?.start_date 
                        ? new Date(assignment.hackathon.start_date).toLocaleDateString('uk-UA')
                        : 'Дата не вказана'
                      }
                      {assignment.hackathon?.end_date && 
                        ` - ${new Date(assignment.hackathon.end_date).toLocaleDateString('uk-UA')}`
                      }
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{getTimeStatus(assignment.hackathon)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Призначено {formatDistanceToNow(parseISO(assignment.assigned_at), { 
                        addSuffix: true, 
                        locale: uk 
                      })}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <Button 
                    className="w-full" 
                    onClick={() => navigate(`/hackathons/${assignment.hackathon_id}`)}
                    disabled={!assignment.hackathon}
                  >
                    Переглянути хакатон
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}