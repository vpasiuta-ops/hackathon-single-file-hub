import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useRefreshProfile = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();

  const refreshProfile = async () => {
    if (!user?.id) {
      console.log('No user ID available for profile refresh');
      return;
    }

    try {
      console.log('Manually refreshing profile for user:', user.id);
      
      // Fetch fresh profile data
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error refreshing profile:', error);
        return;
      }

      console.log('Fresh profile data:', profileData);
      
      if (profileData) {
        // Update the profile in auth context by calling updateProfile with the same data
        // This will trigger the profile state update
        await updateProfile({});
        
        toast({
          title: 'Профіль оновлено',
          description: `Ваша роль: ${profileData.role === 'captain' ? 'Капітан команди' : 
            profileData.role === 'participant' ? 'Учасник' :
            profileData.role === 'judge' ? 'Суддя' : 
            profileData.role === 'admin' ? 'Адміністратор' : 'Гість'}`,
        });
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося оновити профіль',
        variant: 'destructive'
      });
    }
  };

  return { refreshProfile };
};