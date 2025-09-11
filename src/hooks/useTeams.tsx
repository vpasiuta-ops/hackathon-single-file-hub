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

  return {
    teams,
    userTeam,
    loading,
    isUserTeamCaptain,
    createTeam,
    updateTeam,
    joinTeam,
    refetch: () => Promise.all([fetchTeams(), fetchUserTeam()])
  };
}