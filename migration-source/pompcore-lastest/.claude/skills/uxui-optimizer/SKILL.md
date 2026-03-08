---
name: uxui-optimizer
description: UX/UI 최적화 스킬. 사용자가 UI 컴포넌트, 화면, 앱, 웹사이트의 UX/UI를 개선하거나 검토해달라고 요청할 때 반드시 사용한다. "UX 개선해줘", "UI 이쁘게 만들어줘", "컴포넌트 디자인", "사용성 검토", "디자인 시스템 기반으로 만들어줘", "접근성 개선", "모바일 UX", "웹 UX 최적화", "버튼/폼/카드/네비게이션 디자인" 등 UX/UI 관련 요청이 오면 무조건 이 스킬을 따른다. 국내외 주요 디자인 시스템(Material Design, Apple HIG, Fluent2, MUI, Bootstrap, Chakra UI, 신한은행 SOLID 2.0, 디지털정부 KRDS)의 원칙을 종합하여 적용한다.
---

# UX/UI 최적화 스킬

국내외 주요 디자인 시스템과 가이드라인을 종합 적용하여 UX/UI를 최적화한다.

## 참고 디자인 시스템 출처

| 카테고리 | 시스템 | URL |
|---|---|---|
| 플랫폼 가이드라인 | Material Design 3 (Google) | https://m3.material.io/ |
| 플랫폼 가이드라인 | Human Interface Guidelines (Apple) | https://developer.apple.com/design/human-interface-guidelines/ |
| 플랫폼 가이드라인 | Fluent 2 (Microsoft) | https://fluent2.microsoft.design/ |
| UI 라이브러리 | MUI | https://mui.com/ |
| UI 라이브러리 | Bootstrap 5 | https://getbootstrap.com/docs/5.3/components/ |
| UI 라이브러리 | Chakra UI | https://v2.chakra-ui.com/docs/components |
| 국내 가이드라인 | SOLID 2.0 (신한은행) | https://ux.shinhan.com/155fe4737/p/260a2b- |
| 국내 가이드라인 | KRDS (디지털정부서비스) | https://uiux.egovframe.go.kr/guide/index.html |
| 종합 플랫폼 | Design Systems Repo | https://designsystemsrepo.com/design-systems |
| 종합 플랫폼 | The Component Gallery | https://component.gallery/ |
| 케이스 스터디 | Toss Slash 22 | https://toss.im/slash-22/sessions/1-3 |

---

## 워크플로우

### 1단계: 컨텍스트 파악

최적화 요청을 받으면 먼저 아래 항목을 파악한다:

- **플랫폼**: 웹 / 모바일(iOS, Android) / 데스크탑 / 크로스플랫폼
- **대상 사용자**: 일반 사용자 / 기업 사용자 / 고령자 / 국내 vs 글로벌
- **도메인**: 금융 / 커머스 / 헬스케어 / 공공서비스 / SaaS 등
- **요청 유형**: 신규 제작 / 기존 개선 / 컴포넌트 단위 / 전체 화면

모호한 경우 ask_user_input 도구를 활용하여 빠르게 확인한다.

### 2단계: 적용할 가이드라인 선택

플랫폼과 컨텍스트에 따라 **주요 참고 시스템을 선택**한다:

```
모바일 앱 (Android 기반)  → Material Design 3 우선
모바일 앱 (iOS 기반)      → Apple HIG 우선
웹/데스크탑 앱            → Fluent 2 또는 MUI 우선
공공/정부 서비스          → KRDS (디지털정부서비스) 우선
금융 서비스               → SOLID 2.0 (신한은행) 참고
컴포넌트 구현             → Bootstrap / Chakra UI / MUI 참고
다양한 예시 비교          → Component Gallery / Design Systems Repo 참고
```

복수의 가이드라인을 교차 참고하는 것을 권장한다.

### 3단계: UX/UI 분석 및 개선

#### 핵심 UX 원칙 체크리스트

아래 항목을 기준으로 현재 상태를 진단하고 개선안을 제시한다:

**[정보 구조 & 내비게이션]**
- [ ] 사용자가 현재 위치를 파악할 수 있는가? (브레드크럼, 탭 하이라이트)
- [ ] 주요 작업까지 3번 이내의 탭/클릭으로 도달 가능한가?
- [ ] 뒤로가기, 취소, 실행취소 경로가 명확한가?
- [ ] 검색 기능이 필요한 복잡도인가?

**[컴포넌트 & 인터랙션]**
- [ ] 버튼 크기가 터치 타깃 최소값(44×44pt) 이상인가?
- [ ] 클릭/탭 가능한 요소가 시각적으로 명확히 구분되는가?
- [ ] 로딩/스켈레톤 상태가 정의되어 있는가?
- [ ] 빈 상태(Empty State)가 처리되어 있는가?
- [ ] 오류 상태 메시지가 친절하고 해결 방향을 제시하는가?

**[타이포그래피 & 레이아웃]**
- [ ] 시각적 계층구조(제목 > 본문 > 보조 정보)가 명확한가?
- [ ] 줄 길이가 적정한가? (웹 기준 60~80자 권장)
- [ ] 여백이 일관된 스케일(4/8px 단위)을 따르는가?
- [ ] 정보 밀도가 플랫폼에 맞는가?

