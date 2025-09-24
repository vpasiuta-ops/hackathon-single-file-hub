import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Github, Linkedin, Users, User as UserIcon, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import type { Profile } from "@/hooks/useProfiles";

interface UserCardProps {
  profile: Profile;
  showTeamActions?: boolean;
  onInviteToTeam?: (userId: string) => void;
}

const statusColors = {
  'looking_for_team': 'bg-green-500',
  'in_team': 'bg-blue-500',
  'ready': 'bg-purple-500',
  'unavailable': 'bg-gray-500',
};

const statusLabels = {
  'looking_for_team': 'шукаю команду',
  'in_team': 'в команді', 
  'ready': 'готовий',
  'unavailable': 'недоступний',
};

export default function UserCard({ profile, showTeamActions = false, onInviteToTeam }: UserCardProps) {
  const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(' ') || 'Користувач';
  const initials = [profile.first_name?.[0], profile.last_name?.[0]].filter(Boolean).join('').toUpperCase() || 'У';

  return (
    <Link to={`/participant/${profile.user_id}`} className="block">
      <Card className="bg-gradient-card border-border hover:shadow-hover transition-all duration-300 group cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                {fullName}
              </h3>
              {profile.experience_level && (
                <p className="text-sm text-foreground-secondary">
                  {profile.experience_level} досвіду
                </p>
              )}
              {profile.participation_status && (
                <Badge 
                  variant="secondary" 
                  className={`mt-1 ${statusColors[profile.participation_status as keyof typeof statusColors]} text-white border-none`}
                >
                  {statusLabels[profile.participation_status as keyof typeof statusLabels]}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {profile.bio && (
            <p className="text-sm text-foreground-secondary mb-3 line-clamp-2">
              {profile.bio}
            </p>
          )}

          <div className="space-y-2">
            {profile.roles && profile.roles.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-foreground-secondary mb-1">Ролі</h4>
                <div className="flex flex-wrap gap-1">
                  {profile.roles.slice(0, 2).map((role, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {role}
                    </Badge>
                  ))}
                  {profile.roles.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{profile.roles.length - 2}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {profile.skills && profile.skills.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-foreground-secondary mb-1">Навички</h4>
                <div className="flex flex-wrap gap-1">
                  {profile.skills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {profile.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{profile.skills.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-0 flex justify-between items-center">
          <div className="flex gap-2">
            {profile.portfolio_url && (
              <Button variant="ghost" size="icon" className="w-8 h-8">
                <ExternalLink className="w-4 h-4" />
              </Button>
            )}
          </div>

          {showTeamActions && profile.participation_status === 'looking_for_team' && (
            <Button 
              size="sm" 
              variant="default"
              onClick={(e) => {
                e.preventDefault();
                onInviteToTeam?.(profile.user_id);
              }}
            >
              <Users className="w-4 h-4 mr-1" />
              Запросити
            </Button>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}