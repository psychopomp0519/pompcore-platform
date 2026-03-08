/**
 * @file appConfig.ts
 * @description 환경변수 및 앱 설정을 통합 관리하는 config 객체
 * @module config/appConfig
 */

// ============================================================
// Supabase 설정
// ============================================================

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// ============================================================
// PompCore / 도메인 설정
// ============================================================

/**
 * 서브도메인 간 쿠키를 공유할 루트 도메인.
 * 운영: '.pompcore.cc'  →  pompcore.cc ↔ vault.pompcore.cc 세션 공유
 * 개발: '' (빈 문자열)  →  현재 도메인(localhost)에만 저장
 */
const SHARED_DOMAIN = import.meta.env.VITE_SHARED_DOMAIN as string | undefined;

/** PompCore 메인 사이트 URL */
const POMPCORE_URL = import.meta.env.VITE_POMPCORE_URL as string | undefined;

// ============================================================
// Config 객체
// ============================================================

/** 앱 전역 설정 객체 */
export const appConfig = {
  /** Supabase 관련 설정 */
  supabase: {
    url: SUPABASE_URL ?? 'https://placeholder.supabase.co',
    anonKey: SUPABASE_ANON_KEY ?? 'placeholder-key',
    isConfigured: Boolean(SUPABASE_URL && SUPABASE_ANON_KEY),
  },

  /** PompCore 연동 설정 */
  pompcore: {
    /** 메인 사이트 URL (예: https://pompcore.cc) */
    url: POMPCORE_URL ?? 'https://pompcore.cc',
    /**
     * 서브도메인 간 쿠키 공유 도메인 (앞에 '.' 포함)
     * 운영: '.pompcore.cc' / 개발: '' (빈 문자열)
     */
    sharedDomain: SHARED_DOMAIN ?? '',
  },

  /** 앱 메타 정보 */
  app: {
    name: 'Vault',
    version: '1.1.1',
    brandColor: '#10B981',
    brandColorLight: '#34D399',
  },
} as const;
