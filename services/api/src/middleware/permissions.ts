/**
 * @file permissions.ts
 * @description Role-based permission guard middleware.
 *
 * Imports hasPermission from @pompcore/types so that
 * the permission model is consistent between client and server.
 *
 * @module @pompcore/api/middleware/permissions
 */

import { createMiddleware } from 'hono/factory';
import { type UserRole, type Permission, hasPermission } from '@pompcore/types';
import type { AuthVariables } from './auth.js';
import { ForbiddenError } from '../lib/errors.js';

// ============================================================
// Middleware factory
// ============================================================

/**
 * Creates a middleware that checks if the authenticated user has the
 * required permission. Must be placed AFTER authMiddleware.
 *
 * Usage:
 *   app.get('/admin', authMiddleware, requirePermission('manage_team'), handler)
 */
export function requirePermission(permission: Permission) {
  return createMiddleware<{ Variables: AuthVariables }>(async (c, next) => {
    const user = c.get('user');

    if (!user) {
      throw new ForbiddenError();
    }

    if (!hasPermission(user.role, permission)) {
      throw new ForbiddenError(`'${permission}' 권한이 필요합니다.`);
    }

    await next();
  });
}

/**
 * Creates a middleware that checks if the user has ANY of the specified roles.
 *
 * Usage:
 *   app.get('/internal', authMiddleware, requireRole('leader', 'member'), handler)
 */
export function requireRole(...roles: UserRole[]) {
  return createMiddleware<{ Variables: AuthVariables }>(async (c, next) => {
    const user = c.get('user');

    if (!user || !roles.includes(user.role)) {
      throw new ForbiddenError();
    }

    await next();
  });
}
