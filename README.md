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
- `packages/content-validation` — structural, provenance, licensing, coverage and editorial release certification
- `packages/adapter-sdk` — migration inventory/readiness contracts and legacy compatibility utilities
- `languages/french` and `languages/japanese` — language-specific manifests, learning graphs, proficiency/quality policies and production-app adapters
- `apps/hub` — reserved boundary for the future multi-language hub

See `docs/ARCHITECTURE.md`, `docs/P6_CURRENT_INVENTORY.md`, and the phase acceptance documents in `docs/`.

## Migration policy

Existing `thiepn/french` and `thiepn/japanese` products remain authoritative. P6 adapters can inspect and translate their current structures, but shared-core adoption remains incremental and compatibility-driven; this repository does not silently rewrite production data.
