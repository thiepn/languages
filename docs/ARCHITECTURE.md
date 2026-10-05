# THIEPN Languages Architecture

## Purpose

THIEPN Languages is the shared contract and platform layer beneath individual language products. It standardizes evidence, memory scheduling, mastery interpretation, content boundaries, curriculum dependencies and language registration without forcing French, Japanese or future languages into identical pedagogy.

## Core invariants

1. **One account, many language enrollments.**
2. **Learner evidence is language-namespaced.** An entity identity is never globally meaningful without its language.
3. **Memory, mastery and proficiency are separate concepts.**
4. **Study evidence is append-oriented and replayable.** UI state must not become authoritative learning evidence.
5. **Canonical linguistic content, pedagogical sequencing, source material and learner state are separate domains.**
6. **Language-specific capabilities are declared by language packs.** Core code must not accumulate `if (language === "...")` branches.
7. **Curriculum order is a dependency graph.** A flat lesson sequence may be a presentation, not the canonical dependency model.
8. **Course completion is not a proficiency claim.**
9. **External content keeps provenance and licensing policy.**
10. **Existing French and Japanese products remain authoritative until explicit migration phases.**

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

A correct activity may improve mastery without touching the SRS schedule. A scheduled review may update memory state while still preserving its skill-specific mastery evidence.

## Mastery

P2 models mastery by **entity × skill dimension**.

Evidence preserves:

- independent vs supported success;
- failures;
- delayed retrieval success/failure;
- distinct evidence days;
- evidence span;
- lapses;
- confidence.

The entity-level longitudinal states are:

`Unseen → Seen → Learned → Retrievable → Usable → Durable`

Durable is deliberately difficult to earn. Same-day repetition is insufficient.

## Memory

The scheduler interface owns:

- card creation;
- review transitions;
- due dates;
- scheduler-specific state;
- retrievability at a point in time.

P2 provides an FSRS adapter pinned to the version already used by Japanese. The learner engine does not depend on FSRS-specific card internals.

Forgetting calibration is a **forecast correction layer**, not a scheduler mutation.

## Shared vs language-specific

Shared core owns:

- language/account identity
- entity references
- study-event vocabulary
- skill/evidence vocabulary
- replayable learner projection
- memory-scheduler interface
- mastery/durability semantics
- proficiency-evidence shape
- provenance and licensing primitives
- curriculum dependency integrity
- language registration and capability discovery

Language packs own:

- script-specific modules
- morphology behavior
- segmentation behavior
- pronunciation specifics
- transliteration
- writing-system pedagogy
- language-specific curriculum data
- language-specific content fields
- exam overlays and mappings

## Proficiency

CEFR is the default cross-language coordinate system, but it is not treated as a universal language syllabus.

No memory trace or entity mastery state is itself a CEFR/JLPT/DELF claim. Proficiency requires separate breadth, task and assessment evidence.

## Evidence policy

A StudyEvent can contribute mastery when it records an actual assessed outcome.

- lookup: no mastery
- mining: no mastery
- skipped task: no mastery
- revealed answer: weak negative/uncertainty evidence
- hinted correct: positive but discounted
- independent correct: strongest ordinary evidence

Only an explicit `memoryReview` changes the SRS state.

## Repository boundary

`thiepn/languages` owns shared contracts and shared implementations.

`thiepn/french` and `thiepn/japanese` remain separately deployable products. They should consume stable shared packages gradually rather than being copied wholesale into this repository.

The future Hub is a consumer of enrollment, progress and recommendation state. It must not create a parallel SRS, mastery model or curriculum.
