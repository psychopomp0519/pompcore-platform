/**
 * @file InviteAcceptPage.tsx
 * @description 초대 코드 수락 페이지
 * @module pages/InviteAcceptPage
 */

import { useState, useEffect, type ReactNode } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useSharingStore } from '../stores/sharingStore';
import { fetchInvitationByCode } from '../services/sharing.service';
import { ROUTES } from '../constants/routes';
import { GlassCard, LoadingSpinner } from '@pompcore/ui';
import { PERMISSION_LABELS } from '../types/sharing.types';
import type { VaultInvitation } from '../types/sharing.types';

// ============================================================
// InviteAcceptPage
// ============================================================

/** 초대 수락 페이지 */
export function InviteAcceptPage(): ReactNode {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { acceptInvitation, error, clearError } = useSharingStore();

  const [invitation, setInvitation] = useState<VaultInvitation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    if (!code) {
      setLoadError('초대 코드가 없습니다.');
      setIsLoading(false);
      return;
    }
    clearError();
    fetchInvitationByCode(code)
      .then((inv) => {
        if (!inv) {
          setLoadError('유효하지 않거나 만료된 초대입니다.');
        } else {
          setInvitation(inv);
        }
      })
      .catch(() => setLoadError('초대 정보를 불러올 수 없습니다.'))
      .finally(() => setIsLoading(false));
  }, [code, clearError]);

  async function handleAccept(): Promise<void> {
    if (!code || !user?.id || accepting) return;
    setAccepting(true);
    try {
      await acceptInvitation(code, user.id);
      setAccepted(true);
    } catch {
      /* error는 스토어에서 처리 */
    } finally {
      setAccepting(false);
    }
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <GlassCard padding="lg">
          <div className="text-center">
            <p className="text-sm text-navy dark:text-gray-200">초대를 수락하려면 로그인이 필요합니다.</p>
            <button
              type="button"
              onClick={() => navigate(ROUTES.LOGIN)}
              className="mt-4 rounded-xl bg-vault-color px-6 py-2.5 text-sm font-semibold text-white hover:bg-vault-color/90"
            >
              로그인
            </button>
          </div>
        </GlassCard>
      </div>
    );
  }

  if (isLoading) return <LoadingSpinner />;

  if (loadError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <GlassCard padding="lg">
          <div className="text-center">
            <p className="text-sm text-red-500">{loadError}</p>
            <button
              type="button"
              onClick={() => navigate(ROUTES.DASHBOARD)}
              className="mt-4 text-sm text-vault-color hover:underline"
            >
              대시보드로 돌아가기
            </button>
          </div>
        </GlassCard>
      </div>
    );
  }

  if (accepted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <GlassCard padding="lg">
          <div className="text-center">
            <div className="mb-3 text-3xl">🎉</div>
            <p className="text-sm font-semibold text-navy dark:text-gray-100">초대를 수락했습니다!</p>
            <p className="mt-1 text-xs text-navy/50 dark:text-gray-400">
              공유된 가계부를 확인할 수 있습니다.
            </p>
            <button
              type="button"
              onClick={() => navigate(ROUTES.SETTINGS_FRIENDS)}
              className="mt-4 rounded-xl bg-vault-color px-6 py-2.5 text-sm font-semibold text-white hover:bg-vault-color/90"
            >
              공유 목록 보기
            </button>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <GlassCard padding="lg" className="w-full max-w-sm">
        <div className="text-center">
          <div className="mb-3 text-3xl">📬</div>
          <h2 className="text-lg font-bold text-navy dark:text-gray-100">가계부 공유 초대</h2>
          {invitation && (
            <div className="mt-3 space-y-2">
              <p className="text-sm text-navy/60 dark:text-gray-400">
                권한: <span className="font-medium text-navy dark:text-gray-200">{PERMISSION_LABELS[invitation.permission]}</span>
              </p>
            </div>
          )}

          {error && (
            <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={() => navigate(ROUTES.DASHBOARD)}
              className="flex-1 rounded-xl border border-navy/10 px-4 py-2.5 text-sm text-navy/60 hover:bg-navy/5 dark:border-white/10 dark:text-gray-400 dark:hover:bg-white/5"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleAccept}
              disabled={accepting}
              className="flex-1 rounded-xl bg-vault-color px-4 py-2.5 text-sm font-semibold text-white hover:bg-vault-color/90 disabled:opacity-50"
            >
              {accepting ? '처리 중...' : '수락'}
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
