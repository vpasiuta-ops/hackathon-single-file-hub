import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Crown, 
  Users, 
  Settings,
  Plus,
  Github,
  Phone,
  Mail,
  Edit,
  Save,
  X
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTeams } from '@/hooks/useTeams';
import CreateTeamDialog from '@/components/CreateTeamDialog';
import TeamManagementSection from '@/components/TeamManagementSection';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    bio: '',
    technologies: [] as string[],
    skills: [] as string[]
  });
  const [currentTech, setCurrentTech] = useState('');
  const [currentSkill, setCurrentSkill] = useState('');

  const { user, profile, updateProfile } = useAuth();
  const { userTeam, isUserTeamCaptain, loading: teamsLoading } = useTeams();
  const { toast } = useToast();

  useEffect(() => {
    if (profile) {
      setEditData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        technologies: profile.technologies || [],
        skills: profile.skills || []
      });
    }
  }, [profile]);

  const handleSave = async () => {
    const { error } = await updateProfile(editData);
    if (error) {
      toast({
        title: 'Помилка',
        description: 'Не вдалося оновити профіль',
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Успішно!',
        description: 'Профіль оновлено'
      });
      setIsEditing(false);
    }
  };

  const addTechnology = () => {
    if (currentTech.trim() && !editData.technologies.includes(currentTech.trim())) {
      setEditData(prev => ({
        ...prev,
        technologies: [...prev.technologies, currentTech.trim()]
      }));
      setCurrentTech('');
    }
  };

  const addSkill = () => {
    if (currentSkill.trim() && !editData.skills.includes(currentSkill.trim())) {
      setEditData(prev => ({
        ...prev,
        skills: [...prev.skills, currentSkill.trim()]
      }));
      setCurrentSkill('');
    }
  };

  const removeTechnology = (tech: string) => {
    setEditData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
  };

  const removeSkill = (skill: string) => {
    setEditData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const getUserInitials = () => {
    const firstName = profile?.first_name || '';
    const lastName = profile?.last_name || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  };

  const getUserFullName = () => {
    return `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'Користувач';
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground-secondary">Завантаження...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">Мій профіль</h1>
          <Button 
            variant="outline"
            onClick={() => {
              if (isEditing) {
                setIsEditing(false);
                setEditData({
                  first_name: profile.first_name || '',
                  last_name: profile.last_name || '',
                  phone: profile.phone || '',
                  bio: profile.bio || '',
                  technologies: profile.technologies || [],
                  skills: profile.skills || []
                });
              } else {
                setIsEditing(true);
              }
            }}
          >
            {isEditing ? <X className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
            {isEditing ? 'Скасувати' : 'Редагувати'}
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Profile Info */}
          <Card className="md:col-span-1">
            <CardHeader>
              <div className="flex flex-col items-center text-center">
                <Avatar className="w-20 h-20 mb-4">
                  <AvatarImage src="" alt={getUserFullName()} />
                  <AvatarFallback className="text-lg">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                
                {isEditing ? (
                  <div className="w-full space-y-2">
                    <Input
                      placeholder="Ім'я"
                      value={editData.first_name}
                      onChange={(e) => setEditData(prev => ({ ...prev, first_name: e.target.value }))}
                    />
                    <Input
                      placeholder="Прізвище"
                      value={editData.last_name}
                      onChange={(e) => setEditData(prev => ({ ...prev, last_name: e.target.value }))}
                    />
                  </div>
                ) : (
                  <>
                    <h3 className="font-semibold text-foreground text-lg">
                      {getUserFullName()}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-foreground-secondary mb-2">
                      <Mail className="w-4 h-4" />
                      {user.email}
                    </div>
                  </>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <Input
                    placeholder="Номер телефону"
                    value={editData.phone}
                    onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                  <Textarea 
                    placeholder="Розкажіть про себе..."
                    value={editData.bio}
                    onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                  />
                  <Button className="w-full" onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Зберегти
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {profile.phone && (
                    <div className="flex items-center gap-2 text-sm text-foreground-secondary">
                      <Phone className="w-4 h-4" />
                      {profile.phone}
                    </div>
                  )}
                  {profile.bio && (
                    <p className="text-sm text-foreground-secondary">{profile.bio}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skills & Technologies */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Навички та технології</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Technologies */}
                <div>
                  <h4 className="font-medium mb-2">Технології</h4>
                  {isEditing ? (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Додати технологію"
                          value={currentTech}
                          onChange={(e) => setCurrentTech(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                        />
                        <Button onClick={addTechnology} size="icon" variant="outline">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {editData.technologies.map((tech, index) => (
                          <Badge key={index} variant="outline" className="flex items-center gap-1">
                            {tech}
                            <button
                              onClick={() => removeTechnology(tech)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profile.technologies?.length ? (
                        profile.technologies.map((tech, index) => (
                          <Badge key={index} variant="outline">{tech}</Badge>
                        ))
                      ) : (
                        <p className="text-sm text-foreground-secondary">Не вказано</p>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Skills */}
                <div>
                  <h4 className="font-medium mb-2">Навички</h4>
                  {isEditing ? (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Додати навичку"
                          value={currentSkill}
                          onChange={(e) => setCurrentSkill(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                        />
                        <Button onClick={addSkill} size="icon" variant="outline">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {editData.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {skill}
                            <button
                              onClick={() => removeSkill(skill)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profile.skills?.length ? (
                        profile.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary">{skill}</Badge>
                        ))
                      ) : (
                        <p className="text-sm text-foreground-secondary">Не вказано</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Статус команди
            </CardTitle>
          </CardHeader>
          <CardContent>
            {teamsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : userTeam ? (
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      {isUserTeamCaptain && <Crown className="w-5 h-5 text-amber-500" />}
                      {userTeam.name}
                    </h3>
                    <p className="text-sm text-foreground-secondary mb-2">
                      {isUserTeamCaptain ? 'Ви капітан цієї команди' : 'Ви учасник цієї команди'}
                    </p>
                    <p className="text-foreground-secondary">{userTeam.description}</p>
                  </div>
                  <Badge className={`
                    ${userTeam.status === 'формується' ? 'bg-amber-500' : 
                      userTeam.status === 'готова' ? 'bg-green-500' : 'bg-blue-500'} 
                    text-white
                  `}>
                    {userTeam.status}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Учасники ({userTeam.member_count || 1})</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        {userTeam.captain?.first_name} {userTeam.captain?.last_name} (Капітан)
                      </Badge>
                      {userTeam.members?.map((member, index) => (
                        <Badge key={index} variant="outline">
                          {member.first_name} {member.last_name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {userTeam.looking_for && userTeam.looking_for.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Шукаємо</h4>
                      <div className="flex flex-wrap gap-1">
                        {userTeam.looking_for.map((role, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {isUserTeamCaptain && userTeam && (
                    <TeamManagementSection team={userTeam} isUserTeamCaptain={isUserTeamCaptain} />
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 mx-auto text-foreground-secondary mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Ви поки не в команді
                </h3>
                <p className="text-foreground-secondary mb-4">
                  Створіть команду або приєднуйтесь до існуючої
                </p>
                <div className="flex gap-3 justify-center">
                  <CreateTeamDialog>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Створити команду
                    </Button>
                  </CreateTeamDialog>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}