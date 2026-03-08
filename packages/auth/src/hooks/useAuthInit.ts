/**
 * @file useAuthInit — Register Supabase auth state listener on app mount
 * @module @pompcore/auth/hooks/useAuthInit
 */
import { useEffect } from 'react';
import { getSupabase } from '../supabase';
import { useAuthStore } from '../auth.store';
import { mapUserToProfile } from '@pompcore/types';

/**
 * 앱 마운트 시 Supabase 인증 상태 리스너를 등록한다.
 *
 * onAuthStateChange의 INITIAL_SESSION 이벤트가 URL 해시/코드 파싱
 * (OAuth 콜백)을 포함한 초기 세션을 보장하므로
 * 별도의 getSession() 호출 없이 이 리스너만으로 충분하다.
 */
export function useAuthInit(): void {
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);

  useEffect(() => {
    const supabase = getSupabase();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(mapUserToProfile(session.user));
        } else {
          setUser(null);
        }
      },
    );

    /**
     * 안전장치: onAuthStateChange가 INITIAL_SESSION을 발행하지 못하는
     * 엣지 케이스 대비. 5초 후에도 isLoading이면 강제로 해제한다.
     */
    const timeout = setTimeout(() => {
      const { isLoading } = useAuthStore.getState();
      if (isLoading) {
        setLoading(false);
      }
    }, 5000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [setUser, setLoading]);
}
