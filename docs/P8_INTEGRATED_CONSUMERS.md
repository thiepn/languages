# P8 Integrated Consumers

P8 is integrated in both production language repositories.

## Platform package

- platform commit consumed by both producers: `e74a10aa9d9d161c7f427ce7691be32df4bbc31c`
- package version: `0.8.0`
- read model: `p8-read-model-v1`
- Hub data plane: `p8-hub-data-plane-v1`

## French

Current integrated head:

`312469615d60c4e6e11b77a676aaf5e1ab44633e`

Producer revision:

`french-p8-read-model-v1`

French vendors the P8 browser artifact and derives its projection from existing authoritative systems:

- review/workload summaries;
- activity and streak calculations;
- target-date curriculum state;
- P25 internal CEFR-aligned promotion gates;
- P22/P23 coach recommendation.

No raw review log or private account data is included in the projection.

## Japanese

Current integrated head:

`1ba2b3ff4e062b9e8b67579d9f2526aeb633caf7`

Producer revision:

`japanese-p8-read-model-v1`

Japanese pins the P8 package by Git commit and derives its projection from:

- Today workload;
- course-unit progress;
- kana/vocabulary/grammar/sentence/lexical-fluency summaries;
- A1/B1/B2/C1-foundation internal milestone evidence;
- StudyEvents only long enough to calculate user-facing activity counts, streak and last-study timestamp.

Raw StudyEvents and FSRS traces do not leave the product through P8.

## Drift tracking

The compatibility registry follows the current P8-integrated heads and fingerprints the producer/integration files in addition to migration-critical content.

The original `sourceBaselineRevision` values remain unchanged. They still identify the product revisions audited before the shared platform integrations were added.

This preserves the distinction between:

- original source architecture audited by P6/P7;
- current repository head containing read-only platform integration.

## Hub readiness

The two products can now produce the same P8 envelope:

```text
French authoritative state  ─┐
                             ├─► p8-read-model-v1 ─► Hub data plane
Japanese authoritative state ─┘
```

The Hub data-plane implementation is ready to consume those snapshots. Live cross-device retrieval is intentionally not part of P8; it is the persistence/authentication work for P9.
