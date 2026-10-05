# P8 — Shared Read Models, Cross-Language Progress Contract & Hub Data Plane

Status: **implemented and integrated across the platform, French and Japanese repositories**

## Objective

Give \`languages.thiepn.dev\` a stable way to read useful state from independent language products without importing their databases or becoming a second learning engine.

P8 defines one privacy-minimal, read-only projection per language product.

The Hub may consume that projection. It may not reconstruct learner truth from raw StudyEvents, memory traces, answers, private content or app-specific persistence.

## Shared read model

The versioned contract is:

- package: \`@thiepn/languages@0.8.0\`
- export: \`@thiepn/languages/read-model\`
- browser export: \`@thiepn/languages/read-model/browser\`
- model version: \`p8-read-model-v1\`
- Hub plane version: \`p8-hub-data-plane-v1\`

A language read model contains:

- app/language identity;
- presentation metadata;
- enrollment state;
- current workload;
- recent activity;
- app-defined progress metrics;
- internal/external proficiency projection;
- the app's own recommended next action;
- source/version metadata.

It intentionally does not contain raw StudyEvents, FSRS traces, answers/responses, recordings, private documents, private mined vocabulary/sentences, account/user identifiers, or raw learning content. The validator fails closed when these private/raw fields appear.

## Workload

The common workload shape is:

\`\`\`text
dueItems
newItems
practiceItems
courseItems
totalItems
estimatedMinutes?
\`\`\`

Counts can be summed for a daily workload overview, but the Hub does not assume that one French card equals one Japanese course prompt in pedagogical value.

## Activity

The common activity shape contains:

\`\`\`text
todayEvents
sevenDayEvents
streakDays
lastStudiedAt
\`\`\`

These are simple user-facing summaries, not raw evidence.

## Progress

P8 does not force every language into one fake completion percentage. Each app publishes labelled metrics:

\`\`\`text
[
  { id, label, current, total?, unit? }
]
\`\`\`

The Hub displays these metrics per language and does not average them across languages.

## Proficiency

Each app keeps authority over its own proficiency interpretation. The shared envelope preserves framework name, claim scope, current/frontier band where meaningful, maintenance state, and dimension-level scores/confidence/evidence counts.

French internal CEFR-aligned evidence and Japanese internal communicative milestones are not silently converted into one global numeric language score.

## Next action

Every app publishes one product-authoritative recommendation:

\`\`\`text
id
label
kind
priority
reason?
route?
\`\`\`

The Hub may use \`priority\` only to decide which language recommendation to surface first. It does not rerun the product scheduler or choose the activity within that language.

## Hub data plane

\`buildHubLanguageDataPlane()\` accepts read models and produces accepted/rejected snapshots, freshness, aggregate simple workload/activity counts, and one cross-language next-action pointer.

The comparison policy is embedded in the output:

\`\`\`text
averagesMastery = false
averagesProficiency = false
convertsFrameworkBands = false
recomputesNextAction = false
\`\`\`

## Freshness

A stale snapshot remains visible but cannot win the next-language recommendation. Default freshness horizon: **6 hours**.

## Hub boundary

\`apps/hub/src/data-plane.ts\` maps the generic Hub plane into language cards while preserving each product's own progress and proficiency semantics.

## Transport

P8 defines the payload contract and aggregation plane, not a second learner database. French and Japanese now produce the shared envelope from their existing authoritative state. Standardized authenticated cross-device persistence is deferred to P9.

See `docs/P8_INTEGRATED_CONSUMERS.md` for the merged producer revisions and drift-tracking heads.

## Exit criteria

P8 is complete when:

1. a versioned language read-model contract exists;
2. TypeScript/ESM and browser/static consumers are supported;
3. JSON Schema exists for non-TypeScript validation;
4. workload/activity/progress/proficiency/next-action projections are represented;
5. privacy/raw-data fields fail validation;
6. the Hub can aggregate valid snapshots and reject malformed ones;
7. stale snapshots cannot drive the global next action;
8. the Hub does not average mastery or proficiency;
9. framework bands are not cross-converted;
10. French and Japanese produce the contract from their existing authoritative state;
11. the Hub can render both through the same data-plane adapter;
12. all P1–P8 regression tests and consumer CIs pass.

## Next phase

**P9 — Authenticated Read-Model Persistence, Hub Enrollment Registry & Live Cross-Device Language Dashboard**

P9 should persist each app's P8 projection behind the existing THIEPN Account/Core boundary, connect the Hub to those authenticated snapshots, and make \`languages.thiepn.dev\` show live cross-device French/Japanese state without reading app-private databases directly.


## Producer evolution

The shared envelope is versioned independently from each application's projection implementation.

A product may advance its `producerRevision` while remaining on `p8-read-model-v1` when it only:

- adds or removes labelled product-specific progress metrics;
- improves how existing authoritative product state is summarized;
- keeps workload/activity/proficiency/next-action semantics compatible;
- preserves the privacy and authority boundaries.

Such a refresh does **not** require a new cross-language schema version.

The refreshed French and Japanese producers demonstrate this rule: newer longitudinal functional/C1 evidence is surfaced as progress metrics rather than being converted into a new cross-language proficiency score.
