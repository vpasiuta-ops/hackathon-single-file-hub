-- Fix existing data: Update roles for team captains
UPDATE public.profiles 
SET role = 'captain' 
WHERE user_id IN (
  SELECT DISTINCT captain_id FROM public.teams
) AND role = 'participant';

-- Fix existing data: Update roles for team members who are not captains
UPDATE public.profiles 
SET role = 'participant' 
WHERE user_id IN (
  SELECT DISTINCT tm.user_id FROM public.team_members tm
  LEFT JOIN public.teams t ON t.captain_id = tm.user_id
  WHERE t.captain_id IS NULL
) AND role != 'admin' AND role != 'judge';

-- Enable real-time updates for profiles table
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
ALTER TABLE public.teams REPLICA IDENTITY FULL;
ALTER TABLE public.team_members REPLICA IDENTITY FULL;