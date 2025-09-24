-- Add email, discord, and telegram columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN email TEXT,
ADD COLUMN discord TEXT, 
ADD COLUMN telegram TEXT;