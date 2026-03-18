import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useIsAdmin = () => {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (authLoading || !user) {
      setIsAdmin(false);
      return;
    }

    const check = async () => {
      try {
        const { data } = await supabase.rpc('has_role', {
          _user_id: user.id,
          _role: 'admin',
        });
        setIsAdmin(!!data);
      } catch {
        setIsAdmin(false);
      }
    };

    check();
  }, [user, authLoading]);

  return isAdmin;
};
