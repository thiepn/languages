# Phase 01 — Canonical source and authority boundaries (2026-10-22)

This document implements **only** source consolidation and future architectural ownership. Its machine-readable, pinned snapshot is [`contracts/phase01-source-ownership.json`](../contracts/phase01-source-ownership.json), verified by [`scripts/check-phase01-architecture.mjs`](../scripts/check-phase01-architecture.mjs).

## Verified source baselines

| Repository | Observed main commit |
| --- | --- |
| `thiepn/languages` | `387462ba39c6c1ea9721ede69f947887fa158497` |
| `thiepn/french` | `3fb5c720cfeceaf682ce53c897701b489b7eaf6f` |
| `thiepn/japanese` | `951030c4cdb256e76c99c253f22bddc679bc81ab` |
| `thiepn/chinese` | `9688e7354142b7127fd5f6eb69b03b595a437008` |

These are read-only GitHub source observations, **not** assertions about deployed software, learner state, source licensing, completeness or live CI success. Re-capture exact HEADs before Phase 02 imports; do not silently mutate this historical snapshot.

## Shared authority model

**Today:** French, Japanese and Chinese own their original course content, native grading, review history and storage. Languages owns shared contracts, migration adapters, privacy-minimal read models and an Account-backed, read-only Hub. It does **not** presently have a live, authoritative shared lesson player.

**After explicitly accepted later migrations:** `thiepn/languages` owns a single learner-facing runtime, exercise contracts, course authoring, canonical learner evidence and a single scheduler interface. Language packages own their verified linguistic rules and licensed course assets. Account/Core remains identity and authorized cross-device persistence infrastructure. The Hub remains read-only unless an independent, fully qualified and authorized redesign changes that boundary.

**No authority is transferred by creating this document or manifest.** The future owner designation is architectural, not permission to write to original learner databases, read private content or publish content.

## Capability decisions

| Capability | Reuse / adapt | Preserve or replace only after parity |
| --- | --- | --- |
| Content, prerequisites | Shared `content-schema`, `curriculum`; French authored units, Japanese seeds and overlays, Chinese original courses | Original IDs, approval, version, translations, source rights |
| Lesson player | Japanese typed `packages/study-player`, original React `StudyPlayer.tsx` as candidates | French Course and Chinese Journey remain native until proven equivalent |
| Exercises / grading | Japanese typed prompts, French grader, Chinese tone-aware Pinyin evaluation | No inferred human pronunciation rating from text, rubrics or device TTS |
| Scheduler / review | Existing Languages scheduler interface and replayable learner engine | French FSRS-5-compatible states, Japanese `ts-fsrs` card revisions, Chinese local revisions |
| Learner evidence | Shared `StudyEvent` contracts, adapter SDK | French records, Japanese events/FSRS traces, Chinese IndexedDB backups; no synthetic evidence |
| Images / audio | Current `AudioAsset` schema, Japanese audio adapter, PR #29 visual lexicon | Source licenses and speaker provenance; pending illustration branches are not merged |
| Account, sync, offline | Existing read-only Languages Hub and Account/Core interfaces | French IndexedDB v5, Japanese owner-locked backup, Chinese transactional local store |
| Source validation | Existing fail-closed Languages content-validation and adapter SDK | Private/third-party material never becomes public by implicit conversion |
| Navigation | Future one Course/Review/Continue shell | Existing native apps stay working until migration and regression acceptance |

The manifest contains pinned per-source paths and future-owner targets for all nine capability areas.

## Open branch conflicts / coordination

