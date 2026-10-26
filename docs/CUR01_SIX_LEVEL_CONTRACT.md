# CUR-01 — Six-level curriculum navigation contract

The A1, A2, B1, B2, C1 and C2 labels are selectable course navigation categories, **not** an assessment result or certification. `buildSixLevelCatalog` is a pure, read-only catalog projection over existing source-identified units/lessons. Every level is present, even when no published material exists. `available` requires a source ID and an unchanged canonical identity; `planned` cannot imply actual learning content.

`lessonNumber` is local presentation order only. Do not persist it as an event target. Existing StudyEvents, FSRS traces, learner projections and language-specific schedulers continue to be owned by their original applications.

Native Japanese CUR-01 reads the same six-category contract through an app-owned adapter; it does **not** replace native study engines or import unmerged Languages Phase 32 lesson-player work. Future explicit consumption should pin a compatibility baseline, preserving adapter ownership.

For CUR-02, adapt French and Chinese with the same levels without transforming HSK or JLPT scores into CEFR claims. Existing app authority and source-rights guards remain unchanged.

Validation: `pnpm exec vitest run tests/level-catalog.test.ts tests/curriculum.test.ts` and root TypeScript/build checks when dependencies are available.
