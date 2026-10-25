# Phase 26 — Chinese contextual reading, targeted repair and independent transfer

## Existing source and ownership

This continues the original Phase 22–25 source-intake/compiler, versioned LessonV1/ExerciseV1/LanguagePluginV1 and original Phase 05 player. Chinese quotations are exclusively the original DEMO_ONLY source expressions from `thiepn/chinese@9688e7354142b7127fd5f6eb69b03b595a437008:src/demo-lessons.mjs`. All Hanzi/meaning/Pinyin combinations must still match the unchanged Phase 16 quoted source receipt and Phase 25 exact Pinyin manifest, as well as the original authoring source and `admitInternalPilot` rights and source ownership checks.

No official HSK level, native Chinese learner progress/scheduling/FSRS authority, audio/speech assessment, redistribution permission or publication is granted. No additional curriculum source is invented; learner-created dialogues and situational descriptions are clearly described as new independent writing, not original recordings or quotations.

## Four substantive original-source-backed learning scenarios

1. **Reading a café greeting and tea request.** Distinguish the greeting 你好, the complete tea-preference question 你喜欢喝茶吗？, and the food-quality expression 好吃, across two different visitors.
2. **Correcting a mistaken student or teacher identity.** Contrast 我是学生。, 他是老师。, and 不是 through a role reversal and source-backed specific correction.
3. **Changing group, listener and shared role.** Distinguish 我们, 你们, and 也是 when different representatives take turns speaking for or addressing a group.
4. **Reading a fruit description beyond the greeting.** Contrast 你好, 好吃 and the source's full 这个苹果很好吃。 in a specific-referent tasting scenario.

Each new lesson preserves the existing Phase 25 six base exercise forms (guided interpretation, attested Hanzi reconstruction or valid cloze, contextual reading, situational recognition, exact tone-marked Pinyin typed recall, independent ungraded original dialogue). Phase 26 additionally compiles through **the same source-intake function and Phase 05 player** three meaningful exercises per lesson: a guided source-specific misconception repair choice with the wrong-source expression triggering detailed corrective feedback; a second independent original-quote contextual reading task explicitly labeled as an *authored situation rather than a source transcript* with anchored Hanzi/Pinyin meanings and source-specific error correction; and a further **ungraded** independently written dialogue revision for a changed listener, speaker, referent or event.

The source authoring validation rejects unverified correct/wrong pairs, source/rights changes, fabricated Pinyin, ungrounded corrections, empty or duplicate misconception cues, invalid second-read passage contexts, inadequately defined independent writing criteria, wrong-language or unpinned source evidence, and exercise ID collisions. The original central ExerciseV1 validator checks misconception-source aid, evidence-policy, and reading contracts; it is not weakened or forked.

The four lessons add **36 new candidate-only exercise IDs (9 each)** without altering any of the previous **21 editorial candidate lessons**, their IDs/frames/exercises, or the canonical **12 source lessons / 126 original exercises** and version-scoped checkpoints. The new internal-only authoring catalog contains 25 candidates total. No new scheduler, grading engine, persistence store, API, migration, app-owned writer or release gate is introduced.

## Verification

Focused executable Node tests verify exact source and receipt fidelity, earlier candidate immutability, 4 x 9 new exercises, correct source-specific misconception feedback and correction outcomes, authored reading source labeling, two separate ungraded original-player writing/revision experiences, adversarial source/rights/quote/reading cases, and unchanged original checkpoint serialization.

Genuine Chromium, Firefox and WebKit desktop/mobile learner journeys test all four Chinese scenes, explicit incorrect-source repair, wrong-answer feedback, source comparison, secondary contextual reading, written tone-marked Pinyin versus unmarked, two independent ungraded writing drafts, canonical course return and memory-only state. The 320px viewport test covers one full representative scene.

Prior Phase 25 final-head [workflow #40145630238](https://github.com/thiepn/languages/actions/runs/40145630238) truly completed isolated learner **122/122 Node PASS, strict TypeScript/Vite PASS, 695/695 Playwright PASS**. Its original monorepo root compatibility remains blocked during install by the unchanged pinned private Account SSH dependency; `pnpm verify` and `pnpm package:consumer` did not execute. Phase 26 new exact-head results must be reported separately.

## Phase 27 continuation

Deepen original-source-backed Chinese beginner independent comprehension with richer cross-scenario selection and learner-led dialogue reconstruction, while preserving source permission holds, original ID/learner-state ownership, ungraded writing and local-first boundaries. Prioritize feature implementation and fix reproduced defects only.
