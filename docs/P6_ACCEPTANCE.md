# P6 — Language-Pack Adapter SDK, Existing-App Inventory Extraction & Migration Readiness

Status: **implemented**

## Objective

Connect the shared P1–P5 architecture to the real existing French and Japanese products without rewriting either production app.

P6 creates compatibility adapters that:

- inspect current production source shapes;
- translate canonical content and source metadata into P5 release candidates;
- translate learner evidence into shared StudyEvents where safe;
- preserve existing FSRS memory state where possible;
- surface migration blockers, fidelity warnings and source drift;
- keep private learner material outside public canonical content.

## Delivered

### Shared adapter SDK

`packages/adapter-sdk` provides:

- normalized migration issue severity/domain vocabulary;
- `blocked / needs_review / ready` readiness states;
- common inventory output;
- language-level normalization;
- composite framework-level expansion;
- support-level mapping;
- timestamp normalization;
- stable legacy event IDs;
- language-aware entity conversion;
- coverage merging utilities.

### French adapter

The French adapter supports the current single-file architecture.

It can:

- statically inspect the app source without executing it;
- locate `APP_VERSION` and the pinned external vocabulary SHA;
- inventory embedded readings, listening derivation, scenarios, missions, sentence exercises, usage rows and function taxonomy;
- prefer an exact existing `catalogSnapshot()` export;
- fall back to the raw pinned vocabulary source with an explicit fidelity warning;
- retain external source/license declarations;
- build a P5 release candidate;
- consume an optional runtime P27 coverage/quality snapshot;
- migrate legacy review-log evidence;
- prevent supplemental/remediation practice from silently becoming SRS transitions.

The raw source fallback intentionally does **not** claim to reproduce French's lexical overrides, prepared grammar metadata or exact runtime core/supplemental classification.

### Japanese adapter

The Japanese adapter supports the current structured repository architecture.

It:

- assembles `jp-core` plus all three C1 overlays exactly as the runtime does;
- blocks current-runtime parity if a required C1 supplement is omitted;
- converts the source registry into the shared source/licensing model;
- inventories canonical content;
- generates typed cross-content references;
- derives seed-backed P4/P5 coverage;
- keeps generated-but-not-materialized prompt coverage explicit rather than invented;
- maps legacy Japanese StudyEvents into language-aware shared StudyEvents;
- maps persisted FSRS traces directly into shared FSRS memory traces;
- excludes private documents/vocabulary/sentences from the public release candidate.

### P5 compatibility repair

P6 corrected a cross-phase contract issue discovered by the real Japanese inventory.

Canonical content levels are now validated against the language manifest's **primary proficiency framework** rather than only against levels that currently have P4 promotion gates.

This permits valid Japanese C1 canonical content while shared internal promotion policy currently stops at B2.

It does not create a C1 promotion claim.

## Migration-readiness semantics

### Blocker

Used when migration would lose or corrupt authoritative state, for example:

- required current-runtime content source missing;
- French prepared catalog fingerprint disagrees with the app pin;
- canonical content references unknown source IDs;
- required Japanese C1 overlay omitted;
- required learner/memory identity missing.

### Warning

Used when migration can proceed but requires review, for example:

- French raw vocabulary used instead of exact prepared catalog;
- runtime-only coverage cannot yet be reproduced;
- source licensing declaration is too coarse;
- generated Japanese prompt coverage is not materialized in seed data;
- connected listening relies on speech synthesis;
- FSRS adapter version differs from the shared baseline.

### Info

Used for deliberate compatibility rules, such as preserving the boundary between mastery practice and SRS scheduling.

## Learner-state policy

P6 does not reconstruct learner truth from UI progress percentages.

### French

Legacy review evidence is converted into StudyEvents.

Only evidence that represents ordinary/scheduled review receives `memoryReview`.

Practice such as:

- weakness repair;
- scaffold work;
- supplemental mixed review;
- targeted remediation;

can remain mastery evidence while leaving the memory scheduler untouched.

### Japanese

Existing StudyEvents are translated nearly one-to-one:

- `userId → accountId`;
- entity refs gain `languageId = japanese`;
- hint counts become support level;
- existing metadata/version/context is retained.

P6 does not infer a memory review from those events.

The persisted FSRS trace is migrated separately, preserving:

- due date;
- stability;
- difficulty;
- elapsed/scheduled days;
- reps;
- lapses;
- learning state;
- last review;
- revision;
- scheduler version.

## Private-data boundary

Adapters may inventory the existence of private learner stores, but public release candidates exclude private:

- documents;
- mined vocabulary;
- mined sentences;
- user responses;
- recordings/media state.

Migration adapters must not turn private learner material into canonical public content as a side effect.

## Regression protection

Tests cover:

- French static source inspection;
- raw-vocabulary fidelity warnings;
- French supplemental-practice/SRS separation;
- Japanese base + C1 runtime assembly;
- Japanese public/private content boundary;
- Japanese StudyEvent mapping;
- Japanese FSRS trace preservation;
- C1 canonical content acceptance independently of B2-limited promotion gates.

## Explicitly deferred

P6 does not:

- modify `thiepn/french`;
- modify `thiepn/japanese`;
- migrate a live user's data;
- upload shared packages into either production app;
- replace French's runtime catalog loader;
- move Japanese canonical seed files into this repository;
- certify official framework equivalence;
- deploy the Languages Hub;
- persist migration reports to THIEPN Core.

## Exit criteria

P6 is complete when:

1. both production applications have explicit compatibility adapters;
2. real current source/repository fingerprints are documented;
3. French external vocabulary dependence is represented rather than hidden;
4. Japanese runtime assembly includes all current C1 overlays;
5. learner events can be translated without fabricating evidence;
6. persisted Japanese FSRS memory can be preserved directly;
7. private learner content cannot enter public release candidates;
8. incompatible/lossy inputs produce readiness issues instead of silent conversion;
9. C1 canonical content can coexist with a promotion policy that currently stops at B2;
10. the full P1–P6 test suite passes.

## Next phase

**P7 — Shared Package Distribution, Cross-Repo Compatibility Harness & First Read-Only Integration**

P7 should turn the shared packages into consumable versioned artifacts/workspace dependencies, add compatibility checks against the current French/Japanese repository revisions, and integrate the shared contracts read-only into each app before any authoritative state migration.
