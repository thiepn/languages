# P10 — Shared Language Shell, Unified Navigation, Cross-Language Study Entry & Product-Family UX

Status: **implemented in the shared repository; production host/session wiring is the next integration phase**

## Objective

Turn the P9 authenticated data plane into a usable languages.thiepn.dev product-family shell without creating a second language-learning application.

The Hub is a launcher, status surface and presentation layer. French and Japanese remain authoritative for study queues, course state, scheduling, mastery, proficiency and learner evidence.

## Product boundary

P10 may:

- render the latest privacy-minimal P8/P9 read models;
- surface the authoritative next action selected by the P8 Hub data plane;
- route into the owning language product;
- switch between visible language products;
- show/hide language cards through the P9 Hub visibility registry;
- route a not-yet-connected language to its owning product;
- show loading, signed-out, error, stale and offline states.

P10 may not:

- create or mutate learning enrollment;
- recompute a study queue;
- average mastery or proficiency;
- schedule reviews;
- write StudyEvents;
- duplicate French/Japanese content;
- invent sample progress when live data is unavailable.

## Implemented surface

- package: @thiepn/language-shell version 0.10.0
- contract: p10-shell-v1
- browser global: THIEPN_LANGUAGE_SHELL
- build command: pnpm build:hub
- static output: dist/hub
- default catalog: French and Japanese product routes
- Hub shell: summary, authoritative Continue hero, language cards, progress/proficiency labels, add/show flow, visibility actions, responsive navigation and resilient state rendering
- runtime host contract: THIEPN_LANGUAGES_CONFIG

## Runtime host contract

The static shell never reads tokens from storage directly. The host must inject a runtime object before app.js with these fields:

- coreBaseUrl
- getAccessToken
- signInUrl
- accountUrl

Account remains identity authority. Languages does not create a second session store.

## UX states

1. **loading** — skeleton shell, no fake learner data;
2. **signed-out** — sign-in CTA plus direct product links;
3. **ready** — cross-language summary, authoritative Continue hero and language cards;
4. **empty** — no visible cards; add/show language entry remains available;
5. **offline** — retain the last loaded projection in memory and label it offline;
6. **stale** — mark stale product projections and route the learner back to that product;
7. **error** — retry without mutating learning state.

## Exit criteria

1. shell contract is versioned and tested;
2. browser artifact uses the same contract as the module build;
3. no sample/demo learner data is used in runtime states;
4. Continue always resolves from product-owned nextAction/appRoute;
5. Hub visibility stays separate from learning enrollment;
6. hidden connected languages can be shown again through P9 visibility;
7. unknown/not-connected products are opened rather than enrolled by the Hub;
8. responsive shell includes loading/signed-out/error/offline/stale handling;
9. pnpm verify builds the deployable static Hub;
10. P8/P9 privacy and authority boundaries remain intact.

## Next phase

**P11 — Production Account Session Adapter, Live Deployment & Real-Device Qualification**

P11 wires the static shell to the actual THIEPN Account session contract, deploys languages.thiepn.dev, verifies Core CORS/auth behavior, then performs desktop/mobile/offline/device acceptance against real French and Japanese projections.
