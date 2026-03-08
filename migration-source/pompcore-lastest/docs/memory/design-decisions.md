# 디자인 결정 기록

## 2026-03-05: Nebula 테마 리뉴얼 (v0.4.0)

### 변경 사항
- **컬러**: Indigo 기반 → Violet(#7C3AED) + Gold(#FFD700) + Pink(#EC4899)
- **폰트**: Cinzel / Cinzel Decorative 디스플레이 폰트 추가
- **다크 모드 배경**: 3단계 (dark-1: #0C0818, dark-2: #110D20, dark-3: #150F28)
- **text-gradient**: violet → gold → pink 그라디언트

### 아이콘 시스템
- 이모지 → 16종 커스텀 SVG 아이콘 컴포넌트 전면 교체
- DynamicIcon 공통 컴포넌트로 IIFE 패턴 통일
- ICON_MAP 레지스트리 기반 동적 렌더링

### 브랜드 텍스트
- BrandText 컴포넌트: 서비스명을 Cinzel + 고유 컬러로 렌더링
- PompCoreLogo: "POMP"(네이비) + "CORE"(그라디언트) 분리 표기

### 랜딩 페이지
- 6섹션 구조: Hero → Services → Why → Upcoming → FAQ → CTA
- 의식형(Ceremonial) HeroSection: 엠블럼, 장식 프레임, 별 파티클
- section-divider-gradient 섹션 구분선

### 근거
- 판타지 RPG(Genshin Impact 스타일) 분위기로 브랜드 차별화
- Violet 기반 팔레트가 게이미피케이션 컨셉에 부합
- SVG 아이콘으로 일관된 비주얼 + 크기/색상 제어 용이

---

## 2026-03-04: 메인 페이지 디자인 채택

### 후보
- **Design 1 (라이트)**: 밝은 배경, 프로젝트 카드 + 오렌지 CTA, 하단 특징 아이콘
- **Design 2 (다크)**: 다크 네이비, 글래스 카드 + 앱 프리뷰, 삼각형 장식

### 채택: Design 1 기반 + Design 2 장점 혼합

### 근거
1. **SEO**: 텍스트 콘텐츠 풍부 → 크롤링 유리
2. **확장성 (최우선)**: 카드 그리드가 3열, 4열로 자연스럽게 확장 가능
3. **접근성**: 라이트 테마 기본 시 가독성 우수
4. **Design 2 요소 차용**: 다크 모드 토글 지원, 앱 프리뷰는 출시 후 적용

### 구현 방향
- 기본: 라이트 테마 (Design 1)
- 다크 모드: 토글 지원 (Design 2 느낌)
- 브랜드 컬러: 로고 다크 네이비(#2B3442) + Indigo-Violet 액센트
- 카드: 깔끔한 라이트 카드 + 프로젝트별 액센트 컬러

## 로고/아이콘 체계
- pompcore.svg / pompcorelogo.svg: 메인 브랜드 (워드마크 / P아이콘)
- vault.svg / vaultlogo.svg: Vault 프로젝트 (워드마크 / V아이콘)
- quest.svg / questlogo.svg: Quest 프로젝트 (워드마크 / Q아이콘)
- 전체 톤: 다크 네이비(#2B3442) 산세리프, 통일된 스타일

## GitHub 정보
- 레포: psychopomp0519/pompcore-main (Private)
- URL: https://github.com/psychopomp0519/pompcore-main
