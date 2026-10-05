# P4 — Proficiency Framework, Assessment Evidence & Promotion-Gate Architecture

Status: **implemented**

## Objective

Create a shared proficiency architecture that distinguishes course progress, mastery, app-defined promotion, modeled proficiency and external exam results.

## Delivered

- shared assessment-evidence contract
- proficiency policy and level definitions
- conjunctive promotion gates
- independent score/confidence/evidence thresholds per gate
- independent-evidence minimums
- explicit curriculum/assessment coverage requirements
- coverage-incomplete blocking
- sequential promotion prerequisites
- immutable-style historical promotion milestones
- promoted-but-maintenance-needed state
- framework competence vocabulary
- external-framework scope declarations
- full vs partial framework mappings
- partial mappings prohibited from supporting global promotion
- explicit external-result record type
- weakest learner-remediable gate detection
- bounded ≤16-point remediation scheduler signal
- no remediation boost for product-owned coverage gaps
- French CEFR promotion policy
- Japanese CEFR-oriented promotion policy
- DELF/DALF overlay declaration
- JF Standard mapping declaration
- JLPT scoped exam-overlay declaration
- regression tests

## Claim boundary

P4 makes five states intentionally different:

1. **Course progress** — where the learner is in instructional content.
2. **Entity/skill mastery** — what P2/P3 evidence supports.
3. **Internal promotion** — THIEPN allows the learner to move beyond an app-defined framework band.
4. **Modeled proficiency** — an evidence-backed estimate in a framework coordinate system.
5. **External result/certification** — a result issued by an outside examination authority.

An internal promotion is not an external certificate.

## Promotion semantics

Promotion is conjunctive.

Every required gate must pass its own:

- score threshold;
- confidence threshold;
- total evidence minimum;
- independent-evidence minimum;
- coverage requirements.

A high average cannot compensate for a failed speaking, listening, reading, interaction or other required gate.

## Coverage semantics

Coverage is a property of the product/curriculum, not the learner.

If a level lacks enough:

- reading tasks;
- listening tasks;
- speaking tasks;
- interaction scenarios;
- writing tasks;
- functional missions/Can-do tasks;

the affected gate becomes `coverage_incomplete`.

That state blocks promotion but is not treated as learner weakness and does not generate a remediation scheduler boost.

## Historical promotion

Once an eligible evaluation creates a PromotionMilestone, that historical milestone is retained.

If current evidence later drops below the gate thresholds, status becomes:

`promoted_maintenance_needed`

rather than silently deleting the achievement.

## External frameworks

External framework results are stored separately from app promotion.

Mappings must declare:

- source framework and level;
- target framework and level;
- whether the mapping is full or partial;
- exactly which competences it covers.

A partial mapping cannot support a global promotion claim.

This is particularly important for exam overlays that do not assess all productive/interactive skills.

## Scheduler integration

The weakest failed learner-remediable gate can emit a bounded activity boost for P3.

- maximum boost: 16 points;
- coverage gaps produce no learner remediation boost;
- promotion status itself never writes mastery evidence.

## Explicitly deferred

P4 does not:

- claim that the provisional internal thresholds reproduce official exam rubrics;
- ingest real DELF/DALF/JLPT score reports;
- define final official framework-equivalence mappings;
- migrate French P25 persistence;
- build Hub proficiency UI;
- persist shared milestones to THIEPN Core;
- generate assessment content;
- replace human/external certification.

## Exit criteria

P4 is complete when:

1. one failed gate blocks promotion regardless of mean score;
2. missing curriculum/assessment coverage blocks promotion separately from learner weakness;
3. promotion order can require prerequisite levels;
4. historical milestones survive later performance decline;
5. partial external mappings cannot become global proficiency claims;
6. French and Japanese use the same promotion engine with different gate policies;
7. remediation signals are bounded and only target learner-remediable deficits;
8. internal promotion remains distinguishable from external certification.

## Next phase

**P5 — Shared Content QA, Coverage Matrix & Language-Pack Release Certification**

P5 should generalize French P27 and Japanese source/licensing validation into one release-quality system that audits curriculum coverage, structural references, provenance, licensing, modality breadth and promotion-critical assessment coverage before a language pack can be certified.
