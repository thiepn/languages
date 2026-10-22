# Phase 02 — canonical multilingual teaching contracts

Scope: extend the existing shared `packages/content-schema`; **no new learner app, duplicate engine, Account/Core writes, Hub enrollment, production deployment, source publication or native learner-state migration**.

## Concrete implementation

- `packages/content-schema/src/lesson-v1.ts`: TypeScript `LessonV1`, discriminated `LessonStepV1`, `ExerciseV1` and `LanguagePluginV1`, plus a shared deterministic structural validator.
- `packages/content-schema/src/index.ts`: exports the Phase 02 contracts from the existing authoritative content-schema package.
- `contracts/fixtures/phase02-source-lessons.json`: three **internal-only**, source-pinned examples with actual original language material, typed objectives, prerequisites, encounter/explanation/guided/independent steps and three exercises each.
- `tests/phase02-lesson-contract.test.mjs`: runnable Node 24, side-effect-free source/contract/evidence negative tests.
- `.github/workflows/phase02-lesson-contract.yml`: isolated browser-free Node 24 checks that do not require the privately pinned Account dependency.

## Source provenance and editorial boundaries

| Fixture | Original source | Original identifiers | License/review state |
| --- | --- | --- | --- |
| French | `thiepn/french` `3fb5c720cfeceaf682ce53c897701b489b7eaf6f`, `app/src/core/unified/u6-a1-01-04.ts` | `a1-01` | Original-owned per its source contract; redistribution not yet independently approved for shared public course |
| Japanese | `thiepn/japanese` `1e3667ebdcb0cd50491c126b948c11f47414decb`, `apps/web/src/study/courseFirstA1.ts` | `cf-a1-01-01` | Source declares original THIEPN learning text; shared public reuse and linguistic review pending; **unmerged PR #103** |
| Chinese | `thiepn/chinese` `9688e7354142b7127fd5f6eb69b03b595a437008`, `src/demo-lessons.mjs` | Characters `你`, `好` and their original associated words | Original demonstrations explicitly **not** independently linguistically certified and not official HSK; redistribution/review pending |

Chinese teaching guidance about the function of `你好` and `好吃` is supported by `thiepn/chinese/src/lesson-guides.mjs` on that same main revision; prompts combining original phrases were **adapted into internal fixtures**, not copied as preapproved course lessons. Japanese and French source text is used in small bounded original-source fixtures; original applications and their learner data are untouched.

None of these are a released learning course, reviewed audio, CEFR/HSK/JLPT certification, or permission to publish original/proprietary third-party content. `redistributionVerified=false`, `editorialReview=pending` and `publication=internal-fixture` are intentional. Runtime validator rejects `publication=public` unless all source records have verified redistribution, original ownership and editorial approval; that field alone is not a substitute for a full legal/editorial release gate.

## Core contracts

- `LessonV1`: immutable `id`, `contentVersion`, `languageId`, learning objective/skill dimension, prerequisite IDs, actual source record(s), publication class, ordered steps.
- `LessonStepV1`: `encounter`, `explain`, `guided`, `independent`, optional `reflect`. Teaching stages must be ordered and both guided and independent work must exist in these pilot fixtures.
- `ExerciseV1`: `choice`, `typed`, `free-production`. Discriminated answer contracts, source references, target language and transparent explanations.
- `LanguagePluginV1`: language-specific orthography, morphology, reading aids, tone declarations, normalization capabilities, audio classification. Core validation is language-neutral; no hardcoded French/Japanese/Chinese grading.
- Evidence always has `mayScheduleReview=false` and `mayAssertProficiency=false` in V1; independent ungraded production is not automatically called correct. Existing native schedulers remain authoritative.

This phase validates **data contracts and teaching-structure constraints** only. Exact-answer evaluation, linguistic normalization implementations, rendering, persisted progress, FSRS migration and production-ready cross-source publication remain subsequent phases.

## Focused verification

```sh
node --check packages/content-schema/src/lesson-v1.ts
node --experimental-strip-types --test tests/phase02-lesson-contract.test.mjs
node scripts/check-phase01-architecture.mjs --check
node scripts/check-phase01-architecture.mjs --self-test
```

Node 24 is expected; the TypeScript file uses only removable `import type` declarations at runtime. Check source-line and version drift before assuming the fixtures still match the current legacy branches. Human educational and pronunciation verification is separate.

The standard full-package `pnpm verify` can remain blocked by the existing pinned private Account dependency; focused Phase 02 validation does not imply full monorepo qualification.

## Phase 03 handoff

1. Implement one navigable, non-production learner shell and reusable teaching UI driven by `LessonV1` and `ExerciseV1` rather than language-specific pages.
2. Render all three **internal** fixtures using one shared player, explicit language plugin selection, keyboard/mobile-safe controls and accessible step feedback.
3. Keep free production ungraded; avoid creating independent stores, scheduler authority, Hub writes or Account tokens. Use ephemeral demonstration state only until a safe learner-state contract is expressly qualified.
4. Resolve pending editorial/rights approval before any public release of fixtures.
5. Verify one-click lesson entry and exit, progression, source-based explanations and the three-language acceptance run in a candidate environment.