**[색상 & 접근성]**
- [ ] 텍스트-배경 색상 대비가 WCAG AA 기준(4.5:1) 이상인가?
- [ ] 색상만으로 정보를 전달하지 않는가? (아이콘, 텍스트 보조)
- [ ] 다크모드 대응이 필요한가?
- [ ] 색각 이상자를 고려한 색상 선택인가?

**[피드백 & 상태]**
- [ ] 사용자 액션에 즉각적인 시각/촉각 피드백이 있는가?
- [ ] 긴 작업의 진행 상황이 표시되는가?
- [ ] 성공/실패 메시지가 명확하고 일시적으로 표시되는가?

**[국내 사용자 특화 (해당 시)]**
- [ ] 한글 폰트가 가독성을 고려한 적절한 크기/행간인가? (최소 14px, 행간 1.5배 이상)
- [ ] 국내 사용자 관습(예: 주민번호 입력 형식, 날짜 형식)을 반영했는가?
- [ ] 금융/공공 도메인 특화 패턴(토스, 카카오뱅크, 신한 스타일)을 참고했는가?

---

## 컴포넌트별 최적화 가이드

### 버튼 (Button)
```
Primary   → 화면당 1개 권장, 강한 시각 강조
Secondary → 보조 액션, Primary보다 낮은 강조도
Ghost/Text → 취소, 링크형 액션에 사용
Danger    → 파괴적 액션(삭제 등)에는 빨간 계열 사용
크기: sm(32px) / md(40px) / lg(48px), 터치환경은 항상 lg
```

### 폼 & 입력 (Form & Input)
```
라벨: 항상 인풋 위에 (플레이스홀더만으로 대체 금지)
오류: 인풋 하단에 빨간 텍스트 + 아이콘
도움말: 인풋 하단에 회색 텍스트
필수/선택: 명시적으로 표기 (asterisk * 또는 "(선택)" 텍스트)
비밀번호: 항상 표시/숨기기 토글 제공
```

### 카드 (Card)
```
섀도우: 0단계(flat) / 1단계(subtle) / 2단계(elevated)
호버: 섀도우 한 단계 상승 + 미묘한 translateY(-2px)
클릭 가능: cursor: pointer + 포커스 링 필수
내용 계층: 이미지 > 제목 > 설명 > 메타정보 > 액션
```

### 모달 & 다이얼로그 (Modal)
```
제목: 항상 포함, 행동 지향적으로 ("정말 삭제할까요?")
버튼 순서: 취소(좌) / 확인(우), 파괴적 액션은 우측에 빨간 버튼
배경: 반투명 오버레이 (rgba(0,0,0,0.5))
닫기: ESC 키, 오버레이 클릭, X 버튼 모두 지원
크기: 내용에 맞게, 모바일은 바텀시트로 대체 고려
```

### 네비게이션 (Navigation)
```
모바일: 하단 탭바 (최대 5개 항목)
웹: 좌측 사이드바 (복잡한 앱) 또는 상단 GNB (마케팅 사이트)
현재 페이지: 명확한 시각적 표시 (색상 + 굵기 변화)
아이콘+텍스트 조합이 아이콘 단독보다 항상 우수
```

### 빈 상태 (Empty State)
```
일러스트 또는 아이콘: 긍정적/중립적 이미지
제목: 상황을 설명하는 문장 ("아직 항목이 없어요")
설명: 다음 할 행동을 안내 ("첫 항목을 추가해보세요")
CTA 버튼: 행동을 유도하는 Primary 버튼
```

---

## 구현 시 코드 품질 기준

```css
/* 일관된 스페이싱 스케일 (4px 기반) */
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
--space-12: 48px;
--space-16: 64px;

/* 타이포그래피 스케일 */
--text-xs: 12px;
--text-sm: 14px;
--text-base: 16px;
--text-lg: 18px;
--text-xl: 20px;
--text-2xl: 24px;
--text-3xl: 30px;

/* 색상 시맨틱 토큰 */
--color-primary: ...;
--color-primary-hover: ...;
--color-error: ...;
--color-success: ...;
--color-warning: ...;
--color-text-primary: ...;
--color-text-secondary: ...;
--color-bg-surface: ...;
--color-bg-muted: ...;
```

**코드 작성 시 지켜야 할 사항:**
- CSS 변수 기반으로 테마 관리
- 반응형: 모바일 퍼스트 (`min-width` 미디어쿼리)
- 접근성: `aria-label`, `role`, `tabindex` 적절히 사용
- 포커스 스타일 커스텀 (`:focus-visible` 활용)
- 애니메이션: `prefers-reduced-motion` 미디어쿼리 대응

---

## 산출물 형식

요청 유형에 따라 다음 형식으로 결과물을 제공한다:

| 요청 유형 | 산출물 |
|---|---|
| 분석/검토 | 체크리스트 기반 진단 리포트 + 우선순위별 개선 제안 |
| 컴포넌트 제작 | 실행 가능한 HTML/CSS/React 코드 + 사용 가이드 |
| 화면 개선 | Before/After 비교 또는 개선된 전체 코드 |
| 디자인 시스템 구축 | 토큰 정의 + 컴포넌트 스펙 문서 |

개선 제안 시에는 항상 **근거(어느 가이드라인 기준인지)**를 함께 제시한다.

---

## 참고 파일

- `references/guidelines-summary.md` — 각 디자인 시스템별 핵심 원칙 요약
- `references/korean-ux-patterns.md` — 국내 서비스(토스, 카카오, 네이버 등) UX 패턴 정리
