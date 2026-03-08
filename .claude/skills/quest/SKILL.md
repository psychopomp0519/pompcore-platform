---
name: quest
description: >
  Quest 서비스(퀘스트 기반 일정 관리) 기능 개발 스킬.
  캘린더, 퀘스트 루프, 루틴, 리마인더, 보상 시스템 관련 작업 시 사용한다.
---

## Context Activation Rule
This skill should only be loaded when the task directly requires it.
- **Load**: working on Quest features (calendar, quests, routines, reminders, rewards)
- **Do not load**: Vault finance work, Forge task management, platform-level changes

# quest skill

## Purpose
Design Quest as a quest-loop scheduler rather than a plain calendar clone.

## Core concepts
- calendar
- quest items
- routine loops
- reminders
- completion rewards

## Guardrails
- keep the quest metaphor meaningful
- do not sacrifice scheduling clarity for theme
