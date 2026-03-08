# database-strategy.md

## Backend principle
Supabase-first design.

## Rules
- define table purpose before writing schema
- document relationships explicitly
- think through RLS at design time, not after implementation
- prefer auditable fields like created_at / updated_at
- use consistent status enums or constrained strings
- store user ownership clearly for every user-scoped record

## Required for new tables
- domain purpose
- ownership model
- read policy
- write policy
- update policy
- delete policy
- indexing considerations
- migration notes
