/**
 * 테마 상태 관리 (Zustand)
 * - 라이트/다크 모드 전역 관리
 * - localStorage에 사용자 선택 저장
 * - body 클래스 토글로 Tailwind dark: 접두사 활성화
 */
import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

/** localStorage에서 저장된 테마 불러오기, 기본값: light */
function getInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem('pompcore-theme') as Theme | null;
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    // SSR 또는 localStorage 접근 불가 시 기본값
  }
  return 'light';
}

/** HTML에 다크 모드 클래스 적용 + 전환 애니메이션 트리거 */
function applyTheme(theme: Theme) {
  const root = document.documentElement;

  // 테마 전환 애니메이션 활성화 (초기 로드 시에는 건너뜀)
  if (root.dataset.themeReady) {
    root.classList.add('theme-transitioning');
  }

  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  // 전환 완료 후 클래스 제거 (500ms)
  if (root.dataset.themeReady) {
    setTimeout(() => root.classList.remove('theme-transitioning'), 500);
  }

  // 초기 로드 완료 표시
  root.dataset.themeReady = '1';

  try {
    localStorage.setItem('pompcore-theme', theme);
  } catch {
    // localStorage 접근 불가 시 무시
  }
}

// 초기 테마 즉시 적용
const initialTheme = getInitialTheme();
applyTheme(initialTheme);

export const useThemeStore = create<ThemeState>((set) => ({
  theme: initialTheme,

  toggleTheme: () =>
    set((state) => {
      const next = state.theme === 'light' ? 'dark' : 'light';
      applyTheme(next);
      return { theme: next };
    }),

  setTheme: (theme) => {
    applyTheme(theme);
    set({ theme });
  },
}));
