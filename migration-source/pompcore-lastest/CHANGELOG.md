# PompCore Changelog

모든 버전별 상세 패치노트는 [docs/patchnotes/](docs/patchnotes/) 폴더를 참조하세요.

## [0.4.8] - 2026-03-06

반응형 UI 전면 개선

- 전체 페이지 컨테이너 패딩 반응형 적용 (px-4 sm:px-6)
- 페이지 제목 크기 반응형 통일 (text-2xl sm:text-3xl md:text-4xl)
- Home 섹션 (Hero/Services/Why/Upcoming/FAQ/CTA) 패딩·gap·제목 반응형 조정
- Projects/About/PatchNotes/Announcements/Recruit 페이지 반응형 개선
- Footer 그리드 2열 모바일 레이아웃 적용
- Header 컨테이너 패딩 반응형 적용
- 카드·폼·정보 박스 패딩 단계별 반응형 (p-4 sm:p-6 md:p-8)

## [0.4.7] - 2026-03-06

테마 토글 UI 개선

- 이모지(🌙/☀️) → 애니메이티드 SVG 아이콘으로 교체
- ThemeToggle 독립 컴포넌트 생성 (해↔달 모핑 전환, 광선/별 효과)
- CSS transition 300ms 부드러운 전환, prefers-reduced-motion 대응
- Header 데스크톱/모바일 양쪽 적용
- 사이트 전체 테마 전환 애니메이션 (500ms smooth transition)

## [0.4.6] - 2026-03-06

라이트 모드 하늘+구름 시각 효과 대규모 개선

