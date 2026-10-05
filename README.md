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
- `packages/consumer-contract` — zero-dependency P7 cross-repo compatibility and read-only authority contract
- `packages/read-model` — P8 privacy-minimal language progress projections and Hub aggregation plane
- `languages/french` and `languages/japanese` — language-specific manifests, learning graphs, proficiency/quality policies and production-app adapters
- `apps/hub` — P8 Hub data-plane adapter for normalized language cards and cross-language next action

See `docs/ARCHITECTURE.md`, `docs/P6_CURRENT_INVENTORY.md`, `docs/P7_ACCEPTANCE.md`, `docs/P8_ACCEPTANCE.md`, and the other phase acceptance documents in `docs/`.

## Migration policy

Existing `thiepn/french` and `thiepn/japanese` products remain authoritative. P6 adapters can inspect and translate their current structures, but shared-core adoption remains incremental and compatibility-driven; this repository does not silently rewrite production data.


## Cross-repo consumer surface

The first externally consumable package boundary is versioned as `@thiepn/languages@0.7.0` and exports `./consumer-contract`.

P7 is read-only: French and Japanese retain authority over their own content, learner state, scheduling, mastery, proficiency, orchestration and sync. Cross-repo compatibility drift is monitored separately from normal PR CI.


## P8 Hub read models

The second cross-repo surface is `@thiepn/languages/read-model` at package version `0.8.0`.

Each language app publishes a read-only projection containing workload, activity, labelled progress metrics, scoped proficiency evidence and its own next action. The Hub may aggregate simple counts and select among app-supplied priorities, but it never averages mastery/proficiency or converts framework bands.
