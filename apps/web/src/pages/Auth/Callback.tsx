/**
 * @file Callback.tsx
 * @description OAuth 콜백 처리 페이지 — PKCE 코드 교환 및 세션 확립
 * @module pages/Auth/Callback
 */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSupabase } from '@pompcore/auth';
import { LoadingSpinner, toUserMessage } from '@pompcore/ui';

/** OAuth 리다이렉트 후 코드 교환을 명시적으로 처리 */
export default function Callback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabase();
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');

    if (code) {
      /* PKCE 플로우: code → 세션 교환 */
      supabase.auth.exchangeCodeForSession(code)
        .then(({ error: err }) => {
          if (err) {
            setError(toUserMessage(err, '인증 처리에 실패했습니다.'));
          } else {
            navigate('/', { replace: true });
          }
        });
    } else if (accessToken) {
      /* Implicit 플로우: URL 해시에서 세션 자동 감지 */
      supabase.auth.getSession()
        .then(({ data: { session } }) => {
          if (session) {
            navigate('/', { replace: true });
          } else {
            setError('세션을 확인할 수 없습니다. 다시 로그인해주세요.');
          }
        });
    } else {
      /* 인증 파라미터 없음 */
      setError('인증 정보가 없습니다. 다시 로그인해주세요.');
    }
  }, [navigate]);

  if (error) {
    return (
      <section className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-500/20 dark:bg-red-500/10">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/auth/login', { replace: true })}
          className="text-sm text-brand-500 hover:underline"
        >
          로그인 페이지로 돌아가기
        </button>
      </section>
    );
  }

  return (
    <section className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <LoadingSpinner />
        <p className="text-sm text-slate-500 dark:text-slate-400">로그인 처리 중...</p>
      </div>
    </section>
  );
}
