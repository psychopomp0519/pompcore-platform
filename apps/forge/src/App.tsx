/**
 * @file App.tsx
 * @description 앱 루트 컴포넌트 - 라우팅 설정
 * @module App
 */

import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ROUTES } from './constants/routes';
import { ProtectedRoute } from '@pompcore/auth';
import { Layout } from './components/layout/Layout';
import { useAuthInit } from '@pompcore/auth';

// ============================================================
// 페이지 lazy-load — 대장간의 각 구역
// ============================================================

const LoginPage = lazy(() =>
  import('./pages/LoginPage').then((m) => ({ default: m.LoginPage })),
);
const DashboardPage = lazy(() =>
  import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
);
const GoalsPage = lazy(() =>
  import('./pages/GoalsPage').then((m) => ({ default: m.GoalsPage })),
);
const GoalDetailPage = lazy(() =>
  import('./pages/GoalDetailPage').then((m) => ({ default: m.GoalDetailPage })),
);
const TasksPage = lazy(() =>
  import('./pages/TasksPage').then((m) => ({ default: m.TasksPage })),
);
const WeeklyReviewPage = lazy(() =>
  import('./pages/WeeklyReviewPage').then((m) => ({ default: m.WeeklyReviewPage })),
);
const TaskDebtPage = lazy(() =>
  import('./pages/TaskDebtPage').then((m) => ({ default: m.TaskDebtPage })),
);
const SettingsPage = lazy(() =>
  import('./pages/SettingsPage').then((m) => ({ default: m.SettingsPage })),
);
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
);

// ============================================================
// 로딩 스피너 — 대장간 점화 중
// ============================================================

function PageLoader(): React.ReactNode {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-light dark:bg-surface-dark">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-forge-color border-t-transparent" />
    </div>
  );
}

// ============================================================
// App 컴포넌트
// ============================================================

/** 앱 루트 - 라우팅 및 전역 프로바이더 */
export function App(): React.ReactNode {
  useAuthInit();

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* 공개 라우트 */}
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />

          {/* 인증 필요 라우트 (Layout 적용) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
              <Route path={ROUTES.GOALS} element={<GoalsPage />} />
              <Route path={ROUTES.GOAL_DETAIL} element={<GoalDetailPage />} />
              <Route path={ROUTES.TASKS} element={<TasksPage />} />
              <Route path={ROUTES.REVIEW} element={<WeeklyReviewPage />} />
              <Route path={ROUTES.DEBT} element={<TaskDebtPage />} />
              <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
            </Route>
          </Route>

          {/* 404 catch-all */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
