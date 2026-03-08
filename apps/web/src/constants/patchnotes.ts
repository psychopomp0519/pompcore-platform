/**
 * 패치노트 상수 데이터
 * - 새 패치노트 추가 시 이 배열 최상단에 항목을 추가하면 자동으로 UI에 반영
 * - docs/patchnotes/에 상세 .md 파일 별도 보관
 */

export interface PatchNote {
  /** 시맨틱 버전 (예: '0.2.0') */
  version: string;
  /** 출시 날짜 (YYYY-MM-DD) */
  date: string;
  /** 한 줄 요약 */
  summary: string;
  /** 변경 카테고리별 항목 */
  changes: PatchNoteChange[];
}

export interface PatchNoteChange {
  /** 카테고리: 추가 / 변경 / 수정 / 제거 */
  type: 'added' | 'changed' | 'fixed' | 'removed';
  /** 변경 내용 설명 */
  description: string;
}

/** 카테고리별 라벨 및 색상 */
export const CHANGE_TYPE_CONFIG: Record<
  PatchNoteChange['type'],
  { label: string; color: string }
> = {
  added: { label: '추가', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' },
  changed: { label: '변경', color: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' },
  fixed: { label: '수정', color: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' },
  removed: { label: '제거', color: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' },
};

/** 패치노트 목록 (최신순) */
export const PATCH_NOTES: PatchNote[] = [
  {
    version: '0.5.0',
    date: '2026-03-08',
    summary: '모노레포 통합 마이그레이션 + OAuth 수정 + 공유 패키지 구축',
    changes: [
      { type: 'added', description: 'pnpm + Turborepo 모노레포 통합 (Web + Vault + Forge)' },
      { type: 'added', description: '@pompcore/ui 공유 패키지 (Nebula 디자인 시스템, 공통 컴포넌트)' },
      { type: 'added', description: '@pompcore/auth 공유 패키지 (SSO, 쿠키 세션, PKCE 플로우)' },
      { type: 'added', description: '@pompcore/types 공유 타입 패키지' },
      { type: 'added', description: '@pompcore/sdk 플랫폼 설정 팩토리' },
      { type: 'added', description: 'OAuth 전용 콜백 페이지 (/auth/callback) — Web, Vault 모두 적용' },
      { type: 'added', description: 'Vault 서비스 정식 출시 (vault.pompcore.cc)' },
      { type: 'fixed', description: 'Google OAuth 로그인 실패 — PKCE 코드 이중 교환 문제 해결' },
      { type: 'fixed', description: '로그인 오류 메시지 한국어 미적용 수정 (toUserMessage 적용)' },
      { type: 'fixed', description: '쿠키 저장소 4KB 초과 — 하이브리드 스토리지(localStorage + SSO 마커) 전환' },
      { type: 'changed', description: 'detectSessionInUrl: false로 변경하여 명시적 콜백 처리' },
      { type: 'changed', description: 'Vault 프로젝트 상태 출시 예정 → 서비스 중 전환' },
    ],
  },
  {
    version: '0.4.0',
    date: '2026-03-05',
    summary: 'Nebula 테마 디자인 리뉴얼 + 팀원 모집 시스템',
    changes: [
      { type: 'added', description: 'Nebula 컬러 팔레트 전면 교체 (Violet + Gold + Pink)' },
      { type: 'added', description: 'Cinzel / Cinzel Decorative 디스플레이 폰트 도입' },
      { type: 'added', description: '랜딩 페이지 6섹션 재구성 (Hero, Services, Why, Upcoming, FAQ, CTA)' },
      { type: 'added', description: '16종 SVG 아이콘 시스템 + DynamicIcon 공통 컴포넌트' },
      { type: 'added', description: 'BrandText / PompCoreLogo 브랜드 텍스트 컴포넌트' },
      { type: 'added', description: '팀원 모집 페이지 (/recruit) + 지원서 양식' },
      { type: 'added', description: '관리자 지원서 열람 페이지 (/recruit/admin)' },
      { type: 'added', description: 'FAQ 아코디언 섹션 (grid-rows CSS 트랜지션)' },
      { type: 'added', description: 'Upcoming 서비스 소개 섹션' },
      { type: 'changed', description: '전체 디자인 시스템 Indigo → Nebula(Violet) 전환' },
      { type: 'changed', description: '이모지 아이콘 → 커스텀 SVG 아이콘 전면 교체' },
      { type: 'fixed', description: '관리자 비밀번호 하드코딩 → .env 환경변수 분리' },
      { type: 'fixed', description: 'HeroSection gradient 클래스 중복 제거' },
      { type: 'removed', description: 'FeaturesSection.tsx (WhySection으로 대체)' },
      { type: 'removed', description: 'ProjectsPreview.tsx (ServicesSection으로 대체)' },
    ],
  },
  {
    version: '0.3.0',
    date: '2026-03-04',
    summary: '패치노트 및 공지사항 페이지 추가',
    changes: [
      { type: 'added', description: '패치노트 페이지 (/patchnotes) - 버전별 변경 이력 확인' },
      { type: 'added', description: '공지사항 페이지 (/announcements) - 서비스 공지 확인' },
      { type: 'added', description: 'Header 네비게이션에 패치노트/공지사항 메뉴 추가' },
    ],
  },
  {
    version: '0.2.0',
    date: '2026-03-04',
    summary: '라이트 테마 디자인 리뉴얼 + 다크 모드 토글',
    changes: [
      { type: 'added', description: '다크 모드 토글 (themeStore + Header 🌙/☀️ 버튼)' },
      { type: 'added', description: 'SVG 로고 통합 (pompcore, vault, quest)' },
      { type: 'added', description: '프로젝트 이식용 템플릿 3종 (docs/templates/)' },
      { type: 'added', description: '비즈니스 전략 문서화 (AdSense, Polar, Clarity, SEO/GEO)' },
      { type: 'changed', description: '라이트 테마 기본값 전환 (다크 전용 → 라이트 기본)' },
      { type: 'changed', description: 'Navy 컬러 팔레트 추가 (로고 색상 #2B3442 기반)' },
      { type: 'changed', description: '전체 컴포넌트/페이지 라이트-다크 듀얼 모드 적용' },
    ],
  },
  {
    version: '0.1.1',
    date: '2026-03-04',
    summary: '메인 페이지 섹션 구조 확립',
    changes: [
      { type: 'added', description: '서비스 소개 섹션 (FeaturesSection) - 핵심 가치 4개 카드' },
      { type: 'added', description: 'CTA 배너 섹션 (CtaBanner) - 회원가입 유도 영역' },
      { type: 'changed', description: 'Home 페이지 4단 구성: Hero → Features → Projects → CTA' },
    ],
  },
  {
    version: '0.1.0',
    date: '2026-03-04',
    summary: '프로젝트 기초 구조 설정',
    changes: [
      { type: 'added', description: 'React 19 + TypeScript + Vite + Tailwind CSS 기술 스택 구성' },
      { type: 'added', description: 'PompCore 브랜드 디자인 시스템 (컬러, 애니메이션, 글래스모피즘)' },
      { type: 'added', description: '공통 UI 컴포넌트 (Button, GlassCard, ProjectCard)' },
      { type: 'added', description: '레이아웃 시스템 (Header, Footer, Layout)' },
      { type: 'added', description: '페이지 골격 (Home, Projects, About, Login, Register)' },
      { type: 'added', description: 'Supabase 기반 SSO 인증 구조 (authService, authStore)' },
      { type: 'added', description: '프로젝트 데이터 시스템 (Vault, Quest 등록)' },
    ],
  },
];
