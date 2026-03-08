/**
 * @file env.ts
 * @description Runtime environment configuration with validation.
 * @module @pompcore/api/lib/env
 */

export interface Env {
  /** Supabase project URL */
  SUPABASE_URL: string;
  /** Supabase anon (public) key — used for user-scoped RLS queries */
  SUPABASE_ANON_KEY: string;
  /** Supabase service-role key — bypasses RLS for admin operations */
  SUPABASE_SERVICE_ROLE_KEY: string;
  /** JWT secret for verifying Supabase-issued tokens */
  SUPABASE_JWT_SECRET: string;
  /** Allowed origins for CORS (comma-separated) */
  ALLOWED_ORIGINS: string;
  /** Server port */
  PORT: string;
  /** Runtime environment */
  NODE_ENV: string;
}

const REQUIRED_KEYS: (keyof Env)[] = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SUPABASE_JWT_SECRET',
];

/** Load and validate environment variables */
export function loadEnv(): Env {
  const env: Env = {
    SUPABASE_URL: process.env.SUPABASE_URL ?? '',
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ?? '',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
    SUPABASE_JWT_SECRET: process.env.SUPABASE_JWT_SECRET ?? '',
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS ?? 'https://pompcore.cc,https://vault.pompcore.cc',
    PORT: process.env.PORT ?? '4000',
    NODE_ENV: process.env.NODE_ENV ?? 'development',
  };

  const missing = REQUIRED_KEYS.filter((k) => !env[k]);
  if (missing.length > 0) {
    throw new Error(`@pompcore/api: Missing required env vars: ${missing.join(', ')}`);
  }

  return env;
}
