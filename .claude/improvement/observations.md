# Observations

Recurring patterns noticed during development. Only add confirmed, repeated observations.

## Format

```
### OBS-NNN: [short title]
- Frequency: [how often observed]
- Impact: [low / medium / high]
- Description: [what happens]
- Suggested action: [what could improve it]
```

## Entries

### OBS-001: Monorepo package references drift from reality
- Frequency: 3+ sessions
- Impact: high
- Description: CLAUDE.md and context/architecture.md list packages/theme and packages/utils that don't exist. packages/sdk exists but is missing from CLAUDE.md monorepo rules.
- Suggested action: Fix references now; add rule to verify package list against actual workspace before documenting.

### OBS-002: Service definitions duplicated across 5 files
- Frequency: every session (always loaded)
- Impact: medium
- Description: Same service list repeated in CLAUDE.md, context/core.md, context/platform.md, context/services.md, memory/platform.md. Maintenance burden and subtle inconsistency risk.
- Suggested action: Designate memory/platform.md as single source of truth. Other files should summarize or reference.

### OBS-003: Ownership confusion in monorepo
- Frequency: 7+ explicit questions across sessions
- Impact: high
- Description: Repeated uncertainty about whether code belongs in apps/* or packages/*. Permissions logic, Button, mapUserToProfile all started in wrong location before being moved.
- Suggested action: Add ownership lookup table to CLAUDE.md with clear file-type-to-package mapping.

### OBS-004: Files created then immediately deleted or rewritten
- Frequency: 3 major cycles (agents, skills naming, build configs)
- Impact: high (token waste)
- Description: Large structures created from reference docs, then evaluated and found incompatible with Claude Code, then rebuilt. Pattern: create → evaluate → delete → recreate.
- Suggested action: Add pre-flight validation rule: verify compatibility with target system before creating files.
