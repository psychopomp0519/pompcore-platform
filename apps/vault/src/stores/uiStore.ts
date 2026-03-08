/**
 * @file uiStore.ts
 * @description UI 전역 상태 관리 (사이드바 등)
 * @module stores/uiStore
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ============================================================
// 타입 정의
// ============================================================

interface UiState {
  /** 사이드바 열림 여부 (데스크톱) */
  isSidebarOpen: boolean;
  /** 모바일 사이드바 열림 여부 */
  isMobileSidebarOpen: boolean;
}

interface UiActions {
  /** 사이드바 토글 (데스크톱) */
  toggleSidebar: () => void;
  /** 모바일 사이드바 토글 */
  toggleMobileSidebar: () => void;
  /** 모바일 사이드바 닫기 */
  closeMobileSidebar: () => void;
}

// ============================================================
// 스토어
// ============================================================

/** UI 전역 상태 스토어 */
export const useUiStore = create<UiState & UiActions>()(
  persist(
    (set, get) => ({
      isSidebarOpen: true,
      isMobileSidebarOpen: false,

      toggleSidebar: () => {
        set({ isSidebarOpen: !get().isSidebarOpen });
      },

      toggleMobileSidebar: () => {
        set({ isMobileSidebarOpen: !get().isMobileSidebarOpen });
      },

      closeMobileSidebar: () => {
        set({ isMobileSidebarOpen: false });
      },
    }),
    {
      name: 'pompcore-ui',
      partialize: (state) => ({ isSidebarOpen: state.isSidebarOpen }),
    },
  ),
);
