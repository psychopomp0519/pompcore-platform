/**
 * @file useNotificationGenerator.ts
 * @description 대시보드 진입 시 알림 자동 생성 훅 (예산 초과, 정기결제 도래)
 * @module hooks/useNotificationGenerator
 */

import { useEffect, useRef } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useNotificationStore } from '../stores/notificationStore';
import * as budgetService from '../services/budget.service';
import * as recurringService from '../services/recurring.service';
import * as notificationService from '../services/notification.service';
import { getNextOccurrence } from '../utils/recurringCalculator';
import { formatCurrency } from '../utils/currency';

// ============================================================
// 상수
// ============================================================

/** 정기결제 알림 기준 일수 */
const UPCOMING_DAYS = 7;
/** 하루 (ms) */
const MS_PER_DAY = 86_400_000;
/** 생성 간격 — 세션 중 한 번만 실행 */
const GENERATION_KEY = 'vault-noti-gen-date';

// ============================================================
// 훅
// ============================================================

/** 대시보드 진입 시 알림 자동 생성 */
export function useNotificationGenerator(): void {
  const user = useAuthStore((s) => s.user);
  const settings = useSettingsStore((s) => s.settings);
  const loadUnreadCount = useNotificationStore((s) => s.loadUnreadCount);
  const ran = useRef(false);

  useEffect(() => {
    const uid = user?.id;
    if (!uid || ran.current) return;
    if (!settings || !settings.notificationEnabled) return;

    /* 오늘 이미 실행했으면 스킵 */
    const today = new Date().toISOString().slice(0, 10);
    if (sessionStorage.getItem(GENERATION_KEY) === today) return;

    ran.current = true;
    sessionStorage.setItem(GENERATION_KEY, today);

    void generateNotifications(uid).then(() => {
      loadUnreadCount(uid);
    });
  }, [user?.id, settings, loadUnreadCount]);
}

// ============================================================
// 알림 생성 로직
// ============================================================

async function generateNotifications(userId: string): Promise<void> {
  await Promise.allSettled([
    checkBudgetExceeded(userId),
    checkUpcomingRecurring(userId),
  ]);
}

/** 예산 초과 체크 */
async function checkBudgetExceeded(userId: string): Promise<void> {
  try {
    const budgets = await budgetService.fetchBudgets(userId);
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    for (const budget of budgets) {
      /* currentAmount > targetAmount 이면 예산 초과 */
      if (budget.currentAmount > budget.targetAmount) {
        const overAmount = budget.currentAmount - budget.targetAmount;
        await notificationService.createNotification({
          userId,
          type: 'budget_exceeded',
          title: `${budget.name} 예산 초과`,
          message: `${year}년 ${month}월 예산(${formatCurrency(budget.targetAmount, budget.currency)})을 ${formatCurrency(overAmount, budget.currency)} 초과했습니다.`,
          referenceId: budget.id,
        });
      }
    }
  } catch {
    /* 예산 체크 실패는 조용히 무시 */
  }
}

/** 7일 이내 정기결제 도래 체크 */
async function checkUpcomingRecurring(userId: string): Promise<void> {
  try {
    const payments = await recurringService.fetchRecurringPayments(userId);
    const now = new Date();
    const threshold = new Date(now.getTime() + UPCOMING_DAYS * MS_PER_DAY);

    for (const payment of payments) {
      if (!payment.isActive) continue;

      const todayStr = now.toISOString().slice(0, 10);
      const nextDateStr = getNextOccurrence(
        payment.startDate,
        payment.intervalUnit,
        payment.intervalValue,
        todayStr,
      );
      if (!nextDateStr) continue;

      const nextDate = new Date(nextDateStr);
      if (nextDate <= threshold) {
        const daysLeft = Math.ceil((nextDate.getTime() - now.getTime()) / MS_PER_DAY);
        const dayLabel = daysLeft <= 0 ? '오늘' : `${daysLeft}일 후`;
        await notificationService.createNotification({
          userId,
          type: 'recurring_upcoming',
          title: `${payment.name} 결제 예정`,
          message: `${dayLabel}에 ${formatCurrency(payment.amount, payment.currency)} 결제가 예정되어 있습니다.`,
          referenceId: payment.id,
        });
      }
    }
  } catch {
    /* 정기결제 체크 실패는 조용히 무시 */
  }
}
