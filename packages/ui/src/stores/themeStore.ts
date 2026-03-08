/**
 * @file Theme store — Light/dark mode toggle with localStorage persistence
 * @description Includes legacy JSON migration from old zustand persist format.
 * @module @pompcore/ui/themeStore
 */
import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const STORAGE_KEY = 'pompcore-theme';
const THEME_TRANSITION_DURATION_MS = 500;

/**
 * localStorage에서 초기 테마를 읽어온다.
 * 기존 uiStore의 JSON 형식에서 새로운 단순 문자열 형식으로 마이그레이션 처리.
 */
function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';

  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) return 'light';

    if (stored === 'light' || stored === 'dark') return stored;

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

function applyTheme(theme: Theme): void {
  const root = document.documentElement;

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

  root.dataset.themeReady = '1';

  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* 무시 */
  }
}

const initialTheme = getInitialTheme();
if (typeof window !== 'undefined') applyTheme(initialTheme);

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
