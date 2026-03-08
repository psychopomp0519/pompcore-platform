# architecture.md

## Architecture style
- Monorepo
- Shared packages
- App-level service boundaries
- Supabase-backed backend
- React frontend clients

## Preferred repository shape
- apps/* for deployable applications
- packages/* for shared systems
- infrastructure/* for migrations, config, deployment assets

## Shared packages (current)
- packages/types — shared contracts, pure logic, permissions
- packages/ui — Nebula design system, components, utils
- packages/auth — SSO, Supabase client, roles, cookie session
- packages/sdk — platform config factory

## Ownership rules
If logic is reused or likely to be reused across two or more services, prefer extracting it.
If logic is purely domain-specific, keep it inside the service app.

## Anti-patterns
- copy-pasting hooks between apps
- duplicate role constants
- duplicate auth mapping
- local-only UI implementations when a shared component should exist
