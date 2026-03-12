/**
 * @file SettingsPreferencesPage.tsx
 * @description 환경설정 페이지 (주 통화, 정기결제 단위)
 * @module pages/SettingsPreferencesPage
 */

import { useState, useEffect, type ReactNode, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdUnit } from '@pompcore/ui';
import { useAuthStore } from '../stores/authStore';
import { useSettingsStore } from '../stores/settingsStore';
import { GlassCard, LoadingSpinner } from '@pompcore/ui';
import { ROUTES } from '../constants/routes';
import { CURRENCIES } from '../constants/currencies';
import { INTERVAL_LABELS } from '../constants/intervals';
import { TOAST_DURATION_MS } from '../constants/ui';
import { IconArrowLeft } from '@pompcore/ui';

// ============================================================
// 상수
// ============================================================

const AVG_PERIOD_OPTIONS: ('day' | 'week' | 'month' | 'year')[] = ['day', 'week', 'month', 'year'];

// ============================================================
// SettingsPreferencesPage
// ============================================================

/** 환경설정 페이지 */
export function SettingsPreferencesPage(): ReactNode {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { settings, isLoading, error, loadSettings, updatePreferences, updateNotificationEnabled, clearError } = useSettingsStore();

  const [currencyOverride, setCurrencyOverride] = useState<string | null>(null);
  const [periodOverride, setPeriodOverride] = useState<('day' | 'week' | 'month' | 'year') | null>(null);
  const [saved, setSaved] = useState(false);

  const primaryCurrency = currencyOverride ?? settings?.primaryCurrency ?? 'KRW';
  const recurringAvgPeriod = periodOverride ?? settings?.recurringAvgPeriod ?? 'month';

  useEffect(() => {
    if (user?.id) loadSettings(user.id);
  }, [user?.id, loadSettings]);

  function handleSubmit(e: FormEvent): void {
    e.preventDefault();
    if (!user?.id) return;
    updatePreferences(user.id, { primaryCurrency, recurringAvgPeriod });
    setSaved(true);
    setTimeout(() => setSaved(false), TOAST_DURATION_MS);
  }

  if (isLoading && !settings) {
    return <LoadingSpinner />;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(ROUTES.SETTINGS)}
          className="rounded-lg p-1.5 text-navy/60 hover:bg-navy/5 dark:text-gray-400 dark:hover:bg-white/5"
          aria-label="설정으로 돌아가기"
        >
          <IconArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-display text-xl font-bold text-navy dark:text-gray-100">환경설정</h1>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <button type="button" onClick={clearError} className="text-red-400 hover:text-red-500" aria-label="에러 닫기">&times;</button>
          </div>
        </div>
      )}

      <GlassCard padding="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 주 사용 통화 */}
          <div>
            <label htmlFor="pref-currency" className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">
              주 사용 통화
            </label>
            <select
              id="pref-currency"
              value={primaryCurrency}
              onChange={(e) => setCurrencyOverride(e.target.value)}
              className="w-full rounded-xl border border-navy/10 bg-white/80 px-3 py-2.5 text-sm text-navy focus:border-vault-color focus:outline-none focus:ring-1 focus:ring-vault-color dark:border-white/10 dark:bg-white/5 dark:text-gray-100"
            >
              {Object.values(CURRENCIES).map((cur) => (
                <option key={cur.code} value={cur.code}>
                  {cur.symbol} {cur.name} ({cur.code})
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-navy/40 dark:text-gray-500">
              통계와 대시보드에서 기본으로 표시되는 통화입니다.
            </p>
          </div>

          {/* 정기결제 평균 단위 */}
          <div>
            <label htmlFor="pref-avg-period" className="mb-1.5 block text-xs font-medium text-navy/60 dark:text-gray-400">
              정기결제 평균 단위
            </label>
            <select
              id="pref-avg-period"
              value={recurringAvgPeriod}
              onChange={(e) => setPeriodOverride(e.target.value as typeof recurringAvgPeriod)}
              className="w-full rounded-xl border border-navy/10 bg-white/80 px-3 py-2.5 text-sm text-navy focus:border-vault-color focus:outline-none focus:ring-1 focus:ring-vault-color dark:border-white/10 dark:bg-white/5 dark:text-gray-100"
            >
              {AVG_PERIOD_OPTIONS.map((period) => (
                <option key={period} value={period}>
                  {INTERVAL_LABELS[period]}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-navy/40 dark:text-gray-500">
              정기결제 페이지에서 평균 금액을 계산할 때 사용하는 단위입니다.
            </p>
          </div>

          {/* 알림 */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-navy/60 dark:text-gray-400">알림</span>
              <p className="mt-0.5 text-xs text-navy/40 dark:text-gray-500">
                예산 초과, 정기결제 예정 등의 알림을 받습니다.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings?.notificationEnabled ?? true}
              onClick={() => {
                if (!user?.id) return;
                const next = !(settings?.notificationEnabled ?? true);
                updateNotificationEnabled(user.id, next);
              }}
              className={[
                'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors',
                (settings?.notificationEnabled ?? true)
                  ? 'bg-vault-color'
                  : 'bg-navy/20 dark:bg-white/20',
              ].join(' ')}
            >
              <span
                className={[
                  'pointer-events-none inline-block h-5 w-5 translate-y-0.5 rounded-full bg-white shadow-sm transition-transform',
                  (settings?.notificationEnabled ?? true) ? 'translate-x-5.5' : 'translate-x-0.5',
                ].join(' ')}
              />
            </button>
          </div>

          {/* 저장 */}
          <div className="flex items-center justify-end gap-3 pt-2">
            {saved && <span className="text-xs text-vault-color">저장됨</span>}
            <button
              type="submit"
              className="rounded-xl bg-vault-color px-6 py-2.5 text-sm font-semibold text-white hover:bg-vault-color/90"
            >
              저장
            </button>
          </div>
        </form>
      </GlassCard>

      {/* 광고 — 설정 하단 */}
      <AdUnit slot="SETTINGS_BOTTOM" format="rectangle" className="mt-6" />
    </div>
  );
}
