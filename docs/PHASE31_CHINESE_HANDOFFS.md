# Phase 31 — Chinese role-handoff repair and usable writing revision

## Scope and provenance

This phase adds **four** meaningfully different Chinese beginner handoff scenarios based on the three exact attested original source expressions already used in each corresponding Phase 30 lesson. The source remains `thiepn/chinese@9688e7354142b7127fd5f6eb69b03b595a437008:src/demo-lessons.mjs`, with the Phase 16 original quotation whitelist, Phase 25 exact tone-marked written Pinyin manifest, original LessonV1/ExerciseV1/LanguagePluginV1 and Phase 05 player. New dialogue scenes are transparently editorial, not supposed original source conversations.

All source rights remain `review-required`, `editorialReview:pending`, `redistributionVerified:false`, DEMO_ONLY and nonofficial HSK. No invented audio, CEFR/HSK grade, native learner history, FSRS/scheduler event, Account/Core/Hub authority or published course materials are introduced.

## Four new practical handoff lessons

1. **Repairing who speaks for two student groups** — the moderator initially speaks about their own team using 我们 but then turns to the other group's listeners, where the same source item is wrong and 你们 is right. The fourth source-quote order is 我们 / 我 / 你们.
2. **Correcting a tea-counter misunderstanding** — 你好 correctly greets someone new but is incorrect for a subsequent request to ask about tea, when 你喜欢喝茶吗？ must be used. A different fourth scenario orders greeting, describing the apple, then asking about tea.
3. **Resolving a mistaken teacher identity** — the student must first deny a false teacher role through 不是, then positively identify themself with 我是学生。. A different fourth situation identifies a teacher, then a student, and finally rejects an unrelated false identity.
4. **Separating a badge claim from a shared job** — first-person possession 我的 is right when claiming one's badge but wrong when confirming a colleague's matching job, which instead needs 也是. A fourth reception scenario discusses ownership, shared job and a later false title.

The fail-closed optional `ChineseRoleHandoffV1` compiler module enforces real changed communicative intent: the correct source item for the initial context must **become the wrong source item after the speaker, listener or question changes**, and vice versa. It rejects invented/duplicated original quotes, mismatched language, superficial context or correction explanations, any fourth sequence matching one of the three earlier correct source sequences, missing authorial writing criteria and source permission/reading drift. Its new reading passages display exact source-attested Hanzi and tone-marked Pinyin separately from the newly authored situation.

Each of the **four new internal Phase 31 editorial candidates** has **31 original-engine exercises**, including 4 new activities beyond its preserved Phase 30 source-derived 27: two mutually contrastive contextual readings, one independently authored fourth original-Hanzi sequence with **three independently wrong previously accepted source orders** and distinct corrections, and an eighth independent ungraded practical conversation. The authoring catalog becomes **45 read-only editorial candidates**. The previous **41 compiled candidate bundles remain identical**, including the four Phase 30 lessons with 27 activities and seven written tasks each. The original **12 canonical lessons and 126 original exercise IDs**, source rights and Phase 21 correction paths stay unchanged.

## Genuine writing revision continuity

The original Phase 05 player now captures the **first submitted** ungraded written draft in its already volatile `FrameAttempt` record. Further `revise`/submit cycles preserve that first version while keeping the latest answer editable and ungraded. The learner sees a functional collapsible **Compare first draft** view only after a subsequent submission and can contrast it with the current written response. This works through the existing original player and React form; no new evaluator, duplicate scheduler or auto-generated correction engine was added. The original `reset`/`load`/exit/reload lifecycle still discards attempts and comparison data. Canonical checkpoint serialization still permits only fixture frame positions, never drafts, first drafts, writing, source-review data, Pinyin results or grades.

## Qualification

Added positive/adversarial executable Node tests check unchanged prior 41 candidates, exact original 12/126, complete original source/Hanzi/Pinyin/rights provenance, meaningful source-answer inversion across two independent reading contexts, **fourth** order with all **three** earlier correct source orders now rejected, all eight original-player free-production/revision paths, hostile source/correct-answer/speaker/permission mutations and original checkpoint isolation. Separate Node tests check first-draft preservation across multiple revisions, previous/next, reload, reset, 8192-character input limits, typed-error exclusion and no persistence.

A full browser journey for each of the four new lessons exercises the earlier original source reconstruction and source-specific repair, new speaker-handoff reading correction twice, all three previously accepted ordering mistakes, a fourth correct sequence, and eight ungraded authored dialogues. The eighth task is revised once and the real **Compare first draft** control is tested. Real Playwright Chromium/Firefox/WebKit desktop and mobile plus a 320px full journey run in the unchanged isolated learner workflow; strict TypeScript/Vite and Node suites run before browsers.

The completed Phase 30 exact-head [workflow #40222865669](https://github.com/thiepn/languages/actions/runs/40222865669) genuinely **passed 159/159 Node, TypeScript/Vite and 820/820 Playwright**. Root compatibility alone fails at the unchanged pinned private Account Git SSH dependency before root verify and consumer packaging. Phase 31 qualification must be reported separately at its own exact commit.

## Next Phase 32

Inspect final-head exact CI and correct genuinely reproduced defects; then deepen learner-authored source-grounded transfer or real original-player interactions without inventing new source authority or untested release readiness. Maintain the same open draft PR, original branch and local-first separation.
