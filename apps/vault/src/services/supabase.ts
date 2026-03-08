/**
 * @file supabase.ts
 * @description Supabase 클라이언트 — 공유 패키지에서 초기화된 싱글톤 사용
 *
 * main.tsx에서 createAppConfig() 호출 시 @pompcore/auth의
 * createSupabaseClient()가 실행되어 싱글톤이 초기화된다.
 * 모든 도메인 서비스는 이 모듈을 통해 동일한 클라이언트를 참조한다.
 *
 * @module services/supabase
 */

import { getSupabase } from '@pompcore/auth';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase 클라이언트 지연 프록시
 *
 * 모듈 import 시점이 아닌 실제 프로퍼티 접근 시점에 getSupabase()를 호출한다.
 * main.tsx의 createAppConfig()이 먼저 실행된 후 서비스 코드가 동작하므로
 * 초기화 순서 문제를 방지한다.
 */
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getSupabase(), prop, receiver);
  },
});

/** Supabase 환경변수가 올바르게 설정되었는지 여부 */
export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY,
);
