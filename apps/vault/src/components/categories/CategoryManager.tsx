/**
 * @file CategoryManager.tsx
 * @description 카테고리 관리 메인 컴포넌트 (수입/지출 탭, CRUD, 즐겨찾기, 기본 설정)
 * @module components/categories/CategoryManager
 */

import { useState, useEffect, useMemo, memo, type ReactNode } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useCategoryStore } from '../../stores/categoryStore';
import type { Category, CategoryFormData } from '../../types/category.types';
import { GlassCard } from '../common/GlassCard';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { EmptyState } from '../common/EmptyState';
import { CategoryForm } from './CategoryForm';
import { CategoryItem } from './CategoryItem';
import { IconArrowDown, IconArrowUp } from '@pompcore/ui';

// ============================================================
// 상수
// ============================================================

const TABS = [
  { key: 'expense', label: '지출' },
  { key: 'income', label: '수입' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

// ============================================================
// CategoryManager
// ============================================================

/** 카테고리 관리 컴포넌트 */
function CategoryManagerInner(): ReactNode {
  const user = useAuthStore((s) => s.user);
  const {
    categories,
    isLoading,
    error,
    loadCategories,
    addCategory,
    editCategory,
    removeCategory,
    toggleFavorite,
    setDefault,
    reorder,
    clearError,
  } = useCategoryStore();

  const [activeTab, setActiveTab] = useState<TabKey>('expense');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  /* 카테고리 로드 */
  useEffect(() => {
    if (user?.id) {
      loadCategories(user.id);
    }
  }, [user?.id, loadCategories]);

  /* 탭별 필터링 + 정렬 (즐겨찾기 우선) */
  const filteredCategories = useMemo(() => {
    return categories
      .filter((c) => c.type === activeTab)
      .sort((a, b) => {
        if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;
        return a.sortOrder - b.sortOrder;
      });
  }, [categories, activeTab]);

  /* 핸들러 */
  function handleAdd(data: CategoryFormData): void {
    if (!user?.id) return;
    addCategory(user.id, data);
    setIsFormOpen(false);
  }

  function handleEdit(data: CategoryFormData): void {
    if (!editingCategory) return;
    editCategory(editingCategory.id, data);
    setEditingCategory(null);
  }

  function handleDelete(): void {
    if (!deletingCategory) return;
    removeCategory(deletingCategory.id);
    setDeletingCategory(null);
  }

  function handleSetDefault(categoryId: string): void {
    if (!user?.id) return;
    setDefault(user.id, categoryId, activeTab);
  }

  function handleMoveUp(categoryId: string): void {
    const idx = filteredCategories.findIndex((c) => c.id === categoryId);
    if (idx <= 0) return;
    const ids = filteredCategories.map((c) => c.id);
    [ids[idx - 1], ids[idx]] = [ids[idx], ids[idx - 1]];
    reorder(activeTab, ids);
  }

  function handleMoveDown(categoryId: string): void {
    const idx = filteredCategories.findIndex((c) => c.id === categoryId);
    if (idx < 0 || idx >= filteredCategories.length - 1) return;
    const ids = filteredCategories.map((c) => c.id);
    [ids[idx], ids[idx + 1]] = [ids[idx + 1], ids[idx]];
    reorder(activeTab, ids);
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4">
      {/* 에러 표시 */}
      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <button type="button" onClick={clearError} className="text-red-400 hover:text-red-500">
              &times;
            </button>
          </div>
        </div>
      )}

      {/* 탭 + 추가 버튼 */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 rounded-xl bg-navy/5 p-1 dark:bg-white/5">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-white text-navy shadow-sm dark:bg-white/10 dark:text-gray-100'
                  : 'text-navy/50 hover:text-navy/70 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-vault-color px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-vault-color/90"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          추가
        </button>
      </div>

      {/* 카테고리 목록 */}
      <GlassCard padding="sm">
        {filteredCategories.length === 0 ? (
          <EmptyState
            icon={activeTab === 'income' ? <IconArrowDown className="h-8 w-8" /> : <IconArrowUp className="h-8 w-8" />}
            title={`${activeTab === 'income' ? '수입' : '지출'} 카테고리가 없습니다`}
            description="카테고리를 추가해보세요"
            actionLabel="카테고리 추가"
            onAction={() => setIsFormOpen(true)}
          />
        ) : (
          <div className="space-y-1.5">
            {filteredCategories.map((category, index) => (
              <CategoryItem
                key={category.id}
                category={category}
                onEdit={setEditingCategory}
                onDelete={setDeletingCategory}
                onToggleFavorite={toggleFavorite}
                onSetDefault={handleSetDefault}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                isFirst={index === 0}
                isLast={index === filteredCategories.length - 1}
              />
            ))}
          </div>
        )}
      </GlassCard>

      {/* 생성 모달 */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="카테고리 추가"
      >
        <CategoryForm
          onSubmit={handleAdd}
          onCancel={() => setIsFormOpen(false)}
          fixedType={activeTab}
        />
      </Modal>

      {/* 수정 모달 */}
      <Modal
        isOpen={editingCategory !== null}
        onClose={() => setEditingCategory(null)}
        title="카테고리 수정"
      >
        {editingCategory && (
          <CategoryForm
            initialData={{
              name: editingCategory.name,
              type: editingCategory.type,
              icon: editingCategory.icon ?? '',
              isFavorite: editingCategory.isFavorite,
            }}
            onSubmit={handleEdit}
            onCancel={() => setEditingCategory(null)}
            fixedType={editingCategory.type}
          />
        )}
      </Modal>

      {/* 삭제 확인 */}
      <ConfirmDialog
        isOpen={deletingCategory !== null}
        onClose={() => setDeletingCategory(null)}
        onConfirm={handleDelete}
        title="카테고리 삭제"
        message={`"${deletingCategory?.name}" 카테고리를 삭제하시겠습니까? 휴지통에서 복원할 수 있습니다.`}
        confirmText="삭제"
        isDangerous
      />
    </div>
  );
}

export const CategoryManager = memo(CategoryManagerInner);
