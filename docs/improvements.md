# PompCore Platform — 개선점 추적 문서

> 작성일: 2026-03-09
> 코드 전수 리뷰 + 화면 리뷰 결과 통합

---

## Critical (즉시 수정 필요)

### C-01. [Web] 404 라우트 없음
- **파일**: `apps/web/src/router/index.tsx`
- **문제**: catch-all 라우트(`path: "*"`) 미설정. 잘못된 URL 접근 시 빈 화면 표시
- **해결**: NotFound 페이지 컴포넌트 생성 + 라우터에 `*` 경로 추가
- **상태**: [x] 완료 (2026-03-09) — NotFound 페이지 생성 + 라우터 `*` 경로 추가

### C-02. [Web] SEO 메타태그 누락
- **파일**: `apps/web/index.html`
- **문제**: Open Graph, Twitter Card, JSON-LD, canonical URL 전부 없음
- **해결**: OG/Twitter 메타태그 + WebApplication JSON-LD + canonical + keywords/author/theme-color 추가
- **상태**: [x] 완료 (2026-03-09)

### C-03. [Web] CSP 헤더 미설정
- **파일**: `apps/web/index.html`
- **문제**: Content Security Policy 헤더 없음
- **해결**: index.html에 CSP meta 태그 + X-Content-Type-Options 추가
- **상태**: [x] 완료 (2026-03-09)

### C-04. [Packages] @pompcore/ui tsup external 누락
- **파일**: `packages/ui/tsup.config.ts`
- **문제**: `@pompcore/types`가 external 목록에 없어 번들에 중복 포함될 수 있음
- **해결**: external 배열에 `@pompcore/types` 추가
- **상태**: [x] 완료 (2026-03-09)

### C-05. [Packages] SDK에 Vault 도메인 타입 하드코딩
- **파일**: `packages/sdk/src/api-client.ts`
- **문제**: Account, Transaction 등 Vault 전용 타입이 SDK에 정의됨. `@pompcore/types`로 이동 필요
- **해결**: 타입을 `packages/types/src/vault.types.ts`로 이동 + SDK에서 re-import
- **상태**: [ ] 미착수

---

## High (빠른 시일 내 수정)

### H-01. [Web] 색상 하드코딩 80건+
- **파일**: 전체 (HeroSection, ServicesSection, WhySection 등)
- **문제**: `#7C3AED`, `#FFD700`, `#10B981` 등이 파일마다 반복. 색상 변경 시 전부 수정 필요
- **해결**: `src/constants/colors.ts` 생성 + Tailwind config 통합
- **상태**: [ ] 미착수

### H-02. [Web] 구름/별 배경 코드 6곳 중복
- **파일**: HeroSection, ServicesSection, WhySection, UpcomingSection, FaqSection, CtaBanner
- **문제**: 동일한 구름/별 렌더링 코드가 복사-붙여넣기됨
- **해결**: `<CloudBackground>`, `<Starfield>` 재사용 컴포넌트 추출
- **상태**: [ ] 미착수

### H-03. [Web] 스크롤 이벤트 throttle 없음
- **파일**: `apps/web/src/components/layout/Header.tsx`
- **문제**: 스크롤 이벤트에 throttle/debounce 없어 매 픽셀마다 핸들러 실행
- **해결**: requestAnimationFrame throttle + passive listener 적용
- **상태**: [x] 완료 (2026-03-09)

### H-04. [Vault] React.memo 미사용 (47개 컴포넌트)
- **파일**: `apps/vault/src/components/` 전체
- **문제**: 모든 컴포넌트가 부모 리렌더 시 함께 리렌더됨
- **해결**: props가 자주 바뀌지 않는 컴포넌트에 React.memo 적용
- **상태**: [ ] 미착수

### H-05. [Vault] 에러 핸들링 불일치
- **파일**: stores/ 전체 (6개 파일, 8곳)
- **문제**: `toUserMessage()` vs `(err as Error).message` 혼용
- **해결**: budgetStore, savingsStore, accountStore, recurringStore, categoryStore, settingsStore에서 `toUserMessage()` 통일
- **상태**: [x] 완료 (2026-03-09)

### H-06. [Vault] 대형 컴포넌트 분리 필요
- **파일**: RealEstateDetailPage (459줄), TransactionForm (334줄), SettingsProfilePage (370줄)
- **문제**: 단일 파일이 300줄 이상. 유지보수 및 성능에 불리
- **해결**: 기능 단위로 하위 컴포넌트 분리
- **상태**: [ ] 미착수

