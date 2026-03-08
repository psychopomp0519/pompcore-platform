/**
 * @file SettingsPage.tsx
 * @description 설정 페이지 — 사용자 환경 설정
 * @module pages/SettingsPage
 */

import { GlassCard, IconSettings } from '@pompcore/ui';
import { useAuthStore, signOut } from '@pompcore/auth';
import { Button } from '@pompcore/ui';

// ============================================================
// SettingsPage
// ============================================================

/** 설정 페이지 — 프로필 및 앱 설정 */
export function SettingsPage(): React.ReactNode {
  const user = useAuthStore((s) => s.user);

  /** 로그아웃 핸들러 */
  const handleLogout = async (): Promise<void> => {
    await signOut();
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <IconSettings size={28} />
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
          설정
        </h1>
      </div>

      <GlassCard>
        <div className="space-y-4 p-6">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">이름</p>
            <p className="text-slate-900 dark:text-white">{user?.displayName ?? '-'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">이메일</p>
            <p className="text-slate-900 dark:text-white">{user?.email ?? '-'}</p>
          </div>
        </div>
      </GlassCard>

      <Button onClick={handleLogout} variant="secondary" className="w-full">
        로그아웃
      </Button>
    </div>
  );
}
