/**
 * @file DangerZone.tsx
 * @description 위험 영역 섹션 (로그아웃 + 회원 탈퇴)
 * @module components/settings/DangerZone
 */

import { memo, type ReactNode } from 'react';
import { GlassCard, ConfirmDialog } from '@pompcore/ui';

/** DangerZone에 전달되는 props */
interface DangerZoneProps {
  /** 삭제 에러 메시지 */
  readonly deleteError: string | null;
  /** 삭제 확인 다이얼로그 노출 여부 */
  readonly showDeleteConfirm: boolean;
  /** 로그아웃 핸들러 */
  readonly onSignOut: () => void;
  /** 삭제 확인 다이얼로그 열기 */
  readonly onShowDeleteConfirm: () => void;
  /** 삭제 확인 다이얼로그 닫기 */
  readonly onCloseDeleteConfirm: () => void;
  /** 계정 삭제 핸들러 */
  readonly onDeleteAccount: () => void;
  /** 삭제 에러 닫기 핸들러 */
  readonly onClearDeleteError: () => void;
}

/** 위험 영역 (로그아웃 + 회원 탈퇴) */
function DangerZoneInner({
  deleteError,
  showDeleteConfirm,
  onSignOut,
  onShowDeleteConfirm,
  onCloseDeleteConfirm,
  onDeleteAccount,
  onClearDeleteError,
}: DangerZoneProps): ReactNode {
  return (
    <>
      {deleteError && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
          <div className="flex items-center justify-between">
            <span>{deleteError}</span>
            <button type="button" onClick={onClearDeleteError} className="text-red-400 hover:text-red-500" aria-label="에러 닫기">&times;</button>
          </div>
        </div>
      )}

      <GlassCard padding="md" className="border-red-200 dark:border-red-500/20">
        <div className="mb-3 text-xs font-medium text-red-500">위험 영역</div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-navy dark:text-gray-100">로그아웃</div>
            <div className="text-xs text-navy/50 dark:text-gray-400">현재 세션에서 로그아웃합니다.</div>
          </div>
          <button
            type="button"
            onClick={onSignOut}
            className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:border-red-500/20 dark:hover:bg-red-500/10"
          >
            로그아웃
          </button>
        </div>
        <hr className="my-3 border-navy/5 dark:border-white/5" />
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-navy dark:text-gray-100">회원 탈퇴</div>
            <div className="text-xs text-navy/50 dark:text-gray-400">모든 데이터가 삭제됩니다.</div>
          </div>
          <button
            type="button"
            onClick={onShowDeleteConfirm}
            className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
          >
            탈퇴
          </button>
        </div>
      </GlassCard>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={onCloseDeleteConfirm}
        onConfirm={onDeleteAccount}
        title="회원 탈퇴"
        message="정말 탈퇴하시겠습니까? 모든 데이터가 삭제되며 복구할 수 없습니다."
        confirmText="탈퇴"
        isDangerous
      />
    </>
  );
}

export const DangerZone = memo(DangerZoneInner);
