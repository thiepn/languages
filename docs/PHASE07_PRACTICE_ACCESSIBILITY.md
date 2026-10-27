# Phase 07 — practice depth, feedback and cross-browser controls

Original workstream: [draft PR #30](https://github.com/thiepn/languages/pull/30), branch `feature/phase01-platform-ownership-20261022`.
Starting qualified Phase 06 head: `d9784a5d9ad04fba8715a6c014094ca6816419dc`.

## Source and authority

Reverified original French main `3fb5c720cfeceaf682ce53c897701b489b7eaf6f`, Japanese main `951030c4cdb256e76c99c253f22bddc679bc81ab` and still-unmerged course-first PR #103 `1e3667ebdcb0cd50491c126b948c11f47414decb`, and Chinese main `9688e7354142b7127fd5f6eb69b03b595a437008`.

All new learning situations and correction text are **original-source-based draft adaptations**. They are NOT independently linguistically reviewed, or licensed for public redistribution. Source IDs, original revisions, `editorialReview: pending`, `redistributionVerified: false`, `publication: internal-fixture` and original learner history/scheduling ownership remain unchanged. No language-specific accepted-answer variants were added without editorial review.

## Implemented

- Extended the existing `ExerciseV1` **without creating a second grader** with an optional `misconceptions` array. Each entry is an exact source-supported *wrong answer* and a bounded instructional correction. Its validation rejects empty, duplicated and accepted-answer-colliding entries, including normalization collisions. Generic explanation remains the fallback for other incorrect responses.
- Added three **source-linked activities per language** (one guided contextual-reading question, one independent cloze and one independent contextual-reading task), bringing the preview to **16 activities per language** with four independent tasks. New exercises reuse `LanguagePluginV1`, Phase 05 reducer and existing exact written answer evaluation.
- French teaching contrasts familiar/formal encounters, the `je m’appelle` introduction and `Au revoir, à demain`; Japanese contrasts morning, daytime, evening and bedtime; Chinese contrasts `你`/`你们`, `你好`, `好吃` and `你喜欢喝茶吗？`.
- The existing React form now blocks premature Enter submission during Japanese/Chinese IME composition, supports native Enter upon composition completion, constrains draft input length and provides explicit focus after feedback and back to input on retry.
- Short mobile viewports use compact headers and actions while keeping the study content, mobile navigation, Previous, Check and Continue available. Keyboard focus remains visible in Chromium, Firefox and WebKit.
- Source-linked checks remain *formative*. An incorrect, revealed or independently written response does not generate FSRS grades, speaking proficiency, CEFR/JLPT/HSK credit or account progress.

## Focused acceptance

Run the original isolated preview CI, now across 5 Playwright browser/device projects: desktop Chromium, Firefox and WebKit plus mobile Chromium and WebKit. Real browser tests cover all three complete 16-frame lessons, error feedback, IME Enter behavior, refreshed tab-only resumption, keyboard focus, mobile short viewports and false mastery guards. Unit/contract coverage includes corrupted misconception records, unreviewed variants and independent practice; exact job URLs/results are in PR #30.

The ordinary root monorepo CI continues to skip draft PRs and cannot be treated as release approval. No production Cloudflare/Pages build or source-publication task is run.

## Phase 08 handoff

Continue the **same** shared learner and contracts toward more self-directed learning: teaching depth and varied source-grounded independent transfer, error-aware actionable remediation, more robust input methods and visual/device ergonomics, content provenance and editorial-review workflows, and conservative evidence representation. Do not introduce a second grading, event, scheduling or persistence authority or alter native language apps, Hub or Account/Core. Keep internal fixtures unpublished until explicit language and rights approval.
