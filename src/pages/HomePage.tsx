import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Users, Target, Clock, Shield, Lightbulb, Code, Palette, Scale, CheckCircle, Calendar, MapPin, Trophy, Sparkles } from "lucide-react";
import PartnerModal from "@/components/PartnerModal";
import partnersLogos from "@/assets/partners-logos.png";
import type { UserRole } from "@/data/mockData";
interface HomePageProps {
  currentRole: UserRole;
  onPageChange: (page: string) => void;
  onViewHackathon: (id: number) => void;
}
export default function HomePage({
  currentRole,
  onPageChange
}: HomePageProps) {
  const roadmapItems = [{
    phase: "Початок реєстрації",
    date: "жовтень 2025",
    description: "Відкриття платформи та початок прийому заявок"
  }, {
    phase: "Відкриття хакатону",
    date: "початок листопада 2025",
    description: "Офіційний старт змагання"
  }, {
    phase: "Робота над рішеннями",
    date: "листопад 2025",
    description: "Розробка та створення AI-рішень"
  }, {
    phase: "Подача фінальних матеріалів",
    date: "кінець листопада 2025",
    description: "Завершення та подача проєктів"
  }, {
    phase: "Оцінювання журі та демо-дей",
    date: "кінець листопада 2025",
    description: "Презентація проєктів та оцінювання"
  }, {
    phase: "Оголошення переможців",
    date: "Під час демо-дею",
    description: "Визначення та нагородження переможців"
  }];
  const technicalRoles = ["Full-stack розробники", "Frontend розробники", "Backend розробники", "ML/AI інженери", "Data Scientists", "DevOps інженери", "Mobile розробники"];
  const productRoles = ["Product менеджери", "UX/UI дизайнери", "Business аналітики", "Проектні менеджери"];
  const legalRoles = ["AI етики", "Юристи з IT права", "Експерти з приватності даних"];
  const requirements = ["Досвід роботи з AI/ML технологіями або бажання їх вивчати", "Готовність працювати в команді над державними кейсами", "Відповідальне ставлення до розробки AI-рішень", "Базові знання українського законодавства (для юристів)"];
  const steps = ["Зареєструйтесь на платформі та заповніть свій профіль", "Створіть команду або приєднайтесь до існуючої", "Оберіть державний кейс для розробки", "Працюйте над рішенням та беріть участь у демо-дні"];
  const faqItems = [{
    question: "Хто може брати участь у хакатоні?",
    answer: "Участь можуть брати всі спеціалісти з досвідом або інтересом до AI/ML, включно з розробниками, дизайнерами, продакт-менеджерами та юристами."
  }, {
    question: "Чи потрібен досвід роботи з державними проєктами?",
    answer: "Ні, досвід роботи з державними проєктами не є обов'язковим. Головне - ваше бажання створювати корисні рішення для України."
  }, {
    question: "Які призи чекають на переможців?",
    answer: "Переможці отримають грошові винагороди, можливості для співпраці з державними органами та признання від IT-спільноти."
  }];
  return <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Header with logos */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="flex justify-center items-center mb-12">
            
          </div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground leading-tight">
            Платформа AI-Хакатонів України
          </h1>
          
          <p className="text-lg md:text-xl text-foreground-secondary mb-8 max-w-3xl mx-auto leading-relaxed">
            Шукаємо учасників і команди, які долучаться до розробки рішень з використання штучного інтелекту для державних кейсів
          </p>
          
          <Button variant="default" size="lg" onClick={() => onPageChange('register')} className="mb-8">
            Зареєструватися
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          
          <p className="text-foreground-secondary max-w-2xl mx-auto">
            Мінцифра та WINWIN AI CoE у співпраці з партнерами створили платформу AI-хакатонів. 
            Тут команди працюють над практичними задачами держави, розробляючи відповідальні та корисні рішення 
            для мільйонів українців.
          </p>
        </div>
      </section>

      {/* About Platform - 3 columns */}
      <section className="py-16 px-4 bg-background-secondary">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-12">
            Про платформу
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card border-0 text-center">
              <CardHeader>
                <Target className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-foreground">Для держави</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground-secondary">
                  Платформа для тестування й масштабування корисних AI-рішень, залучення кращих 
                  талантів та впровадження інновацій у державний сектор
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-0 text-center">
              <CardHeader>
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-foreground">Для учасників</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground-secondary">
                  Можливість працювати над продуктами для мільйонів українців, отримувати досвід 
                  роботи з державними кейсами та розвивати навички відповідального AI
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-0 text-center">
              <CardHeader>
                <Lightbulb className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-foreground">Для партнерів</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground-secondary">
                  Потужний кейс співпраці з державою, можливість долучитися до трансформації 
                  країни та продемонструвати соціальну відповідальність
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-12">
            Roadmap хакатону
          </h2>
          
          <div className="space-y-6 mb-8">
            {roadmapItems.map((item, index) => <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-grow">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                    <h3 className="font-semibold text-foreground">{item.phase}</h3>
                    <Badge variant="outline" className="text-xs w-fit">
                      <Calendar className="w-3 h-3 mr-1" />
                      {item.date}
                    </Badge>
                  </div>
                  <p className="text-foreground-secondary text-sm">{item.description}</p>
                </div>
              </div>)}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline">Правила участі</Button>
            <Button variant="outline">Критерії оцінювання</Button>
          </div>
        </div>
      </section>

      {/* Who can participate */}
      <section className="py-16 px-4 bg-background-secondary">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-12">
            Хто може долучитися
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card border-0">
              <CardHeader>
                <Code className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="text-foreground">Технічні ролі</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {technicalRoles.map((role, index) => <li key={index} className="text-foreground-secondary text-sm flex items-center">
                      <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                      {role}
                    </li>)}
                </ul>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-0">
              <CardHeader>
                <Palette className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="text-foreground">Продукт/дизайн</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {productRoles.map((role, index) => <li key={index} className="text-foreground-secondary text-sm flex items-center">
                      <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                      {role}
                    </li>)}
                </ul>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-0">
              <CardHeader>
                <Scale className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="text-foreground">Етика та право</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {legalRoles.map((role, index) => <li key={index} className="text-foreground-secondary text-sm flex items-center">
                      <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                      {role}
                    </li>)}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-12">
            Вимоги до учасників
          </h2>
          
          <div className="space-y-4 mb-8">
            {requirements.map((requirement, index) => <div key={index} className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-foreground-secondary">{requirement}</p>
              </div>)}
          </div>
          
          <div className="text-center">
            <Button variant="default" size="lg" onClick={() => onPageChange('register')}>
              Зареєструватися
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* How to join */}
      <section className="py-16 px-4 bg-background-secondary">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-12">
            Як долучитися
          </h2>
          
          <div className="space-y-6">
            {steps.map((step, index) => <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                  {index + 1}
                </div>
                <div className="flex-grow pt-2">
                  <p className="text-foreground">{step}</p>
                </div>
              </div>)}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Наші партнери
          </h2>
          <p className="text-foreground-secondary mb-12">
            Разом масштабуємо відповідальні AI-рішення для України.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-card rounded-lg p-8 flex items-center justify-center">
              <div className="text-xl font-bold text-foreground">Мінцифри</div>
            </div>
            <div className="bg-card rounded-lg p-8 flex items-center justify-center">
              <div className="text-xl font-bold text-foreground">AI CoE</div>
            </div>
            <div className="bg-card rounded-lg p-8 flex items-center justify-center">
              <div className="text-xl font-bold text-foreground">EPAM</div>
            </div>
          </div>
          
          <PartnerModal>
            <Button variant="outline" size="lg">
              Стати партнером
            </Button>
          </PartnerModal>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-background-secondary">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-12">
            Часті питання
          </h2>
          
          <div className="space-y-6">
            {faqItems.map((item, index) => <Card key={index} className="bg-card border-0">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-foreground mb-3">{item.question}</h3>
                  <p className="text-foreground-secondary">{item.answer}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Trophy className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-6">
            Готові змінити Україну за допомогою AI?
          </h2>
          <p className="text-lg text-foreground-secondary mb-8 max-w-2xl mx-auto">
            Приєднуйтесь до найбільшого AI-хакатону України та створюйте рішення, 
            які допоможуть мільйонам людей.
          </p>
          <Button variant="default" size="xl" onClick={() => onPageChange('register')}>
            <MapPin className="w-5 h-5 mr-2" />
            Зареєструватися зараз
          </Button>
        </div>
      </section>
    </div>;
}