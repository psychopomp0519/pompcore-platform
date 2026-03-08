# 프로젝트 기억 사항

## 작업 규칙
- 모든 작업은 **계획서 → 승인 → 실행 → CHANGELOG 기록** 순서
- 극단적 모듈화 / 방어적 프로그래밍 / 주석 필수 / .env 분리
- 디버깅: 원인 분석 → 보고 → 승인 후 수정
- 특수 명령어: "프로젝트 검증해줘", "세션 요약해줘"

## 문서 관리 규칙
- 모든 문서는 `docs/` 폴더 하위에 저장
  - `docs/patchnotes/` - 패치노트 (버전별 .md 파일)
  - `docs/completed/` - 개발 완료된 내용 목록
  - `docs/roadmap/` - 개발 예정 내용 목록
  - `docs/memory/` - 기억해둘 내용들

## 프로젝트 정보
- **회사명**: PompCore
- **메인사이트**: 브랜딩 + 프로젝트 허브 + SSO 인증센터
- **서브 프로젝트**: Vault (가계부), Quest (일정관리), 추가 예정
- **DB/인증**: Supabase (단일 프로젝트에서 모든 앱 공유)
- **스타일링**: Tailwind CSS 3 (디자인 토큰 중앙 관리)
- **디자인 컨셉**: Clean & Bold (라이트 기본 + 다크 모드, Navy 컬러, 글래스모피즘)
- **비즈니스**: AdSense 수익화, Polar 구독, Clarity 분석, SEO/GEO 최적화
- **최종 목표**: 구글 검색 유기적 트래픽 증가

## 확장성 설계 원칙
- 새 프로젝트 추가: `constants/projects.ts`에 항목 추가만으로 UI 자동 반영
- 새 페이지 추가: `router/index.tsx`에 경로 추가
- 인증 방식 변경: `services/authService.ts`만 수정
- 디자인 토큰 변경: `tailwind.config.ts`에서 일괄 관리
