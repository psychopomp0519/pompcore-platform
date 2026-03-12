# PompCore Design System — Nebula

> 개발자가 동일한 디자인 스타일을 일관되게 유지하기 위한 설계 레퍼런스
>
> 최종 업데이트: 2026-03-12 | v1.0

---

## 1. 디자인 토큰

### 1.1 컬러 토큰

#### 플랫폼 공통

```
brand:          #7C3AED   // 메인 브랜드 (Violet)
brand-light:    #A855F7
brand-600:      #6D28D9
accent-gold:    #FFD700   // 보상/강조
accent-pink:    #EC4899   // 하이라이트/알림
```

#### 서비스별 액센트

```
// PompCore
pompcore-primary:   #7C3AED
pompcore-light:     #A855F7
pompcore-deep:      #6D28D9

// Vault
vault-primary:      #10B981
vault-light:        #06D6A0
vault-deep:         #059669

// Quest
quest-primary:      #3B82F6
quest-light:        #06B6D4
quest-deep:         #2563EB

// Forge
forge-primary:      #F97316
forge-light:        #FB923C
forge-deep:         #EA580C

// Academy
academy-primary:    #FBBF24
academy-light:      #FCD34D
academy-deep:       #F59E0B
```

#### 서피스 (배경)

```
// 다크 모드
surface-dark-1:     #0C0818   // 전체 배경
surface-dark-2:     #110D20   // 카드/섹션
surface-dark-3:     #150F28   // 오버레이/모달
surface-card-dark:  rgba(30, 41, 59, 0.5)   // 글래스 카드

// 라이트 모드
surface-light:      #FAF8FF   // 전체 배경 (하늘 그라디언트 위)
surface-card-light: rgba(255, 255, 255, 0.8) // 글래스 카드

// 텍스트
navy:               #2B3442   // 라이트 모드 기본 텍스트
navy-light:         #64748B   // 보조 텍스트
```

#### 하늘 팔레트 (라이트 모드 배경)

```
sky-deep:   #87CEEB
sky-mid:    #B0DCEF
sky-light:  #C4E5F3
sky-pale:   #D6ECF7
sky-faint:  #E5F2FA
sky-mist:   #F0F7FC
sky-soft:   #F5FAFD
```

### 1.2 간격 토큰

```
spacing-xs:   4px    // 0.25rem
spacing-sm:   8px    // 0.5rem
spacing-md:   16px   // 1rem
spacing-lg:   24px   // 1.5rem
spacing-xl:   32px   // 2rem
spacing-2xl:  48px   // 3rem
spacing-3xl:  64px   // 4rem
```

### 1.3 모서리 반경

```
radius-sm:    8px    // rounded-lg
radius-md:    12px   // rounded-xl
radius-lg:    16px   // rounded-2xl
radius-full:  9999px // rounded-full (뱃지, 원형)
```

### 1.4 그림자

```
shadow-card:        0 2px 12px rgba(0, 0, 0, 0.08)
shadow-card-hover:  0 8px 24px rgba(0, 0, 0, 0.12)
shadow-glass:       0 4px 16px rgba(0, 0, 0, 0.06)
shadow-glow-sm:     0 0 8px {color}/20     // 미세 글로우
shadow-glow-md:     0 0 16px {color}/25    // 중간 글로우
shadow-glow-lg:     0 0 24px {color}/30    // 강한 글로우 (호버)
```

### 1.5 트랜지션

```
transition-fast:    150ms ease
transition-base:    200ms ease
transition-smooth:  300ms ease-out
transition-slow:    500ms ease-out
```

---

## 2. 컴포넌트 패턴

### 2.1 GlassCard

모든 정보 컨테이너의 기본 패턴.

```tsx
// 라이트 모드
className="rounded-2xl border border-slate-200 bg-white/80
           shadow-card backdrop-blur-[16px]"

// 다크 모드
className="dark:border-white/10 dark:bg-surface-card-dark"

// 패딩 프리셋
padding="sm"  → p-3
padding="md"  → p-4 desktop:p-5
padding="lg"  → p-6 desktop:p-8

// 호버 가능
hoverable → "transition-shadow cursor-pointer hover:shadow-card-hover"
```

#### RPG 강화 변형 (선택적)

카드를 더 게임 UI처럼 만들고 싶을 때:

```tsx
// 상단 액센트 라인
<div className="h-0.5 bg-gradient-to-r from-transparent via-{service-color} to-transparent" />

// L자 코너 장식 (4개)
<div className="absolute top-0 left-0 w-3 h-3
                border-t border-l border-{service-color}/20" />

// 호버 글로우 보더
hover → "border-{service-color}/30 shadow-[0_0_12px_{color}/10]"
```

### 2.2 버튼

