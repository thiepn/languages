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

## Repository boundary

`thiepn/languages` owns shared contracts and shared implementations.

`thiepn/french` and `thiepn/japanese` remain separately deployable products. P6 adapters will translate their real current inventories into the shared contracts before migration.

The future Hub consumes standardized learner and certification state. It must not create parallel mastery, scheduling, promotion, curriculum or release-quality engines.
