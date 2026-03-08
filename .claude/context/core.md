# Core Context Definition

This file contains the minimal knowledge required for all PompCore development. All other context files are optional extensions loaded on demand.

The core context should remain concise and stable. Do not expand this file unless the addition is universally required across all task types.

## Platform identity
- PompCore = multi-service lifestyle platform
- Services: Vault (finance), Forge (task management), Quest (scheduling), Academy (future)
- Shared stack: React 19 + Vite 7 + TypeScript 5.9, Tailwind CSS 3, Zustand 5, Supabase, pnpm + Turborepo

## Architecture invariants
- Monorepo: apps/* (deployable), packages/* (shared), services/* (backend)
- Dependency direction: types → ui → auth → sdk → apps
- No cross-app logic duplication — extract to packages
- Supabase-first backend design

## Design invariants
- Nebula design system: violet primary, gold accent, pink highlight
- Light/dark dual theme
- WCAG accessibility by default
- 44px minimum touch targets

## Service boundaries
- PompCore: brand, SSO, navigation, service gateway
- Vault: income, expense, assets, budget, reports
- Forge: goal, milestone, task, task debt, weekly review
- Quest: calendar, quest loop, routines, reminders

## Development rules
- Stabilize intent → architecture → data → UI → edge cases before coding
- Feature work must consider loading/empty/error/success states
- Never modify product identity without explicit approval
- Documentation must evolve with code changes
