import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Button } from '@/components/ui/button';
import { LogOut, Shield } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';

export default function AdminLayout() {
  const { adminUser, loading, signOut } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground-secondary">Завантаження...</p>
        </div>
      </div>
    );
  }

  if (!adminUser) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">Адміністративна панель</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Увійшов як: {adminUser.email}
            </span>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Вийти
            </Button>
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
}