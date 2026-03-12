/**
 * @file sharing.service.ts
 * @description 가계부 공유 / 초대 CRUD 서비스
 * @module services/sharing
 */

import { supabase } from './supabase';
import type {
  SharedVault,
  SharedVaultRow,
  VaultInvitation,
  VaultInvitationRow,
  SharePermission,
} from '../types/sharing.types';
import { toSharedVault, toVaultInvitation } from '../types/sharing.types';

// ============================================================
// 테이블 이름
// ============================================================

const SHARED_TABLE = 'shared_vaults';
const INVITE_TABLE = 'vault_invitations';

// ============================================================
// 공유 관계 조회
// ============================================================

/** 내가 공유한 목록 (소유자 기준) */
export async function fetchMyShares(userId: string): Promise<SharedVault[]> {
  const { data, error } = await supabase
    .from(SHARED_TABLE)
    .select('*')
    .eq('owner_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`공유 목록 조회 실패: ${error.message}`);
  return (data as SharedVaultRow[]).map(toSharedVault);
}

/** 나에게 공유된 목록 (뷰어 기준) */
export async function fetchSharedWithMe(userId: string): Promise<SharedVault[]> {
  const { data, error } = await supabase
    .from(SHARED_TABLE)
    .select('*')
    .eq('viewer_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`공유받은 목록 조회 실패: ${error.message}`);
  return (data as SharedVaultRow[]).map(toSharedVault);
}

// ============================================================
// 공유 해제
// ============================================================

/** 공유 관계 삭제 (소유자 또는 뷰어) */
export async function removeShare(shareId: string): Promise<void> {
  const { error } = await supabase
    .from(SHARED_TABLE)
    .delete()
    .eq('id', shareId);

  if (error) throw new Error(`공유 해제 실패: ${error.message}`);
}

// ============================================================
// 초대 관리
// ============================================================

/** 초대 코드 생성 (8자 랜덤) */
function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

/** 초대 링크 생성 */
export async function createInvitation(
  userId: string,
  permission: SharePermission = 'read',
  maxUses: number = 1,
): Promise<VaultInvitation> {
  const inviteCode = generateCode();

  const { data, error } = await supabase
    .from(INVITE_TABLE)
    .insert({
      owner_id: userId,
      invite_code: inviteCode,
      permission,
      max_uses: maxUses,
    })
    .select()
    .single();

  if (error) throw new Error(`초대 생성 실패: ${error.message}`);
  return toVaultInvitation(data as VaultInvitationRow);
}

/** 내 초대 목록 조회 */
export async function fetchMyInvitations(userId: string): Promise<VaultInvitation[]> {
  const { data, error } = await supabase
    .from(INVITE_TABLE)
    .select('*')
    .eq('owner_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`초대 목록 조회 실패: ${error.message}`);
  return (data as VaultInvitationRow[]).map(toVaultInvitation);
}

/** 초대 비활성화 */
export async function deactivateInvitation(invitationId: string): Promise<void> {
  const { error } = await supabase
    .from(INVITE_TABLE)
    .update({ is_active: false })
    .eq('id', invitationId);

  if (error) throw new Error(`초대 비활성화 실패: ${error.message}`);
}

// ============================================================
// 초대 수락
// ============================================================

/** 초대 코드로 초대 정보 조회 */
export async function fetchInvitationByCode(code: string): Promise<VaultInvitation | null> {
  const { data, error } = await supabase
    .from(INVITE_TABLE)
    .select('*')
    .eq('invite_code', code)
    .eq('is_active', true)
    .maybeSingle();

  if (error) throw new Error(`초대 조회 실패: ${error.message}`);
  if (!data) return null;
  return toVaultInvitation(data as VaultInvitationRow);
}

/** 초대 수락 — 공유 관계 생성 + 사용 횟수 증가 */
export async function acceptInvitation(
  inviteCode: string,
  viewerId: string,
): Promise<void> {
  /* 초대 조회 */
  const invitation = await fetchInvitationByCode(inviteCode);
  if (!invitation) throw new Error('유효하지 않거나 만료된 초대입니다.');

  /* 자기 자신 초대 방지 */
  if (invitation.ownerId === viewerId) {
    throw new Error('자신의 가계부에는 초대를 수락할 수 없습니다.');
  }

  /* 사용 횟수 초과 확인 */
  if (invitation.usedCount >= invitation.maxUses) {
    throw new Error('초대 사용 횟수를 초과했습니다.');
  }

  /* 만료 확인 */
  if (invitation.expiresAt && new Date(invitation.expiresAt) < new Date()) {
    throw new Error('초대가 만료되었습니다.');
  }

  /* 중복 공유 확인 */
  const { data: existing } = await supabase
    .from(SHARED_TABLE)
    .select('id')
    .eq('owner_id', invitation.ownerId)
    .eq('viewer_id', viewerId)
    .maybeSingle();

  if (existing) throw new Error('이미 공유된 가계부입니다.');

  /* 공유 관계 생성 */
  const { error: shareError } = await supabase
    .from(SHARED_TABLE)
    .insert({
      owner_id: invitation.ownerId,
      viewer_id: viewerId,
      permission: invitation.permission,
    });

  if (shareError) throw new Error(`공유 생성 실패: ${shareError.message}`);

  /* 사용 횟수 증가 */
  const newCount = invitation.usedCount + 1;
  const updates: Record<string, unknown> = { used_count: newCount };
  if (newCount >= invitation.maxUses) {
    updates.is_active = false;
  }

  await supabase
    .from(INVITE_TABLE)
    .update(updates)
    .eq('id', invitation.id);
}
