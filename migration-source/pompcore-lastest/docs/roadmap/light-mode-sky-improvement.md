# 라이트 모드 하늘+구름 시각 효과 개선 계획

> 작성일: 2026-03-05
> 상태: 완료 (v0.4.6)
> 관련 버전: v0.4.6

---

## 현재 상태 분석

### 문제점 (사용자 인지도: 3/10)

1. **배경 그라디언트가 너무 연함**: `#E8F4FD`, `#F0F7FF`, `#FAF8FF` 등 거의 흰색에 가까운 파스텔 톤 → "푸른 하늘" 느낌 부족
2. **구름 가시성 부족**: 흰색 blur div가 연한 배경 위에서 거의 안 보임
3. **HeroSection만 구름 레이어가 충실**: 나머지 섹션은 2~3개 구름으로 빈약
4. **구름이 정적**: 움직임이 없어 생동감 부족
5. **섹션 간 하늘 연속성 없음**: 각 섹션 그라디언트가 제각각이라 하나의 하늘 세계관 형성 안 됨
6. **하늘 전용 디자인 토큰 부재**: 색상/blur/opacity가 하드코딩

### 현재 구현 상세

| 섹션 | 그라디언트 | 구름 수 | 구름 opacity | 구름 blur |
|------|-----------|---------|-------------|-----------|
| Hero | `#E8F4FD → #F0F7FF → #FAF8FF` | 10개 (3레이어) | 40~70% | 10~35px |
| Services | `#F0F7FF → #FAF8FF` | 3개 | 50~60% | 14~22px |
| Why | `#FAF8FF → #EEF5FD` | 2개 | 50~55% | 16~18px |
| Upcoming | `#EEF5FD → #F0F7FF` | 2개 | 50~55% | 16~18px |
| FAQ | `#F0F7FF → #FAF8FF` | 2개 | 45~50% | 16~18px |
| CTA | `surface-light` | 1개 | 40% | 18px |

---

## 개선 계획

### Phase 1: 배경 그라디언트 강화 (높은 우선순위)

**목표**: "푸른 하늘" 느낌이 확실히 전달되도록 색상 강화

**변경 사항:**

```
현재 HeroSection:  from-[#E8F4FD] via-[#F0F7FF] to-[#FAF8FF]
개선:              from-[#B8DEFF] via-[#D0EAFF] to-[#E8F4FD]

현재 ServicesSection: from-[#F0F7FF] to-[#FAF8FF]
개선:                 from-[#D6EDFF] to-[#E8F4FD]

현재 WhySection: from-[#FAF8FF] to-[#EEF5FD]
개선:            from-[#E0F0FF] to-[#D6EDFF]

현재 UpcomingSection: from-[#EEF5FD] to-[#F0F7FF]
개선:                 from-[#D0EAFF] to-[#E0F0FF]

현재 FaqSection: from-[#F0F7FF] to-[#FAF8FF]
개선:            from-[#E0F0FF] to-[#E8F4FD]

현재 CtaBanner: bg-surface-light
개선:           bg-[#E8F4FD]
```

**핵심 색상 팔레트:**
- `#87CEEB` — 진한 하늘색 (글로우/악센트)
- `#A8D5FF` — 중간 하늘색
- `#B8DEFF` — 밝은 하늘색 (Hero 상단)
- `#D0EAFF` — 연한 하늘색
- `#E8F4FD` — 아주 연한 하늘색 (하단 페이드)

### Phase 2: 구름 가시성 강화 (높은 우선순위)

**목표**: 구름이 확실히 "구름"으로 인식되도록 개선

**변경 전략:**
1. 구름 opacity를 60~85%로 상향 (현재 40~70%)
2. blur를 줄여 형태가 더 또렷하게 (큰 구름: 20~25px, 중간: 12~16px, 작은: 6~10px)
3. 각 구름을 2~3개 blur div 중첩으로 구성 (진한 코어 + 연한 가장자리 = 입체감)
4. 모든 섹션 구름 수를 최소 4~5개로 통일

**구름 구성 예시 (복합 구름 1개):**
```html
<!-- 구름 가장자리 (연하고 넓은 blur) -->
<div class="absolute top-[8%] left-[15%] w-[220px] md:w-[380px] h-[60px] md:h-[90px] bg-white/40 rounded-full blur-[28px]" />
<!-- 구름 코어 (진하고 작은 blur) -->
<div class="absolute top-[8.5%] left-[17%] w-[160px] md:w-[280px] h-[45px] md:h-[65px] bg-white/80 rounded-full blur-[12px]" />
```

