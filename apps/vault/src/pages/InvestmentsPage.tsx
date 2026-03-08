/**
 * @file InvestmentsPage.tsx
 * @description 투자 포트폴리오 목록 페이지 (/investments)
 * @module pages/InvestmentsPage
 */

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useInvestmentStore } from '../stores/investmentStore';
import type { Portfolio, PortfolioFormData, PortfolioSummary } from '../types/investment.types';
import { PortfolioCard } from '../components/investment/PortfolioCard';
import { PortfolioForm } from '../components/investment/PortfolioForm';
import { Modal, ConfirmDialog, LoadingSpinner, EmptyState } from '@pompcore/ui';

// ============================================================
// InvestmentsPage
// ============================================================

/** 투자 포트폴리오 목록 페이지 */
export function InvestmentsPage(): ReactNode {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const {
    portfolios,
    isLoading,
    error,
    loadPortfolios,
    addPortfolio,
    editPortfolio,
    removePortfolio,
    clearError,
  } = useInvestmentStore();

  /* 모달 상태 */
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(null);
  const [deletingPortfolio, setDeletingPortfolio] = useState<Portfolio | null>(null);

  /* 초기 데이터 로드 */
  useEffect(() => {
    if (user?.id) loadPortfolios(user.id);
  }, [user?.id, loadPortfolios]);

  /* 포트폴리오별 요약 계산 (거래/스냅샷 없이 placeholder null) */
  const summaryMap = useMemo<Map<string, PortfolioSummary | null>>(() => {
    /* 목록 페이지에서는 각 포트폴리오의 상세 거래를 미로드 상태이므로 null 반환 */
    const map = new Map<string, PortfolioSummary | null>();
    portfolios.forEach((p) => map.set(p.id, null));
    return map;
  }, [portfolios]);

  // ============================================================
  // 핸들러
  // ============================================================

  async function handleCreate(form: PortfolioFormData): Promise<void> {
    if (!user?.id) return;
    await addPortfolio(user.id, form);
    if (!useInvestmentStore.getState().error) setIsCreateOpen(false);
  }

  async function handleEdit(form: PortfolioFormData): Promise<void> {
    if (!editingPortfolio) return;
    await editPortfolio(editingPortfolio.id, form);
    if (!useInvestmentStore.getState().error) setEditingPortfolio(null);
  }

  function handleDeleteConfirm(): void {
    if (!deletingPortfolio) return;
    removePortfolio(deletingPortfolio.id);
    setDeletingPortfolio(null);
  }

  function handleCardClick(portfolioId: string): void {
    navigate(`/investments/${portfolioId}`);
  }

  // ============================================================
  // 렌더링
  // ============================================================

  if (isLoading && portfolios.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      {/* 에러 배너 */}
      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <button
              type="button"
              onClick={clearError}
              className="text-red-400 hover:text-red-500"
              aria-label="에러 닫기"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-bold text-navy dark:text-gray-100">투자</h1>
        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-vault-color px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-vault-color/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-color"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          포트폴리오 추가
        </button>
      </div>

      {/* 포트폴리오 목록 */}
      {portfolios.length === 0 ? (
        <EmptyState
          icon={
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
            </svg>
          }
          title="포트폴리오가 없습니다"
          description="투자 포트폴리오를 추가하여 자산을 추적해보세요"
          actionLabel="포트폴리오 추가"
          onAction={() => setIsCreateOpen(true)}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {portfolios.map((portfolio) => (
            <PortfolioCard
              key={portfolio.id}
              portfolio={portfolio}
              summary={summaryMap.get(portfolio.id) ?? null}
              onClick={() => handleCardClick(portfolio.id)}
              onEdit={() => setEditingPortfolio(portfolio)}
              onDelete={() => setDeletingPortfolio(portfolio)}
            />
          ))}
        </div>
      )}

      {/* 포트폴리오 생성 모달 */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="포트폴리오 추가">
        <PortfolioForm
          onSubmit={handleCreate}
          onCancel={() => setIsCreateOpen(false)}
        />
      </Modal>

      {/* 포트폴리오 수정 모달 */}
      <Modal
        isOpen={editingPortfolio !== null}
        onClose={() => setEditingPortfolio(null)}
        title="포트폴리오 수정"
      >
        {editingPortfolio && (
          <PortfolioForm
            initial={{
              name: editingPortfolio.name,
              broker: editingPortfolio.broker ?? '',
              assetType: editingPortfolio.assetType,
              baseCurrency: editingPortfolio.baseCurrency,
              linkedAccountId: editingPortfolio.linkedAccountId,
              memo: editingPortfolio.memo ?? '',
            }}
            onSubmit={handleEdit}
            onCancel={() => setEditingPortfolio(null)}
          />
        )}
      </Modal>

      {/* 삭제 확인 다이얼로그 */}
      <ConfirmDialog
        isOpen={deletingPortfolio !== null}
        onClose={() => setDeletingPortfolio(null)}
        onConfirm={handleDeleteConfirm}
        title="포트폴리오 삭제"
        message={`"${deletingPortfolio?.name}" 포트폴리오를 삭제하시겠습니까? 관련 거래 기록도 함께 삭제됩니다.`}
        confirmText="삭제"
        isDangerous
      />
    </div>
  );
}
