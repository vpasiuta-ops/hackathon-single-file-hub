import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Users, 
  Trophy, 
  Clock, 
  Sparkles,
  Target,
  Zap
} from "lucide-react";
import HackathonCard from "@/components/HackathonCard";
import { getActiveHackathons } from "@/data/mockData";
import type { UserRole } from "@/data/mockData";

interface HomePageProps {
  currentRole: UserRole;
  onPageChange: (page: string) => void;
  onViewHackathon: (id: number) => void;
}

export default function HomePage({ currentRole, onPageChange, onViewHackathon }: HomePageProps) {
  const activeHackathons = getActiveHackathons();

  const stats = [
    { label: 'Активних хакатонів', value: '2', icon: Clock, color: 'text-green-400' },
    { label: 'Зареєстрованих учасників', value: '1,247', icon: Users, color: 'text-blue-400' },
    { label: 'Сформованих команд', value: '156', icon: Users, color: 'text-purple-400' },
    { label: 'Призовий фонд', value: '₴500K', icon: Trophy, color: 'text-amber-400' },
  ];

  const features = [
    {
      title: 'Знайти команду',
      description: 'Об\'єднайтесь з талановитими розробниками для створення інноваційних рішень',
      icon: Users,
      action: () => onPageChange('participants'),
    },
    {
      title: 'Створити проєкт',
      description: 'Реалізуйте свої ідеї в рамках захоплюючих хакатонів',
      icon: Zap,
      action: () => onPageChange('hackathons'),
    },
    {
      title: 'Виграти призи',
      description: 'Змагайтесь за цінні призи та визнання в спільноті',
      icon: Trophy,
      action: () => onPageChange('leaderboard'),
    },
  ];

  const partners = ['Microsoft', 'AWS', 'Google Cloud', 'EPAM', 'GitHub', 'Figma'];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero py-20 px-4 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Badge className="bg-primary/20 text-primary border-primary/30 px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Платформа #1 в Україні
            </Badge>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent leading-tight">
            Створюйте майбутнє разом
          </h1>
          
          <p className="text-xl md:text-2xl text-foreground-secondary mb-8 max-w-3xl mx-auto leading-relaxed">
            Приєднуйтесь до найбільшої спільноти розробників, дизайнерів та інноваторів України. 
            Беріть участь у хакатонах та втілюйте ідеї в життя.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="hero" 
              size="xl"
              onClick={() => onPageChange('hackathons')}
              className="group"
            >
              Розпочати зараз
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="xl"
              onClick={() => onPageChange('participants')}
            >
              Знайти команду
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-background-secondary">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="text-center bg-gradient-card border-border hover:shadow-hover transition-all duration-300">
                  <CardContent className="pt-6 pb-4">
                    <div className="flex justify-center mb-3">
                      <Icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                    <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                    <div className="text-sm text-foreground-secondary">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Active Hackathons */}
      {activeHackathons.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Активні хакатони
              </h2>
              <p className="text-lg text-foreground-secondary max-w-2xl mx-auto">
                Приєднуйтесь до поточних змагань та покажіть свої навички
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {activeHackathons.map((hackathon) => (
                <HackathonCard
                  key={hackathon.id}
                  hackathon={hackathon}
                  onViewDetails={onViewHackathon}
                  onRegister={() => console.log('Register for hackathon', hackathon.id)}
                />
              ))}
            </div>
            
            <div className="text-center">
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => onPageChange('hackathons')}
              >
                Переглянути всі хакатони
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16 px-4 bg-background-secondary">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Чому обирають HackHub?
            </h2>
            <p className="text-lg text-foreground-secondary max-w-2xl mx-auto">
              Все необхідне для успішної участі в хакатонах в одному місці
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="text-center bg-gradient-card border-border hover:shadow-hover transition-all duration-300 cursor-pointer group"
                  onClick={feature.action}
                >
                  <CardHeader>
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground-secondary">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-8">
            Довіряють нам
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {partners.map((partner, index) => (
              <div key={index} className="text-lg font-medium text-foreground hover:text-primary transition-colors">
                {partner}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {currentRole === 'guest' && (
        <section className="py-20 px-4 bg-gradient-hero">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Готові розпочати свою подорож?
            </h2>
            <p className="text-lg text-foreground-secondary mb-8 max-w-2xl mx-auto">
              Створіть профіль та приєднуйтесь до тисяч розробників, які вже будують майбутнє
            </p>
            <Button 
              variant="hero" 
              size="xl"
              onClick={() => onPageChange('dashboard')}
            >
              <Target className="w-5 h-5 mr-2" />
              Створити профіль
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}