/**
 * @file LoginPage.tsx
 * @description 로그인 페이지 — 대장간 입장
 * @module pages/LoginPage
 */

import { ForgeIcon } from '@pompcore/ui';
import { signInWithGoogle } from '@pompcore/auth';
import { GlassCard, Button } from '@pompcore/ui';

// ============================================================
// LoginPage
// ============================================================

/** 로그인 페이지 — Google OAuth로 간편 로그인 */
export function LoginPage(): React.ReactNode {
  /** Google 로그인 핸들러 */
  const handleGoogleLogin = async (): Promise<void> => {
    await signInWithGoogle();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-light dark:bg-surface-dark p-4">
      <GlassCard>
        <div className="flex flex-col items-center gap-6 p-8">
          <ForgeIcon size={56} />
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
              Forge
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              작업 중심 자기관리 엔진
            </p>
          </div>

          <Button onClick={handleGoogleLogin} className="w-full">
            Google로 시작하기
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
