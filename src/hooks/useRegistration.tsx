import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface RegistrationFormData {
  first_name: string;
  last_name: string;
  email: string;
  participation_status: 'looking_for_team' | 'have_team';
  roles: string[];
  skills: string[];
  experience_level: 'beginner' | 'intermediate' | 'advanced';
  portfolio_url: string;
  bio: string;
  ready_to_lead: boolean | null;
  location: string;
  interested_categories: string[];
  existing_team_name?: string;
  looking_for_roles?: string[];
  team_description?: string;
  privacy_policy: boolean;
  participation_rules: boolean;
  email_notifications: boolean;
  recaptchaToken?: string;
}

export const useRegistration = () => {
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [email, setEmail] = useState<string>('');
  const { toast } = useToast();

  const validateToken = async (token: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('registration_tokens')
        .select('email, used_at, expires_at')
        .eq('token', token)
        .maybeSingle();

      if (error) {
        console.error('Token validation error:', error);
        setTokenValid(false);
        return false;
      }

      if (!data) {
        setTokenValid(false);
        return false;
      }

      if (data.used_at) {
        toast({
          title: 'Посилання вже використане',
          description: 'Це посилання для реєстрації вже було використане.',
          variant: 'destructive'
        });
        setTokenValid(false);
        return false;
      }

      if (new Date(data.expires_at) < new Date()) {
        toast({
          title: 'Посилання прострочене',
          description: 'Термін дії цього посилання закінчився.',
          variant: 'destructive'
        });
        setTokenValid(false);
        return false;
      }

      setEmail(data.email);
      setTokenValid(true);
      return true;
    } catch (error) {
      console.error('Unexpected error during token validation:', error);
      setTokenValid(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const completeRegistration = async (token: string, formData: RegistrationFormData) => {
    setLoading(true);
    try {
      // First verify reCAPTCHA if token provided
      if (formData.recaptchaToken) {
        try {
          const { data: verifyResult } = await supabase.functions.invoke('verify-recaptcha', {
            body: { recaptchaToken: formData.recaptchaToken }
          });

          if (!verifyResult?.success) {
            throw new Error('reCAPTCHA verification failed');
          }
        } catch (error) {
          console.error('reCAPTCHA verification error:', error);
          throw new Error('reCAPTCHA verification failed');
        }
      }

      // First, mark the token as used
      const { error: tokenError } = await supabase
        .from('registration_tokens')
        .update({ used_at: new Date().toISOString() })
        .eq('token', token);

      if (tokenError) {
        throw new Error('Failed to invalidate token');
      }

      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: generateTemporaryPassword(), // User will need to reset password
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: formData.first_name,
            last_name: formData.last_name
          }
        }
      });

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error('User creation failed');
      }

      // Create the profile with all the form data
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: authData.user.id,
          first_name: formData.first_name,
          last_name: formData.last_name,
          bio: formData.bio || null,
          skills: formData.skills,
          technologies: [], // Keep existing field for compatibility
          participation_status: formData.participation_status,
          roles: formData.roles,
          experience_level: formData.experience_level,
          portfolio_url: formData.portfolio_url || null,
          ready_to_lead: formData.ready_to_lead,
          location: formData.location || null,
          interested_categories: formData.interested_categories,
          existing_team_name: formData.existing_team_name || null,
          looking_for_roles: formData.looking_for_roles || [],
          team_description: formData.team_description || null,
          is_profile_complete: true
        });

      if (profileError) {
        throw profileError;
      }

      // If user has an existing team, create the team
      if (formData.participation_status === 'have_team' && formData.existing_team_name) {
        const { error: teamError } = await supabase
          .from('teams')
          .insert({
            name: formData.existing_team_name,
            description: formData.team_description || '',
            captain_id: authData.user.id,
            looking_for: formData.looking_for_roles || []
          });

        if (teamError) {
          console.error('Team creation error:', teamError);
          // Don't throw here as the main registration was successful
        }
      }

      toast({
        title: 'Реєстрація завершена!',
        description: 'Ваш профіль успішно створено. Перевірте пошту для підтвердження.'
      });

      return { success: true };
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: 'Помилка реєстрації',
        description: error.message || 'Сталася помилка під час реєстрації',
        variant: 'destructive'
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    tokenValid,
    email,
    validateToken,
    completeRegistration
  };
};

// Generate a temporary password - user will need to reset it
const generateTemporaryPassword = (): string => {
  return Math.random().toString(36).slice(-12) + 'Aa1!';
};