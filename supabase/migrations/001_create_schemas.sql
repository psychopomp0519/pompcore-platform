-- ============================================================
-- 001: Create platform schemas
-- ============================================================
-- Three-schema architecture:
--   core      — Platform-wide: users, orgs, services
--   vault     — Financial management service
--   analytics — Usage tracking, aggregated metrics
-- ============================================================

CREATE SCHEMA IF NOT EXISTS core;
CREATE SCHEMA IF NOT EXISTS vault;
CREATE SCHEMA IF NOT EXISTS analytics;

-- Grant usage to authenticated users (required for RLS to work)
GRANT USAGE ON SCHEMA core TO authenticated;
GRANT USAGE ON SCHEMA vault TO authenticated;
GRANT USAGE ON SCHEMA analytics TO authenticated;

-- Grant usage to anon role (for public endpoints)
GRANT USAGE ON SCHEMA core TO anon;

-- Grant usage to service_role (for API server)
GRANT USAGE ON SCHEMA core TO service_role;
GRANT USAGE ON SCHEMA vault TO service_role;
GRANT USAGE ON SCHEMA analytics TO service_role;