### Phase 3: 구름 애니메이션 (중간 우선순위)

**목표**: 구름이 천천히 흘러가는 느낌 → 살아있는 하늘

**tailwind.config.ts에 추가할 keyframes:**
```ts
cloudDrift: {
  '0%': { transform: 'translateX(0)' },
  '50%': { transform: 'translateX(30px)' },
  '100%': { transform: 'translateX(0)' },
},
cloudDriftSlow: {
  '0%': { transform: 'translateX(0)' },
  '50%': { transform: 'translateX(15px)' },
  '100%': { transform: 'translateX(0)' },
},
```

**animation 클래스:**
```ts
'cloud-drift': 'cloudDrift 20s ease-in-out infinite',
'cloud-drift-slow': 'cloudDriftSlow 30s ease-in-out infinite',
```

**prefers-reduced-motion 대응 필수:**
```css
@media (prefers-reduced-motion: reduce) {
  .animate-cloud-drift,
  .animate-cloud-drift-slow {
    animation: none;
  }
}
```

### Phase 4: 섹션 간 하늘 연속성 (중간 우선순위)

**목표**: 페이지 전체가 하나의 "하늘" 세계관으로 이어지는 느낌

**전략:**
- 위에서 아래로 갈수록 하늘색이 서서히 옅어지는 그라디언트 스토리
  - Hero: 진한 하늘 (상공) → Services: 중간 → Why: 연한 → Upcoming/FAQ: 수평선 근처
- 구름도 상단 섹션일수록 많고, 하단으로 갈수록 적어지도록
- 각 섹션 경계의 그라디언트 끝/시작 색상을 일치시켜 자연스러운 전환

### Phase 5: 디자인 토큰 정리 (낮은 우선순위)

**tailwind.config.ts에 추가:**
```ts
colors: {
  sky: {
    deep: '#87CEEB',
    mid: '#A8D5FF',
    light: '#B8DEFF',
    pale: '#D0EAFF',
    faint: '#E8F4FD',
  },
  cloud: {
    core: 'rgba(255,255,255,0.8)',
    edge: 'rgba(255,255,255,0.4)',
  },
}
```

---

## 수정 대상 파일

| 파일 | 변경 내용 |
|------|----------|
| `tailwind.config.ts` | sky 색상 토큰, cloud-drift 애니메이션 추가 |
| `src/styles/globals.css` | prefers-reduced-motion 대응 |
| `src/pages/Home/HeroSection.tsx` | 그라디언트 강화, 복합 구름 적용, 애니메이션 |
| `src/pages/Home/ServicesSection.tsx` | 그라디언트 + 구름 보강 |
| `src/pages/Home/WhySection.tsx` | 그라디언트 + 구름 보강 |
| `src/pages/Home/UpcomingSection.tsx` | 그라디언트 + 구름 보강 |
| `src/pages/Home/FaqSection.tsx` | 그라디언트 + 구름 보강 |
| `src/pages/Home/CtaBanner.tsx` | 배경색 변경 |

---

## 검증 체크리스트

- [ ] 라이트 모드에서 "푸른 하늘" 느낌이 즉시 전달되는가?
- [ ] 구름이 "구름"으로 인식되는가? (blur된 흰 덩어리가 아닌)
- [ ] 섹션 전환 시 하늘이 자연스럽게 이어지는가?
- [ ] 다크 모드 전환 시 시각적 충돌 없는가?
- [ ] 모바일 (375px)에서 구름이 UI를 가리지 않는가?
- [ ] prefers-reduced-motion 설정 시 애니메이션 비활성화되는가?
- [ ] 빌드 에러 없는가?
- [ ] 텍스트 가독성 유지되는가? (대비율 WCAG AA 충족)

---

## 참고: 다크 모드 별 현황 (완료됨, v0.4.5)

- HeroSection: 42개 별 (작은25 + 중간12 + 큰5 글로우)
- ServicesSection: 17개 별
- WhySection: 10개 별
- UpcomingSection: 10개 별
- FaqSection: 8개 별
- CtaBanner: 6개 별
