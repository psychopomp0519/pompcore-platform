/**
 * @file Hybrid Storage adapter for Supabase — localStorage + 크로스도메인 쿠키 마커
 * @description 세션 데이터는 localStorage에 저장하고, 크로스도메인 SSO를 위한
 *              짧은 마커 쿠키만 .pompcore.cc 에 설정한다.
 *              쿠키 4KB 제한으로 인해 세션 전체를 쿠키에 넣을 수 없으므로
 *              이 하이브리드 전략을 사용한다.
 * @module @pompcore/auth/cookie-storage
 */

// ============================================================
// Constants
// ============================================================

/** 쿠키 유효 기간: 30일 */
const COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 30;

/** SSO 마커 쿠키 키 접미사 */
const SSO_MARKER_SUFFIX = '-sso-marker';

// ============================================================
// Internal helpers
// ============================================================

/** 쿠키 Set 속성 문자열 생성 */
function buildCookieAttributes(domain: string, maxAge: number): string {
  const parts = [`Max-Age=${maxAge}`, 'Path=/', 'SameSite=Lax'];
  if (location.protocol === 'https:') parts.push('Secure');
  if (domain) parts.push(`Domain=${domain}`);
  return parts.join('; ');
}

/** SSO 마커 쿠키 설정 (세션 존재 여부만 기록) */
function setSsoMarker(domain: string, key: string, hasSession: boolean): void {
  const markerKey = key + SSO_MARKER_SUFFIX;
  const attrs = buildCookieAttributes(domain, hasSession ? COOKIE_MAX_AGE_SEC : 0);
  document.cookie = `${markerKey}=${hasSession ? '1' : ''}; ${attrs}`;
}

// ============================================================
// Storage adapter factory
// ============================================================

/**
 * Supabase `createClient` options.auth.storage에 전달할 하이브리드 스토리지 어댑터.
 *
 * - 읽기/쓰기: localStorage (크기 제한 없음)
 * - 크로스도메인 마커: .pompcore.cc 쿠키 (1바이트, 세션 존재 여부만)
 *
 * @param sharedDomain - 서브도메인 간 공유할 도메인 (예: '.pompcore.cc')
 */
export function createCookieStorage(sharedDomain: string): Storage {
  return {
    get length(): number {
      return localStorage.length;
    },
    key(index: number): string | null {
      return localStorage.key(index);
    },

    getItem(key: string): string | null {
      return localStorage.getItem(key);
    },

    setItem(key: string, value: string): void {
      localStorage.setItem(key, value);
      /* 세션 토큰 키에 대해서만 SSO 마커 쿠키 설정 */
      if (key.includes('auth-token') && !key.includes('code-verifier')) {
        setSsoMarker(sharedDomain, key, true);
      }
    },

    removeItem(key: string): void {
      localStorage.removeItem(key);
      if (key.includes('auth-token') && !key.includes('code-verifier')) {
        setSsoMarker(sharedDomain, key, false);
      }
    },

    clear(): void {
      localStorage.clear();
    },
  };
}