```tsx
// Primary
className="rounded-xl bg-{service-color} px-4 py-2.5
           text-sm font-semibold text-white shadow-none
           hover:bg-{service-color}/90
           hover:shadow-[0_0_12px_{color}/30]"

// Outline
className="rounded-xl border border-{service-color}/30
           bg-transparent text-{service-color}
           hover:bg-{service-color}/10"

// Ghost
className="rounded-xl text-navy/70
           hover:bg-navy/5 dark:text-gray-400 dark:hover:bg-white/5"

// Danger
className="rounded-xl bg-red-500 text-white
           hover:bg-red-600"
```

### 2.3 입력 필드

```tsx
className="w-full rounded-xl border border-navy/10
           bg-white/80 px-3 py-2.5 text-sm text-navy
           placeholder-navy/30 backdrop-blur-sm
           focus:border-{service-color}
           focus:outline-none focus:ring-1 focus:ring-{service-color}
           dark:border-white/10 dark:bg-white/5
           dark:text-gray-100 dark:placeholder-gray-500"
```

### 2.4 뱃지/태그

```tsx
// 카테고리 뱃지
className="rounded-full bg-{service-color}/10
           px-2 py-0.5 text-xs font-medium text-{service-color}"

// 상태 뱃지 (도트 + 라벨)
<span className="inline-flex items-center gap-1.5">
  <span className="h-1.5 w-1.5 rounded-full bg-{status-color}" />
  <span className="text-xs">{label}</span>
</span>
```

### 2.5 모달

```tsx
// 오버레이
className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"

// 패널
className="relative mx-auto max-w-md rounded-2xl
           border border-slate-200 bg-white/95
           p-6 shadow-xl backdrop-blur-xl
           dark:border-white/10 dark:bg-surface-dark-2/95"
```

### 2.6 네비게이션 아이템

```tsx
// 활성
className="bg-{service-color}/10 text-{service-color}
           dark:bg-{service-color}/20
           border-l-2 border-{service-color}"

// 비활성
className="text-navy/60 dark:text-gray-400
           hover:bg-navy/5 dark:hover:bg-white/5"
```

### 2.7 섹션 디바이더

```tsx
// 그라디언트 라인
className="h-px bg-gradient-to-r
           from-transparent via-{service-color}/30 to-transparent"

// 또는 골드 디바이더 (장식용)
className="mx-auto h-px w-24
           bg-gradient-to-r from-transparent via-accent-gold to-transparent"
```

---

## 3. 배경 시스템

### 3.1 라이트 모드

```
배경 그라디언트:
  from-sky-deep via-sky-mid to-sky-pale

구름 시스템 (5개):
  각 구름 = 2-레이어 (Outer 20% + Core 80%)
  크기: 120~200px 범위
  색상: white
  블러: Outer 25~40px / Core 16~28px
  애니메이션: cloud-drift 30s linear infinite
  위치: 시드 기반 의사랜덤

가시성: light 모드에서만 (dark:hidden)
```

### 3.2 다크 모드

```
배경 그라디언트:
  from-surface-dark-1 via-surface-dark-2 to-surface-dark-3

별 파티클 (42개 총):
  - 소형 (25개): 2×2px, 불투명도 0.2~0.65
  - 중형 (12개): 3×3px, 불투명도 0.4~0.8
  - 대형 (5개):  4×4px, 불투명도 0.8 + 글로우 그림자
  애니메이션: twinkle 2s ease-in-out infinite (랜덤 딜레이)
  위치: 의사랜덤 (시드 기반)

글로우 오브 (3개):
  - Violet (#7C3AED): 5% 불투명도, 400px 반경
  - Gold (#FFD700):   2.5% 불투명도, 300px 반경
  - Pink (#EC4899):   3% 불투명도, 350px 반경
  블러: 100px

가시성: dark 모드에서만 (hidden dark:block)
```

### 3.3 RPG 장식 요소

메인 사이트 Hero 등 특별한 섹션에 사용:

```
장식 프레임:
  - 4개 L자 코너 마크 (brand/12 불투명도)
  - 상하 다이아몬드 장식
  - 미세한 그라디언트 라인

CTA 배너 장식:
  - 골드 방사형 글로우 오버레이
  - 다이아몬드 패턴 (conic-gradient, 20px 반복)
  - 코너 L자 보더 (white/18)
```

---

## 4. 타이포그래피 스케일

### 4.1 사이즈 스케일

```
text-xs:    12px / 16px  (캡션, 라벨, 뱃지)
text-sm:    14px / 20px  (본문 보조, 버튼, 입력 필드)
text-base:  16px / 24px  (본문 기본)
text-lg:    18px / 28px  (소제목)
text-xl:    20px / 28px  (페이지 제목)
text-2xl:   24px / 32px  (히어로 섹션 제목)
```

### 4.2 폰트 패밀리 매핑

```css
font-body:    'Pretendard Variable', -apple-system, sans-serif
font-display: 'Nunito', 'Pretendard Variable', sans-serif
```

