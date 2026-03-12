/**
 * @file notificationStore.ts
 * @description 알림 상태 관리 Zustand 스토어
 * @module stores/notificationStore
 */

import { create } from 'zustand';
import type { Notification } from '../types/notification.types';
import * as notificationService from '../services/notification.service';
import { toUserMessage } from '@pompcore/ui';

// ============================================================
// 타입
// ============================================================

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

interface NotificationActions {
  load: (userId: string) => Promise<void>;
  loadUnreadCount: (userId: string) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: (userId: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
  clearError: () => void;
}

// ============================================================
// 스토어
// ============================================================

export const useNotificationStore = create<NotificationState & NotificationActions>()(
  (set, get) => ({
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    error: null,

    load: async (userId) => {
      set({ isLoading: true, error: null });
      try {
        const [notifications, unreadCount] = await Promise.all([
          notificationService.fetchNotifications(userId),
          notificationService.fetchUnreadCount(userId),
        ]);
        set({ notifications, unreadCount, isLoading: false });
      } catch (err) {
        set({ error: toUserMessage(err), isLoading: false });
      }
    },

    loadUnreadCount: async (userId) => {
      try {
        const unreadCount = await notificationService.fetchUnreadCount(userId);
        set({ unreadCount });
      } catch {
        /* 배지 갱신 실패는 조용히 무시 */
      }
    },

    markAsRead: async (id) => {
      try {
        await notificationService.markAsRead(id);
        const notifications = get().notifications.map((n) =>
          n.id === id ? { ...n, isRead: true } : n,
        );
        const unreadCount = notifications.filter((n) => !n.isRead).length;
        set({ notifications, unreadCount });
      } catch (err) {
        set({ error: toUserMessage(err) });
      }
    },

    markAllAsRead: async (userId) => {
      try {
        await notificationService.markAllAsRead(userId);
        const notifications = get().notifications.map((n) => ({ ...n, isRead: true }));
        set({ notifications, unreadCount: 0 });
      } catch (err) {
        set({ error: toUserMessage(err) });
      }
    },

    remove: async (id) => {
      try {
        await notificationService.deleteNotification(id);
        const notifications = get().notifications.filter((n) => n.id !== id);
        const unreadCount = notifications.filter((n) => !n.isRead).length;
        set({ notifications, unreadCount });
      } catch (err) {
        set({ error: toUserMessage(err) });
      }
    },

    clearError: () => set({ error: null }),
  }),
);
