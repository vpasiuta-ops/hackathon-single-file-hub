-- Create registration tokens table for secure one-time registration links
CREATE TABLE public.registration_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  token VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '7 days'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on registration tokens
ALTER TABLE public.registration_tokens ENABLE ROW LEVEL SECURITY;

-- No RLS policies needed as these tokens will be managed server-side

-- Create index for faster token lookups
CREATE INDEX idx_registration_tokens_token ON public.registration_tokens(token);
CREATE INDEX idx_registration_tokens_email ON public.registration_tokens(email);

-- Add additional profile fields for the new registration form
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS participation_status TEXT DEFAULT 'looking_for_team';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS roles TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS experience_level TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS portfolio_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS ready_to_lead BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS interested_categories TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Add team fields for users who already have teams
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS existing_team_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS looking_for_roles TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS team_description TEXT;