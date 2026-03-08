-- ============================================================
-- Vault RLS (Row Level Security) 정책
-- 실행 대상: Supabase SQL Editor (001_initial_schema.sql 실행 후)
-- ============================================================

-- ============================================================
-- RLS 활성화
-- ============================================================

ALTER TABLE vault_user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_account_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_recurring_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_recurring_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_savings ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_savings_deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_announcement_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_announcement_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_inquiries ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 사용자 데이터 테이블 (user_id 기반)
-- 패턴: 본인 데이터만 CRUD
-- ============================================================

-- vault_user_settings
CREATE POLICY "user_settings_select" ON vault_user_settings
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_settings_insert" ON vault_user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_settings_update" ON vault_user_settings
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "user_settings_delete" ON vault_user_settings
  FOR DELETE USING (auth.uid() = user_id);

-- vault_accounts
CREATE POLICY "accounts_select" ON vault_accounts
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "accounts_insert" ON vault_accounts
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "accounts_update" ON vault_accounts
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "accounts_delete" ON vault_accounts
  FOR DELETE USING (auth.uid() = user_id);

-- vault_account_balances (account 소유자 확인)
CREATE POLICY "account_balances_select" ON vault_account_balances
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM vault_accounts WHERE id = account_id AND user_id = auth.uid())
  );
CREATE POLICY "account_balances_insert" ON vault_account_balances
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM vault_accounts WHERE id = account_id AND user_id = auth.uid())
  );
CREATE POLICY "account_balances_update" ON vault_account_balances
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM vault_accounts WHERE id = account_id AND user_id = auth.uid())
  );
CREATE POLICY "account_balances_delete" ON vault_account_balances
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM vault_accounts WHERE id = account_id AND user_id = auth.uid())
  );

-- vault_categories
CREATE POLICY "categories_select" ON vault_categories
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "categories_insert" ON vault_categories
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "categories_update" ON vault_categories
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "categories_delete" ON vault_categories
  FOR DELETE USING (auth.uid() = user_id);

-- vault_transactions
CREATE POLICY "transactions_select" ON vault_transactions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "transactions_insert" ON vault_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "transactions_update" ON vault_transactions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "transactions_delete" ON vault_transactions
  FOR DELETE USING (auth.uid() = user_id);

-- vault_transfers
CREATE POLICY "transfers_select" ON vault_transfers
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "transfers_insert" ON vault_transfers
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "transfers_update" ON vault_transfers
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "transfers_delete" ON vault_transfers
  FOR DELETE USING (auth.uid() = user_id);

-- vault_recurring_payments
CREATE POLICY "recurring_select" ON vault_recurring_payments
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "recurring_insert" ON vault_recurring_payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "recurring_update" ON vault_recurring_payments
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "recurring_delete" ON vault_recurring_payments
  FOR DELETE USING (auth.uid() = user_id);

-- vault_recurring_overrides (recurring 소유자 확인)
CREATE POLICY "recurring_overrides_select" ON vault_recurring_overrides
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM vault_recurring_payments WHERE id = recurring_id AND user_id = auth.uid())
  );
CREATE POLICY "recurring_overrides_insert" ON vault_recurring_overrides
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM vault_recurring_payments WHERE id = recurring_id AND user_id = auth.uid())
  );
CREATE POLICY "recurring_overrides_update" ON vault_recurring_overrides
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM vault_recurring_payments WHERE id = recurring_id AND user_id = auth.uid())
  );
CREATE POLICY "recurring_overrides_delete" ON vault_recurring_overrides
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM vault_recurring_payments WHERE id = recurring_id AND user_id = auth.uid())
  );

-- vault_savings
CREATE POLICY "savings_select" ON vault_savings
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "savings_insert" ON vault_savings
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "savings_update" ON vault_savings
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "savings_delete" ON vault_savings
  FOR DELETE USING (auth.uid() = user_id);

-- vault_savings_deposits (savings 소유자 확인)
CREATE POLICY "savings_deposits_select" ON vault_savings_deposits
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM vault_savings WHERE id = savings_id AND user_id = auth.uid())
  );
CREATE POLICY "savings_deposits_insert" ON vault_savings_deposits
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM vault_savings WHERE id = savings_id AND user_id = auth.uid())
  );
CREATE POLICY "savings_deposits_delete" ON vault_savings_deposits
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM vault_savings WHERE id = savings_id AND user_id = auth.uid())
  );

-- vault_budgets
CREATE POLICY "budgets_select" ON vault_budgets
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "budgets_insert" ON vault_budgets
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "budgets_update" ON vault_budgets
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "budgets_delete" ON vault_budgets
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- 공지사항 (읽기: 인증 사용자 전체 / 쓰기: leader, member만)
-- ============================================================

-- vault_announcements
CREATE POLICY "announcements_select" ON vault_announcements
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "announcements_insert" ON vault_announcements
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
    AND (auth.jwt() -> 'user_metadata' ->> 'role') IN ('leader', 'member')
  );
CREATE POLICY "announcements_update" ON vault_announcements
  FOR UPDATE USING (
    auth.uid() = author_id
    AND (auth.jwt() -> 'user_metadata' ->> 'role') IN ('leader', 'member')
  );
CREATE POLICY "announcements_delete" ON vault_announcements
  FOR DELETE USING (
    auth.uid() = author_id
    AND (auth.jwt() -> 'user_metadata' ->> 'role') IN ('leader', 'member')
  );

-- vault_announcement_comments
CREATE POLICY "announcement_comments_select" ON vault_announcement_comments
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "announcement_comments_insert" ON vault_announcement_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "announcement_comments_delete" ON vault_announcement_comments
  FOR DELETE USING (auth.uid() = user_id);

-- vault_announcement_likes
CREATE POLICY "announcement_likes_select" ON vault_announcement_likes
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "announcement_likes_insert" ON vault_announcement_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "announcement_likes_delete" ON vault_announcement_likes
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- 문의 (본인 문의만 조회, leader/member는 전체 조회 가능)
-- ============================================================

CREATE POLICY "inquiries_select" ON vault_inquiries
  FOR SELECT USING (
    auth.uid() = user_id
    OR (auth.jwt() -> 'user_metadata' ->> 'role') IN ('leader', 'member')
  );
CREATE POLICY "inquiries_insert" ON vault_inquiries
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "inquiries_update" ON vault_inquiries
  FOR UPDATE USING (
    auth.uid() = user_id
    OR (auth.jwt() -> 'user_metadata' ->> 'role') IN ('leader', 'member')
  );
