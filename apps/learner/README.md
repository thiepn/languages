# THIEPN Languages — isolated learner preview

This is the **internal-only**, non-production React + TypeScript learning preview.
It reuses the same `LessonV1`, `ExerciseV1`, `LanguagePluginV1`,
deterministic exercise evaluator and typed lesson-player reducer for French,
Japanese and Chinese. The 20-activity source-linked lessons in
`contracts/fixtures/phase02-source-lessons.json` are unpublished, pending
independent rights and linguistic review.

## Run the learner in isolation

```sh
cd apps/learner
npm install --ignore-scripts --no-audit --no-fund --no-package-lock
npm run typecheck
npm run dev
```

Local preview: `http://127.0.0.1:5179`.
`npm run build` outputs `dist/learner-preview`, **not** `dist/hub`.

```sh
npx playwright install --with-deps --only-shell chromium firefox webkit
npm run test:e2e
```

The browser suite tests desktop Chromium, Firefox and WebKit and mobile
Chromium and WebKit, including all language journeys, ungraded writing,
keyboard/IME and loss-of-draft confirmation.

## Data and recovery boundaries

Only a **tab-scoped** active language and validated
`lessonId@contentVersion -> activityIndex` positions enter session storage.
Drafts, responses, feedback, writing revisions, grades, events, user identities
and learner histories are **never** saved. Reloading discards drafts. Course
navigation in the same open page retains them. Switching language, clearing
the preview or resetting requires explicit discard confirmation **when there
is unsubmitted writing**. If tab storage is denied, the preview continues in
memory without claiming recovery.

No exercise automatically creates native grades or review events. Written
free-production remains ungraded; the Review area is explicitly unavailable.
Native language apps retain their history, FSRS and content authority.
Account/Core and Hub are unchanged.

## Root repository qualification

The original root `pnpm verify` and consumer packaging are separately gated.
The draft PR root-compatibility job currently fails during dependency installation
because the original Hub references a **private pinned** Account package over SSH
(`thiepn/account#df029d08a49ef27d3fd5fedf58400572746c0b47`).
No root verification result can be inferred from the isolated preview tests.

Do **not** publish the fixture lessons, merge/deploy this preview, change
native learner data or grant Account/Core permissions merely because preview
tests pass. Independently qualify private dependency access, source rights,
editorial approval and history/scheduler compatibility before a release decision.
