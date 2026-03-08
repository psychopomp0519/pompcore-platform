-- ============================================================
-- vault_announcements에 soft delete 지원 추가
-- ============================================================

ALTER TABLE vault_announcements
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_vault_announcements_active
  ON vault_announcements(created_at DESC)
  WHERE deleted_at IS NULL;
