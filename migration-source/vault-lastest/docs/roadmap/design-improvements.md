# Vault 디자인 개선 계획

> 평가일: 2026-03-07 | 전체 등급: B+ (7.5/10)

## 평가 요약

| 항목 | 등급 | 비고 |
|------|------|------|
| 레이아웃 구조 | B+ | NAV 데이터 3곳 중복 |
| 반응형 디자인 | B | 태블릿 UX 미흡 |
| 다크모드 | A- | 배경 전환 성능, 일부 대비 부족 |
| 글래스모피즘 | A | opacity 비체계적 |
| 네비게이션 UX | B+ | 모바일/데스크톱 항목 불일치 |
| 접근성 | B | 색상 대비 검증 필요 |
| 애니메이션 | A | 성능 최적화 부재 |
| 컴포넌트 일관성 | B- | 버튼/인풋/에러배너 스타일 불일치 |

---

## 1순위: 공통 컴포넌트 생성

### 1-1. Button 컴포넌트

**문제**: 버튼 크기(px-4 py-2 vs px-4 py-3 vs px-5 py-2.5), 폰트(font-semibold vs font-medium), disabled 스타일이 페이지마다 다름.

**생성할 파일**: `src/components/common/Button.tsx`

```tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  isLoading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
}
```

- primary: bg-vault-color text-white
- secondary: border border-vault-color/30 text-vault-color
- danger: bg-red-500 text-white
- ghost: text-navy/70 hover:bg-navy/5
- size sm: px-3 py-1.5 text-xs
- size md: px-4 py-2.5 text-sm
- size lg: px-5 py-3 text-sm

### 1-2. FormField 컴포넌트

**문제**: 인풋 필드 스타일이 모든 페이지에서 인라인 반복 (border border-navy/10 bg-white/60 px-3 py-2.5...).

**생성할 파일**: `src/components/common/FormField.tsx`

```tsx
interface FormFieldProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'date' | 'number';
  error?: string;
  helperText?: string;
  disabled?: boolean;
  readOnly?: boolean;
}
```

- FormInput, FormSelect, FormTextarea 세 종류
- 에러 상태: border-red-400, 에러 메시지 표시
- 다크모드: dark:bg-surface-dark/60 dark:border-white/10

### 1-3. AlertBanner 컴포넌트

**문제**: 에러 배너가 DashboardPage, StatisticsPage, TransactionsPage 등에서 각각 인라인으로 정의됨.

**생성할 파일**: `src/components/common/AlertBanner.tsx`

```tsx
interface AlertBannerProps {
  variant: 'error' | 'warning' | 'success' | 'info';
  message: string;
  onClose?: () => void;
}
```

**적용 대상 페이지**: DashboardPage, AccountsPage, BudgetPage, RecurringPage, SavingsPage, StatisticsPage, TransactionsPage, AnnouncementsPage, TrashPage

---

## 2순위: 네비게이션 구조 개선

### 2-1. 네비게이션 데이터 중앙화

**문제**: Sidebar.tsx, MobileSidebar.tsx, BottomNav.tsx에서 NAV_ITEMS를 각각 정의. 메뉴 추가 시 3곳 수정 필요.

**생성할 파일**: `src/constants/navConfig.ts`

```tsx
export const NAV_ITEMS: NavItem[] = [...]; // 전체 메뉴
export const BOTTOM_TAB_REGISTRY: Record<string, TabItem> = {...};
export const DEFAULT_BOTTOM_TABS: string[] = [...];
```

**수정 대상**: Sidebar.tsx, MobileSidebar.tsx, BottomNav.tsx에서 import로 교체

### 2-2. 모바일 메뉴 버튼 시각 강화

**문제**: hamburger 아이콘이 `text-navy/60`으로 너무 옅어 사용자가 못 찾을 수 있음.

**수정 대상**: Header.tsx

```
변경 전: text-navy/60 hover:bg-navy/5 dark:text-gray-400
변경 후: text-navy hover:bg-navy/10 dark:text-gray-200 dark:hover:bg-white/10
```

### 2-3. 헤더 로고 영역 개선

**문제**: 모바일에서 메뉴버튼(좌) + 로고(중앙) + 토글/프로필(우) 배치인데, 로고가 `justify-between` 가운데 정렬되지 않음.

**해결**: 로고에 `absolute left-1/2 -translate-x-1/2` 적용하여 정확히 중앙 배치

---

## 3순위: 디자인 토큰 체계화

### 3-1. 글래스모피즘 opacity 토큰화

**문제**: bg-white/60, /80, /95가 기준 없이 혼용됨.

**tailwind.config.ts에 추가**:

```
glass-overlay: rgba(255,255,255,0.95)  // 모바일 사이드바, 드롭다운
glass-surface: rgba(255,255,255,0.80)  // 하단탭
glass-bg: rgba(255,255,255,0.60)       // 헤더, 사이드바
```

### 3-2. 타이포그래피 스케일 정의

**문제**: 페이지 제목이 모두 text-xl, 라벨 크기가 text-xs와 text-sm 혼용.

**tailwind.config.ts에 추가**:

```
fontSize:
  display: 24px / 1.3 / 700    (페이지 제목)
  heading: 18px / 1.4 / 600    (섹션 제목)
  body: 14px / 1.75 / 400      (본문)
  label: 13px / 1.5 / 500      (라벨)
  caption: 12px / 1.5 / 400    (보조 텍스트)
```

### 3-3. 색상 의미 상수화

**문제**: 에러(red), 성공(green), 경고(yellow) 색상이 하드코딩.

**tailwind.config.ts에 추가**:

```
semantic-success: #10B981
semantic-danger: #EF4444
semantic-warning: #F59E0B
semantic-info: #3B82F6
```

---

## 4순위: 접근성 & 성능

### 4-1. WCAG AA 색상 대비 검증

- text-navy/70 vs bg-white 대비 확인
- dark:text-gray-400 vs dark:bg-surface-dark 대비 확인
- 활성 탭의 색상 외 시각 신호 추가 (underline 또는 font-weight)

### 4-2. ThemeBackground 성능 최적화

- 라이트/다크 전환 시 opacity fade로 변경 (전체 재렌더 방지)
- 모바일에서 구름 blur 값 축소 (blur-[25px] → blur-[15px])
- will-change: transform 추가
- 저사양 디바이스에서 파티클 수 감소

### 4-3. MobileSidebar 접근성 보완

- 닫힌 상태에서 `aria-hidden="true"` 추가
- 메뉴 열기 버튼에 `aria-expanded` 추가

### 4-4. 가로 모드(landscape) 대응

```css
@media (max-height: 500px) {
  header { height: 40px; }
  /* 하단탭 높이 축소 */
}
```

---

## 5순위: 추가 개선

### 5-1. PageHeader 컴포넌트

- 페이지 제목 + 뒤로가기 + 액션 버튼을 통합하는 공통 헤더
- 현재 각 페이지에서 개별 구현 중

### 5-2. Toast 알림 시스템

- 성공/에러 알림을 우측 상단 토스트로 표시
- zustand store로 관리

### 5-3. EmptyState 개선

- size 옵션 추가 (sm/md/lg)
- secondary action 지원
- DashboardPage 간단한 텍스트를 EmptyState로 교체

### 5-4. BottomNav 커스터마이징 로직 강화

- 유효하지 않은 탭만 폴백 (전체 폴백 대신)
- 부족한 탭은 기본값으로 채우기
