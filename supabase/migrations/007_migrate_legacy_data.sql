-- ============================================================
-- 007: Migrate existing data from public.vault_* to new schemas
-- ============================================================
-- This migration moves data from the legacy flat-schema tables
-- (public.vault_*) into the new multi-schema architecture.
--
-- Strategy:
--   1. Copy data from public.vault_* → vault.* / core.*
--   2. Verify row counts match
--   3. Drop legacy tables (commented out — enable after verification)
--
-- IMPORTANT: Run this ONLY on existing deployments that have data
-- in public.vault_* tables. For fresh deployments, skip this file.
-- ============================================================

-- ============================================================
-- Step 1: Copy user profile data from auth.users → core.profiles
-- (Only for users who don't already have a profile from the trigger)
-- ============================================================
INSERT INTO core.profiles (id, display_name, avatar_url, role)
SELECT
  u.id,
  COALESCE(u.raw_user_meta_data ->> 'display_name', u.raw_user_meta_data ->> 'full_name', ''),
  u.raw_user_meta_data ->> 'avatar_url',
  COALESCE(u.raw_user_meta_data ->> 'role', 'user')
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM core.profiles p WHERE p.id = u.id)
ON CONFLICT (id) DO NOTHING;

-- Auto-subscribe existing users to free services
INSERT INTO core.service_subscriptions (user_id, service_id, tier)
SELECT u.id, s.id, 'free'
FROM auth.users u
CROSS JOIN core.services s
WHERE s.is_free = true
  AND NOT EXISTS (
    SELECT 1 FROM core.service_subscriptions ss
    WHERE ss.user_id = u.id AND ss.service_id = s.id
  )
ON CONFLICT (user_id, service_id, organization_id) DO NOTHING;

-- ============================================================
-- Step 2: Copy vault user settings
-- ============================================================
INSERT INTO vault.user_settings (id, user_id, primary_currency, recurring_avg_period, tab_order, created_at, updated_at)
SELECT id, user_id, primary_currency, recurring_avg_period, tab_order, created_at, updated_at
FROM public.vault_user_settings
ON CONFLICT (user_id) DO NOTHING;

-- ============================================================
-- Step 3: Copy financial data (order matters for FK constraints)
-- ============================================================

-- Accounts first (many tables reference them)
INSERT INTO vault.accounts (id, user_id, name, supported_currencies, default_currency, is_favorite, sort_order, deleted_at, created_at, updated_at)
SELECT id, user_id, name, supported_currencies, default_currency, is_favorite, sort_order, deleted_at, created_at, updated_at
FROM public.vault_accounts
ON CONFLICT (id) DO NOTHING;

-- Account balances
INSERT INTO vault.account_balances (id, account_id, currency, balance, updated_at)
SELECT id, account_id, currency, balance, updated_at
FROM public.vault_account_balances
ON CONFLICT (account_id, currency) DO NOTHING;

-- Categories
INSERT INTO vault.categories (id, user_id, name, type, is_favorite, is_default, sort_order, icon, deleted_at, created_at)
SELECT id, user_id, name, type, is_favorite, is_default, sort_order, icon, deleted_at, created_at
FROM public.vault_categories
ON CONFLICT (id) DO NOTHING;

-- Budgets
INSERT INTO vault.budgets (id, user_id, name, target_amount, current_amount, currency, budget_type, linked_account_id, deleted_at, created_at, updated_at)
SELECT id, user_id, name, target_amount, current_amount, currency, budget_type, linked_account_id, deleted_at, created_at, updated_at
FROM public.vault_budgets
ON CONFLICT (id) DO NOTHING;

-- Transactions
INSERT INTO vault.transactions (id, user_id, account_id, category_id, name, type, amount, currency, transaction_date, source_type, source_id, transfer_pair_id, budget_id, budget_action, memo, deleted_at, created_at, updated_at)
SELECT id, user_id, account_id, category_id, name, type, amount, currency, transaction_date, source_type, source_id, transfer_pair_id, budget_id, budget_action, memo, deleted_at, created_at, updated_at
FROM public.vault_transactions
ON CONFLICT (id) DO NOTHING;

