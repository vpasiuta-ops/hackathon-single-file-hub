import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Users, UserPlus, Crown } from "lucide-react";
import type { Team, User } from "@/data/mockData";

interface TeamCardProps {
  team: Team;
  members: User[];
  captain: User;
  showJoinAction?: boolean;
  onJoinTeam?: (teamId: number) => void;
}

const statusColors = {
  'формується': 'bg-amber-500',
  'готова': 'bg-green-500',
  'учасник хакатону': 'bg-blue-500',
};

export default function TeamCard({ team, members, captain, showJoinAction = false, onJoinTeam }: TeamCardProps) {
  return (
    <Card className="bg-gradient-card border-border hover:shadow-hover transition-all duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {team.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge 
                variant="secondary" 
                className={`${statusColors[team.status]} text-white border-none`}
              >
                {team.status}
              </Badge>
              <div className="flex items-center text-sm text-foreground-secondary">
                <Users className="w-4 h-4 mr-1" />
                {members.length}/{team.lookingFor.length + members.length}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-foreground-secondary mb-4 line-clamp-2">
          {team.description}
        </p>

        {/* Captain */}
        <div className="mb-3">
          <h4 className="text-xs font-medium text-foreground-secondary mb-2 flex items-center gap-1">
            <Crown className="w-3 h-3" />
            Капітан
          </h4>
          <div className="flex items-center gap-2">
            <img 
              src={captain.avatar} 
              alt={captain.name}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm font-medium">{captain.name}</span>
          </div>
        </div>

        {/* Members */}
        {members.length > 1 && (
          <div className="mb-3">
            <h4 className="text-xs font-medium text-foreground-secondary mb-2">
              Учасники ({members.length - 1})
            </h4>
            <div className="flex -space-x-2">
              {members.filter(m => m.id !== captain.id).slice(0, 3).map((member, index) => (
                <img 
                  key={member.id}
                  src={member.avatar} 
                  alt={member.name}
                  className="w-8 h-8 rounded-full border-2 border-card"
                  title={member.name}
                />
              ))}
              {members.length > 4 && (
                <div className="w-8 h-8 rounded-full bg-secondary border-2 border-card flex items-center justify-center text-xs font-medium">
                  +{members.length - 4}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Looking for */}
        {team.lookingFor.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-foreground-secondary mb-2">
              Шукаємо
            </h4>
            <div className="flex flex-wrap gap-1">
              {team.lookingFor.map((role, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {role}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        {showJoinAction && team.lookingFor.length > 0 && (
          <Button 
            size="sm" 
            variant="default"
            onClick={() => onJoinTeam?.(team.id)}
            className="w-full"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Подати заявку
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}