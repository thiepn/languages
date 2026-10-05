# P1 — Language Core Domain Model, Language-Pack Contract & Repository Foundation

Status: **implemented**

## Objective

Create a real shared platform skeleton that proves structurally different languages can use the same foundational contracts without migrating either existing app.

## Delivered

- pnpm/TypeScript monorepo foundation
- core language-aware domain model
- immutable-style StudyEvent contract
- separate memory, mastery and proficiency contract shapes
- language-pack manifest contract
- validated language registry
- provenance/licensing-aware content primitives
- generic language-specific content extension points
- curriculum dependency graph validator and topological ordering
- French manifest fixture
- Japanese manifest fixture
- tests proving both manifests pass the same core validator
- tests proving language-specific modules remain outside core
- tests for duplicate language registration
- tests for curriculum missing dependencies and cycles
- tests for cross-language StudyEvent target rejection
- CI verification workflow
- Hub architecture boundary

## Explicitly deferred

P1 does **not**:

- move source code from French or Japanese;
- deploy `languages.thiepn.dev`;
- provide a production Hub UI;
- choose the final shared FSRS implementation;
- port French P22-P27 adaptive logic;
- replace existing app account/sync paths;
- claim CEFR equivalence from course completion;
- publish language content.

## Exit criteria

P1 is complete when:

1. French and Japanese satisfy one LanguagePack contract.
2. Japanese-specific features such as kanji/kana do not appear as universal core requirements.
3. French-specific features such as liaison/conjugation can be declared without branching core logic.
4. every learner entity/evidence identity carries a language boundary;
5. invalid curriculum dependencies are mechanically detectable;
6. provenance/licensing is part of the canonical content contract;
7. the repository typechecks and tests under CI.

## Next phase

**P2 — Shared Learner Evidence, Memory Scheduler Boundary & Mastery Projection Architecture**

P2 should map the Japanese `StudyEvent` + FSRS design and French longitudinal/mastery evidence into one replayable shared learner-state architecture, with compatibility adapters rather than direct migration.
