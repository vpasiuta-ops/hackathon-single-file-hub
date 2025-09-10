// Mock данні для застосунку хакатонів

export type UserRole = 'participant' | 'captain' | 'judge' | 'organizer' | 'guest';

export interface User {
  id: number;
  name: string;
  role: UserRole;
  status: 'шукаю команду' | 'в команді' | 'готовий' | 'недоступний';
  skills: string[];
  stack: string[];
  avatar: string;
  bio?: string;
  github?: string;
  linkedin?: string;
  experience: string;
  teamId?: number;
}

export interface Team {
  id: number;
  name: string;
  description: string;
  lookingFor: string[];
  members: number[];
  captain: number;
  hackathonId?: number;
  projectSubmitted?: boolean;
  status: 'формується' | 'готова' | 'учасник хакатону';
}

export interface Hackathon {
  id: number;
  title: string;
  status: 'Активний' | 'Майбутній' | 'Завершений';
  description: string;
  shortDescription: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  maxTeamSize: number;
  timeline: {
    registration: string;
    teamFormation: string;
    hackingStarts: string;
    submission: string;
    judging: string;
    results: string;
  };
  cases: Array<{
    id: number;
    title: string;
    description: string;
    sponsor: string;
    prize: string;
  }>;
  judges: number[];
  partners: string[];
  rules: string[];
  prizes: Array<{
    place: string;
    amount: string;
    description: string;
  }>;
  criteria: Array<{
    name: string;
    weight: number;
    description: string;
  }>;
}

export interface Project {
  id: number;
  teamId: number;
  hackathonId: number;
  title: string;
  description: string;
  githubLink?: string;
  demoLink?: string;
  presentationLink?: string;
  videoLink?: string;
  technologies: string[];
  submittedAt: string;
  scores?: Array<{
    judgeId: number;
    criteria: Record<string, number>;
    comment?: string;
    totalScore: number;
  }>;
  finalScore?: number;
}

// Mock данні
export const users: User[] = [
  {
    id: 1,
    name: 'Олена Іванова',
    role: 'participant',
    status: 'шукаю команду',
    skills: ['Python', 'Machine Learning', 'Data Analysis'],
    stack: ['TensorFlow', 'Pandas', 'Jupyter'],
    avatar: 'https://placehold.co/100x100/2d3748/E2E8F0?text=ОІ',
    bio: 'Data Scientist з 3-річним досвідом роботи з ML моделями',
    github: 'https://github.com/olenai',
    experience: '3 роки',
  },
  {
    id: 2,
    name: 'Максим Петренко',
    role: 'captain',
    status: 'в команді',
    skills: ['React', 'Node.js', 'TypeScript'],
    stack: ['Next.js', 'Express', 'PostgreSQL'],
    avatar: 'https://placehold.co/100x100/2d3748/E2E8F0?text=МП',
    bio: 'Full-stack розробник, створюю сучасні веб-застосунки',
    github: 'https://github.com/maxpetrenko',
    experience: '5 років',
    teamId: 1,
  },
  {
    id: 3,
    name: 'Анна Коваленко',
    role: 'participant',
    status: 'шукаю команду',
    skills: ['UI/UX Design', 'Figma', 'User Research'],
    stack: ['Figma', 'Adobe XD', 'Miro'],
    avatar: 'https://placehold.co/100x100/2d3748/E2E8F0?text=АК',
    bio: 'UX/UI дизайнер, фокусуюся на користувацькому досвіді',
    experience: '4 роки',
  },
  {
    id: 4,
    name: 'Дмитро Сидоренко',
    role: 'judge',
    status: 'готовий',
    skills: ['Software Architecture', 'Team Leadership', 'Product Management'],
    stack: ['Various Technologies'],
    avatar: 'https://placehold.co/100x100/2d3748/E2E8F0?text=ДС',
    bio: 'CTO стартапу, ментор та інвестор',
    experience: '15+ років',
  },
  {
    id: 5,
    name: 'Марія Василенко',
    role: 'organizer',
    status: 'готовий',
    skills: ['Event Management', 'Community Building', 'Marketing'],
    stack: ['Management Tools'],
    avatar: 'https://placehold.co/100x100/2d3748/E2E8F0?text=МВ',
    bio: 'Organizator tech подій та хакатонів',
    experience: '7 років',
  },
];

