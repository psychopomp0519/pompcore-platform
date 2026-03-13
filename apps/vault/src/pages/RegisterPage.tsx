/**
 * @file RegisterPage.tsx
 * @description 회원가입 페이지 - 이메일/비밀번호 + Google OAuth
 * @module pages/RegisterPage
 */

import { useState, useMemo, type FormEvent } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { useAuthStore } from '../stores/authStore';
import { signUpWithEmail, signInWithGoogle } from '../services/auth.service';
import { toUserMessage, evaluatePassword, PasswordStrengthBar } from '@pompcore/ui';
import { ThemeBackground } from '../components/layout/ThemeBackground';

// ============================================================
// RegisterPage
// ============================================================

/** 회원가입 페이지 */
export function RegisterPage(): React.ReactNode {
  const user = useAuthStore((state) => state.user);

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const passwordStrength = useMemo(() => evaluatePassword(password), [password]);

  if (user) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  async function handleSubmit(e: FormEvent): Promise<void> {
    e.preventDefault();
    setError(null);

    if (!passwordStrength.isValid) {
      setError('비밀번호가 모든 규칙을 충족하지 않습니다.');
      return;
    }
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsSubmitting(true);

    try {
      await signUpWithEmail(email, password, displayName);
      setIsSuccess(true);
    } catch (err) {
      setError(toUserMessage(err, '회원가입에 실패했습니다.'));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleSignUp(): Promise<void> {
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(toUserMessage(err, 'Google 로그인에 실패했습니다.'));
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center">
      <ThemeBackground />

      <div className="mx-4 w-full max-w-sm rounded-2xl bg-white/80 p-8 shadow-glass backdrop-blur-[16px] dark:bg-surface-card-dark">
        <div className="mb-1 flex justify-center">
          <img src="/logo.svg" alt="Vault" className="h-10" />
        </div>
        <p className="mb-6 text-center text-sm text-navy/60 dark:text-gray-400">
          새 계정을 만들어 시작하세요
        </p>

        {isSuccess && (
          <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400">
            가입이 완료되었습니다. 이메일을 확인해 주세요.
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
            {error}
          </div>
        )}

        {!isSuccess && (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="displayName" className="mb-1 block text-sm font-medium text-navy dark:text-gray-200">
                  닉네임
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  autoComplete="name"
                  className="w-full rounded-xl border border-navy/20 bg-white/80 px-4 py-2.5 text-sm text-navy placeholder:text-navy/40 focus:border-vault-color focus:outline-none focus:ring-1 focus:ring-vault-color dark:border-white/20 dark:bg-surface-dark/50 dark:text-gray-100 dark:placeholder:text-gray-500"
                  placeholder="닉네임 입력"
                />
              </div>
              <div>
                <label htmlFor="reg-email" className="mb-1 block text-sm font-medium text-navy dark:text-gray-200">
                  이메일
                </label>
                <input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-navy/20 bg-white/80 px-4 py-2.5 text-sm text-navy placeholder:text-navy/40 focus:border-vault-color focus:outline-none focus:ring-1 focus:ring-vault-color dark:border-white/20 dark:bg-surface-dark/50 dark:text-gray-100 dark:placeholder:text-gray-500"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label htmlFor="reg-password" className="mb-1 block text-sm font-medium text-navy dark:text-gray-200">
                  비밀번호
                </label>
                <input
                  id="reg-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-navy/20 bg-white/80 px-4 py-2.5 text-sm text-navy placeholder:text-navy/40 focus:border-vault-color focus:outline-none focus:ring-1 focus:ring-vault-color dark:border-white/20 dark:bg-surface-dark/50 dark:text-gray-100 dark:placeholder:text-gray-500"
                  placeholder="영문 대/소문자, 숫자, 특수문자 포함 8자 이상"
                />
                <PasswordStrengthBar password={password} />
              </div>
              <div>
                <label htmlFor="reg-confirm" className="mb-1 block text-sm font-medium text-navy dark:text-gray-200">
                  비밀번호 확인
                </label>
                <input
                  id="reg-confirm"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-navy/20 bg-white/80 px-4 py-2.5 text-sm text-navy placeholder:text-navy/40 focus:border-vault-color focus:outline-none focus:ring-1 focus:ring-vault-color dark:border-white/20 dark:bg-surface-dark/50 dark:text-gray-100 dark:placeholder:text-gray-500"
                  placeholder="비밀번호 재입력"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-vault-color px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-vault-color/90 disabled:opacity-50"
              >
                {isSubmitting ? '가입 중...' : '가입하기'}
              </button>
            </form>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-navy/10 dark:bg-white/10" />
              <span className="text-xs text-navy/40 dark:text-gray-500">또는</span>
              <div className="h-px flex-1 bg-navy/10 dark:bg-white/10" />
            </div>

            <button
              type="button"
              onClick={handleGoogleSignUp}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-navy/20 bg-white/80 px-4 py-3 text-sm font-medium text-navy transition-colors hover:bg-navy/5 dark:border-white/20 dark:bg-surface-dark/50 dark:text-gray-200 dark:hover:bg-white/5"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google로 계속하기
            </button>
          </>
        )}

        <p className="mt-5 text-center text-sm text-navy/60 dark:text-gray-400">
          이미 계정이 있으신가요?{' '}
          <Link to={ROUTES.LOGIN} className="font-medium text-vault-color hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
