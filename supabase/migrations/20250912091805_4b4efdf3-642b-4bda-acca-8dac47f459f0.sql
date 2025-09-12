-- Create team applications table
CREATE TABLE public.team_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(team_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.team_applications ENABLE ROW LEVEL SECURITY;

-- Create policies for team applications
CREATE POLICY "Users can create applications for teams" 
ON public.team_applications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own applications" 
ON public.team_applications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Team captains can view applications to their teams" 
ON public.team_applications 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.teams 
  WHERE teams.id = team_applications.team_id 
    AND teams.captain_id = auth.uid()
));

CREATE POLICY "Team captains can update applications to their teams" 
ON public.team_applications 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.teams 
  WHERE teams.id = team_applications.team_id 
    AND teams.captain_id = auth.uid()
));

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_team_applications_updated_at
BEFORE UPDATE ON public.team_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();