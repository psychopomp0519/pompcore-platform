---
name: clean-code
description: >
  개발자 친화적인 코드를 작성하는 스킬. 코드를 새로 작성하거나 수정/리뷰할 때 반드시 사용한다.
  TypeScript/JavaScript에 최적화되어 있으며 다른 언어에도 동일한 원칙을 적용한다.
---

# Clean Code Skill

코드를 작성하거나 수정할 때 항상 아래 5가지 원칙을 전부 적용한다.

## 원칙 1: 모듈화 (Modularization)

- 하나의 함수/클래스는 하나의 책임만 (Single Responsibility)
- 파일은 역할에 따라 분리: utils/ / services/ / types/ / constants/ / config/
- 함수는 20줄 이하 목표
- 재사용 가능한 로직은 별도 함수로 추출

## 원칙 2: 구조화된 주석 (Structured Comments)

- 파일 상단: @file, @description, @module (JSDoc)
- 섹션 구분자: ============ 로 영역 구분
- 함수: JSDoc으로 LSP 연동 (@param, @returns, @throws)
- 복잡한 로직: 왜(why) 중심으로 설명

## 원칙 3: 하드코딩 금지 (No Magic Values)

- 반복되거나 의미 있는 값은 반드시 상수/변수로 추출
- 같은 값이 2곳 이상 나오면 즉시 상수로 분리

## 원칙 4: 환경변수 분리 (Environment Variables)

- 보안 값, 환경별 설정은 절대 코드에 직접 작성하지 않음
- .env는 .gitignore에 추가
- .env.example은 항상 최신 상태 유지
- config 객체를 통해서만 접근

## 원칙 5: LSP 최적화 (LSP-Friendly Code)

- 타입을 명시적으로 선언 (any 금지)
- 공유 타입은 types/ 폴더에 중앙 관리
- 반환 타입 항상 명시
- enum 대신 const object (tree-shaking + 더 나은 타입 추론)

## 체크리스트

- [ ] 함수가 하나의 역할만 하는가?
- [ ] 파일이 역할에 맞는 폴더에 있는가?
- [ ] 의미 있는 숫자/문자열이 상수로 분리되어 있는가?
- [ ] 비밀키/URL/설정값이 .env로 분리되어 있는가?
- [ ] 모든 함수에 JSDoc 주석이 있는가?
- [ ] 타입이 명시적으로 선언되어 있는가?
- [ ] any 타입을 사용하지 않았는가?
- [ ] 반환 타입이 명시되어 있는가?
