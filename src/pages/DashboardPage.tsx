import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Crown, 
  Users, 
  Trophy, 
  Settings, 
  Plus,
  Upload,
  Github,
  ExternalLink,
  Star,
  Edit
} from "lucide-react";
import type { UserRole } from "@/data/mockData";

interface DashboardPageProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onPageChange: (page: string) => void;
}

export default function DashboardPage({ currentRole, onRoleChange, onPageChange }: DashboardPageProps) {
  const [isEditing, setIsEditing] = useState(false);

  // Mock user data based on role
  const getUserData = () => {
    switch (currentRole) {
      case 'participant':
        return {
          name: 'Олексій Петренко',
          email: 'oleksiy.petrenko@email.com',
          bio: 'Frontend розробник з 2-річним досвідом',
          skills: ['React', 'TypeScript', 'Next.js'],
          stack: ['React', 'Node.js', 'MongoDB'],
          avatar: 'https://placehold.co/100x100/2d3748/E2E8F0?text=ОП',
          github: 'https://github.com/oleksiy',
          teamName: null,
          isTeamCaptain: false,
        };
      case 'captain':
        return {
          name: 'Максим Петренко',
          email: 'maxim.petrenko@email.com',
          bio: 'Full-stack розробник, створюю сучасні веб-застосунки',
          skills: ['React', 'Node.js', 'TypeScript'],
          stack: ['Next.js', 'Express', 'PostgreSQL'],
          avatar: 'https://placehold.co/100x100/2d3748/E2E8F0?text=МП',
          github: 'https://github.com/maxpetrenko',
          teamName: 'AI Avengers',
          isTeamCaptain: true,
        };
      default:
        return null;
    }
  };

  const userData = getUserData();

  if (currentRole === 'guest') {
    return (
      <div className="min-h-screen bg-background py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="mb-8">
            <User className="w-16 h-16 mx-auto text-foreground-secondary mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Створіть свій профіль
            </h1>
            <p className="text-foreground-secondary">
              Оберіть роль, щоб почати користуватись платформою
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Card 
              className="cursor-pointer hover:shadow-hover transition-all group"
              onClick={() => onRoleChange('participant')}
            >
              <CardHeader>
                <User className="w-8 h-8 text-primary mx-auto mb-2" />
                <CardTitle className="group-hover:text-primary transition-colors">
                  Учасник
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground-secondary">
                  Шукайте команди та беріть участь в хакатонах
                </p>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-hover transition-all group"
              onClick={() => onRoleChange('captain')}
            >
              <CardHeader>
                <Crown className="w-8 h-8 text-primary mx-auto mb-2" />
                <CardTitle className="group-hover:text-primary transition-colors">
                  Капітан команди
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground-secondary">
                  Створюйте команди та керуйте проєктами
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (currentRole === 'judge') {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-foreground mb-8">
            Панель судді
          </h1>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  Проєкти на оцінку
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">12</div>
                <p className="text-sm text-foreground-secondary">Очікують оцінки</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-green-500" />
                  Оцінено
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">8</div>
                <p className="text-sm text-foreground-secondary">З 20 проєктів</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-500" />
                  Середній бал
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">8.2</div>
                <p className="text-sm text-foreground-secondary">З 10 можливих</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Проєкти для оцінювання</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'EcoCity Analytics', team: 'Green Tech', submitted: '2 години тому' },
                  { name: 'AI Medical Assistant', team: 'HealthTech Heroes', submitted: '4 години тому' },
                  { name: 'Smart Procurement', team: 'Gov Innovators', submitted: '6 годин тому' },
                ].map((project, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <h4 className="font-medium text-foreground">{project.name}</h4>
                      <p className="text-sm text-foreground-secondary">
                        Команда: {project.team} • {project.submitted}
                      </p>
                    </div>
                    <Button size="sm">
                      Оцінити
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (currentRole === 'organizer') {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Панель організатора
            </h1>
            <Button variant="default">
              <Plus className="w-4 h-4 mr-2" />
              Новий хакатон
            </Button>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Активні хакатони', value: '2', icon: Trophy },
              { label: 'Учасники', value: '1,247', icon: Users },
              { label: 'Команди', value: '156', icon: Users },
              { label: 'Проєкти', value: '89', icon: Star },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <Icon className="w-8 h-8 text-primary" />
                      <div>
                        <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                        <div className="text-sm text-foreground-secondary">{stat.label}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Мої хакатони</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-border rounded">
                    <div>
                      <h4 className="font-medium">AI for Government 2024</h4>
                      <p className="text-sm text-foreground-secondary">156 учасників • Активний</p>
                    </div>
                    <Badge className="bg-green-500 text-white">Активний</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-border rounded">
                    <div>
                      <h4 className="font-medium">FinTech Innovation 2024</h4>
                      <p className="text-sm text-foreground-secondary">89 учасників • Майбутній</p>
                    </div>
                    <Badge className="bg-blue-500 text-white">Майбутній</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Останні дії</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Нова команда зареєстрована</span>
                    <span className="text-foreground-secondary">2 хв тому</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Проєкт подано на оцінку</span>
                    <span className="text-foreground-secondary">15 хв тому</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Новий учасник приєднався</span>
                    <span className="text-foreground-secondary">1 год тому</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Participant/Captain Dashboard
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Особистий кабінет
          </h1>
          <Button 
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit className="w-4 h-4 mr-2" />
            {isEditing ? 'Скасувати' : 'Редагувати'}
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Profile Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <div className="flex items-center gap-4">
                <img 
                  src={userData?.avatar} 
                  alt={userData?.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-foreground">{userData?.name}</h3>
                  <p className="text-sm text-foreground-secondary">{userData?.email}</p>
                  <Badge className="mt-1">
                    {currentRole === 'captain' ? 'Капітан команди' : 'Учасник'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <Textarea 
                    placeholder="Розкажіть про себе..."
                    value={userData?.bio}
                    rows={3}
                  />
                  <Input placeholder="GitHub профіль" value={userData?.github} />
                  <Button className="w-full">Зберегти</Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-foreground-secondary">{userData?.bio}</p>
                  {userData?.github && (
                    <a href={userData.github} className="flex items-center gap-2 text-sm text-primary hover:underline">
                      <Github className="w-4 h-4" />
                      GitHub профіль
                    </a>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skills & Stack */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Навички та стек</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Навички</h4>
                  <div className="flex flex-wrap gap-2">
                    {userData?.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">{skill}</Badge>
                    ))}
                    {isEditing && (
                      <Button variant="outline" size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Технологічний стек</h4>
                  <div className="flex flex-wrap gap-2">
                    {userData?.stack.map((tech, index) => (
                      <Badge key={index} variant="outline">{tech}</Badge>
                    ))}
                    {isEditing && (
                      <Button variant="outline" size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Section */}
        {currentRole === 'captain' && userData?.teamName ? (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-500" />
                Моя команда: {userData.teamName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <p className="text-foreground-secondary mb-2">
                    Ви керуєте командою з 3 учасників
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => onPageChange('teams')}>
                      <Users className="w-4 h-4 mr-2" />
                      Управляти командою
                    </Button>
                    <Button variant="outline" size="sm">
                      Запросити учасників
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : currentRole === 'participant' && !userData?.teamName && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Статус команди</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="w-12 h-12 mx-auto text-foreground-secondary mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Ви поки не в команді
                </h3>
                <p className="text-foreground-secondary mb-4">
                  Приєднуйтесь до команди або створіть власну
                </p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={() => onPageChange('teams')}>
                    Знайти команду
                  </Button>
                  <Button variant="outline">
                    Створити команду
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Project Submission */}
        <Card>
          <CardHeader>
            <CardTitle>Подача проєкту</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Input placeholder="Назва проєкту" />
                <Input placeholder="GitHub репозиторій" />
              </div>
              <Textarea placeholder="Опис проєкту" rows={3} />
              <div className="grid md:grid-cols-2 gap-4">
                <Input placeholder="Посилання на демо" />
                <Input placeholder="Презентація" />
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Завантажити файли
                </Button>
                <span className="text-sm text-foreground-secondary">
                  Максимум 50 МБ
                </span>
              </div>
              <Button className="w-full md:w-auto">
                Подати проєкт
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}