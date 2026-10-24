# Phase 25 — Source-pinned Chinese beginner authored curriculum

## Exact source and rights status

Original hand-authored `thiepn/chinese` demo source: `src/demo-lessons.mjs` at SHA `9688e7354142b7127fd5f6eb69b03b595a437008`. This file expressly states its lessons are *demonstrations*, not the official HSK inventory, and are not independently linguistically certified. Phase 25 introduces no official HSK, HSK 3.0, CEFR, recorded audio, speaking grade, redistribution approval or public publication claim.

The new `contracts/phase25-chinese-readings.json` is an immutable, narrowly scoped **original-source attestation** mapping source IDs, exact Hanzi strings and literal original tone-marked Pinyin; it is a receipt, not a second content or grading engine. The existing Phase 16 original quotation whitelist and original Phase 02/15/17/18 internal source encounters remain authoritative. The source-intake compiler requires **both** exact original Hanzi quotation and the exact matching original reading before Chinese-specific lesson generation, and continues calling original `admitInternalPilot` for rights, repository, source location, SHA and original exercise-receipt integrity. It never invents readings, awards source rights or imports native learner histories.

## Delivered learner experiences

Six original-editorial and still **internal-only** source-attested Chinese lessons:

1. Greeting one person or addressing a group — 你好 (nǐ hǎo), 你们 (nǐmen), 我 (wǒ); singular versus plural listener and speaker.
2. Introducing the speaker and the study group — 我 (wǒ), 我们 (wǒmen), 我是学生。 (Wǒ shì xuésheng.); group plurality and the 是 noun-identity construction.
3. Possession and identifying a teacher — 我的 (wǒ de), 我是学生。, 他是老师。 (Tā shì lǎoshī.); possession particle 的 versus linking 是.
4. Identity, negation and also — 是 (shì), 不是 (bú shì), 也是 (yě shì); contextual tone sandhi in the **written** original Pinyin, not invented audio.
5. Greeting and asking about tea — 你好, 你喜欢喝茶吗？ (Nǐ xǐhuan hē chá ma?), 好吃; final question particle 吗 versus greeting and adjective.
6. Greeting and describing a tasty apple — 你好, 好吃 (hǎochī), 这个苹果很好吃。 (Zhège píngguǒ hěn hǎochī.); adjectival meaning and referential food description.

Each unit has source-attested Hanzi + the original Pinyin alongside contextual reading, newly authored situational grammar explanation and source contrast, guided recognition, Hanzi source reconstruction with source-cited correction, independent contextual reading, independently selected situational answer, **typed tone-marked Pinyin orthography** against one exact original source reading, and an original independently authored **ungraded** conversation prompt with explicit self-review criteria. Typing written Pinyin is not a pronunciation, listening or oral proficiency grade.

All new authored situations and comparison prompts are clearly distinct from quoted original source sentences. No fictitious conversation is attributed to the Chinese repository. Every new lesson uses the same Phase 22–24 `SourceAuthoredIntake` -> `compilePinnedSourceIntake` -> `LessonV1/ExerciseV1/LanguagePluginV1` -> original Phase 05 reducer; there is no parallel scheduler, grader, lesson engine, storage schema or HSK claim.

The 6 new candidates add **36 separate candidate-only exercises**, bringing the total **editorial-only** candidate count to 21 (Phase 22 three, Phase 23 French six, Phase 24 Japanese six, Phase 25 Chinese six). Original canonical 12 lessons / 126 exercises, exact IDs/source receipts/versions/checkpoint storage, Phase 21 correction/revision workflows and native French/Japanese/Chinese learner history, local-first authority, FSRS, Account/Core/Hub boundaries remain untouched. Candidate writing and choices live in memory and vanish on reload.

## Tests and boundaries

Focused Node 24 executable tests exercise positive generation, source-provenance fidelity, contextual questions, tone-marked Pinyin accepted-versus-unmarked rejected, source-aided Hanzi corrections, unauthenticated rights-source-path-entity changes, invented quotations, false HSK publication, wrong-language specification, collision, original checkpoint preservation and learner-authored writing revision through the original reducer.

Playwright real Chromium/Firefox/WebKit desktop and mobile journeys cover every original-derived lesson and a 320px transfer case: incorrect answer, source correction, correct guided form, complete tone-bearing reading, source reconstruction, independent contextual transfer, tone-marked Pinyin recall, ungraded independent writing, canonical course restoration and no new local persistence.

Phase 24 exact-head workflow [#40117723496](https://github.com/thiepn/languages/actions/runs/40117723496) genuinely completed with 117/117 Node PASS, isolated TypeScript/Vite PASS and 660/660 actual desktop/mobile browser tests PASS; separate root-compatibility FAIL at unchanged private Account SSH dependency. Phase 25 must report exact-head results separately, never simply inherit those successes. No credentials, pins, release rights, staging writes, migration or deployment were changed.

## Phase 26 continuation

Expand the Chinese beginner's source-backed reading and writing journey further through the same compiler and evidence receipts, increasing independent transfer and grammar contrasts while preserving local-first native ownership and explicit nonofficial HSK holds. Fix only demonstrated executed defects and maintain same PR ancestry.
