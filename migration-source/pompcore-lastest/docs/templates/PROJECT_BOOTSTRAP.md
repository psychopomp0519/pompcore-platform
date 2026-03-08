# PompCore 프로젝트 부트스트랩 가이드

> 새 서브 프로젝트(Vault, Quest 등) 생성 시 이 문서를 따라 초기 세팅합니다.

## 1. 프로젝트 생성

```bash
npm create vite@latest [프로젝트명] -- --template react-ts
cd [프로젝트명]
```

## 2. 공통 패키지 설치

```bash
# 런타임
npm install react-router-dom @supabase/supabase-js zustand

# 스타일링
npm install -D tailwindcss@3 postcss autoprefixer @tailwindcss/forms
```

## 3. docs/ 폴더 복사

아래 구조를 프로젝트 루트에 생성합니다:

```
docs/
├── patchnotes/      # 버전별 패치노트
├── completed/       # 개발 완료 목록
│   └── README.md
├── roadmap/         # 개발 예정 목록
│   └── README.md
├── memory/          # AI/개발 기억 사항
│   └── README.md
├── design/          # 디자인 시안, 로고
└── templates/       # 이 템플릿 폴더
```

## 4. 공유 설정 파일 복사

메인 프로젝트에서 아래 파일을 복사하여 브랜드 일관성을 유지합니다:

- `tailwind.config.ts` → 디자인 토큰 공유
- `.env.example` → Supabase 동일 프로젝트 사용
- `.gitignore` → 환경변수 보호

## 5. Supabase SSO 연동

모든 서브 프로젝트는 동일한 Supabase 프로젝트를 사용합니다:

```
VITE_SUPABASE_URL=<메인과 동일>
VITE_SUPABASE_ANON_KEY=<메인과 동일>
```

`src/services/supabase.ts`와 `src/services/authService.ts`를 메인에서 복사합니다.

## 6. CHANGELOG.md 생성

루트에 CHANGELOG.md 생성 후 첫 버전 기록:

```markdown
# [프로젝트명] Changelog

## [0.1.0] - YYYY-MM-DD
- 프로젝트 초기 구조 설정
```
