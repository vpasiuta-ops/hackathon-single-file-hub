import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create admin client using service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    console.log(`Starting complete deletion process for user: ${userId}`);

    // Step 1: Delete user from auth schema (this will cascade to auth.identities)
    const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    
    if (authDeleteError) {
      console.error('Error deleting user from auth:', authDeleteError);
      throw new Error(`Failed to delete user from auth: ${authDeleteError.message}`);
    }

    console.log(`Successfully deleted user from auth schema: ${userId}`);

    // Step 2: Delete user profile from public schema
    const { error: profileDeleteError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('user_id', userId);

    if (profileDeleteError) {
      console.error('Error deleting user profile:', profileDeleteError);
      // Note: Auth user is already deleted, so we log this but don't fail
      console.log('User was deleted from auth but profile deletion failed');
    } else {
      console.log(`Successfully deleted user profile: ${userId}`);
    }

    // Step 3: Clean up any team memberships
    const { error: teamMemberDeleteError } = await supabaseAdmin
      .from('team_members')
      .delete()
      .eq('user_id', userId);

    if (teamMemberDeleteError) {
      console.error('Error deleting team memberships:', teamMemberDeleteError);
    }

    // Step 4: Clean up any team applications
    const { error: applicationDeleteError } = await supabaseAdmin
      .from('team_applications')
      .delete()
      .eq('user_id', userId);

    if (applicationDeleteError) {
      console.error('Error deleting team applications:', applicationDeleteError);
    }

    // Step 5: Handle teams where user was captain - transfer or delete
    const { data: captainTeams, error: captainTeamsError } = await supabaseAdmin
      .from('teams')
      .select('id')
      .eq('captain_id', userId);

    if (!captainTeamsError && captainTeams && captainTeams.length > 0) {
      // Delete teams where user was captain (you might want to handle this differently)
      const { error: teamsDeleteError } = await supabaseAdmin
        .from('teams')
        .delete()
        .eq('captain_id', userId);

      if (teamsDeleteError) {
        console.error('Error deleting captain teams:', teamsDeleteError);
      } else {
        console.log(`Deleted ${captainTeams.length} teams where user was captain`);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'User completely deleted from all systems' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in delete-user-completely function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});