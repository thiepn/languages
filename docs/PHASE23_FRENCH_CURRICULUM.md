# Phase 23 — French A1 source-pinned authored curriculum

## Original material and authority

Canonical source: thiepn/french, commit 3fb5c720cfeceaf682ce53c897701b489b7eaf6f, app/src/core/unified/u6-a1-01-04.ts. This original file was fetched and checked before authoring. Every quoted expression in this batch also appears in an already admitted Phase 02, 15, 17 or 18 encounter and the Phase 16 original-source evidence manifest.

All new learning situations, grammatical explanations, model contrasts and independent dialogue prompts are **new editorial writing**, not disguised original-source dialogues. Content remains an **internal fixture** with editorial review pending and redistributionVerified=false. No manual review, independent French linguistic attestation, audio licensing or publication approval is implied.

## Implemented learner lessons

Six coherent new French A1 drafts have been added to the existing Phase 22 internal intake:

1. Greetings across the day — formal versus familiar register and time.
2. Introductions and departures — name expression and tomorrow's farewell.
3. Être with a speaker and a group — suis, sommes and sont, feminine plural agreement.
4. Places, people and agreement — tu es versus il/elle est, adjective agreement.
5. First mentions and known objects — un, des, le and referential continuity.
6. Feminine, elision and plural reference — une, l’, les.

Each compiles through the exact existing LessonV1 / ExerciseV1 / LanguagePluginV1 and uses the Phase 05 reducer. Each contains 3 attested encounters, explicit context, two substantive teaching explanations, source comparison, a guided source-recognition item, source-reconstruction cloze with original quote correction aid, independent contextual reading, independent situational recognition and an original ungraded dialogue-writing task with three authored criteria. Thirty **candidate-only** exercise IDs are new; the original 12 lessons/126 exercises, their exercise receipts and checkpoints are unchanged.

The original Phase 22 three candidates and all Phase 21 corrective routes are preserved. The new candidate lessons never enter native French progress or FSRS, Account/Core/Hub state or original source-app course registries. Candidates are only displayed in Course > Editorial study drafts, with transient memory-only responses. Leaving such a draft restores the originally selected canonical course lesson and position rather than promoting the candidate into learner history.

## Source admission and security

The existing source-intake compiler still compares every quote with the pinned lesson's original encounter (including reading and translation), original Phase 16 receipt, exact repository/source identity and frozen source SHA. The French-specific expansion is accepted only with 3 verified distinct encounters, an attested full-sentence cloze reconstruction (before + answer + after exactly equals an encountered quote), separately authored source-recognition answers, rich grammar and a nonempty transfer scenario. Duplicate exercise IDs, fabricated phrases, mismatched owner/revision, rights escalation or edited original quotations are rejected. Answers remain deterministic **formative exercises only**; open dialogue writing receives no automatic correctness, level, grade, scheduling or proficiency result.

## Demonstrated Phase 22 failure repaired

Run https://github.com/thiepn/languages/actions/runs/40113736974 executed 107/107 Node and TypeScript/Vite successfully, but 15 browser cases failed because a Playwright .or locator selected both a feedback parent and nested text (strict mode violation). The browser test now selects the single existing feedback element. No source-app data, grading logic or navigation semantics were changed merely to satisfy the test.

The full root workspace remains dependent on the unchanged private pinned thiepn/account revision df029d08a49ef27d3fd5fedf58400572746c0b47; only an owner-authorized infrastructure fix can resolve its SSH fetch. No credential, pin or deployment changes were made.

## Phase 24

Expand authentic source-grounded Japanese beginner curriculum using the same source-intake compiler and original player, preserving Japanese authoring rights, unmerged PR #103 source status, native review/evidence ownership and the existing source-versioned lesson checkpoints.
