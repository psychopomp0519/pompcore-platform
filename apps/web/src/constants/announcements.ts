/**
 * 공지사항 상수 데이터
 * - 새 공지 추가 시 이 배열 최상단에 항목을 추가하면 자동으로 UI에 반영
 */

export interface Announcement {
  /** 고유 ID */
  id: string;
  /** 공지 제목 */
  title: string;
  /** 작성 날짜 (YYYY-MM-DD) */
  date: string;
  /** 공지 카테고리 */
  category: 'notice' | 'update' | 'event' | 'maintenance';
  /** 공지 본문 (여러 줄 가능) */
  content: string;
  /** 중요 공지 여부 (상단 고정) */
  pinned?: boolean;
}

/** 카테고리별 라벨 및 색상 */
export const ANNOUNCEMENT_CATEGORY_CONFIG: Record<
  Announcement['category'],
  { label: string; color: string; icon: string }
> = {
  notice: {
    label: '공지',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
    icon: 'megaphone',
  },
  update: {
    label: '업데이트',
    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
    icon: 'rocket',
  },
  event: {
    label: '이벤트',
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400',
    icon: 'celebration',
  },
  maintenance: {
    label: '점검',
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
    icon: 'wrench',
  },
};

/** 공지사항 목록 (최신순) */
export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-005',
    title: 'Vault (스마트 가계부) 정식 출시',
    date: '2026-03-08',
    category: 'update',
    content:
      'PompCore의 첫 번째 서비스 Vault가 정식 출시되었습니다! vault.pompcore.cc에서 게임 감성의 스마트 가계부를 만나보세요. 수입/지출 관리, 예산 설정, 통계 분석 등 다양한 기능을 이용할 수 있습니다.',
    pinned: true,
  },
  {
    id: 'ann-004',
    title: 'PompCore 모노레포 통합 및 인증 시스템 개선 (v0.5.0)',
    date: '2026-03-08',
    category: 'update',
    content:
      'PompCore 플랫폼이 모노레포 구조로 통합되었습니다. 공유 패키지(@pompcore/ui, @pompcore/auth, @pompcore/types)를 통해 서비스 간 일관된 경험을 제공합니다. Google OAuth 로그인 안정성이 개선되었으며, PKCE 기반 보안 인증 플로우가 적용되었습니다.',
  },
  {
    id: 'ann-003',
    title: '패치노트 및 공지사항 페이지 오픈',
    date: '2026-03-04',
    category: 'update',
    content:
      'PompCore 웹사이트에 패치노트와 공지사항 페이지가 추가되었습니다. 이제 서비스 업데이트 내역과 공지를 한눈에 확인할 수 있습니다.',
    pinned: true,
  },
  {
    id: 'ann-002',
    title: '라이트 테마 디자인 리뉴얼 (v0.2.0)',
    date: '2026-03-04',
    category: 'update',
    content:
      '밝고 깔끔한 라이트 테마가 기본 디자인으로 적용되었습니다. 우측 상단의 🌙/☀️ 버튼으로 다크 모드 전환이 가능합니다.',
  },
  {
    id: 'ann-001',
    title: 'PompCore 플랫폼 준비 중',
    date: '2026-03-04',
    category: 'notice',
    content:
      'PompCore 플랫폼이 준비 중입니다. Vault(스마트 가계부)와 Quest(일정관리) 서비스가 곧 출시될 예정입니다. 많은 관심 부탁드립니다.',
    pinned: true,
  },
];
