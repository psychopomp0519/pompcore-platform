/**
 * @file CategoryForm.tsx
 * @description 카테고리 생성/수정 폼 컴포넌트
 * @module components/categories/CategoryForm
 */

import { useState, memo, type ReactNode, type FormEvent } from 'react';
import type { CategoryFormData } from '../../types/category.types';
import { INCOME_ICON_SET, EXPENSE_ICON_SET, renderCategoryIcon } from '../icons/CategoryIcons';

// ============================================================
// 타입
// ============================================================

interface CategoryFormProps {
  /** 수정 시 초기값 */
  initialData?: CategoryFormData;
  /** 폼 제출 */
  onSubmit: (data: CategoryFormData) => void;
  /** 취소 */
  onCancel: () => void;
  /** 카테고리 타입 고정 (탭에서 사용) */
  fixedType?: 'income' | 'expense';
}

// ============================================================
// CategoryForm
// ============================================================

/** 카테고리 생성/수정 폼 */
function CategoryFormInner({
  initialData,
  onSubmit,
  onCancel,
  fixedType,
}: CategoryFormProps): ReactNode {
  const [name, setName] = useState(initialData?.name ?? '');
  const [type, setType] = useState<'income' | 'expense'>(fixedType ?? initialData?.type ?? 'expense');
  const [icon, setIcon] = useState(initialData?.icon ?? '');
  const [isFavorite, setIsFavorite] = useState(initialData?.isFavorite ?? false);

  const isEditing = initialData !== undefined;
  const iconSet = type === 'income' ? INCOME_ICON_SET : EXPENSE_ICON_SET;

  function handleSubmit(e: FormEvent): void {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), type, icon: icon || iconSet[0].key, isFavorite });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 카테고리 타입 */}
      {!fixedType && (
        <div>
          <label className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">
            유형
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                type === 'income'
                  ? 'bg-blue-500 text-white'
                  : 'bg-navy/5 text-navy/60 dark:bg-white/5 dark:text-gray-400'
              }`}
            >
              수입
            </button>
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                type === 'expense'
                  ? 'bg-red-500 text-white'
                  : 'bg-navy/5 text-navy/60 dark:bg-white/5 dark:text-gray-400'
              }`}
            >
              지출
            </button>
          </div>
        </div>
      )}

      {/* 이름 */}
      <div>
        <label htmlFor="category-name" className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">
          이름
        </label>
        <input
          id="category-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="카테고리 이름"
          maxLength={20}
          className="w-full rounded-xl border border-navy/10 bg-white/80 px-3 py-2.5 text-sm text-navy placeholder-navy/30 backdrop-blur-sm focus:border-vault-color focus:outline-none focus:ring-1 focus:ring-vault-color dark:border-white/10 dark:bg-white/5 dark:text-gray-100 dark:placeholder-gray-500"
          autoFocus
        />
      </div>

      {/* 아이콘 선택 */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">
          아이콘
        </label>
        <div className="flex flex-wrap gap-2">
          {iconSet.map((entry) => (
            <button
              key={entry.key}
              type="button"
              onClick={() => setIcon(entry.key)}
              title={entry.label}
              className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
                icon === entry.key
                  ? 'bg-vault-color/20 text-vault-color ring-2 ring-vault-color'
                  : 'bg-navy/5 text-navy/50 hover:bg-navy/10 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-white/10'
              }`}
            >
              {renderCategoryIcon(entry.key, 'h-5 w-5')}
            </button>
          ))}
        </div>
      </div>

      {/* 즐겨찾기 */}
      <label className="flex items-center gap-2 text-sm text-navy/70 dark:text-gray-300">
        <input
          type="checkbox"
          checked={isFavorite}
          onChange={(e) => setIsFavorite(e.target.checked)}
          className="rounded border-navy/20 text-vault-color focus:ring-vault-color dark:border-white/20"
        />
        즐겨찾기로 설정
      </label>

      {/* 버튼 */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl px-4 py-2.5 text-sm font-medium text-navy/70 transition-colors hover:bg-navy/5 dark:text-gray-400 dark:hover:bg-white/5"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={!name.trim()}
          className="rounded-xl bg-vault-color px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-vault-color/90 disabled:opacity-50"
        >
          {isEditing ? '수정' : '추가'}
        </button>
      </div>
    </form>
  );
}

export const CategoryForm = memo(CategoryFormInner);
