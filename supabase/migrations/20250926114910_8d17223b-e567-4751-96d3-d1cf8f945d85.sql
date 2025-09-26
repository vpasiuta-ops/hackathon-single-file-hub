-- Add role-based access control system
-- Add role column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN role TEXT DEFAULT 'participant' CHECK (role IN ('participant', 'captain', 'judge', 'admin'));

-- Update existing profiles to have participant role by default
UPDATE public.profiles SET role = 'participant' WHERE role IS NULL;

-- Create hackathon_judges table for judge assignments
CREATE TABLE public.hackathon_judges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  hackathon_id UUID NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  assigned_by UUID,
  UNIQUE(user_id, hackathon_id)
);

-- Enable RLS on hackathon_judges
ALTER TABLE public.hackathon_judges ENABLE ROW LEVEL SECURITY;

-- Create policies for hackathon_judges
CREATE POLICY "Judges can view their assignments" 
ON public.hackathon_judges 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage judge assignments" 
ON public.hackathon_judges 
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create function to automatically assign captain role when creating team
CREATE OR REPLACE FUNCTION public.assign_captain_role()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the captain's role to 'captain'
  UPDATE public.profiles 
  SET role = 'captain' 
  WHERE user_id = NEW.captain_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for team creation
CREATE TRIGGER on_team_created
  AFTER INSERT ON public.teams
  FOR EACH ROW EXECUTE FUNCTION public.assign_captain_role();

-- Create function to assign participant role when joining team
CREATE OR REPLACE FUNCTION public.assign_participant_role()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the member's role to 'participant'
  UPDATE public.profiles 
  SET role = 'participant' 
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for team member addition
CREATE TRIGGER on_team_member_added
  AFTER INSERT ON public.team_members
  FOR EACH ROW EXECUTE FUNCTION public.assign_participant_role();

-- Create function to handle role changes when leaving team
CREATE OR REPLACE FUNCTION public.handle_team_member_removal()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if user is no longer in any team and reset role to participant
  IF NOT EXISTS (
    SELECT 1 FROM public.team_members WHERE user_id = OLD.user_id
  ) AND NOT EXISTS (
    SELECT 1 FROM public.teams WHERE captain_id = OLD.user_id
  ) THEN
    UPDATE public.profiles 
    SET role = 'participant' 
    WHERE user_id = OLD.user_id AND role NOT IN ('admin', 'judge');
  END IF;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for team member removal
CREATE TRIGGER on_team_member_removed
  AFTER DELETE ON public.team_members
  FOR EACH ROW EXECUTE FUNCTION public.handle_team_member_removal();

-- Create function to handle captain role transfer
CREATE OR REPLACE FUNCTION public.handle_captain_change()
RETURNS TRIGGER AS $$
BEGIN
  -- If captain changed, update roles
  IF OLD.captain_id != NEW.captain_id THEN
    -- Remove captain role from old captain if they're not admin/judge
    UPDATE public.profiles 
    SET role = 'participant' 
    WHERE user_id = OLD.captain_id AND role NOT IN ('admin', 'judge');
    
    -- Assign captain role to new captain
    UPDATE public.profiles 
    SET role = 'captain' 
    WHERE user_id = NEW.captain_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for captain changes
CREATE TRIGGER on_captain_changed
  AFTER UPDATE OF captain_id ON public.teams
  FOR EACH ROW EXECUTE FUNCTION public.handle_captain_change();