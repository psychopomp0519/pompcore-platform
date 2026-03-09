/**
 * @file Platform config factory
 * @description Each app calls createAppConfig() once at startup to initialize shared services.
 * @module @pompcore/sdk/config
 */
import { createSupabaseClient } from '@pompcore/auth';
import { initApiClient } from './api-client';

interface AppIdentity {
  name: string;
  version: string;
  brandColor: string;
  brandColorLight?: string;
  /** Supabase 기본 DB 스키마 (미지정 시 'public') */
  dbSchema?: string;
}

export interface AppConfig {
  app: AppIdentity;
  supabase: { url: string; anonKey: string; isConfigured: boolean };
  pompcore: { url: string; sharedDomain: string };
}

export function createAppConfig(app: AppIdentity): AppConfig {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? '';
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';
  const sharedDomain = import.meta.env.VITE_SHARED_DOMAIN ?? '';
  const pompcoreUrl = import.meta.env.VITE_POMPCORE_URL ?? 'https://pompcore.cc';
  const apiUrl = import.meta.env.VITE_API_URL ?? '';

  const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);

  /** localhost 환경에서는 쿠키 도메인을 설정하지 않음 (브라우저가 외부 도메인 쿠키를 차단) */
  const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const effectiveDomain = isLocalhost ? undefined : (sharedDomain || undefined);

  if (isConfigured) {
    createSupabaseClient({ url: supabaseUrl, anonKey: supabaseAnonKey, sharedDomain: effectiveDomain, dbSchema: app.dbSchema });
  }

  if (apiUrl) {
    initApiClient(apiUrl);
  }

  return {
    app,
    supabase: { url: supabaseUrl, anonKey: supabaseAnonKey, isConfigured },
    pompcore: { url: pompcoreUrl, sharedDomain },
  };
}
