# Phase 03 — unified learner preview

Source baseline: Phase 02 PR #30 head \`9f4b7198e8ea075141297ba2212a3f446d704e44\`;
Phases 01–02 dedicated workflows both passed at that SHA.

## Implemented

- \`apps/learner\` is an **isolated**, non-production React/TypeScript/Vite
  workspace. It is not included in existing \`scripts/build-hub.mjs\` and
  publishes no Pages artifacts.
- Uses exactly the three Phase 02 source-pinned, unapproved internal fixtures,
  typed against \`packages/content-schema/src/lesson-v1.ts\` and rejected at
  startup if source rights are incorrectly represented as approved.
- Home: actual selected-course Continue and direct language/course selection.
  Course: directly start/resume a real authored lesson. Review: explicitly
  unavailable (no invented due cards). Profile: true preview/account status,
  with a way to clear demonstration continuation.
- Shared encounter / explanation / guided choice and typed recall /
  independent ungraded writing; native input controls, feedback and
  keyboard/viewport-safe responsive action area.
- Pure \`lesson-model.ts\`: resolves the same source-defined steps/exercises for
  all three languages, checks only deterministic accepted answers and displays
  the original exercise explanations and ungraded writing rubric.
- Session-only checkpoint stores **fixture identifiers, versions and activity
  positions**, not response text, account IDs, study evidence or SRS grades.
  No persistence other than the demo tab checkpoint. All original language
  applications and Account/Core remain untouched.

## Validation

\`\`\`sh
node --experimental-strip-types --test tests/phase03-learner-model.test.mjs tests/phase02-lesson-contract.test.mjs
cd apps/learner
npm install --ignore-scripts --no-audit --no-fund --no-package-lock
npm run build
npx playwright install chromium
npm run test:e2e
\`\`\`

The dedicated \`phase03-learner-preview.yml\` workflow executes these with
desktop and mobile Chromium, using only public packages; the legacy Hub's
privately pinned Account dependency is not needed. Full root CI remains a
separate qualification boundary. Root TypeScript config excludes this
independently checked preview to avoid making private Hub installs a
precondition for preview contract verification.

## Preserved boundaries and honest limits

- No production deployment, public lesson publication, credential collection,
  enrollment creation, remote APIs, scheduling authority or personal-history
  mutation. Existing Hub output and release workflows are unchanged.
- The lesson player is an **actual frontend prototype**, not completed learning
  software. It does not claim CEFR/HSK/JLPT progress, verified natural voice,
  native media or correctness for open-ended speaking/writing.
- Deterministic exact checking is deliberately basic. Human-reviewed accepted
  variants and linguistic normalization are future work; a successful
  practice response does not award SRS mastery.
- Fixture source rights and linguistic editing remain pending, and the
  Japanese source fixture is from an unmerged PR head.

## Phase 04 handoff

1. Turn the shared preview into a complete guided teaching session for each
   language, with source-reviewed explanations, appropriate scaffolding and
   an independently answerable application task.
2. Improve prompts/feedback and language-specific answer handling through the
   existing plugin capability interface; no duplicate exercise engines.
3. Add realistic interruption, mobile keyboard, review/evidence boundaries,
   accessibility and offline-safe candidate tests without touching production.
4. Require editorial/redistribution approval before any public lesson release.
   Keep Account/Core, Hub enrollment, legacy histories and production
   deployment explicitly out of scope until authorized later phases.
