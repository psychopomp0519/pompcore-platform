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
    const supabase = getSupabase();

    /** 현재 세션 즉시 확인 (OAuth 리다이렉트 후 URL 해시에서 토큰 파싱 포함) */
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(mapUserToProfile(session.user));
      }
    });

    /** 이후 상태 변경 구독 (로그인/로그아웃/토큰 갱신) */
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(mapUserToProfile(session.user));
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser]);
}
