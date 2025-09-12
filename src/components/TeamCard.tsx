import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Users, UserPlus, Crown } from "lucide-react";
import type { Team } from "@/hooks/useTeams";

interface TeamCardProps {
  team: Team;
  showJoinAction?: boolean;
  onJoinTeam?: () => void;
}

export default function TeamCard({ team, showJoinAction = false, onJoinTeam }: TeamCardProps) {
  const statusColors: Record<string, string> = {
    'формується': 'bg-amber-500',
    'готова': 'bg-green-500',
    'учасник хакатону': 'bg-blue-500',
  };

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
                className={`${statusColors[team.status || 'формується']} text-white border-none`}
              >
                {team.status || 'формується'}
              </Badge>
              <div className="flex items-center text-sm text-foreground-secondary">
                <Users className="w-4 h-4 mr-1" />
                {team.member_count || 1}/{(team.looking_for?.length || 0) + (team.member_count || 1)}
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
        {team.captain && (
          <div className="mb-3">
            <h4 className="text-xs font-medium text-foreground-secondary mb-2 flex items-center gap-1">
              <Crown className="w-3 h-3" />
              Капітан
            </h4>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium">
                  {team.captain.first_name?.[0]}{team.captain.last_name?.[0]}
                </span>
              </div>
              <span className="text-sm font-medium">
                {team.captain.first_name} {team.captain.last_name}
              </span>
            </div>
          </div>
        )}

        {/* Members */}
        {team.members && team.members.length > 0 && (
          <div className="mb-3">
            <h4 className="text-xs font-medium text-foreground-secondary mb-2">
              Учасники ({team.members.length})
            </h4>
            <div className="flex -space-x-2">
              {team.members.slice(0, 3).map((member, index) => (
                <div 
                  key={member.user_id}
                  className="w-8 h-8 rounded-full bg-secondary border-2 border-card flex items-center justify-center text-xs font-medium"
                  title={`${member.first_name} ${member.last_name}`}
                >
                  {member.first_name?.[0]}{member.last_name?.[0]}
                </div>
              ))}
              {team.members.length > 3 && (
                <div className="w-8 h-8 rounded-full bg-secondary border-2 border-card flex items-center justify-center text-xs font-medium">
                  +{team.members.length - 3}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Looking for */}
        {team.looking_for && team.looking_for.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-foreground-secondary mb-2">
              Шукаємо
            </h4>
            <div className="flex flex-wrap gap-1">
              {team.looking_for.map((role, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {role}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        {showJoinAction && team.looking_for && team.looking_for.length > 0 && (
          <Button 
            size="sm" 
            variant="default"
            onClick={onJoinTeam}
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