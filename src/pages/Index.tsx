import { useAuth } from "@/hooks/useAuth";
import HackathonApp from "@/components/HackathonApp";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  const { loading } = useAuth();

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

  return (
      <div className="min-h-screen bg-background text-foreground">
        <HackathonApp isAuthenticated={false} />
        <Toaster />
      </div>
  );
};

export default Index;