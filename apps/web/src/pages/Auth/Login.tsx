/**
 * 로그인 페이지
 * - PompCore SSO 통합 로그인
 * - 이메일/비밀번호 + Google OAuth 지원
 * - @pompcore/auth 패키지와 연동
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { LoginRequest } from '@pompcore/types';
import { useAuthStore } from '@pompcore/auth';
import { GlassCard, Button, GoogleIcon } from '@pompcore/ui';

export default function Login() {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuthStore();
  const [form, setForm] = useState<LoginRequest>({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** 입력값 변경 핸들러 */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  /** 이메일/비밀번호 로그인 */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      const message = err instanceof Error ? err.message : '로그인에 실패했습니다.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  /** Google OAuth 로그인 */
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setError(null);

    try {
      await loginWithGoogle();
      /* OAuth 리다이렉트 방식 — 페이지가 자동으로 이동됨 */
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Google 로그인에 실패했습니다.';
      setError(message);
      setIsGoogleLoading(false);
    }
  };

  return (
    <section className="min-h-[80vh] flex items-center justify-center px-6">
      <GlassCard hoverable={false} padding="lg" className="w-full max-w-md">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gradient mb-2">로그인</h1>
          <p className="text-sm text-[#5C5C7A] dark:text-slate-400">PompCore 계정으로 모든 서비스를 이용하세요</p>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Google 소셜 로그인 */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl min-h-[44px] border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] text-sm font-medium text-[#1A1A2E] dark:text-white hover:bg-slate-50 dark:hover:bg-white/[0.06] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <GoogleIcon size={20} />
          {isGoogleLoading ? '연결 중...' : 'Google로 로그인'}
        </button>

        {/* 구분선 */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
          <span className="text-xs text-[#757585] dark:text-slate-500">또는</span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
        </div>

        {/* 이메일/비밀번호 로그인 폼 */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#4A4270] dark:text-slate-300 mb-1.5">
              이메일
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[#1A1A2E] dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#4A4270] dark:text-slate-300 mb-1.5">
              비밀번호
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[#1A1A2E] dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" variant="primary" size="md" className="w-full" isLoading={isLoading}>
            로그인
          </Button>
        </form>

        {/* 하단 링크 */}
        <p className="text-center text-sm text-[#5C5C7A] dark:text-slate-400 mt-6">
          계정이 없으신가요?{' '}
          <Link to="/auth/register" className="text-brand-400 hover:text-brand-300 transition-colors">
            회원가입
          </Link>
        </p>
      </GlassCard>
    </section>
  );
}
