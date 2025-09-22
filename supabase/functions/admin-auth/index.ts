import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AuthRequest {
  action: 'login';
  email: string;
  password: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { action, email, password }: AuthRequest = await req.json();

    if (action === 'login') {
      console.log('Admin login attempt for:', email);

      // Get admin user from database
      const { data: adminUser, error: fetchError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .single();

      if (fetchError) {
        console.error('Error fetching admin user:', fetchError);
        return new Response(
          JSON.stringify({ error: 'Невірний email або пароль' }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          }
        );
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, adminUser.password_hash);
      
      if (!isPasswordValid) {
        console.log('Invalid password for admin:', email);
        return new Response(
          JSON.stringify({ error: 'Невірний email або пароль' }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          }
        );
      }

      // Return admin user data (without password hash)
      const { password_hash, ...userWithoutPassword } = adminUser;
      
      console.log('Admin login successful for:', email);
      
      return new Response(
        JSON.stringify({ user: userWithoutPassword }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Error in admin-auth function:', error);
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