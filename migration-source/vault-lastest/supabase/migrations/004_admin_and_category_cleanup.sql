-- ============================================================
-- 004: 관리자 권한 부여 + 카테고리 중복 정리
-- ============================================================

-- 1. ljh040425@gmail.com 계정에 관리자(leader) 권한 부여
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "leader"}'::jsonb
WHERE email = 'ljh040425@gmail.com';

-- 2. 카테고리 중복 항목 정리 (같은 user_id + name + type 조합에서 가장 오래된 것만 보존)

-- 2-1. 중복 카테고리를 참조하는 거래내역의 category_id를 보존할 카테고리로 재연결
UPDATE vault_transactions t
SET category_id = keeper.id
FROM vault_categories dup
JOIN (
  SELECT DISTINCT ON (user_id, name, type) id, user_id, name, type
  FROM vault_categories
  WHERE deleted_at IS NULL
  ORDER BY user_id, name, type, created_at ASC
) keeper ON keeper.user_id = dup.user_id
       AND keeper.name = dup.name
       AND keeper.type = dup.type
       AND keeper.id != dup.id
WHERE t.category_id = dup.id
  AND dup.deleted_at IS NULL;

-- 2-2. 중복 카테고리를 참조하는 정기결제의 category_id도 재연결
UPDATE vault_recurring_payments rp
SET category_id = keeper.id
FROM vault_categories dup
JOIN (
  SELECT DISTINCT ON (user_id, name, type) id, user_id, name, type
  FROM vault_categories
  WHERE deleted_at IS NULL
  ORDER BY user_id, name, type, created_at ASC
) keeper ON keeper.user_id = dup.user_id
       AND keeper.name = dup.name
       AND keeper.type = dup.type
       AND keeper.id != dup.id
WHERE rp.category_id = dup.id
  AND dup.deleted_at IS NULL;

-- 2-3. 이제 안전하게 중복 카테고리 삭제
DELETE FROM vault_categories
WHERE id NOT IN (
  SELECT DISTINCT ON (user_id, name, type) id
  FROM vault_categories
  WHERE deleted_at IS NULL
  ORDER BY user_id, name, type, created_at ASC
)
AND deleted_at IS NULL
AND id IN (
  SELECT id FROM vault_categories vc
  WHERE EXISTS (
    SELECT 1 FROM vault_categories vc2
    WHERE vc2.user_id = vc.user_id
      AND vc2.name = vc.name
      AND vc2.type = vc.type
      AND vc2.deleted_at IS NULL
      AND vc2.id != vc.id
      AND vc2.created_at < vc.created_at
  )
);
