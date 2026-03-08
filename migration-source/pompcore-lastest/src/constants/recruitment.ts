/**
 * 팀원 모집 데이터
 * - Recruit 페이지에서 자동 렌더링
 * - 새 포지션 추가 시 이 배열에 항목 추가
 */

export interface RecruitPosition {
  id: string;
  title: string;
  icon: string;
  tasks: string[];
  requirements: string[];
}

export const RECRUIT_POSITIONS: RecruitPosition[] = [
  {
    id: 'designer',
    title: 'UI/UX 디자이너',
    icon: 'palette',
    tasks: [
      '서브컬쳐 게임 감성의 디자인 시스템 구축',
      'Vault, Quest 등 각 서비스의 화면 설계 및 프로토타이핑',
      '일관된 세계관을 유지하는 컴포넌트/아이콘/일러스트 디자인',
    ],
    requirements: [
      '서브컬쳐 게임(명일방주, 블루아카이브, 원신 등)의 UI에 관심이 많은 분',
      'Figma 등 디자인 툴 사용 가능한 분',
      '다크 테마, 글로우 효과, 판타지 감성에 감각이 있는 분',
    ],
  },
  {
    id: 'pm',
    title: '기획자 / PM',
    icon: 'clipboard',
    tasks: [
      '서비스 기능 기획 및 사용자 플로우 설계',
      'AI 코딩 도구용 프롬프트 설계 및 품질 검증',
      '프로젝트 일정 관리 및 팀 커뮤니케이션 조율',
    ],
    requirements: [
      '서비스 기획 경험이 있거나 관심이 많은 분',
      '사용자 관점에서 생각하고 문서로 정리하는 걸 좋아하는 분',
      'AI 도구를 활용한 개발 프로세스에 호기심이 있는 분',
    ],
  },
  {
    id: 'frontend',
    title: '프론트엔드 개발자',
    icon: 'code',
    tasks: [
      'React 19 + TypeScript 기반 컴포넌트 개발 및 코드 리뷰',
      'AI가 생성한 코드의 품질 검증 및 최적화',
      '게임 감성 인터랙션/애니메이션 구현',
    ],
    requirements: [
      'React + TypeScript 경험이 있는 분',
      'Tailwind CSS로 스타일링 가능한 분',
      '멋진 인터랙션과 애니메이션에 욕심이 있는 분',
    ],
  },
  {
    id: 'backend',
    title: '백엔드 / Supabase 개발자',
    icon: 'wrench',
    tasks: [
      'Supabase 기반 데이터 모델링 및 API 설계',
      '인증, 실시간 데이터, 스토리지 등 백엔드 인프라 구축',
      '보안 정책(RLS) 설계 및 성능 최적화',
    ],
    requirements: [
      'Supabase 또는 Firebase 등 BaaS 경험이 있는 분',
      'PostgreSQL, REST API에 대한 이해가 있는 분',
      '서버리스 아키텍처에 관심이 있는 분',
    ],
  },
];

/** 지원서 양식 필드 */
export interface ApplicationForm {
  name: string;
  email: string;
  position: string;
  interestedService: string;
  introduction: string;
  portfolio?: string;
  submittedAt: string;
}
