/**
 * @file EmptyState — Empty data state display component
 * @module @pompcore/ui/EmptyState
 */

import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

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
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-app-accent/10 text-app-accent dark:bg-app-accent/20" aria-hidden="true">
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
          className="rounded-xl bg-app-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-app-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent focus-visible:ring-offset-2"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
