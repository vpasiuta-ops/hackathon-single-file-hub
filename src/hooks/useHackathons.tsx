import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DbHackathon {
  id: string;
  title: string;
  description: string;
  short_description: string | null;
  status: string | null;
  start_date: string;
  end_date: string;
  registration_deadline: string;
  max_team_size: number | null;
  prize_fund: string | null;
  timeline: any;
  prizes: any;
  partner_cases: any;
  evaluation_criteria: any;
  rules_and_requirements: string | null;
  partners: any;
  jury: any;
  created_at: string;
  updated_at: string;
}

export const useHackathons = () => {
  const [hackathons, setHackathons] = useState<DbHackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHackathons = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: supabaseError } = await supabase
        .from('hackathons')
        .select('*')
        .order('created_at', { ascending: false });

      if (supabaseError) {
        throw supabaseError;
      }

      setHackathons((data || []).map(h => ({
        ...h,
        timeline: Array.isArray(h.timeline) ? h.timeline : [],
        prizes: Array.isArray(h.prizes) ? h.prizes : [],
        partner_cases: Array.isArray(h.partner_cases) ? h.partner_cases : [],
        evaluation_criteria: Array.isArray(h.evaluation_criteria) ? h.evaluation_criteria : [],
        partners: Array.isArray(h.partners) ? h.partners : [],
        jury: Array.isArray(h.jury) ? h.jury : []
      })));
    } catch (err) {
      console.error('Error fetching hackathons:', err);
      setError('Не вдалося завантажити хакатони');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHackathons();
  }, []);

  return {
    hackathons,
    loading,
    error,
    refetch: fetchHackathons
  };
};

export const useHackathon = (id: string | null) => {
  const [hackathon, setHackathon] = useState<DbHackathon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHackathon = async () => {
      if (!id) {
        setHackathon(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const { data, error: supabaseError } = await supabase
          .from('hackathons')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (supabaseError) {
          throw supabaseError;
        }

        setHackathon(data ? {
          ...data,
          timeline: Array.isArray(data.timeline) ? data.timeline : [],
          prizes: Array.isArray(data.prizes) ? data.prizes : [],
          partner_cases: Array.isArray(data.partner_cases) ? data.partner_cases : [],
          evaluation_criteria: Array.isArray(data.evaluation_criteria) ? data.evaluation_criteria : [],
          partners: Array.isArray(data.partners) ? data.partners : [],
          jury: Array.isArray(data.jury) ? data.jury : []
        } : null);
      } catch (err) {
        console.error('Error fetching hackathon:', err);
        setError('Не вдалося завантажити хакатон');
      } finally {
        setLoading(false);
      }
    };

    fetchHackathon();
  }, [id]);

  return {
    hackathon,
    loading,
    error
  };
};