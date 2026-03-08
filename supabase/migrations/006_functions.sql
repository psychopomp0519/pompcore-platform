-- ============================================================
-- 006: Database functions and triggers
-- ============================================================

-- ============================================================
-- Auto-create core.profiles on first auth.users sign-up
-- ============================================================
CREATE OR REPLACE FUNCTION core.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = core
AS $$
BEGIN
  INSERT INTO core.profiles (id, display_name, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.raw_user_meta_data ->> 'full_name', ''),
    NEW.raw_user_meta_data ->> 'avatar_url',
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'user')
  );

  -- Auto-subscribe to free services
  INSERT INTO core.service_subscriptions (user_id, service_id, tier)
  SELECT NEW.id, id, 'free'
  FROM core.services
  WHERE is_free = true;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION core.handle_new_user();

-- ============================================================
-- Sync role changes from core.profiles back to auth.users metadata
-- ============================================================
CREATE OR REPLACE FUNCTION core.sync_role_to_auth()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = core
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    UPDATE auth.users
    SET raw_user_meta_data = raw_user_meta_data || jsonb_build_object('role', NEW.role)
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_profile_role_change
  AFTER UPDATE OF role ON core.profiles
  FOR EACH ROW
  EXECUTE FUNCTION core.sync_role_to_auth();

-- ============================================================
-- Auto-update updated_at timestamps
-- ============================================================
CREATE OR REPLACE FUNCTION core.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Apply to all tables with updated_at
CREATE TRIGGER set_updated_at BEFORE UPDATE ON core.profiles
  FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON core.organizations
  FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON core.announcements
  FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON vault.user_settings
  FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON vault.accounts
  FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON vault.budgets
  FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON vault.transactions
  FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON vault.recurring_payments
  FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON vault.savings
  FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON vault.investment_portfolios
  FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON vault.investment_trades
  FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON vault.real_estate
  FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON vault.real_estate_leases
  FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();

-- ============================================================
-- vault.adjust_balance — Atomic balance adjustment
-- Used by transfer operations to avoid race conditions.
-- ============================================================
CREATE OR REPLACE FUNCTION vault.adjust_balance(
  p_account_id UUID,
  p_currency TEXT,
  p_delta NUMERIC
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = vault
AS $$
BEGIN
  UPDATE vault.account_balances
  SET balance = balance + p_delta,
      updated_at = now()
  WHERE account_id = p_account_id
    AND currency = p_currency;

  -- If no row was updated, create the balance record
  IF NOT FOUND THEN
    INSERT INTO vault.account_balances (account_id, currency, balance)
    VALUES (p_account_id, p_currency, p_delta);
  END IF;
END;
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION vault.adjust_balance TO authenticated;
GRANT EXECUTE ON FUNCTION core.handle_new_user TO service_role;
GRANT EXECUTE ON FUNCTION core.sync_role_to_auth TO service_role;
GRANT EXECUTE ON FUNCTION core.set_updated_at TO authenticated;