-- Transfers
INSERT INTO vault.transfers (id, user_id, from_account_id, to_account_id, from_currency, to_currency, from_amount, to_amount, transfer_date, memo, deleted_at, created_at)
SELECT id, user_id, from_account_id, to_account_id, from_currency, to_currency, from_amount, to_amount, transfer_date, memo, deleted_at, created_at
FROM public.vault_transfers
ON CONFLICT (id) DO NOTHING;

-- Recurring payments
INSERT INTO vault.recurring_payments (id, user_id, account_id, category_id, name, type, amount, currency, start_date, interval_unit, interval_value, last_generated_date, is_active, deleted_at, created_at, updated_at)
SELECT id, user_id, account_id, category_id, name, type, amount, currency, start_date, interval_unit, interval_value, last_generated_date, is_active, deleted_at, created_at, updated_at
FROM public.vault_recurring_payments
ON CONFLICT (id) DO NOTHING;

-- Recurring overrides
INSERT INTO vault.recurring_overrides (id, recurring_id, occurrence_date, amount, name, is_skipped)
SELECT id, recurring_id, occurrence_date, amount, name, is_skipped
FROM public.vault_recurring_overrides
ON CONFLICT (recurring_id, occurrence_date) DO NOTHING;

-- Savings
INSERT INTO vault.savings (id, user_id, linked_account_id, name, savings_type, start_date, duration_months, interest_rate, principal, installment_amount, is_tax_free, deleted_at, created_at, updated_at)
SELECT id, user_id, linked_account_id, name, savings_type, start_date, duration_months, interest_rate, principal, installment_amount, is_tax_free, deleted_at, created_at, updated_at
FROM public.vault_savings
ON CONFLICT (id) DO NOTHING;

-- Savings deposits
INSERT INTO vault.savings_deposits (id, savings_id, account_id, amount, deposit_date, created_at)
SELECT id, savings_id, account_id, amount, deposit_date, created_at
FROM public.vault_savings_deposits
ON CONFLICT (id) DO NOTHING;

-- Investment portfolios
INSERT INTO vault.investment_portfolios (id, user_id, name, broker, asset_type, base_currency, linked_account_id, memo, is_favorite, sort_order, deleted_at, created_at, updated_at)
SELECT id, user_id, name, broker, asset_type, base_currency, linked_account_id, memo, is_favorite, sort_order, deleted_at, created_at, updated_at
FROM public.vault_investment_portfolios
ON CONFLICT (id) DO NOTHING;

-- Investment trades
INSERT INTO vault.investment_trades (id, user_id, portfolio_id, ticker, asset_name, trade_type, quantity, price, fee, trade_date, currency, memo, deleted_at, created_at, updated_at)
SELECT id, user_id, portfolio_id, ticker, asset_name, trade_type, quantity, price, fee, trade_date, currency, memo, deleted_at, created_at, updated_at
FROM public.vault_investment_trades
ON CONFLICT (id) DO NOTHING;

-- Investment price snapshots
INSERT INTO vault.investment_price_snapshots (portfolio_id, ticker, current_price, currency, updated_at)
SELECT portfolio_id, ticker, current_price, currency, updated_at
FROM public.vault_investment_price_snapshots
ON CONFLICT (portfolio_id, ticker) DO NOTHING;

-- Real estate
INSERT INTO vault.real_estate (id, user_id, name, address, property_type, role, acquisition_date, acquisition_price, current_value, currency, linked_account_id, memo, is_favorite, sort_order, deleted_at, created_at, updated_at)
SELECT id, user_id, name, address, property_type, role, acquisition_date, acquisition_price, current_value, currency, linked_account_id, memo, is_favorite, sort_order, deleted_at, created_at, updated_at
FROM public.vault_real_estate
ON CONFLICT (id) DO NOTHING;

-- Real estate leases
INSERT INTO vault.real_estate_leases (id, real_estate_id, user_id, lease_type, counterpart_name, deposit, monthly_rent, start_date, end_date, is_active, memo, created_at, updated_at)
SELECT id, real_estate_id, user_id, lease_type, counterpart_name, deposit, monthly_rent, start_date, end_date, is_active, memo, created_at, updated_at
FROM public.vault_real_estate_leases
ON CONFLICT (id) DO NOTHING;

