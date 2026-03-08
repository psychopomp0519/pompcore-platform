/**
 * @file useCategoryInit.ts
 * @description 인증된 사용자의 카테고리 시드 데이터 초기화 훅
 * @module hooks/useCategoryInit
 */

import { useEffect, useRef } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useCategoryStore } from '../stores/categoryStore';

/** 로그인 시 기본 카테고리가 없으면 시드 데이터 생성 */
export function useCategoryInit(): void {
  const userId = useAuthStore((s) => s.user?.id);
  const seedIfNeeded = useCategoryStore((s) => s.seedIfNeeded);
  const seededRef = useRef(false);

  useEffect(() => {
    if (userId && !seededRef.current) {
      seededRef.current = true;
      seedIfNeeded(userId);
    }
  }, [userId, seedIfNeeded]);
}
