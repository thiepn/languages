# Phase 08 — independent transfer and source-led remediation

**Original draft PR:** [#30](https://github.com/thiepn/languages/pull/30)  
**Branch:** `feature/phase01-platform-ownership-20261022`  
**Qualified Phase 07 starting head:** `6f29d7cfd7843fe4d6620c2cab0e7fecd7c9f00a`

## Existing source and authority checks

Before implementation, the branch/main ancestor and same PR were reverified. The Phase 01, Phase 02 and combined Phase 03–07 workflows had all succeeded on the exact Phase 07 SHA. Original source revisions were unchanged: French main `3fb5c720cfeceaf682ce53c897701b489b7eaf6f`, Japanese main `951030c4cdb256e76c99c253f22bddc679bc81ab` with still-unmerged referenced Japanese PR #103 at `1e3667ebdcb0cd50491c126b948c11f47414decb`, and Chinese main `9688e7354142b7127fd5f6eb69b03b595a437008`.

## Implemented without new engines

- Extended the same `ExerciseV1` with an **optional source aid**: source text, original supplied meaning, and actionable comparison cue. The fail-closed validator requires that the *exact text and meaning* match one of that lesson's existing, pinned Encounter examples. Fabricated or mismatched source aids are rejected.
- Incorrect feedback may now expose a native, keyboard-operable **Review source example** disclosure with text, translation and comparison cue. It stays separate from an answer reveal, from correctness, and from learner grades. It is neither shown on correct responses nor treated as a new accepted answer.
- Added **three distinct independent source-based tasks per language** after the existing independent transfer: situated cloze, sentence ordering, and contextual reading. Every one reuses `LessonV1`, `ExerciseV1`, `LanguagePluginV1`, `lesson-model.ts`, the Phase 05 typed reducer and the *same* React player.
- The introductory internal fixture for each of French, Japanese and Chinese contains **19 frames and seven independent tasks**. The new content is intentionally bounded to original examples, not a promise of complete A1/HSK/CEFR/JLPT coverage.
- French: informal `Moi, c’est Malik`, the farewell `Au revoir, à demain` and a situated first-meeting dialogue; written accents in independent forms remain meaningful.
- Japanese: morning greeting to a teacher, daytime-to-evening expression order, and recognizing a bedtime expression versus an evening arrival; script input is not a speaking score.
- Chinese: the source question `你喜欢喝茶吗？`, its Hanzi ordering and contrast to `你好` and `这个苹果很好吃。`; lexical tones and pronunciation are never claimed from these written tasks.
- All old content IDs, source revision pins, original lesson stages, old deterministic checks, source permission metadata and original account/review ownership are preserved. New lesson content versions end in `-p08`, deliberately invalidating older positional preview checkpoints rather than silently misaligning them.

## Testing and quality boundaries

The **original** `.github/workflows/phase03-learner-preview.yml` now runs new `tests/phase08-independent-transfer.test.mjs` with all Phase 02–07 Node tests and `apps/learner/tests/phase08-independent.spec.ts` with the existing Playwright suite across desktop Chromium/Firefox/WebKit and mobile Chromium/WebKit. Coverage includes all three new transfer sequences, uncredited correction and source evidence, accessible focus, reduced mobile viewport, recovery of versioned positions with **no saved answer text**, ordering controls, and prevention of false mastery/FSRS events. Exact run links and PASS/FAIL results are included in PR #30.

Root monorepo CI continues to skip draft PRs; an isolated preview build and cross-browser checks do not qualify production release.

## Explicit release and licensing boundaries

The original apps, Hub, Account/Core, native history, vocabulary scheduler, grades and permissions have **no changes or writes**. All language material (including the new prompts, contexts and source-review cues) remains `publication: internal-fixture`, `editorialReview: pending`, `redistributionVerified: false`. This work does not grant license rights or certify linguistic correctness. There is no publication, merge, migration, deployment, new persistence store, second grading engine or native review scheduler.

## Phase 09 handoff

Keep implementation-first. Improve the same multilingual learner with richer but review-bounded mistake repair, varied source-based transfer, better independent composition ergonomics and context-linked explanations. Address meaningful actual Firefox/WebKit/mobile and keyboard/IME defects without introducing ornamental microcopy, new schedulers, graders, lesson engines, event pipelines or storage. Preserve canonical contracts, original source IDs, Account/Core, Hub, native applications and all historical progress. Do not publicly release content until independent rights/editorial approval.
