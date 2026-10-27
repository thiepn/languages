# Phase 06 — shared cloze, ordering and contextual reading

**Program:** THIEPN Languages Masterplan; **original draft PR #30** and branch `feature/phase01-platform-ownership-20261022`.
**Starting qualified Phase 05 head:** `faff57a488a01a20b9cb8e6625ee1d877cb6a280`.
Source main revisions reverified: French `3fb5c720cfeceaf682ce53c897701b489b7eaf6f`; Japanese `951030c4cdb256e76c99c253f22bddc679bc81ab` with cited course-first PR #103 HEAD `1e3667ebdcb0cd50491c126b948c11f47414decb`; Chinese `9688e7354142b7127fd5f6eb69b03b595a437008`.

## Delivered

- Extended **the existing** `ExerciseV1` union with typed `cloze`, `ordering` and `reading` exercises and exercised them through the **same Phase 05 player reducer** and `lesson-model.ts` answer evaluator. No new scheduler, event service, engine, database, learner-data authority or second player.
- **Cloze** presents source-based sentence fragments with one gap and checks the original authorized written answer using declared, conservative language-specific normalizers.
- **Ordering** presents 2–8 authored unique source tokens as accessible add/undo controls. The canonical answer is an exact zero-based token-index permutation with schema guardrails; revealed answers display readable tokens, not index strings.
- **Reading** presents a contextual source passage, question and explicit options; the question uses source-grounded recognition rather than fabricated comprehension/proficiency claims.
- `LanguagePluginV1` capabilities now include `cloze` and `ordering`, and `contextual-reading` is required for reading exercises. The French plugin fixture explicitly declares this existing reading capability. The validator rejects missing context, invalid source-linked choices, malformed ordering permutations, unsupported normalizers/capabilities or unauthorized evidence claims.
- French practice uses the pinned greetings and `je m’appelle` material; Japanese exercises contrast morning/evening arrivals with bedtime; Chinese uses original `你好`, `你们`, `好吃` and `这个苹果很好吃。` expressions. Each internal lesson now contains **13 source-defined frames**, including the previous independently answerable tasks.
- Existing exact-answer feedback, incorrect/retry/uncredited reveal, completely ungraded written production, mobile fixed navigation, keyboard headings and tab-only interruption recovery remain intact.

## Acceptance

Dedicated existing `.github/workflows/phase03-learner-preview.yml` checks:

```sh
node --experimental-strip-types --test \
  tests/phase02-lesson-contract.test.mjs \
  tests/phase03-learner-model.test.mjs \
  tests/phase04-teaching.test.mjs \
  tests/phase05-player-state.test.mjs \
  tests/phase06-exercises.test.mjs

cd apps/learner
npm install --ignore-scripts --no-audit --no-fund --no-package-lock
npm run build
npx playwright install chromium --only-shell
npm run test:e2e
```

The exact-code Phase 06 workflow [#39841609439](https://github.com/thiepn/languages/actions/runs/39841609439) verified **32/32 dependency-free Node tests**, the isolated TypeScript/Vite build, **36/36 desktop and mobile Chromium tests**, and the fact that `dist/hub` was not replaced or built. Phase 01 [#39841609444](https://github.com/thiepn/languages/actions/runs/39841609444) and Phase 02 [#39841609456](https://github.com/thiepn/languages/actions/runs/39841609456) also succeeded for exact code commit `d0bf3625e266768d8fad2d3f23eb30dec233bb24`.

## Explicit boundaries

- **Unapproved internal material only.** All original source IDs, paths, source revision pins, rights states and independent review requirements remain unchanged. Newly assembled exercises and dialogues are **draft adaptations**, not linguistically certified or approved for public redistribution.
- `publication=internal-fixture`, `redistributionVerified=false`, `editorialReview=pending`; Chinese source remains non-official and review-required; the Japanese curriculum reference remains an unmerged PR.
- Exact written checks do not establish correct spoken tones, pronunciation, CEFR/HSK/JLPT proficiency, professional review, meaning-preserving translations or an approved curriculum.
- No production merge, deployment, migration or mutation of native app progress, Hub, Account/Core, learner histories or FSRS authority.
- Ordinary root monorepo CI skips draft PRs under its existing rule. Passing the isolated preview workflows **does not** qualify a production release.

## Phase 07 handoff

Improve depth and learner usability *inside the same shared system*: add more source-authorized practice coverage and lesson-authoring ergonomics; support richer mistake feedback and constrained language variants where linguistically reviewed; test mobile screen/IME interactions, visual regression and accessibility beyond Chromium. Keep native SRS/assessment ownership, rights/editorial gates and production unchanged until separately authorized. Preserve the original PR and source revisions.
