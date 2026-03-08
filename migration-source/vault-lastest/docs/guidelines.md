# 코딩 규칙 및 패턴

## 코딩 컨벤션

1. **단일 책임**: 함수/클래스는 하나의 역할만, 함수 20줄 이내
2. **JSDoc 주석**: 파일 헤더 (@file, @description, @module), 함수 (@param, @returns)
3. **매직 넘버 금지**: 의미 있는 값은 상수로 추출
4. **환경변수 분리**: 민감 정보는 .env, config 객체로 접근
5. **LSP 친화적**: 명시적 타입, any 금지, 반환 타입 명시, enum 대신 const object

## 파일 구조 규칙

```
src/
  services/    - 외부 서비스 연동 (Supabase 등)
  types/       - 공유 타입 정의
  utils/       - 유틸리티 함수
  constants/   - 상수
  config/      - 설정
  components/  - UI 컴포넌트
  pages/       - 페이지 컴포넌트
  stores/      - Zustand 상태 관리
  hooks/       - 커스텀 훅
```

## 네이밍 규칙

- 파일: camelCase (컴포넌트는 PascalCase)
- 타입 파일: `*.types.ts`
- 서비스 파일: `*.service.ts`
- 스토어 파일: `*Store.ts`
- 상수: UPPER_SNAKE_CASE
- 컴포넌트: PascalCase
- 함수/변수: camelCase

## 주요 패턴

### Override 패턴 (설정 폼 초기화)
React 19에서 useEffect 내 setState 린트 경고를 회피하기 위해 사용:
```tsx
const [override, setOverride] = useState<string | null>(null);
const value = override ?? storeValue ?? '';
```

### userId 타이핑 패턴
useEffect 내 async에서 `user?.id`를 안전하게 사용:
```tsx
const uid = user?.id;
if (!uid) return;
const userId: string = uid;
```

### 모듈 구현 순서
types → service → store → components → page → App.tsx 라우트 → 빌드 검증 → 문서 업데이트

### DB 매핑 함수
각 타입 파일에 `mapDbTo*` 함수를 정의하여 snake_case → camelCase 변환:
```tsx
export function mapDbToAccount(row: DbRow): Account { ... }
```

### lazy-load 페이지
named export를 lazy에서 사용하기 위한 패턴:
```tsx
const Page = lazy(() => import('./pages/Page').then((m) => ({ default: m.Page })));
```

## 버전 관리 규칙

커밋 시 변경 내용에 따라 버전을 자동으로 올린다.

### 업데이트 대상
- `package.json` (version 필드)
- `src/config/appConfig.ts` (app.version)
- `CHANGELOG.md` (변경 내역 추가)

### Semantic Versioning
- **PATCH** (0.0.x): 버그 수정, 소규모 개선, 스타일 변경
- **MINOR** (0.x.0): 새 기능 추가, 기존 기능 확장
- **MAJOR** (x.0.0): 호환성 깨지는 변경

### CHANGELOG 형식
- [Keep a Changelog](https://keepachangelog.com/ko/1.1.0/) 기반, 한국어 작성
- 섹션: Added, Changed, Fixed, Removed, Security, Performance, Accessibility
