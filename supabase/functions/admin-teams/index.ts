import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

const handler = async (req: Request): Promise<Response> => {
  console.log('Admin-teams function called:', req.method);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase environment variables');
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Use service role key to bypass RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { action, teamData } = await req.json();
    console.log('Admin teams action:', action);

    switch (action) {
      case 'create':
        // Create team
        const { data: newTeam, error: teamError } = await supabase
          .from('teams')
          .insert({
            name: teamData.name,
            description: teamData.description,
            status: teamData.status,
            captain_id: teamData.captain_id,
            looking_for: teamData.looking_for
          })
          .select()
          .single();

        if (teamError) {
          console.error('Error creating team:', teamError);
          return new Response(
            JSON.stringify({ error: 'Failed to create team: ' + teamError.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }

        // Add team members if provided
        if (teamData.members && teamData.members.length > 0) {
          const { error: membersError } = await supabase
            .from('team_members')
            .insert(
              teamData.members.map((userId: string) => ({
                team_id: newTeam.id,
                user_id: userId
              }))
            );

          if (membersError) {
            console.error('Error adding team members:', membersError);
            // Don't fail the team creation, just log the error
          }
        }

        console.log('Team created successfully:', newTeam);
        return new Response(JSON.stringify({ success: true, team: newTeam }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });

      case 'update':
        // Update team
        const { data: updatedTeam, error: updateError } = await supabase
          .from('teams')
          .update({
            name: teamData.name,
            description: teamData.description,
            status: teamData.status,
            captain_id: teamData.captain_id,
            looking_for: teamData.looking_for
          })
          .eq('id', teamData.id)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating team:', updateError);
          return new Response(
            JSON.stringify({ error: 'Failed to update team: ' + updateError.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }

        // Update team members
        if (teamData.members !== undefined) {
          // First, remove all existing members (except captain)
          const { error: removeError } = await supabase
            .from('team_members')
            .delete()
            .eq('team_id', teamData.id)
            .neq('user_id', teamData.captain_id);

          if (removeError) {
            console.error('Error removing team members:', removeError);
          }

          // Then add new members
          if (teamData.members.length > 0) {
            const { error: addError } = await supabase
              .from('team_members')
              .insert(
                teamData.members
                  .filter((userId: string) => userId !== teamData.captain_id) // Don't duplicate captain
                  .map((userId: string) => ({
                    team_id: teamData.id,
                    user_id: userId
                  }))
              );

            if (addError) {
              console.error('Error adding team members:', addError);
            }
          }
        }

        console.log('Team updated successfully:', updatedTeam);
        return new Response(JSON.stringify({ success: true, team: updatedTeam }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });

      case 'delete':
        const { error: deleteError } = await supabase
          .from('teams')
          .delete()
          .eq('id', teamData.id);

        if (deleteError) {
          console.error('Delete team error:', deleteError);
          throw deleteError;
        }

        console.log('Team deleted successfully:', teamData.id);
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });

      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    }
  } catch (error) {
    console.error('Error in admin-teams function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
};

serve(handler);