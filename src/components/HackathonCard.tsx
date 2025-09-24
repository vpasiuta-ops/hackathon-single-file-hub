import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Calendar, MapPin, Users, Trophy, Clock } from "lucide-react";
import type { DbHackathon } from "@/hooks/useHackathons";

interface HackathonCardProps {
  hackathon: DbHackathon;
  onViewDetails?: (id: string) => void;
  onRegister?: (id: string) => void;
  showActions?: boolean;
}

const statusColors = {
  'Активний': 'bg-green-500',
  'Майбутній': 'bg-blue-500', 
  'Завершений': 'bg-gray-500',
};

export default function HackathonCard({ hackathon, onViewDetails, onRegister, showActions = true }: HackathonCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uk-UA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getDaysRemaining = (dateString: string) => {
    const diff = new Date(dateString).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const daysRemaining = hackathon.status === 'Майбутній' 
    ? getDaysRemaining(hackathon.start_date)
    : hackathon.status === 'Активний'
    ? getDaysRemaining(hackathon.end_date)
    : null;

  return (
    <Card className="bg-gradient-card border-border hover:shadow-hover transition-all duration-300 group h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {hackathon.title}
            </h3>
            <p className="text-sm text-foreground-secondary mt-1">
              {hackathon.short_description}
            </p>
          </div>
          <Badge 
            variant="secondary" 
            className={`${statusColors[hackathon.status]} text-white border-none flex-shrink-0`}
          >
            {hackathon.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0 flex-1">
        <p className="text-sm text-foreground-secondary mb-4 line-clamp-3">
          {hackathon.description}
        </p>

        <div className="space-y-3">
          {/* Dates */}
          <div className="flex items-start gap-2 text-sm">
            <Calendar className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-foreground">
                {formatDate(hackathon.start_date)} - {formatDate(hackathon.end_date)}
              </div>
              {daysRemaining !== null && (
                <div className="text-foreground-secondary flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {daysRemaining > 0 
                    ? `${daysRemaining} днів залишилось`
                    : hackathon.status === 'Активний' 
                    ? 'Завершується сьогодні'
                    : 'Розпочався'
                  }
                </div>
              )}
            </div>
          </div>

          {/* Team size */}
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-foreground">
              Команди до {hackathon.max_team_size} осіб
            </span>
          </div>

          {/* Prizes */}
          {hackathon.prizes.length > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <Trophy className="w-4 h-4 text-primary" />
              <span className="text-foreground">
                Призовий фонд: {hackathon.prize_fund || hackathon.prizes[0]?.amount || 'TBA'}
              </span>
            </div>
          )}

          {/* Partners */}
          {hackathon.partners.length > 0 && (
            <div className="mt-3">
              <div className="text-xs font-medium text-foreground-secondary mb-2">Партнери</div>
              <div className="flex flex-wrap gap-1">
                {hackathon.partners.slice(0, 3).map((partner, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {partner}
                  </Badge>
                ))}
                {hackathon.partners.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{hackathon.partners.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>

      {showActions && (
        <CardFooter className="pt-0 flex gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onViewDetails?.(hackathon.id)}
            className="flex-1"
          >
            Детальніше
          </Button>
          {hackathon.status !== 'Завершений' && (
            <Button 
              variant="default" 
              size="sm"
              onClick={() => onRegister?.(hackathon.id)}
              className="flex-1"
            >
              {hackathon.status === 'Активний' ? 'Взяти участь' : 'Зареєструватися'}
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}