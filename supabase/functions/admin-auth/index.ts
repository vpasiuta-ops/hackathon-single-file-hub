import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { compare } from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

const handler = async (req: Request): Promise<Response> => {
  console.log('Admin-auth function called with method:', req.method);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    console.log('Environment variables loaded:', { url: !!supabaseUrl, key: !!supabaseAnonKey });
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables');
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { action, email, password } = await req.json();
    console.log('Request body parsed:', { action, email: email ? 'provided' : 'missing' });

    if (action === 'login') {
      console.log('Admin login attempt for:', email);

      const { data: adminUser, error: fetchError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .single();

      if (fetchError) {
        console.error('Error fetching admin user:', fetchError);
        return new Response(JSON.stringify({ error: 'Невірний email або пароль' }), {
          status: 200, // Return 200 to avoid disclosing user existence
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      console.log('Password hash from DB:', adminUser.password_hash);
      console.log('Attempting password comparison...');
      const isPasswordValid = await compare(password, adminUser.password_hash);
      console.log('Password comparison result:', isPasswordValid);

      if (!isPasswordValid) {
        console.log('Invalid password for admin:', email);
        return new Response(JSON.stringify({ error: 'Невірний email або пароль' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      const { password_hash, ...userWithoutPassword } = adminUser;
      console.log('Admin login successful for:', email);
      return new Response(JSON.stringify({ user: userWithoutPassword }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    console.error('Error in admin-auth function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
};

serve(handler);