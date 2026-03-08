---
name: uxui-optimizer
description: UX/UI 최적화 스킬. UI 컴포넌트, 화면, 앱, 웹사이트의 UX/UI를 개선하거나 검토할 때 사용한다. 국내외 주요 디자인 시스템의 원칙을 종합하여 적용한다.
---

## Context Activation Rule
This skill should only be loaded when the task directly requires it.
- **Load**: UX/UI review, accessibility audit, design system compliance check
- **Do not load**: backend work, database schema, documentation-only tasks, SEO work

# UX/UI 최적화 스킬

## 참고 디자인 시스템

| 카테고리 | 시스템 |
|---|---|
| 플랫폼 | Material Design 3 (Google), Apple HIG, Fluent 2 (Microsoft) |
| UI 라이브러리 | MUI, Bootstrap 5, Chakra UI |
| 국내 | SOLID 2.0 (신한은행), KRDS (디지털정부서비스) |

## 워크플로우

### 1단계: 컨텍스트 파악
- 플랫폼, 대상 사용자, 도메인, 요청 유형

### 2단계: 적용할 가이드라인 선택
- 모바일 Android -> Material Design 3
- 모바일 iOS -> Apple HIG
- 웹/데스크탑 -> Fluent 2 또는 MUI
- 공공 서비스 -> KRDS
- 금융 서비스 -> SOLID 2.0

### 3단계: UX/UI 분석 및 개선

핵심 체크리스트:

**정보 구조 & 내비게이션**
- 현재 위치 파악 가능? 3번 이내 탭/클릭으로 도달? 뒤로가기/취소 명확?

**컴포넌트 & 인터랙션**
- 터치 타깃 44x44pt 이상? 로딩/빈 상태 정의? 오류 메시지 친절?

**타이포그래피 & 레이아웃**
- 시각적 계층구조 명확? 여백 일관된 스케일(4/8px)?

**색상 & 접근성**
- WCAG AA 대비(4.5:1)? 색상만으로 정보 전달하지 않는가?

**피드백 & 상태**
- 즉각적 피드백? 진행 상황 표시? 성공/실패 메시지 명확?

**국내 사용자 특화**
- 한글 최소 14px, 행간 1.5배? 국내 관습 반영?

## 컴포넌트별 가이드

- 버튼: Primary 화면당 1개, 터치환경은 lg(48px)
- 폼: 라벨은 인풋 위에, 플레이스홀더만으로 대체 금지
- 카드: 호버 시 섀도우 상승 + translateY(-2px)
- 모달: ESC/오버레이 클릭/X 버튼 모두 닫기 지원
- 네비게이션: 모바일은 하단 탭바, 웹은 좌측 사이드바 또는 상단 GNB
- 빈 상태: 일러스트 + 제목 + 설명 + CTA 버튼

## 코드 품질 기준

- CSS 변수 기반 테마 관리
- 반응형: 모바일 퍼스트 (min-width)
- 접근성: aria-label, role, tabindex
- 포커스: :focus-visible 활용
- 애니메이션: prefers-reduced-motion 대응
