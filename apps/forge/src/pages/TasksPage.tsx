/**
 * @file TasksPage.tsx
 * @description 작업 목록 — 오늘의 퀘스트 관리
 * @module pages/TasksPage
 */

import { GlassCard, EmptyState, IconCheck } from '@pompcore/ui';

// ============================================================
// TasksPage
// ============================================================

/** 작업 목록 페이지 — 오늘 해야 할 일 */
export function TasksPage(): React.ReactNode {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
          작업 관리
        </h1>
      </div>

      <GlassCard>
        <div className="p-6">
          <EmptyState
            icon={<IconCheck size={48} />}
            title="작업이 비어 있습니다"
            description="목표에 연결된 작업을 추가하거나, 독립 작업을 생성하세요."
          />
        </div>
      </GlassCard>
    </div>
  );
}
