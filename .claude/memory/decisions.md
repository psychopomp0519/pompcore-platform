# Decisions Memory

Important architectural and product decisions. Update when new decisions are made.

## Architecture Decisions

### AD-001: tsup for library builds
- Date: 2026-03
- Decision: Use tsup (ESM + DTS) instead of raw tsc for packages
- Reason: Solves composite/noEmit conflicts, simpler config
- Affects: packages/types, ui, auth, sdk

### AD-002: services/api depends only on @pompcore/types
- Date: 2026-03
- Decision: Removed @pompcore/auth dependency from services/api
- Reason: API server should not depend on browser-oriented auth code
- Affects: services/api imports, middleware

### AD-003: Pure logic in @pompcore/types
- Date: 2026-03
- Decision: mapUserToProfile, hasPermission, ROLE_PERMISSIONS live in @pompcore/types
- Reason: Single source of truth, no browser deps needed
- Affects: @pompcore/auth re-exports as shim for backwards compat

### AD-004: Nebula design system for shared Button
- Date: 2026-03
- Decision: Purple gradient primary (#7C3AED → #A855F7), 5 variants (primary/secondary/ghost/outline/danger)
- Reason: Platform-wide consistency, WCAG 44px min touch targets
- Affects: packages/ui/Button.tsx, all apps

### AD-005: Vitest for testing
- Date: 2026-03
- Decision: Vitest 4.0.18, root config includes packages/*/src and services/*/src
- Reason: Fast, TypeScript-native, compatible with monorepo
- Affects: vitest.config.ts, turbo test task

## Product Decisions

### PD-001: DisplayName fallback chain
- Order: display_name → full_name → nickname → email prefix → "Player"
- Whitespace-only and non-string values are ignored

### PD-002: Role hierarchy
- leader ⊃ member ⊃ user (permissions are strict subsets)
- Invalid roles default to "user"
