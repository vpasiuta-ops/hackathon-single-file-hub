-- Add admin policies for profiles table
CREATE POLICY "Admins can update all profiles" 
ON public.profiles 
FOR UPDATE 
USING (true);

CREATE POLICY "Admins can delete all profiles" 
ON public.profiles 
FOR DELETE 
USING (true);

-- Add admin policies for teams table  
CREATE POLICY "Admins can create teams" 
ON public.teams 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can update all teams" 
ON public.teams 
FOR UPDATE 
USING (true);

CREATE POLICY "Admins can delete all teams" 
ON public.teams 
FOR DELETE 
USING (true);

-- Add admin policies for team_members table
CREATE POLICY "Admins can manage all team members" 
ON public.team_members 
FOR ALL 
USING (true) 
WITH CHECK (true);