import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { Resend } from "https://esm.sh/resend@4.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  templateId: string;
  recipientEmail?: string;
  type: 'test' | 'mass';
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const resendApiKey = Deno.env.get('RESEND_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const resend = new Resend(resendApiKey);

    const { templateId, recipientEmail, type }: EmailRequest = await req.json();

    console.log('Email send request:', { templateId, type, recipientEmail });

    // Get email template
    const { data: template, error: templateError } = await supabase
      .from('email_templates')
      .select('*')
      .eq('id', templateId)
      .single();

    if (templateError) {
      console.error('Error fetching template:', templateError);
      return new Response(
        JSON.stringify({ error: 'Шаблон не знайдено' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    let recipients: string[] = [];

    if (type === 'test') {
      if (!recipientEmail) {
        return new Response(
          JSON.stringify({ error: 'Recipient email is required for test emails' }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          }
        );
      }
      recipients = [recipientEmail];
    } else if (type === 'mass') {
      // Get all user profiles to retrieve user emails
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id');

      if (profilesError) {
        console.error('Error fetching user profiles:', profilesError);
        return new Response(
          JSON.stringify({ error: 'Не вдалося отримати список користувачів' }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          }
        );
      }

      if (!profiles || profiles.length === 0) {
        console.log('No user profiles found');
        return new Response(
          JSON.stringify({ error: 'Користувачі не знайдені' }),
          {
            status: 404,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          }
        );
      }

      // Get auth user data using service role client
      const supabaseAdmin = createClient(
        supabaseUrl,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      );

      const userIds = profiles.map(p => p.user_id);
      
      // Get user emails from auth.users using service role
      const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
      
      if (authError) {
        console.error('Error fetching auth users:', authError);
        return new Response(
          JSON.stringify({ error: 'Не вдалося отримати email користувачів' }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          }
        );
      }

      // Filter emails for users who have profiles
      recipients = authUsers.users
        .filter(user => userIds.includes(user.id))
        .map(user => user.email)
        .filter(email => email) as string[];

      console.log(`Found ${recipients.length} recipient emails for mass send`);
    }

    const emailResults = [];

    for (const recipient of recipients) {
      try {
        const { data: emailResult, error: sendError } = await resend.emails.send({
          from: 'Hackathon <onboarding@resend.dev>',
          to: [recipient],
          subject: template.subject,
          html: template.html_content,
        });

        if (sendError) {
          console.error('Error sending email to', recipient, ':', sendError);
          emailResults.push({ recipient, success: false, error: sendError.message });
        } else {
          console.log('Email sent successfully to:', recipient);
          emailResults.push({ recipient, success: true, id: emailResult?.id });

          // Log the email send
          await supabase
            .from('email_logs')
            .insert([{
              template_id: templateId,
              recipient_email: recipient,
              status: 'sent'
            }]);
        }
      } catch (error) {
        console.error('Exception sending email to', recipient, ':', error);
        emailResults.push({ recipient, success: false, error: error.message });
      }
    }

    console.log('Email send results:', emailResults);

    return new Response(
      JSON.stringify({ 
        success: true, 
        results: emailResults,
        totalSent: emailResults.filter(r => r.success).length,
        totalFailed: emailResults.filter(r => !r.success).length
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Error in send-email function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);