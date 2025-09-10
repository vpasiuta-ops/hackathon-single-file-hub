import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Award, Crown, Star, ExternalLink, Github } from "lucide-react";
import type { UserRole } from "@/data/mockData";

interface LeaderboardPageProps {
  currentRole: UserRole;
}

interface LeaderboardEntry {
  rank: number;
  teamName: string;
  projectName: string;
  members: string[];
  totalScore: number;
  scores: {
    innovation: number;
    technical: number;
    business: number;
    presentation: number;
  };
  githubLink?: string;
  demoLink?: string;
}

const mockLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    teamName: 'Green Tech',
    projectName: 'EcoCity Analytics',
    members: ['Олена Іванова', 'Анна Коваленко', 'Сергій Мельник'],
    totalScore: 94.5,
    scores: { innovation: 95, technical: 92, business: 96, presentation: 95 },
    githubLink: 'https://github.com/greentech/ecocity',
    demoLink: 'https://ecocity-demo.com',
  },
  {
    rank: 2,
    teamName: 'AI Avengers',
    projectName: 'Smart Procurement AI',
    members: ['Максим Петренко', 'Дмитро Козлов'],
    totalScore: 89.2,
    scores: { innovation: 88, technical: 95, business: 85, presentation: 89 },
    githubLink: 'https://github.com/aiavengers/procurement',
  },
  {
    rank: 3,
    teamName: 'HealthTech Heroes',
    projectName: 'AI Medical Assistant',
    members: ['Марія Шевченко', 'Володимир Ткач', 'Юлія Бондаренко'],
    totalScore: 87.8,
    scores: { innovation: 92, technical: 88, business: 84, presentation: 87 },
    githubLink: 'https://github.com/healthtech/medical-ai',
    demoLink: 'https://medical-ai-demo.com',
  },
  {
    rank: 4,
    teamName: 'BlockChain Builders',
    projectName: 'Transparent Voting System',
    members: ['Андрій Левченко', 'Оксана Петрова'],
    totalScore: 83.4,
    scores: { innovation: 85, technical: 90, business: 78, presentation: 81 },
  },
  {
    rank: 5,
    teamName: 'Future Finance',
    projectName: 'Crypto Tax Calculator',
    members: ['Віталій Коваль', 'Наталя Соколова', 'Олег Мороз'],
    totalScore: 79.6,
    scores: { innovation: 78, technical: 82, business: 81, presentation: 77 },
  },
];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="w-6 h-6 text-yellow-500" />;
    case 2:
      return <Medal className="w-6 h-6 text-gray-400" />;
    case 3:
      return <Award className="w-6 h-6 text-amber-600" />;
    default:
      return <div className="w-6 h-6 flex items-center justify-center text-foreground-secondary font-bold">{rank}</div>;
  }
};

const getRankBadge = (rank: number) => {
  switch (rank) {
    case 1:
      return <Badge className="bg-yellow-500 text-white border-none">🥇 Переможець</Badge>;
    case 2:
      return <Badge className="bg-gray-400 text-white border-none">🥈 2 місце</Badge>;
    case 3:
      return <Badge className="bg-amber-600 text-white border-none">🥉 3 місце</Badge>;
    default:
      return <Badge variant="secondary">{rank} місце</Badge>;
  }
};

