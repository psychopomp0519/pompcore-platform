/**
 * @file RealEstateDetailPage.tsx
 * @description 부동산 상세 페이지 (/real-estate/:id)
 * @module pages/RealEstateDetailPage
 */

import { useEffect, useState, useMemo, type ReactNode } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useRealEstateStore } from '../stores/realEstateStore';
import type { RealEstate, RealEstateFormData, LeaseFormData, ExpenseFormData } from '../types/realEstate.types';
import { PropertyForm } from '../components/realEstate/PropertyForm';
import { LeaseForm } from '../components/realEstate/LeaseForm';
import { ExpenseForm } from '../components/realEstate/ExpenseForm';
import { PropertyHeader } from '../components/realEstate/PropertyHeader';
import { SummaryGrid } from '../components/realEstate/SummaryGrid';
import { LeasesSection } from '../components/realEstate/LeasesSection';
import { ExpensesSection } from '../components/realEstate/ExpensesSection';
import { Modal, ConfirmDialog, LoadingSpinner } from '@pompcore/ui';
import {
  calcRealEstateSummary,
  calcCapitalGainRate,
} from '../utils/realEstateCalculator';

// ============================================================
// RealEstateDetailPage
// ============================================================

/** 부동산 상세 페이지 */
export function RealEstateDetailPage(): ReactNode {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const {
    properties,
    leases,
    expenses,
    isLoading,
    error,
    loadPropertyDetail,
    editProperty,
    removeProperty,
    addLease,
    closeLease,
    addExpense,
    removeExpense,
    clearError,
  } = useRealEstateStore();

  // ============================================================
  // UI 상태
  // ============================================================

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isLeaseOpen, setIsLeaseOpen] = useState(false);
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);
  const [deletingExpenseId, setDeletingExpenseId] = useState<string | null>(null);

  // ============================================================
  // 데이터 로드
  // ============================================================

  useEffect(() => {
    if (id) {
      loadPropertyDetail(id);
    }
  }, [id, loadPropertyDetail]);

  // ============================================================
  // 파생 데이터
  // ============================================================

  /** 현재 물건 (store의 properties에서 조회, 없으면 null) */
  const property: RealEstate | null = useMemo(
    () => properties.find((p) => p.id === id) ?? null,
    [properties, id],
  );

  const activeLease = useMemo(
    () => leases.find((l) => l.isActive) ?? null,
    [leases],
  );

  const inactiveLeases = useMemo(
    () => leases.filter((l) => !l.isActive),
    [leases],
  );

  const summary = useMemo(
    () => (property ? calcRealEstateSummary(property, activeLease, expenses) : null),
    [property, activeLease, expenses],
  );

  const capitalGainRate = useMemo(() => {
    if (!property?.currentValue || !property.acquisitionPrice) return null;
    return calcCapitalGainRate(property.currentValue, property.acquisitionPrice);
  }, [property]);

  // ============================================================
  // 핸들러
  // ============================================================

  const handleEdit = async (form: RealEstateFormData): Promise<void> => {
    if (!id) return;
    await editProperty(id, form);
    setIsEditOpen(false);
  };

  const handleDelete = async (): Promise<void> => {
    if (!id) return;
    await removeProperty(id);
    navigate('/real-estate');
  };

  const handleAddLease = async (form: LeaseFormData): Promise<void> => {
    if (!user?.id || !id) return;
    await addLease(user.id, id, form);
    setIsLeaseOpen(false);
  };

  const handleCloseLease = async (leaseId: string): Promise<void> => {
    await closeLease(leaseId);
  };

  const handleAddExpense = async (form: ExpenseFormData): Promise<void> => {
    if (!user?.id || !id) return;
    await addExpense(user.id, id, form);
    setIsExpenseOpen(false);
  };

  const handleDeleteExpense = async (): Promise<void> => {
    if (!deletingExpenseId || !id) return;
    await removeExpense(deletingExpenseId);
    setDeletingExpenseId(null);
  };

  // ============================================================
  // 로딩 / 없음 처리
  // ============================================================

  if (isLoading && !property) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-navy/60 dark:text-gray-400">부동산 정보를 찾을 수 없습니다.</p>
        <button
          type="button"
          onClick={() => navigate('/real-estate')}
          className="mt-4 rounded-xl bg-vault-color px-5 py-2 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-color"
        >
          목록으로
        </button>
      </div>
    );
  }

  // ============================================================
  // 렌더
  // ============================================================

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      {/* 뒤로 가기 */}
      <button
        type="button"
        onClick={() => navigate('/real-estate')}
        className="mb-4 flex items-center gap-1.5 text-sm text-navy/60 hover:text-navy dark:text-gray-400 dark:hover:text-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-color rounded-lg px-1 py-0.5"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        목록
      </button>

      {/* 에러 배너 */}
      {error && (
        <div className="mb-4 flex items-center justify-between rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
          <span>{error}</span>
          <button type="button" onClick={clearError} className="ml-2 font-semibold underline focus-visible:outline-none">
            닫기
          </button>
        </div>
      )}

      {/* 물건 헤더 */}
      <PropertyHeader
        property={property}
        onEdit={() => setIsEditOpen(true)}
        onDelete={() => setIsDeleteOpen(true)}
      />

      {/* 요약 카드 그리드 */}
      {summary && (
        <SummaryGrid
          property={property}
          summary={summary}
          capitalGainRate={capitalGainRate}
          activeLease={activeLease}
        />
      )}

      {/* 계약 섹션 */}
      <LeasesSection
        activeLease={activeLease}
        inactiveLeases={inactiveLeases}
        onAddLease={() => setIsLeaseOpen(true)}
        onCloseLease={handleCloseLease}
      />

      {/* 비용 섹션 */}
      <ExpensesSection
        expenses={expenses}
        onAddExpense={() => setIsExpenseOpen(true)}
        onDeleteExpense={(expId) => setDeletingExpenseId(expId)}
      />

      {/* ── 모달 ── */}

      {/* 편집 모달 */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="부동산 수정" maxWidth="lg">
        <PropertyForm
          initial={{
            name: property.name,
            address: property.address ?? '',
            propertyType: property.propertyType,
            role: property.role,
            acquisitionDate: property.acquisitionDate ?? '',
            acquisitionPrice: property.acquisitionPrice?.toString() ?? '',
            currentValue: property.currentValue?.toString() ?? '',
            currency: property.currency,
            linkedAccountId: property.linkedAccountId,
            memo: property.memo ?? '',
          }}
          onSubmit={handleEdit}
          onCancel={() => setIsEditOpen(false)}
        />
      </Modal>

      {/* 계약 추가 모달 */}
      <Modal isOpen={isLeaseOpen} onClose={() => setIsLeaseOpen(false)} title="계약 추가">
        <LeaseForm onSubmit={handleAddLease} onCancel={() => setIsLeaseOpen(false)} />
      </Modal>

      {/* 비용 추가 모달 */}
      <Modal isOpen={isExpenseOpen} onClose={() => setIsExpenseOpen(false)} title="비용 추가">
        <ExpenseForm
          propertyCurrency={property.currency}
          onSubmit={handleAddExpense}
          onCancel={() => setIsExpenseOpen(false)}
        />
      </Modal>

      {/* 삭제 확인 다이얼로그 */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="부동산 삭제"
        message={`"${property.name}"을(를) 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
      />

      {/* 비용 삭제 확인 */}
      <ConfirmDialog
        isOpen={deletingExpenseId != null}
        onClose={() => setDeletingExpenseId(null)}
        onConfirm={handleDeleteExpense}
        title="비용 삭제"
        message="이 비용을 삭제하시겠습니까?"
      />
    </div>
  );
}
