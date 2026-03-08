/**
 * @file NotFoundPage.tsx
 * @description 404 페이지 — 존재하지 않는 경로
 * @module pages/NotFoundPage
 */

import { Link } from 'react-router-dom';
import { ForgeIcon } from '@pompcore/ui';
import { ROUTES } from '../constants/routes';

// ============================================================
// NotFoundPage
// ============================================================

/** 404 페이지 */
export function NotFoundPage(): React.ReactNode {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface-light p-4 dark:bg-surface-dark">
      <ForgeIcon size={48} />
      <h1 className="font-display text-4xl font-bold text-slate-900 dark:text-white">404</h1>
      <p className="text-slate-500 dark:text-slate-400">
        요청하신 페이지를 찾을 수 없습니다.
      </p>
      <Link
        to={ROUTES.DASHBOARD}
        className="mt-2 rounded-xl bg-forge-color px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-forge-color-light"
      >
        대시보드로 돌아가기
      </Link>
    </div>
  );
}
