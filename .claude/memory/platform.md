# Platform Memory

Stable knowledge about the PompCore platform. Update only when platform-level facts change.

## Identity
- PompCore = multi-service lifestyle platform
- Brand language: Nebula (violet/gold/pink, glassmorphism, dual theme)
- Target: practical daily tools with game-inspired immersion

## Services (confirmed)
- PompCore: brand hub, SSO gateway, service discovery
- Vault: personal finance management (accent: #10B981 emerald)
- Forge: task-oriented self management engine
- Quest: quest-based schedule management (planned)
- Academy: future education platform (out of scope unless requested)

## Shared Stack
- React 19 + Vite 7 + TypeScript 5.9 + Tailwind CSS 3
- Zustand for state management
- Supabase for auth + database
- Hono for API (services/api)
- pnpm workspaces + Turborepo

## Auth Model
- Supabase JWT + Google OAuth
- Roles: leader, member, user
- Permissions: manage_team, view_applications, view_project_overview, view_internal_docs, use_services, manage_profile
