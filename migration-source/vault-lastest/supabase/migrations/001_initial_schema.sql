-- ============================================================
-- Vault 초기 DB 스키마
-- 실행 대상: Supabase SQL Editor
-- ============================================================

-- ============================================================
-- 1. vault_user_settings (사용자 설정)
-- ============================================================

CREATE TABLE vault_user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  primary_currency TEXT NOT NULL DEFAULT 'KRW',
  recurring_avg_period TEXT NOT NULL DEFAULT 'month'
    CHECK (recurring_avg_period IN ('day', 'week', 'month', 'year')),
  tab_order JSONB NOT NULL DEFAULT '["accounts","transactions","recurring","settings"]'::jsonb,
  display_name TEXT,
  avatar_url TEXT,
  birthday DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- ============================================================
-- 2. vault_accounts (통장)
-- ============================================================

CREATE TABLE vault_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  supported_currencies TEXT[] NOT NULL DEFAULT '{KRW}',
  default_currency TEXT NOT NULL DEFAULT 'KRW',
  is_favorite BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_vault_accounts_user ON vault_accounts(user_id) WHERE deleted_at IS NULL;

-- ============================================================
-- 3. vault_account_balances (통장별 통화 잔액)
-- ============================================================

CREATE TABLE vault_account_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES vault_accounts(id) ON DELETE CASCADE,
  currency TEXT NOT NULL,
  balance NUMERIC(20, 4) NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(account_id, currency)
);

-- ============================================================
-- 4. vault_categories (카테고리)
-- ============================================================

CREATE TABLE vault_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  is_favorite BOOLEAN NOT NULL DEFAULT false,
  is_default BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  icon TEXT,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_vault_categories_user ON vault_categories(user_id) WHERE deleted_at IS NULL;

-- ============================================================
-- 5. vault_budgets (예산)
-- ============================================================

CREATE TABLE vault_budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  target_amount NUMERIC(20, 4) NOT NULL,
  current_amount NUMERIC(20, 4) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'KRW',
  budget_type TEXT NOT NULL DEFAULT 'virtual'
    CHECK (budget_type IN ('virtual', 'actual')),
  linked_account_id UUID REFERENCES vault_accounts(id),
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_vault_budgets_user ON vault_budgets(user_id) WHERE deleted_at IS NULL;

-- ============================================================
-- 6. vault_transactions (거래내역)
-- ============================================================

CREATE TABLE vault_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES vault_accounts(id),
  category_id UUID REFERENCES vault_categories(id),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  amount NUMERIC(20, 4) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'KRW',
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  source_type TEXT NOT NULL DEFAULT 'manual'
    CHECK (source_type IN ('manual', 'transfer', 'recurring', 'savings')),
  source_id UUID,
  transfer_pair_id UUID,
  budget_id UUID REFERENCES vault_budgets(id),
  budget_action TEXT CHECK (budget_action IN ('deposit', 'withdraw')),
  memo TEXT,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_vault_transactions_user_date ON vault_transactions(user_id, transaction_date)
  WHERE deleted_at IS NULL;
CREATE INDEX idx_vault_transactions_account ON vault_transactions(account_id)
  WHERE deleted_at IS NULL;

-- ============================================================
-- 7. vault_transfers (이체)
-- ============================================================

CREATE TABLE vault_transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  from_account_id UUID NOT NULL REFERENCES vault_accounts(id),
  to_account_id UUID NOT NULL REFERENCES vault_accounts(id),
  from_currency TEXT NOT NULL,
  to_currency TEXT NOT NULL,
  from_amount NUMERIC(20, 4) NOT NULL,
  to_amount NUMERIC(20, 4) NOT NULL,
  transfer_date DATE NOT NULL DEFAULT CURRENT_DATE,
  memo TEXT,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 8. vault_recurring_payments (정기결제)
-- ============================================================

CREATE TABLE vault_recurring_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES vault_accounts(id),
  category_id UUID REFERENCES vault_categories(id),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  amount NUMERIC(20, 4) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'KRW',
  start_date DATE NOT NULL,
  interval_unit TEXT NOT NULL CHECK (interval_unit IN ('day', 'week', 'month', 'year')),
  interval_value INTEGER NOT NULL DEFAULT 1 CHECK (interval_value > 0),
  last_generated_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_vault_recurring_user ON vault_recurring_payments(user_id)
  WHERE deleted_at IS NULL AND is_active = true;

-- ============================================================
-- 9. vault_recurring_overrides (정기결제 회차별 수정)
-- ============================================================

CREATE TABLE vault_recurring_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recurring_id UUID NOT NULL REFERENCES vault_recurring_payments(id) ON DELETE CASCADE,
  occurrence_date DATE NOT NULL,
  amount NUMERIC(20, 4),
  name TEXT,
  is_skipped BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(recurring_id, occurrence_date)
);

-- ============================================================
-- 10. vault_savings (예/적금)
-- ============================================================

CREATE TABLE vault_savings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  linked_account_id UUID REFERENCES vault_accounts(id),
  name TEXT NOT NULL,
  savings_type TEXT NOT NULL
    CHECK (savings_type IN ('fixed_deposit', 'installment', 'free_savings', 'housing_subscription')),
  start_date DATE NOT NULL,
  duration_months INTEGER,
  interest_rate NUMERIC(6, 4) NOT NULL,
  principal NUMERIC(20, 4) NOT NULL DEFAULT 0,
  installment_amount NUMERIC(20, 4),
  is_tax_free BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_vault_savings_user ON vault_savings(user_id) WHERE deleted_at IS NULL;

-- ============================================================
-- 11. vault_savings_deposits (자유적금 납입 내역)
-- ============================================================

CREATE TABLE vault_savings_deposits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  savings_id UUID NOT NULL REFERENCES vault_savings(id) ON DELETE CASCADE,
  account_id UUID REFERENCES vault_accounts(id),
  amount NUMERIC(20, 4) NOT NULL,
  deposit_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 12. vault_announcements (공지사항)
-- ============================================================

CREATE TABLE vault_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  pin_order INTEGER CHECK (pin_order >= 1 AND pin_order <= 3),
  likes_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 13. vault_announcement_comments (공지사항 댓글)
-- ============================================================

CREATE TABLE vault_announcement_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id UUID NOT NULL REFERENCES vault_announcements(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 14. vault_announcement_likes (공지사항 좋아요)
-- ============================================================

CREATE TABLE vault_announcement_likes (
  announcement_id UUID NOT NULL REFERENCES vault_announcements(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (announcement_id, user_id)
);

-- ============================================================
-- 15. vault_inquiries (문의)
-- ============================================================

CREATE TABLE vault_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  screenshot_urls TEXT[],
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'answered')),
  admin_response TEXT,
  responded_at TIMESTAMPTZ,
  user_rating TEXT CHECK (user_rating IN ('helpful', 'not_helpful')),
  screenshot_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_vault_inquiries_user ON vault_inquiries(user_id);
