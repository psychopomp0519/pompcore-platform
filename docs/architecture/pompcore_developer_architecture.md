# PompCore Platform Architecture (Developer Document)

Version: 1.0\
Scope: **PompCore Platform / Vault / Forge**\
Purpose: **Direct input for AI coding systems and developers**

------------------------------------------------------------------------

# 1. Architecture Overview

PompCore platform follows a **Hub-and-Spoke service architecture**.

PompCore acts as the **platform hub**, while Vault and Forge are
**independent domain services**.

                    ┌──────────────────────────┐
                    │        PompCore          │
                    │  Platform Hub / SSO      │
                    │  Dashboard / Branding    │
                    └─────────────┬────────────┘
                                  │
                   ┌──────────────┴──────────────┐
                   │                             │
           ┌───────────────┐             ┌───────────────┐
           │     Vault      │             │     Forge     │
           │ Finance System │             │ Task Engine   │
           └───────────────┘             └───────────────┘

Key Principles

1.  **Central authentication**
2.  **Service-level domain ownership**
3.  **Shared UI + theme system**
4.  **Event-driven service integration**
5.  **Loose coupling between services**

------------------------------------------------------------------------

# 2. Platform Domains

  Service    Responsibility
  ---------- -----------------------------------------
  PompCore   Platform hub, authentication, dashboard
  Vault      Financial management
  Forge      Goal & task management

Each service is deployed independently.

------------------------------------------------------------------------

# 3. Domain Architecture

## 3.1 PompCore (Platform Hub)

Responsibilities

-   Landing page
-   User onboarding
-   Authentication hub
-   Cross-service navigation
-   Global dashboard
-   User profile
-   Subscription management

Primary Functions

    auth
    profile
    dashboard
    subscription
    settings

------------------------------------------------------------------------

## 3.2 Vault (Finance Service)

Responsibilities

-   Income tracking
-   Expense tracking
-   Budget management
-   Asset tracking
-   Financial reports
-   Saving goals

Core Modules

    transactions
    budgets
    assets
    reports
    saving_goals

------------------------------------------------------------------------

## 3.3 Forge (Task System)

Responsibilities

-   Goal management
-   Milestone system
-   Task engine
-   Task debt tracking
-   Weekly review

Core Modules

    goals
    milestones
    tasks
    task_debts
    weekly_reviews
    rewards

------------------------------------------------------------------------

# 4. Repository Structure

Repositories are separated by service.

    pompcore-main
    pompcore-vault
    pompcore-forge

Example structure

    apps/
      pompcore-web
      vault
      forge

    packages/
      ui
      auth
      theme
      utils

    infrastructure/
      supabase
      migrations
      config

Shared packages are reused across services.

------------------------------------------------------------------------

# 5. Technology Stack

  Layer        Technology
  ------------ ------------------
  Frontend     React 19
  Language     TypeScript
  Build Tool   Vite
  Styling      TailwindCSS
  State        Zustand
  Backend      Supabase
  Database     PostgreSQL
  Deployment   Cloudflare Pages
  Analytics    GA4 / Clarity

------------------------------------------------------------------------

# 6. Authentication Architecture

Authentication is centralized.

    User Login
        │
        ▼
    Supabase Auth
        │
        ├── PompCore
        ├── Vault
        └── Forge

All services share the same `user_id`.

Example Auth Flow

    1. User logs in on PompCore
    2. Supabase issues session token
    3. Token is reused by Vault / Forge
    4. Services validate JWT

------------------------------------------------------------------------

# 7. Database Architecture

Each service owns its database schema.

    supabase
     ├ pompcore schema
     ├ vault schema
     └ forge schema

Example

## PompCore Tables

    users
    profiles
    subscriptions
    user_settings
    notifications

------------------------------------------------------------------------

## Vault Tables

    vault_transactions
    vault_assets
    vault_budgets
    vault_reports
    vault_saving_goals

------------------------------------------------------------------------

