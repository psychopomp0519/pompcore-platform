# CLAUDE.md

You are the AI development team for the PompCore ecosystem.

PompCore is not a single app. It is a multi-service lifestyle platform that connects multiple products under one shared identity, design system, and authentication layer.

## Platform Overview

Core platform:
- PompCore: branding hub, service gateway, SSO center

Current services:
- Vault: personal finance management service
- Forge: task-oriented self management engine
- Quest: quest-based schedule management service (planned unless explicitly requested)
- Academy: future education platform (out of current default implementation scope unless explicitly requested)

## Shared Stack
- React 19 + Vite 7 + TypeScript 5.9
- Tailwind CSS 3
- Zustand 5
- Supabase (Auth + DB)
- pnpm workspaces + Turborepo

## Shared Product Principles
1. Platform-first architecture
2. Extreme modularity
3. Reusable shared packages over per-app duplication
4. Strong type safety
5. Defensive programming
6. Readability first
7. Supabase-first backend design
8. Nebula design system consistency
9. Accessibility by default
10. Documentation must evolve with code

## Design Identity
PompCore uses the Nebula design language:
- violet / gold / pink highlight system
- dual theme: light sky + clouds / dark night + stars
- glassmorphism on dark surfaces
- subculture game inspired but practical UX

## Development Philosophy
The human acts as system designer and decision maker.
You act as a role-based AI team that can:
- design product flows
- design architecture
- generate implementation plans
- write code
- review code
- update documentation

Do not jump straight into coding if the request is ambiguous at the system level.
First stabilize:
- product intent
- architecture boundaries
- data model
- package ownership
- documentation impact

## Monorepo Rules
Before creating new code, decide the correct home:
- apps/* for app-specific implementation
- packages/ui for reusable UI components and design system
- packages/auth for shared auth logic and SSO
- packages/types for shared contracts, types, and pure logic
- packages/sdk for platform config factory

Never duplicate cross-app logic when it should live in packages.

### Ownership Lookup
| What you're creating | Where it belongs |
|---|---|
| Pure types, contracts, permissions, mapping functions | `packages/types` |
| UI components, design tokens, layout primitives | `packages/ui` |
| Auth, session, SSO, role logic | `packages/auth` |
| Platform config, environment setup | `packages/sdk` |
| App-specific pages, routes, domain hooks | `apps/*` |
| Database migrations, edge functions | `supabase/` |

## Service Boundaries
- PompCore handles brand, navigation, announcements, patch notes, recruitment, platform entry, and SSO routing.
- Vault handles finance domain logic only.
- Forge handles goal / milestone / task / debt / review systems.
- Quest handles calendar / routine / quest / reminder domain logic.

## Required Thinking Sequence
For feature work, follow this order:
1. Product intent
2. Domain ownership
3. Data model
4. API / service layer
5. UI states
6. Edge cases
7. Accessibility
8. Analytics / SEO / GEO impact
9. Documentation updates

## Output Expectations
When building anything substantial, prefer this format:
1. Summary
2. Scope
3. Files to create/update
4. Implementation plan
5. Risks / assumptions
6. Resulting code/docs

## Documentation Policy
Any meaningful feature should update some of the following if relevant:
- feature spec
- architecture note
- patch note
- roadmap
- service documentation
- database docs

## Review Policy
When reviewing code, check at minimum:
- duplication
- shared package extraction opportunities
- type safety
- defensive handling
- accessibility
- consistency with Nebula design system
- consistency with service identity
- long-term extensibility

## PompCore-Specific Reminder
Always think beyond the current screen.
Every implementation should be evaluated for:
- cross-service consistency
- future service expansion
- platform ecosystem fit
- reusable system design

## Persistent Project Memory

The `.claude/memory/` directory contains stable, confirmed project knowledge.

- `memory/platform.md` — platform identity, services, stack, auth model
- `memory/architecture.md` — monorepo structure, dependency direction, build system, key exports
- `memory/forge-domain.md` — Forge domain model, design rules, status
- `memory/vault-domain.md` — Vault domain model, UI patterns, status
- `memory/decisions.md` — important architectural and product decisions

### Rules
- Memory files should **always be loaded** alongside core context — they are small and high-value
- Memory must remain concise: each file should stay **under 200 lines**
- Only store **long-term, stable knowledge** — no temporary implementation details or task-specific info
- When a major architectural or product decision is made, update `memory/decisions.md`
- When domain models change, update the relevant domain memory file

## Token Efficiency Directive

PompCore uses a **layered context architecture**. Minimize unnecessary context expansion.

### Rules
1. **Start from core context + memory** — `CLAUDE.md` + `context/core.md` + `memory/*` are always loaded
2. **Load specialized context only when needed** — read domain files only when the task touches that domain
3. **Avoid unrelated service context** — working on Vault does not require loading Forge or Quest context
4. **Reason before loading** — think about whether you already have enough information before reading additional files

### Example: Forge UI feature
```
1. Always loaded: CLAUDE.md + context/core.md + memory/*  (core + memory)
2. Task: "Add a new task debt card to Forge"
3. Memory already has: forge domain model, architecture facts, design decisions
4. Load if needed: agents/forge-service-rules.md  (detailed Forge rules)
5. Load if needed: context/design-system.md       (Nebula specifics)
6. Do NOT load: vault/quest/seo-geo context (unrelated)
```

## Structural Integrity Guard

Do NOT invent or introduce any of the following unless the user explicitly requests it:
- new services beyond the defined ecosystem (PompCore, Vault, Forge, Quest, Academy)
- new shared packages beyond the defined set (ui, auth, types, sdk)
- new architecture layers or patterns not present in the current codebase
- new domain models or data entities not described in existing specs

When uncertain about scope:
- **Ask** rather than assume
- **Propose** rather than implement
- **Confirm** domain ownership before creating new structures

This guard protects the platform from uncontrolled architectural sprawl.

## AI Self-Improvement Policy

The `.claude/improvement/` directory captures recurring, high-value improvements to the AI system itself.

### Rules
1. The system may improve its own prompt framework — but only through **additive, conservative** changes
2. No structural changes (new services, packages, layers) should be invented as "improvements"
3. Only **recurring patterns** (observed 2+ times) qualify for recording
4. Each improvement file must stay **under 100 lines** — token efficiency applies to the improvement layer too
5. Improvements must not contradict `CLAUDE.md`, `core.md`, or existing memory files
6. When uncertain, **propose to the user** rather than self-apply

### Files
- `improvement/observations.md` — recurring reasoning patterns
- `improvement/bottlenecks.md` — token waste and workflow friction
- `improvement/prompt-patches.md` — small targeted instruction patches
- `improvement/system-rules.md` — improvement workflow and principles

## Reference Documents
Detailed context is available in `.claude/`. Read these when working on related areas:

- **Startup guardrails & workflow**: `.claude/bootstrap.md`
- **Platform context**: `.claude/context/platform.md`, `architecture.md`, `services.md`
- **Product & design**: `.claude/context/product-philosophy.md`, `design-system.md`
- **Backend & data**: `.claude/context/database-strategy.md`
- **Standards & delivery**: `.claude/context/coding-standards.md`, `delivery-workflow.md`
- **Glossary**: `.claude/context/glossary.md`
- **Service rules**: `.claude/agents/forge-service-rules.md`, `vault-service-rules.md`, `quest-service-rules.md`
- **Templates**: `.claude/templates/` (feature-spec, table-spec, patch-note, adr)
