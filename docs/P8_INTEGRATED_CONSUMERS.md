# P8 Integrated Consumers

P8 is integrated in both production language repositories.

## Platform package

- platform commit consumed by both producers: `e74a10aa9d9d161c7f427ce7691be32df4bbc31c`
- package version: `0.8.0`
- read model: `p8-read-model-v1`
- Hub data plane: `p8-hub-data-plane-v1`

## French

Current integrated head:

`b4755ae1f59f91b8552d5cfed425f5ff49e00ebc`

Producer revision:

`french-p8-read-model-v2`

French vendors the P8 browser artifact and derives its projection from existing authoritative systems:

- review/workload summaries;
- activity and streak calculations;
- target-date curriculum state;
- P25 internal CEFR-aligned promotion gates;
- P22/P23 coach recommendation;
- P28 fixed functional-benchmark history and P29 maintenance/long-term-transfer summaries.

No raw review log or private account data is included in the projection.

## Japanese

Current integrated head:

`e4c72347f16892c59a2ad94ab788c4157859a1ea`

Producer revision:

`japanese-p8-read-model-v2`

Japanese pins the P8 package by Git commit and derives its projection from:

- Today workload;
- course-unit progress;
- kana/vocabulary/grammar/sentence/lexical-fluency summaries;
- A1/B1/B2/C1-foundation internal milestone evidence;
- P14 C1 autonomy/reliability portfolio summaries;
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


## Post-integration producer refresh

Later app phases may advance without changing the P8 envelope.

The current refresh policy is:

- French P28–P30 longitudinal functional evidence is exposed as labelled progress metrics while P25 remains the proficiency authority.
- Japanese P14 C1 autonomy/reliability is exposed as labelled progress metrics while milestone diagnostics remain the proficiency authority.
- raw benchmark attempts, C1 portfolio responses, StudyEvents and memory traces remain product-private.

The compatibility registry must be advanced only after those producer changes pass their native app test suites.
