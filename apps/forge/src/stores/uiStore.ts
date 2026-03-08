/**
 * @file uiStore.ts
 * @description UI 상태 관리 — 사이드바, 모달 등 전역 UI 상태
 * @module stores/uiStore
 */

import { create } from 'zustand';

// ============================================================
// Types
// ============================================================

interface UiState {
  /** 사이드바 열림 여부 */
  isSidebarOpen: boolean;
  /** 사이드바 토글 */
  toggleSidebar: () => void;
  /** 사이드바 열기 */
  openSidebar: () => void;
  /** 사이드바 닫기 */
  closeSidebar: () => void;
}

// ============================================================
// Store
// ============================================================

/** 전역 UI 상태 스토어 */
export const useUiStore = create<UiState>((set) => ({
  isSidebarOpen: false,
  toggleSidebar: (): void => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
  openSidebar: (): void => set({ isSidebarOpen: true }),
  closeSidebar: (): void => set({ isSidebarOpen: false }),
}));
