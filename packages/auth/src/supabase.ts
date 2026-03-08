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
}

let client: SupabaseClient | null = null;

export function createSupabaseClient(config: SupabaseConfig): SupabaseClient {
  const storage = config.sharedDomain ? createCookieStorage(config.sharedDomain) : undefined;

  client = createClient(config.url, config.anonKey, {
    auth: {
      ...(storage ? { storage } : {}),
      persistSession: true,
      detectSessionInUrl: true,
    },
  });

  return client;
}

export function getSupabase(): SupabaseClient {
  if (!client) throw new Error('@pompcore/auth: Supabase client not initialized. Call createSupabaseClient() first.');
  return client;
}
