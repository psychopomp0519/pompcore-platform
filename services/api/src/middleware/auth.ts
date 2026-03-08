/**
 * @file auth.ts
 * @description JWT authentication middleware.
 *
 * Extracts the Bearer token from the Authorization header, verifies it
 * against Supabase, and attaches the user profile to the request context.
 *
 * @module @pompcore/api/middleware/auth
 */

import { createMiddleware } from 'hono/factory';
import { type UserProfile, mapUserToProfile } from '@pompcore/types';
import { getAdminClient } from '../lib/supabase.js';
import { UnauthorizedError } from '../lib/errors.js';

// ============================================================
// Context type — available to all downstream handlers
// ============================================================

export type AuthVariables = {
  /** Authenticated user profile */
  user: UserProfile;
  /** Raw Supabase access token */
  accessToken: string;
};

function extractToken(header: string | undefined): string {
  if (!header?.startsWith('Bearer ')) {
    throw new UnauthorizedError('Authorization 헤더가 없거나 형식이 올바르지 않습니다.');
  }
  return header.slice(7);
}

// ============================================================
// Middleware
// ============================================================

/**
 * Authentication middleware.
 * Verifies the Supabase JWT and sets `c.var.user` and `c.var.accessToken`.
 */
export const authMiddleware = createMiddleware<{ Variables: AuthVariables }>(
  async (c, next) => {
    const token = extractToken(c.req.header('Authorization'));

    const { data, error } = await getAdminClient().auth.getUser(token);

    if (error || !data.user) {
      throw new UnauthorizedError('유효하지 않은 인증 토큰입니다.');
    }

    c.set('user', mapUserToProfile(data.user));
    c.set('accessToken', token);

    await next();
  },
);
