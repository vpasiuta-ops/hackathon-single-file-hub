import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

const handler = async (req: Request): Promise<Response> => {
  console.log('Admin-users function called with method:', req.method);
  
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
    
    // Create admin client with service role key
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const { action, userData } = await req.json();
    console.log('Request body parsed:', { action, userData: userData ? 'provided' : 'missing' });

    if (action === 'createUser') {
      console.log('Creating user with admin privileges');

      // Create user in auth
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: {
          first_name: userData.first_name,
          last_name: userData.last_name
        }
      });

      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }

      console.log('Auth user created:', authData.user?.id);

      // Create complete profile
      if (authData.user) {
        const profileData = {
          user_id: authData.user.id,
          first_name: userData.first_name,
          last_name: userData.last_name,
          phone: userData.phone || null,
          participation_status: userData.participation_status,
          roles: userData.roles ? userData.roles.split(',').map((r: string) => r.trim()).filter(Boolean) : [],
          skills: userData.skills ? userData.skills.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
          technologies: userData.technologies ? userData.technologies.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
          experience_level: userData.experience_level,
          portfolio_url: userData.portfolio_url || null,
          bio: userData.bio || null,
          location: userData.location || null,
          ready_to_lead: Boolean(userData.ready_to_lead),
          interested_categories: userData.interested_categories ? userData.interested_categories.split(',').map((c: string) => c.trim()).filter(Boolean) : [],
          existing_team_name: userData.existing_team_name || null,
          looking_for_roles: userData.looking_for_roles ? userData.looking_for_roles.split(',').map((r: string) => r.trim()).filter(Boolean) : [],
          team_description: userData.team_description || null,
          is_profile_complete: true
        };

        const { error: profileError } = await supabaseAdmin
          .from('profiles')
          .insert([profileData]);

        if (profileError) {
          console.error('Profile creation error:', profileError);
          // If profile creation fails, delete the auth user
          await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
          throw profileError;
        }

        console.log('Profile created successfully for user:', authData.user.id);
      }

      return new Response(JSON.stringify({ 
        success: true, 
        user: authData.user,
        message: `Користувача ${userData.first_name} ${userData.last_name} успішно створено`
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    console.error('Error in admin-users function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
};

serve(handler);