### H-07. [Vault] account.service.ts balances null 체크 누락
- **파일**: `apps/vault/src/services/account.service.ts` (line 54-63)
- **문제**: `balances` 응답이 null일 수 있으나 `.map()` 직접 호출
- **해결**: null guard 추가 (`balances ?? []`)
- **상태**: [x] 이미 적용됨 (line 55에 `balances ?? []` 확인)

### H-08. [Packages] API 클라이언트 재시도 없음
- **파일**: `packages/sdk/src/api-client.ts`
- **문제**: 네트워크 오류나 429 응답 시 단일 시도 후 실패
- **해결**: 지수 백오프 재시도 로직 추가
- **상태**: [ ] 미착수

### H-09. [Packages] currency 포맷 ko-KR 하드코딩
- **파일**: `packages/ui/src/utils/currency.ts`
- **문제**: `Intl.NumberFormat('ko-KR')` 고정. 다국어 사용자 미지원
- **해결**: locale 파라미터 추가 또는 navigator.language 감지
- **상태**: [ ] 미착수

### H-10. [Packages] @pompcore/types에 DB 엔티티 타입 없음
- **파일**: `packages/types/`
- **문제**: Vault DB 엔티티(Account, Transaction 등) 타입이 각 앱에서 개별 정의됨
- **해결**: `vault.types.ts` 추가하여 공유 타입 중앙화
- **상태**: [ ] 미착수

---

## Medium (개선 권장)

### M-01. [Web] 공지사항 카드 키보드 접근 불가
- **파일**: `apps/web/src/pages/Announcements/Announcements.tsx`
- **문제**: `<article>` onClick만 있고 onKeyDown 없음. 키보드 사용자 접근 불가
- **상태**: [x] 완료 (2026-03-09) — role="button" + tabIndex + onKeyDown + aria-expanded + focus-visible 추가

### M-02. [Web] recruitStorage가 localStorage 사용
- **파일**: `apps/web/src/services/recruitStorage.ts`
- **문제**: 지원서 데이터가 localStorage에 저장됨. 브라우저 초기화 시 유실
- **상태**: [ ] 미착수

### M-03. [Vault] transactionStore 월 이동 시 필터 미초기화
- **파일**: `apps/vault/src/stores/transactionStore.ts`
- **문제**: `goToPrevMonth`/`goToNextMonth` 시 기존 카테고리 필터가 유지됨
- **상태**: [ ] 미착수

### M-04. [Vault] useExchangeRates 에러 무시
- **파일**: `apps/vault/src/hooks/useExchangeRates.ts`
- **문제**: catch 블록에서 에러 로깅 없이 무시. 디버깅 어려움
- **상태**: [x] 완료 (2026-03-09) — console.error 로깅 추가

### M-05. [Vault] 금액 입력 min/max 검증 없음
- **파일**: TransactionForm, AccountCard 등
- **문제**: 금액 필드에 상한/하한 검증 없음
- **상태**: [ ] 미착수

### M-06. [Vault] 글래스모피즘 opacity 불일치
- **파일**: Header, Sidebar, 카드 컴포넌트
- **문제**: bg-white/60, bg-white/80 등 불일치
- **상태**: [ ] 미착수

### M-07. [Vault] DashboardPage 매번 전체 데이터 재로드
- **파일**: `apps/vault/src/pages/DashboardPage.tsx`
- **문제**: 대시보드 진입 시 accounts, settings 등 이미 로드된 데이터도 재요청
- **상태**: [ ] 미착수

### M-08. [Packages] Modal 포커스 트랩 불완전
- **파일**: `packages/ui/src/components/Modal.tsx`
- **문제**: hidden input, aria-hidden 요소가 포커스 대상에서 제외되지 않음
- **상태**: [ ] 미착수

### M-09. [Packages] auth store loginWithGoogle 에러 미전파
- **파일**: `packages/auth/src/auth.store.ts`
- **문제**: `loginWithGoogle()`이 에러를 re-throw하지 않음. 호출부에서 에러 감지 불가
- **상태**: [x] 이미 적용됨 (line 57에 `throw e` 확인)

