# Phase 16 — Original-source evidence and learner repair

Same draft [PR #30](https://github.com/thiepn/languages/pull/30), branch `feature/phase01-platform-ownership-20261022`, starting HEAD `26bdb563c0b20744e2706cfb81b3d561587321ae`. All three upstream main revisions unchanged: French `3fb5c720...`, Chinese `9688e735...`, Japanese main `951030c4...`. Japanese source content remains on unmerged draft PR #103 `1e3667eb...`.

## Source audit

Every one of the six internal lessons and their 84 original exercises now has an explicit reviewed source-quote receipt in `contracts/phase16-source-evidence.json`. Quotes were selected from original authored files at pinned revisions; the admission gate rejects added or swapped exercises, unsupported source links, nonencountered quotations and missing receipts. This is internally verifiable authoring lineage only, **not** a linguistic certification, external approval, publication license, automated original-content synchronization or migration authorization.

- Chinese source `好` was incorrectly missing guided linkage although `zh-ni-hao-choice`, `zh-p04-context-choice`, `zh-p06-cloze` and `zh-p06-reading` already teach the original greeting and apple examples. Preserve the exact questions and all answer IDs, but attribute those four guided activities to the original `好` row. The two Chinese ungraded compositions also now cite the distinct `你` and `好` source rows they genuinely use. Fix the unrelated tea-sentence correction aid for a greeting question.
- The Japanese pilot's fifth encounter line `先生：おはようございます。` was sourced from neighboring `cf-a1-01-04` rather than pinned entity `cf-a1-01-01`. Remove that unowned encounter quote; the source's own 8 a.m. teacher-greeting *question* is unchanged. All 22 original frame indices remain stable.

## Substantial learner repair without padded exercises

The three next lessons retain 14 frames each, but gain targeted error-specific feedback, cited contextual contrasts and source examples through the existing `ExerciseV1` properties and Phase 05 player. French repairs subject-specific être errors, occupation without an article and adjective agreement. Japanese distinguishes attracting attention, giving thanks and acknowledging thanks as different speech functions. Mandarin distinguishes singular 我, plural 我们 and possessive 我的 as well as lexical Pinyin wǒ. Ungraded writing, conservative answer keys and source ownership are unchanged.

Lesson completion offers a genuine **Next lesson** action to the second internally admitted lesson, reusing the same player, checkpoint mapping and source coverage. It does not assert mastery or write to native app state.

Node and real multi-browser desktop/mobile tests cover exact receipts, fails-closed tampering, source coverage, correct feedback, French error contrasts, Chinese narrow-mobile practice and original activity identity. Root monorepo qualification still depends on authorized SSH access to pinned private `thiepn/account#df029d08a49ef27d3fd5fedf58400572746c0b47`. Do not replace, remove or change that dependency.

Original data, Account/Core, Hub, FSRS and the native French/Japanese/Chinese apps are untouched. All content remains internal with editorial review pending and redistribution unverified; no merge, public publication, migration or deployment.

Phase 17: strengthen source-approved cross-lesson transfer and authoring coverage when original materials permit; preserve each original source receipt and release boundary.
