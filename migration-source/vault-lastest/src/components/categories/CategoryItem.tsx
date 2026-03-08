/**
 * @file CategoryItem.tsx
 * @description 개별 카테고리 항목 컴포넌트
 * @module components/categories/CategoryItem
 */

import type { ReactNode } from 'react';
import type { Category } from '../../types/category.types';

// ============================================================
// 타입
// ============================================================

interface CategoryItemProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onToggleFavorite: (categoryId: string) => void;
  onSetDefault: (categoryId: string) => void;
  onMoveUp?: (categoryId: string) => void;
  onMoveDown?: (categoryId: string) => void;
  isFirst?: boolean;
  isLast?: boolean;
}

// ============================================================
// CategoryItem
// ============================================================

/** 카테고리 항목 */
export function CategoryItem({
  category,
  onEdit,
  onDelete,
  onToggleFavorite,
  onSetDefault,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: CategoryItemProps): ReactNode {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/60 px-3 py-2.5 backdrop-blur-sm dark:bg-white/5">
      {/* 아이콘 */}
      <span className="text-xl">{category.icon ?? '📂'}</span>

      {/* 이름 + 배지 */}
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span className="truncate text-sm font-medium text-navy dark:text-gray-100">
          {category.name}
        </span>
        {category.isDefault && (
          <span className="shrink-0 rounded-md bg-vault-color/15 px-1.5 py-0.5 text-xs font-semibold text-vault-color">
            기본
          </span>
        )}
        {category.isFavorite && (
          <span className="shrink-0 text-xs text-amber-500" title="즐겨찾기">
            ★
          </span>
        )}
      </div>

      {/* 액션 버튼 */}
      <div className="flex shrink-0 items-center gap-1">
        {/* 순서 변경 */}
        {onMoveUp && !isFirst && (
          <button
            type="button"
            onClick={() => onMoveUp(category.id)}
            className="rounded-lg p-1.5 text-navy/30 transition-colors hover:bg-navy/5 hover:text-navy/60 dark:text-gray-500 dark:hover:bg-white/5 dark:hover:text-gray-300"
            title="위로 이동"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          </button>
        )}
        {onMoveDown && !isLast && (
          <button
            type="button"
            onClick={() => onMoveDown(category.id)}
            className="rounded-lg p-1.5 text-navy/30 transition-colors hover:bg-navy/5 hover:text-navy/60 dark:text-gray-500 dark:hover:bg-white/5 dark:hover:text-gray-300"
            title="아래로 이동"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}

        {/* 기본 설정 */}
        {!category.isDefault && (
          <button
            type="button"
            onClick={() => onSetDefault(category.id)}
            className="rounded-lg p-1.5 text-navy/30 transition-colors hover:bg-navy/5 hover:text-navy/60 dark:text-gray-500 dark:hover:bg-white/5 dark:hover:text-gray-300"
            title="기본 카테고리로 설정"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        )}

        {/* 즐겨찾기 토글 */}
        <button
          type="button"
          onClick={() => onToggleFavorite(category.id)}
          className={`rounded-lg p-1.5 transition-colors ${
            category.isFavorite
              ? 'text-amber-500 hover:text-amber-600'
              : 'text-navy/30 hover:bg-navy/5 hover:text-navy/60 dark:text-gray-500 dark:hover:bg-white/5 dark:hover:text-gray-300'
          }`}
          title={category.isFavorite ? '즐겨찾기 해제' : '즐겨찾기 설정'}
        >
          <svg className="h-4 w-4" fill={category.isFavorite ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </button>

        {/* 수정 */}
        <button
          type="button"
          onClick={() => onEdit(category)}
          className="rounded-lg p-1.5 text-navy/30 transition-colors hover:bg-navy/5 hover:text-navy/60 dark:text-gray-500 dark:hover:bg-white/5 dark:hover:text-gray-300"
          title="수정"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>

        {/* 삭제 */}
        <button
          type="button"
          onClick={() => onDelete(category)}
          className="rounded-lg p-1.5 text-navy/30 transition-colors hover:bg-red-50 hover:text-red-500 dark:text-gray-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
          title="삭제"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
