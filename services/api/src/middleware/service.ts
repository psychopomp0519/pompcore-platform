/**
 * @file service.ts
 * @description Per-service middleware: subscription validation, quota enforcement.
 *
 * Placed after authMiddleware on service-specific routes.
 * Checks that the authenticated user has an active subscription
 * to the target service and hasn't exceeded their tier's quotas.
 *
 * @module @pompcore/api/middleware/service
 */

import { createMiddleware } from 'hono/factory';
import type { AuthVariables } from './auth.js';
import { getSchemaClient } from '../lib/supabase.js';
import { ForbiddenError, RateLimitError } from '../lib/errors.js';
import type { ServiceConfig, SubscriptionTier } from '@pompcore/types';

// ── Types ───────────────────────────────────────────

export type ServiceVariables = AuthVariables & {
  /** Active subscription tier for the current service */
  tier: SubscriptionTier;
  /** Resolved service config */
  serviceConfig: ServiceConfig;
};

// ── Cache ───────────────────────────────────────────

interface CachedConfig {
  config: ServiceConfig;
  fetchedAt: number;
}

const configCache = new Map<string, CachedConfig>();
const CONFIG_TTL_MS = 60_000; // 1 minute

async function getServiceConfig(serviceId: string): Promise<ServiceConfig> {
  const cached = configCache.get(serviceId);
  if (cached && Date.now() - cached.fetchedAt < CONFIG_TTL_MS) {
    return cached.config;
  }

  const { data, error } = await getSchemaClient('core')
    .from('services')
    .select('config')
    .eq('id', serviceId)
    .single();

  if (error || !data) {
    return {};
  }

  const config = (data.config ?? {}) as ServiceConfig;
  configCache.set(serviceId, { config, fetchedAt: Date.now() });
  return config;
}

// ── Subscription Check ──────────────────────────────

/**
 * Middleware that validates the user has an active subscription
 * to the specified service.
 *
 * Sets `c.var.tier` and `c.var.serviceConfig` for downstream handlers.
 *
 * @example
 *   vault.use('/*', authMiddleware);
 *   vault.use('/*', requireService('vault'));
 */
export function requireService(serviceId: string) {
  return createMiddleware<{ Variables: ServiceVariables }>(async (c, next) => {
    const user = c.get('user');

    // Check subscription
    const { data: sub } = await getSchemaClient('core')
      .from('service_subscriptions')
      .select('tier, is_active, expires_at')
      .eq('user_id', user.id)
      .eq('service_id', serviceId)
      .eq('is_active', true)
      .maybeSingle();

    if (!sub) {
      throw new ForbiddenError(`'${serviceId}' 서비스에 대한 구독이 필요합니다.`);
    }

    // Check expiration
    if (sub.expires_at && new Date(sub.expires_at) < new Date()) {
      throw new ForbiddenError('서비스 구독이 만료되었습니다.');
    }

    const config = await getServiceConfig(serviceId);

    c.set('tier', sub.tier as SubscriptionTier);
    c.set('serviceConfig', config);

    await next();
  });
}

// ── Quota Enforcement ───────────────────────────────

/**
 * Middleware that checks a specific quota counter against the user's tier limits.
 *
 * @param serviceId - The service to check quotas for
 * @param quotaKey  - The quota key (e.g., 'transactions_per_month', 'accounts')
 *
 * @example
 *   transactions.post('/', requireQuota('vault', 'transactions_per_month'), handler);
 */
export function requireQuota(serviceId: string, quotaKey: string) {
  return createMiddleware<{ Variables: ServiceVariables }>(async (c, next) => {
    const user = c.get('user');
    const tier = c.get('tier');
    const config = c.get('serviceConfig');

    // Get tier-specific quota limit
    const tierQuotas = config.quotas?.[tier];
    if (!tierQuotas) {
      // No quotas defined for this tier — allow
      await next();
      return;
    }

    const limit = tierQuotas[quotaKey];
    if (limit === undefined || limit === -1) {
      // -1 = unlimited, undefined = not configured
      await next();
      return;
    }

    // Get current usage for this billing period
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .slice(0, 10);

    const { data: usage } = await getSchemaClient('analytics')
      .from('service_usage')
      .select('counters')
      .eq('user_id', user.id)
      .eq('service_id', serviceId)
      .eq('period_start', periodStart)
      .maybeSingle();

    const currentCount = (usage?.counters as Record<string, number> | null)?.[quotaKey] ?? 0;

    if (currentCount >= limit) {
      throw new RateLimitError(
        `이번 달 ${quotaKey} 한도(${limit})에 도달했습니다. 플랜을 업그레이드하세요.`,
      );
    }

    await next();
  });
}

// ── Feature Gate ────────────────────────────────────

/**
 * Middleware that checks if a feature is available for the user's subscription tier.
 *
 * @example
 *   transactions.get('/export', requireFeature('export_csv'), exportHandler);
 */
export function requireFeature(featureKey: string) {
  return createMiddleware<{ Variables: ServiceVariables }>(async (c, next) => {
    const tier = c.get('tier');
    const config = c.get('serviceConfig');

    const allowedTiers = config.features?.[featureKey];

    if (allowedTiers && !allowedTiers.includes(tier)) {
      throw new ForbiddenError(
        `'${featureKey}' 기능은 현재 플랜에서 사용할 수 없습니다. 업그레이드가 필요합니다.`,
      );
    }

    await next();
  });
}
