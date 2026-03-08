# System Rules — Self-Improvement Workflow

## Purpose

Capture high-value, recurring improvements to the `.claude` system. Keep it lightweight.

## Workflow

1. **Detect** — notice a recurring issue (same mistake 2+ times)
2. **Classify** — categorize as: token waste / reasoning failure / prompt ambiguity / workflow friction
3. **Propose** — write a small, specific patch (not a large rewrite)
4. **Validate** — confirm the patch improves future work without side effects
5. **Apply** — update the target file and record in `prompt-patches.md`

## Principles

- Only record patterns confirmed across 2+ sessions
- Patches must be small and reversible
- Never rewrite entire files as an "improvement"
- Token efficiency is itself a goal — improvement files must stay under 100 lines each
- If an improvement contradicts CLAUDE.md or core context, do not apply it — flag it for user review

## Anti-patterns

- Writing long retrospective documents
- Logging every single observation
- Creating new files or layers as "improvements"
- Improving things that are not broken
