-- Створюємо таблицю для команд
CREATE TABLE public.teams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  captain_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  looking_for TEXT[] DEFAULT ARRAY[]::TEXT[],
  status TEXT DEFAULT 'формується' CHECK (status IN ('формується', 'готова', 'учасник хакатону')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Створюємо таблицю для учасників команд
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(team_id, user_id)
);

-- Створюємо таблицю для хакатонів
CREATE TABLE public.hackathons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  status TEXT DEFAULT 'Майбутній' CHECK (status IN ('Активний', 'Майбутній', 'Завершений')),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  registration_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  max_team_size INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Створюємо таблицю для реєстрацій команд на хакатони
CREATE TABLE public.hackathon_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hackathon_id UUID NOT NULL REFERENCES public.hackathons(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  registered_by UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  registered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(hackathon_id, team_id)
);

-- Enable Row Level Security
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hackathons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hackathon_registrations ENABLE ROW LEVEL SECURITY;

-- Створюємо політики для teams
CREATE POLICY "Teams are viewable by everyone" 
ON public.teams 
FOR SELECT 
USING (true);

CREATE POLICY "Team captains can create teams" 
ON public.teams 
FOR INSERT 
WITH CHECK (auth.uid() = captain_id);

CREATE POLICY "Team captains can update their teams" 
ON public.teams 
FOR UPDATE 
USING (auth.uid() = captain_id);

CREATE POLICY "Team captains can delete their teams" 
ON public.teams 
FOR DELETE 
USING (auth.uid() = captain_id);

-- Створюємо політики для team_members  
CREATE POLICY "Team members are viewable by everyone" 
ON public.team_members 
FOR SELECT 
USING (true);

CREATE POLICY "Team captains can add members" 
ON public.team_members 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.teams 
    WHERE id = team_id AND captain_id = auth.uid()
  )
);

CREATE POLICY "Team captains and members can remove members" 
ON public.team_members 
FOR DELETE 
USING (
  auth.uid() = user_id OR 
  EXISTS (
    SELECT 1 FROM public.teams 
    WHERE id = team_id AND captain_id = auth.uid()
  )
);

-- Створюємо політики для hackathons
CREATE POLICY "Hackathons are viewable by everyone" 
ON public.hackathons 
FOR SELECT 
USING (true);

-- Політики для hackathon_registrations
CREATE POLICY "Hackathon registrations are viewable by everyone" 
ON public.hackathon_registrations 
FOR SELECT 
USING (true);

CREATE POLICY "Team captains can register their teams" 
ON public.hackathon_registrations 
FOR INSERT 
WITH CHECK (
  auth.uid() = registered_by AND
  EXISTS (
    SELECT 1 FROM public.teams 
    WHERE id = team_id AND captain_id = auth.uid()
  )
);

-- Створюємо тригери для updated_at
CREATE TRIGGER update_teams_updated_at
BEFORE UPDATE ON public.teams
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hackathons_updated_at
BEFORE UPDATE ON public.hackathons
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();