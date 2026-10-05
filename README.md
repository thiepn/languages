# THIEPN Languages

Shared language-learning platform for THIEPN language products.

## Current foundation

- `packages/domain` — language-aware entities, StudyEvents, mastery/memory/proficiency contracts
- `packages/language-registry` — language-pack manifests and capability registry
- `packages/content-schema` — provenance-aware canonical content primitives
- `packages/curriculum` — curriculum dependency-graph validation
- `packages/scheduler` — replaceable memory scheduler boundary + FSRS adapter
- `packages/learner-engine` — replayable evidence, mastery, durability and retention projections
- `packages/skill-graph` — language-specific skill/prerequisite/transfer graphs and evidence profiles
- `packages/orchestrator` — next-best-activity ranking, bounded calibration and adaptive blocks
- `packages/proficiency` — assessment gates, coverage-aware internal promotion, milestones and scoped framework mappings
- `languages/french` and `languages/japanese` — language-specific manifests, learning graphs and proficiency policies
- `apps/hub` — reserved boundary for the future multi-language hub

See `docs/ARCHITECTURE.md` and the phase acceptance documents in `docs/`.

## Migration policy

Existing `thiepn/french` and `thiepn/japanese` products remain authoritative. Shared-core adoption is incremental and compatibility-driven; this repository does not silently rewrite their production data.
