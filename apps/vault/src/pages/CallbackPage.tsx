/**
 * @file CallbackPage.tsx
 * @description OAuth 콜백 처리 페이지 — PKCE 코드 교환 및 세션 확립
 * @module pages/CallbackPage
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSupabase } from '@pompcore/auth';
import { toUserMessage } from '@pompcore/ui';
import { ROUTES } from '../constants/routes';

/** OAuth 리다이렉트 후 코드 교환을 명시적으로 처리 */
export function CallbackPage(): React.ReactNode {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabase();
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');

    if (code) {
      supabase.auth.exchangeCodeForSession(code)
        .then(({ error: err }) => {
          if (err) {
            setError(toUserMessage(err, '인증 처리에 실패했습니다.'));
          } else {
            navigate(ROUTES.DASHBOARD, { replace: true });
          }
        });
    } else if (accessToken) {
      supabase.auth.getSession()
        .then(({ data: { session } }) => {
          if (session) {
            navigate(ROUTES.DASHBOARD, { replace: true });
          } else {
            setError('세션을 확인할 수 없습니다. 다시 로그인해주세요.');
          }
        });
    } else {
      setError('인증 정보가 없습니다. 다시 로그인해주세요.');
    }
  }, [navigate]);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface-light dark:bg-surface-dark">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-500/20 dark:bg-red-500/10">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
        <button
          type="button"
          onClick={() => navigate(ROUTES.LOGIN, { replace: true })}
          className="text-sm text-vault-color hover:underline"
        >
          로그인 페이지로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-light dark:bg-surface-dark">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-vault-color border-t-transparent" />
        <p className="text-sm text-navy/60 dark:text-gray-400">로그인 처리 중...</p>
      </div>
    </div>
  );
}
