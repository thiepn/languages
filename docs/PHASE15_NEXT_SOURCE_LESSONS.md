# Phase 15 — three source-owned next lessons (internal-only)

Original [draft PR #30](https://github.com/thiepn/languages/pull/30), SAME `feature/phase01-platform-ownership-20261022` branch. Exact verified Phase 14 parent `d7588b07e61a9054dcc38f680f559a84a716f291`.

## Verified source ownership

Source repository heads and evidence inspected Oct 23 2026:

| Language | Original entity | Pinned source and revision | Teaching coverage |
| --- | --- | --- | --- |
| French | `a1-02` | `thiepn/french/app/src/core/unified/u6-a1-01-04.ts`, `3fb5c720cfeceaf682ce53c897701b489b7eaf6f` (same current main) | Six être forms, nationality agreement, identity and location |
| Japanese | `cf-a1-01-02` | `thiepn/japanese/apps/web/src/study/courseFirstA1.ts`, draft PR #103 `1e3667ebdcb0cd50491c126b948c11f47414decb` (current main `951030c4...`; **not merged**) | Polite thanks, possible acknowledgment, getting attention, handing an item |
| Chinese | Original `我` row | `thiepn/chinese/src/demo-lessons.mjs`, `9688e7354142b7127fd5f6eb69b03b595a437008` (same current main) | 我 / 我们 / 我的, written sentence 我是学生。 and tone-marked source Pinyin |

No source rights were inferred. New `contracts/fixtures/phase15-source-lessons.json` owns only **internal** teaching and practice, source revision pins and original target IDs; all `editorialReview=pending`, `redistributionVerified=false`, and `publication=internal-fixture`. Chinese `rights=review-required` and not official HSK; Japanese still draft/unmerged; written response evaluation does not measure pronunciation. Existing Phase 13 lessons stay unchanged at exactly 22 frames each.

## Feature implementation

Three additional source-linked lessons (14 frames each) with one encounter, two meaningful teaching explanations, five guided exercises, five independent exercises including one ungraded original writing task, and a source-grounded reflection. Real contrasts include être forms/agreements, Japanese thanking vs gaining attention, and Mandarin 我 / 我们 / 我的. All deterministic accepted answers remain conservative; no new synonyms, automatic grading of independent writing or proficiency inference.

The existing `LessonV1` / `ExerciseV1` / `LanguagePluginV1` contract, `framesFor`, deterministic evaluator and Phase 05 reducer render **all six lessons**. The original three pilots retain their IDs, versions and default selection. Course now lists both original and next lesson per language, preserves distinct content-version-scoped activity checkpoints in tab session storage, displays each lesson's OWN source inventory and confirms before discarding unsubmitted writing when changing lessons. No new learning engine, review queue, scheduler, grader, account writes or native app changes.

The Phase 14 admission gate is explicitly extended ONLY for the three inspected next lesson IDs, original source repos, paths, revisions and rights classifications. The source-coverage and metadata-only editorial preflight remain fail closed; this is NOT an approval, redistribution license or migration consent.

## Qualification

Added Node `tests/phase15-multi-lesson.test.mjs` and five-project Playwright `apps/learner/tests/phase15-next-lessons.spec.ts`. Existing Phase 01/02 and Phases 03–14 tests remain executable and the original monorepo root verification is retained. Cross-browser tests must exercise all 14 frames for each language, preserved original course checkpoints, pending writing confirmation and 320px mobile actions.

Root original dependency `thiepn/account#df029d08a49ef27d3fd5fedf58400572746c0b47` must be installed with independently authorized SSH access. Isolated learner CI cannot replace `pnpm verify`, Hub build or consumer packaging. No dependency substitution, secret changes, credentials, migrations, approvals, public deployment or merge.

## Phase 16 handoff

Use independent source-authoring review for all six lessons. Qualify original rights and editorial judgments BEFORE any public publication; then inspect genuinely missing curriculum transitions, including source-attributed guided coverage for Chinese 好, without adding filler. Preserve the original apps and review history unless an explicit reversible migration is independently authorized.