export const teams: Team[] = [
  {
    id: 1,
    name: 'AI Avengers',
    description: 'Розробляємо рішення для аналізу медичних даних за допомогою штучного інтелекту',
    lookingFor: ['Frontend-розробник', 'UX/UI дизайнер'],
    members: [2],
    captain: 2,
    status: 'формується',
  },
  {
    id: 2,
    name: 'Green Tech',
    description: 'Створюємо екологічні рішення для смарт-міст',
    lookingFor: ['Data Scientist', 'Mobile розробник'],
    members: [1, 3],
    captain: 1,
    status: 'готова',
    hackathonId: 1,
  },
];

export const hackathons: Hackathon[] = [
  {
    id: 1,
    title: 'AI for Government 2024',
    status: 'Активний',
    description: 'Перший всеукраїнський хакатон для вирішення державних завдань за допомогою штучного інтелекту. Учасники працюватимуть над реальними кейсами від міністерств та державних установ.',
    shortDescription: 'Хакатон для створення AI рішень для держави',
    startDate: '2024-01-15',
    endDate: '2024-01-17',
    registrationDeadline: '2024-01-10',
    maxTeamSize: 5,
    timeline: {
      registration: '10 січня 2024',
      teamFormation: '11-12 січня 2024',
      hackingStarts: '15 січня 09:00',
      submission: '17 січня 15:00',
      judging: '17 січня 16:00-19:00',
      results: '17 січня 20:00',
    },
    cases: [
      {
        id: 1,
        title: 'Оптимізація державних закупівель',
        description: 'Створити AI-систему для аналізу та оптимізації державних закупівель',
        sponsor: 'Міністерство фінансів України',
        prize: '50,000 грн',
      },
      {
        id: 2,
        title: 'Аналіз медичних даних',
        description: 'Розробити рішення для аналізу медичних даних та прогнозування захворювань',
        sponsor: 'МОЗ України',
        prize: '40,000 грн',
      },
    ],
    judges: [4],
    partners: ['Microsoft', 'AWS', 'Google Cloud', 'EPAM'],
    rules: [
      'Команди до 5 осіб',
      'Код має бути відкритим на GitHub',
      'Презентація до 5 хвилин',
      'Використання AI обов\'язкове',
    ],
    prizes: [
      { place: '1 місце', amount: '100,000 грн', description: 'Гран-прі + менторство' },
      { place: '2 місце', amount: '60,000 грн', description: 'Срібло + стажування' },
      { place: '3 місце', amount: '40,000 грн', description: 'Бронза + сертифікати' },
    ],
    criteria: [
      { name: 'Інноваційність', weight: 25, description: 'Оригінальність ідеї та підходу' },
      { name: 'Технічне виконання', weight: 30, description: 'Якість коду та архітектури' },
      { name: 'Бізнес-потенціал', weight: 25, description: 'Комерційна життєздатність' },
      { name: 'Презентація', weight: 20, description: 'Якість демо та презентації' },
    ],
  },
  {
    id: 2,
    title: 'FinTech Innovation 2024',
    status: 'Майбутній',
    description: 'Хакатон присвячений інноваціям у фінансовій сфері',
    shortDescription: 'Інновації у фінтех індустрії',
    startDate: '2024-02-20',
    endDate: '2024-02-22',
    registrationDeadline: '2024-02-15',
    maxTeamSize: 4,
    timeline: {
      registration: '15 лютого 2024',
      teamFormation: '16-17 лютого 2024',
      hackingStarts: '20 лютого 09:00',
      submission: '22 лютого 15:00',
      judging: '22 лютого 16:00-19:00',
      results: '22 лютого 20:00',
    },
    cases: [],
    judges: [],
    partners: ['PrivatBank', 'monobank', 'PUMB'],
    rules: [],
    prizes: [],
    criteria: [],
  },
];

export const projects: Project[] = [
  {
    id: 1,
    teamId: 2,
    hackathonId: 1,
    title: 'EcoCity Analytics',
    description: 'AI-платформа для аналізу екологічного стану міста та прогнозування забруднень',
    githubLink: 'https://github.com/greentech/ecocity',
    demoLink: 'https://ecocity-demo.com',
    presentationLink: 'https://slides.com/ecocity',
    technologies: ['Python', 'TensorFlow', 'React', 'FastAPI'],
    submittedAt: '2024-01-17T14:30:00Z',
    finalScore: 85.5,
  },
];

// Функції для роботи з даними
export const getUsersByRole = (role: UserRole) => 
  users.filter(user => user.role === role);

export const getTeamMembers = (teamId: number) => 
  users.filter(user => user.teamId === teamId);

export const getActiveHackathons = () => 
  hackathons.filter(h => h.status === 'Активний');

export const getUserTeams = (userId: number) => 
  teams.filter(team => team.members.includes(userId) || team.captain === userId);