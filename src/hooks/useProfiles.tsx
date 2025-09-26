import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

import type { UserRole } from '@/types/auth';

export interface Profile {
  id: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
  telegram?: string;
  discord?: string;
  experience_level?: string;
  roles?: string[];
  skills?: string[];
  technologies?: string[];
  bio?: string;
  portfolio_url?: string;
  participation_status?: string;
  looking_for_roles?: string[];
  ready_to_lead?: boolean;
  location?: string;
  team_description?: string;
  interested_categories?: string[];
  existing_team_name?: string;
  role?: UserRole;
  is_profile_complete: boolean;
  created_at: string;
  updated_at: string;
}

export const useProfiles = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_profile_complete', true)
        .order('created_at', { ascending: false });

      if (supabaseError) {
        throw supabaseError;
      }

      setProfiles((data || []).map(profile => ({
        ...profile,
        role: (profile.role as UserRole) || 'participant'
      })));
    } catch (err) {
      console.error('Error fetching profiles:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch profiles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  return {
    profiles,
    loading,
    error,
    refetch: fetchProfiles,
  };
};

export const useProfile = (userId: string) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (supabaseError) {
        throw supabaseError;
      }

      setProfile({
        ...data,
        role: (data.role as UserRole) || 'participant'
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
  };
};