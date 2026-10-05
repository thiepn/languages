# P6 — Current Production Inventory Baseline

Observed against the production repositories on 2026-10-05.

This document records what the P6 adapters are expected to understand. It is not a promise that future French/Japanese revisions keep the same source shape.

## French

Repository:

- repo: `thiepn/french`
- main commit: `28a39ce1c59ab02301b408f016522dbddc28d0c0`
- app version: `5.18.0`
- architecture: primarily one large `index.html`

### Vocabulary dependency

French does not keep its complete canonical vocabulary payload inside the application repository.

The current app pins:

- external repo: `kooruhana/sakanaVocab`
- blob SHA: `14beb3f21e908a471fe213c99ebc776bd11a5222`
- declared source count: 12,000 words
- actual source array length observed by P6: 12,001 words

The source contains vocabulary from A1 through C2. The French app then applies runtime preparation and curation before accepting at most 3,000 production cards.

Important consequence:

> the raw Sakana payload is not an exact substitute for French's prepared catalog.

French applies lexical overrides, POS normalization, grammar metadata, curated/rejected examples, level normalization and core/supplemental classification before the vocabulary becomes the app's canonical working catalog.

For exact migration, P6 prefers the existing `catalogSnapshot()` export from the app and verifies its fingerprint against the pinned source SHA.

Using only the raw source is supported as an inventory fallback but receives a fidelity warning.

### Pinned vocabulary source declarations

The current external vocabulary payload names:

- Matthias Buchmeier French–English / open-dsl-dict — CC BY-SA 3.0 / GFDL
- open-dict-data IPA dictionary — MIT
- FrequencyWords — declared only as "Open word lists"
- Wiktextract / kaikki examples — CC BY-SA 4.0
- FLELex / CEFRLex — CC BY-NC-SA 4.0

P6 preserves those declarations. The non-specific FrequencyWords declaration remains a licensing-review warning rather than being upgraded to a stronger claim.

### Bundled curriculum inventory

Current embedded French content inspected from the production source:

| Surface | Count | Level coverage |
| --- | ---: | --- |
| Verified usage/corpus rows | 67 | resolved against runtime vocabulary |
| Sentence-production exercises | 36 | resolved against runtime vocabulary |
| Reading texts | 19 | A1 6 · A2 6 · B1 7 · B2 0 |
| Listening items | 19 | derived one-to-one from readings |
| Conversation scenarios | 14 | A1 5 · A2 5 · B1 4 · B2 0 |
| Real-world missions | 5 | A1 1 · A2 3 incl. shared bands · B1 3 incl. shared bands · B2 0 |
| Communicative-function definitions | 25 | scenario/function graph |

All current connected-listening items are generated from the reading texts and rely on speech synthesis rather than bundled native connected-speech recordings.

The production P27 audit therefore correctly keeps B2 communicative coverage incomplete.

### Learner-state sources

Important persisted French state includes:

- `french3000-progress-v2`
- `french3000-review-log-v3`
- study-day/profile/session data
- adaptive block history
- longitudinal mastery snapshots
- CEFR promotion milestones

The review log has accumulated later-phase fields including mixed modality, first-attempt/support information and remediation metadata.

P6 maps those fields conservatively.

Normal/scheduled review may migrate an SRS transition. Supplemental mixed practice and remediation do not receive a shared `memoryReview` signal merely because they were successful.

### French migration gaps

Current adapter status is expected to remain **needs review** until:

1. an exact prepared `catalogSnapshot()` is supplied;
2. runtime P27 coverage/quality output is exported so theme, transfer and speaking coverage does not have to be reconstructed approximately;
3. the bundled-content ownership assumption is editorially confirmed;
4. external source/license declarations are reviewed for a future canonical public release.

These are migration-fidelity/product issues, not learner weaknesses.

## Japanese

Repository:

- repo: `thiepn/japanese`
- main commit: `45d03f5b027bdb36fcf5a7f7df3c063e1ba09893`
- architecture: typed TypeScript packages + structured content seeds
- current assembled content version: `0.10.0`

### Runtime assembly

The runtime does not use only `jp-core.json`.

`apps/web/src/coreContent.ts` assembles:

```text
jp-core.json
 + jp-c1-lexicon.json
 + jp-c1-language.json
 + jp-c1-course.json
 = current canonical runtime graph
```

P6 treats omission of any C1 supplement as a migration blocker for current-runtime parity.

### Current assembled canonical totals

| Entity | Count |
| --- | ---: |
| Lexemes | 658 |
| Senses | 658 |
| Kanji | 37 |
| Grammar concepts | 118 |
| Sentences | 375 |
| Audio assets | 203 |
| Can-do descriptors | 68 |
| Course units | 68 |
| Reading texts | 50 |
| Productive tasks | 44 |
| Lexical chunks | 152 |

The base seed provides A1–B2 material. The three overlays add the current C1 foundation:

- 32 C1 lexemes + senses
- 16 C1 grammar concepts
- 48 C1 discourse sentences
- 32 C1 lexical chunks
- 10 C1 Can-do descriptors/course units
- 8 C1 readings
- 12 C1 productive tasks

All 50 current connected reading texts use speech synthesis.

The repository separately contains 203 native-speaker pronunciation audio assets with source/license metadata.

### Source registry

The current registry contains thirteen sources.

The current canonical seed itself uses:

- `thiepn-original` for non-audio canonical course content;
- `tofugu-wanikani-audio` for the 203 pronunciation recordings.

Reference-only/non-exportable sources remain in the source registry but are not silently treated as canonical public content.

Tatoeba is intentionally kept conservative at source level because text/audio rights can vary per item or recording.

### Learner-state sources

Japanese IndexedDB currently separates:

- `study_events`
- `memory_traces`
- sync outbox/meta
- private documents
- private vocabulary
- private sentences
- private media review state

P6 keeps those boundaries.

Japanese StudyEvents map closely to Language Core, but they do not contain the explicit P2 `memoryReview` signal. P6 therefore migrates StudyEvents as evidence and migrates persisted FSRS traces independently.

Current FSRS adapter version is already:

`ts-fsrs-5.4.2`

so existing memory traces can preserve their due date, stability, difficulty, lapses, state and revision without rebuilding intervals from event history.

Private learner documents/vocabulary/sentences remain private and are excluded from public P5 release candidates.

### Japanese migration gaps

Japanese is structurally closer to Language Core than French, but review remains necessary for:

- generated prompt/assessment coverage that is implemented in TypeScript rather than materialized in canonical seed files;
- speech-synthesis dependence for connected listening;
- framework/promotion coverage beyond the currently materialized seed;
- any source whose reuse rights are per-item rather than globally established.

## Cross-app conclusion

P6 confirms that the shared platform should not force both products through one ingestion strategy.

```text
French
legacy embedded app + pinned external catalog
        ↓
legacy/source adapter

Japanese
structured seeds + typed events + FSRS traces
        ↓
structured adapter

both
        ↓
P1–P5 contracts
```

The target shared model is common. The migration path is intentionally product-specific.
