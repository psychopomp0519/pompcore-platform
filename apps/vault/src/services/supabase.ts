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

/** Supabase 클라이언트 인스턴스 (공유 싱글톤) */
export const supabase = getSupabase();

/** Supabase 환경변수가 올바르게 설정되었는지 여부 */
export const isSupabaseConfigured = true;
