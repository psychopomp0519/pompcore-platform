-- ============================================================
-- 001: Create platform schemas + grant permissions
-- ============================================================
-- Three-schema architecture:
--   core      — Platform-wide: users, orgs, services
--   vault_app — Financial management service (Supabase 내장 vault 스키마 충돌 회피)
--   analytics — Usage tracking, aggregated metrics
--
-- 네이밍 규칙: {서비스명}_app (forge_app, quest_app 등)
-- ============================================================

CREATE SCHEMA IF NOT EXISTS core;
CREATE SCHEMA IF NOT EXISTS vault_app;
CREATE SCHEMA IF NOT EXISTS analytics;

-- ============================================================
-- 권한 부여 (Supabase 공식 문서 권장 패턴)
-- https://supabase.com/docs/guides/api/using-custom-schemas
-- ============================================================

-- core
GRANT USAGE ON SCHEMA core TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA core TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA core TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA core TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA core
  GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA core
  GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA core
  GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- vault_app
GRANT USAGE ON SCHEMA vault_app TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA vault_app TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA vault_app TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA vault_app TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA vault_app
  GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA vault_app
  GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA vault_app
  GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- analytics
GRANT USAGE ON SCHEMA analytics TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA analytics TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA analytics TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA analytics TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA analytics
  GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA analytics
  GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA analytics
  GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
