# Phase 37 — conflicting reports, authenticated Chinese transfer and protected unsent drafts

## Product changes

Implemented four **new, unpublished** Chinese beginner candidate lessons on the existing original source compiler/Phase 05 player; no new learning engine. The cases deepen competing speaker evidence rather than extending a fixed monologue:

- **Two meeting reports disagree about the speaker:** the moderator's `我们` collective account is misattributed to the visiting `你们`; the host changes the purpose to addressing outsiders; an independent `我` witness then responds
- **Two buyers dispute a market order:** original `你喜欢喝茶吗？` corrects a recorded preference request, but a returning buyer genuinely changes the request to `这个苹果很好吃。`; a separate newly arriving buyer needs `你好`
- **Two registrars dispute the same badge:** source `不是` denies a wrong teacher assignment, `我是学生。` supplies affirmative student identity, and `他是老师。` identifies the separate real teacher
- **Two badge claimants give conflicting accounts:** `我的` establishes an individual owner despite temporary custody, `也是` matches actual shared job identity, while `不是` rejects another visitor's false title

Each new lesson reuses all Phase 36 activities, then adds (1) evidence-grounded competing report reading with two *different authenticated original-source* distractors, (2) an independent interlocutor-changing corrective appeal with two different source-specific misconceptions, (3) precise original Hanzi typed reconstruction, (4) exact original tone-marked written Pinyin recall with a second genuine original-source Pinyin distractor and an unmarked-negative case, and (5) a **fifteenth completely independent ungraded practical dialogue** whose participant assignment and speaker identity must be revised. Result: four Phase 37 lessons of **62 original-engine exercises, 67 playable frames, 15 ungraded writing opportunities each**, totalling **69 internal editorial candidates**. Previous 65 candidate bundles remain compiled in the exact same order and unchanged, including four Phase 36 bundles with 57 exercises/62 frames/14 ungraded dialogue exercises. Original **12 canonical lessons and 126 original exercises** remain untouched.

All authentic target Hanzi and tone-marked Pinyin continue to derive only from the original Phase 16 quoted source whitelist and exact Phase 25 source records from `thiepn/chinese@9688e7354142b7127fd5f6eb69b03b595a437008:src/demo-lessons.mjs`. No invented Chinese sentence is presented as an authenticated original quotation or source transcript. Longer practical conversations are explicitly new editorial or learner-authored dialogues, not a fake listening or pronunciation recording. `DEMO_ONLY`, `review-required`, `editorialReview:pending`, `redistributionVerified:false` and immutable source/revision ownership remain unchanged. Publication and proficiency remain blocked. No HSK/CEFR status, native FSRS/review event, invented audio or redundant scheduler.

## Protected unfinished writing during revision recovery

The original Phase 05 player's bounded **three independent submitted revision history** from Phase 36 now also protects a genuinely **unsent working copy** before the learner restores an earlier independently submitted revision. It is retained in **one volatile in-page field** `protectedUnsubmittedDraft`, not persisted or written to checkpoint/native Chinese app.

- If no earlier unsent copy is protected, a historical revision restore captures the current nonempty, independently edited unsent draft before swapping.
- A **Restore unsent draft** action returns to that protected working copy. A restoration always clears any prior ungraded outcome and requires review before Continue.
- If a different unsent working copy was edited while the first was protected, historical restoration is rejected unchanged rather than silently overwriting the first one. The UI disables those conflicting restore actions and provides a functional status explanation; the learner can explicitly review the current draft before recovery.
- No extra pending draft slot, scheduler, identity, persistence engine, native history mutation or artificial grade is created. The original reducer alone enforces the transitions.
- Nonwriting exercises, unsent initial submissions without historical content, invalid history indices, missing protected copies and reviewed/cancelled states remain guarded. The original reset/load lifecycle discards all writing, including protected drafts.

## Regression and executable evidence

A new independent Node suite exercises: (1) all 65 original compiled candidate bundles identical, 12/126 canonical, 4×62 original-engine exercises and exact IDs/rights, (2) contextual interpretation and source custody, (3) each of two distinct wrong-original-quote corrections in both report and appeal, (4) authentic Hanzi/Pinyin and original punctuation with wrong/source/unmarked adversaries, (5) all **fifteen original writing activities** through multiple revisions, a protected independent unsent draft, successful protected-draft restoration, competing second unsent conflict, guarded re-review, and page-memory reset/load isolation, (6) nonwriting/invalid-transition rejection and (7) mutated quote, source ID, Pinyin, feedback, rights, locale and checkpoint isolation.

The exact same React/Playwright full-lesson browser suite is extended to all four new **67-frame** Phase 37 beginner lessons plus 320px mobile under genuine Chromium, Firefox and WebKit desktop/mobile runs. Cases exercise real wrong answers and source aid, independently changed interlocutors, both authentic source distractors, correct original Hanzi/Pinyin, and the **fifteenth authored dialogue**, including protected unsent-draft preservation across an earlier revision restore, disabled actions on competing unsent edits, and deliberate re-review/resubmission.

## Qualification and boundaries

**Baseline:** exact Phase 36 workflow [#40426477871](https://github.com/thiepn/languages/actions/runs/40426477871) passed 220/220 Node and strict TypeScript/Vite, but its browser job was **cancelled** and therefore did not report a real browser PASS or FAIL. The original independent root workflow failed during private Account SSH dependency installation; root `pnpm verify` and consumer package did **not execute**. This Phase 37 work does not weaken existing tests or attempt unauthorized Account dependency access.

Phase 37 verification must be assessed using the **new exact-head PR commit** and actual GitHub Actions job results for Node, TypeScript/Vite and browser engines separately. A running/cancelled browser job is not a green browser run.

**Repository restrictions:** same original draft PR #30, same `feature/phase01-platform-ownership-20261022` branch, fast-forward only, no new PR, merge, rebase, forced update, data migration, source-rights approval, staging/production writes, publication, activation or deployment.

## Phase 38

Inspect finished exact Phase 37 Chromium/Firefox/WebKit desktop/mobile, Node and TypeScript/Vite outcomes first. Repair genuine source, functional or test defects without weakening assertions. Then implement further original-source-backed independent Chinese comprehension/dialogue and reliable learner-controlled manual draft recovery through the same source/rights-authorized compiler, contracts and original player, without duplicating schedulers, graders or native progress ownership.
