/**
 * @file index.ts
 * @description @pompcore/api — Platform API entry point.
 *
 * Hono-based REST API that serves as the backend for all PompCore apps.
 * Runs on Node.js (serve adapter) in development and can be deployed
 * to any edge runtime (Cloudflare Workers, Deno Deploy, Bun).
 *
 * @module @pompcore/api
 */

import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { serve } from '@hono/node-server';
import { loadEnv } from './lib/env.js';
import { initSupabase } from './lib/supabase.js';
import { createCors } from './middleware/cors.js';
import { rateLimit } from './middleware/rateLimit.js';
import { registerRoutes } from './routes/index.js';
import { ApiError } from './lib/errors.js';
import { eventBus } from './lib/events.js';
import { getSchemaClient } from './lib/supabase.js';

// ============================================================
// Bootstrap
// ============================================================

const env = loadEnv();
initSupabase(env);

// ============================================================
// Event listeners (fire-and-forget async processing)
// ============================================================

// Log all events to analytics.events table
eventBus.onPrefix('vault.', async (event) => {
  try {
    await getSchemaClient('analytics').from('events').insert({
      user_id: event.userId,
      service_id: event.source,
      event_type: event.type.split('.')[1] ?? 'unknown',
      event_name: event.type,
      metadata: event.data as Record<string, unknown>,
      session_id: event.metadata?.sessionId ?? null,
      ip_address: event.metadata?.ipAddress ?? null,
      user_agent: event.metadata?.userAgent ?? null,
    });
  } catch (err) {
    console.error('[Events] Failed to log event:', err);
  }
});

// Increment usage counters for quota enforcement
eventBus.onPrefix('vault.', async (event) => {
  if (!event.type.includes('.created')) return;

  const entity = event.type.split('.')[1]; // 'transaction', 'account', etc.
  const quotaKey = `${entity}s_per_month`;
  const periodStart = new Date().toISOString().slice(0, 7) + '-01';

  try {
    const analytics = getSchemaClient('analytics');
    const { data: existing } = await analytics
      .from('service_usage')
      .select('id, counters')
      .eq('user_id', event.userId)
      .eq('service_id', event.source)
      .eq('period_start', periodStart)
      .maybeSingle();

    if (existing) {
      const counters = (existing.counters ?? {}) as Record<string, number>;
      counters[quotaKey] = (counters[quotaKey] ?? 0) + 1;
      await analytics
        .from('service_usage')
        .update({ counters, api_calls: (counters['api_calls'] ?? 0) + 1 })
        .eq('id', existing.id);
    } else {
      await analytics.from('service_usage').insert({
        user_id: event.userId,
        service_id: event.source,
        period_start: periodStart,
        api_calls: 1,
        counters: { [quotaKey]: 1 },
      });
    }
  } catch (err) {
    console.error('[Events] Failed to update usage:', err);
  }
});

const app = new Hono();

// ============================================================
// Global middleware
// ============================================================

app.use('*', logger());
app.use('*', createCors(env));
app.use('*', rateLimit({ limit: 200, windowMs: 60_000 }));

// ============================================================
// Routes
// ============================================================

registerRoutes(app);

// ============================================================
// Global error handler
// ============================================================

app.onError((err, c) => {
  if (err instanceof ApiError) {
    return c.json(
      { data: null, error: err.message, code: err.code },
      err.statusCode as 400,
    );
  }

  console.error('[API] Unhandled error:', err);
  return c.json(
    { data: null, error: '서버 내부 오류가 발생했습니다.', code: 'INTERNAL_ERROR' },
    500,
  );
});

// ============================================================
// 404 fallback
// ============================================================

app.notFound((c) => {
  return c.json(
    { data: null, error: '요청한 엔드포인트를 찾을 수 없습니다.', code: 'NOT_FOUND' },
    404,
  );
});

// ============================================================
// Start server
// ============================================================

const port = Number(env.PORT);

serve({ fetch: app.fetch, port }, () => {
  console.log(`@pompcore/api running on http://localhost:${port}`);
  console.log(`  Environment: ${env.NODE_ENV}`);
  console.log(`  CORS origins: ${env.ALLOWED_ORIGINS}`);
});

export default app;
