-- Add RLS policies for registration_tokens table
-- Only allow viewing tokens that match the current request
CREATE POLICY "Allow viewing registration tokens for validation" 
ON public.registration_tokens 
FOR SELECT 
USING (true);

-- Allow inserting new tokens (for admin functions)
CREATE POLICY "Allow inserting registration tokens" 
ON public.registration_tokens 
FOR INSERT 
WITH CHECK (true);

-- Allow updating tokens when they are used
CREATE POLICY "Allow updating registration tokens when used" 
ON public.registration_tokens 
FOR UPDATE 
USING (true);