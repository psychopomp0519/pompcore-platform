/**
 * @file themePrefsStore.ts
 * @description 테마 커스터마이징 설정 (localStorage 기반)
 * @module stores/themePrefsStore
 */

import { create } from 'zustand';

// ============================================================
// 상수
// ============================================================

const STORAGE_KEY = 'vault-theme-prefs';

/** 액센트 컬러 프리셋 */
export const ACCENT_PRESETS = [
  { id: 'emerald', label: '에메랄드', rgb: '16 185 129', hex: '#10B981' },
  { id: 'violet', label: '바이올렛', rgb: '124 58 237', hex: '#7C3AED' },
  { id: 'blue', label: '블루', rgb: '59 130 246', hex: '#3B82F6' },
  { id: 'rose', label: '로즈', rgb: '244 63 94', hex: '#F43E5E' },
  { id: 'amber', label: '앰버', rgb: '245 158 11', hex: '#F59E0B' },
  { id: 'cyan', label: '시안', rgb: '6 182 212', hex: '#06B6D4' },
] as const;

export type AccentPresetId = (typeof ACCENT_PRESETS)[number]['id'];

/** 기본 액센트 (Vault 기본 에메랄드) */
const DEFAULT_ACCENT: AccentPresetId = 'emerald';

// ============================================================
// 타입
// ============================================================

interface ThemePrefs {
  accentId: AccentPresetId;
  showAnimations: boolean;
}

interface ThemePrefsState extends ThemePrefs {
  setAccent: (id: AccentPresetId) => void;
  setShowAnimations: (show: boolean) => void;
}

// ============================================================
// 헬퍼
// ============================================================

/** localStorage에서 설정 로드 */
function loadPrefs(): ThemePrefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { accentId: DEFAULT_ACCENT, showAnimations: true };
    const parsed = JSON.parse(raw) as Partial<ThemePrefs>;
    return {
      accentId: ACCENT_PRESETS.some((p) => p.id === parsed.accentId)
        ? (parsed.accentId as AccentPresetId)
        : DEFAULT_ACCENT,
      showAnimations: parsed.showAnimations !== false,
    };
  } catch {
    return { accentId: DEFAULT_ACCENT, showAnimations: true };
  }
}

/** localStorage + CSS 변수 동기화 */
function persist(prefs: ThemePrefs): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  applyAccent(prefs.accentId);
}

/** CSS 변수에 액센트 컬러 반영 */
export function applyAccent(id: AccentPresetId): void {
  const preset = ACCENT_PRESETS.find((p) => p.id === id);
  if (!preset) return;
  document.documentElement.style.setProperty('--color-app-accent', preset.rgb);
}

// ============================================================
// 스토어
// ============================================================

const initial = loadPrefs();
applyAccent(initial.accentId);

export const useThemePrefsStore = create<ThemePrefsState>()((set, get) => ({
  ...initial,

  setAccent: (id) => {
    set({ accentId: id });
    persist({ ...get(), accentId: id });
  },

  setShowAnimations: (show) => {
    set({ showAnimations: show });
    persist({ ...get(), showAnimations: show });
  },
}));
