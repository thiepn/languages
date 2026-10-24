# Phase 04 — full introductory teaching sessions (internal only)

Phase 04 extends the SAME Phase 01–03 PR #30 and React preview, not a new engine. The starting verified code was `d07527e1b46418403ceb7fd06efda60259492089`. All three original source repositories and Japanese course-first PR #103 were reverified at their pinned source revisions on 2026-10-22.

## What changed

- Three source-pinned internal fixtures contain **ten sequential activities each**: encounter with real expressions; two explicit explanations including context/contrast; four guided discrimination, form/orthography and script tasks; an independently situated typed transfer; a genuinely ungraded written transfer; and a reflection.
- French teaches formal/informal greetings and time of day, `je m’appelle`, and polite first-meeting transfer; narrowly treats straight/curly apostrophes as equivalent while retaining diacritics.
- Japanese teaches distinct morning/daytime/evening/bedtime encounters, their social contexts and appropriate responses; optional terminal Japanese full stop does not turn incorrect kana into a pass.
- Chinese contrasts `你好`, `你们`, `好吃`, introduces original tone-marked Pinyin `nǐ hǎo`, and tests lexical tone marks **in writing only**, not spoken tone-sandhi accuracy.
- Uses the existing `LessonV1`, `ExerciseV1`, `LanguagePluginV1` runtime and the same shared React player. Narrow, explicit answer-normalization policies are authorized by each fixture's plugin.
- Wrong answers provide source explanation, require a **retry** or an explicit **uncredited reveal** before progressing. Exact acceptance is formative, not a review grade. Original free writing remains ungraded with concrete rubric guidance.
- The current teaching heading changes with authored instruction; native form submit supports Enter and keyboard. Original permanent controls and mobile nav remain in place.
- Browser-tab-only resume also remembers the chosen language ID; versioned lesson/frame positions persist with no answer text, account ID or StudyEvent. Old lesson-version checkpoint IDs are invalidated.

## Provenance and publication

Original source paths and pinned revisions are unchanged from Phase 02. New teaching prompts and learning scenarios in Phase 04 are **draft adaptations** of these existing original-source concepts. They have not been independently reviewed for naturalness and are not an automatic grant to redistribute language course content.

Every lesson remains `publication: internal-fixture`, with `redistributionVerified: false` and `editorialReview: pending`. No approved audio assets exist, device synthesis is not scored, and no proficiency/HSK/CEFR/JLPT claim follows from these tasks.

## Acceptance commands

```sh
node --experimental-strip-types --test tests/phase02-lesson-contract.test.mjs tests/phase03-learner-model.test.mjs tests/phase04-teaching.test.mjs
cd apps/learner
npm install --ignore-scripts --no-audit --no-fund --no-package-lock
npm run build
npx playwright install chromium --only-shell
npm run test:e2e
```

The **same** `.github/workflows/phase03-learner-preview.yml` handles candidate tests to avoid a duplicate workflow. It checks real desktop and mobile Chromium journeys for all three full sessions, deliberate correction/reveal, keyboard submission, tab refresh and mobile control access. Root legacy CI intentionally skips draft PRs; a full Account-backed monorepo production build or release is not claimed.

## Existing authority and release boundaries

- No writes to Hub, native French/Japanese/Chinese apps, Account/Core, native IndexedDB, existing FSRS, enrollments, user profiles or activity records.
- No production deployment or source/public-content publication. `dist/learner-preview` remains isolated from `dist/hub`.
- Internal session completion reports that **the fixture was viewed to the end**, never that language mastery was measured.
- Exact-answer feedback remains deliberately conservative. Legitimate alternate formulations beyond these approved keys and spoken correctness require future editorial/audio/assessment work.
- Validation of teaching flow and ten exact Chromium checks is not sufficient to claim course-wide proficiency or complete beginner coverage.

## Phase 05 handoff

Extend the existing shared lesson player with a robust typed state machine: explicit per-frame submissions, revisions, navigation and source-content-version handling; accessibility/focus behavior; controlled local recovery that distinguishes unfinished, wrong, revealed and independently written tasks. Preserve language plugins and shared exercise contract; **do not** create competing engines, a second review queue or fake mastery records. Introduce source/licensing and editorial approval gates before considering public content release. The central Hub, Account/Core and legacy applications remain unchanged until separately authorized migration/release phases.
