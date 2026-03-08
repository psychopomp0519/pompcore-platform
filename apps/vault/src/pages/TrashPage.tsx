/**
 * @file TrashPage.tsx
 * @description 휴지통 페이지 (소프트 삭제 항목 통합 관리)
 * @module pages/TrashPage
 */

import { useState, useEffect, type ReactNode } from 'react';
import { useAuthStore } from '../stores/authStore';
import {
  fetchTrashItems,
  restoreItem,
  permanentlyDelete,
  TRASH_TYPE_LABELS,
  type TrashItem,
} from '../services/trash.service';
import { GlassCard, ConfirmDialog, LoadingSpinner, EmptyState, toUserMessage } from '@pompcore/ui';
import { IconBank, IconTag, IconReceipt, IconRepeat, IconGem, IconWallet, IconTrash } from '../components/icons/NavIcons';

// ============================================================
// 타입 아이콘 매핑
// ============================================================

const TYPE_ICONS: Record<TrashItem['type'], (props: { className?: string }) => ReactNode> = {
  account: IconBank,
  category: IconTag,
  transaction: IconReceipt,
  recurring: IconRepeat,
  savings: IconGem,
  budget: IconWallet,
};

// ============================================================
// TrashPage
// ============================================================

/** 휴지통 페이지 */
export function TrashPage(): ReactNode {
  const user = useAuthStore((s) => s.user);
  const [items, setItems] = useState<TrashItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingItem, setDeletingItem] = useState<TrashItem | null>(null);
  const [filterType, setFilterType] = useState<TrashItem['type'] | 'all'>('all');

  useEffect(() => {
    if (user?.id) loadItems(user.id);
  }, [user?.id]);

  async function loadItems(userId: string): Promise<void> {
    setIsLoading(true);
    try {
      const list = await fetchTrashItems(userId);
      setItems(list);
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRestore(item: TrashItem): Promise<void> {
    try {
      await restoreItem(item);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch (err) {
      setError(toUserMessage(err));
    }
  }

  async function handlePermanentDelete(): Promise<void> {
    if (!deletingItem) return;
    try {
      await permanentlyDelete(deletingItem);
      setItems((prev) => prev.filter((i) => i.id !== deletingItem.id));
      setDeletingItem(null);
    } catch (err) {
      setError(toUserMessage(err));
    }
  }

  const filteredItems = filterType === 'all'
    ? items
    : items.filter((i) => i.type === filterType);

  const typeCounts = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.type] = (acc[item.type] ?? 0) + 1;
    return acc;
  }, {});

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {error && (
        <div className="flex items-center justify-between rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)} className="ml-2 text-red-400 hover:text-red-600 dark:hover:text-red-300" aria-label="에러 닫기">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <h1 className="font-display text-xl font-bold text-navy dark:text-gray-100">휴지통</h1>

      {items.length === 0 ? (
        <EmptyState icon={<IconTrash className="h-8 w-8" />} title="휴지통이 비어있습니다" description="삭제된 항목이 없습니다." />
      ) : (
        <>
          {/* 필터 */}
          <div className="flex flex-wrap gap-1">
            <FilterButton
              label={`전체 (${items.length})`}
              isActive={filterType === 'all'}
              onClick={() => setFilterType('all')}
            />
            {Object.entries(typeCounts).map(([type, count]) => (
              <FilterButton
                key={type}
                label={`${TRASH_TYPE_LABELS[type as TrashItem['type']]} (${count})`}
                isActive={filterType === type}
                onClick={() => setFilterType(type as TrashItem['type'])}
              />
            ))}
          </div>

          {/* 목록 */}
          <div className="space-y-2">
            {filteredItems.map((item) => (
              <GlassCard key={`${item.type}-${item.id}`} padding="sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {(() => { const TypeIcon = TYPE_ICONS[item.type]; return <TypeIcon className="h-5 w-5" />; })()}
                    <div>
                      <div className="text-sm font-medium text-navy dark:text-gray-100">{item.name}</div>
                      <div className="flex items-center gap-2 text-xs text-navy/40 dark:text-gray-500">
                        <span>{TRASH_TYPE_LABELS[item.type]}</span>
                        <span>{item.deletedAt.slice(0, 10).replace(/-/g, '.')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleRestore(item)}
                      className="rounded-lg px-3 py-2.5 text-xs font-medium text-vault-color hover:bg-vault-color/10"
                    >
                      복원
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingItem(item)}
                      className="rounded-lg px-3 py-2.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                    >
                      영구 삭제
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </>
      )}

      <ConfirmDialog
        isOpen={deletingItem !== null}
        onClose={() => setDeletingItem(null)}
        onConfirm={handlePermanentDelete}
        title="영구 삭제"
        message={`"${deletingItem?.name}"을(를) 영구 삭제하시겠습니까? 복구할 수 없습니다.`}
        confirmText="영구 삭제"
        isDangerous
      />
    </div>
  );
}

// ============================================================
// 내부 컴포넌트
// ============================================================

function FilterButton({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}): ReactNode {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
        isActive
          ? 'bg-vault-color text-white'
          : 'bg-navy/5 text-navy/60 hover:bg-navy/10 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-white/10'
      }`}
    >
      {label}
    </button>
  );
}
