---
name: clean-code
description: >
  개발자 친화적인 코드를 작성하는 스킬. 코드를 새로 작성하거나 수정/리뷰할 때 반드시 사용한다.
  TypeScript/JavaScript에 최적화되어 있으며 다른 언어에도 동일한 원칙을 적용한다.
  "코드 작성해줘", "함수 만들어줘", "API 만들어줘", "수정해줘", "리팩토링", "리뷰해줘" 등
  코드 관련 요청이 오면 무조건 이 스킬을 따른다.
---

# Clean Code Skill

코드를 작성하거나 수정할 때 항상 아래 5가지 원칙을 전부 적용한다.
원칙을 하나라도 빠뜨리지 않는다.

---

## 원칙 1: 모듈화 (Modularization)

- **하나의 함수/클래스는 하나의 책임만** 가진다 (Single Responsibility)
- 파일은 역할에 따라 분리한다:
  - `utils/` — 순수 유틸 함수
  - `services/` — 비즈니스 로직
  - `types/` — 타입/인터페이스 정의
  - `constants/` — 상수 값
  - `config/` — 설정 로드
- 함수는 **20줄 이하**를 목표로 한다. 길어지면 더 쪼갠다.
- 재사용 가능한 로직은 반드시 별도 함수로 추출한다.

```typescript
// ❌ 나쁜 예 — 모든 걸 한 함수에
async function handleUser(req) {
  const user = await db.query(`SELECT * FROM users WHERE id = ${req.id}`);
  const token = jwt.sign({ id: user.id }, 'secret123');
  await sendEmail(user.email, `Bearer ${token}`);
}

// ✅ 좋은 예 — 책임 분리
// services/user.service.ts
export async function getUserById(id: string): Promise<User> {
  return db.query(SQL.GET_USER_BY_ID, [id]);
}

// services/auth.service.ts
export function generateToken(userId: string): string {
  return jwt.sign({ id: userId }, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_IN });
}

// services/email.service.ts
export async function sendWelcomeEmail(email: string, token: string): Promise<void> {
  await mailer.send({ to: email, subject: EMAIL_SUBJECTS.WELCOME, body: token });
}
```

---

## 원칙 2: 구조화된 주석 (Structured Comments)

주석은 탐색을 위한 **네비게이션 도구**로 사용한다.

### 파일 상단 — 파일 목적 명시
```typescript
/**
 * @file user.service.ts
 * @description 사용자 CRUD 및 인증 관련 비즈니스 로직
 * @module services/user
 */
```

### 섹션 구분자 — 긴 파일에서 영역 구분
```typescript
// ============================================================
// 조회 (Read)
// ============================================================

// ============================================================
// 생성/수정 (Write)
// ============================================================
```

### 함수 — JSDoc으로 LSP 연동
```typescript
/**
 * 사용자 ID로 사용자를 조회한다.
 * @param id - 사용자 고유 ID (UUID v4)
 * @returns 사용자 객체, 없으면 null
 * @throws {DatabaseError} DB 연결 실패 시
 */
export async function getUserById(id: string): Promise<User | null> { ... }
```

### 복잡한 로직 — 왜(why) 중심으로 설명
```typescript
// rate limit 초과 시 429 대신 200을 반환 — 스크래퍼 탐지 방지
if (isRateLimited) return res.status(200).json({ ok: false });
```

---

## 원칙 3: 하드코딩 금지 (No Magic Values)

반복되거나 의미 있는 값은 **반드시 상수/변수로 추출**한다.

```typescript
// ❌ 나쁜 예
if (user.age < 19) throw new Error('미성년자');
setTimeout(fn, 86400000);
await fetch('https://api.example.com/v2/users');

// ✅ 좋은 예 — constants/index.ts
export const MIN_AGE = 19;
export const ONE_DAY_MS = 86_400_000;
export const API_ENDPOINTS = {
  USERS: `${config.API_BASE_URL}/v2/users`,
} as const;

// 사용
if (user.age < MIN_AGE) throw new Error('미성년자');
setTimeout(fn, ONE_DAY_MS);
await fetch(API_ENDPOINTS.USERS);
```

**같은 값이 2곳 이상 나오면 즉시 상수로 뺀다.**

---

## 원칙 4: 환경변수 분리 (Environment Variables)

보안 값, 환경별 설정은 **절대 코드에 직접 작성하지 않는다.**

### .env 파일 구조
```bash
# .env.example (커밋 O — 실제 값 없이 키 목록만)
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=7d
API_BASE_URL=
SMTP_HOST=
SMTP_PORT=587
```

### config 로더 — 타입 안전하게 로드
```typescript
// config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),
  API_BASE_URL: z.string().url(),
});

export const config = envSchema.parse(process.env);
```

**규칙:**
- `.env`는 `.gitignore`에 추가
- `.env.example`은 항상 최신 상태 유지
- `process.env.XXX`를 코드 곳곳에 직접 쓰지 않고, `config` 객체를 통해서만 접근

---

## 원칙 5: LSP 최적화 (LSP-Friendly Code)

IDE의 자동완성, 타입 추론, Go-to-Definition이 잘 동작하도록 작성한다.

### 타입을 명시적으로 선언
```typescript
// ❌ any 금지
function process(data: any): any { ... }

// ✅ 명확한 타입
interface UserPayload {
  id: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
}

function processUser(payload: UserPayload): ProcessedUser { ... }
```

### 공유 타입은 types/ 폴더에 중앙 관리
```typescript
// types/user.types.ts
export interface User { ... }
export interface UserCreateDto { ... }
export type UserRole = 'admin' | 'user' | 'guest';

// types/index.ts — 재수출
export * from './user.types';
export * from './auth.types';
```

### 반환 타입 항상 명시
```typescript
// ❌ 반환 타입 생략
async function getUsers() { return db.find(); }

// ✅ 반환 타입 명시
async function getUsers(): Promise<User[]> { return db.find(); }
```

### enum 대신 const object (LSP 추론 향상)
```typescript
// ✅ const object — tree-shaking + 더 나은 타입 추론
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
} as const;

export type HttpStatus = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];
```

---

## 체크리스트

코드 작성/수정 후 아래를 확인한다:

- [ ] 함수가 하나의 역할만 하는가?
- [ ] 파일이 역할에 맞는 폴더에 있는가?
- [ ] 의미 있는 숫자/문자열이 상수로 분리되어 있는가?
- [ ] 비밀키/URL/설정값이 .env로 분리되어 있는가?
- [ ] 모든 함수에 JSDoc 주석이 있는가?
- [ ] 타입이 명시적으로 선언되어 있는가?
- [ ] `any` 타입을 사용하지 않았는가?
- [ ] 반환 타입이 명시되어 있는가?
