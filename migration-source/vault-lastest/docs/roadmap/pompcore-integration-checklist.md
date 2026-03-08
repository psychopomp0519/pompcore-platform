# PompCore ↔ Vault 연동 체크리스트

> 생성일: 2026-03-07
> 목적: 세션 공유 기반 PompCore ↔ Vault 연동 완성을 위한 수동 작업 목록

---

## 개요

Vault(`vault.pompcore.cc`) ↔ PompCore(`pompcore.cc`) 간 Supabase 세션을 쿠키로 공유하는 구조.
`domain=.pompcore.cc` 쿠키를 사용하므로 **양쪽 모두** 동일한 설정이 필요하다.

---

## 1. Vault — 환경변수 설정

### 로컬 개발 (`.env`)

```env
# 개발 환경에서는 빈 문자열 (공유 안 함)
VITE_SHARED_DOMAIN=
VITE_POMPCORE_URL=https://pompcore.cc
```

### 운영 (Vercel 환경변수)

| 키 | 값 |
|---|---|
| `VITE_SHARED_DOMAIN` | `.pompcore.cc` |
| `VITE_POMPCORE_URL` | `https://pompcore.cc` |

- [ ] Vercel > Vault 프로젝트 > Settings > Environment Variables 에 위 두 항목 추가

---

## 2. PompCore — 코드 변경

PompCore 코드베이스에 아래 파일들을 동일하게 적용해야 한다.

### 2-1. `src/utils/cookieStorage.ts` 복사

Vault의 `src/utils/cookieStorage.ts` 파일을 그대로 PompCore에 복사한다.

```
vault/src/utils/cookieStorage.ts → pompcore/src/utils/cookieStorage.ts
```

### 2-2. `src/config/appConfig.ts` 수정

PompCore의 `appConfig.ts`에 아래 내용을 추가한다.

```ts
// 환경변수 읽기 (상단에 추가)
const SHARED_DOMAIN = import.meta.env.VITE_SHARED_DOMAIN as string | undefined;
const VAULT_URL = import.meta.env.VITE_VAULT_URL as string | undefined;

// appConfig 객체에 추가
vault: {
  url: VAULT_URL ?? 'https://vault.pompcore.cc',
  sharedDomain: SHARED_DOMAIN ?? '',
},
```

### 2-3. `src/services/supabase.ts` 수정

```ts
import { createCookieStorage } from '../utils/cookieStorage';
import { appConfig } from '../config/appConfig';

export const supabase = createClient(
  appConfig.supabase.url,
  appConfig.supabase.anonKey,
  {
    auth: {
      storage: createCookieStorage(appConfig.vault.sharedDomain),
      persistSession: true,
      detectSessionInUrl: true,
    },
  },
);
```

- [ ] `cookieStorage.ts` 파일 복사
- [ ] `appConfig.ts` 수정
- [ ] `supabase.ts` 수정

---

## 3. PompCore — 환경변수 설정

### 로컬 개발 (`.env`)

```env
VITE_SHARED_DOMAIN=
VITE_VAULT_URL=https://vault.pompcore.cc
```

### 운영 (Vercel 환경변수)

| 키 | 값 |
|---|---|
| `VITE_SHARED_DOMAIN` | `.pompcore.cc` |
| `VITE_VAULT_URL` | `https://vault.pompcore.cc` |

- [ ] Vercel > PompCore 프로젝트 > Settings > Environment Variables 에 위 두 항목 추가

---

## 4. Supabase — OAuth 리다이렉트 URL 확인

Google OAuth 로그인 후 리다이렉트가 올바르게 동작하는지 확인한다.

- [ ] Supabase 대시보드 > Authentication > URL Configuration
- [ ] **Site URL**: `https://pompcore.cc`
- [ ] **Redirect URLs**에 아래 항목 모두 포함 여부 확인:
  - `https://pompcore.cc/**`
  - `https://vault.pompcore.cc/**`
  - `http://localhost:5173/**` (개발용)

---

## 5. 배포 및 검증

- [ ] Vault 재배포 (Vercel 환경변수 적용 후)
- [ ] PompCore 코드 변경 커밋 + 재배포
- [ ] **검증 시나리오**:
  1. PompCore에서 로그인 → Vault URL 접속 → 자동 로그인 확인
  2. Vault에서 로그인 → PompCore URL 접속 → 자동 로그인 확인
  3. PompCore에서 로그아웃 → Vault 새로고침 → 로그아웃 확인

---

## 참고: 세션 공유 원리

```
사용자 로그인 (pompcore.cc)
  └─ Supabase 세션을 domain=.pompcore.cc 쿠키에 저장
       ├─ pompcore.cc    ← 쿠키 읽힘 (자동 인증)
       └─ vault.pompcore.cc ← 쿠키 읽힘 (자동 인증)
```

개발 환경(`VITE_SHARED_DOMAIN=`)에서는 공유 도메인을 설정하지 않으므로
각 로컬 포트(5173, 5174 등)에서 독립적으로 동작한다.
