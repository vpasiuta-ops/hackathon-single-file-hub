import { useParams, Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Github, Linkedin, ExternalLink, MapPin, Clock, Users, User, Mail, MessageCircle } from "lucide-react";
import { useProfile } from "@/hooks/useProfiles";
import { Link } from "react-router-dom";

export default function ParticipantDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const { profile, loading, error } = useProfile(userId || '');

  if (!userId) {
    return <Navigate to="/participants" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-foreground-secondary">Завантаження профілю...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <User className="w-12 h-12 mx-auto mb-4 text-foreground-secondary opacity-50" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Профіль не знайдено</h2>
            <p className="text-foreground-secondary mb-6">Можливо, користувач ще не завершив реєстрацію</p>
            <Link to="/participants">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Повернутись до списку
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(' ') || 'Користувач';
  const initials = [profile.first_name?.[0], profile.last_name?.[0]].filter(Boolean).join('').toUpperCase() || 'У';

  const statusColors = {
    'looking_for_team': 'bg-green-500',
    'in_team': 'bg-blue-500',
    'ready': 'bg-purple-500',
    'unavailable': 'bg-gray-500',
  };

  const statusLabels = {
    'looking_for_team': 'Шукаю команду',
    'in_team': 'У команді', 
    'ready': 'Готовий',
    'unavailable': 'Недоступний',
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/participants">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Повернутись до списку
            </Button>
          </Link>
        </div>

        {/* Main Profile Card */}
        <Card className="mb-8">
          <CardHeader className="pb-6">
            <div className="flex items-start gap-6">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">{fullName}</CardTitle>
                {profile.experience_level && (
                  <p className="text-foreground-secondary mb-3">
                    {profile.experience_level} досвіду
                  </p>
                )}
                {profile.participation_status && (
                  <Badge 
                    className={`${statusColors[profile.participation_status as keyof typeof statusColors]} text-white border-none mb-4`}
                  >
                    {statusLabels[profile.participation_status as keyof typeof statusLabels]}
                  </Badge>
                )}
                {profile.bio && (
                  <p className="text-foreground-secondary leading-relaxed">
                    {profile.bio}
                  </p>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Контактна інформація</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.email && (
                <div className="flex items-center justify-between">
                  <span className="text-foreground-secondary flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email:
                  </span>
                  <a 
                    href={`mailto:${profile.email}`}
                    className="text-primary hover:underline"
                  >
                    {profile.email}
                  </a>
                </div>
              )}
              {profile.telegram && (
                <div className="flex items-center justify-between">
                  <span className="text-foreground-secondary flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Telegram:
                  </span>
                  <a 
                    href={`https://t.me/${profile.telegram.replace('@', '')}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {profile.telegram}
                  </a>
                </div>
              )}
              {profile.discord && (
                <div className="flex items-center justify-between">
                  <span className="text-foreground-secondary flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Discord:
                  </span>
                  <span className="text-foreground">{profile.discord}</span>
                </div>
              )}
              {profile.portfolio_url && (
                <div className="flex items-center justify-between">
                  <span className="text-foreground-secondary">Портфоліо:</span>
                  <a 
                    href={profile.portfolio_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    Переглянути
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
              {profile.location && (
                <div className="flex items-center justify-between">
                  <span className="text-foreground-secondary flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Локація:
                  </span>
                  <span className="text-foreground">{profile.location}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Професійна інформація</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.roles && profile.roles.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-foreground-secondary mb-2">Ролі</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.roles.map((role, index) => (
                      <Badge key={index} variant="secondary">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {profile.skills && profile.skills.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-foreground-secondary mb-2">Навички</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <Badge key={index} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {profile.technologies && profile.technologies.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-foreground-secondary mb-2">Технології</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.technologies.map((tech, index) => (
                      <Badge key={index} variant="outline">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Team Preferences */}
          {(profile.looking_for_roles?.length || profile.ready_to_lead || profile.team_description) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Командна робота</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.ready_to_lead !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-foreground-secondary flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Готовий бути капітаном:
                    </span>
                    <Badge variant={profile.ready_to_lead ? "default" : "secondary"}>
                      {profile.ready_to_lead ? 'Так' : 'Ні'}
                    </Badge>
                  </div>
                )}
                
                {profile.looking_for_roles && profile.looking_for_roles.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-foreground-secondary mb-2">Шукаю ролі</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.looking_for_roles.map((role, index) => (
                        <Badge key={index} variant="secondary">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {profile.team_description && (
                  <div>
                    <h4 className="text-sm font-medium text-foreground-secondary mb-2">Опис команди</h4>
                    <p className="text-foreground-secondary text-sm leading-relaxed">
                      {profile.team_description}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Interests */}
          {profile.interested_categories && profile.interested_categories.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Цікаві категорії</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.interested_categories.map((category, index) => (
                    <Badge key={index} variant="secondary">
                      {category}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}