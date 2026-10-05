# P9 — Authenticated Read-Model Persistence, Hub Enrollment Registry & Live Cross-Device Language Dashboard

Status: **shared contract implemented; Core and producer wiring are the remaining integration gates**

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

## Exit criteria

1. dashboard package + JSON contract versioned and tested;
2. Core private languages namespace and authenticated routes live;
3. French publishes after authenticated reconciliation;
4. Japanese publishes once its Account session handoff is live;
5. Hub reads Core persistence, not app-private databases;
6. visibility and learning enrollment remain separate;
7. stale writes cannot replace newer projections;
8. privacy-minimal P8 boundary remains enforced;
9. cross-device load/publish tests pass.

## Next phase

**P10 — Shared Language Shell, Unified Navigation, Cross-Language Study Entry & Product-Family UX**

P10 turns the live P9 data plane into the polished `languages.thiepn.dev` shell: language cards, Continue entry, language switching, add-language/onboarding flow, responsive loading/error/offline states and shared navigation, while actual study remains inside each authoritative language product.
