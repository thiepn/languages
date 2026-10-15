# E0 — Coordinated read-only language ecosystem inventory

This is an executable **source inventory**, not a separate learning engine.
No repo is modified by this command unless the caller explicitly supplies an output JSON path; that file is a local report.

Run from a checkout of `thiepn/languages` with Node 24 and adjacent checkouts:
```sh
node scripts/ecosystem-inventory.mjs --strict --out /tmp/thiepn-language-e0.json
```
Or specify `--chinese=/absolute/path`, `--french=/absolute/path`, and `--japanese=/absolute/path`.
`--self-test` checks the script without fetching content. Chinese uses the original authored JS modules, French loads the original TypeScript modules with the supported Node 24 type-stripping runtime, and Japanese reads the four canonical JSON seed files. Failed/missing imports remain **unavailable**, never guessed or silently counted as zero. Each result includes the checked-out Git HEAD when available.

Counts describe **different units of learning**. No course count is converted into CEFR/HSK/JLPT proficiency. The full skill and licensed-native-audio inventory still needs source-level and human review; this command does not assert completeness on those dimensions.

## Chinese Hub preflight
`languages/chinese/preflight.ts` is deliberately passive. Chinese remains local-first with original demonstration scheduling and P43 tab-only drafts. The preflight cannot publish to Core or change Hub enrollment. Before P8 integration, implement Chinese-owned read-model projection, canonical Account enrollment and consent, privacy filtering, scoped Core producer authorization, verified app URL, account switching and production-origin acceptance. Do **not** add a third live Hub card or official HSK assignment based on this inventory.

## Educational boundaries
- Chinese: 428 original character lessons, 36 P29 missions, P43/P45 original evidence; original editorial HSK-oriented content is not official HSK.
- French: original 94 full lessons/150 transfers, U7 source-linked listening, authorial A1 repair tasks; optional speech tasks are not graded pronunciation.
- Japanese: base canonical source plus all three C1 overlays; source-owned E11 later notices are unscored and do not alter FSRS or official proficiency.
- All apps own their original IDs, learner evidence, source rights, scheduling, and privacy. Existing P7 read-only consumer baseline drift requires deliberate review before any promotion.
