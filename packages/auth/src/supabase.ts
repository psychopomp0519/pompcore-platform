/**
 * @file Shared Supabase client with cross-domain cookie session storage
 * @module @pompcore/auth/supabase
 * TODO: Migrate full implementation from Vault
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { createCookieStorage } from './cookie-storage';

interface SupabaseConfig {
  url: string;
  anonKey: string;
  sharedDomain?: string;
  /** 기본 DB 스키마 (미지정 시 'public') */
  dbSchema?: string;
}

/** 커스텀 스키마를 지원하기 위해 제네릭을 열어둔 클라이언트 타입 */
type AnySupabaseClient = SupabaseClient<any, string, any>;

let client: AnySupabaseClient | null = null;

export function createSupabaseClient(config: SupabaseConfig): AnySupabaseClient {
  const storage = config.sharedDomain ? createCookieStorage(config.sharedDomain) : undefined;

  client = createClient(config.url, config.anonKey, {
    db: config.dbSchema ? { schema: config.dbSchema } : undefined,
    auth: {
      ...(storage ? { storage } : {}),
      persistSession: true,
      detectSessionInUrl: false,
      autoRefreshToken: true,
      flowType: 'pkce',
    },
  });

  return client;
}

export function getSupabase(): AnySupabaseClient {
  if (!client) throw new Error('@pompcore/auth: Supabase client not initialized. Call createSupabaseClient() first.');
  return client;
}
