# 미수정 사항 목록

> 작성일: 2026-03-09
> improvements.md에서 아직 수정되지 않은 항목을 우선순위별로 정리

---

## Critical — 미수정

### C-05. [Packages] SDK에 Vault 도메인 타입 하드코딩
- **파일**: `packages/sdk/src/api-client.ts`
- **문제**: Account, Transaction 등 Vault 전용 타입이 SDK에 정의됨
- **필요 작업**: 타입을 `packages/types/src/vault.types.ts`로 이동 + SDK에서 re-import
- **난이도**: 보통 (패키지 간 의존성 변경)

---

## High — 미수정

### H-01. [Web] 색상 하드코딩 80건+
- **파일**: 전체 (HeroSection, ServicesSection, WhySection 등)
- **문제**: `#7C3AED`, `#FFD700`, `#10B981` 등 반복
- **필요 작업**: `src/constants/colors.ts` 생성 + Tailwind config 통합
- **난이도**: 높음 (대규모 일괄 치환)

### H-02. [Web] 구름/별 배경 코드 6곳 중복
- **파일**: HeroSection, ServicesSection, WhySection, UpcomingSection, FaqSection, CtaBanner
- **필요 작업**: `<CloudBackground>`, `<Starfield>` 재사용 컴포넌트 추출
- **난이도**: 보통

### H-04. [Vault] React.memo 미사용 (47개 컴포넌트)
- **필요 작업**: props가 자주 바뀌지 않는 컴포넌트에 React.memo 적용
- **난이도**: 보통 (성능 프로파일링 선행 권장)

### H-06. [Vault] 대형 컴포넌트 분리 필요
- **파일**: RealEstateDetailPage (459줄), TransactionForm (334줄), SettingsProfilePage (370줄)
- **필요 작업**: 기능 단위로 하위 컴포넌트 분리
- **난이도**: 높음

### H-08. [Packages] API 클라이언트 재시도 없음
- **파일**: `packages/sdk/src/api-client.ts`
- **필요 작업**: 지수 백오프 재시도 로직 추가
- **난이도**: 보통

### H-09. [Packages] currency 포맷 ko-KR 하드코딩
- **파일**: `packages/ui/src/utils/currency.ts`
- **필요 작업**: locale 파라미터 추가 또는 navigator.language 감지
- **난이도**: 쉬움

### H-10. [Packages] @pompcore/types에 DB 엔티티 타입 없음
- **필요 작업**: `vault.types.ts` 추가하여 공유 타입 중앙화
- **난이도**: 보통 (아키텍처 변경)

---

## Medium — 미수정

### M-02. [Web] recruitStorage가 localStorage 사용
- **문제**: 지원서 데이터가 브라우저 초기화 시 유실

### M-03. [Vault] transactionStore 월 이동 시 필터 미초기화
- **문제**: 월 이동 시 기존 카테고리 필터 유지됨

### M-05. [Vault] 금액 입력 min/max 검증 없음
- **문제**: 금액 필드에 상한/하한 검증 없음

### M-06. [Vault] 글래스모피즘 opacity 불일치
- **문제**: bg-white/60, bg-white/80 등 불일치

### M-07. [Vault] DashboardPage 매번 전체 데이터 재로드
- **문제**: 이미 로드된 데이터도 재요청

### M-08. [Packages] Modal 포커스 트랩 불완전
- **문제**: hidden input, aria-hidden 요소가 포커스 대상에서 제외되지 않음

### M-10. [Packages] createAppConfig 환경변수 유효성 미검증
- **문제**: URL/key 형식 검증 없음

---

## Low — 미수정

### L-01. [Web] DynamicIcon에 React.memo 미적용
### L-02. [Web] 반응형 타이포그래피 fluid sizing 미적용
### L-03. [Vault] 비밀번호 변경 확인 다이얼로그 없음
### L-04. [Vault] 즐겨찾기 토글 확인 없이 즉시 실행
### L-05. [Packages] UI에 Skeleton, Toast, Tooltip 컴포넌트 없음
### L-06. [Packages] 패키지별 README 없음

---

## 화면 리뷰 — 미수정

### Web 데스크톱
| ID | 문제 | 심각도 |
|---|---|---|
| V-01 | Projects 카드 아래 하단 여백 과도 | Medium |
| V-02 | Upcoming Academy 카드 단일 배치 | Low |
| V-03 | CTA 버튼 대비 부족 | Medium |
| V-04 | Footer가 홈에서만 미표시 (fullpage) | High |
| V-05~07 | 섹션 여백 과도 | Low |
| V-08 | 공지사항 페이지네이션 없음 | Low |
| V-09 | 패치노트 접기 없음 | Medium |
| V-10 | 비밀번호 찾기 링크 없음 | High |
| V-11 | 비밀번호 강도 표시기 없음 | Medium |
| V-12 | 비밀번호 표시/숨기기 토글 없음 | Low |
| V-13~14 | 프로젝트 카드 높이/여백 | Low |

### Web 모바일
| ID | 문제 | 심각도 |
|---|---|---|
| V-15 | 패치노트 모바일 극도로 긴 스크롤 | Medium |
| V-16 | 홈 Hero 텍스트 겹침 | High |
| V-17 | Why 섹션 제목 누락 | Medium |
| V-18 | CTA 버튼 대비 부족 | Medium |
| V-19 | 사이드 네비 도트 모바일 표시 | Medium |
| V-20 | Footer 미표시 | High |

### Vault 데스크톱
| ID | 문제 | 심각도 |
|---|---|---|
| VV-04 | 정기결제 아이콘 — VV-22에서 수정됨 | Done |
| VV-05 | 비활성 정기결제 시각적 구분 부족 | Low |
| VV-10 | 포트폴리오 목록 "거래 없음" 잘못 표시 | High |
| VV-14 | 문의 빈 상태 버튼 중복 | Low |
| VV-15 | 휴지통에 투자/부동산 카테고리 없음 | High |
| VV-19 | 프로필 현재 비밀번호 입력란 없음 | Medium |

---

## vault/todo.md 미래 과제

- [ ] 테스트 프레임워크 도입 (vitest 권장)
- [ ] 투자/부동산 대시보드 총 자산 통합
- [ ] 휴지통에서 투자/부동산 항목 복원 지원
- [ ] 서비스명 확정
- [ ] 로고 생성