## Forge Tables

    forge_profiles
    forge_goals
    forge_milestones
    forge_tasks
    forge_task_debts
    forge_weekly_reviews
    forge_rewards

Rule

    Services never directly access each other's tables.

------------------------------------------------------------------------

# 8. API Architecture

Each service exposes its own API layer.

Example structure

    /api

    auth
    profile
    dashboard

    vault/
      transactions
      budgets
      reports

    forge/
      goals
      tasks
      review

Example endpoint

    GET /api/vault/transactions
    POST /api/forge/tasks
    GET /api/dashboard/summary

------------------------------------------------------------------------

# 9. Event Driven Integration

Service communication uses events instead of direct DB access.

Example events

    vault.saving_goal_created
    vault.month_closed

    forge.task_completed
    forge.weekly_review_completed

Event example

    Vault emits event → saving_goal_created

    Forge receives event → create optional task

Benefits

-   loose coupling
-   service independence
-   scalability

------------------------------------------------------------------------

# 10. Shared Packages

Shared packages are reused across all services.

    packages/

    ui
    auth
    theme
    utils

Descriptions

  Package   Purpose
  --------- --------------------------
  ui        shared UI components
  auth      authentication utilities
  theme     theme system
  utils     common helpers

------------------------------------------------------------------------

# 11. Theme System

Theme is platform-wide.

Features

-   Light / Dark mode
-   Zustand theme store
-   Tailwind dark class system

Example

    <html class="dark">

Theme preference stored in

    localStorage
    user_settings table

------------------------------------------------------------------------

# 12. Dashboard Aggregation

PompCore dashboard aggregates summary data from services.

Example summary

    Today's tasks completed
    Weekly goal progress
    Monthly spending
    Saving goal progress

Only **summary APIs** are used.

Example

    GET /api/dashboard/summary

------------------------------------------------------------------------

# 13. Deployment Architecture

Each service is deployed separately.

    pompcore.cc
    vault.pompcore.cc
    forge.pompcore.cc

Deployment flow

    GitHub Push
        │
    Cloudflare Build
        │
    Deploy to CDN

------------------------------------------------------------------------

# 14. Security Model

Security model relies on Supabase RLS.

Example

    user_id = auth.uid()

All data is isolated by user.

Example policy

    CREATE POLICY "Users access own data"
    ON forge_tasks
    FOR ALL
    USING (user_id = auth.uid())

------------------------------------------------------------------------

# 15. Scalability Strategy

Future services can be added without architecture change.

Example expansion

    PompCore
     ├ Vault
     ├ Forge
     ├ Quest
     └ Academy

All services reuse

-   auth
-   ui
-   theme
-   platform APIs

------------------------------------------------------------------------

# 16. Coding Rules for AI

When generating code:

1.  Never access another service database directly
2.  Use shared packages when possible
3.  Use event-based communication
4.  Follow folder structure
5.  Use TypeScript strict mode
6.  Prefer server-safe APIs

------------------------------------------------------------------------

# 17. Minimal API Contracts

## Dashboard

    GET /api/dashboard/summary

Response

    {
      tasks_completed_today: number,
      weekly_goal_progress: number,
      monthly_spending: number,
      saving_goal_progress: number
    }

------------------------------------------------------------------------

## Forge Tasks

    POST /api/forge/tasks
    GET /api/forge/tasks
    PATCH /api/forge/tasks/{id}

------------------------------------------------------------------------

## Vault Transactions

    POST /api/vault/transactions
    GET /api/vault/transactions

------------------------------------------------------------------------

# 18. Final Architecture Summary

PompCore platform structure

                    PompCore
                       │
            ┌──────────┴──────────┐
            │                     │
          Vault                 Forge

Shared platform layers

    auth
    profile
    theme
    ui
    subscription
    dashboard

Domain separation

    Vault → finance domain
    Forge → productivity domain

This architecture enables:

-   independent development
-   scalable ecosystem
-   AI-assisted development
