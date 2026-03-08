/**
 * @file supabase.ts
 * @description Server-side Supabase clients.
 *
 * Two clients are available:
 * - adminClient: Uses service-role key, bypasses RLS. For admin operations.
 * - createUserClient(jwt): Creates a per-request client scoped to the user's
 *   JWT, so all queries respect Row Level Security.
 *
 * @module @pompcore/api/lib/supabase
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Env } from './env.js';

let _adminClient: SupabaseClient | null = null;
let _env: Env | null = null;

/** Initialize the module with environment config. Call once at startup. */
export function initSupabase(env: Env): void {
  _env = env;
  _adminClient = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
    db: { schema: 'public' },
  });
}

/**
 * Service-role client scoped to a specific schema.
 * Use for cross-schema queries (core, vault, analytics).
 */
export function getSchemaClient(schema: 'core' | 'vault' | 'analytics'): SupabaseClient {
  if (!_env) throw new Error('Supabase not initialized');
  return createClient(_env.SUPABASE_URL, _env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
    db: { schema },
  }) as unknown as SupabaseClient;
}

/** Service-role client — bypasses RLS. Use for admin operations only. */
export function getAdminClient(): SupabaseClient {
  if (!_adminClient) throw new Error('Supabase admin client not initialized');
  return _adminClient;
}

/**
 * Create a per-request client scoped to the user's JWT.
 * All queries through this client respect Row Level Security.
 */
export function createUserClient(accessToken: string): SupabaseClient {
  if (!_env) throw new Error('Supabase not initialized');
  return createClient(_env.SUPABASE_URL, _env.SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
