# THIEPN Languages

Shared language-learning platform for THIEPN language products.

## P1 scope

This repository defines the language-independent contracts that future French, Japanese and other THIEPN language products can share without forcing identical pedagogy.

Current foundation:

- `packages/domain` — learner evidence, entity, skill and enrollment contracts
- `packages/language-registry` — language-pack manifest and registry contract
- `packages/content-schema` — provenance-aware canonical content primitives
- `packages/curriculum` — dependency-graph validation
- `languages/french` and `languages/japanese` — contract fixtures proving two structurally different languages fit the same core
- `apps/hub` — reserved boundary for the future multi-language hub

See `docs/ARCHITECTURE.md` and `docs/P1_ACCEPTANCE.md`.

## Non-goal

P1 does not migrate runtime behavior from `thiepn/french` or `thiepn/japanese`. Existing products remain authoritative until later compatibility and migration phases.
