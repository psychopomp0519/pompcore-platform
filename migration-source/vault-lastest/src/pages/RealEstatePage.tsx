/**
 * @file RealEstatePage.tsx
 * @description 부동산 목록 페이지 (/real-estate)
 * @module pages/RealEstatePage
 */

import { useEffect, useState, useMemo, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useRealEstateStore } from '../stores/realEstateStore';
import type { RealEstateFormData } from '../types/realEstate.types';
import { PropertyCard } from '../components/realEstate/PropertyCard';
import { PropertyForm } from '../components/realEstate/PropertyForm';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { calcRealEstateSummary } from '../utils/realEstateCalculator';
import type { RealEstate, RealEstateSummary } from '../types/realEstate.types';

// ============================================================
// RealEstatePage
// ============================================================

/** 부동산 목록 페이지 */
export function RealEstatePage(): ReactNode {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const {
    properties,
    activeLeases,
    isLoading,
    error,
    loadProperties,
    addProperty,
    editProperty,
    removeProperty,
    clearError,
  } = useRealEstateStore();

  // ============================================================
  // UI 상태
  // ============================================================

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<RealEstate | null>(null);
  const [deletingProperty, setDeletingProperty] = useState<RealEstate | null>(null);

  // ============================================================
  // 데이터 로드
  // ============================================================

  useEffect(() => {
    if (user?.id) {
      loadProperties(user.id);
    }
  }, [user?.id, loadProperties]);

  // ============================================================
  // 활성 계약 맵 (propertyId → RealEstateLease)
  // ============================================================

  const activeLeaseMap = useMemo(() => {
    const map = new Map(activeLeases.map((l) => [l.realEstateId, l]));
    return map;
  }, [activeLeases]);

  // ============================================================
  // 요약 계산 (비용 없이 — 목록 뷰는 간략 표시)
  // ============================================================

  const getSummary = (property: RealEstate): RealEstateSummary => {
    const lease = activeLeaseMap.get(property.id) ?? null;
    return calcRealEstateSummary(property, lease, []);
  };

  // ============================================================
  // 핸들러
  // ============================================================

  const handleAdd = async (form: RealEstateFormData): Promise<void> => {
    if (!user?.id) return;
    await addProperty(user.id, form);
    setIsAddOpen(false);
  };

  const handleEdit = async (form: RealEstateFormData): Promise<void> => {
    if (!editingProperty) return;
    await editProperty(editingProperty.id, form);
    setEditingProperty(null);
  };

  const handleDelete = async (): Promise<void> => {
    if (!deletingProperty) return;
    await removeProperty(deletingProperty.id);
    setDeletingProperty(null);
  };

  // ============================================================
  // 렌더
  // ============================================================

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      {/* 페이지 헤더 */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-navy dark:text-gray-100">
          부동산
        </h1>
        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-vault-color px-4 py-2 text-sm font-semibold text-white hover:bg-vault-color/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-color focus-visible:ring-offset-2"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          물건 추가
        </button>
      </div>

      {/* 에러 */}
      {error && (
        <div className="mb-4 flex items-center justify-between rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
          <span>{error}</span>
          <button
            type="button"
            onClick={clearError}
            className="ml-2 font-semibold underline focus-visible:outline-none"
          >
            닫기
          </button>
        </div>
      )}

      {/* 로딩 */}
      {isLoading && (
        <div className="flex justify-center py-16">
          <LoadingSpinner />
        </div>
      )}

      {/* 빈 상태 */}
      {!isLoading && properties.length === 0 && (
        <EmptyState
          icon={
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          }
          title="등록된 부동산이 없습니다"
          description="소유하거나 임차 중인 부동산을 추가해 보세요."
          actionLabel="물건 추가"
          onAction={() => setIsAddOpen(true)}
        />
      )}

      {/* 물건 목록 */}
      {!isLoading && properties.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {properties.map((property) => {
            const activeLease = activeLeaseMap.get(property.id) ?? null;
            const summary = getSummary(property);
            return (
              <PropertyCard
                key={property.id}
                property={property}
                activeLease={activeLease}
                summary={summary}
                onClick={() => navigate(`/real-estate/${property.id}`)}
                onEdit={() => setEditingProperty(property)}
                onDelete={() => setDeletingProperty(property)}
              />
            );
          })}
        </div>
      )}

      {/* 추가 모달 */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="부동산 추가" maxWidth="lg">
        <PropertyForm onSubmit={handleAdd} onCancel={() => setIsAddOpen(false)} />
      </Modal>

      {/* 수정 모달 */}
      <Modal
        isOpen={editingProperty != null}
        onClose={() => setEditingProperty(null)}
        title="부동산 수정"
        maxWidth="lg"
      >
        {editingProperty && (
          <PropertyForm
            initial={{
              name: editingProperty.name,
              address: editingProperty.address ?? '',
              propertyType: editingProperty.propertyType,
              role: editingProperty.role,
              acquisitionDate: editingProperty.acquisitionDate ?? '',
              acquisitionPrice: editingProperty.acquisitionPrice?.toString() ?? '',
              currentValue: editingProperty.currentValue?.toString() ?? '',
              currency: editingProperty.currency,
              linkedAccountId: editingProperty.linkedAccountId,
              memo: editingProperty.memo ?? '',
            }}
            onSubmit={handleEdit}
            onCancel={() => setEditingProperty(null)}
          />
        )}
      </Modal>

      {/* 삭제 확인 */}
      <ConfirmDialog
        isOpen={deletingProperty != null}
        onClose={() => setDeletingProperty(null)}
        onConfirm={handleDelete}
        title="부동산 삭제"
        message={`"${deletingProperty?.name}"을(를) 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
      />
    </div>
  );
}