-- Real estate expenses
INSERT INTO vault.real_estate_expenses (id, real_estate_id, user_id, expense_type, amount, currency, expense_date, memo, deleted_at, created_at)
SELECT id, real_estate_id, user_id, expense_type, amount, currency, expense_date, memo, deleted_at, created_at
FROM public.vault_real_estate_expenses
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Step 4: Copy announcements & inquiries → core.*
-- ============================================================

INSERT INTO core.announcements (id, author_id, service_id, title, content, is_pinned, pin_order, likes_count, deleted_at, created_at, updated_at)
SELECT id, author_id, 'vault', title, content, is_pinned, pin_order, likes_count, deleted_at, created_at, updated_at
FROM public.vault_announcements
ON CONFLICT (id) DO NOTHING;

INSERT INTO core.announcement_comments (id, announcement_id, user_id, content, created_at)
SELECT id, announcement_id, user_id, content, created_at
FROM public.vault_announcement_comments
ON CONFLICT (id) DO NOTHING;

INSERT INTO core.announcement_likes (announcement_id, user_id, created_at)
SELECT announcement_id, user_id, created_at
FROM public.vault_announcement_likes
ON CONFLICT (announcement_id, user_id) DO NOTHING;

INSERT INTO core.inquiries (id, user_id, service_id, title, content, screenshot_urls, status, admin_response, responded_at, user_rating, screenshot_expires_at, created_at)
SELECT id, user_id, 'vault', title, content, screenshot_urls, status, admin_response, responded_at, user_rating, screenshot_expires_at, created_at
FROM public.vault_inquiries
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Step 5: Verification queries (run manually)
-- ============================================================
-- SELECT 'vault.accounts' AS tbl, count(*) FROM vault.accounts
-- UNION ALL SELECT 'public.vault_accounts', count(*) FROM public.vault_accounts
-- UNION ALL SELECT 'vault.transactions', count(*) FROM vault.transactions
-- UNION ALL SELECT 'public.vault_transactions', count(*) FROM public.vault_transactions;

-- ============================================================
-- Step 6: Drop legacy tables (UNCOMMENT after verification)
-- Run these ONLY after confirming all data migrated correctly.
-- ============================================================
-- DROP TABLE IF EXISTS public.vault_announcement_likes CASCADE;
-- DROP TABLE IF EXISTS public.vault_announcement_comments CASCADE;
-- DROP TABLE IF EXISTS public.vault_announcements CASCADE;
-- DROP TABLE IF EXISTS public.vault_inquiries CASCADE;
-- DROP TABLE IF EXISTS public.vault_recurring_overrides CASCADE;
-- DROP TABLE IF EXISTS public.vault_savings_deposits CASCADE;
-- DROP TABLE IF EXISTS public.vault_investment_price_snapshots CASCADE;
-- DROP TABLE IF EXISTS public.vault_investment_trades CASCADE;
-- DROP TABLE IF EXISTS public.vault_investment_portfolios CASCADE;
-- DROP TABLE IF EXISTS public.vault_real_estate_expenses CASCADE;
-- DROP TABLE IF EXISTS public.vault_real_estate_leases CASCADE;
-- DROP TABLE IF EXISTS public.vault_real_estate CASCADE;
-- DROP TABLE IF EXISTS public.vault_transfers CASCADE;
-- DROP TABLE IF EXISTS public.vault_transactions CASCADE;
-- DROP TABLE IF EXISTS public.vault_budgets CASCADE;
-- DROP TABLE IF EXISTS public.vault_recurring_payments CASCADE;
-- DROP TABLE IF EXISTS public.vault_savings CASCADE;
-- DROP TABLE IF EXISTS public.vault_account_balances CASCADE;
-- DROP TABLE IF EXISTS public.vault_categories CASCADE;
-- DROP TABLE IF EXISTS public.vault_accounts CASCADE;
-- DROP TABLE IF EXISTS public.vault_user_settings CASCADE;
