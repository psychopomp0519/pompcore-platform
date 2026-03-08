/**
 * @file GoalsPage.tsx
 * @description 목표 목록 — 장기 목표 관리 페이지
 * @module pages/GoalsPage
 */

import { GlassCard, EmptyState, IconTarget } from '@pompcore/ui';

// ============================================================
// GoalsPage
// ============================================================

/** 목표 목록 페이지 — 모든 장기 목표를 한눈에 */
export function GoalsPage(): React.ReactNode {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
          목표 관리
        </h1>
      </div>

      <GlassCard>
        <div className="p-6">
          <EmptyState
            icon={<IconTarget size={48} />}
            title="아직 목표가 없습니다"
            description="새로운 목표를 생성하고 마일스톤을 설정하세요."
          />
        </div>
      </GlassCard>
    </div>
  );
}
