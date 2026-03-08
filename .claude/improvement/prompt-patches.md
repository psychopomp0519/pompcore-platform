# Prompt Patches

Small, targeted instruction changes that improve future AI performance. Each patch modifies a specific file or section.

## Format

```
### PP-NNN: [short title]
- Target: [file and section to modify]
- Problem: [what goes wrong without this patch]
- Patch: [exact text to add or change]
- Status: [proposed / applied / reverted]
```

## Entries

### PP-001: Fix monorepo package list in CLAUDE.md
- Target: CLAUDE.md → Monorepo Rules + Structural Integrity Guard
- Problem: Lists packages/theme, packages/utils (don't exist). Missing packages/sdk (exists).
- Patch: Replace package list with actual workspace packages: ui, auth, types, sdk
- Status: **applied** (Monorepo Rules + Structural Integrity Guard 모두 수정 완료)

### PP-002: Add ownership lookup table to CLAUDE.md
- Target: CLAUDE.md → Monorepo Rules (after existing list)
- Problem: Repeated confusion about where shared code belongs (7+ occurrences).
- Patch: Add lookup table mapping file types to package locations.
- Status: **applied**

### PP-003: Add pre-flight validation rule to bootstrap.md
- Target: bootstrap.md → Mandatory guardrails
- Problem: Files created from reference docs without verifying compatibility, then deleted and recreated (3 cycles).
- Patch: Add: "Before creating 3+ files from a reference document, create and validate the first file before proceeding with the rest."
- Status: **applied**

### PP-004: Deduplicate token efficiency rules
- Target: CLAUDE.md → Token Efficiency Directive
- Problem: Same loading rules exist in both CLAUDE.md and bootstrap.md. Redundant context every session.
- Patch: Replace CLAUDE.md Token Efficiency section with a reference to bootstrap.md.
- Status: deferred — needs careful rewrite to avoid losing important context

### PP-005: Fix context/architecture.md package references
- Target: context/architecture.md → Shared package candidates
- Problem: Lists non-existent packages/theme and packages/utils, same as CLAUDE.md.
- Patch: Align with actual workspace: types, ui, auth, sdk
- Status: **applied**
