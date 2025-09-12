import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Team {
  id: string;
  name: string;
  description: string;
  captain_id: string;
  looking_for: string[] | null;
  status: string | null;
  created_at: string;
  updated_at: string;
  captain?: {
    first_name: string;
    last_name: string;
  };
  members?: Array<{
    user_id: string;
    first_name: string;
    last_name: string;
  }>;
  member_count?: number;
}

export interface CreateTeamData {
  name: string;
  description: string;
  looking_for: string[];
}

export function useTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [userTeam, setUserTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchTeams = async () => {
    const { data, error } = await supabase
      .from('teams')
      .select(`
        *,
        captain:profiles!teams_captain_id_fkey(first_name, last_name),
        team_members(
          user_id,
          profiles!team_members_user_id_fkey(first_name, last_name)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching teams:', error);
      return;
    }

    const teamsWithMembers = data?.map(team => ({
      ...team,
      members: team.team_members?.map((member: any) => ({
        user_id: member.user_id,
        first_name: member.profiles.first_name,
        last_name: member.profiles.last_name,
      })) || [],
      member_count: (team.team_members?.length || 0) + 1, // +1 for captain
    })) || [];

    setTeams(teamsWithMembers);
  };

  const fetchUserTeam = async () => {
    if (!user) return;

    // Check if user is a captain
    const { data: captainTeam } = await supabase
      .from('teams')
      .select(`
        *,
        captain:profiles!teams_captain_id_fkey(first_name, last_name),
        team_members(
          user_id,
          profiles!team_members_user_id_fkey(first_name, last_name)
        )
      `)
      .eq('captain_id', user.id)
      .maybeSingle();

    if (captainTeam) {
      setUserTeam({
        ...captainTeam,
        members: captainTeam.team_members?.map((member: any) => ({
          user_id: member.user_id,
          first_name: member.profiles.first_name,
          last_name: member.profiles.last_name,
        })) || [],
        member_count: (captainTeam.team_members?.length || 0) + 1,
      });
      return;
    }

    // Check if user is a member
    const { data: memberTeam } = await supabase
      .from('team_members')
      .select(`
        teams(
          *,
          captain:profiles!teams_captain_id_fkey(first_name, last_name),
          team_members(
            user_id,
            profiles!team_members_user_id_fkey(first_name, last_name)
          )
        )
      `)
      .eq('user_id', user.id)
      .maybeSingle();

    if (memberTeam?.teams) {
      const team = memberTeam.teams as any;
      setUserTeam({
        ...team,
        members: team.team_members?.map((member: any) => ({
          user_id: member.user_id,
          first_name: member.profiles.first_name,
          last_name: member.profiles.last_name,
        })) || [],
        member_count: (team.team_members?.length || 0) + 1,
      });
    }
  };

  const createTeam = async (teamData: CreateTeamData) => {
    if (!user) {
      toast({
        title: 'Помилка',
        description: 'Ви повинні бути авторизовані',
        variant: 'destructive'
      });
      return false;
    }

    const { error } = await supabase
      .from('teams')
      .insert([{
        name: teamData.name,
        description: teamData.description,
        looking_for: teamData.looking_for,
        captain_id: user.id
      }]);

    if (error) {
      toast({
        title: 'Помилка',
        description: 'Не вдалося створити команду',
        variant: 'destructive'
      });
      return false;
    }

    toast({
      title: 'Успішно!',
      description: 'Команду створено'
    });

    fetchTeams();
    fetchUserTeam();
    return true;
  };

  const updateTeam = async (teamId: string, teamData: Partial<CreateTeamData>) => {
    const { error } = await supabase
      .from('teams')
      .update(teamData)
      .eq('id', teamId);

    if (error) {
      toast({
        title: 'Помилка',
        description: 'Не вдалося оновити команду',
        variant: 'destructive'
      });
      return false;
    }

    toast({
      title: 'Успішно!',
      description: 'Команду оновлено'
    });

    fetchTeams();
    fetchUserTeam();
    return true;
  };

  const joinTeam = async (teamId: string) => {
    if (!user) return false;

    const { error } = await supabase
      .from('team_members')
      .insert([{
        team_id: teamId,
        user_id: user.id
      }]);

    if (error) {
      toast({
        title: 'Помилка',
        description: 'Не вдалося приєднатися до команди',
        variant: 'destructive'
      });
      return false;
    }

    toast({
      title: 'Успішно!',
      description: 'Ви приєдналися до команди'
    });

    fetchTeams();
    fetchUserTeam();
    return true;
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchTeams(), fetchUserTeam()]);
      setLoading(false);
    };

    init();
  }, [user]);

  const isUserTeamCaptain = userTeam ? userTeam.captain_id === user?.id : false;

  const applyToTeam = async (teamId: string, message?: string) => {
    if (!user) throw new Error('User must be logged in');
    
    const { error } = await supabase
      .from('team_applications')
      .insert({
        team_id: teamId,
        user_id: user.id,
        message: message || ''
      });
      
    if (error) throw error;
    return { success: true };
  };

  const respondToApplication = async (applicationId: string, status: 'accepted' | 'rejected') => {
    if (!user) throw new Error('User must be logged in');
    
    const { error } = await supabase
      .from('team_applications')
      .update({ status })
      .eq('id', applicationId);
      
    if (error) throw error;
    
    // If accepted, add user to team
    if (status === 'accepted') {
      const { data: application } = await supabase
        .from('team_applications')
        .select('team_id, user_id')
        .eq('id', applicationId)
        .maybeSingle();
        
      if (application) {
        await supabase
          .from('team_members')
          .insert({
            team_id: application.team_id,
            user_id: application.user_id
          });
      }
    }
    
    return { success: true };
  };

  const getUserApplications = async (userId: string) => {
    const { data, error } = await supabase
      .from('team_applications')
      .select(`
        id,
        team_id,
        status,
        created_at,
        teams:team_id (
          id,
          name,
          description
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  };

  const getTeamApplications = async (teamId: string) => {
    const { data, error } = await supabase
      .from('team_applications')
      .select(`
        id,
        user_id,
        message,
        status,
        created_at
      `)
      .eq('team_id', teamId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    // Fetch profile data separately to avoid foreign key issues
    const applicationsWithProfiles = await Promise.all(
      (data || []).map(async (app) => {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name, bio, skills, technologies')
          .eq('user_id', app.user_id)
          .single();
          
        return {
          ...app,
          profiles: profile || {
            first_name: '',
            last_name: '',
            bio: null,
            skills: null,
            technologies: null
          }
        };
      })
    );
    
    return applicationsWithProfiles;
  };

  return {
    teams,
    userTeam,
    loading,
    isUserTeamCaptain,
    createTeam,
    updateTeam,
    joinTeam,
    applyToTeam,
    respondToApplication,
    getUserApplications,
    getTeamApplications,
    refetch: () => Promise.all([fetchTeams(), fetchUserTeam()])
  };
}