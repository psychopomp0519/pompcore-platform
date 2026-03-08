# Vault Domain Memory

Stable domain knowledge for the Vault service. Update when domain model changes.

## Identity
- Personal finance management service
- Philosophy: accuracy, trust, clarity over flashy UX
- Accent: #10B981 emerald green

## Core Domain Model
- Transaction: income/expense record with category, account, date, amount
- Account: financial account (bank, cash, card, etc.)
- Category: hierarchical categorization with icons
- Budget: spending target by category or overall
- Savings: savings goal tracking with interest rate
- Recurring: recurring transaction templates
- Real Estate: property, lease, expense tracking
- Investment: portfolio and trade tracking

## UI Patterns
- Form buttons: cancel (ghost) + submit (primary) pattern
- Button migration: moving from raw buttons to shared <Button> from @pompcore/ui
- ConfirmDialog: uses shared Button with danger variant for destructive actions
- All forms follow consistent cancel/submit layout

## Current Status
- App: apps/vault (active, most developed service)
- 55+ component files
- Tailwind config: vault-color (#10B981)
- Button migration: in progress (ConfirmDialog done, 12 form files pending)
