# Phase 24 — Japanese A1 source-pinned original curriculum

## Provenance and editorial status

Original source: [thiepn/japanese PR #103](https://github.com/thiepn/japanese/pull/103), open draft at exact SHA `1e3667ebdcb0cd50491c126b948c11f47414decb`. The course-first source `apps/web/src/study/courseFirstA1.ts` was fetched at that revision before the phase was authored.

All twelve original Japanese expressions reused across the six new editorial lesson plans are already encountered in the original Phase 02/15/17/18 internal fixtures and the unchanged Phase 16 verbatim source-evidence manifest. All are drawn from three source units: `cf-a1-01-01` (time-conditioned greetings), `cf-a1-01-02` (politeness and help), and `cf-a1-01-03` (first contact), with unchanged translation, source ID, Japanese PR SHA, rights and editorial metadata. This phase does **not** assume newer Japanese source units, promote an unmerged PR, or import source-owned learner history.

## Actual learner feature

Six new author-written, original-source-verified Japanese **internal-only** lessons:

1. Time-specific polite greetings — distinguishing the contextual kanji labels 朝, 昼 and 夜 from uttered kana forms.
2. Arriving in the evening or going to bed — 夜 compared with 寝る前 and their different speech acts.
3. Asking for help and thanking — polite attention, gratitude and acknowledgment.
4. Giving an item and responding politely — giver, recipient and response ordering.
5. Opening a first introduction — はじめまして, the short noun + です identity construction, and よろしくお願いします.
6. From meeting a classmate to requesting help — transfer between interlocutors, first-contact language, attention and gratitude.

Every new draft is compiled through the same Phase 22 `compilePinnedSourceIntake` and Phase 05 lesson player, with three exact-source encountered expressions, newly authored real-world scene, grammar/context explanations, accessible source contrast, guided recognition, source-reconstruction cloze with exact Japanese punctuation-aware normalization and a source aid, independent contextual reading, situational transfer recognition and **ungraded independent writing**. Unlike French text, the source's kanji context labels are *not* presented as spoken parts of the greeting. New dialogue prompts are editorial, never attributed verbatim to native sources. No synthetic audio, official JLPT claim, pronunciation grade or unverified linguistic proficiency evidence is generated.

The six Japanese lessons add 30 candidate-only exercise IDs and six candidate-only lesson IDs. These bring the editorial previews to 15 total (three Phase 22, six French Phase 23, six Japanese Phase 24). The 12 canonical internal lessons/126 canonical exercises, their identifiers, original writing/correction routes, versions, source receipts, checkpoints and app-owned native scheduling, StudyEvents and FSRS authority are unchanged. No new persistence, scheduler, duplicate evaluator, grade or native migration is introduced. The Course editorial preview is memory-only.

## Admission and qualification

The original source-intake compiler now supports one optional `japaneseExpansion` with the same teaching and exercise structure as Phase 23's French expansion. For Japanese, normalize authored exact-form source reconstruction with the existing plugin's `japanese-terminal-punctuation` policy. The authoring contract rejects source drift, rights approval drift, invented source expressions, language mismatch, invalid cloze reconstruction, unverified source-aid citations, missing scene details and duplicate IDs. The Japanese course PR SHA is pinned and cannot be silently rewritten to Japanese `main` or treated as approved redistribution.

Run the committed focused `tests/phase24-japanese-authoring.test.mjs` with Node 24's type stripping, then the isolated learner TypeScript/Vite build and Playwright suites against genuine desktop/mobile Chromium, Firefox and WebKit. Distinguish PASS/FAIL/NOT_TESTED based on actual executed steps. Full original monorepo root `pnpm verify` and consumer packaging require the unchanged private Account SSH dependency, without credentials or pin changes.

## Phase 25

Next implement Chinese A1 original-source-backed beginner curriculum and practical contextual independent transfer through this same compiler and original Phase 05 player, respecting nonofficial HSK and Chinese local-first/native state boundaries. Preserve every original source identity and all pending editorial rights.