### M-10. [Packages] createAppConfig 환경변수 유효성 미검증
- **파일**: `packages/sdk/src/config.ts`
- **문제**: URL/key 존재 여부만 확인, 형식 검증 없음
- **상태**: [ ] 미착수

---

## Low (여유 있을 때)

### L-01. [Web] DynamicIcon에 React.memo 미적용
- **상태**: [ ] 미착수

### L-02. [Web] 반응형 타이포그래피 fluid sizing 미적용
- **상태**: [ ] 미착수

### L-03. [Vault] 비밀번호 변경 확인 다이얼로그 없음
- **상태**: [ ] 미착수

### L-04. [Vault] 즐겨찾기 토글 확인 없이 즉시 실행
- **상태**: [ ] 미착수

### L-05. [Packages] UI에 Skeleton, Toast, Tooltip 컴포넌트 없음
- **상태**: [ ] 미착수

### L-06. [Packages] 패키지별 README 없음
- **상태**: [ ] 미착수

---

## 화면 리뷰 (진행 중)

> 코드 리뷰에서 발견하지 못한 시각적 문제를 화면별로 추가 기록

### Web (pompcore.cc)

#### 홈 — 데스크톱 (리뷰 완료)

| ID | 섹션 | 문제 | 심각도 |
|---|---|---|---|
| V-01 | Projects | 카드 2개 아래 하단 여백 과도 (화면 50%+ 빈 공간) | Medium |
| V-02 | Upcoming | Academy 카드 1개 좌측 정렬 → 단일 카드일 때 중앙 배치 권장 | Low |
| V-03 | Final CTA | "무료로 시작하기" 버튼 대비 부족 (글래스모피즘 + 보라 배경) | Medium |
| V-04 | 전체 | Footer가 홈에서만 안 보임 (fullpage 스크롤 모드 문제, 다른 페이지는 정상) | High |
| V-05 | Why / FAQ | 섹션 상단 여백 과도 (콘텐츠 위 빈 영역 넓음) | Low |
| V-06 | 전체 | 우측 사이드 네비 도트가 좁은 데스크톱에서 본문 겹침 가능 | Low |
| V-07 | FAQ | FAQ 항목 아래 하단 여백 과도 | Low |

#### 공지사항 — 데스크톱 (리뷰 완료)

| ID | 문제 | 심각도 |
|---|---|---|
| V-08 | 페이지네이션 없음 — 공지 증가 시 스크롤 길어짐 | Low |

#### 패치노트 — 데스크톱 (리뷰 완료)

| ID | 문제 | 심각도 |
|---|---|---|
| V-09 | 모든 버전이 한 페이지에 펼쳐져 있음 — 페이지네이션/접기 없음 | Medium |

#### 소개 — 데스크톱 (리뷰 완료)

이슈 없음. Vision/Mission + 핵심 가치 레이아웃 깔끔.

#### 채용 — 데스크톱 (리뷰 완료)

이슈 없음. 포지션 카드 + 지원 폼 구조 양호.

#### 로그인/회원가입 — 데스크톱 (리뷰 완료)

| ID | 문제 | 심각도 |
|---|---|---|
| V-10 | 로그인 페이지에 "비밀번호 찾기" 링크 없음 | High |
| V-11 | 회원가입 비밀번호 강도 표시기 없음 | Medium |
| V-12 | 비밀번호 표시/숨기기 토글 없음 (로그인+회원가입 공통) | Low |

#### 프로젝트 — 데스크톱 (리뷰 완료)

| ID | 문제 | 심각도 |
|---|---|---|
| V-13 | Quest 카드에 링크 없어 Vault 카드와 높이 불일치 | Low |
| V-14 | 카드 아래 하단 빈 공간 과도 | Low |

#### 모바일 뷰 (390x844, 리뷰 완료)

| ID | 페이지 | 문제 | 심각도 |
|---|---|---|---|
| V-15 | 패치노트 | 모바일에서 모든 버전 펼쳐져 극도로 긴 스크롤 | Medium |

| V-16 | 홈 Hero | 헤더 텍스트 "모험가여,"가 로고/네비 영역과 겹침 | High |
| V-17 | 홈 Why | 섹션 제목 "왜 PompCore인가요?" 누락 — 카드만 표시 | Medium |
| V-18 | 홈 CTA | "무료로 시작하기" 버튼 대비 부족 (V-03 모바일) | Medium |
| V-19 | 홈 전체 | 우측 사이드 네비 도트가 모바일에서도 표시 — 불필요 + 터치 겹침 | Medium |
| V-20 | 홈 전체 | Footer 미표시 (fullpage 모드, V-04 모바일) | High |

