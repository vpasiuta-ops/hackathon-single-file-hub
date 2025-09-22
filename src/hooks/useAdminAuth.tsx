import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdminUser {
  id: string;
  email: string;
  created_at: string;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if admin is logged in from localStorage
    const storedAdmin = localStorage.getItem('adminUser');
    if (storedAdmin) {
      setAdminUser(JSON.parse(storedAdmin));
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: { action: 'login', email, password }
      });

      if (error) throw error;

      if (data.error) {
        return { error: data.error };
      }

      if (data.user) {
        setAdminUser(data.user);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        toast({
          title: 'Успішно',
          description: 'Ви увійшли до адмін-панелі',
        });
        return {};
      }

      return { error: 'Невірний email або пароль' };
    } catch (error: any) {
      console.error('Admin sign in error:', error);
      return { error: error.message || 'Помилка входу' };
    }
  };

  const signOut = async (): Promise<void> => {
    setAdminUser(null);
    localStorage.removeItem('adminUser');
    toast({
      title: 'Вихід',
      description: 'Ви вийшли з адмін-панелі',
    });
  };

  return (
    <AdminAuthContext.Provider value={{ adminUser, loading, signIn, signOut }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}