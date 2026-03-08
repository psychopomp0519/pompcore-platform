-- ============================================================
-- 006_investments_real_estate.sql
-- Phase 5: 투자 일지 + 부동산 관리 테이블
-- ============================================================

-- ============================================================
-- 투자 포트폴리오 (증권사·거래소 계좌 단위)
-- ============================================================
CREATE TABLE IF NOT EXISTS vault_investment_portfolios (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name            TEXT        NOT NULL,
  broker          TEXT,
  asset_type      TEXT        NOT NULL DEFAULT 'mixed'
                              CHECK (asset_type IN ('stock_kr', 'stock_us', 'crypto', 'mixed')),
  base_currency   TEXT        NOT NULL DEFAULT 'KRW',
  linked_account_id UUID      REFERENCES vault_accounts(id) ON DELETE SET NULL,
  memo            TEXT,
  is_favorite     BOOLEAN     NOT NULL DEFAULT false,
  sort_order      INTEGER     NOT NULL DEFAULT 0,
  deleted_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 투자 거래 기록 (매수 / 매도 / 배당)
-- ============================================================
CREATE TABLE IF NOT EXISTS vault_investment_trades (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  portfolio_id    UUID        NOT NULL REFERENCES vault_investment_portfolios(id) ON DELETE CASCADE,
  ticker          TEXT        NOT NULL,
  asset_name      TEXT        NOT NULL,
  trade_type      TEXT        NOT NULL
                              CHECK (trade_type IN ('buy', 'sell', 'dividend')),
  quantity        NUMERIC     NOT NULL DEFAULT 0,
  price           NUMERIC     NOT NULL DEFAULT 0,
  fee             NUMERIC     NOT NULL DEFAULT 0,
  trade_date      DATE        NOT NULL,
  currency        TEXT        NOT NULL,
  memo            TEXT,
  deleted_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 현재가 스냅샷 (사용자 직접 입력, UPSERT)
-- ============================================================
CREATE TABLE IF NOT EXISTS vault_investment_price_snapshots (
  portfolio_id    UUID        NOT NULL REFERENCES vault_investment_portfolios(id) ON DELETE CASCADE,
  ticker          TEXT        NOT NULL,
  current_price   NUMERIC     NOT NULL DEFAULT 0,
  currency        TEXT        NOT NULL,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (portfolio_id, ticker)
);

-- ============================================================
-- 부동산 물건 (소유 or 임차 통합)
-- ============================================================
CREATE TABLE IF NOT EXISTS vault_real_estate (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name              TEXT        NOT NULL,
  address           TEXT,
  property_type     TEXT        NOT NULL DEFAULT 'apartment'
                                CHECK (property_type IN ('apartment','house','villa','commercial','land','other')),
  role              TEXT        NOT NULL DEFAULT 'owner'
                                CHECK (role IN ('owner', 'tenant')),
  acquisition_date  DATE,
  acquisition_price NUMERIC,
  current_value     NUMERIC,
  currency          TEXT        NOT NULL DEFAULT 'KRW',
  linked_account_id UUID        REFERENCES vault_accounts(id) ON DELETE SET NULL,
  memo              TEXT,
  is_favorite       BOOLEAN     NOT NULL DEFAULT false,
  sort_order        INTEGER     NOT NULL DEFAULT 0,
  deleted_at        TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 임대·임차 계약
-- ============================================================
CREATE TABLE IF NOT EXISTS vault_real_estate_leases (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  real_estate_id    UUID        NOT NULL REFERENCES vault_real_estate(id) ON DELETE CASCADE,
  user_id           UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lease_type        TEXT        NOT NULL DEFAULT 'monthly'
                                CHECK (lease_type IN ('jeonse', 'monthly', 'commercial')),
  counterpart_name  TEXT,
  deposit           NUMERIC     NOT NULL DEFAULT 0,
  monthly_rent      NUMERIC     NOT NULL DEFAULT 0,
  start_date        DATE        NOT NULL,
  end_date          DATE,
  is_active         BOOLEAN     NOT NULL DEFAULT true,
  memo              TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 부동산 비용 기록 (관리비·세금·수리비 등)
-- ============================================================
CREATE TABLE IF NOT EXISTS vault_real_estate_expenses (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  real_estate_id  UUID        NOT NULL REFERENCES vault_real_estate(id) ON DELETE CASCADE,
  user_id         UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  expense_type    TEXT        NOT NULL DEFAULT 'other'
                              CHECK (expense_type IN ('maintenance','tax','repair','insurance','loan_interest','other')),
  amount          NUMERIC     NOT NULL DEFAULT 0,
  currency        TEXT        NOT NULL DEFAULT 'KRW',
  expense_date    DATE        NOT NULL,
  memo            TEXT,
  deleted_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 인덱스
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_investment_portfolios_user ON vault_investment_portfolios(user_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_investment_trades_portfolio ON vault_investment_trades(portfolio_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_investment_trades_user ON vault_investment_trades(user_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_real_estate_user ON vault_real_estate(user_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_real_estate_leases_property ON vault_real_estate_leases(real_estate_id);
CREATE INDEX IF NOT EXISTS idx_real_estate_expenses_property ON vault_real_estate_expenses(real_estate_id) WHERE deleted_at IS NULL;

-- ============================================================
-- RLS 정책
-- ============================================================
ALTER TABLE vault_investment_portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_investment_trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_investment_price_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_real_estate ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_real_estate_leases ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_real_estate_expenses ENABLE ROW LEVEL SECURITY;

-- investment_portfolios
CREATE POLICY "own_portfolios" ON vault_investment_portfolios
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- investment_trades
CREATE POLICY "own_trades" ON vault_investment_trades
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- investment_price_snapshots (portfolio 소유자만)
CREATE POLICY "own_price_snapshots" ON vault_investment_price_snapshots
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM vault_investment_portfolios p
      WHERE p.id = portfolio_id AND p.user_id = auth.uid()
    )
  );

-- real_estate
CREATE POLICY "own_real_estate" ON vault_real_estate
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- real_estate_leases
CREATE POLICY "own_leases" ON vault_real_estate_leases
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- real_estate_expenses
CREATE POLICY "own_expenses" ON vault_real_estate_expenses
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
