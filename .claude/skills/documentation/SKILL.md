---
name: documentation
description: >
  PompCore 내부 문서(feature spec, ADR, release note, architecture note)를
  구현과 일관되게 생성·유지하는 스킬. 문서 작성, 스펙 정리, 릴리스 노트 작업 시 사용한다.
---

## Context Activation Rule
This skill should only be loaded when the task directly requires it.
- **Load**: writing feature specs, ADRs, release notes, architecture documentation
- **Do not load**: code implementation, UI design, database work

# documentation skill

## Purpose
Generate internal documents that remain implementation-aligned.

## Document types
- feature specs
- ADRs
- release notes
- architecture notes
- checklists
