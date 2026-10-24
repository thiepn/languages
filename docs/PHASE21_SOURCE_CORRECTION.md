# Phase 21 — Source-backed corrective follow-ups and independent revision

Same original draft PR #30 and branch `feature/phase01-platform-ownership-20261022`. Parent is the exact Phase 20 head `89a90111035d24092c98b11a277811bc67117b1e`.

## Delivered

- 12 original lesson-level corrective follow-ups (four existing lessons per French, Japanese and Chinese) and six application-level follow-ups. Each has a distinct realistic transfer context, an independent revision instruction, a reflection prompt and two selectable **author-written** language-specific correction focuses.
- Every correction focus quotes verbatim an encountered example admitted by the Phase 16 exact source-evidence manifest. The fail-closed admission check verifies owner lesson/path, language, original encountered quote, source receipts, publication status, editorial `pending` and `redistributionVerified=false`. No new source text is represented as an original quotation.
- The same Phase 05 reducer handles revision and resubmission; the focused source explanation is chosen by the learner, not generated as automatic feedback or correctness inference. The two writing snapshots and choice live only in React component state and disappear on reload. No new grading, scheduling, learner history, mastery, Account/Core/Hub, source import or second player.
- Existing 12 lesson IDs, 126 exercise IDs, their original source receipts, lesson versions and checkpoint serialization remain unchanged. Japanese course source remains pending PR #103 and Chinese source remains non-official/review-required.
- The Phase 20 application checklist is independent and still required for navigation to complete an application; choosing a correction never checks boxes automatically. Any revised submission requires a fresh learner review.

## Qualification

- `node --experimental-strip-types --test tests/phase21-source-followups.test.mjs`
- Existing Phase 02–20 test suite and genuine desktop/mobile Chromium, Firefox, WebKit scenarios, including 12 lesson and six application follow-up paths.
- Strict TypeScript/Vite isolated learner build and Hub-output isolation.
- Real original full-monorepo `pnpm verify` and `pnpm package:consumer` require owner-authorized SSH access to pinned private `thiepn/account#df029d08a49ef27d3fd5fedf58400572746c0b47`. Do not change credentials, pins or claim a pass if blocked.

## Phase 22 handoff

Reconcile existing source-derived inventory PR #27 with this branch's exact source ownership manifest; build a repeatable source-pinned authoring/intake process feeding the **same** LessonV1/ExerciseV1/LanguagePluginV1 and release guards. Do not duplicate players or engines, promote internal fixture rights, change original lesson IDs, merge or deploy without explicit acceptance.
