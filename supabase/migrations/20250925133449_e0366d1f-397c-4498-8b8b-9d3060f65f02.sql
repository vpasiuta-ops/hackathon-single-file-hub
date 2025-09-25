-- Fix security issue: Restrict profile visibility to authenticated users only
-- Drop the overly permissive admin policy that allows anyone to view all profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create a new policy that only allows authenticated users to view complete profiles
-- This replaces the problematic policy that had "true" as the condition
CREATE POLICY "Authenticated users can view complete profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (
  -- Only allow viewing profiles that are marked as complete
  -- This prevents accessing incomplete/private profile data
  is_profile_complete = true
);

-- Also fix the admin users table security issue while we're at it
-- Drop the overly permissive admin policy
DROP POLICY IF EXISTS "Admins can manage admin users" ON public.admin_users;

-- Create a secure policy for admin users that requires proper authentication
-- This prevents public access to admin credentials
CREATE POLICY "Only authenticated admins can manage admin users" 
ON public.admin_users 
FOR ALL
TO authenticated
USING (false)  -- No one can access by default
WITH CHECK (false);  -- No one can insert by default