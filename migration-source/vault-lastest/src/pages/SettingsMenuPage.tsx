/**
 * @file SettingsMenuPage.tsx
 * @description 하단 탭 메뉴 커스터마이징 페이지
 * @module pages/SettingsMenuPage
 */

import { useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useSettingsStore } from '../stores/settingsStore';
import { GlassCard } from '../components/common/GlassCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ROUTES } from '../constants/routes';
import { TOAST_DURATION_MS } from '../constants/ui';
import {
  IconBank, IconReceipt, IconRepeat, IconGem, IconWallet,
  IconChart, IconMegaphone, IconHome, IconArrowLeft,
} from '../components/icons/NavIcons';

// ============================================================
// 상수
// ============================================================

/** 선택 가능한 탭 옵션 (중앙 dashboard는 고정) */
const TAB_OPTIONS = [
  { key: 'accounts', label: '통장', icon: IconBank },
  { key: 'transactions', label: '거래내역', icon: IconReceipt },
  { key: 'recurring', label: '정기결제', icon: IconRepeat },
  { key: 'savings', label: '예/적금', icon: IconGem },
  { key: 'budget', label: '예산', icon: IconWallet },
  { key: 'statistics', label: '통계', icon: IconChart },
  { key: 'announcements', label: '공지사항', icon: IconMegaphone },
] as const;

/** 탭 슬롯 수 (dashboard 제외 양쪽 2개씩) */
const SIDE_SLOT_COUNT = 2;

// ============================================================
// SettingsMenuPage
// ============================================================

/** 하단 탭 메뉴 설정 페이지 */
export function SettingsMenuPage(): ReactNode {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { settings, isLoading, error, loadSettings, updateTabOrder, clearError } = useSettingsStore();

  const [saved, setSaved] = useState(false);
  const [tabsOverride, setTabsOverride] = useState<{ left: string[]; right: string[] } | null>(null);

  useEffect(() => {
    if (user?.id) loadSettings(user.id);
  }, [user?.id, loadSettings]);

  /* settings에서 탭 순서 파생 */
  const defaultOrder = settings?.tabOrder?.filter((t) => t !== 'dashboard') ?? [];
  const leftTabs = tabsOverride?.left ?? defaultOrder.slice(0, SIDE_SLOT_COUNT);
  const rightTabs = tabsOverride?.right ?? defaultOrder.slice(SIDE_SLOT_COUNT, SIDE_SLOT_COUNT * 2);

  function setLeftTabs(fn: (prev: string[]) => string[]): void {
    setTabsOverride((prev) => ({
      left: fn(prev?.left ?? leftTabs),
      right: prev?.right ?? rightTabs,
    }));
  }
  function setRightTabs(fn: (prev: string[]) => string[]): void {
    setTabsOverride((prev) => ({
      left: prev?.left ?? leftTabs,
      right: fn(prev?.right ?? rightTabs),
    }));
  }

  const selectedKeys = new Set([...leftTabs, ...rightTabs]);

  function handleToggle(key: string): void {
    if (selectedKeys.has(key)) {
      setLeftTabs((prev) => prev.filter((k) => k !== key));
      setRightTabs((prev) => prev.filter((k) => k !== key));
    } else {
      const totalSelected = leftTabs.length + rightTabs.length;
      if (totalSelected >= SIDE_SLOT_COUNT * 2) return;
      if (leftTabs.length < SIDE_SLOT_COUNT) {
        setLeftTabs((prev) => [...prev, key]);
      } else {
        setRightTabs((prev) => [...prev, key]);
      }
    }
  }

  function handleSave(): void {
    if (!user?.id) return;
    const order = [...leftTabs, 'dashboard', ...rightTabs];
    updateTabOrder(user.id, order);
    setSaved(true);
    setTimeout(() => setSaved(false), TOAST_DURATION_MS);
  }

  if (isLoading && !settings) {
    return <LoadingSpinner />;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      {/* 헤더 */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(ROUTES.SETTINGS)}
          className="rounded-lg p-1.5 text-navy/60 hover:bg-navy/5 dark:text-gray-400 dark:hover:bg-white/5"
          aria-label="설정으로 돌아가기"
        >
          <IconArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-display text-xl font-bold text-navy dark:text-gray-100">메뉴 설정</h1>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <button type="button" onClick={clearError} className="text-red-400 hover:text-red-500" aria-label="에러 닫기">&times;</button>
          </div>
        </div>
      )}

      <p className="text-xs text-navy/50 dark:text-gray-400">
        하단 탭에 표시할 메뉴 4개를 선택하세요. 중앙(홈)은 고정입니다.
      </p>

      {/* 미리보기 */}
      <GlassCard padding="md">
        <div className="mb-2 text-xs font-medium text-navy/50 dark:text-gray-400">미리보기</div>
        <div className="flex items-center justify-around rounded-xl bg-navy/5 py-3 dark:bg-white/5">
          {leftTabs.map((key) => {
            const opt = TAB_OPTIONS.find((o) => o.key === key);
            return (
              <div key={key} className="flex flex-col items-center gap-0.5">
                {opt && <opt.icon className="h-5 w-5 text-navy/60 dark:text-gray-400" />}
                <span className="text-xs text-navy/60 dark:text-gray-400">{opt?.label}</span>
              </div>
            );
          })}
          <div className="flex flex-col items-center gap-0.5">
            <IconHome className="h-5 w-5 text-vault-color" />
            <span className="text-xs font-semibold text-vault-color">홈</span>
          </div>
          {rightTabs.map((key) => {
            const opt = TAB_OPTIONS.find((o) => o.key === key);
            return (
              <div key={key} className="flex flex-col items-center gap-0.5">
                {opt && <opt.icon className="h-5 w-5 text-navy/60 dark:text-gray-400" />}
                <span className="text-xs text-navy/60 dark:text-gray-400">{opt?.label}</span>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* 선택 목록 */}
      <GlassCard padding="md">
        <div className="mb-3 text-xs font-medium text-navy/50 dark:text-gray-400">
          메뉴 선택 ({leftTabs.length + rightTabs.length}/{SIDE_SLOT_COUNT * 2})
        </div>
        <div className="space-y-2">
          {TAB_OPTIONS.map((opt) => {
            const isSelected = selectedKeys.has(opt.key);
            const isFull = leftTabs.length + rightTabs.length >= SIDE_SLOT_COUNT * 2;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => handleToggle(opt.key)}
                disabled={!isSelected && isFull}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                  isSelected
                    ? 'bg-vault-color/10 text-vault-color dark:bg-vault-color/20'
                    : 'text-navy/70 hover:bg-navy/5 disabled:opacity-30 dark:text-gray-400 dark:hover:bg-white/5'
                }`}
              >
                <opt.icon className="h-5 w-5 shrink-0" />
                <span className="flex-1 text-left font-medium">{opt.label}</span>
                {isSelected && (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </GlassCard>

      {/* 저장 */}
      <div className="flex items-center justify-end gap-3">
        {saved && <span className="text-xs text-vault-color">저장됨</span>}
        <button
          type="button"
          onClick={handleSave}
          disabled={leftTabs.length + rightTabs.length !== SIDE_SLOT_COUNT * 2}
          className="rounded-xl bg-vault-color px-6 py-2.5 text-sm font-semibold text-white hover:bg-vault-color/90 disabled:opacity-50"
        >
          저장
        </button>
      </div>
    </div>
  );
}
