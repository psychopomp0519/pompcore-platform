---
name: monorepo
description: >
  모노레포 내 코드 배치와 중복 방지를 결정하는 스킬.
  새 코드의 app vs package 소유권, 공유 타입 위치, 의존성 방향 결정 시 사용한다.
---

## Context Activation Rule
This skill should only be loaded when the task directly requires it.
- **Load**: deciding code placement (app vs package), dependency direction, package extraction
- **Do not load**: single-file edits within a known location, UI design, documentation

# monorepo skill

## Purpose
Decide where code belongs and how to prevent duplication.

## Must decide
- app vs package ownership
- shared type location
- shared UI extraction
- dependency direction

## Output
- ownership table
- file placement plan
- extraction opportunities
