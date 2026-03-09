/**
 * @file NotFound.tsx
 * @description 404 페이지 — 존재하지 않는 경로 접근 시 표시
 * @module pages/NotFound
 */
import { Link } from 'react-router-dom';

export default function NotFound(): React.ReactNode {
  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-6xl font-bold text-brand-600 dark:text-brand-400 mb-4">404</h1>
      <p className="text-lg text-slate-700 dark:text-slate-300 mb-2">
        페이지를 찾을 수 없습니다
      </p>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors"
      >
        홈으로 돌아가기
      </Link>
    </section>
  );
}
