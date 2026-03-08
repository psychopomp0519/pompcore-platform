/**
 * @file auth.routes.ts
 * @description Auth-related API routes.
 *
 * Note: Actual login/register/OAuth is handled client-side by Supabase Auth.
 * These endpoints provide server-side profile operations and admin actions.
 *
 * @module @pompcore/api/routes/auth
 */

import { Hono } from 'hono';
import type { AuthVariables } from '../middleware/auth.js';
import { authMiddleware } from '../middleware/auth.js';
import { requirePermission } from '../middleware/permissions.js';
import * as authService from '../services/auth.service.js';
import { createUserClient } from '../lib/supabase.js';
import type { UserRole } from '@pompcore/types';

const auth = new Hono<{ Variables: AuthVariables }>();

// All auth routes require authentication
auth.use('/*', authMiddleware);

/** GET /auth/me — Get current user profile */
auth.get('/me', async (c) => {
  const db = createUserClient(c.get('accessToken'));
  const profile = await authService.getCurrentProfile(db);
  return c.json({ data: profile, error: null });
});

/** GET /auth/users/:id — Get any user's profile (admin) */
auth.get('/users/:id', requirePermission('manage_team'), async (c) => {
  const profile = await authService.getUserById(c.req.param('id'));
  return c.json({ data: profile, error: null });
});

/** PATCH /auth/users/:id/role — Update a user's role (leader only) */
auth.patch('/users/:id/role', requirePermission('manage_team'), async (c) => {
  const body = await c.req.json<{ role: UserRole }>();
  const profile = await authService.updateUserRole(c.req.param('id'), body.role);
  return c.json({ data: profile, error: null });
});

export { auth };
