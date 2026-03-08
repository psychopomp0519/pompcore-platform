<!-- Context Loading Reminder:
1. Load core context (CLAUDE.md + context/core.md)
2. Load only relevant skills for the target service
3. Do not load unrelated service contexts
Example: Vault RLS → core + vault skill + supabase skill + database-strategy context
-->

Design row level security policies for the requested domain.

Must include:
- read rules
- insert rules
- update rules
- delete rules
- service-role exceptions if any
- risk notes
