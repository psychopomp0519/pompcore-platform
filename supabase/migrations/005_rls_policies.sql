-- ============================================================
-- 005: Row Level Security policies for all schemas
-- ============================================================

-- ████████████████████████████████████████████████████████████
-- CORE SCHEMA
-- ████████████████████████████████████████████████████████████

ALTER TABLE core.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.service_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.announcement_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.announcement_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.inquiries ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- core.profiles — Own data only; public read for display_name/avatar
-- ============================================================
CREATE POLICY "profiles_select_own" ON core.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON core.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON core.profiles
  FOR UPDATE USING (auth.uid() = id);

-- ============================================================
-- core.organizations — Owner full control; members can read
-- ============================================================
CREATE POLICY "orgs_select" ON core.organizations
  FOR SELECT USING (
    owner_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM core.organization_members
      WHERE organization_id = core.organizations.id AND user_id = auth.uid()
    )
  );
CREATE POLICY "orgs_insert" ON core.organizations
  FOR INSERT WITH CHECK (owner_id = auth.uid());
CREATE POLICY "orgs_update" ON core.organizations
  FOR UPDATE USING (owner_id = auth.uid());
CREATE POLICY "orgs_delete" ON core.organizations
  FOR DELETE USING (owner_id = auth.uid());

-- ============================================================
-- core.organization_members — Org owner/admin manage; member sees own
-- ============================================================
CREATE POLICY "org_members_select" ON core.organization_members
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM core.organizations
      WHERE id = organization_id AND owner_id = auth.uid()
    )
  );
CREATE POLICY "org_members_insert" ON core.organization_members
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM core.organizations
      WHERE id = organization_id AND owner_id = auth.uid()
    )
  );
CREATE POLICY "org_members_delete" ON core.organization_members
  FOR DELETE USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM core.organizations
      WHERE id = organization_id AND owner_id = auth.uid()
    )
  );

-- ============================================================
-- core.services — Public read
-- ============================================================
CREATE POLICY "services_select" ON core.services
  FOR SELECT USING (true);

-- ============================================================
-- core.service_subscriptions — Own data + org admin
-- ============================================================
CREATE POLICY "subs_select" ON core.service_subscriptions
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM core.organizations
      WHERE id = organization_id AND owner_id = auth.uid()
    )
  );
CREATE POLICY "subs_insert" ON core.service_subscriptions
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- ============================================================
-- core.announcements — All authenticated read; leader/member write
-- ============================================================
CREATE POLICY "announcements_select" ON core.announcements
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "announcements_insert" ON core.announcements
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
    AND (
      EXISTS (SELECT 1 FROM core.profiles WHERE id = auth.uid() AND role IN ('leader', 'member'))
    )
  );
CREATE POLICY "announcements_update" ON core.announcements
  FOR UPDATE USING (
    author_id = auth.uid()
    AND EXISTS (SELECT 1 FROM core.profiles WHERE id = auth.uid() AND role IN ('leader', 'member'))
  );
CREATE POLICY "announcements_delete" ON core.announcements
  FOR DELETE USING (
    author_id = auth.uid()
    AND EXISTS (SELECT 1 FROM core.profiles WHERE id = auth.uid() AND role IN ('leader', 'member'))
  );

-- ============================================================
-- core.announcement_comments
-- ============================================================
CREATE POLICY "ann_comments_select" ON core.announcement_comments
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "ann_comments_insert" ON core.announcement_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ann_comments_delete" ON core.announcement_comments
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- core.announcement_likes
-- ============================================================
CREATE POLICY "ann_likes_select" ON core.announcement_likes
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "ann_likes_insert" ON core.announcement_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ann_likes_delete" ON core.announcement_likes
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- core.inquiries — Own data + staff can see all
-- ============================================================
CREATE POLICY "inquiries_select" ON core.inquiries
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM core.profiles WHERE id = auth.uid() AND role IN ('leader', 'member'))
  );
CREATE POLICY "inquiries_insert" ON core.inquiries
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "inquiries_update" ON core.inquiries
  FOR UPDATE USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM core.profiles WHERE id = auth.uid() AND role IN ('leader', 'member'))
  );

-- ████████████████████████████████████████████████████████████
-- VAULT SCHEMA
-- ████████████████████████████████████████████████████████████

