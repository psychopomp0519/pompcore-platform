-- ============================================================
-- 003: Vault schema tables
-- ============================================================
-- Financial management service tables.
-- Designed to be accessed via user-scoped Supabase client (RLS).
--
-- Tables moved from public.vault_* → vault_app.* with prefix removed.
-- This migration creates them fresh for new deployments.
-- See 007_migrate_legacy_data.sql for existing data migration.
-- ============================================================

-- ============================================================
-- vault_app.user_settings
-- Per-user Vault preferences.
-- ============================================================
CREATE TABLE vault_app.user_settings (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  primary_currency    TEXT        NOT NULL DEFAULT 'KRW',
  recurring_avg_period TEXT       NOT NULL DEFAULT 'month'
                                  CHECK (recurring_avg_period IN ('day', 'week', 'month', 'year')),
  tab_order           JSONB       NOT NULL DEFAULT '["accounts","transactions","recurring","settings"]'::jsonb,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- ============================================================
-- vault_app.accounts
-- Bank/brokerage accounts with multi-currency support.
-- ============================================================
CREATE TABLE vault_app.accounts (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name                TEXT        NOT NULL,
  supported_currencies TEXT[]     NOT NULL DEFAULT '{KRW}',
  default_currency    TEXT        NOT NULL DEFAULT 'KRW',
  is_favorite         BOOLEAN     NOT NULL DEFAULT false,
  sort_order          INTEGER     NOT NULL DEFAULT 0,
  deleted_at          TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_vault_accounts_user
  ON vault_app.accounts(user_id) WHERE deleted_at IS NULL;

-- ============================================================
-- vault_app.account_balances
-- Per-currency balance for each account.
-- ============================================================
CREATE TABLE vault_app.account_balances (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id      UUID        NOT NULL REFERENCES vault_app.accounts(id) ON DELETE CASCADE,
  currency        TEXT        NOT NULL,
  balance         NUMERIC(20,4) NOT NULL DEFAULT 0,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(account_id, currency)
);

-- ============================================================
-- vault_app.categories
-- Income/expense categories per user.
-- ============================================================
CREATE TABLE vault_app.categories (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name            TEXT        NOT NULL,
  type            TEXT        NOT NULL CHECK (type IN ('income', 'expense')),
  is_favorite     BOOLEAN     NOT NULL DEFAULT false,
  is_default      BOOLEAN     NOT NULL DEFAULT false,
  sort_order      INTEGER     NOT NULL DEFAULT 0,
  icon            TEXT,
  deleted_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_vault_categories_user
  ON vault_app.categories(user_id) WHERE deleted_at IS NULL;

-- ============================================================
-- vault_app.budgets
-- Expense budgets (virtual envelopes or linked to real accounts).
-- ============================================================
CREATE TABLE vault_app.budgets (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name                TEXT        NOT NULL,
  target_amount       NUMERIC(20,4) NOT NULL,
  current_amount      NUMERIC(20,4) NOT NULL DEFAULT 0,
  currency            TEXT        NOT NULL DEFAULT 'KRW',
  budget_type         TEXT        NOT NULL DEFAULT 'virtual'
                                  CHECK (budget_type IN ('virtual', 'actual')),
  linked_account_id   UUID        REFERENCES vault_app.accounts(id),
  deleted_at          TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_vault_budgets_user
  ON vault_app.budgets(user_id) WHERE deleted_at IS NULL;

-- ============================================================
-- vault_app.transactions
-- Financial transaction records (income/expense).
-- ============================================================
CREATE TABLE vault_app.transactions (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id          UUID        NOT NULL REFERENCES vault_app.accounts(id),
  category_id         UUID        REFERENCES vault_app.categories(id),
  name                TEXT        NOT NULL,
  type                TEXT        NOT NULL CHECK (type IN ('income', 'expense')),
  amount              NUMERIC(20,4) NOT NULL,
  currency            TEXT        NOT NULL DEFAULT 'KRW',
  transaction_date    DATE        NOT NULL DEFAULT CURRENT_DATE,
  source_type         TEXT        NOT NULL DEFAULT 'manual'
                                  CHECK (source_type IN ('manual', 'transfer', 'recurring', 'savings')),
  source_id           UUID,
  transfer_pair_id    UUID,
  budget_id           UUID        REFERENCES vault_app.budgets(id),
  budget_action       TEXT        CHECK (budget_action IN ('deposit', 'withdraw')),
  memo                TEXT,
  deleted_at          TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_vault_transactions_user_date
  ON vault_app.transactions(user_id, transaction_date) WHERE deleted_at IS NULL;
CREATE INDEX idx_vault_transactions_account
  ON vault_app.transactions(account_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_vault_transactions_category
  ON vault_app.transactions(category_id) WHERE deleted_at IS NULL;

-- ============================================================
-- vault_app.transfers
-- Account-to-account transfers (generates 2 linked transactions).
-- ============================================================
CREATE TABLE vault_app.transfers (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  from_account_id     UUID        NOT NULL REFERENCES vault_app.accounts(id),
  to_account_id       UUID        NOT NULL REFERENCES vault_app.accounts(id),
  from_currency       TEXT        NOT NULL,
  to_currency         TEXT        NOT NULL,
  from_amount         NUMERIC(20,4) NOT NULL,
  to_amount           NUMERIC(20,4) NOT NULL,
  transfer_date       DATE        NOT NULL DEFAULT CURRENT_DATE,
  memo                TEXT,
  deleted_at          TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- vault_app.recurring_payments
-- Scheduled income/expense templates.
-- ============================================================
CREATE TABLE vault_app.recurring_payments (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id          UUID        NOT NULL REFERENCES vault_app.accounts(id),
  category_id         UUID        REFERENCES vault_app.categories(id),
  name                TEXT        NOT NULL,
  type                TEXT        NOT NULL CHECK (type IN ('income', 'expense')),
  amount              NUMERIC(20,4) NOT NULL,
  currency            TEXT        NOT NULL DEFAULT 'KRW',
  start_date          DATE        NOT NULL,
  interval_unit       TEXT        NOT NULL CHECK (interval_unit IN ('day', 'week', 'month', 'year')),
  interval_value      INTEGER     NOT NULL DEFAULT 1 CHECK (interval_value > 0),
  last_generated_date DATE,
  is_active           BOOLEAN     NOT NULL DEFAULT true,
  deleted_at          TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_vault_recurring_user
  ON vault_app.recurring_payments(user_id)
  WHERE deleted_at IS NULL AND is_active = true;

-- ============================================================
-- vault_app.recurring_overrides
-- Per-occurrence customizations for recurring payments.
-- ============================================================
CREATE TABLE vault_app.recurring_overrides (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  recurring_id    UUID        NOT NULL REFERENCES vault_app.recurring_payments(id) ON DELETE CASCADE,
  occurrence_date DATE        NOT NULL,
  amount          NUMERIC(20,4),
  name            TEXT,
  is_skipped      BOOLEAN     NOT NULL DEFAULT false,
  UNIQUE(recurring_id, occurrence_date)
);

-- ============================================================
-- vault_app.savings
-- Savings products (fixed deposit, installment, free savings).
-- ============================================================
CREATE TABLE vault_app.savings (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  linked_account_id   UUID        REFERENCES vault_app.accounts(id),
  name                TEXT        NOT NULL,
  savings_type        TEXT        NOT NULL
                                  CHECK (savings_type IN ('fixed_deposit', 'installment', 'free_savings', 'housing_subscription')),
  start_date          DATE        NOT NULL,
  duration_months     INTEGER,
  interest_rate       NUMERIC(6,4) NOT NULL,
  principal           NUMERIC(20,4) NOT NULL DEFAULT 0,
  installment_amount  NUMERIC(20,4),
  is_tax_free         BOOLEAN     NOT NULL DEFAULT false,
  deleted_at          TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_vault_savings_user
  ON vault_app.savings(user_id) WHERE deleted_at IS NULL;

-- ============================================================
-- vault_app.savings_deposits
-- Deposit records for free savings accounts.
-- ============================================================
CREATE TABLE vault_app.savings_deposits (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  savings_id      UUID        NOT NULL REFERENCES vault_app.savings(id) ON DELETE CASCADE,
  account_id      UUID        REFERENCES vault_app.accounts(id),
  amount          NUMERIC(20,4) NOT NULL,
  deposit_date    DATE        NOT NULL DEFAULT CURRENT_DATE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- vault_app.investment_portfolios
-- Investment accounts (brokerage, crypto exchange).
-- ============================================================
CREATE TABLE vault_app.investment_portfolios (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name                TEXT        NOT NULL,
  broker              TEXT,
  asset_type          TEXT        NOT NULL DEFAULT 'mixed'
                                  CHECK (asset_type IN ('stock_kr', 'stock_us', 'crypto', 'mixed')),
  base_currency       TEXT        NOT NULL DEFAULT 'KRW',
  linked_account_id   UUID        REFERENCES vault_app.accounts(id) ON DELETE SET NULL,
  memo                TEXT,
  is_favorite         BOOLEAN     NOT NULL DEFAULT false,
  sort_order          INTEGER     NOT NULL DEFAULT 0,
  deleted_at          TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_vault_inv_portfolios_user
  ON vault_app.investment_portfolios(user_id) WHERE deleted_at IS NULL;

-- ============================================================
-- vault_app.investment_trades
-- Buy/sell/dividend records.
-- ============================================================
CREATE TABLE vault_app.investment_trades (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  portfolio_id    UUID        NOT NULL REFERENCES vault_app.investment_portfolios(id) ON DELETE CASCADE,
  ticker          TEXT        NOT NULL,
  asset_name      TEXT        NOT NULL,
  trade_type      TEXT        NOT NULL CHECK (trade_type IN ('buy', 'sell', 'dividend')),
  quantity        NUMERIC     NOT NULL DEFAULT 0,
  price           NUMERIC     NOT NULL DEFAULT 0,
  fee             NUMERIC     NOT NULL DEFAULT 0,
  trade_date      DATE        NOT NULL,
  currency        TEXT        NOT NULL,
  memo            TEXT,
  deleted_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_vault_inv_trades_portfolio
  ON vault_app.investment_trades(portfolio_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_vault_inv_trades_user
  ON vault_app.investment_trades(user_id) WHERE deleted_at IS NULL;

-- ============================================================
-- vault_app.investment_price_snapshots
-- User-entered current prices (UPSERT pattern).
-- ============================================================
CREATE TABLE vault_app.investment_price_snapshots (
  portfolio_id    UUID        NOT NULL REFERENCES vault_app.investment_portfolios(id) ON DELETE CASCADE,
  ticker          TEXT        NOT NULL,
  current_price   NUMERIC     NOT NULL DEFAULT 0,
  currency        TEXT        NOT NULL,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (portfolio_id, ticker)
);

-- ============================================================
-- vault_app.real_estate
-- Property holdings (owner or tenant).
-- ============================================================
CREATE TABLE vault_app.real_estate (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name                TEXT        NOT NULL,
  address             TEXT,
  property_type       TEXT        NOT NULL DEFAULT 'apartment'
                                  CHECK (property_type IN ('apartment','house','villa','commercial','land','other')),
  role                TEXT        NOT NULL DEFAULT 'owner'
                                  CHECK (role IN ('owner', 'tenant')),
  acquisition_date    DATE,
  acquisition_price   NUMERIC,
  current_value       NUMERIC,
  currency            TEXT        NOT NULL DEFAULT 'KRW',
  linked_account_id   UUID        REFERENCES vault_app.accounts(id) ON DELETE SET NULL,
  memo                TEXT,
  is_favorite         BOOLEAN     NOT NULL DEFAULT false,
  sort_order          INTEGER     NOT NULL DEFAULT 0,
  deleted_at          TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_vault_real_estate_user
  ON vault_app.real_estate(user_id) WHERE deleted_at IS NULL;

-- ============================================================
-- vault_app.real_estate_leases
-- Rental/lease contracts.
-- ============================================================
CREATE TABLE vault_app.real_estate_leases (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  real_estate_id  UUID        NOT NULL REFERENCES vault_app.real_estate(id) ON DELETE CASCADE,
  user_id         UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lease_type      TEXT        NOT NULL DEFAULT 'monthly'
                              CHECK (lease_type IN ('jeonse', 'monthly', 'commercial')),
  counterpart_name TEXT,
  deposit         NUMERIC     NOT NULL DEFAULT 0,
  monthly_rent    NUMERIC     NOT NULL DEFAULT 0,
  start_date      DATE        NOT NULL,
  end_date        DATE,
  is_active       BOOLEAN     NOT NULL DEFAULT true,
  memo            TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_vault_re_leases_property
  ON vault_app.real_estate_leases(real_estate_id);

-- ============================================================
-- vault_app.real_estate_expenses
-- Property expenses (maintenance, tax, repair, etc.).
-- ============================================================
CREATE TABLE vault_app.real_estate_expenses (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  real_estate_id  UUID        NOT NULL REFERENCES vault_app.real_estate(id) ON DELETE CASCADE,
  user_id         UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  expense_type    TEXT        NOT NULL DEFAULT 'other'
                              CHECK (expense_type IN ('maintenance','tax','repair','insurance','loan_interest','other')),
  amount          NUMERIC     NOT NULL DEFAULT 0,
  currency        TEXT        NOT NULL DEFAULT 'KRW',
  expense_date    DATE        NOT NULL,
  memo            TEXT,
  deleted_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_vault_re_expenses_property
  ON vault_app.real_estate_expenses(real_estate_id) WHERE deleted_at IS NULL;

-- ============================================================
-- Table permissions
-- ============================================================
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA vault_app TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA vault_app TO service_role;
