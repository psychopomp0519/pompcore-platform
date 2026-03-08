/**
 * @file NotFoundPage.tsx
 * @description 404 페이지 - 존재하지 않는 경로 접근 시 표시
 * @module pages/NotFoundPage
 */

import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import type { ReactNode } from 'react';

// ============================================================
// NotFoundPage
// ============================================================

/** 404 페이지 */
export function NotFoundPage(): ReactNode {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-light px-4 dark:bg-surface-dark">
      <div className="rounded-3xl border border-white/20 bg-white/60 p-10 text-center shadow-card backdrop-blur-[16px] dark:border-white/10 dark:bg-surface-card-dark">
        {/* 404 텍스트 */}
        <div className="mb-4 font-display text-7xl font-extrabold text-vault-color">
          404
        </div>

        <h1 className="mb-2 font-display text-xl font-bold text-navy dark:text-gray-100">
          페이지를 찾을 수 없습니다
        </h1>

        <p className="mb-6 text-sm text-navy/60 dark:text-gray-400">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </p>

        <Link
          to={ROUTES.DASHBOARD}
          className="inline-block rounded-xl bg-vault-color px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-vault-color/90"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