- 프로젝트, 공지사항, 소개, 채용, 로그인, 회원가입: 반응형 정상

### Vault (vault.pompcore.cc)

#### 대시보드 — 데스크톱 (리뷰 완료)

| ID | 문제 | 심각도 |
|---|---|---|
| VV-01 | 대시보드 전체적으로 양호. 특이 이슈 없음 | — |

#### 통장 — 데스크톱 (리뷰 완료)

| ID | 문제 | 심각도 |
|---|---|---|
| VV-02 | 통장 목록/편집 모달 정상 동작. 특이 이슈 없음 | — |

#### 거래내역 — 데스크톱 (리뷰 완료)

| ID | 문제 | 심각도 |
|---|---|---|
| VV-03 | 거래내역 목록/필터(수입/지출) 정상. 특이 이슈 없음 | — |

#### 정기결제 — 데스크톱 (리뷰 완료)

| ID | 문제 | 심각도 |
|---|---|---|
| VV-04 | 아이콘이 컴포넌트명 텍스트로 표시됨 (예: "Smartphone 통신비", "Home 주거비") — 아이콘 렌더링 실패 | Critical |
| VV-05 | 비활성 정기결제에 시각적 구분 부족 — 활성과 동일한 스타일로 표시됨 | Low |

#### 예/적금 — 데스크톱 (리뷰 완료)

| ID | 문제 | 심각도 |
|---|---|---|
| VV-06 | 정기예금/적금/자유적금/청약 4종 모두 정상 표시 | — |

#### 예산 — 데스크톱 (리뷰 완료)

| ID | 문제 | 심각도 |
|---|---|---|
| VV-07 | 예산 카드 정상 표시. 가상/실제 예산 구분 양호 | — |

#### 통계 — 데스크톱 (리뷰 완료)

| ID | 문제 | 심각도 |
|---|---|---|
| VV-08 | 카테고리 차트에서 아이콘이 컴포넌트명 텍스트로 표시됨 (예: "UtensilsCrossed 식비") — VV-04와 동일 원인 | Critical |
| VV-09 | 6개월/12개월 보기 전환 정상 동작 | — |

#### 투자 포트폴리오 — 데스크톱 (리뷰 완료)

| ID | 문제 | 심각도 |
|---|---|---|
| VV-10 | 포트폴리오 목록에서 "거래 없음" 표시 — 거래 데이터 존재하나 표시 안 됨 | High |
| VV-11 | 포트폴리오 상세 페이지는 보유 종목/거래 내역/손익 정상 표시 | — |

#### 부동산 — 데스크톱 (리뷰 완료)

| ID | 문제 | 심각도 |
|---|---|---|
| VV-12 | 부동산 목록/상세 정상. 계약(월세/전세) + 비용 내역 표시 양호 | — |

#### 공지사항 — 데스크톱 (리뷰 완료)

| ID | 문제 | 심각도 |
|---|---|---|
| VV-13 | 빈 상태 UI 정상 ("공지사항이 없습니다") | — |

#### 문의 — 데스크톱 (리뷰 완료)

| ID | 문제 | 심각도 |
|---|---|---|
| VV-14 | 상단 "+ 문의하기" 버튼과 빈 상태의 "문의하기" 버튼이 중복 — 빈 상태일 때 상단 버튼 숨기거나 빈 상태 버튼 제거 권장 | Low |

#### 휴지통 — 데스크톱 (리뷰 완료)

| ID | 문제 | 심각도 |
|---|---|---|
| VV-15 | 삭제한 투자 포트폴리오(1건)와 부동산(1건)이 휴지통에 미표시 — 필터 탭에 "투자"/"부동산" 카테고리 없음 | High |
| VV-16 | 표시되는 4건(예산/통장/카테고리/거래내역)은 정상 동작 | — |

#### 카테고리 관리 — 데스크톱 (리뷰 완료)

| ID | 문제 | 심각도 |
|---|---|---|
| VV-17 | 아이콘이 컴포넌트명 텍스트로 표시됨 (UtensilsCrossed, Car, Home 등) — VV-04와 동일 원인 | Critical |
| VV-18 | 수입 탭 미확인 — 지출 탭만 캡처됨 | — |

