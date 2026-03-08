-- ============================================================
-- 002: Core platform tables
-- ============================================================
-- core.profiles          — Extended user profiles (supplements auth.users)
-- core.organizations     — Multi-tenant orgs (SaaS-ready)
-- core.organization_members — Org membership with roles
-- core.services          — Platform service registry
-- core.service_subscriptions — Service access per org/user
-- core.announcements     — Platform-wide announcements
-- core.announcement_comments
-- core.announcement_likes
-- core.inquiries         — Support tickets
-- ============================================================

-- ============================================================
-- core.profiles
-- Extended user data beyond what auth.users provides.
-- One row per auth.users entry, created on first login.
-- ============================================================
CREATE TABLE core.profiles (
  id              UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name    TEXT,
  avatar_url      TEXT,
  role            TEXT        NOT NULL DEFAULT 'user'
                              CHECK (role IN ('leader', 'member', 'user')),
  birthday        DATE,
  locale          TEXT        NOT NULL DEFAULT 'ko',
  timezone        TEXT        NOT NULL DEFAULT 'Asia/Seoul',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE core.profiles IS 'Extended user profiles — supplements auth.users';
COMMENT ON COLUMN core.profiles.id IS 'Matches auth.users.id (1:1)';
COMMENT ON COLUMN core.profiles.role IS 'Platform-wide role: leader, member, user';

CREATE INDEX idx_core_profiles_role ON core.profiles(role);

-- ============================================================
-- core.organizations
-- Multi-tenant organizations for SaaS expansion.
-- A user can belong to multiple orgs. Personal use = NULL org.
-- ============================================================
CREATE TABLE core.organizations (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT        NOT NULL,
  slug            TEXT        NOT NULL UNIQUE,
  owner_id        UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan            TEXT        NOT NULL DEFAULT 'free'
                              CHECK (plan IN ('free', 'starter', 'pro', 'enterprise')),
  max_members     INTEGER     NOT NULL DEFAULT 1,
  logo_url        TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE core.organizations IS 'Multi-tenant organizations for SaaS billing and access control';

CREATE INDEX idx_core_organizations_owner ON core.organizations(owner_id);
CREATE UNIQUE INDEX idx_core_organizations_slug ON core.organizations(slug);

-- ============================================================
-- core.organization_members
-- Join table: users ↔ organizations with per-org role.
-- ============================================================
CREATE TABLE core.organization_members (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID        NOT NULL REFERENCES core.organizations(id) ON DELETE CASCADE,
  user_id         UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role            TEXT        NOT NULL DEFAULT 'member'
                              CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  joined_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(organization_id, user_id)
);

COMMENT ON TABLE core.organization_members IS 'Organization membership with per-org roles';

CREATE INDEX idx_core_org_members_user ON core.organization_members(user_id);
CREATE INDEX idx_core_org_members_org ON core.organization_members(organization_id);

-- ============================================================
-- core.services
-- Registry of platform services (web, vault, future apps).
-- Used for feature gating and subscription management.
-- ============================================================
CREATE TABLE core.services (
  id              TEXT        PRIMARY KEY,  -- 'web', 'vault', etc.
  name            TEXT        NOT NULL,
  description     TEXT,
  base_url        TEXT,
  icon            TEXT,
  status          TEXT        NOT NULL DEFAULT 'active'
                              CHECK (status IN ('active', 'beta', 'maintenance', 'coming_soon')),
  is_free         BOOLEAN     NOT NULL DEFAULT true,
  config          JSONB       NOT NULL DEFAULT '{}'::jsonb,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON COLUMN core.services.config IS 'Per-service settings: rate_limit, quotas, features';

COMMENT ON TABLE core.services IS 'Platform service registry — each app registers itself here';

-- Seed default services
INSERT INTO core.services (id, name, description, base_url, status, is_free, config) VALUES
  ('web',   'PompCore',       '팀 포트폴리오 및 프로젝트 관리', 'https://pompcore.cc',       'active', true,
   '{"rate_limit":{"requests_per_minute":200},"quotas":{},"features":{}}'::jsonb),
  ('vault', 'PompCore Vault', '개인 자산·예산·투자 관리',       'https://vault.pompcore.cc', 'active', true,
   '{"rate_limit":{"requests_per_minute":200},"quotas":{"free":{"accounts":5,"transactions_per_month":200},"starter":{"accounts":20,"transactions_per_month":2000},"pro":{"accounts":-1,"transactions_per_month":-1},"enterprise":{"accounts":-1,"transactions_per_month":-1}},"features":{"export_csv":["starter","pro","enterprise"],"api_access":["pro","enterprise"]}}'::jsonb);

-- ============================================================
-- core.service_subscriptions
-- Which services each org (or individual user) can access.
-- NULL organization_id = personal subscription.
-- ============================================================
CREATE TABLE core.service_subscriptions (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID        REFERENCES core.organizations(id) ON DELETE CASCADE,
  user_id         UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_id      TEXT        NOT NULL REFERENCES core.services(id) ON DELETE CASCADE,
  tier            TEXT        NOT NULL DEFAULT 'free'
                              CHECK (tier IN ('free', 'starter', 'pro', 'enterprise')),
  starts_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at      TIMESTAMPTZ,
  is_active       BOOLEAN     NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, service_id, organization_id)
);

COMMENT ON TABLE core.service_subscriptions IS 'Service access grants — ties users/orgs to services with tier info';

CREATE INDEX idx_core_subs_user ON core.service_subscriptions(user_id) WHERE is_active;
CREATE INDEX idx_core_subs_org ON core.service_subscriptions(organization_id) WHERE is_active;

-- ============================================================
-- core.announcements
-- Platform-wide announcements (moved from vault scope).
-- ============================================================
CREATE TABLE core.announcements (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id       UUID        NOT NULL REFERENCES auth.users(id),
  service_id      TEXT        REFERENCES core.services(id),  -- NULL = platform-wide
  title           TEXT        NOT NULL,
  content         TEXT        NOT NULL,
  is_pinned       BOOLEAN     NOT NULL DEFAULT false,
  pin_order       INTEGER     CHECK (pin_order >= 1 AND pin_order <= 3),
  likes_count     INTEGER     NOT NULL DEFAULT 0,
  deleted_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE core.announcements IS 'Platform-wide or per-service announcements';

CREATE INDEX idx_core_announcements_active
  ON core.announcements(created_at DESC) WHERE deleted_at IS NULL;

-- ============================================================
-- core.announcement_comments
-- ============================================================
CREATE TABLE core.announcement_comments (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id UUID        NOT NULL REFERENCES core.announcements(id) ON DELETE CASCADE,
  user_id         UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content         TEXT        NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_core_ann_comments_announcement
  ON core.announcement_comments(announcement_id);

-- ============================================================
-- core.announcement_likes
-- ============================================================
CREATE TABLE core.announcement_likes (
  announcement_id UUID        NOT NULL REFERENCES core.announcements(id) ON DELETE CASCADE,
  user_id         UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (announcement_id, user_id)
);

-- ============================================================
-- core.inquiries
-- Support tickets (moved from vault scope).
-- ============================================================
CREATE TABLE core.inquiries (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_id            TEXT        REFERENCES core.services(id),  -- which service the inquiry is about
  title                 TEXT        NOT NULL,
  content               TEXT        NOT NULL,
  screenshot_urls       TEXT[],
  status                TEXT        NOT NULL DEFAULT 'pending'
                                    CHECK (status IN ('pending', 'answered', 'closed')),
  admin_response        TEXT,
  responded_at          TIMESTAMPTZ,
  user_rating           TEXT        CHECK (user_rating IN ('helpful', 'not_helpful')),
  screenshot_expires_at TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE core.inquiries IS 'Support tickets — scoped per service, visible to staff';

CREATE INDEX idx_core_inquiries_user ON core.inquiries(user_id);
CREATE INDEX idx_core_inquiries_status ON core.inquiries(status) WHERE status = 'pending';

-- ============================================================
-- Table permissions for authenticated role
-- ============================================================
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA core TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA core TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA core TO service_role;
