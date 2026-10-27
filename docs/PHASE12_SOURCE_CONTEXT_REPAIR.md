# Phase 12 — original-source context comparison and targeted corrective practice

**Original draft PR:** [#30](https://github.com/thiepn/languages/pull/30)  
**Branch:** `feature/phase01-platform-ownership-20261022`  
**Starting Phase 11 SHA:** `8c2f2be316751a9d99e4a8c9d8864d260cff572a`.

## Implemented feature

The learner continues to use exactly one `LessonV1`, `ExerciseV1`,
`LanguagePluginV1`, deterministic evaluator and Phase 05 typed reducer.

The canonical `ExerciseV1` now optionally carries a **source comparison**:
two exact original encountered text/meaning pairs and a functional contextual
cue. The pure schema validator **fails closed** if either text or its translation
differs from the source-pinned encounter, both expressions are identical or
the contrast cue is missing. No new scheduler, answer authority or engine
is introduced.

We authored **21 source comparisons**, seven for each language, to support
learning where errors are context-sensitive. Incorrect choices and reading
answers can show an optional **Compare source contexts** disclosure before
a deliberate retry. Independently composed, ungraded writing can open the
same pair **before** drafting and revising. The learner is shown the actual
source examples and their original meanings side by side (stacked in narrow
mobile view), not an auto-generated explanation or hidden automatic grade.

We also authored **12 misconception-specific wrong-option explanations**
in the existing `ExerciseV1.misconceptions` records. Original deterministic
accepted-answer keys and normalization policies are not broadened.

- **French:** familiar Salut vs daytime Bonjour, evening Bonsoir vs departure
  Au revoir, and colloquial Moi, c’est vs formal name introductions.
- **Japanese:** morning/daytime greetings vs evening arrival, and evening
  encounter こんばんは vs bedtime おやすみなさい.
- **Chinese:** person greeting 你好 vs plural pronoun 你们 and food descriptor
  好吃, plus the source tea question 你喜欢喝茶吗？ vs the apple description
  这个苹果很好吃。

This is a **teaching-depth improvement within the same 20-frame internal
lessons**, not a new course engine or a fabricated additional curriculum.
Context details are optional and keyboard operable, and never confer credit.
Mobile 320 px layouts stack examples and retain fixed lesson actions.

## Original ownership and publishing boundary

The original source files were checked:

- French `thiepn/french` pinned main SHA
  `3fb5c720cfeceaf682ce53c897701b489b7eaf6f`,
  `app/src/core/unified/u6-a1-01-04.ts`, original entity `a1-01`.
- Japanese `thiepn/japanese` course-first PR #103 unmerged HEAD
  `1e3667ebdcb0cd50491c126b948c11f47414decb`,
  `apps/web/src/study/courseFirstA1.ts`, original `cf-a1-01-01`.
- Chinese `thiepn/chinese` main SHA
  `9688e7354142b7127fd5f6eb69b03b595a437008`,
  `src/demo-lessons.mjs`, original 你 and 好.

All fixtures remain `publication=internal-fixture`,
`editorialReview=pending`, `redistributionVerified=false`. The new
paired contrasts and diagnoses are editorial drafts, **not** independently
certified material and not authorized for public release. Chinese examples
do not imply official HSK inclusion; no written answer asserts French/
Japanese pronunciation, Chinese tones or CEFR/JLPT proficiency.

Native French, Japanese and Chinese apps, Account/Core, Hub, original
learner histories, FSRS review queues, progress storage, source identifiers
and revision pins remain unchanged. No merge, deployment, migration,
public publication or learner progress transfer.

## Testing and release boundary

The original learner CI runs the new
`tests/phase12-source-contrast.test.mjs` and
`apps/learner/tests/phase12-source-contrast.spec.ts` alongside previous
Phases 01–11 regressions. It checks exact source provenance, rejection of
invented comparisons/meanings, new incorrect-answer responses, ungraded
writing, keyboard disclosures and 320 px mobile access across desktop
Chromium/Firefox/WebKit and mobile Chromium/WebKit.

The root-compatibility job continues to attempt the **original** `pnpm
install`, `pnpm verify` and consumer packaging. The pinned private
`thiepn/account#df029d08a49ef27d3fd5fedf58400572746c0b47` is
inaccessible to this runner over SSH (`Permission denied (publickey)`).
Consequently any downstream root qualification is **NOT_TESTED**, not
equivalent to a passing isolated preview. Do not change authentication,
licenses, or source pins merely to turn CI green.

**Release readiness remains BLOCKED** pending authorized dependency access,
real monorepo qualification, independent source/editorial rights approval
and separately validated native progress, identity and FSRS integration.

## Phase 13 handoff

Expand teaching where genuine source coverage supports it, not via
repetitive superficial exercises. Preserve canonical lesson/exercise/plugin
contracts and the typed reducer. Address only reproduced cross-browser,
keyboard, IME, responsiveness and content defects. Continue using exact
pinned original examples until the source owners independently review
adaptations and authorize public release.
