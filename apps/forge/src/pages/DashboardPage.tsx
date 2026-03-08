/**
 * @file DashboardPage.tsx
 * @description 대시보드 — 대장간 총괄 현황판
 * @module pages/DashboardPage
 */

import { GlassCard, ForgeIcon } from '@pompcore/ui';

// ============================================================
// DashboardPage
// ============================================================

/** 대시보드 — 목표, 작업, 부채 요약 표시 */
export function DashboardPage(): React.ReactNode {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* 헤더 섹션 */}
      <div className="flex items-center gap-3">
        <ForgeIcon size={36} />
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            대장간 현황
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            시간을 채우지 마라 — Done을 쌓아라.
          </p>
        </div>
      </div>

      {/* 요약 카드 그리드 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <GlassCard>
          <div className="p-5">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">활성 목표</p>
            <p className="mt-1 text-3xl font-bold text-forge-color">0</p>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="p-5">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">오늘의 작업</p>
            <p className="mt-1 text-3xl font-bold text-forge-color">0</p>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="p-5">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">작업 부채</p>
            <p className="mt-1 text-3xl font-bold text-red-500">0</p>
          </div>
        </GlassCard>
      </div>

      {/* 플레이스홀더 — 향후 구현 예정 */}
      <GlassCard>
        <div className="flex min-h-[200px] items-center justify-center p-6">
          <p className="text-slate-400 dark:text-slate-500">
            주간 진행률 차트가 이 자리에 표시됩니다.
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