#### 설정 — 데스크톱 (리뷰 완료)

| ID | 문제 | 심각도 |
|---|---|---|
| VV-19 | 프로필 페이지: 현재 비밀번호 입력란 없음 — 비밀번호 변경 시 본인 확인 불가 | Medium |
| VV-20 | 메뉴 설정/환경설정 정상 | — |
| VV-21 | 설정 메인: 테마/크레딧/친구 "준비 중" 비활성 표시 양호 | — |

#### 공통 이슈 — 데스크톱

| ID | 문제 | 심각도 |
|---|---|---|
| VV-22 | ~~아이콘 렌더링 실패~~ **수정 완료 (2026-03-09)**: 레거시 lucide 이름 매핑 추가 + CategoryItem/RecurringCard에서 renderCategoryIcon() 사용 + 통계 차트 라벨에서 아이콘 텍스트 제거 | ~~Critical~~ Done |

#### 모바일 뷰 (390x844, 리뷰 완료)

**검사 페이지 목록**

| # | 페이지 | 결과 |
|---|--------|------|
| 0 | 사이드바 (햄버거 메뉴) | 양호 |
| 1 | 대시보드 (홈) | 이슈 있음 |
| 2 | 통장 목록 | 양호 |
| 3 | 거래내역 | 양호 |
| 4 | 정기결제 | 이슈 있음 |
| 5 | 예/적금 — 예금 | 양호 |
| 6 | 예/적금 — 적금 | 양호 |
| 7 | 예/적금 — 자유적금 | 양호 |
| 8 | 예/적금 — 청약 | 양호 |
| 9 | 예산 | 양호 |
| 10 | 통계 (6개월) | 이슈 있음 |
| 11 | 통계 (12개월) | 이슈 있음 |
| 12 | 공지사항 | 양호 |
| 13 | 문의 | 양호 |
| 14 | 설정 메인 | 양호 |
| 15 | 프로필 | 이슈 있음 |
| 16 | 메뉴 설정 | 양호 |
| 17 | 카테고리 관리 | 이슈 있음 |
| 18 | 환경설정 | 양호 |
| 19 | 휴지통 | 양호 |

**발견된 이슈**

| ID | 페이지 | 문제 | 심각도 |
|---|---|---|---|
| VM-01 | 대시보드 | 하단 네비게이션 바 아래에 콘텐츠 겹침 — "KT 통신비", "삼성생명 보험" + "거래 추가/이체/통계" 버튼이 nav 뒤로 보임 (padding-bottom 부족) | High |
| VM-02 | 정기결제 | 하단 네비게이션 바 아래 콘텐츠 겹침 — "헬스장 회원권" 등 항목이 nav에 가려짐 (VM-01과 동일 원인) | High |
| VM-03 | 프로필 | 하단 네비게이션 바 아래 콘텐츠 겹침 — "연동되지 않음", 위험 영역(로그아웃/탈퇴)이 nav 뒤로 보임 (VM-01과 동일 원인) | High |
| VM-04 | 통계 (6개월) | ~~카테고리별 지출 도넛 차트 왼쪽 라벨 잘림~~ **수정 완료 (2026-03-09)**: 라벨에서 아이콘 텍스트 제거 + margin 80→100px 확대 | ~~Medium~~ Done |
| VM-05 | 통계 (12개월) | ~~VM-04와 동일~~ **수정 완료** (VM-04와 동일) | ~~Medium~~ Done |
| VM-06 | 카테고리 관리 | ~~아이콘이 컴포넌트명 텍스트로 표시됨~~ **수정 완료** (VV-22와 동일) | ~~Critical~~ Done |

**공통 이슈: 하단 네비게이션 바 콘텐츠 겹침 (VM-01, VM-02, VM-03)**

대시보드, 정기결제, 프로필 3개 페이지에서 동일 현상 발생. 페이지 메인 콘텐츠 영역에 bottom navigation bar 높이만큼의 `padding-bottom`이 부족하여 스크롤 최하단 콘텐츠가 nav 뒤에 가려짐.
**수정 완료 (2026-03-09)**: AppShell.tsx에서 모바일 `pb-20`(80px) → `pb-24`(96px)로 증가. 홈 탭 돌출부 포함 여유 확보.
