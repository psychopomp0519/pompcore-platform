# @pompcore/auth

Shared authentication and SSO layer for the PompCore platform.

## Overview

Provides Supabase client initialization, session management with hybrid cookie storage, role-based access control (leader/member/user), Google OAuth helpers, and account linking utilities.

## Install

```bash
pnpm add @pompcore/auth
```

## Usage

```ts
import { useAuthStore, supabase } from '@pompcore/auth';
```

## Build

```bash
pnpm --filter @pompcore/auth build
```
