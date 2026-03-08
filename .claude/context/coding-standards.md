# coding-standards.md

## Standards
- TypeScript first
- avoid any
- named exports by default where it improves reuse
- explicit types for public contracts
- small focused modules
- readable filenames
- defensive null handling
- user-facing states must include loading, empty, error

## Style rules
- explain purpose at file top for non-trivial modules
- add JSDoc for important exported functions
- keep hooks single-purpose
- keep components lean and presentational when possible
- move domain logic out of UI when complexity grows
