# bootstrap.md

## Context Loading System

Do NOT automatically load every file inside `.claude/`.

PompCore uses a **layered context architecture**. Always start with core context, then load additional files only when the task requires them.

### Always load first (core + memory)
- `.claude/CLAUDE.md`
- `.claude/context/core.md`
- `.claude/memory/*` (all memory files — these are small and stabilize reasoning)

### Persistent Memory Layer

The `memory/` directory contains stable, high-value project knowledge that persists across sessions.

Load order:
1. `CLAUDE.md` — platform rules
2. `context/core.md` — minimal universal context
3. `memory/*` — stable project knowledge (platform, architecture, domains, decisions)
4. Task-specific context — loaded on demand per conditional rules below

Memory files are deliberately concise (under 200 lines each). They must always be loaded because they prevent redundant context re-discovery and stabilize reasoning across tasks.

Memory is NOT documentation. It stores only confirmed, stable facts. Temporary or task-specific information does not belong in memory.

### Conditional loading rules

| Task type | Additional context to load |
|---|---|
| UI work | `context/design-system.md`, `skills/ui-system/`, `agents/frontend.md` |
| Database / Supabase | `context/database-strategy.md`, `skills/supabase/` |
| Forge features | `agents/forge-service-rules.md`, `skills/forge/`, `context/services.md` |
| Vault features | `agents/vault-service-rules.md`, `skills/vault/`, `context/services.md` |
| Quest features | `agents/quest-service-rules.md`, `skills/quest/`, `context/services.md` |
| Architecture work | `context/architecture.md`, `agents/architect.md`, `skills/monorepo/` |
| Feature review | `agents/reviewer.md`, `context/coding-standards.md` |
| Documentation work | `skills/documentation/`, `context/delivery-workflow.md`, `templates/` |
| SEO / growth | `skills/seo-geo/`, `agents/growth.md` |
| System improvement | `improvement/*` (only when refining `.claude` structure or reviewing repeated failures) |

### Self-Improvement Layer

The `improvement/` directory captures recurring system-level improvements.

**NOT always loaded.** Only load when:
- reviewing repeated failures across sessions
- refining prompts or agent instructions
- improving `.claude` structure itself
- updating system rules

Normal feature implementation should NOT load the improvement layer.

### Loading discipline
1. Identify the task domain before loading context
2. Load only the files listed for that domain
3. If a task spans multiple domains, load the intersection — not everything
4. Prefer reasoning about what you already know before loading more files

---

Read the core context files first.
Then internalize the following workflow before generating any code.

## Your operating mode
You are working on PompCore, an AI-native multi-service platform.
Do not behave as a generic code generator.
Behave as a platform-aware development team.

## Mandatory startup sequence
1. Read `.claude/CLAUDE.md`
2. Read all files in `.claude/context/`
3. Identify which service the request belongs to
4. Identify whether the work belongs in app code or shared package code
5. If the request is feature-sized or larger, produce a short implementation plan before coding

## Mandatory guardrails
- Before creating 3+ files from a reference document, create and validate the first file before proceeding with the rest
- Do not duplicate shared logic across apps
- Do not invent inconsistent UI outside the Nebula system
- Do not add database tables without documenting relationships and intended RLS strategy
- Do not ship feature code without considering loading, empty, error, and success states
- Do not modify product identity casually
- Do not add paid-only restrictions to core functionality unless explicitly requested

## Required artifacts per substantial task
For medium or large tasks, generate or update:
- implementation plan
- feature spec or architecture note
- code
- patch note draft if user-visible

## Service identity reminders
- Vault = finance clarity, trust, summaries, disciplined input flows
- Forge = growth, momentum, done-first productivity, task debt management
- Quest = playful execution, calendar + quest loop, rhythm and progression
- PompCore = platform trust, discovery, gateway, shared identity

## Default question framing
Before coding, silently ask:
- Is this platform-level or app-level?
- Is this reusable later?
- What domain owns this data?
- What documentation will go stale if I change this?

## Output preference
Prefer well-structured outputs with headings and clear scope boundaries.
If multiple implementation options exist, recommend one and explain why.
