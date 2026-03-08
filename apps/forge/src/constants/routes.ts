/**
 * @file routes.ts
 * @description 라우트 경로 상수 정의 — 대장간의 각 구역 경로
 * @module constants/routes
 */

/** 앱 내 라우트 경로 */
export const ROUTES = {
  /** 대시보드 — 대장간 총괄 현황 */
  DASHBOARD: '/',
  /** 로그인 */
  LOGIN: '/auth/login',
  /** 목표 목록 — 장기 목표 관리 */
  GOALS: '/goals',
  /** 목표 상세 — 마일스톤 + 하위 작업 */
  GOAL_DETAIL: '/goals/:id',
  /** 작업 목록 — 오늘의 퀘스트 */
  TASKS: '/tasks',
  /** 주간 회고 — 한 주의 성과 점검 */
  REVIEW: '/review',
  /** 작업 부채 — 미완료 작업 추적 */
  DEBT: '/debt',
  /** 설정 */
  SETTINGS: '/settings',
} as const;
