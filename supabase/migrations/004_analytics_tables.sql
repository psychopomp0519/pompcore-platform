-- ============================================================
-- 004: Analytics schema tables
-- ============================================================
-- Event tracking, pre-aggregated metrics, service usage.
-- Designed for append-only writes from the API layer.
-- ============================================================

-- ============================================================
-- analytics.events
-- Generic event log for user activity tracking.
-- Append-only — no UPDATE/DELETE by users.
-- ============================================================
CREATE TABLE analytics.events (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  service_id      TEXT        NOT NULL REFERENCES core.services(id),
  event_type      TEXT        NOT NULL,   -- 'page_view', 'feature_use', 'error', etc.
  event_name      TEXT        NOT NULL,   -- 'dashboard.load', 'transaction.create', etc.
  metadata        JSONB       DEFAULT '{}',
  session_id      TEXT,
  ip_address      INET,
  user_agent      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE analytics.events IS 'Append-only event log for user activity';

-- Partition-friendly indexes (by time + service)
CREATE INDEX idx_analytics_events_created
  ON analytics.events(created_at DESC);
CREATE INDEX idx_analytics_events_user
  ON analytics.events(user_id, created_at DESC);
CREATE INDEX idx_analytics_events_service
  ON analytics.events(service_id, event_type, created_at DESC);

-- ============================================================
-- analytics.daily_snapshots
-- Pre-aggregated daily metrics per user per service.
-- Populated by a nightly cron/edge function.
-- ============================================================
CREATE TABLE analytics.daily_snapshots (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_id      TEXT        NOT NULL REFERENCES core.services(id),
  snapshot_date   DATE        NOT NULL,
  metrics         JSONB       NOT NULL DEFAULT '{}',
  -- Example metrics for vault:
  -- { "total_balance_krw": 5000000, "transaction_count": 12,
  --   "income": 3000000, "expense": 1500000, "net": 1500000,
  --   "account_count": 3, "budget_utilization": 0.75 }
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, service_id, snapshot_date)
);

COMMENT ON TABLE analytics.daily_snapshots IS 'Pre-aggregated daily metrics — populated by nightly job';

CREATE INDEX idx_analytics_snapshots_user_date
  ON analytics.daily_snapshots(user_id, snapshot_date DESC);

-- ============================================================
-- analytics.service_usage
-- Monthly usage counters per user per service.
-- Used for SaaS billing and quota enforcement.
-- ============================================================
CREATE TABLE analytics.service_usage (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID        REFERENCES core.organizations(id) ON DELETE CASCADE,
  service_id      TEXT        NOT NULL REFERENCES core.services(id),
  period_start    DATE        NOT NULL,   -- first day of the month
  api_calls       INTEGER     NOT NULL DEFAULT 0,
  storage_bytes   BIGINT      NOT NULL DEFAULT 0,
  -- Service-specific counters
  counters        JSONB       NOT NULL DEFAULT '{}',
  -- Example: { "transactions_created": 45, "accounts_active": 3 }
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, service_id, period_start)
);

COMMENT ON TABLE analytics.service_usage IS 'Monthly usage counters for billing and quota enforcement';

CREATE INDEX idx_analytics_usage_period
  ON analytics.service_usage(service_id, period_start DESC);

-- ============================================================
-- Table permissions
-- Analytics tables: users can only INSERT events, service_role can do all.
-- ============================================================
GRANT SELECT, INSERT ON analytics.events TO authenticated;
GRANT SELECT ON analytics.daily_snapshots TO authenticated;
GRANT SELECT ON analytics.service_usage TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA analytics TO service_role;
