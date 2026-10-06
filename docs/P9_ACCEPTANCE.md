# P9 — Authenticated Read-Model Persistence, Hub Enrollment Registry & Live Cross-Device Language Dashboard

Status: **implementation complete; production Core Gateway activation pending**

## Objective

Persist each product-owned P8 projection behind THIEPN Account/Core so `languages.thiepn.dev` can show the same current French/Japanese summary on every signed-in device without importing either application's private learner database.

## Contract

- package: `@thiepn/languages@0.9.0`
- export: `@thiepn/languages/dashboard`
- browser export: `@thiepn/languages/dashboard/browser`
- dashboard contract: `p9-dashboard-v1`
- P8 projection remains `p8-read-model-v1`

## Identity and privacy

Account is the identity authority. Clients send a bearer token to Core; Core derives ownership from the verified session. Dashboard payloads contain no `accountId` or `userId`, and validation fails closed if either appears.

Core stores only the latest validated P8 projection per account/app/language. Raw StudyEvents, memory traces, answers, recordings, private notes, mined vocabulary/sentences and app database payloads remain excluded.

## Hub enrollment registry

The registry stores only `appId`, `languageId`, `visible`, `connectedAt` and `updatedAt`. This is Hub presentation state, not product learning enrollment. Hiding a card cannot pause a course, change mastery, reschedule reviews, alter proficiency or write learner evidence.

## Cross-device dashboard

`apps/hub/src/live-dashboard.ts` loads authenticated persisted state, applies Hub visibility, and passes visible P8 projections into the existing Hub data plane. P8 comparison and freshness rules remain unchanged.

## Required server behavior

- verify Account bearer identity;
- accept only valid P8 snapshots;
- bind storage ownership to verified identity;
- prevent an older `generatedAt` snapshot from overwriting a newer one;
- return current Hub visibility plus latest snapshots;
- keep this projection namespace separate from app-private learner databases.

## Integration record

- shared contract: `thiepn/languages@55d369f`
- Core persistence + authenticated routes: `thiepn/core@999c305`
- Japanese Account registry: `thiepn/account@7843035`
- French authenticated producer: `thiepn/french@488028f`
- Japanese Account-scoped producer: `thiepn/japanese@31e1425`

The Core `languages_dashboard_p9` migration is applied to the hosted THIEPN Core project. The Japanese Account registry migration is applied to THIEPN Account and the Account deployment completed successfully. French P9 CI passes and the GitHub Pages deployment completed successfully. Japanese P9 passed its full repository CI before merge.

The remaining production activation gate is the Core Worker. Main Core CI passes, but the normal `Deploy Gateway` workflow is intentionally skipped while `CORE_DEPLOY_ENABLED` is not enabled. The database contract is therefore live, while the public `/v1/languages/*` HTTP routes must not be claimed live until that reviewed deployment gate is enabled and the remote smoke checks pass.

## Exit criteria

1. dashboard package + JSON contract versioned and tested;
2. Core private languages namespace live; authenticated route code merged, with production Worker activation pending;
3. French publishes after authenticated reconciliation;
4. Japanese publishes once its Account session handoff is live;
5. Hub reads Core persistence, not app-private databases;
6. visibility and learning enrollment remain separate;
7. stale writes cannot replace newer projections;
8. privacy-minimal P8 boundary remains enforced;
9. cross-device load/publish tests pass; final production HTTP smoke remains gated on Core Worker activation.

## Next phase

**P10 — Shared Language Shell, Unified Navigation, Cross-Language Study Entry & Product-Family UX**

P10 turns the live P9 data plane into the polished `languages.thiepn.dev` shell: language cards, Continue entry, language switching, add-language/onboarding flow, responsive loading/error/offline states and shared navigation, while actual study remains inside each authoritative language product.
