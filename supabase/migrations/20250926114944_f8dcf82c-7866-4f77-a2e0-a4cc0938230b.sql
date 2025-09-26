-- Fix security warnings: set proper search_path for all functions
-- Update assign_captain_role function
CREATE OR REPLACE FUNCTION public.assign_captain_role()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  -- Update the captain's role to 'captain'
  UPDATE public.profiles 
  SET role = 'captain' 
  WHERE user_id = NEW.captain_id;
  
  RETURN NEW;
END;
$$;

-- Update assign_participant_role function
CREATE OR REPLACE FUNCTION public.assign_participant_role()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  -- Update the member's role to 'participant'
  UPDATE public.profiles 
  SET role = 'participant' 
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$;

-- Update handle_team_member_removal function
CREATE OR REPLACE FUNCTION public.handle_team_member_removal()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
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
$$;

-- Update handle_captain_change function
CREATE OR REPLACE FUNCTION public.handle_captain_change()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
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
$$;