# 주요 디자인 시스템 핵심 원칙 요약

## Material Design 3 (Google)
- **핵심 철학**: 개인화(You), 적응성(Adaptive), 표현력(Expressive)
- **색상**: Dynamic Color 시스템 — Primary, Secondary, Tertiary, Error, Surface 토큰 체계
- **컴포넌트**: FAB, NavigationBar (하단), NavigationDrawer (사이드), BottomSheet, Chip, Snackbar
- **형태(Shape)**: 둥근 모서리 적극 활용 — ExtraSmall(4dp) ~ ExtraLarge(28dp)
- **고도(Elevation)**: 그림자 대신 Surface tint color로 고도 표현
- **타이포그래피**: Display / Headline / Title / Body / Label 5단계
- **공식 문서**: https://m3.material.io/components

## Human Interface Guidelines (Apple HIG)
- **핵심 철학**: 명확성(Clarity), 존중(Deference), 깊이(Depth)
- **iOS 특화**: Safe Area 준수, Dynamic Type 지원 (접근성 글자 크기 대응)
- **네비게이션 패턴**: Tab Bar (하단 5개 이내), Navigation Stack, Modal Sheet
- **제스처**: Swipe-to-go-back, Pull-to-refresh 등 시스템 제스처와 충돌 금지
- **플랫폼 일관성**: iOS vs macOS vs watchOS별 다른 패턴 적용
- **SF Symbols**: Apple의 공식 아이콘 시스템 — 벡터, 다크모드 자동 대응

## Fluent 2 (Microsoft)
- **핵심 철학**: 직관적, 포용적, 아름다운 디자인
- **적응형 UI**: 마우스/키보드/터치/펜 입력 모두 대응
- **접근성 강조**: 색각 이상, 모터 장애, 인지 장애 등 포용적 설계
- **컴포넌트**: Web (React), iOS, Android, Windows 각각 분리된 컴포넌트 세트
- **디자인 토큰**: Figma UI kit 공식 제공
- **Mica/Acrylic**: Windows 특화 반투명 배경 소재 효과

## MUI (Material UI)
- **기반**: Material Design 기반 React 컴포넌트 라이브러리
- **테마 커스터마이징**: `createTheme()`으로 색상/타이포/컴포넌트 전역 오버라이드
- **sx prop**: 인라인 스타일링 유틸리티, 반응형 지원
- **주요 컴포넌트**: DataGrid, DatePicker, Autocomplete, Drawer 등 엔터프라이즈 특화
- **공식 문서**: https://mui.com/components/

## Bootstrap 5
- **그리드**: 12컬럼 flexbox 그리드, breakpoint: xs/sm/md/lg/xl/xxl
- **유틸리티 클래스**: `p-3`, `mt-4`, `d-flex`, `text-center` 등
- **컴포넌트**: Accordion, Alert, Badge, Breadcrumb, Card, Carousel, Dropdown, Modal, Navbar, Toast
- **특징**: 순수 CSS+JS, 프레임워크 의존성 없음, 빠른 프로토타이핑에 최적

## Chakra UI
- **기반**: React, 접근성(a11y) 최우선 설계
- **스타일 시스템**: `<Box p={4} mt={3} bg="blue.500">` 형태의 props 기반 스타일링
- **컬러 모드**: 다크/라이트 모드 전환 빌트인
- **훅**: `useDisclosure`, `useColorMode`, `useBreakpointValue` 등 UX 훅 제공
- **공식 문서**: https://v2.chakra-ui.com/docs/components

## SOLID 2.0 (신한은행)
- **대상**: 금융 앱/웹 UX/UI, 국내 사용자 특화
- **색상**: 신한 블루 계열 브랜드 컬러, 금융 도메인 신뢰감 강조
- **패턴**: 잔액 표시, 이체 플로우, 인증 화면, 금융 카드 UI
- **접근성**: 고령 사용자 고려, 큰 폰트/명확한 버튼
- **공식 문서**: https://ux.shinhan.com/155fe4737/p/260a2b-

## KRDS (디지털정부서비스 UX/UI)
- **대상**: 전자정부 웹/앱 서비스
- **기반 표준**: 행정안전부 공식 UX/UI 가이드라인
- **패턴**: 공공서비스 특화 — 민원 신청, 문서 조회, 본인 인증
- **접근성**: WCAG 2.1 AA 이상 의무 준수
- **한글 최적화**: Noto Sans KR / Pretendard 권장
- **공식 문서**: https://uiux.egovframe.go.kr/guide/index.html

## Design Systems Repo & Component Gallery
- 100개 이상의 디자인 시스템 사례 수집 플랫폼
- 동일 컴포넌트(예: Accordion, Modal, Tabs)를 여러 시스템에서 어떻게 구현하는지 비교 가능
- 특정 컴포넌트 이름이 시스템마다 다를 수 있음 (예: Dialog = Modal = Overlay)
- URL: https://designsystemsrepo.com, https://component.gallery/
