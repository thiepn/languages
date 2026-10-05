# P2 Compatibility Map

P2 defines shared contracts. It does not migrate production state.

## Japanese → shared core

The current Japanese architecture is the closest technical ancestor.

| Japanese | Shared P2 |
|---|---|
| `userId` | `accountId` |
| entity without language | `EntityRef.languageId = "japanese"` |
| `SkillMasteryProjection` | enriched `MasteryProjection` |
| `MemoryTrace` | generic scheduler `MemoryTrace` |
| `ts-fsrs 5.4.2` | same adapter version in P2 |
| `hintsUsed` | explicit `supportLevel` |
| event replay | retained and generalized |
| lookup decreases mastery | replaced: lookup is encounter/uncertainty evidence, not negative mastery evidence |

Japanese-specific dimensions can remain extensions of the open `SkillDimension` contract during migration.

## French → shared core

French contributes the stronger interpretation layer.

| French concept | Shared P2 |
|---|---|
| P13 independent/support evidence | `supportLevel` + evidence counters |
| P13 cross-modality mastery | dimension-specific projections |
| P13 lapses | projection lapse counter |
| P24 Seen → Durable | shared longitudinal classification |
| P24 7-day delayed retrievals | delayed-success/failure counters |
| P24 21-day durable gate | retained |
| P24 30-day 62% threshold | retained |
| P24 ≥42% confidence gate | retained |
| P24 forgetting calibration | per-language conservative correction |
| P24 calibration minimum 12 pairs | retained |
| P24 ±8 percentage-point cap | retained |
| P22/P23 recommendations | deferred; orchestrator consumes P2 later |

Existing French review logs will need a migration adapter that reconstructs StudyEvents while preserving first-attempt/support metadata. P2 deliberately does not infer that history yet.

## Important incompatibilities

### 1. Hints

Japanese currently stores `hintsUsed`. Shared core stores semantic support level. Migration must map actual Japanese task behavior rather than simply using `hintsUsed > 0` for every exercise.

### 2. Memory scheduling

Only events with an explicit `memoryReview` signal modify the shared scheduler.

A successful reading, speaking or grammar activity may contribute mastery evidence without silently changing an SRS interval.

### 3. Lookup and mining

Lookup/mining may be useful learner activity, but P2 does not treat opening a definition or mining an item as demonstrated mastery.

### 4. Proficiency

No StudyEvent, mastery projection or memory forecast directly creates a CEFR/JLPT/DELF claim. Proficiency remains a later aggregate assessment layer.

## Migration rule

Adapters must preserve source semantics before shared-core adoption. Do not rewrite production databases simply to make field names match.
