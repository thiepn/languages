# THIEPN Languages Architecture

## Purpose

THIEPN Languages is the shared contract and platform layer beneath individual language products. It standardizes evidence, memory scheduling, mastery interpretation, skill transfer, adaptive orchestration, content boundaries, curriculum dependencies and language registration without forcing French, Japanese or future languages into identical pedagogy.

## Core invariants

1. **One account, many language enrollments.**
2. **Learner evidence is language-namespaced.**
3. **Memory, mastery, orchestration and proficiency are separate concepts.**
4. **Study evidence is append-oriented and replayable.**
5. **Canonical linguistic content, pedagogical sequencing, source material and learner state are separate domains.**
6. **Language-specific capabilities and skill graphs are declared by language packs/profile data.**
7. **Core code must not accumulate `if (language === "...")` branches.**
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
                                      │
                                      └──► retention forecast
```

## Orchestration pipeline

```text
P2 mastery projections / specialist subsystem evidence
                 │
                 ▼
        language skill profiles
                 │
         ┌───────┴────────┐
         │                │
 prerequisite graph   transfer graph
         │                │
         └───────┬────────┘
                 ▼
       next-best-activity ranking
                 │
                 ▼
       short adaptive study block
```

The orchestrator never writes mastery merely because it recommended or launched an activity.

## Skill profiles

A language defines skill nodes such as vocabulary, reading, listening, conversation, kana or kanji. Each node declares the evidence dimensions that support it.

Profiles expose:

- strength;
- evidence confidence;
- evidence count;
- orchestration state.

Missing evidence is represented as uncertainty, not a measured failure.

## Graph semantics

### Prerequisite

A prerequisite edge affects readiness.

Low readiness suppresses downstream ranking and can cause an adaptive block to insert prerequisite support before the anchor task.

Prerequisite edges must be acyclic.

### Transfer

A transfer edge detects an evidence-backed gap between an upstream and downstream skill.

Transfer edges may represent mutually supportive real-world skills and therefore are not required to form a DAG.

A transfer gap requires confidence on both sides. Strong upstream evidence cannot manufacture a downstream failure where downstream evidence is absent.

## Adaptive ranking

P3 ranking combines bounded factors:

- confirmed skill need;
- evidence uncertainty;
- upstream transfer gap;
- prerequisite readiness;
- runtime urgency;
- novelty/repetition;
- language activity base priority;
- small learned calibration bonus.

Resume-first state outranks new recommendations.

Priority is a scheduling score, not a mastery score.

## Adaptive blocks

Blocks contain at most three activities and default to an approximate 26-minute budget.

Composition can:

1. insert prerequisite support when readiness is low;
2. run the anchor activity;
3. add downstream transfer when readiness is adequate;
4. fill remaining capacity with complementary high-value work.

The activity's native subsystem remains authoritative for completion and evidence.

## Calibration boundary

Activity observations can make small ranking adjustments only after repeated completed sessions. The learned bonus is bounded to ±6 points and never modifies mastery, memory or proficiency.

## Shared vs language-specific

Shared core owns graph semantics, validation, ranking and block composition.

Language profiles own:

- skill-node identities;
- evidence dimensions;
- prerequisite/transfer edges;
- activities;
- language-specific timing/default priorities.

French and Japanese therefore share orchestration mechanics without sharing an identical skill graph.

## Proficiency

No orchestration score, memory trace or entity mastery state is itself a CEFR/JLPT/DELF claim. Proficiency requires separate breadth, task and assessment evidence.

## Repository boundary

`thiepn/languages` owns shared contracts and shared implementations.

`thiepn/french` and `thiepn/japanese` remain separately deployable products and should adopt shared packages through explicit compatibility phases.

The future Hub consumes standardized enrollment/progress/recommendation state. It must not create parallel mastery, scheduling or curriculum engines.
