/**
 * @file useMediaQuery — Responsive breakpoint detection hook
 * @module @pompcore/ui/useMediaQuery
 */
import { useSyncExternalStore, useCallback } from 'react';

/** 미디어 쿼리 결과를 반환하는 훅 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener('change', callback);
      return () => mediaQuery.removeEventListener('change', callback);
    },
    [query],
  );

  const getSnapshot = useCallback(() => {
    return window.matchMedia(query).matches;
  }, [query]);

  return useSyncExternalStore(subscribe, getSnapshot);
}

type DeviceType = 'mobile' | 'tablet' | 'desktop';

/** 모바일 뷰포트 (768px 미만) */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 767px)');
}

/** 태블릿 뷰포트 (768px ~ 1199px) */
export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 768px) and (max-width: 1199px)');
}

/** 데스크톱 뷰포트 (1200px 이상) */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1200px)');
}

/** 현재 디바이스 타입을 반환하는 훅 */
export function useDeviceType(): DeviceType {
  const isDesktop = useIsDesktop();
  const isTablet = useIsTablet();

  if (isDesktop) return 'desktop';
  if (isTablet) return 'tablet';
  return 'mobile';
}
