# Phase 09 — contextual independent writing and in-memory revision

**Workstream:** same original draft [PR #30](https://github.com/thiepn/languages/pull/30), branch `feature/phase01-platform-ownership-20261022`.
**Baseline:** exactly `b5029e8feaaf713bc1d0be5af9affae12fd01ab8` with Phases 01, 02, 03–08 CI green.

## What Phase 09 implements

- Two independently composed, **ungraded** writing scenarios per language (the previous authored writing exercise plus a second source-grounded scene). The original writing IDs, rubrics, source revision pins and independent tasks remain intact; the new unique IDs end in `-p09-context-composition`. Each internal introductory language lesson now has **20 frames and nine independent tasks**. New prompts are original adaptations of the pinned THIEPN examples, not public learner content.
- French: two concise formal exchanges contrasting daytime Bonjour, evening Bonsoir, name introduction with `je m’appelle`, and appropriate departure. Japanese: a four-part written day using morning polite, daytime, evening arrival and pre-bedtime expressions. Chinese: a two-person greeting, original tea question, delicious apple description and explicit English functional explanation of the original Hanzi phrases.
- The *existing* `ExerciseV1.sourceAid` is now shown on ungraded writing exercises as an optional pre-submit **Original source example** disclosure; `ExerciseV1.rubric` appears in an optional **Writing criteria** disclosure. Both use the exact pinned encounter text/meaning. The same source aid is still available for wrong answer remediation.
- The Phase 05 typed reducer now supports one additional guarded `revise` action **only for a submitted, ungraded free-production attempt**. The original draft and submission count remain volatile within the currently mounted player. No new evaluator, grading formula, score, history, event stream, database, SRS scheduler, progress engine or user identity is created. A second check continues to be expressly `ungraded`.
- After submitting a writing draft, the learner can select **Revise writing**, regain editor focus, review original source/criteria, and resubmit. The existing flow also retains volatile drafts and feedback when moving back/forward or returning to Course in the same live page. An explicit message warns that unsent writing is not restored after a reload; versioned tab storage **continues to contain only source lesson version and activity index**, never draft text, answers, feedback, submitted expressions or account data.
- Existing IME composition guards, accessible form labels, feedback focus and mobile fixed lesson controls are reused. New disclosure and revision controls remain readable at 320 px widths without introducing an override CSS layer or incidental motivational UI copy.

## Authority and source constraints

- Unchanged original source paths/revisions: French `thiepn/french` `3fb5c720cfeceaf682ce53c897701b489b7eaf6f`; Japanese `thiepn/japanese` course-first unmerged PR #103 `1e3667ebdcb0cd50491c126b948c11f47414decb`; Chinese `thiepn/chinese` `9688e7354142b7127fd5f6eb69b03b595a437008`.
- All original IDs, source references, rights metadata, plugin ownership, previous lesson stages and learner histories remain unchanged. All new writing is **internal only**: `publication=internal-fixture`, `editorialReview=pending`, `redistributionVerified=false`. The new prompts are not a vetted linguistic curriculum, licensed public content or proof of CEFR/HSK/JLPT mastery. Written Japanese/Chinese cannot assess pronunciation or connected-speech tones.
- Native language applications, Hub, Account/Core, FSRS queues, scheduler, persistent learner progress, auth and audit authority remain untouched. No merge, migration, public course release or deployment.

## Qualification

Run through the SAME `.github/workflows/phase03-learner-preview.yml` without a new CI stack:

```sh
node --experimental-strip-types --test \
  tests/phase02-lesson-contract.test.mjs tests/phase03-learner-model.test.mjs \
  tests/phase04-teaching.test.mjs tests/phase05-player-state.test.mjs \
  tests/phase06-exercises.test.mjs tests/phase07-practice.test.mjs \
  tests/phase08-independent-transfer.test.mjs tests/phase09-writing-revision.test.mjs
```

The same isolated TypeScript/Vite build and real desktop Chromium/Firefox/WebKit and mobile Chromium/WebKit tests execute full 20-frame lesson journeys, free-production revision/feedback, mobile writing, IME safety, page-only draft continuity, refresh discard, content-version invalidation and false mastery prevention. Root monorepo CI deliberately skips draft PRs; focused preview qualification is **not** a production release pass. The actual exact-HEAD run links and reported test results belong in the PR body after verification.

## Phase 10 handoff

Finish feature integration before formal release qualification. Audit meaningful learner journey completeness and independent practice of all three languages; replace remaining superficial/unsourced exercises only with source-reviewed authored contexts. Improve accessibility and keyboard/IME behavior when browser evidence reveals actual gaps. Strengthen versioned draft/interruption warnings without persisting the user's answers or creating a second review/progress authority. At the release decision, independently review source licensing, all new language content and publication approval; require the full authorized root CI, production-account interfaces and genuine migration policies before considering a merge, public publication or deployment.
