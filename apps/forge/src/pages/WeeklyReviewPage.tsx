/**
 * @file WeeklyReviewPage.tsx
 * @description 주간 회고 — 한 주의 성과를 돌아보는 페이지
 * @module pages/WeeklyReviewPage
 */

import { GlassCard, EmptyState, IconRepeat } from '@pompcore/ui';

// ============================================================
// WeeklyReviewPage
// ============================================================

/** 주간 회고 페이지 — 완료율, 부채, 자기 평가 */
export function WeeklyReviewPage(): React.ReactNode {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
        주간 회고
      </h1>

      <GlassCard>
        <div className="p-6">
          <EmptyState
            icon={<IconRepeat size={48} />}
            title="아직 회고 기록이 없습니다"
            description="매주 일요일, 한 주의 성과를 돌아보세요."
          />
        </div>
      </GlassCard>
    </div>
  );
}
