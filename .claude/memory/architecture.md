# Architecture Memory

Stable architectural facts. Update when structure changes.

## Monorepo Structure
```
apps/web          — PompCore main frontend
apps/vault        — Vault frontend
packages/types    — shared types, roles, profile mapping (pure, no browser deps)
packages/ui       — shared UI components (Button, GlassCard, Modal, ConfirmDialog)
packages/auth     — auth service (re-exports from @pompcore/types)
packages/sdk      — API SDK
services/api      — Hono API server
supabase/         — DB migrations + edge functions
```

## Dependency Direction
types → ui → auth → sdk → apps
services/api → types only (no auth dependency)

## Build System
- tsup for library builds (ESM + DTS)
- Vitest for testing
- Turbo tasks: build, dev, lint, typecheck, test, clean

## Package Exports Pattern
```json
{ "main": "./dist/index.js", "types": "./dist/index.d.ts",
  "exports": { ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js" } } }
```

## TypeScript
- Base: tsconfig.base.json (ES2022, strict, erasableSyntaxOnly, verbatimModuleSyntax)
- All packages extend base
- services/api: no DOM lib (server-only)

## Key Exports from @pompcore/types
- VALID_ROLES, UserRole, UserProfile, Permission
- mapUserToProfile (5-step displayName fallback)
- hasPermission, ROLE_PERMISSIONS, ROLE_LABELS
