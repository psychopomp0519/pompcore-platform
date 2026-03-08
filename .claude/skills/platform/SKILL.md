---
name: platform
description: >
  PompCore 크로스서비스 구조에 영향을 주는 작업을 설계하고 리뷰하는 스킬.
  플랫폼 레벨 기능, 서비스 간 연동, SSO/인증, 공유 네비게이션 작업 시 사용한다.
---

## Context Activation Rule
This skill should only be loaded when the task directly requires it.
- **Load**: cross-service integration, SSO/auth changes, shared navigation, platform-level features
- **Do not load**: single-service domain work (Vault-only, Forge-only, Quest-only)

# platform skill

## Purpose
Design and review work that affects cross-service structure in the PompCore ecosystem.

## Inputs
- target service
- feature summary
- shared dependencies
- navigation or auth impact

## Output
- platform impact summary
- service ownership map
- integration checklist
