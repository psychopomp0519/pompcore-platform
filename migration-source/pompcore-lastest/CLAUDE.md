# PompCore - Claude Code Instructions

## Project Overview
- **Company**: PompCore | **Stack**: React 19 + TypeScript + Vite 7 + Tailwind 3
- **DB/Auth**: Supabase | **State**: Zustand
- **Sub-projects**: Vault (household ledger), Quest (schedule management)
- **Design**: Nebula Theme (Violet #7C3AED + Gold #FFD700 + Pink #EC4899)
- **Current Version**: v0.4.8

## Required Reading Before Work
1. `docs/templates/AI_WORK_RULES.md` - Core work rules
2. `docs/memory/README.md` - Project context + work rules
3. `docs/roadmap/README.md` - Planned features (avoid duplicate work)
4. `docs/completed/README.md` - Completed work (avoid duplicate work)

## Custom Skills (MUST follow when applicable)

All skill definitions are in `.claude/skills/` as extracted SKILL.md files:

### 1. plan-first (Always Active)
**Trigger**: Any task requiring execution (coding, docs, analysis, design, config changes)
**Rule**: Research -> Plan -> Confirm -> Execute. Never start work without investigation and user approval.
- Investigate project files and code structure first
- Present a structured plan and get user approval before executing
- Execute step by step, reporting after each step
- See: `.claude/skills/plan-first/SKILL.md`

### 2. clean-code (When writing/modifying code)
**Trigger**: Any code creation or modification
**5 Principles**:
1. Modularization - Single responsibility, functions under 20 lines
2. Structured comments - JSDoc, file headers, section dividers
3. No magic values - Extract constants for repeated/meaningful values
4. Environment variables - Never hardcode secrets/config
5. LSP-friendly - Explicit types, no `any`, return types declared
- See: `.claude/skills/clean-code/SKILL.md`

### 3. code-verifier (On explicit request only)
**Trigger**: User says "verify", "review", "check code", etc.
**8-step pipeline**: Requirements -> Syntax -> Security/Deps -> Logic/Error handling -> Code quality -> Performance -> Tests -> UX flow
- Generates `verification-report.md`
- See: `.claude/skills/code-verifier/SKILL.md`

### 4. project-docs (After code changes)
**Trigger**: After any code creation or modification
**Structure**: `docs/INDEX.md` (overview) + `todo.md`, `done.md`, `guidelines.md`, `architecture.md`, `decisions.md`
- INDEX.md must provide full project overview at a glance
- See: `.claude/skills/project-docs/SKILL.md`

### 5. uxui-optimizer (When working on UI/UX)
**Trigger**: UI component creation, design review, UX improvement requests
**References**: Material Design 3, Apple HIG, Fluent 2, MUI, Bootstrap, KRDS, SOLID 2.0
**Checklist**: Information architecture, components, typography, color/accessibility, feedback/states
- See: `.claude/skills/uxui-optimizer/SKILL.md`

### 6. seo-geo-adsense (When working on SEO/monetization)
**Trigger**: SEO, GEO, AdSense optimization requests
**3 Axes**: AdSense optimization, SEO (Google/Naver), GEO (AI search engine citation)
- See: `.claude/skills/seo-geo-adsense/SKILL.md`

## Git
- GitHub: psychopomp0519/pompcore-main (Private)
- Push: Use `$GH_TOKEN` environment variable for HTTPS auth
- Commit messages in Korean

## Extension Points
- New project: `src/constants/projects.ts`
- New page: `src/router/index.tsx`
- New icon: `src/components/icons/Icons.tsx` (ICON_MAP)
- New brand: `src/components/common/BrandText.tsx` (BRAND_CONFIG)
- Design tokens: `tailwind.config.ts`
- Patch notes: `src/constants/patchnotes.ts`
- Announcements: `src/constants/announcements.ts`
