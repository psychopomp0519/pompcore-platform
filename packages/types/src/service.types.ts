/**
 * @file Service-related type definitions for the PompCore SaaS platform.
 * @module @pompcore/types/service
 */

// ── Service Registry ────────────────────────────────

export type ServiceStatus = 'active' | 'beta' | 'maintenance' | 'coming_soon';

export type SubscriptionTier = 'free' | 'starter' | 'pro' | 'enterprise';

export interface ServiceRateLimit {
  requests_per_minute: number;
}

export interface ServiceQuotas {
  [tier: string]: Record<string, number>;
}

export interface ServiceFeatures {
  [feature: string]: SubscriptionTier[];
}

export interface ServiceConfig {
  rate_limit?: ServiceRateLimit;
  quotas?: ServiceQuotas;
  features?: ServiceFeatures;
}

export interface Service {
  id: string;
  name: string;
  description: string | null;
  base_url: string | null;
  icon: string | null;
  status: ServiceStatus;
  is_free: boolean;
  config: ServiceConfig;
  created_at: string;
}

export interface ServiceSubscription {
  id: string;
  organization_id: string | null;
  user_id: string;
  service_id: string;
  tier: SubscriptionTier;
  starts_at: string;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

// ── Events ──────────────────────────────────────────

export interface PlatformEvent<T = unknown> {
  id: string;
  type: string;
  source: string;
  userId: string;
  timestamp: string;
  data: T;
  metadata?: {
    sessionId?: string;
    ipAddress?: string;
    userAgent?: string;
  };
}

// ── Quota ───────────────────────────────────────────

export interface UsageCounters {
  [key: string]: number;
}

export interface ServiceUsage {
  user_id: string;
  service_id: string;
  period_start: string;
  api_calls: number;
  storage_bytes: number;
  counters: UsageCounters;
}
