/**
 * @file useAuthInit.ts
 * @description 앱 시작 시 인증 상태를 초기화하는 훅
 * @module hooks/useAuthInit
 */

import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { onAuthStateChange } from '../services/auth.service';

/** 앱 초기화 시 Supabase 인증 상태 리스너를 등록하는 훅 */
export function useAuthInit(): void {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    setLoading(true);
    const { unsubscribe } = onAuthStateChange((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);
}
