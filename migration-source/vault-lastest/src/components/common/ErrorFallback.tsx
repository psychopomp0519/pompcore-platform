/**
 * @file ErrorFallback.tsx
 * @description ErrorBoundary에서 사용하는 기본 폴백 UI
 * @module components/common/ErrorFallback
 */

import type { ReactNode } from 'react';

// ============================================================
// 타입
// ============================================================

interface ErrorFallbackProps {
  error: Error | null;
  onRetry: () => void;
}

// ============================================================
// ErrorFallback
// ============================================================

/** 에러 발생 시 표시되는 폴백 UI */
export function ErrorFallback({ error, onRetry }: ErrorFallbackProps): ReactNode {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-light dark:bg-surface-dark">
      <div className="mx-4 max-w-md rounded-2xl bg-white/80 p-8 shadow-glass backdrop-blur-[16px] dark:bg-surface-card-dark">
        <div className="mb-4 text-center text-4xl">&#x26A0;&#xFE0F;</div>
        <h1 className="mb-2 text-center font-display text-xl font-bold text-navy dark:text-gray-100">
          문제가 발생했습니다
        </h1>
        <p className="mb-6 text-center text-sm text-navy/60 dark:text-gray-400">
          예기치 않은 오류가 발생했습니다. 다시 시도해 주세요.
        </p>
        {error && (
          <details className="mb-6 rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
            <summary className="cursor-pointer text-sm font-medium text-red-600 dark:text-red-400">
              오류 상세 정보
            </summary>
            <pre className="mt-2 overflow-auto text-xs text-red-500 dark:text-red-300">
              {error.message}
            </pre>
          </details>
        )}
        <button
          type="button"
          onClick={onRetry}
          className="w-full rounded-xl bg-vault-color px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-vault-color/90 focus:outline-none focus:ring-2 focus:ring-vault-color/50"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}
