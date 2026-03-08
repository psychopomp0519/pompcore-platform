/**
 * @file useAuthInit — Register Supabase auth state listener on app mount
 * @module @pompcore/auth/hooks/useAuthInit
 */
import { useEffect } from 'react';
import { getSupabase } from '../supabase';
import { useAuthStore } from '../auth.store';
import { mapUserToProfile } from '@pompcore/types';

export function useAuthInit(): void {
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    const { data: { subscription } } = getSupabase().auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(mapUserToProfile(session.user));
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser]);
}
