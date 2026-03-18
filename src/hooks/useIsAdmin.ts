import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { isOwnerEmail } from '@/lib/adminAccess';

export const useIsAdmin = () => {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (authLoading || !user) {
      setIsAdmin(false);
      return;
    }

    if (isOwnerEmail(user.email)) {
      setIsAdmin(true);
      return;
    }

    let cancelled = false;

    const check = async () => {
      try {
        const { data } = await supabase.rpc('has_role', {
          _user_id: user.id,
          _role: 'admin',
        });

        if (!cancelled) setIsAdmin(!!data);
      } catch {
        if (!cancelled) setIsAdmin(false);
      }
    };

    check();

    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  return isAdmin;
};
