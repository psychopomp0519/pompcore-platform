/**
 * @file SettingsThemePage.tsx
 * @description 테마 커스터마이징 페이지 (액센트 컬러 + 애니메이션 토글)
 * @module pages/SettingsThemePage
 */

import { type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard, IconArrowLeft } from '@pompcore/ui';
import { ROUTES } from '../constants/routes';
import {
  useThemePrefsStore,
  ACCENT_PRESETS,
  type AccentPresetId,
} from '../stores/themePrefsStore';

// ============================================================
// 상수
// ============================================================

/** 체크마크 SVG path */
const CHECK_PATH = 'M5 13l4 4L19 7';

// ============================================================
// 서브 컴포넌트
// ============================================================

/** 액센트 컬러 팔레트 아이템 */
function AccentSwatch({
  id,
  label,
  hex,
  selected,
  onSelect,
}: {
  id: AccentPresetId;
  label: string;
  hex: string;
  selected: boolean;
  onSelect: (id: AccentPresetId) => void;
}): ReactNode {
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className="group flex flex-col items-center gap-1.5"
      aria-label={`${label} 테마 선택`}
      aria-pressed={selected}
    >
      <span
        className={[
          'flex h-12 w-12 items-center justify-center rounded-full transition-all',
          selected
            ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900'
            : 'hover:scale-110',
        ].join(' ')}
        style={{
          backgroundColor: hex,
          ...({ '--tw-ring-color': selected ? hex : undefined } as React.CSSProperties),
        }}
      >
        {selected && (
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d={CHECK_PATH} />
          </svg>
        )}
      </span>
      <span className="text-xs text-navy/60 dark:text-gray-400 group-hover:text-navy dark:group-hover:text-gray-200">
        {label}
      </span>
    </button>
  );
}

// ============================================================
// SettingsThemePage
// ============================================================

/** 테마 설정 페이지 */
export function SettingsThemePage(): ReactNode {
  const navigate = useNavigate();
  const { accentId, showAnimations, setAccent, setShowAnimations } = useThemePrefsStore();

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
        <h1 className="font-display text-xl font-bold text-navy dark:text-gray-100">테마</h1>
      </div>

      {/* 액센트 컬러 */}
      <GlassCard padding="md">
        <h2 className="mb-1 text-sm font-semibold text-navy dark:text-gray-100">액센트 컬러</h2>
        <p className="mb-4 text-xs text-navy/40 dark:text-gray-500">
          앱 전체에 적용되는 강조 색상을 선택하세요.
        </p>
        <div className="flex flex-wrap gap-4">
          {ACCENT_PRESETS.map((preset) => (
            <AccentSwatch
              key={preset.id}
              id={preset.id}
              label={preset.label}
              hex={preset.hex}
              selected={accentId === preset.id}
              onSelect={setAccent}
            />
          ))}
        </div>
      </GlassCard>

      {/* 배경 애니메이션 */}
      <GlassCard padding="md">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-navy dark:text-gray-100">배경 애니메이션</h2>
            <p className="mt-0.5 text-xs text-navy/40 dark:text-gray-500">
              별/구름 배경 파티클 애니메이션을 켜거나 끕니다.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={showAnimations}
            onClick={() => setShowAnimations(!showAnimations)}
            className={[
              'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors',
              showAnimations
                ? 'bg-app-accent'
                : 'bg-navy/20 dark:bg-white/20',
            ].join(' ')}
            style={showAnimations ? { backgroundColor: `rgb(var(--color-app-accent))` } : undefined}
          >
            <span
              className={[
                'pointer-events-none inline-block h-5 w-5 translate-y-0.5 rounded-full bg-white shadow-sm transition-transform',
                showAnimations ? 'translate-x-5.5' : 'translate-x-0.5',
              ].join(' ')}
            />
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
