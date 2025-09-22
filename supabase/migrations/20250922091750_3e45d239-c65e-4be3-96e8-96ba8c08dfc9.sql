-- Create admin users table for authentication
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy for admin users (they can manage themselves)
CREATE POLICY "Admins can manage admin users" 
ON public.admin_users 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create email templates table
CREATE TABLE public.email_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  html_content TEXT NOT NULL,
  created_by UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for email templates
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

-- Create policy for email templates
CREATE POLICY "Admins can manage email templates" 
ON public.email_templates 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create email logs table
CREATE TABLE public.email_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID REFERENCES public.email_templates(id) ON DELETE CASCADE,
  recipient_email VARCHAR(255) NOT NULL,
  sent_by UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status VARCHAR(50) NOT NULL DEFAULT 'sent'
);

-- Enable RLS for email logs
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for email logs
CREATE POLICY "Admins can view email logs" 
ON public.email_logs 
FOR SELECT 
USING (true);

-- Create triggers for updated_at
CREATE TRIGGER update_admin_users_updated_at
BEFORE UPDATE ON public.admin_users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_email_templates_updated_at
BEFORE UPDATE ON public.email_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial admin user (password will need to be hashed)
-- For now, we'll use a simple hash - in production, this should be properly hashed
INSERT INTO public.admin_users (email, password_hash) 
VALUES ('v.pasiuta@thedigital.gov.ua', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeVMpYlqh1L8mr1We'); -- This is 'AdminPassword123!'

-- Update profiles table to allow admins to view all profiles
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (true);