/**
 * @file GoalDetailPage.tsx
 * @description 목표 상세 — 마일스톤 + 하위 작업 표시
 * @module pages/GoalDetailPage
 */

import { useParams } from 'react-router-dom';
import { GlassCard } from '@pompcore/ui';

// ============================================================
// GoalDetailPage
// ============================================================

/** 목표 상세 페이지 — 마일스톤과 작업 트리 */
export function GoalDetailPage(): React.ReactNode {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
        목표 상세
      </h1>

      <GlassCard>
        <div className="flex min-h-[300px] items-center justify-center p-6">
          <p className="text-slate-400 dark:text-slate-500">
            목표 ID: {id} — 마일스톤 및 작업 트리가 이 자리에 표시됩니다.
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
