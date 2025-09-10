import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Github, Linkedin, Users, User as UserIcon } from "lucide-react";
import type { User } from "@/data/mockData";

interface UserCardProps {
  user: User;
  showTeamActions?: boolean;
  onInviteToTeam?: (userId: number) => void;
}

const statusColors = {
  'шукаю команду': 'bg-green-500',
  'в команді': 'bg-blue-500',
  'готовий': 'bg-purple-500',
  'недоступний': 'bg-gray-500',
};

export default function UserCard({ user, showTeamActions = false, onInviteToTeam }: UserCardProps) {
  return (
    <Card className="bg-gradient-card border-border hover:shadow-hover transition-all duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-secondary flex-shrink-0">
            <img 
              src={user.avatar} 
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {user.name}
            </h3>
            <p className="text-sm text-foreground-secondary">
              {user.experience} досвіду
            </p>
            <Badge 
              variant="secondary" 
              className={`mt-1 ${statusColors[user.status]} text-white border-none`}
            >
              {user.status}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {user.bio && (
          <p className="text-sm text-foreground-secondary mb-3 line-clamp-2">
            {user.bio}
          </p>
        )}

        <div className="space-y-2">
          <div>
            <h4 className="text-xs font-medium text-foreground-secondary mb-1">Навички</h4>
            <div className="flex flex-wrap gap-1">
              {user.skills.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {user.skills.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{user.skills.length - 3}
                </Badge>
              )}
            </div>
          </div>

          {user.stack.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-foreground-secondary mb-1">Стек</h4>
              <div className="flex flex-wrap gap-1">
                {user.stack.slice(0, 2).map((tech, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tech}
                  </Badge>
                ))}
                {user.stack.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{user.stack.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0 flex justify-between items-center">
        <div className="flex gap-2">
          {user.github && (
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <Github className="w-4 h-4" />
            </Button>
          )}
          {user.linkedin && (
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <Linkedin className="w-4 h-4" />
            </Button>
          )}
        </div>

        {showTeamActions && user.status === 'шукаю команду' && (
          <Button 
            size="sm" 
            variant="default"
            onClick={() => onInviteToTeam?.(user.id)}
          >
            <Users className="w-4 h-4 mr-1" />
            Запросити
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}