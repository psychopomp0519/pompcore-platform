/**
 * @file TaskDebtPage.tsx
 * @description 작업 부채 — 미완료 작업 추적 페이지
 * @module pages/TaskDebtPage
 */

import { GlassCard, EmptyState, IconClipboard } from '@pompcore/ui';

// ============================================================
// TaskDebtPage
// ============================================================

/** 작업 부채 페이지 — 기한 초과 미완료 작업 목록 */
export function TaskDebtPage(): React.ReactNode {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
        작업 부채
      </h1>

      <GlassCard>
        <div className="p-6">
          <EmptyState
            icon={<IconClipboard size={48} />}
            title="작업 부채가 없습니다"
            description="기한을 넘긴 미완료 작업이 여기에 표시됩니다. 깨끗한 상태를 유지하세요!"
          />
        </div>
      </GlassCard>
    </div>
  );
}
