/**
 * @file cors.ts
 * @description CORS middleware configured for PompCore platform domains.
 * @module @pompcore/api/middleware/cors
 */

import { cors } from 'hono/cors';
import type { Env } from '../lib/env.js';

/**
 * Creates CORS middleware configured for the platform.
 *
 * In development, allows localhost origins.
 * In production, restricts to ALLOWED_ORIGINS from env.
 */
export function createCors(env: Env) {
  const origins = env.ALLOWED_ORIGINS.split(',').map((o) => o.trim());

  // In dev, also allow localhost variants
  if (env.NODE_ENV === 'development') {
    origins.push('http://localhost:5173', 'http://localhost:5174', 'http://localhost:4173');
  }

  return cors({
    origin: origins,
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    exposeHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining'],
    credentials: true,
    maxAge: 86400,
  });
}