- 배경 그라디언트 강화: 파스텔 → 푸른 하늘색 (#B8DEFF~#E8F4FD) 팔레트 적용
- 복합 구름 시스템: 가장자리(연한 blur) + 코어(진한 blur) 2레이어 구성으로 입체감
- 구름 드리프트 애니메이션: cloud-drift(20s), cloud-drift-slow(30s) keyframes 추가
- 섹션 간 하늘 연속성: 그라디언트 끝/시작 색상 일치로 자연스러운 전환
- sky 디자인 토큰 추가: tailwind.config.ts에 sky.deep~faint 7단계 팔레트
- 모든 섹션 구름 4~8개로 보강 (기존 1~3개 → 복합 구름 포함)
- prefers-reduced-motion 기존 글로벌 대응으로 애니메이션 자동 비활성화
- 로고/아이콘 6종 PNG 배경 투명화 처리 (sharp로 near-white 픽셀 제거)
- mix-blend-multiply 해킹 제거 → 투명 배경 로고로 모든 배경색에서 깔끔히 표시

## [0.4.3] - 2026-03-05

프로젝트 검증 기반 품질 개선 (11건)

- hasPermission() null/undefined 방어 처리
- OAuth isLoading 상태 복구 (에러·정상 모두 false로 리셋)
- FAQ 금색 Q 아이콘 라이트 모드 WCAG AA 대비율 개선 (#B8860B)
- VITE_ADMIN_PASSWORD 제거 → RoleGuard 기반 접근 제어로 전환
- user_metadata 런타임 타입 검증 (as 캐스팅 → typeof 가드)
- ErrorBoundary 컴포넌트 추가 + App.tsx 래핑
- 5개 페이지 빈 상태(Empty State) UI 추가
- Recruit.tsx → RecruitPositions.tsx 컴포넌트 분리
- recruitStorage.ts 공통 서비스 추출 (Recruit + RecruitAdmin 공유)
- recruitment.ts 이모지 → SVG 아이콘 전환 (PaletteIcon, ClipboardIcon, CodeIcon 추가)

## [0.4.2] - 2026-03-05

Google 소셜 로그인 + 인증 UI 개선

- Google OAuth 로그인 지원 (Supabase signInWithOAuth)
- 로그인/회원가입 페이지 authStore 실제 연동 (기존 TODO 코드 제거)
- GoogleIcon SVG 컴포넌트 추가
- 로그인/회원가입 폼 라이트 모드 대응 (input, label, error 스타일)
- "또는" 구분선 UI로 소셜/이메일 로그인 시각 분리

## [0.4.1] - 2026-03-05

권한 체계 + 프로젝트 개요 페이지 + 라이트 모드 가시성 개선

- 역할 기반 권한 체계 (팀장/팀원/사용자) + RoleGuard 접근 제어 컴포넌트
- 프로젝트 개요 열람 페이지 (/internal/overview) — 팀원 이상 접근
- patchnotes.ts v0.4.0 데이터 등록
- 라이트 모드 텍스트 WCAG AA 대비율 개선 (10개 파일, 56건)
- text-gradient 라이트 모드 진한 톤 조정
- 프로젝트 검증 프로토콜 확장 (코드 흐름 추적, 편의성 검증)

## [0.4.0] - 2026-03-05

Nebula 테마 디자인 리뉴얼 + 팀원 모집 시스템

- Nebula 컬러 팔레트 전면 교체 (Violet + Gold + Pink)
- Cinzel 디스플레이 폰트 도입
- 랜딩 페이지 6섹션 재구성 (Hero, Services, Why, Upcoming, FAQ, CTA)
- 16종 SVG 아이콘 시스템 + DynamicIcon 공통 컴포넌트
- BrandText/PompCoreLogo 브랜드 텍스트 컴포넌트
- 팀원 모집 페이지 (/recruit) + 관리자 열람 (/recruit/admin)
- 코드 품질 개선 (환경변수 분리, 타입 개선, CSS 트랜지션)

상세: [docs/patchnotes/v0.4.0.md](docs/patchnotes/v0.4.0.md)

## [0.3.0] - 2026-03-04

패치노트/공지사항 페이지 + UI/UX 접근성 개선

- 패치노트 페이지 (/patchnotes) - 버전별 변경 이력 타임라인
- 공지사항 페이지 (/announcements) - 고정 공지, 카테고리 배지, 펼치기/접기
- WCAG 2.1 AA 접근성: skip-nav, aria-current, aria-expanded, focus-visible
- 한국어 UX 최적화: Pretendard 폰트, word-break: keep-all, 행간 1.75
- prefers-reduced-motion 지원 (모션 감소 선호 사용자)
- 다크 모드 텍스트 오프화이트 전환 (눈 피로 감소)
- 버튼 최소 터치 타겟 44px 보장 (Apple HIG)
- index.html: lang="ko", meta description, 타이틀 변경
- Supabase 미설정 시 앱 크래시 방지 (방어적 처리)

상세: [docs/patchnotes/v0.3.0.md](docs/patchnotes/v0.3.0.md)

## [0.2.0] - 2026-03-04

라이트 테마 기반 디자인 리뉴얼 + 다크 모드 토글

- 라이트 테마 기본값 전환, Navy 컬러 팔레트 추가
- 다크 모드 토글 (themeStore + Header 🌙/☀️ 버튼)
- SVG 로고 통합 (pompcore, vault, quest)
- 전체 컴포넌트/페이지 라이트-다크 듀얼 모드 적용
- 프로젝트 이식용 템플릿 3종 추가 (docs/templates/)
- 비즈니스 전략 문서화 (AdSense, Polar, Clarity, SEO/GEO)

상세: [docs/patchnotes/v0.2.0.md](docs/patchnotes/v0.2.0.md)

## [0.1.1] - 2026-03-04

메인 페이지 섹션 구조 확립

- 서비스 소개 섹션 추가 (FeaturesSection) - 핵심 가치 4개 카드
- CTA 배너 섹션 추가 (CtaBanner) - 회원가입 유도 영역
- Home 페이지 4단 구성: Hero → Features → Projects → CTA

상세: [docs/patchnotes/v0.1.1.md](docs/patchnotes/v0.1.1.md)

## [0.1.0] - 2026-03-04

프로젝트 기초 구조 설정 (React + TS + Vite + Tailwind + Supabase)

- 브랜드 디자인 시스템 구축 (Indigo-Violet, 글래스모피즘)
- 공통 컴포넌트: Button, GlassCard, ProjectCard
- 레이아웃: Header (반응형), Footer, Layout
- 페이지: Home, Projects, About, Login, Register
- SSO 인증 골격: authService + authStore (Supabase Auth)
- 프로젝트 데이터: Vault (가계부), Quest (일정관리) 등록
- 환경변수 분리 (.env.example 제공)

상세: [docs/patchnotes/v0.1.0.md](docs/patchnotes/v0.1.0.md)
