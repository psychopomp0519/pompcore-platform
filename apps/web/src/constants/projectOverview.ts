/**
 * 프로젝트 개요 데이터
 * - PompCore_프로젝트_개요 docx 문서 기반
 * - 팀원(member) 이상 권한으로 열람 가능
 * - 섹션별로 구조화하여 페이지에서 자동 렌더링
 */

export interface OverviewSection {
  id: string;
  title: string;
  content: string;
  /** 표 데이터 (선택) */
  table?: { headers: string[]; rows: string[][] };
  /** 하위 섹션 (선택) */
  subsections?: { title: string; content: string; table?: { headers: string[]; rows: string[][] } }[];
}

/** 프로젝트 개요 섹션 목록 */
export const PROJECT_OVERVIEW_SECTIONS: OverviewSection[] = [
  {
    id: 'vision',
    title: '1. 프로젝트 비전 & 미션',
    content: '서브컬쳐 게임의 몰입감과 감성을 일상 도구에 접목하여, 사용자가 자신의 삶을 하나의 게임처럼 능동적으로 플레이할 수 있는 통합 생활 플랫폼을 구축한다.',
    subsections: [
      {
        title: '미션 (Mission)',
        content: '',
        table: {
          headers: ['미션'],
          rows: [
            ['가계부, 일정 관리 등 생활 필수 도구를 서브컬쳐 게임 감성 UI로 제공한다'],
            ['무료 사용자도 핵심 기능에 불편함 없이 접근할 수 있도록 보장한다'],
            ['AI 네이티브 개발 방식을 채택하여 소규모 팀으로도 고품질 서비스를 빠르게 구축한다'],
            ['사용자 피드백을 적극 수용하여 함께 성장하는 서비스를 만든다'],
          ],
        },
      },
      {
        title: '핵심 가치 (Core Values)',
        content: '',
        table: {
          headers: ['가치', '설명'],
          rows: [
            ['몰입 (Immersion)', '서브컬쳐 게임의 세계관과 감성을 일상 도구에 자연스럽게 녹여낸다'],
            ['접근성 (Accessibility)', '누구나 무료로 핵심 기능을 사용할 수 있으며, 유료 구독은 편의성 향상에만 집중한다'],
            ['민첩성 (Agility)', 'AI 도구를 활용한 빠른 개발 사이클로 시장 변화에 즉각 대응한다'],
            ['공동 성장 (Co-growth)', '사용자 피드백을 최우선으로 수용하며, 커뮤니티와 함께 서비스를 발전시킨다'],
          ],
        },
      },
    ],
  },
  {
    id: 'branding',
    title: '2. 브랜딩',
    content: 'PompCore의 핵심 컬러 시스템은 "Nebula(성운)"를 테마로 한다. 서브컬쳐 게임에서 자주 사용되는 딥 다크 배경 위에 네온 글로우 효과를 강조하는 방식이다.',
    subsections: [
      {
        title: '컬러 팔레트 — Nebula',
        content: '',
        table: {
          headers: ['컬러명', 'HEX', '역할', '사용처'],
          rows: [
            ['Deep Void', '#0A0A1A', 'Background', '앱 전체 배경, 카드 베이스'],
            ['Nebula Purple', '#7B2FBE', 'Primary', '로고, 버튼, 네비게이션 활성'],
            ['Cosmic Blue', '#2E5BFF', 'Secondary', '링크, 보조 버튼, 정보성 텍스트'],
            ['Stardust Cyan', '#00E5FF', 'Accent', '성공 상태, 경험치, 글로우 효과'],
            ['Phantom Rose', '#FF3D7F', 'Highlight', '경고, 삭제, 지출 초과, 알림'],
          ],
        },
      },
      {
        title: '슬로건',
        content: '"일상을 플레이하다" — "플레이"가 게임과 일상의 이중 의미를 자연스럽게 담아내며, 서비스 확장 시에도 일관된 메시지를 유지할 수 있다. 영문 전환("Play Your Day")도 용이하여 글로벌 확장에 유리하다.',
      },
      {
        title: '기업 이미지',
        content: 'PompCore는 "실용적인 판타지"를 지향한다. 서브컬쳐 게임의 미학(다크 테마, 네온 글로우, 판타지 모티프)을 차용하되, 실제로 사용자의 삶에 도움이 되는 도구를 만든다.',
      },
    ],
  },
  {
    id: 'target',
    title: '3. 타겟 사용자 & 페르소나',
    content: '1차 타겟은 서브컬쳐(애니, 게임, 라이트노벨 등)에 관심이 높은 10대 후반~20대 중반이다. 디지털 네이티브로서 새로운 서비스 수용도가 높고, SNS를 통한 자발적 확산이 활발하다.',
    subsections: [
      {
        title: '페르소나 A — 대학생 유진 (22세)',
        content: '블루아카이브, 명일방주 등 서브컬쳐 게임 유저. 자취 중이라 생활비 관리가 필요하지만 기존 가계부 앱은 "너무 딱딱해서" 꾸준히 쓰지 못함. 게임하는 감성으로 지출을 기록하고 싶다.',
      },
      {
        title: '페르소나 B — 취준생 민수 (25세)',
        content: '원신, 스타레일 유저. 취업 준비와 아르바이트를 병행하며 일정이 복잡하다. 일정, 가계부, 할 일 목록을 한 곳에서 관리하고 싶다.',
      },
      {
        title: '페르소나 C — 고등학생 하은 (18세)',
        content: '서브컬쳐 전반에 관심이 많고, 용돈 관리 습관을 들이고 싶어하는 시기. 귀여운 UI와 보상 시스템이 있으면 꾸준히 사용할 의향이 높음.',
      },
    ],
  },
  {
    id: 'services',
    title: '4. 서비스 라인업',
    content: '',
    subsections: [
      {
        title: 'Vault (금고) — 가계부',
        content: '수입/지출을 게임 감성으로 기록하고 분석하는 가계부 서비스. 수입/지출 기록 및 카테고리 분류, 월별/주별 리포트, 예산 설정, 게이미피케이션(절약 목표 달성 시 경험치/배지 획득).',
      },
      {
        title: 'Quest (퀘스트) — 일정관리',
        content: '할 일과 일정을 RPG 퀘스트처럼 관리하는 서비스. 캘린더 + 할 일 통합, 일정 완료 시 경험치 획득 및 레벨업, 루틴 트래커(데일리 퀘스트), 리마인더.',
      },
      {
        title: '향후 서비스 — 온라인 과외 플랫폼',
        content: '소규모 온라인 과외를 위한 매칭 및 수업 관리 플랫폼. 교사-학생 매칭, 수업 일정(Quest 연동), 수업료 관리(Vault 연동).',
      },
      {
        title: '서비스 확장 구조',
        content: '팀원이 자신만의 프로젝트 아이디어를 제출하면, 승인 후 해당 팀원이 팀을 꾸려 개발하는 방식. 모든 서비스는 PompCore의 디자인 시스템(Nebula 팔레트)과 기술 스택을 공유.',
      },
    ],
  },
  {
    id: 'techstack',
    title: '5. 기술 스택 & 개발 환경',
    content: '',
    subsections: [
      {
        title: '핵심 기술 스택',
        content: '',
        table: {
          headers: ['분류', '기술', '선택 이유'],
          rows: [
            ['프레임워크', 'React 19', '최신 Concurrent 기능, 풍부한 생태계'],
            ['언어', 'TypeScript', '타입 안전성으로 AI 생성 코드 품질 검증 용이'],
            ['빌드 도구', 'Vite', '빠른 HMR, 경량 번들링'],
            ['스타일링', 'Tailwind CSS 3', '유틸리티 퍼스트, 다크 모드 내장'],
            ['상태 관리', 'Zustand', '경량, 보일러플레이트 최소'],
            ['백엔드/DB', 'Supabase', 'PostgreSQL 기반 BaaS, 실시간 구독, RLS 보안'],
          ],
        },
      },
      {
        title: '개발 워크플로우',
        content: 'AI 네이티브 개발 방식 채택. 프로젝트 기획/계획 확정 후 AI 코딩 도구에 입력할 프롬프트를 설계하는 것이 핵심 업무.',
        table: {
          headers: ['도구', '역할', '활용 방식'],
          rows: [
            ['Claude (Anthropic)', 'AI 코딩 & 기획', '프롬프트 기반 코드 생성, 아키텍처 설계, 문서 작성'],
            ['GitHub', '버전 관리', 'Git Flow, PR 리뷰, Issue 트래킹, Actions CI/CD'],
            ['Cloudflare Pages', '배포 & CDN', '자동 빌드/배포, 글로벌 CDN, SSL 자동 적용'],
            ['Supabase', 'DB & 인증', 'PostgreSQL, 소셜 로그인, RLS, 실시간 동기화'],
            ['Microsoft Clarity', '사용자 행동 분석', '히트맵, 세션 리플레이, UX 개선'],
            ['Google Analytics 4', '트래픽 추적', '유입 경로, 체류 시간, 전환 퍼널'],
          ],
        },
      },
    ],
  },
  {
    id: 'monetization',
    title: '6. 수익화 구조',
    content: '핵심 원칙은 "무료 사용자가 불편함을 느끼지 않아야 한다"는 것이다.',
    subsections: [
      {
        title: '광고 수익',
        content: 'Google AdSense 기반 디스플레이 광고. 핵심 기능 UI 위에는 절대 광고를 놓지 않음. 유료 구독 시 광고 제거.',
      },
      {
        title: '부분유료화 (Freemium)',
        content: '',
        table: {
          headers: ['무료 (기본)', '프리미엄 (유료 구독)'],
          rows: [
            ['모든 핵심 기능 이용 가능', '광고 제거'],
            ['기본 테마 제공', '프리미엄 테마 & 커스터마이징'],
            ['기본 리포트 & 차트', '고급 분석 리포트 & 데이터 내보내기'],
            ['기본 알림', '고급 알림 커스터마이징'],
            ['기본 배지/칭호', '한정 배지, 특별 칭호, 프로필 꾸미기'],
          ],
        },
      },
    ],
  },
  {
    id: 'promotion',
    title: '7. 홍보 전략',
    content: '',
    subsections: [
      {
        title: 'SNS 채널 운영',
        content: '',
        table: {
          headers: ['채널', '목적', '콘텐츠 방향'],
          rows: [
            ['Instagram', '브랜드 이미지 구축', 'UI 스크린샷, 업데이트 카드뉴스, 서브컬쳐 감성 일러스트'],
            ['X (Twitter)', '서브컬쳐 커뮤니티 침투', '개발 비하인드, 밈, RT 이벤트, 유저 피드백 대응'],
            ['에브리타임', '대학생 타겟 직접 도달', '가계부/일정관리 팁 + PompCore 자연스러운 노출'],
            ['YouTube', '서비스 시연', '사용법 영상, 개발 브이로그'],
          ],
        },
      },
      {
        title: '확산 전략',
        content: 'SEO/GEO 최적화를 통한 오가닉 트래픽 확보. 지인 초대 시스템(초대 코드로 프리미엄 테마 증정). 서브컬쳐 커뮤니티 타겟 바이럴.',
      },
    ],
  },
  {
    id: 'operations',
    title: '8. 운영 방침',
    content: '',
    subsections: [
      {
        title: '유저 피드백 적극 수용',
        content: '인앱 피드백 시스템, 피드백 대응 사이클(접수→분류 1일→검토 3일→반영 7일 이내), 공개 로드맵, 분기별 사용자 만족도 조사.',
      },
      {
        title: '무료 우선 정책',
        content: '유료 구독은 편의성 향상에만 집중. 유료 혜택은 테마 커스터마이징, 광고 제거, 고급 리포트 등 "더 좋은 경험"에 한정.',
      },
      {
        title: '데이터 & 개인정보',
        content: '최소 수집 원칙. Supabase RLS로 사용자 데이터 격리. 투명한 개인정보 처리방침 공개.',
      },
    ],
  },
  {
    id: 'team',
    title: '9. 팀 구조 & 합류 프로세스',
    content: '현재 1인 체제 운영. 프로젝트 기반 합류 방식을 채택.',
    subsections: [
      {
        title: '팀 확장 프로세스',
        content: '',
        table: {
          headers: ['단계', '내용', '설명'],
          rows: [
            ['1', '아이디어 제출', '합류 희망자가 자신만의 프로젝트 아이디어를 작성하여 제출'],
            ['2', '검토 & 승인', 'PompCore의 비전/기술 스택 적합성을 검토하여 승인 여부 결정'],
            ['3', '팀 구성', '승인 후, 아이디어 제안자가 필요 인원을 모집하여 팀 구성'],
            ['4', '개발 & 출시', 'PompCore 디자인 시스템/기술 스택 하에서 독립적 개발 진행'],
          ],
        },
      },
    ],
  },
  {
    id: 'timeline',
    title: '10. 프로젝트 타임라인',
    content: '3단계 로드맵. 구체적 날짜보다는 마일스톤 달성 기준으로 유연하게 운영.',
    subsections: [
      {
        title: 'Phase 1 — MVP 출시 (약 2~3개월)',
        content: '인프라 구축 → 랜딩 페이지 완성 → Vault MVP 개발 → 베타 테스트 → 정식 출시 & AdSense',
      },
      {
        title: 'Phase 2 — 서비스 확장 (약 3~4개월)',
        content: 'Quest MVP 개발 및 출시, 게이미피케이션 시스템 구현, 프리미엄 구독 결제 도입, 사용자 100명 돌파 목표',
      },
      {
        title: 'Phase 3 — 생태계 구축 (약 4~6개월)',
        content: '팀원 모집 및 신규 프로젝트 승인 프로세스 가동, 온라인 과외 플랫폼 기획, Vault-Quest 연동, 사용자 1,000명 돌파 목표, PWA 도입 검토',
      },
    ],
  },
];
