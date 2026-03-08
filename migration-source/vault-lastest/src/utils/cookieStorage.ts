/**
 * @file cookieStorage.ts
 * @description Supabase용 쿠키 기반 스토리지 어댑터
 *
 * `domain=.pompcore.cc` 쿠키를 사용해 pompcore.cc ↔ vault.pompcore.cc
 * 간 Supabase 세션을 자동으로 공유한다.
 *
 * 개발 환경(localhost)에서는 도메인 설정 없이 동작하며,
 * 운영 환경에서만 공유 도메인 쿠키를 적용한다.
 *
 * @module utils/cookieStorage
 */

// ============================================================
// 상수
// ============================================================

/** 쿠키 유효 기간: 1년 (Supabase 세션 갱신은 내부적으로 처리) */
const COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 365;

// ============================================================
// 내부 헬퍼
// ============================================================

/** 현재 브라우저의 모든 쿠키를 파싱 */
function parseCookies(): Record<string, string> {
  return document.cookie.split(';').reduce<Record<string, string>>((acc, raw) => {
    const idx = raw.indexOf('=');
    if (idx === -1) return acc;
    const key = raw.slice(0, idx).trim();
    const val = raw.slice(idx + 1).trim();
    if (key) acc[key] = decodeURIComponent(val);
    return acc;
  }, {});
}

/** 쿠키 Set 속성 문자열 생성 */
function buildCookieAttributes(domain: string, maxAge: number): string {
  const parts = [`Max-Age=${maxAge}`, 'Path=/', 'SameSite=Lax'];
  if (location.protocol === 'https:') parts.push('Secure');
  if (domain) parts.push(`Domain=${domain}`);
  return parts.join('; ');
}

// ============================================================
// 스토리지 어댑터 팩토리
// ============================================================

/**
 * Supabase `createClient` options.auth.storage 에 전달할
 * 쿠키 기반 커스텀 스토리지 어댑터를 생성한다.
 *
 * @param sharedDomain - 서브도메인 간 공유할 도메인 (예: '.pompcore.cc')
 *                       빈 문자열이면 현재 도메인에만 저장.
 */
export function createCookieStorage(sharedDomain: string): Storage {
  return {
    /** Storage 인터페이스 호환용 (사용되지 않음) */
    get length(): number {
      return Object.keys(parseCookies()).length;
    },
    key(_index: number): string | null {
      return null;
    },

    getItem(key: string): string | null {
      return parseCookies()[key] ?? null;
    },

    setItem(key: string, value: string): void {
      const attrs = buildCookieAttributes(sharedDomain, COOKIE_MAX_AGE_SEC);
      document.cookie = `${key}=${encodeURIComponent(value)}; ${attrs}`;
    },

    removeItem(key: string): void {
      const attrs = buildCookieAttributes(sharedDomain, 0);
      document.cookie = `${key}=; ${attrs}`;
    },

    clear(): void {
      const cookies = parseCookies();
      for (const key of Object.keys(cookies)) {
        this.removeItem(key);
      }
    },
  };
}
