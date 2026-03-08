/**
 * @file EmptyState.tsx
 * @description 데이터 없음 상태를 표시하는 컴포넌트
 * @module components/common/EmptyState
 */

import type { ReactNode } from 'react';

// ============================================================
// 타입
// ============================================================

interface EmptyStateProps {
  /** 아이콘 (ReactNode) */
  icon?: ReactNode;
  /** 제목 */
  title: string;
  /** 설명 */
  description?: string;
  /** CTA 버튼 텍스트 */
  actionLabel?: string;
  /** CTA 버튼 클릭 핸들러 */
  onAction?: () => void;
}

// ============================================================
// EmptyState
// ============================================================

/** 데이터 없음 상태 */
export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps): ReactNode {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      {icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-vault-color/10 text-vault-color dark:bg-vault-color/20" aria-hidden="true">
          {icon}
        </div>
      )}
      <h3 className="mb-1 font-display text-lg font-bold text-navy dark:text-gray-100">
        {title}
      </h3>
      {description && (
        <p className="mb-4 text-sm text-navy/60 dark:text-gray-400">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="rounded-xl bg-vault-color px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-vault-color/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-color focus-visible:ring-offset-2"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