ALTER TABLE vault_app.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_app.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_app.account_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_app.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_app.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_app.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_app.transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_app.recurring_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_app.recurring_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_app.savings ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_app.savings_deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_app.investment_portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_app.investment_trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_app.investment_price_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_app.real_estate ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_app.real_estate_leases ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_app.real_estate_expenses ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Pattern A: Direct user_id ownership
-- Applied to: user_settings, accounts, categories, budgets,
--   transactions, transfers, recurring_payments, savings,
--   investment_portfolios, investment_trades, real_estate,
--   real_estate_leases, real_estate_expenses
-- ============================================================

-- Helper: generates standard CRUD policies for user_id-owned tables
-- (Supabase SQL doesn't support loops, so we write them out)

-- vault_app.user_settings
CREATE POLICY "own_data" ON vault_app.user_settings
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- vault_app.accounts
CREATE POLICY "own_data" ON vault_app.accounts
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- vault_app.categories
CREATE POLICY "own_data" ON vault_app.categories
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- vault_app.budgets
CREATE POLICY "own_data" ON vault_app.budgets
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- vault_app.transactions
CREATE POLICY "own_data" ON vault_app.transactions
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- vault_app.transfers
CREATE POLICY "own_data" ON vault_app.transfers
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- vault_app.recurring_payments
CREATE POLICY "own_data" ON vault_app.recurring_payments
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- vault_app.savings
CREATE POLICY "own_data" ON vault_app.savings
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- vault_app.investment_portfolios
CREATE POLICY "own_data" ON vault_app.investment_portfolios
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- vault_app.investment_trades
CREATE POLICY "own_data" ON vault_app.investment_trades
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- vault_app.real_estate
CREATE POLICY "own_data" ON vault_app.real_estate
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- vault_app.real_estate_leases
CREATE POLICY "own_data" ON vault_app.real_estate_leases
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- vault_app.real_estate_expenses
CREATE POLICY "own_data" ON vault_app.real_estate_expenses
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- Pattern B: Parent-ownership via JOIN
-- Applied to: account_balances, recurring_overrides,
--   savings_deposits, investment_price_snapshots
-- ============================================================

-- vault_app.account_balances (check account owner)
CREATE POLICY "own_via_account" ON vault_app.account_balances
  FOR ALL USING (
    EXISTS (SELECT 1 FROM vault_app.accounts WHERE id = account_id AND user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM vault_app.accounts WHERE id = account_id AND user_id = auth.uid())
  );

-- vault_app.recurring_overrides (check recurring owner)
CREATE POLICY "own_via_recurring" ON vault_app.recurring_overrides
  FOR ALL USING (
    EXISTS (SELECT 1 FROM vault_app.recurring_payments WHERE id = recurring_id AND user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM vault_app.recurring_payments WHERE id = recurring_id AND user_id = auth.uid())
  );

-- vault_app.savings_deposits (check savings owner)
CREATE POLICY "own_via_savings" ON vault_app.savings_deposits
  FOR ALL USING (
    EXISTS (SELECT 1 FROM vault_app.savings WHERE id = savings_id AND user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM vault_app.savings WHERE id = savings_id AND user_id = auth.uid())
  );

-- vault_app.investment_price_snapshots (check portfolio owner)
CREATE POLICY "own_via_portfolio" ON vault_app.investment_price_snapshots
  FOR ALL USING (
    EXISTS (SELECT 1 FROM vault_app.investment_portfolios WHERE id = portfolio_id AND user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM vault_app.investment_portfolios WHERE id = portfolio_id AND user_id = auth.uid())
  );

-- ████████████████████████████████████████████████████████████
-- ANALYTICS SCHEMA
-- ████████████████████████████████████████████████████████████

ALTER TABLE analytics.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics.daily_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics.service_usage ENABLE ROW LEVEL SECURITY;

-- analytics.events — Users can insert own events, read own events
CREATE POLICY "events_insert_own" ON analytics.events
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "events_select_own" ON analytics.events
  FOR SELECT USING (auth.uid() = user_id);

-- analytics.daily_snapshots — Read own only
CREATE POLICY "snapshots_select_own" ON analytics.daily_snapshots
  FOR SELECT USING (auth.uid() = user_id);

-- analytics.service_usage — Read own only
CREATE POLICY "usage_select_own" ON analytics.service_usage
  FOR SELECT USING (auth.uid() = user_id);
