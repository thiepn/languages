# THIEPN Languages Architecture

## Purpose

THIEPN Languages is the shared contract and platform layer beneath individual language products. It standardizes evidence, memory scheduling, mastery interpretation, skill transfer, adaptive orchestration, proficiency promotion, content quality, release certification, curriculum dependencies and language registration without forcing French, Japanese or future languages into identical pedagogy.

## Core invariants

1. **One account, many language enrollments.**
2. **Learner evidence is language-namespaced.**
3. **Memory, mastery, orchestration, internal promotion and external certification are separate concepts.**
4. **Study evidence is append-oriented and replayable.**
5. **Canonical linguistic content, pedagogical sequencing, source material and learner state are separate domains.**
6. **Language-specific capabilities, skill graphs, proficiency policies and quality policies are declared as data.**
7. **Core code must not accumulate language-name conditionals.**
8. **Curriculum order and skill transfer are explicit graphs, not hidden screen order.**
9. **Course completion is not a proficiency claim.**
10. **Public canonical content must have explicit provenance and redistributable rights.**
11. **Existing French and Japanese products remain authoritative until explicit migration phases.**
12. **Migration adapters report loss, ambiguity and source drift; they never silently upgrade approximate legacy data into canonical truth.**

## Learner-state pipeline

```text
StudyEvent
    │
    ├── mastery evidence ──► dimension projection
    │                        │
    │                        └──► entity longitudinal summary
    │
    └── explicit memoryReview only
             │
             └──► MemoryScheduler ──► due date / stability / retrievability
```

## Orchestration pipeline

```text
P2 evidence
    ↓
P3 language skill profiles
    ↓
prerequisite + transfer graph
    ↓
next-best activity / adaptive block
```

## Proficiency pipeline

```text
assessment evidence
      +
coverage
      +
language proficiency policy
      ↓
conjunctive gate evaluation
      ↓
internal promotion milestone
```

## Release-certification pipeline

```text
manifest + skill graph + proficiency policy
                  +
source registry + canonical inventory
                  +
cross-content references
                  +
coverage + editorial metrics
                  ↓
             P5 audit
        ┌─────────┼──────────┐
        │         │          │
    structural  licensing  coverage/quality
      defects     safety      warnings
        │         │          │
        └────┬────┘          │
             ▼               ▼
          blocked      certified_with_warnings
                               │
                               ▼
                           certified
                    when warnings are resolved
```

## Certification and promotion are different

A release can be safe to publish while a higher proficiency band is not ready to support promotion.

For example, valid A1–B1 content plus incomplete B2 listening can be:

- public-release ready;
- certified with warnings;
- promotion-ready for A1–B1;
- not promotion-ready for B2.

This distinction prevents content incompleteness from becoming a false learner assessment.

## Provenance boundary

Public canonical content fails closed on licensing.

A public record must:

- identify its source records;
- use sources with explicit rights declarations;
- respect raw-vs-derived redistribution permission;
- provide attribution where required;
- never publish a source marked private-only.

Private learner documents may remain stored privately without satisfying public redistribution rules. They do not silently become canonical public course content.

## Coverage ownership

P4 owns what evidence a promotion gate needs.

P5 reads those coverage requirements directly and audits whether the product actually supplies the content needed to gather that evidence.

Language-specific P5 quality policies may add additional warning/failure criteria, but they cannot weaken P4's promotion-critical requirements.

## P6 compatibility and migration layer

The shared model does not imply that every existing app has the same source architecture.

```text
thiepn/french
single-file app + pinned external vocabulary
        │
        ▼
French legacy/catalog adapter
        │
        ├── canonical inventory
        ├── P5 release candidate
        └── legacy review evidence

thiepn/japanese
structured seeds + StudyEvents + FSRS traces
        │
        ▼
Japanese structured adapter
        │
        ├── assembled canonical inventory
        ├── P5 release candidate
        ├── StudyEvent translation
        └── direct FSRS trace migration

both
        │
        ▼
shared P1–P5 contracts
```

Adapters are compatibility boundaries, not new authorities.

They may:

- translate known legacy fields;
- normalize framework labels;
- assemble documented source overlays;
- preserve provenance;
- emit migration/readiness issues.

They may not:

- invent missing learner evidence;
- infer official proficiency;
- promote private learner data into public content;
- silently treat lossy source conversion as exact migration.

### French compatibility rule

French's raw pinned vocabulary is transformed by application-specific preparation before becoming the working catalog. Exact migration therefore prefers the app's prepared `catalogSnapshot()`.

Raw pinned vocabulary can be used for inventory/fallback analysis, but the adapter must report the resulting fidelity limitation.

### Japanese compatibility rule

Japanese current canonical runtime content is a documented assembly of the base seed and three C1 overlays. Omitting those overlays is not equivalent to the current production course.

Japanese StudyEvents and memory traces remain separate during migration. The event adapter does not fabricate P2 `memoryReview` signals. Existing FSRS traces migrate independently.

### Canonical level vs promotion level

Canonical course content may extend beyond the levels for which THIEPN currently implements internal promotion gates.

P5 therefore validates a content level against the language manifest's primary proficiency framework. P4 remains independently responsible for deciding which bands have actual promotion policies.

Japanese C1 content can consequently be valid canonical content without implying that THIEPN currently awards a C1 internal promotion.

## Repository boundary

`thiepn/languages` owns shared contracts and shared implementations.

`thiepn/french` and `thiepn/japanese` remain separately deployable products. P6 now provides explicit adapters for their current source and learner-state shapes; those adapters are read-only compatibility tooling and do not modify either production app.

The future Hub consumes standardized learner and certification state. It must not create parallel mastery, scheduling, promotion, curriculum or release-quality engines.
