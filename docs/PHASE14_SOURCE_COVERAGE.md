# Phase 14 — source coverage and internal admission boundary

Same draft [PR #30](https://github.com/thiepn/languages/pull/30), branch `feature/phase01-platform-ownership-20261022`, starting from Phase 13 `8d9dc37142ea62ddee62b3dd3d5d006615fe2841`.

## Original source coverage and authorization

The existing **22-frame** internal lessons per French/Japanese/Chinese remain unchanged. No extra filler activities or answers were authored. Four original source records are pinned:

- French: original `thiepn/french` entity `a1-01` at `3fb5c720cfeceaf682ce53c897701b489b7eaf6f`; original-owned, editorial and redistribution verification pending.
- Japanese: original `thiepn/japanese` entity `cf-a1-01-01` at still-unmerged PR #103 SHA `1e3667ebdcb0cd50491c126b948c11f47414decb`; original-owned, editorial and redistribution verification pending.
- Chinese: original `thiepn/chinese` entities `你` and `好` at `9688e7354142b7127fd5f6eb69b03b595a437008`; non-official, review-required, editorial and redistribution verification pending.

`apps/learner/src/source-coverage.ts` derives a transparent source-owner inventory from canonical validated `LessonV1` / `ExerciseV1` and the existing `framesFor`. It indexes authored guided and independent activities, exact frame positions and ungraded writing counts. Multi-source exercises can be listed for each legitimately cited source; those are **source links**, not independent achievement statistics or distinct learner records.

`admitInternalPilot` fails closed for an unknown lesson, changed original source identity/owner/revision/path, attempts to promote an internal source to publicly reviewed/redistributed state, invalid schema, or missing source-linked guided/independent practice. Admitting new original material requires explicit separate source review and changes to the pinned preview allowance. `editorialPreflight` reports source-specific editorial/redistribution blockers, but **does not publish, authorize migration, verify rights, grade proficiency, or grant release**. Real source editorial decisions, root monorepo CI, Account/Core identity, original history/FSRS compatibility and production authorization remain separate conditions.

## Real learner feature

The **Course** view shows actionable source-linked independent practice grouped by original source entity. Each Practice control navigates to the exact existing exercise frame through the **same reducer/React player**, without copying exercises or creating another grading/review engine. Source shortcuts discard only volatile on-page response attempts; the existing unsent-writing confirmation protects a draft, and Cancel preserves that draft. Checkpoints remain lesson-content-version-scoped frame positions in the browser tab, not historical progress, account records, grades, scores, or FSRS scheduler records.

## Tests

`tests/phase14-source-coverage.test.mjs` verifies source and activity links, four records, original revisions, malicious/accidental metadata drift, publication boundaries and non-evidence. `apps/learner/tests/phase14-source-practice.spec.ts` verifies direct exercises for all three languages, dual-source Chinese attribution, draft loss cancellation and narrow 320px layout. The existing `.github/workflows/phase03-learner-preview.yml` now executes Phase 14 alongside all earlier Node and actual Chromium/Firefox/WebKit desktop/mobile browser tests.

**Root limitation:** original `pnpm install` previously failed over private SSH dependency `thiepn/account#df029d08a49ef27d3fd5fedf58400572746c0b47` with `Permission denied (publickey)`; independent browser/Node success cannot substitute for root verification. Do not alter its dependency pin or invent access.

All fixtures remain `internal-fixture`, `editorialReview=pending`, `redistributionVerified=false`; no original app, Account/Core, Hub, legacy learner-history, FSRS, deployment, merge, or public publication was changed.

## Phase 15 handoff

Use the source coverage and preflight to audit **actual next-course owners and revisions** before admitting more source material; focus on true independent transfer gaps, editorial errors and demonstrated multi-browser/mobile defects. Preserve original content IDs and rights. No new engine or implicit data-ownership transfer.
