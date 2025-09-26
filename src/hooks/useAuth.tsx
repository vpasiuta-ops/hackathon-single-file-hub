import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import type { UserRole } from '@/types/auth';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  userRole: UserRole;
  loading: boolean;
  signUp: (email: string, password: string, recaptchaToken: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<{ error: any }>;
  completeProfile: (data: Partial<Profile>) => Promise<{ error: any }>;
  updateUserRole: (newRole: UserRole) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('guest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, !!session?.user);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile
          setTimeout(async () => {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', session.user.id)
              .maybeSingle();
            
            console.log('Profile loaded:', profileData);
            setProfile(profileData);
            setUserRole((profileData?.role as UserRole) || 'participant');
          }, 0);
        } else {
          setProfile(null);
          setUserRole('guest');
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .maybeSingle()
          .then(({ data: profileData }) => {
            console.log('Initial profile loaded:', profileData);
            setProfile(profileData);
            setUserRole((profileData?.role as UserRole) || 'participant');
            setLoading(false);
          });
      } else {
        setUserRole('guest');
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Separate effect for real-time profile updates
  useEffect(() => {
    if (!user?.id) return;

    console.log('Setting up real-time listener for user:', user.id);
    
    const profileChannel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Profile updated in real-time:', payload);
          if (payload.new) {
            const updatedProfile = payload.new as Profile;
            setProfile(updatedProfile);
            setUserRole((updatedProfile.role as UserRole) || 'participant');
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up real-time listener');
      supabase.removeChannel(profileChannel);
    };
  }, [user?.id]);

  const signUp = async (email: string, password: string, recaptchaToken: string) => {
    // First verify reCAPTCHA
    try {
      const { data: verifyResult } = await supabase.functions.invoke('verify-recaptcha', {
        body: { recaptchaToken }
      });

      if (!verifyResult?.success) {
        return { error: new Error('reCAPTCHA verification failed') };
      }
    } catch (error) {
      console.error('reCAPTCHA verification error:', error);
      return { error: new Error('reCAPTCHA verification failed') };
    }

    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = async (data: Partial<Profile>) => {
    if (!user) return { error: 'No user found' };
    
    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('user_id', user.id);
    
    if (!error) {
      // Refetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      setProfile(profileData);
      setUserRole((profileData?.role as UserRole) || 'participant');
    }
    
    return { error };
  };

  const completeProfile = async (data: Partial<Profile>) => {
    const profileData = {
      ...data,
      is_profile_complete: true
    };
    
    return updateProfile(profileData);
  };

  const updateUserRole = async (newRole: UserRole) => {
    if (!user) return { error: 'No user found' };
    
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('user_id', user.id);
    
    if (!error) {
      setUserRole(newRole);
      // Refetch profile to get updated data
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      setProfile(profileData);
    }
    
    return { error };
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      userRole,
      loading,
      signUp,
      signIn,
      signOut,
      updateProfile,
      completeProfile,
      updateUserRole
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}