### 4.3 그라디언트 텍스트 적용

```css
.text-gradient {
  background: linear-gradient(90deg, #6D28D9, #B8860B, #BE185D);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.dark .text-gradient {
  background: linear-gradient(90deg, #A855F7, #FFD700, #EC4899);
}
```

---

## 5. 반응형 패턴

### 5.1 브레이크포인트

```
mobile:   0px     (기본)
tablet:   768px   (min-width)
desktop:  1200px  (min-width)
```

### 5.2 레이아웃 패턴

```
// 카드 그리드
mobile:   grid-cols-1
tablet:   grid-cols-2
desktop:  grid-cols-2~3

// 콘텐츠 영역
mobile:   p-4, max-w-full
tablet:   p-5, max-w-4xl
desktop:  p-6, max-w-4xl

// 사이드바 (Vault)
mobile:   숨김 (오버레이)
tablet:   64px (축소)
desktop:  240px (확장)
```

### 5.3 모바일 전용 요소

```
BottomNav: tablet 이상에서 숨김
  - 5탭 고정 하단 바
  - 중앙 탭 (대시보드): -mt-5 부유 원형 버튼
  - safe-area-inset-bottom 대응

MobileSidebar: 오버레이
  - 256px 슬라이드인
  - 블랙 배경 40%
  - Escape 키 닫기
```

---

## 6. 애니메이션 사전

### 6.1 키프레임

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}  /* 0.6s ease */

@keyframes slideUp {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}  /* 0.4s ease */

@keyframes twinkle {
  0%, 100% { opacity: var(--base-opacity); }
  50% { opacity: calc(var(--base-opacity) * 0.3); }
}  /* 2s ease-in-out infinite */

@keyframes cloudDrift {
  from { transform: translateX(-20%); }
  to { transform: translateX(120%); }
}  /* 30s linear infinite */

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}  /* 3s ease-in-out infinite */

@keyframes scrollPulse {
  0%, 100% { opacity: 1; transform: translateY(0); }
  50% { opacity: 0.3; transform: translateY(4px); }
}  /* 2s ease-in-out infinite */
```

### 6.2 트랜지션 프리셋

```
색상 변경:        transition-colors duration-200
크기/위치 변경:   transition-transform duration-200
복합:            transition-all duration-300
테마 전환:        transition-all duration-500
```

### 6.3 접근성 대응

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 1ms !important;
    transition-duration: 1ms !important;
  }
}
```

---

## 7. 접근성 체크리스트

### 7.1 필수 사항

- [ ] 모든 대화형 요소에 포커스 링 (`outline-2 outline-offset-2 outline-{color}`)
- [ ] 이미지/아이콘 버튼에 `aria-label` 또는 `title`
- [ ] 모달에 포커스 트랩 + `Escape` 닫기
- [ ] 컬러만으로 정보 전달하지 않기 (아이콘/텍스트 병용)
- [ ] 한글 최소 14px
- [ ] 명암 대비 WCAG AA (4.5:1 텍스트, 3:1 큰 텍스트)

### 7.2 키보드 네비게이션

```
Tab:         다음 포커스 요소
Shift+Tab:   이전 포커스 요소
Enter/Space: 버튼/링크 활성화
Escape:      모달/드롭다운 닫기
Arrow Keys:  목록/탭 내 이동 (해당 시)
```

### 7.3 스크린 리더

```
- <nav>, <main>, <aside>, <header>, <footer> 시맨틱 태그 사용
- 아코디언: aria-expanded + aria-controls
- 드롭다운: aria-haspopup + aria-expanded
- 로딩 상태: aria-busy="true"
- 토스트/알림: role="alert" 또는 aria-live="polite"
```

---

## 8. 새 컴포넌트 작성 시 체크리스트

새로운 UI 컴포넌트를 만들 때 이 체크리스트를 따른다:

- [ ] GlassCard 기반인가? (정보 카드라면)
- [ ] 라이트/다크 모드 모두 확인했는가?
- [ ] 서비스 컬러를 하드코딩하지 않고 CSS 변수(`vault-color` 등) 사용하는가?
- [ ] `rounded-xl` 이상의 모서리 반경을 사용하는가?
- [ ] 호버/포커스 상태가 정의되어 있는가?
- [ ] `prefers-reduced-motion`에서 애니메이션이 비활성화되는가?
- [ ] 모바일/태블릿/데스크탑 모두 확인했는가?
- [ ] 폰트 사이즈가 스케일 내에 있는가? (임의 사이즈 금지)
- [ ] 그림자가 사전 정의된 토큰을 사용하는가?
- [ ] 기존 Nebula 패턴과 시각적으로 일관성이 있는가?

---

*이 문서는 PompCore 디자인 시스템의 구현 레퍼런스입니다.*
*새 컴포넌트나 페이지를 만들 때 이 문서를 참고하여 일관된 디자인을 유지하세요.*
