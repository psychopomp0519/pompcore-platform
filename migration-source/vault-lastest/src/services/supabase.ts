/**
 * @file supabase.ts
 * @description Supabase 클라이언트 초기화 및 설정
 * @module services/supabase
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { appConfig } from '../config/appConfig';
import { createCookieStorage } from '../utils/cookieStorage';

// ============================================================
// 환경변수 검증
// ============================================================

if (!appConfig.supabase.isConfigured) {
  console.warn('[Vault] Supabase 환경변수가 설정되지 않았습니다.');
}

// ============================================================
// 클라이언트 인스턴스
// ============================================================

/** Supabase 클라이언트 인스턴스 */
export const supabase: SupabaseClient = createClient(
  appConfig.supabase.url,
  appConfig.supabase.anonKey,
  {
    auth: {
      storage: createCookieStorage(appConfig.pompcore.sharedDomain),
      persistSession: true,
      detectSessionInUrl: true,
    },
  },
);

/** Supabase 환경변수가 올바르게 설정되었는지 여부 */
export const isSupabaseConfigured: boolean = appConfig.supabase.isConfigured;
