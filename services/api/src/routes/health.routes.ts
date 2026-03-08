/**
 * @file health.routes.ts
 * @description Health check endpoint — no auth required.
 * @module @pompcore/api/routes/health
 */

import { Hono } from 'hono';

const health = new Hono();

health.get('/', (c) => {
  return c.json({
    status: 'ok',
    service: '@pompcore/api',
    timestamp: new Date().toISOString(),
  });
});

export { health };
