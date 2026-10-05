# P5 — Shared Content QA, Coverage Matrix & Language-Pack Release Certification

Status: **implemented**

## Objective

Make language-course quality and publishability mechanically auditable so future language packs cannot rely on a development session remembering every structural, coverage, provenance or licensing requirement.

## Delivered

- shared release-candidate certification contract
- whole-platform component consistency checks
- canonical content ID uniqueness checks
- level-label validation against the proficiency policy
- required/optional cross-content reference validation
- public/private content boundary
- source-registry validation
- public-content provenance requirement
- explicit public license/public-domain declaration requirement
- raw-vs-derived redistribution-right validation
- private-only source publication blocker
- attribution-required publication blocker
- P4 promotion coverage automatically compiled into the P5 coverage matrix
- promotion-critical coverage-gap reporting
- per-level promotion-readiness output
- additional language-specific breadth requirements
- editorial quality metric thresholds
- release states: blocked / certified_with_warnings / certified
- French P27-inspired metadata and everyday-domain quality policy
- Japanese source/licensing-inspired native-audio quality policy
- regression tests

## Certification target

P5 certifies a **language-pack release candidate**, not merely one content file.

A candidate includes:

- language manifest;
- P3 learning profile and skill graph;
- P4 proficiency policy;
- P5 language quality policy;
- source registry;
- canonical content inventory;
- typed cross-content references;
- coverage counts;
- editorial quality metrics.

All of these must agree on the same language identity.

## Release status semantics

### Blocked

Used for defects that make public publication unsafe or structurally invalid, including:

- invalid shared component contracts;
- language identity mismatch;
- duplicate canonical IDs;
- invalid level identifiers;
- broken required references;
- missing public provenance;
- unknown sources;
- private-only sources used publicly;
- absent license/public-domain declarations;
- redistribution rights that do not permit the proposed raw/derived publication;
- missing required attribution;
- invalid quality/coverage values.

### Certified with warnings

The release is structurally/licensing-safe, but the course has valid incompleteness such as:

- promotion-critical modality coverage gaps;
- everyday-domain gaps;
- low editorial metadata coverage;
- insufficient independently licensed native-audio inventory.

Warnings remain visible and are not rewritten into learner weakness.

### Certified

No release-blocking defects or outstanding configured warnings.

## Promotion coverage

P5 does not duplicate P4 thresholds by hand.

The validator derives every promotion gate's coverage requirements directly from the active P4 proficiency policy.

Example:

`B2 reading gate requires 3 reading items`

automatically becomes a P5 coverage cell.

If actual coverage is 0:

- public release may still be structurally safe;
- P5 status becomes `certified_with_warnings`;
- B2 is absent from `promotionReadyLevels`;
- the gap remains a product limitation rather than a learner deficit.

## Provenance and licensing

P5 carries forward the Japanese architecture rule:

> source material, canonical language knowledge, pedagogy and learner state are separate domains.

Every public canonical content record must identify its sources.

For every public source, the validator checks:

- an explicit license/public-domain declaration exists;
- the source is not private-only;
- the proposed raw or derived redistribution mode is permitted;
- required attribution text exists.

Unknown or ambiguous rights therefore fail closed instead of becoming public by default.

Private learner content is not subjected to public redistribution requirements and does not silently become canonical course content.

## French quality policy

P5 generalizes P27's editorial warning thresholds:

- vocabulary example-pair coverage ≥90%;
- IPA coverage ≥80%;
- noun article coverage ≥95%;
- noun gender coverage ≥95%.

French also declares zero-coverage warnings across its established everyday-domain taxonomy for A1–B2.

These are course-quality warnings, not learner scores.

## Japanese quality policy

Japanese adds a warning-level release inventory requirement for independently licensed native audio at A1–B2 and expects complete native-audio source/credit/license metadata coverage.

Public licensing itself remains a blocking rule, not merely a warning.

## Explicitly deferred

P5 does not:

- migrate actual French/Japanese production content into this repository;
- automatically construct release inventories from the existing apps;
- perform linguistic fact-checking of every sentence;
- replace editorial/human review;
- verify remote license URLs in real time;
- certify final official CEFR/JF/JLPT/DELF equivalence;
- publish a language pack;
- persist certification reports to THIEPN Core.

The production-app adapters that turn existing French/Japanese content into P5 release candidates should be implemented before migration/release certification is used operationally.

## Exit criteria

P5 is complete when:

1. French and Japanese release candidates pass through one certification engine;
2. broken references and duplicate IDs block certification;
3. unsafe/unknown public licensing blocks certification;
4. private learner content remains outside public licensing rules;
5. P4 promotion coverage is consumed automatically rather than copied manually;
6. coverage gaps remain warnings/product limitations rather than learner failures;
7. each level exposes whether product content is sufficient to support promotion evidence;
8. language-specific editorial policies can add stricter breadth/quality requirements without language conditionals in core.

## Next phase

**P6 — Language-Pack Adapter SDK, Existing-App Inventory Extraction & Migration Readiness**

P6 should build adapters for `thiepn/french` and `thiepn/japanese` that translate their real current content, sources, learner-event formats and coverage inventories into the shared P1–P5 contracts without rewriting either production app.