export default function LeaderboardPage({ currentRole }: LeaderboardPageProps) {
  const criteriaLabels = {
    innovation: 'Інноваційність',
    technical: 'Технічне виконання',
    business: 'Бізнес-потенціал',
    presentation: 'Презентація',
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Crown className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Лідерборд
          </h1>
          <p className="text-lg text-foreground-secondary max-w-2xl mx-auto">
            Результати хакатону "AI for Government 2024"
          </p>
          <Badge className="mt-4 bg-green-500 text-white px-4 py-2">
            Завершено
          </Badge>
        </div>

        {/* Top 3 Podium */}
        <div className="mb-12">
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Second Place */}
            <div className="md:order-1 transform md:scale-90">
              <Card className="text-center bg-gradient-card border-gray-400/30 hover:shadow-hover transition-all">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-3">
                    <Medal className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="font-bold text-lg text-foreground mb-1">
                    {mockLeaderboard[1].teamName}
                  </h3>
                  <p className="text-sm text-foreground-secondary mb-3">
                    {mockLeaderboard[1].projectName}
                  </p>
                  <div className="text-3xl font-bold text-foreground mb-2">
                    {mockLeaderboard[1].totalScore}
                  </div>
                  <Badge className="bg-gray-400 text-white">2 місце</Badge>
                </CardContent>
              </Card>
            </div>

            {/* First Place */}
            <div className="md:order-2 transform md:scale-110">
              <Card className="text-center bg-gradient-primary border-yellow-500/30 hover:shadow-glow transition-all">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-3">
                    <Trophy className="w-16 h-16 text-yellow-300" />
                  </div>
                  <h3 className="font-bold text-xl text-white mb-1">
                    {mockLeaderboard[0].teamName}
                  </h3>
                  <p className="text-sm text-primary-foreground/80 mb-3">
                    {mockLeaderboard[0].projectName}
                  </p>
                  <div className="text-4xl font-bold text-white mb-2">
                    {mockLeaderboard[0].totalScore}
                  </div>
                  <Badge className="bg-yellow-500 text-white">🏆 ПЕРЕМОЖЕЦЬ</Badge>
                </CardContent>
              </Card>
            </div>

            {/* Third Place */}
            <div className="md:order-3 transform md:scale-90">
              <Card className="text-center bg-gradient-card border-amber-600/30 hover:shadow-hover transition-all">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-3">
                    <Award className="w-12 h-12 text-amber-600" />
                  </div>
                  <h3 className="font-bold text-lg text-foreground mb-1">
                    {mockLeaderboard[2].teamName}
                  </h3>
                  <p className="text-sm text-foreground-secondary mb-3">
                    {mockLeaderboard[2].projectName}
                  </p>
                  <div className="text-3xl font-bold text-foreground mb-2">
                    {mockLeaderboard[2].totalScore}
                  </div>
                  <Badge className="bg-amber-600 text-white">3 місце</Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Full Leaderboard Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Повні результати
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockLeaderboard.map((entry) => (
                <Card key={entry.rank} className={`
                  ${entry.rank <= 3 ? 'bg-gradient-card border-primary/20' : 'bg-background-secondary'}
                  hover:shadow-hover transition-all
                `}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      {/* Rank and Team Info */}
                      <div className="flex items-center gap-4 lg:flex-1">
                        <div className="flex-shrink-0">
                          {getRankIcon(entry.rank)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground text-lg">
                              {entry.teamName}
                            </h3>
                            {getRankBadge(entry.rank)}
                          </div>
                          <p className="text-primary font-medium mb-2">
                            {entry.projectName}
                          </p>
                          <p className="text-sm text-foreground-secondary">
                            {entry.members.join(' • ')}
                          </p>
                        </div>
                      </div>

                      {/* Scores */}
                      <div className="lg:flex-1">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
                          {Object.entries(entry.scores).map(([key, score]) => (
                            <div key={key} className="text-center">
                              <div className="text-sm font-medium text-foreground">{score}</div>
                              <div className="text-xs text-foreground-secondary">
                                {criteriaLabels[key as keyof typeof criteriaLabels]}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Total Score and Links */}
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-foreground">
                            {entry.totalScore}
                          </div>
                          <div className="text-xs text-foreground-secondary">
                            Загальний бал
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          {entry.githubLink && (
                            <Button variant="outline" size="icon">
                              <Github className="w-4 h-4" />
                            </Button>
                          )}
                          {entry.demoLink && (
                            <Button variant="outline" size="icon">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Criteria Explanation */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Критерії оцінювання</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-medium text-foreground mb-1">Інноваційність</h4>
                <p className="text-sm text-foreground-secondary">Оригінальність ідеї та підходу</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-medium text-foreground mb-1">Технічне виконання</h4>
                <p className="text-sm text-foreground-secondary">Якість коду та архітектури</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-medium text-foreground mb-1">Бізнес-потенціал</h4>
                <p className="text-sm text-foreground-secondary">Комерційна життєздатність</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-medium text-foreground mb-1">Презентація</h4>
                <p className="text-sm text-foreground-secondary">Якість демо та презентації</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}