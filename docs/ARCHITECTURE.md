# THIEPN Languages Architecture

## Purpose

THIEPN Languages is the shared contract and platform layer beneath individual language products. It standardizes evidence, memory scheduling, mastery interpretation, skill transfer, adaptive orchestration, proficiency promotion, content boundaries, curriculum dependencies and language registration without forcing French, Japanese or future languages into identical pedagogy.

## Core invariants

1. **One account, many language enrollments.**
2. **Learner evidence is language-namespaced.**
3. **Memory, mastery, orchestration, internal promotion and external certification are separate concepts.**
4. **Study evidence is append-oriented and replayable.**
5. **Canonical linguistic content, pedagogical sequencing, source material and learner state are separate domains.**
6. **Language-specific capabilities, skill graphs and proficiency policies are declared as data.**
7. **Core code must not accumulate language-name conditionals.**
8. **Curriculum order and skill transfer are explicit graphs, not hidden screen order.**
9. **Course completion is not a proficiency claim.**
10. **External content keeps provenance and licensing policy.**
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

The orchestrator consumes evidence but does not create mastery.

## Proficiency pipeline

```text
skill/task assessment evidence
          +
curriculum/assessment coverage
          +
framework-specific promotion policy
          ↓
individual gate evaluations
          ↓
all gates pass?
      ┌──────┴──────┐
     no            yes
     │              │
not ready /     prerequisite
coverage gap       satisfied?
                    │
                    ↓
             internal promotion
                    │
                    └── historical milestone
```

No weighted average can override a failed required gate.

## Claim hierarchy

The platform distinguishes:

```text
course progress
      ≠
skill/entity mastery
      ≠
internal promotion
      ≠
modeled proficiency
      ≠
external exam result/certification
```

These states may inform one another, but they are not interchangeable.

## Coverage boundary

A promotion gate needs both learner evidence and sufficient product coverage.

Missing assessment/curriculum coverage is a product limitation. It must not be represented as learner failure or used to generate remediation pressure.

## External framework mappings

Framework mappings are scoped.

A mapping records its covered competences and whether it is full or partial. Partial mappings cannot support a global promotion claim.

Exam overlays therefore remain evidence sources for the domains they actually assess rather than replacing the platform's broader communicative model.

## Promotion history

Internal promotion is sequential when configured by the language policy.

Earned milestones remain historical facts. A later decline results in `promoted_maintenance_needed`, not deletion of the milestone.

## P3 integration

A failed learner-remediable promotion gate can produce a bounded activity boost for the shared orchestrator.

Coverage gaps do not produce such a boost because the learner cannot fix missing product content.

## Shared vs language-specific

Shared core owns:

- assessment evidence semantics;
- gate evaluation;
- prerequisite promotion logic;
- milestone behavior;
- framework mapping scope;
- claim boundaries;
- remediation-signal bounds.

Language profiles own:

- framework choice;
- level sequence;
- gate identities;
- thresholds;
- required coverage;
- remediation skill/activity mapping;
- external exam/framework declarations.

## Repository boundary

`thiepn/languages` owns shared contracts and shared implementations.

`thiepn/french` and `thiepn/japanese` remain separately deployable products and should adopt shared packages through explicit compatibility phases.

The future Hub consumes standardized enrollment, progress, recommendation and proficiency state. It must not create parallel mastery, scheduling, promotion or curriculum engines.
