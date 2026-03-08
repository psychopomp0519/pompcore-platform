/**
 * @file themeStore.ts
 * @description 테마 전역 상태 관리 (라이트/다크 모드)
 * @module stores/themeStore
 */

import { create } from 'zustand';

// ============================================================
// 타입 정의
// ============================================================

/** 지원 테마 */
type Theme = 'light' | 'dark';

/** 테마 스토어 상태 + 액션 */
interface ThemeState {
  /** 현재 테마 */
  theme: Theme;
  /** 테마 토글 (light <-> dark) */
  toggleTheme: () => void;
  /** 테마 직접 설정 */
  setTheme: (theme: Theme) => void;
}

// ============================================================
// 상수
// ============================================================

/** localStorage 키 */
const STORAGE_KEY = 'pompcore-theme';

/** 테마 전환 애니메이션 지속 시간 (ms) */
const THEME_TRANSITION_DURATION_MS = 500;

// ============================================================
// 헬퍼 함수
// ============================================================

/**
 * localStorage에서 초기 테마를 읽어온다.
 * 기존 uiStore의 JSON 형식에서 새로운 단순 문자열 형식으로 마이그레이션 처리.
 */
function getInitialTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return 'light';
    }

    /* 새 형식: 단순 문자열 */
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }

    /* 구 형식: JSON (zustand persist 포맷) */
    if (stored.startsWith('{')) {
      const parsed = JSON.parse(stored) as {
        state?: { isDarkMode?: boolean };
      };
      return parsed?.state?.isDarkMode ? 'dark' : 'light';
    }
  } catch {
    /* 파싱 실패 시 기본값 */
  }

  return 'light';
}

/**
 * 테마를 DOM과 localStorage에 동기화한다.
 * `data-theme-ready` 속성으로 초기 로드 시 애니메이션을 억제하고,
 * 이후 전환 시 theme-transitioning 클래스로 부드러운 전환 제공.
 */
function applyTheme(theme: Theme): void {
  const root = document.documentElement;

  /* 초기 로드 이후에만 전환 애니메이션 */
  if (root.dataset.themeReady) {
    root.classList.add('theme-transitioning');
    setTimeout(() => {
      root.classList.remove('theme-transitioning');
    }, THEME_TRANSITION_DURATION_MS);
  }

  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  /* 초기 로드 완료 표시 */
  root.dataset.themeReady = '1';

  /* 사용자 선택 저장 */
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* 무시 */
  }
}

// ============================================================
// 모듈 스코프 초기화 (import 시점에 즉시 실행)
// ============================================================

const initialTheme = getInitialTheme();
applyTheme(initialTheme);

// ============================================================
// 스토어
// ============================================================

/** 테마 전역 상태 스토어 */
export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: initialTheme,

  toggleTheme: () => {
    const next: Theme = get().theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    set({ theme: next });
  },

  setTheme: (theme: Theme) => {
    applyTheme(theme);
    set({ theme });
  },
}));
