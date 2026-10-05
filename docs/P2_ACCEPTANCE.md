# P2 — Shared Learner Evidence, Memory Scheduler Boundary & Mastery Projection Architecture

Status: **implemented**

## Objective

Create one deterministic, replayable learner-state foundation that combines Japanese's event/scheduler architecture with French's conservative mastery and durability semantics.

## Delivered

- shared explicit memory-review signal on StudyEvent
- replayable language-aware learner state
- single-account replay guard
- support-aware mastery evidence
- independent vs supported-success counters
- delayed 7-day success/failure evidence
- lapse counting
- distinct-day and evidence-span confidence
- generic memory scheduler boundary
- FSRS adapter based on `ts-fsrs 5.4.2`
- scheduler retrievability forecast
- explicit separation between mastery evidence and SRS scheduling
- per-language forgetting calibration
- calibration disabled before 12 delayed memory observations
- bounded ±8 percentage-point calibration correction
- 1/7/30/90-day retention forecast
- monotonic retention horizons
- Seen → Learned → Retrievable → Usable → Durable shared states
- durable gate requiring active use, ≥62% 30-day retention, two 7-day delayed successes, ≥21-day evidence span and ≥42% confidence
- fragile-knowledge detection
- French/Japanese compatibility map
- regression tests

## Key evidence rules

1. A page view, recommendation, lookup or mining action is not mastery.
2. Correct-with-hint is weaker evidence than independent retrieval.
3. A correct task does not change an SRS interval unless the event explicitly carries `memoryReview`.
4. Same-day repetition cannot create Durable status.
5. Forgetting calibration changes forecasts only; it never rewrites the underlying scheduler.
6. Mastery is per entity × skill dimension.
7. Entity mastery is not a proficiency certification.

## Explicitly deferred

P2 does not:

- migrate existing French or Japanese learner data;
- port P22/P23 orchestration;
- create CEFR promotion gates;
- optimize FSRS parameters per learner;
- create cross-language scheduling budgets;
- persist the shared learner state to THIEPN Core;
- deploy Hub progress UI.

## Exit criteria

P2 is complete when:

1. replaying the same events in any input order yields the same projections;
2. the memory scheduler can be replaced behind an interface;
3. FSRS state is not treated as mastery;
4. hinted/support-assisted success is distinguishable from independent retrieval;
5. delayed evidence is mechanically represented;
6. same-day practice cannot qualify as durable mastery;
7. retention calibration is bounded and evidence-gated;
8. French and Japanese migration paths are documented without rewriting either production app.

## Next phase

**P3 — Shared Skill Graph, Cross-Skill Transfer Model & Adaptive Orchestration Foundation**

P3 should generalize French P22/P23 into a language-independent graph of prerequisites, transfer gaps, skill evidence confidence, next-best-activity ranking and bounded session composition while allowing each language pack to define its own graph edges and activity families.
