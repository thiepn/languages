# THIEPN Languages

Shared language-learning platform for THIEPN language products.

## Current foundation

- `packages/domain` — language-aware entities, StudyEvents, mastery/memory/proficiency contracts
- `packages/language-registry` — language-pack manifests and capability registry
- `packages/content-schema` — provenance-aware canonical content primitives
- `packages/curriculum` — curriculum dependency-graph validation
- `packages/scheduler` — replaceable memory scheduler boundary + FSRS adapter
- `packages/learner-engine` — replayable evidence, mastery, durability and retention projections
- `languages/french` and `languages/japanese` — contract fixtures proving structurally different languages fit the same core
- `apps/hub` — reserved boundary for the future multi-language hub

See `docs/ARCHITECTURE.md`, `docs/P1_ACCEPTANCE.md`, `docs/P2_ACCEPTANCE.md` and `docs/P2_COMPATIBILITY.md`.

## Migration policy

Existing `thiepn/french` and `thiepn/japanese` products remain authoritative. Shared-core adoption is incremental and compatibility-driven; this repository does not silently rewrite their production data.