- **Languages #27** at `92474afbd2db7bb94b272d4ab0217b561910ec7e` is **diverged** from current main. It already implements a dynamic E0 source-derived content inventory and a read-only Chinese Hub preflight. **Reuse/reconcile** that executable work after resolving ancestry. This Phase 01 JSON is a *static architectural ownership snapshot*, not a replacement or duplicate content-counter.
- **Languages #29** at `cb38b6ae5cb6922d0bc00078f6e3a68174e7eb22` is a **draft** original-source visual lexicon. Its asset IDs/rights must be integrated through an agreed source-version boundary, not independently regenerated.
- **French #79** at `e91099ffc32444e3aae2148806998d8a00526a17` contains course-first navigation; **#80** at `d8d9476be2fe0b9a92b97b36304b6b3bbb9b7fda` is a parallel illustration consumer. Neither is on main and neither should be copied as a separate shared runtime.
- **Japanese #102** at `0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458` is an existing integration source; **#103** at `1e3667ebdcb0cd50491c126b948c11f47414decb` contains further unmerged, course-first guided A1 authoring; **#104** at `b6b0191488f71a0d6a4c749ef1d29c0ade929b81` branches from #102 rather than main. Select final course and visual sources after lineage checks.
- **Chinese #91** at `1a89c7cdba8f0a60f79260d953bba38d09b6eb21` is **diverged** and holds a substantial course-first, HSK-targeted source and recovery update. **#93** at `643e895f19938619f31749f964bf99f1895d5871` is the current visual consumer candidate. **#94** at `223f6017e8a5637eea81e611e54890a1fe14cd85` is explicitly superseded; do not port it.
- Existing branch CI or tests do **not** establish independent language correctness, official HSK mapping, human-validated pronunciation or release readiness.

These branches stay unmodified in Phase 01. Concurrent PR updates will require a new immutable source observation before Phase 02.

## Preservation and transition gates

1. No production writes, deployment, Account/Core calls, data deletion or old-repository mutations in Phase 01.
2. Preserve native source IDs, study histories, scheduler traces, local revisions, backups, private content and source rights.
3. Preserve authority boundaries until replay parity, account isolation and rollback are explicitly verified.
4. Cross-origin IndexedDB is not automatically readable at `languages.thiepn.dev`; later migration requires a deliberate authorized bridge.
5. Existing Languages Hub cannot grade, schedule, claim enrollment or mutate StudyEvents from imported read models.
6. No official proficiency equivalence and no unverified native-audio assertion.
7. A passed architecture script confirms the **snapshot's internal coherence and local platform paths only**. It cannot prove remote sources remain unchanged.

## Runnable offline contract

```sh
node scripts/check-phase01-architecture.mjs --check
node scripts/check-phase01-architecture.mjs --self-test
```

These commands require only Node (tested target: Node 24), no installation, private packages, tokens or access to learner data. The separate Phase 01 GitHub workflow executes both commands without production deployment. The tests intentionally reject changed repository SHA shapes, alternate future engine owners, Hub write authority, untraceable source references and duplicate PR records.

For **live source-derived learning-content counts**, use Languages PR #27's `scripts/ecosystem-inventory.mjs` once reconciled; it requires adjacent, checked-out original repositories and must not be replaced by this static architectural manifest.

## Precise Phase 02 handoff

Implement, on the existing Languages codebase:

1. `LessonV1` containing stable ID, content version, source/provenance links, communicative objective, prerequisites and typed teaching steps.
2. `ExerciseV1` containing supported task types, answer-normalization policy, accepted variants, feedback and explicit evidence/grading limits.
3. A `LanguagePlugin` capability boundary for French inflection, Japanese orthography/readings, Chinese Hanzi/Pinyin/tones—not language-name branches in generic player code.
4. Three **real, original-source-authorized** introductory lesson fixtures using the same schema and shared player.
5. A non-production learner entry and executable fixture tests, without native Account, Hub, scheduler or review-history write cutover.

**Adoption candidates:** `packages/content-schema/src/index.ts`, `packages/curriculum/src/index.ts`, `packages/adapter-sdk/src/index.ts`, Japanese `packages/study-player/src/index.ts`. Keep the original learner applications operational and their account, grading and review authority untouched.

**Do not start:** production learner-data imports; silently selecting a scheduler; content licenses inferred from a Git repository; bulk curriculum generation; unapproved visual asset publication; a fourth independent learner app.
