# 개발 완료 목록

## v0.4.8 (2026-03-06)

- [x] 전체 페이지 컨테이너 패딩 반응형 (px-4 sm:px-6)
- [x] 페이지 제목 크기 반응형 통일 (text-2xl sm:text-3xl md:text-4xl)
- [x] Home 6개 섹션 패딩·gap·제목 반응형 조정
- [x] Projects/About/PatchNotes/Announcements/Recruit 반응형 개선
- [x] Footer 그리드 2열 모바일 레이아웃
- [x] Header 컨테이너 반응형 패딩
- [x] 카드·폼 패딩 단계별 반응형 (p-4 sm:p-6 md:p-8)

## v0.4.7 (2026-03-06)

- [x] ThemeToggle 애니메이티드 SVG 컴포넌트 (해↔달 모핑)
- [x] 사이트 전체 테마 전환 애니메이션 (theme-transitioning 500ms)
- [x] BrandText 로고 크기 조정
- [x] ProjectCard 아이콘 크기 축소

## v0.4.6 (2026-03-06)

- [x] 라이트 모드 배경 그라디언트 강화 (파스텔→푸른 하늘색 #B8DEFF~#E8F4FD)
- [x] 복합 구름 시스템 (가장자리+코어 2레이어 입체 구름) 전 섹션 적용
- [x] 구름 드리프트 애니메이션 (cloud-drift 20s, cloud-drift-slow 30s)
- [x] 섹션 간 하늘 연속성 확보 (그라디언트 끝/시작 색상 일치)
- [x] sky 디자인 토큰 7단계 팔레트 (tailwind.config.ts)
- [x] cloudDrift/cloudDriftSlow keyframes 추가
- [x] 로고/아이콘 6종 PNG 배경 투명화 (near-white 픽셀 알파 제거)
- [x] mix-blend-multiply CSS 해킹 제거 → 투명 배경 로고로 전환

## v0.4.3 (2026-03-05)

- [x] #1 hasPermission() null/undefined 방어 처리
- [x] #2 OAuth loginWithGoogle isLoading 상태 복구 (try/catch 양쪽 모두)
- [x] #3 FAQ 금색 Q 아이콘 라이트 모드 WCAG AA 대비율 (#FFD700→#B8860B)
- [x] #4 VITE_ADMIN_PASSWORD 제거 → RoleGuard(view_applications) 기반 접근 제어
- [x] #5 user_metadata 런타임 typeof 가드 + isValidRole() 검증
- [x] #6 ErrorBoundary 컴포넌트 생성 + App.tsx 래핑
- [x] #7 빈 상태 UI 5개 페이지 (Announcements, PatchNotes, FaqSection, ServicesSection, UpcomingSection)
- [x] #8 Recruit.tsx → RecruitPositions.tsx 컴포넌트 분리
- [x] #9 recruitStorage.ts 공통 서비스 추출 (localStorage 로직 일원화)
- [x] #10 recruitment.ts 이모지→SVG 아이콘 (PaletteIcon, ClipboardIcon, CodeIcon 신규)

## v0.4.2 (2026-03-05)

- [x] Google OAuth 소셜 로그인 (authService.loginWithGoogle → Supabase OAuth)
- [x] authStore에 loginWithGoogle 액션 추가
- [x] GoogleIcon SVG 컴포넌트 (멀티컬러 공식 로고)
- [x] Login.tsx: Google 로그인 버튼 + authStore 실제 연동 + 라이트 모드 대응
- [x] Register.tsx: Google 시작하기 버튼 + authStore 실제 연동 + 라이트 모드 대응
- [x] 로그인/회원가입 "또는" 구분선 UI

## v0.4.1 (2026-03-05)

- [x] 권한 체계 구현 (팀장/팀원/사용자 역할, RoleGuard 컴포넌트)
- [x] 프로젝트 개요 열람 페이지 (/internal/overview) — 팀원 이상 접근
- [x] patchnotes.ts v0.4.0 데이터 등록 (패치노트 페이지 자동 반영)
- [x] 라이트 모드 텍스트 가시성 WCAG AA 개선 (#8080A0→#5C5C7A, #6A5A8A→#4A4270)
- [x] text-gradient 라이트 모드 진한 톤 조정 (#9B59B6→#D4A017→#E0598B)
- [x] 프로젝트 검증 프로토콜 확장 (코드 흐름 추적, 편의성 검증 추가)

## v0.4.0 (2026-03-05)

- [x] Nebula 테마 디자인 시스템 전면 교체 (Violet + Gold + Pink)
- [x] Cinzel / Cinzel Decorative 디스플레이 폰트 도입
- [x] 랜딩 페이지 6섹션 재구성 (Hero, Services, Why, Upcoming, FAQ, CTA)
- [x] 16종 SVG 아이콘 컴포넌트 + DynamicIcon 공통 컴포넌트
- [x] BrandText / PompCoreLogo 브랜드 텍스트 컴포넌트
- [x] 팀원 모집 페이지 (/recruit) + 지원서 양식
- [x] 관리자 지원서 열람 페이지 (/recruit/admin)
- [x] FAQ 데이터 시스템 (constants/faq.ts)
- [x] Upcoming 서비스 데이터 시스템 (constants/upcoming.ts)
- [x] 관리자 비밀번호 .env 환경변수 분리
- [x] FaqSection CSS grid-rows 트랜지션 애니메이션
- [x] BrandText 타입 시스템 개선 (string 확장)

## v0.3.0 (2026-03-04)

- [x] 패치노트 페이지 (/patchnotes) - 자동 데이터 반영
- [x] 공지사항 페이지 (/announcements) - 고정 공지, 카테고리, 펼치기/접기
- [x] WCAG 2.1 AA 접근성 (skip-nav, aria, focus-visible)
- [x] 한국어 UX 최적화 (Pretendard, keep-all, 행간 1.75)
- [x] prefers-reduced-motion 지원
- [x] 다크 모드 텍스트 오프화이트 전환
- [x] 버튼 최소 터치 타겟 44px
- [x] index.html SEO 기본 (lang, description, title)
- [x] Supabase 미설정 시 방어적 처리 (빈 화면 버그 수정)

## v0.2.0 (2026-03-04)

- [x] 라이트 테마 기본값 전환 (다크 전용 → 라이트 기본 + 다크 모드)
- [x] 다크 모드 토글 (themeStore + Header 버튼)
- [x] Navy 컬러 팔레트 추가 (로고 색상 기반)
- [x] 카드 스타일 이원화 (라이트: 화이트+섀도우, 다크: 글래스모피즘)
- [x] SVG 로고 통합 (pompcore, vault, quest)
- [x] 전체 컴포넌트 라이트/다크 듀얼 모드 적용
- [x] 전체 페이지 라이트/다크 듀얼 모드 적용
- [x] Project 타입 확장 (logoSrc 필드)
- [x] 프로젝트 이식용 템플릿 3종 (docs/templates/)
- [x] 비즈니스 전략 문서화 (AdSense, Polar, Clarity, SEO/GEO)

## v0.1.1 (2026-03-04)

- [x] 메인 페이지 FeaturesSection (서비스 소개, 핵심 가치 4개 카드)
- [x] 메인 페이지 CtaBanner (회원가입 유도 CTA 영역)
- [x] Home 페이지 4단 섹션 구조 확립 (Hero → Features → Projects → CTA)

## v0.1.0 (2026-03-04)

- [x] 프로젝트 기초 구조 (React + TS + Vite + Tailwind)
- [x] PompCore 브랜드 디자인 시스템 (컬러, 애니메이션, 글래스모피즘)
- [x] 공통 UI 컴포넌트 (Button, GlassCard, ProjectCard)
- [x] 레이아웃 시스템 (Header, Footer, Layout)
- [x] 페이지 골격 (Home, Projects, About, Login, Register)
- [x] Supabase 기반 SSO 인증 구조 (authService, authStore)
- [x] 프로젝트 데이터 시스템 (Vault, Quest 등록)
- [x] SPA 라우팅 (react-router-dom)
- [x] 환경변수 분리 (.env, .env.example)
