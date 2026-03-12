/**
 * @file SettingsCreditsPage.tsx
 * @description 크레딧 페이지 — 개발자 정보 + 사용 라이브러리
 * @module pages/SettingsCreditsPage
 */

import { type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard, IconArrowLeft } from '@pompcore/ui';
import { ROUTES } from '../constants/routes';

// ============================================================
// 상수
// ============================================================

interface CreditEntry {
  name: string;
  role: string;
}

interface LibraryEntry {
  name: string;
  description: string;
  url: string;
}

const DEVELOPERS: CreditEntry[] = [
  { name: 'PompCore Team', role: '기획 / 디자인 / 개발' },
];

const CORE_LIBRARIES: LibraryEntry[] = [
  { name: 'React', description: 'UI 라이브러리', url: 'https://react.dev' },
  { name: 'TypeScript', description: '타입 안전 JavaScript', url: 'https://www.typescriptlang.org' },
  { name: 'Vite', description: '빌드 도구', url: 'https://vite.dev' },
  { name: 'Tailwind CSS', description: '유틸리티 CSS 프레임워크', url: 'https://tailwindcss.com' },
  { name: 'Supabase', description: '백엔드 (Auth + DB)', url: 'https://supabase.com' },
  { name: 'Zustand', description: '상태 관리', url: 'https://zustand.docs.pmnd.rs' },
  { name: 'React Router', description: '라우팅', url: 'https://reactrouter.com' },
  { name: 'Nivo', description: '차트 라이브러리', url: 'https://nivo.rocks' },
  { name: 'Turborepo', description: '모노레포 빌드 시스템', url: 'https://turbo.build' },
  { name: 'Vitest', description: '테스트 프레임워크', url: 'https://vitest.dev' },
];

const DESIGN_CREDITS: LibraryEntry[] = [
  { name: 'Pretendard', description: '본문 폰트', url: 'https://cactus.tistory.com/306' },
  { name: 'Nunito', description: '디스플레이 폰트', url: 'https://fonts.google.com/specimen/Nunito' },
];

// ============================================================
// SettingsCreditsPage
// ============================================================

/** 크레딧 페이지 */
export function SettingsCreditsPage(): ReactNode {
  const navigate = useNavigate();

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
        <h1 className="font-display text-xl font-bold text-navy dark:text-gray-100">크레딧</h1>
      </div>

      {/* 개발자 */}
      <GlassCard padding="md">
        <h2 className="mb-3 text-sm font-semibold text-navy dark:text-gray-100">개발팀</h2>
        <div className="space-y-2">
          {DEVELOPERS.map((dev) => (
            <div key={dev.name} className="flex items-center justify-between">
              <span className="text-sm text-navy dark:text-gray-200">{dev.name}</span>
              <span className="text-xs text-navy/40 dark:text-gray-500">{dev.role}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* 핵심 라이브러리 */}
      <GlassCard padding="md">
        <h2 className="mb-3 text-sm font-semibold text-navy dark:text-gray-100">오픈소스 라이브러리</h2>
        <div className="space-y-2">
          {CORE_LIBRARIES.map((lib) => (
            <div key={lib.name} className="flex items-center justify-between">
              <div>
                <a
                  href={lib.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-vault-color hover:underline"
                >
                  {lib.name}
                </a>
              </div>
              <span className="text-xs text-navy/40 dark:text-gray-500">{lib.description}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* 디자인 리소스 */}
      <GlassCard padding="md">
        <h2 className="mb-3 text-sm font-semibold text-navy dark:text-gray-100">디자인 리소스</h2>
        <div className="space-y-2">
          {DESIGN_CREDITS.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-vault-color hover:underline"
              >
                {item.name}
              </a>
              <span className="text-xs text-navy/40 dark:text-gray-500">{item.description}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* 버전 */}
      <div className="text-center text-xs text-navy/30 dark:text-gray-600">
        PompCore Vault v1.1.1
      </div>
    </div>
  );
}
