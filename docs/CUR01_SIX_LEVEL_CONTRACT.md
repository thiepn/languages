# CUR-01 — Six-level curriculum navigation contract

The A1, A2, B1, B2, C1 and C2 labels are selectable course navigation categories, **not** an assessment result or certification. `buildSixLevelCatalog` is a pure, read-only catalog projection over existing source-identified units/lessons. Every level is present, even when no published material exists. `available` requires a source ID and an unchanged canonical identity; `planned` cannot imply actual learning content.

`lessonNumber` is local presentation order only. Do not persist it as an event target. Existing StudyEvents, FSRS traces, learner projections and language-specific schedulers continue to be owned by their original applications.

Native Japanese CUR-01 reads the same six-category contract through an app-owned adapter; it does **not** replace native study engines or import unmerged Languages Phase 32 lesson-player work. Future explicit consumption should pin a compatibility baseline, preserving adapter ownership.

For CUR-02, adapt French and Chinese with the same levels without transforming HSK or JLPT scores into CEFR claims. Existing app authority and source-rights guards remain unchanged.

Isolated qualification: `node --experimental-strip-types --test tests/cur01-level-catalog.test.mjs`. Additional Vitest and full root TypeScript/build checks require a working full-workspace install. The existing Hub pinned private Git dependency fails via `git@github.com` without SSH access on ordinary GitHub runners; this is not evidence of a CUR-01 code defect. Do not change Hub dependencies or report full typecheck as passing without executing it.
