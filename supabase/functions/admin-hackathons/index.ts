import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

const handler = async (req: Request): Promise<Response> => {
  console.log('Admin-hackathons function called:', req.method);
  
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

    const { action, hackathonData } = await req.json();
    console.log('Admin hackathons action:', action);

    switch (action) {
      case 'create':
        const { data: newHackathon, error: createError } = await supabase
          .from('hackathons')
          .insert({
            title: hackathonData.title,
            short_description: hackathonData.short_description,
            description: hackathonData.description,
            status: hackathonData.status,
            start_date: hackathonData.start_date,
            end_date: hackathonData.end_date,
            registration_deadline: hackathonData.registration_deadline,
            max_team_size: hackathonData.max_team_size,
            prize_fund: hackathonData.prize_fund,
            timeline: hackathonData.timeline,
            prizes: hackathonData.prizes,
            partner_cases: hackathonData.partner_cases,
            evaluation_criteria: hackathonData.evaluation_criteria,
            rules_and_requirements: hackathonData.rules_and_requirements,
            partners: hackathonData.partners,
            jury: hackathonData.jury
          })
          .select()
          .single();

        if (createError) {
          console.error('Create hackathon error:', createError);
          throw createError;
        }

        console.log('Hackathon created successfully:', newHackathon);
        return new Response(JSON.stringify({ success: true, hackathon: newHackathon }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });

      case 'update':
        const { data: updatedHackathon, error: updateError } = await supabase
          .from('hackathons')
          .update({
            title: hackathonData.title,
            short_description: hackathonData.short_description,
            description: hackathonData.description,
            status: hackathonData.status,
            start_date: hackathonData.start_date,
            end_date: hackathonData.end_date,
            registration_deadline: hackathonData.registration_deadline,
            max_team_size: hackathonData.max_team_size,
            prize_fund: hackathonData.prize_fund,
            timeline: hackathonData.timeline,
            prizes: hackathonData.prizes,
            partner_cases: hackathonData.partner_cases,
            evaluation_criteria: hackathonData.evaluation_criteria,
            rules_and_requirements: hackathonData.rules_and_requirements,
            partners: hackathonData.partners,
            jury: hackathonData.jury
          })
          .eq('id', hackathonData.id)
          .select()
          .single();

        if (updateError) {
          console.error('Update hackathon error:', updateError);
          throw updateError;
        }

        console.log('Hackathon updated successfully:', updatedHackathon);
        return new Response(JSON.stringify({ success: true, hackathon: updatedHackathon }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });

      case 'delete':
        const { error: deleteError } = await supabase
          .from('hackathons')
          .delete()
          .eq('id', hackathonData.id);

        if (deleteError) {
          console.error('Delete hackathon error:', deleteError);
          throw deleteError;
        }

        console.log('Hackathon deleted successfully:', hackathonData.id);
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
    console.error('Error in admin-hackathons function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
};

serve(handler);