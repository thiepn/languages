# Phase 05 — one shared lesson-player state machine

**Initiative:** original draft PR #30 / branch `feature/phase01-platform-ownership-20261022`.

**Baseline:** Phase 04 `a3623681e2c7edb20197c1a0275e32bedab533a8` (Phase 01, Phase 02 and Phase 03–04 workflows green at that exact head). This batch changes only the non-production learner preview and its focused tests.

## Authoritative boundaries

The data model is still `LessonV1`, `ExerciseV1`, `LanguagePluginV1`. The existing `lesson-model.ts` still resolves source-defined frames, evaluates only authored deterministic answer keys and validates versioned checkpoint positions. **No new grading engine** was built.

The new **pure** `apps/learner/src/lesson-player.ts` is the *single owner* of volatile UI player state. Typed reducer actions: `load`, `draft`, `submit`, `retry`, `reveal`, `next`, `previous`, `reset`. Guards ensure:

- A missing submission, a wrong response or an ungraded but not yet submitted response cannot advance.
- A wrong answer can only be retried or explicitly revealed. Reveals are **not correct answers** and are never converted into mastery evidence.
- Submissions lock their draft until a permitted retry; re-submits and repeated reveals are inert.
- Navigating backward and forward inside a live tab keeps the current exercise's volatile outcome; `reset` clears every answer.
- Selecting another language loads that language's **own** lesson and versioned index, but clears all prior volatile answers from the shared player instance.
- Invalid indices, overlong answer drafts and unauthorized actions are inert.
- A browser refresh rehydrates only `lessonId@contentVersion => frameIndex` from the existing tab checkpoint; accepted, incorrect, revealed and ungraded outcomes never survive, and an exercise must be submitted again.
- A changed lesson content version invalidates stale checkpoint IDs and starts at the beginning, avoiding mismatched index reuse.
- No scheduler, Account/Core, Hub, native learner database, grading or proficiency events are called or created.

React's `App.tsx` now renders this reducer state and dispatches typed actions; redundant React answer/feedback maps and duplicated movement logic were removed. The current activity heading gains focus on navigation to make the lesson order legible to keyboard and assistive technology users. Existing mobile fixed controls and editorially distinct language content remain unchanged.

## Focused tests

```sh
node --experimental-strip-types --test \
  tests/phase02-lesson-contract.test.mjs \
  tests/phase03-learner-model.test.mjs \
  tests/phase04-teaching.test.mjs \
  tests/phase05-player-state.test.mjs

cd apps/learner
npm install --ignore-scripts --no-audit --no-fund --no-package-lock
npm run build
npx playwright install chromium --only-shell
npm run test:e2e
```

The same `.github/workflows/phase03-learner-preview.yml` now covers Phase 05; it performs isolated TypeScript/Vite compilation and Chromium desktop/mobile journeys, including keyboard heading focus, retry and reveal distinction, cross-language state isolation, interruption, responsive viewport controls and all three complete teaching sessions. Root monorepo CI still deliberately skips draft PRs, so candidate focused checks do **not** certify full release eligibility.

## Phase 06 handoff

Extend **the same** `LessonV1` exercise vocabulary and shared player with broader authored practice modalities and language-specific answer handling (e.g., better choices, ordering, cloze, reading), including rigorous evaluation of permitted alternative answers. Preserve original source IDs, exact context and rights. Continue keeping any content without verified redistribution or linguistic approval strictly internal. Do not introduce a second event pipeline, scheduler or grader; do not deploy production or migrate learner histories.
