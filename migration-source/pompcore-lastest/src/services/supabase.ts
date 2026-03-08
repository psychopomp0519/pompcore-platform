/**
 * Supabase 클라이언트 설정
 * - 환경변수에서 URL과 키를 읽어 클라이언트 생성
 * - 모든 서비스 모듈에서 이 클라이언트를 import하여 사용
 * - .env 파일에 VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY 필요
 * - 환경변수 미설정 시에도 앱이 정상 동작하도록 방어 처리
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

/** Supabase 환경변수가 유효하게 설정되어 있는지 여부 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn(
    '[PompCore] Supabase 환경변수가 설정되지 않았습니다. 인증 기능이 비활성화됩니다.'
  );
}

export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
);
