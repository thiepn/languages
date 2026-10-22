# Phase 13 — independent identity, daypart and sentence-function transfer

**Original workstream:** same [draft PR #30](https://github.com/thiepn/languages/pull/30), branch `feature/phase01-platform-ownership-20261022`.

**Qualified starting point:** Phase 12 `b16fb3c65306280e649c48dc350867cac17b4a1b`; `main` remains at `387462ba39c6c1ea9721ede69f947887fa158497`.

## Source audit and change

Original pinned sources inspected before authoring:

| Source | Exact original entity | Revision | This phase's focus |
| --- | --- | --- | --- |
| `thiepn/french/app/src/core/unified/u6-a1-01-04.ts` | `a1-01` | `3fb5c720cfeceaf682ce53c897701b489b7eaf6f` | `Je m’appelle Inès.` vs `Je suis étudiant.` from the original grammar explanations; distinguish name and occupation, not substitute forms |
| `thiepn/japanese/apps/web/src/study/courseFirstA1.ts` | `cf-a1-01-01` | **Unmerged PR #103** `1e3667ebdcb0cd50491c126b948c11f47414decb` | Original afternoon-shop `こんにちは。` and the chronological difference between daytime, evening encounter and bedtime |
| `thiepn/chinese/src/demo-lessons.mjs` | Original `你` and `好` | `9688e7354142b7127fd5f6eb69b03b595a437008` | `你们` / `nǐmen` versus `你好` / `nǐ hǎo`; `你喜欢喝茶吗？` question versus `这个苹果很好吃。` statement |

The French grammar example `Je suis étudiant.` is an **independent** source example with a masculine occupation descriptor. It is not attributed to Inès or presented as her self-description.

All three introductions retain their original source IDs, revision pins, lesson IDs and accepted-answer authority. No external dictionary/source was substituted. Chinese remains an original, nonofficial, review-required demonstration rather than an HSK inventory.

## Implemented

- The single canonical `LessonV1` lesson now has **22 frames per language**, with ten independent activities. All earlier 20 frames retain their IDs and original sequence; the two source-based independent challenges are inserted **after** the Phase 09 writing task and before reflection.
- Expanded the existing second explanation for each language with a specific source-grounded distinction that the first 20 activities under-taught.
- French adds an independent `cloze` using the correct written `suis` in the occupation example and a functional `reading` requiring the learner to distinguish occupation from naming a person.
- Japanese adds independent **daytime typed recall** for the previously under-practiced afternoon shop greeting and a **three-situation ordering** of daytime shop, evening neighbor and bedtime. The written exercise uses the same permitted terminal punctuation policy as the current Japanese plugin.
- Chinese adds conservative **tone-marked Pinyin** for the original plural `nǐmen` and a deeper functional **reading** identifying a question versus a descriptive statement across the two original full sentences. It cites **both** original `你` and `好` source owner IDs where applicable.
- Original pinned source-aid and source-comparison primitives, authored explanations and wrong-answer evidence are reused. Wrong source readings remain incorrect even after reviewing a contrast; there are no newly invented answer variants or credit on reveal.
- No new player, grader, scheduler, store, review authority, engine or external API. The existing React player, `ExerciseV1`, `LanguagePluginV1`, deterministic evaluator and Phase 05 typed reducer remain authoritative.
- Native language apps, Account/Core, Hub, historic learner data, privacy and FSRS review authority remain completely unchanged.

## Acceptance and release limitations

Focused `tests/phase13-independent-depth.test.mjs` validates each source-backed form, two distinct new independent challenges, error feedback, unchanged answer authority, original source IDs and chapter/version checkpoints. `apps/learner/tests/phase13-teaching-depth.spec.ts` plus updated complete-journey acceptance run against real Chromium, Firefox and WebKit desktop and mobile. Test-only `phase13-acceptance-helper.ts` drives the **existing** exercise flow rather than creating alternate learning logic.

The isolated learner TypeScript/Vite build must not alter `dist/hub`. The original root `pnpm verify` and consumer package job still fails *before executing those commands* due to the pinned private Hub dependency `@thiepn/account-session` / `thiepn/account#df029d08a49ef27d3fd5fedf58400572746c0b47` returning GitHub SSH `Permission denied (publickey)`. Never infer a passing root CI result from passing browser tests, or modify authentication/dependency revisions to mask this blocker.

All new examples, composed teaching explanations and practice remain **internal editorial drafts**. The fixture still declares `publication=internal-fixture`, `editorialReview=pending`, and `redistributionVerified=false`. Written Japanese input and tone-marked Pinyin do not measure pronunciation, tone sandhi, official language levels, proficiency, or accredited scores.

**No merge, publication, migration or production deployment. Release readiness remains BLOCKED** until source/editorial rights approval, authorized root dependency installation and complete original monorepo qualification, and separately approved Account/Core, native FSRS and history interoperability.

## Phase 14 handoff

Prioritize deeper learner comprehension and source-reviewed transfer across each independent application without artificially extending the introductory lesson with redundant frames. Build a verified source coverage map and original rights/editorial gate before importing additional lessons. Preserve the existing canonical runtime, source owner identities, private learner histories, tab-only continuation and original apps. Repair reproducible mobile/IME/Firefox/WebKit defects with focused tests. Do not merge or deploy until separately authorized.
