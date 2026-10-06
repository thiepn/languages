# THIEPN Languages

Shared language-learning platform for THIEPN language products.

## Current foundation

- packages/domain — language-aware entities, StudyEvents, mastery/memory/proficiency contracts
- packages/language-registry — language-pack manifests and capability registry
- packages/content-schema — provenance-aware canonical content primitives
- packages/curriculum — curriculum dependency-graph validation
- packages/scheduler — replaceable memory scheduler boundary + FSRS adapter
- packages/learner-engine — replayable evidence, mastery, durability and retention projections
- packages/skill-graph — language-specific skill/prerequisite/transfer graphs and evidence profiles
- packages/orchestrator — next-best-activity ranking, bounded calibration and adaptive blocks
- packages/proficiency — assessment gates, coverage-aware internal promotion, milestones and scoped framework mappings
- packages/content-validation — structural, provenance, licensing, coverage and editorial release certification
- packages/adapter-sdk — migration inventory/readiness contracts and legacy compatibility utilities
- packages/consumer-contract — zero-dependency P7 cross-repo compatibility and read-only authority contract
- packages/read-model — P8 privacy-minimal language progress projections and Hub aggregation plane
- packages/dashboard — P9 authenticated persistence/dashboard client contract
- packages/shell — P10 product-family shell view model and browser contract
- languages/french and languages/japanese — language-specific manifests, learning graphs, proficiency/quality policies and production-app adapters
- apps/hub — buildable P10 responsive Languages shell for languages.thiepn.dev

See docs/ARCHITECTURE.md and the phase acceptance documents in docs/.

## Migration policy

Existing thiepn/french and thiepn/japanese products remain authoritative. Shared-core adoption is incremental and compatibility-driven; this repository does not silently rewrite production data.

The Languages Hub is not a replacement study app. It may aggregate privacy-minimal read models, surface product-owned next actions and control Hub visibility. It may not schedule reviews, recompute mastery/proficiency, write StudyEvents or create learning enrollment.

## P7 cross-repo consumer surface

The first externally consumable package boundary is versioned as @thiepn/languages and exports ./consumer-contract.

P7 is read-only: French and Japanese retain authority over their own content, learner state, scheduling, mastery, proficiency, orchestration and sync. Cross-repo compatibility drift is monitored separately from normal PR CI.

## P8 Hub read models

The P8 surface is exported as @thiepn/languages/read-model.

Each language app publishes a read-only projection containing workload, activity, labelled progress metrics, scoped proficiency evidence and its own next action. The Hub may aggregate simple counts and select among app-supplied priorities, but it never averages mastery/proficiency or converts framework bands.

## P9 authenticated dashboard persistence

The P9 surface is exported as @thiepn/languages/dashboard.

Account/Core owns authenticated cross-device persistence for the latest privacy-minimal language projections plus a separate Hub visibility registry. Account identity never appears inside the projection payload.

## P10 product-family shell

The P10 surface is exported as @thiepn/languages/shell and is also available as the THIEPN_LANGUAGE_SHELL browser global.

Run pnpm build:hub to produce dist/hub. The build contains a dependency-free responsive shell with:

- cross-language summary and authoritative Continue entry;
- French/Japanese cards with workload, streak, progress and scoped proficiency labels;
- shared navigation and direct product switching;
- show/hide controls that affect only Hub visibility;
- add-language routing without fabricating enrollment;
- loading, signed-out, error, stale and offline states;
- no demo learner-state fallback.

Production Account session injection and live deployment are intentionally deferred to P11 so the shell does not invent or duplicate the Account session contract.
