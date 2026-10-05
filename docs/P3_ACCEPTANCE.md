# P3 — Shared Skill Graph, Cross-Skill Transfer Model & Adaptive Orchestration Foundation

Status: **implemented**

## Objective

Generalize the strongest architectural ideas from French P22/P23 into a language-independent orchestration layer without hard-coding French pedagogy into the platform.

## Delivered

- language-specific skill-graph contract
- prerequisite and transfer edge semantics
- prerequisite-cycle validation
- evidence dimensions per skill node
- evidence-limited skill profiles derived from P2 mastery
- weighted-mean and weakest-link aggregation modes
- explicit unseen/emerging/developing/functional/secure orchestration states
- language-specific activity catalogs
- next-best-activity ranking
- confirmed-weakness factor
- missing-evidence/uncertainty factor
- evidence-backed upstream-to-downstream transfer-gap factor
- prerequisite-readiness factor
- runtime urgency factor
- novelty/repetition control
- bounded ±6-point learned calibration adjustment
- minimum three observations before calibration activates
- resume-first scheduling
- deterministic recommendation reasons
- adaptive blocks capped at three activities
- default ~26-minute block budget
- prerequisite-support insertion before under-ready anchors
- downstream-transfer insertion when readiness is sufficient
- French learning graph fixture
- Japanese learning graph fixture
- validation and regression tests

## Core orchestration rule

The orchestrator consumes evidence; it does not create mastery.

A recommendation, launch, block composition or learner preference must never become a StudyEvent indicating skill success.

## Missing evidence

P3 preserves the P22 principle:

> missing evidence is not demonstrated failure.

An unseen skill has:

- strength = 0;
- confidence = 0;
- confirmed weakness = 0;
- uncertainty = 1.

This allows foundational exploration to be recommended while preventing an evidence-free advanced skill from being treated as a proven deficiency. Prerequisite readiness further suppresses premature downstream work.

## Transfer gaps

A transfer gap is only recognized when both sides have evidence.

For an edge such as:

`sentence production → speaking`

a high sentence-production strength and weak speaking strength can raise speaking priority only to the degree both profiles have evidence confidence.

## Calibration

P3 carries forward P23's conservative scheduler-calibration philosophy.

- no non-zero bonus before three completed observations;
- only the latest twelve observations are used;
- each observation is bounded to [-0.5, 0.5];
- learned ranking adjustment is bounded to [-6, +6] points;
- calibration affects ranking only;
- calibration never changes mastery, SRS state or proficiency.

This is observational adaptation, not causal proof that one activity teaches better than another.

## Language-specific examples

French can declare:

`vocabulary → usage → phrase transfer → sentence transfer → speaking → conversation → missions`

Japanese can independently declare:

`kana + vocabulary + kanji → word reading → sentence reading`

and:

`vocabulary + listening → spoken production → interaction`

The shared engine contains no French/Japanese conditionals.

## Explicitly deferred

P3 does not:

- migrate French P22/P23 production history;
- persist activity-launch history to THIEPN Core;
- collect learner session-fit feedback;
- create cross-language daily workload allocation;
- create Hub UI;
- establish CEFR promotion gates;
- automatically generate language graphs;
- infer causal effectiveness from activity outcomes.

## Exit criteria

P3 is complete when:

1. French and Japanese validate through one graph/orchestrator contract;
2. prerequisite cycles are mechanically rejected;
3. missing evidence does not become confirmed weakness;
4. downstream transfer gaps require evidence on both sides;
5. weak prerequisites suppress advanced recommendations;
6. resumable work outranks new work;
7. calibration is bounded and evidence-gated;
8. adaptive blocks contain at most three activities and respect the configured time budget when adding optional steps;
9. language-specific skills do not leak into shared-core conditionals.

## Next phase

**P4 — Proficiency Framework, Assessment Evidence & Promotion-Gate Architecture**

P4 should generalize French P25 into a cross-language proficiency layer that keeps CEFR/JF/JLPT/DELF mappings separate from app-defined promotion gates, requires breadth across receptive/productive/interactive skills, and refuses level claims when curriculum or assessment coverage is incomplete.
