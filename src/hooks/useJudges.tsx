import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface JudgeAssignment {
  id: string;
  user_id: string;
  hackathon_id: string;
  assigned_at: string;
  assigned_by?: string;
  hackathon?: {
    id: string;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    status: string;
  };
  profile?: {
    id: string;
    first_name?: string;
    last_name?: string;
    email?: string;
  };
}

export const useJudges = () => {
  const [assignments, setAssignments] = useState<JudgeAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJudgeAssignments = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('hackathon_judges')
        .select(`
          *,
          hackathons (
            id,
            title,
            description,
            start_date,
            end_date,
            status
          ),
          profiles (
            id,
            first_name,
            last_name,
            email
          )
        `)
        .order('assigned_at', { ascending: false });

      if (supabaseError) {
        throw supabaseError;
      }

      setAssignments(data || []);
    } catch (err) {
      console.error('Error fetching judge assignments:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch judge assignments');
    } finally {
      setLoading(false);
    }
  };

  const assignJudge = async (userId: string, hackathonId: string) => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('hackathon_judges')
        .insert({
          user_id: userId,
          hackathon_id: hackathonId,
          assigned_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (supabaseError) {
        throw supabaseError;
      }

      // Refresh the list
      await fetchJudgeAssignments();
      
      return { data, error: null };
    } catch (err) {
      console.error('Error assigning judge:', err);
      return { 
        data: null, 
        error: err instanceof Error ? err.message : 'Failed to assign judge' 
      };
    }
  };

  const removeJudgeAssignment = async (assignmentId: string) => {
    try {
      const { error: supabaseError } = await supabase
        .from('hackathon_judges')
        .delete()
        .eq('id', assignmentId);

      if (supabaseError) {
        throw supabaseError;
      }

      // Refresh the list
      await fetchJudgeAssignments();
      
      return { error: null };
    } catch (err) {
      console.error('Error removing judge assignment:', err);
      return { 
        error: err instanceof Error ? err.message : 'Failed to remove judge assignment' 
      };
    }
  };

  useEffect(() => {
    fetchJudgeAssignments();
  }, []);

  return {
    assignments,
    loading,
    error,
    assignJudge,
    removeJudgeAssignment,
    refetch: fetchJudgeAssignments,
  };
};

export const useJudgeAssignments = (userId?: string) => {
  const [assignments, setAssignments] = useState<JudgeAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserAssignments = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('hackathon_judges')
        .select(`
          *,
          hackathons (
            id,
            title,
            description,
            start_date,
            end_date,
            status
          )
        `)
        .eq('user_id', userId)
        .order('assigned_at', { ascending: false });

      if (supabaseError) {
        throw supabaseError;
      }

      setAssignments(data || []);
    } catch (err) {
      console.error('Error fetching user judge assignments:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch assignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAssignments();
  }, [userId]);

  return {
    assignments,
    loading,
    error,
    refetch: fetchUserAssignments,
  };
};