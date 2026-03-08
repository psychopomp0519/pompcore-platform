# Bottlenecks

Token waste patterns and workflow inefficiencies. Only record patterns that repeat across multiple sessions.

## Format

```
### BN-NNN: [short title]
- Type: [token waste / workflow friction / context bloat / reasoning loop]
- Frequency: [how often]
- Cost: [estimated token impact: low / medium / high]
- Mitigation: [what to change]
```

## Entries

### BN-001: Token efficiency rules duplicated in CLAUDE.md + bootstrap.md
- Type: context bloat
- Frequency: every session (both always loaded)
- Cost: medium
- Mitigation: Keep loading strategy in bootstrap.md only; CLAUDE.md should reference it with one line.

### BN-002: Context files not auto-loaded but written as if they are
- Type: workflow friction
- Frequency: every session
- Cost: low
- Mitigation: Accept that only CLAUDE.md is auto-loaded. context/* files are reference-only — write them accordingly.

### BN-003: Circular plan-execute-evaluate loops for structural changes
- Type: reasoning loop
- Frequency: 3 major cycles
- Cost: high (50-100KB token waste per cycle)
- Mitigation: Add rule: "Before creating 3+ files from a reference doc, validate the first file against the target system before proceeding."
