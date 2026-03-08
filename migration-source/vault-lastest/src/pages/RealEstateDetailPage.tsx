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
import { LeaseCard } from '../components/realEstate/LeaseCard';
import { LeaseForm } from '../components/realEstate/LeaseForm';
import { ExpenseList } from '../components/realEstate/ExpenseList';
import { ExpenseForm } from '../components/realEstate/ExpenseForm';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import {
  calcRealEstateSummary,
  calcCapitalGainRate,
} from '../utils/realEstateCalculator';

// ============================================================
// 상수
// ============================================================

const PROPERTY_TYPE_LABEL: Record<string, string> = {
  apartment: '아파트',
  house: '단독주택',
  villa: '빌라',
  commercial: '상가',
  land: '토지',
  other: '기타',
};

const ROLE_LABEL: Record<string, string> = {
  owner: '소유',
  tenant: '임차',
};

// ============================================================
// 서브 컴포넌트 — 요약 카드
// ============================================================

interface SummaryCardProps {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}

function SummaryCard({ label, value, sub, highlight }: SummaryCardProps): ReactNode {
  return (
    <div className="rounded-2xl bg-white/60 p-4 backdrop-blur dark:bg-navy/40">
      <p className="mb-1 text-xs font-semibold text-navy/60 dark:text-gray-400">{label}</p>
      <p className={`tabular-nums text-lg font-bold ${highlight ? 'text-vault-color' : 'text-navy dark:text-gray-100'}`}>
        {value}
      </p>
      {sub && <p className="mt-0.5 text-xs text-navy/50 dark:text-gray-500">{sub}</p>}
    </div>
  );
}

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
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-vault-color/10 px-2.5 py-0.5 text-xs font-semibold text-vault-color dark:bg-vault-color/20">
              {PROPERTY_TYPE_LABEL[property.propertyType] ?? property.propertyType}
            </span>
            <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-semibold text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
              {ROLE_LABEL[property.role] ?? property.role}
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold text-navy dark:text-gray-100">
            {property.name}
          </h1>
          {property.address && (
            <p className="mt-1 text-sm text-navy/60 dark:text-gray-400">{property.address}</p>
          )}
        </div>

        {/* 편집 / 삭제 */}
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => setIsEditOpen(true)}
            className="rounded-xl border border-navy/10 px-3 py-1.5 text-sm font-semibold text-navy/70 hover:bg-navy/5 dark:border-white/10 dark:text-gray-400 dark:hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-color"
          >
            편집
          </button>
          <button
            type="button"
            onClick={() => setIsDeleteOpen(true)}
            className="rounded-xl border border-red-200 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-color"
          >
            삭제
          </button>
        </div>
      </div>

      {/* ── 요약 카드 그리드 ── */}
      {summary && (
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {/* 현재가 */}
          <SummaryCard
            label="현재가"
            value={property.currentValue != null
              ? `${property.currentValue.toLocaleString('ko-KR')} ${property.currency}`
              : '-'}
          />

          {/* 취득가 */}
          <SummaryCard
            label={property.role === 'owner' ? '취득가' : '보증금'}
            value={property.acquisitionPrice != null
              ? `${property.acquisitionPrice.toLocaleString('ko-KR')} ${property.currency}`
              : '-'}
          />

          {/* 자본 수익률 (소유자 + 두 값 모두 있을 때) */}
          {property.role === 'owner' && capitalGainRate != null && (
            <SummaryCard
              label="자본 수익률"
              value={`${capitalGainRate >= 0 ? '+' : ''}${capitalGainRate.toFixed(2)}%`}
              highlight={capitalGainRate > 0}
            />
          )}

          {/* 임대 수익률 */}
          {summary.annualRentalYield != null && (
            <SummaryCard
              label="임대 수익률"
              value={`${summary.annualRentalYield.toFixed(2)}%`}
              sub="연 순수익률"
              highlight
            />
          )}

          {/* 전세 수익률 */}
          {summary.jeonseYield != null && (
            <SummaryCard
              label="전세 수익률"
              value={`${summary.jeonseYield.toFixed(2)}%`}
              sub="보증금 / 현재가"
              highlight
            />
          )}

          {/* 계약 만료 D-day */}
          {summary.daysUntilLeaseEnd != null && (
            <SummaryCard
              label="계약 만료"
              value={
                summary.daysUntilLeaseEnd === 0
                  ? '오늘 만료'
                  : summary.daysUntilLeaseEnd < 0
                    ? `${Math.abs(summary.daysUntilLeaseEnd)}일 초과`
                    : `D-${summary.daysUntilLeaseEnd}`
              }
              sub={activeLease?.endDate ?? undefined}
              highlight={summary.daysUntilLeaseEnd >= 0 && summary.daysUntilLeaseEnd <= 30}
            />
          )}
        </div>
      )}

      {/* ── 계약 섹션 ── */}
      <section className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-navy dark:text-gray-100">계약</h2>
          <button
            type="button"
            onClick={() => setIsLeaseOpen(true)}
            className="flex items-center gap-1 rounded-xl bg-vault-color/10 px-3 py-1.5 text-sm font-semibold text-vault-color hover:bg-vault-color/20 dark:bg-vault-color/20 dark:hover:bg-vault-color/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-color"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            계약 추가
          </button>
        </div>

        {/* 활성 계약 */}
        {activeLease ? (
          <div className="mb-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-navy/50 dark:text-gray-500">
              활성 계약
            </p>
            <LeaseCard lease={activeLease} onClose={handleCloseLease} />
          </div>
        ) : (
          <p className="mb-3 text-sm text-navy/50 dark:text-gray-500">활성 계약이 없습니다.</p>
        )}

        {/* 종료된 계약 */}
        {inactiveLeases.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-navy/50 dark:text-gray-500">
              종료된 계약
            </p>
            <div className="space-y-2">
              {inactiveLeases.map((lease) => (
                <LeaseCard key={lease.id} lease={lease} onClose={handleCloseLease} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── 비용 섹션 ── */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-navy dark:text-gray-100">비용</h2>
          <button
            type="button"
            onClick={() => setIsExpenseOpen(true)}
            className="flex items-center gap-1 rounded-xl bg-vault-color/10 px-3 py-1.5 text-sm font-semibold text-vault-color hover:bg-vault-color/20 dark:bg-vault-color/20 dark:hover:bg-vault-color/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-color"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            비용 추가
          </button>
        </div>

        <div className="rounded-2xl bg-white/60 backdrop-blur dark:bg-navy/40">
          <ExpenseList
            expenses={expenses}
            onDelete={(expId) => setDeletingExpenseId(expId)}
          />
        </div>
      </section>

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
