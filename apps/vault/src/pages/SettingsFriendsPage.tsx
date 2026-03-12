/**
 * @file SettingsFriendsPage.tsx
 * @description 친구/공유 관리 페이지 — 공유 목록 + 초대 생성/관리
 * @module pages/SettingsFriendsPage
 */

import { useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useSharingStore } from '../stores/sharingStore';
import { GlassCard, LoadingSpinner, EmptyState, IconArrowLeft } from '@pompcore/ui';
import { ROUTES } from '../constants/routes';
import { PERMISSION_LABELS } from '../types/sharing.types';
import type { SharePermission } from '../types/sharing.types';

// ============================================================
// 상수
// ============================================================

/** 초대 링크 베이스 */
const INVITE_BASE_PATH = '/invite/';

// ============================================================
// SettingsFriendsPage
// ============================================================

/** 친구/공유 관리 페이지 */
export function SettingsFriendsPage(): ReactNode {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const {
    myShares,
    sharedWithMe,
    invitations,
    isLoading,
    error,
    load,
    createInvitation,
    deactivateInvitation,
    removeShare,
    clearError,
  } = useSharingStore();

  const [newPermission, setNewPermission] = useState<SharePermission>('read');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (user?.id) load(user.id);
  }, [user?.id, load]);

  /** 초대 링크 생성 */
  async function handleCreateInvite(): Promise<void> {
    if (!user?.id || creating) return;
    setCreating(true);
    try {
      await createInvitation(user.id, newPermission);
    } catch {
      /* error는 스토어에서 처리 */
    } finally {
      setCreating(false);
    }
  }

  /** 초대 링크 복사 */
  function copyInviteLink(code: string, inviteId: string): void {
    const url = `${window.location.origin}${INVITE_BASE_PATH}${code}`;
    navigator.clipboard.writeText(url);
    setCopiedId(inviteId);
    setTimeout(() => setCopiedId(null), 2000);
  }

  if (isLoading && myShares.length === 0) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      {/* 헤더 */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(ROUTES.SETTINGS)}
          className="rounded-lg p-1.5 text-navy/60 hover:bg-navy/5 dark:text-gray-400 dark:hover:bg-white/5"
          aria-label="설정으로 돌아가기"
        >
          <IconArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-display text-xl font-bold text-navy dark:text-gray-100">친구 / 공유</h1>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <button type="button" onClick={clearError} className="text-red-400 hover:text-red-500" aria-label="에러 닫기">&times;</button>
          </div>
        </div>
      )}

      {/* 초대 생성 */}
      <GlassCard padding="md">
        <h2 className="mb-3 text-sm font-semibold text-navy dark:text-gray-100">초대 링크 생성</h2>
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label htmlFor="invite-perm" className="mb-1 block text-xs text-navy/60 dark:text-gray-400">
              권한
            </label>
            <select
              id="invite-perm"
              value={newPermission}
              onChange={(e) => setNewPermission(e.target.value as SharePermission)}
              className="w-full rounded-xl border border-navy/10 bg-white/80 px-3 py-2 text-sm text-navy focus:border-vault-color focus:outline-none focus:ring-1 focus:ring-vault-color dark:border-white/10 dark:bg-white/5 dark:text-gray-100"
            >
              <option value="read">읽기 전용</option>
              <option value="write">읽기/쓰기</option>
            </select>
          </div>
          <button
            type="button"
            onClick={handleCreateInvite}
            disabled={creating}
            className="rounded-xl bg-vault-color px-5 py-2 text-sm font-semibold text-white hover:bg-vault-color/90 disabled:opacity-50"
          >
            {creating ? '생성 중...' : '생성'}
          </button>
        </div>
      </GlassCard>

      {/* 활성 초대 목록 */}
      {invitations.length > 0 && (
        <GlassCard padding="md">
          <h2 className="mb-3 text-sm font-semibold text-navy dark:text-gray-100">내 초대 링크</h2>
          <div className="space-y-2">
            {invitations.map((inv) => (
              <div
                key={inv.id}
                className={`flex items-center justify-between rounded-lg border border-navy/5 px-3 py-2 dark:border-white/5 ${inv.isActive ? '' : 'opacity-40'}`}
              >
                <div className="min-w-0 flex-1">
                  <code className="text-xs text-navy/70 dark:text-gray-300">{inv.inviteCode}</code>
                  <div className="mt-0.5 text-[10px] text-navy/40 dark:text-gray-500">
                    {PERMISSION_LABELS[inv.permission]} · {inv.usedCount}/{inv.maxUses}회 사용
                    {!inv.isActive && ' · 비활성'}
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  {inv.isActive && (
                    <>
                      <button
                        type="button"
                        onClick={() => copyInviteLink(inv.inviteCode, inv.id)}
                        className="rounded-lg px-2.5 py-1 text-xs text-vault-color hover:bg-vault-color/10"
                      >
                        {copiedId === inv.id ? '복사됨!' : '복사'}
                      </button>
                      <button
                        type="button"
                        onClick={() => deactivateInvitation(inv.id)}
                        className="rounded-lg px-2.5 py-1 text-xs text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
                      >
                        비활성화
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* 내가 공유한 사람들 */}
      <GlassCard padding="md">
        <h2 className="mb-3 text-sm font-semibold text-navy dark:text-gray-100">
          내가 공유한 사용자 ({myShares.length})
        </h2>
        {myShares.length === 0 ? (
          <EmptyState title="아직 공유한 사용자가 없습니다." />
        ) : (
          <div className="space-y-2">
            {myShares.map((share) => (
              <div key={share.id} className="flex items-center justify-between rounded-lg border border-navy/5 px-3 py-2 dark:border-white/5">
                <div>
                  <div className="text-sm text-navy dark:text-gray-200">
                    {share.viewerName ?? share.viewerEmail ?? share.viewerId.slice(0, 8)}
                  </div>
                  <div className="text-[10px] text-navy/40 dark:text-gray-500">
                    {PERMISSION_LABELS[share.permission]}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeShare(share.id)}
                  className="rounded-lg px-2.5 py-1 text-xs text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
                >
                  해제
                </button>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* 나에게 공유된 가계부 */}
      <GlassCard padding="md">
        <h2 className="mb-3 text-sm font-semibold text-navy dark:text-gray-100">
          공유받은 가계부 ({sharedWithMe.length})
        </h2>
        {sharedWithMe.length === 0 ? (
          <EmptyState title="공유받은 가계부가 없습니다." />
        ) : (
          <div className="space-y-2">
            {sharedWithMe.map((share) => (
              <div key={share.id} className="flex items-center justify-between rounded-lg border border-navy/5 px-3 py-2 dark:border-white/5">
                <div>
                  <div className="text-sm text-navy dark:text-gray-200">
                    {share.ownerName ?? share.ownerEmail ?? share.ownerId.slice(0, 8)}
                  </div>
                  <div className="text-[10px] text-navy/40 dark:text-gray-500">
                    {PERMISSION_LABELS[share.permission]}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => navigate(`/shared/${share.ownerId}`)}
                    className="rounded-lg px-2.5 py-1 text-xs text-vault-color hover:bg-vault-color/10"
                  >
                    조회
                  </button>
                  <button
                    type="button"
                    onClick={() => removeShare(share.id)}
                    className="rounded-lg px-2.5 py-1 text-xs text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
                  >
                    나가기
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
