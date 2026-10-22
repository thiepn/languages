# Phase 03 — isolated shared learner preview

This is a non-production React + TypeScript learning app for testing the **same**
Phase 02 LessonV1/ExerciseV1/LanguagePluginV1 contracts with French, Japanese
and Chinese. It uses only \`contracts/fixtures/phase02-source-lessons.json\`,
which is explicitly internal-only and pending rights and linguistic review.

Run locally after installing only the learner app's public dependencies:

\`\`\`sh
cd apps/learner
npm install --ignore-scripts --no-audit --no-fund
npm run typecheck
npm run dev
\`\`\`

Open \`http://127.0.0.1:5179\`. For the isolated production-mode *preview*
build run \`npm run build\` (outputs \`dist/learner-preview\`, **not** \`dist/hub\`).
Run \`npm run test:e2e\` after \`npx playwright install chromium\`.

No learner IDs, answers, memory traces, accounts or review grades are written.
The only tab-scoped stored value is a validated map of fixed fixture IDs to
activity indices under \`thiepn-languages-phase03-preview-v1\`. User-entered
answers exist in React component memory, disappear after refresh and never
become StudyEvents. The native applications and the existing Languages Hub
remain authoritative. Review shows an honest unavailable state.

Do **not** deploy this preview to the existing Languages production domain,
publish its internal source fixtures, connect it to Account/Core, or add a
second scheduler. Phase 04 will qualify a complete lesson's real teaching,
feedback and independent application, not introduce competing engines.
