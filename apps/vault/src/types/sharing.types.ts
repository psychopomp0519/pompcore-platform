/**
 * @file sharing.types.ts
 * @description 가계부 공유 / 초대 관련 타입 정의
 * @module types/sharing
 */

// ============================================================
// 공유 권한
// ============================================================

export const SHARE_PERMISSIONS = {
  READ: 'read',
  WRITE: 'write',
} as const;

export type SharePermission = (typeof SHARE_PERMISSIONS)[keyof typeof SHARE_PERMISSIONS];

export const PERMISSION_LABELS: Record<SharePermission, string> = {
  read: '읽기 전용',
  write: '읽기/쓰기',
};

// ============================================================
// 공유 관계
// ============================================================

/** 공유 관계 엔티티 */
export interface SharedVault {
  id: string;
  ownerId: string;
  viewerId: string;
  permission: SharePermission;
  createdAt: string;
  /** 조인된 프로필 정보 (조회 시 포함) */
  ownerName?: string;
  ownerEmail?: string;
  viewerName?: string;
  viewerEmail?: string;
}

/** DB row */
export interface SharedVaultRow {
  id: string;
  owner_id: string;
  viewer_id: string;
  permission: string;
  created_at: string;
  owner?: { display_name: string | null; email?: string } | null;
  viewer?: { display_name: string | null; email?: string } | null;
}

/** DB row → 클라이언트 변환 */
export function toSharedVault(row: SharedVaultRow): SharedVault {
  return {
    id: row.id,
    ownerId: row.owner_id,
    viewerId: row.viewer_id,
    permission: row.permission as SharePermission,
    createdAt: row.created_at,
    ownerName: row.owner?.display_name ?? undefined,
    ownerEmail: row.owner?.email ?? undefined,
    viewerName: row.viewer?.display_name ?? undefined,
    viewerEmail: row.viewer?.email ?? undefined,
  };
}

// ============================================================
// 초대
// ============================================================

/** 초대 엔티티 */
export interface VaultInvitation {
  id: string;
  ownerId: string;
  inviteCode: string;
  permission: SharePermission;
  maxUses: number;
  usedCount: number;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
}

/** DB row */
export interface VaultInvitationRow {
  id: string;
  owner_id: string;
  invite_code: string;
  permission: string;
  max_uses: number;
  used_count: number;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

/** DB row → 클라이언트 변환 */
export function toVaultInvitation(row: VaultInvitationRow): VaultInvitation {
  return {
    id: row.id,
    ownerId: row.owner_id,
    inviteCode: row.invite_code,
    permission: row.permission as SharePermission,
    maxUses: row.max_uses,
    usedCount: row.used_count,
    expiresAt: row.expires_at,
    isActive: row.is_active,
    createdAt: row.created_at,
  };
}
