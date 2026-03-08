/**
 * @file rateLimit.ts
 * @description In-memory sliding-window rate limiter.
 *
 * For production SaaS, replace with Redis-backed rate limiting
 * (e.g., @upstash/ratelimit). This in-memory implementation works
 * for single-instance deployments and development.
 *
 * @module @pompcore/api/middleware/rateLimit
 */

import { createMiddleware } from 'hono/factory';
import { RateLimitError } from '../lib/errors.js';

interface RateLimitEntry {
  timestamps: number[];
}

interface RateLimitOptions {
  /** Maximum requests per window */
  limit: number;
  /** Window size in milliseconds */
  windowMs: number;
  /** Key extractor — defaults to IP address */
  keyFn?: (c: { req: { header: (name: string) => string | undefined } }) => string;
}

/**
 * Creates a rate limiter middleware.
 *
 * Usage:
 *   app.use('/api/*', rateLimit({ limit: 100, windowMs: 60_000 }))
 */
export function rateLimit(options: RateLimitOptions) {
  const { limit, windowMs, keyFn } = options;
  const store = new Map<string, RateLimitEntry>();

  // Periodic cleanup to prevent memory leaks
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);
      if (entry.timestamps.length === 0) store.delete(key);
    }
  }, windowMs);

  return createMiddleware(async (c, next) => {
    const key = keyFn
      ? keyFn(c)
      : c.req.header('x-forwarded-for') ?? c.req.header('x-real-ip') ?? 'unknown';

    const now = Date.now();
    const entry = store.get(key) ?? { timestamps: [] };

    // Remove timestamps outside the window
    entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);

    if (entry.timestamps.length >= limit) {
      throw new RateLimitError();
    }

    entry.timestamps.push(now);
    store.set(key, entry);

    // Set standard rate limit headers
    c.header('X-RateLimit-Limit', String(limit));
    c.header('X-RateLimit-Remaining', String(limit - entry.timestamps.length));

    await next();
  });
}
