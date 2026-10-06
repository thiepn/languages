# P12 — Authenticated Production Burn-In, Cross-Product Publish Verification & Defect-Only Hardening

Status: **active; public production burn-in automated, producer transport/auth defects identified and being corrected; authenticated cross-product evidence still required**

## Objective

P12 proves that the already-designed Languages architecture works with real production identity and real product-owned learner state.

This phase does **not** redesign scheduling, mastery, proficiency, orchestration, content ownership or enrollment. French and Japanese remain authoritative. Languages continues to consume only their privacy-minimal P8 projections.

The phase is complete only when the real production chain works:

```text
THIEPN Account
      ↓ authenticated browser session
French / Japanese
      ↓ product-owned P8 read model
THIEPN Core
      ↓ owner-scoped P9 persistence
Languages Hub
      ↓ read-only presentation / Continue / visibility
user on real browsers and devices
```

## P12 invariants

P12 must not:

- create a second Account or identity authority;
- store Account IDs inside P8 projection payloads;
- upload raw StudyEvents, answers, recordings, private notes or source documents to the Languages dashboard;
- recompute mastery, proficiency or next action in the Hub;
- treat Hub visibility as course enrollment;
- use stale snapshots as an authoritative Continue action;
- weaken producer compatibility checks merely to make burn-in pass;
- store a real user bearer token in GitHub Actions, repository secrets, logs or committed files.

## Burn-in baseline — 2026-10-06

The initial production audit found:

- Languages Pages is live on `https://languages.thiepn.dev`;
- the P11 deployment and browser qualification are green;
- Account is live on `https://account.thiepn.dev`;
- Core is live on `https://thiepn-core-gateway.thiepn.workers.dev`;
- Core CORS/auth boundaries are reachable from the Languages origin;
- the Core P9 tables exist, but there were **zero live dashboard snapshots and zero Hub enrollments** at P12 start;
- French still targeted the undeployed `https://api.thiepn.dev` hostname for P9 publication;
- Japanese still targeted the same undeployed Core hostname;
- Japanese still used a custom callback `?flow=...` query even though production Auth should use an exact allowlisted callback.

Those are production wiring defects, not reasons to redesign the platform.

## Producer corrections

P12 requires the following defect-only corrections:

### French

The French P9 publisher must target:

`https://thiepn-core-gateway.thiepn.workers.dev`

Publication remains gated by:

1. canonical THIEPN Account user present;
2. explicit **Sync this device** enablement;
3. successful French reconciliation;
4. the authoritative French P8 projection.

French remains the owner of learner state and synchronization.

### Japanese

The Japanese P9 publisher must target:

`https://thiepn-core-gateway.thiepn.workers.dev`

Japanese sign-in must use the exact callback:

`https://thiepn.dev/japanese/auth/callback/`

with no custom callback query parameters. A fresh tab-local pending-login marker plus the browser-held PKCE verifier provides the callback/session binding.

Japanese publication remains gated by:

1. verified Account identity;
2. Japanese connected to that Account;
3. the active local workspace matching the same canonical Account ID;
4. the authoritative Japanese P8 projection.

Japanese already republishes after connection/account activation and after completed study sessions; P12 does not introduce a second scheduling or event system.

## Public burn-in automation

`.github/workflows/p12-production-burn-in.yml` runs every six hours and on manual dispatch.

It executes:

`pnpm p12:audit`

without a user token and verifies:

- Languages canonical release metadata;
- Account canonical release metadata and real-service mode;
- Core `/health`, `/ready` and `/version`;
- Core Languages route rejects an invalid bearer;
- Core CORS still authorizes exactly `https://languages.thiepn.dev` for Hub reads;
- Core CORS authorizes authenticated POST preflights from `https://french.thiepn.dev` and `https://japanese.thiepn.dev` to their read-model publication routes.

This detects production infrastructure regressions after deployment.

## Authenticated audit

Authenticated burn-in is intentionally **not** stored in GitHub Actions.

A short-lived Account access token can be supplied locally:

```bash
THIEPN_P12_ACCESS_TOKEN="<short-lived token>" \
THIEPN_P12_EXPECT_APPS="french,japanese" \
THIEPN_P12_MAX_AGE_HOURS="24" \
pnpm p12:audit
```

The command never prints the token or Account ID.

When authenticated it verifies:

- the bearer resolves through canonical Account Auth;
- Core returns `p9-dashboard-v1`;
- dashboard arrays validate structurally;
- requested producer snapshots exist;
- expected snapshots are within the selected freshness window;
- only app/language IDs, revisions and timestamps appear in audit output.

An optional visibility persistence test is available:

```bash
THIEPN_P12_ACCESS_TOKEN="<short-lived token>" \
THIEPN_P12_EXPECT_APPS="french,japanese" \
THIEPN_P12_VISIBILITY_APP="french" \
pnpm p12:audit
```

It toggles the selected Hub visibility value, reloads the dashboard to prove persistence, and restores the original value before exiting.

## Required authenticated production evidence

P12 is not complete until all of the following are observed with a real account:

1. **Google sign-in** — Languages returns from Google with a valid Languages-origin session.
2. **French publication** — after explicit French sync/reconciliation, Core stores a fresh French P8 projection.
3. **Japanese publication** — after Japanese Account connection, Core stores a fresh Japanese P8 projection.
4. **Hub load** — Languages loads both real snapshots from Core without demo fallback.
5. **Continue authority** — Hub Continue routes to the product-supplied next action; the Hub does not invent one.
6. **Freshness safety** — deliberately stale/absent data does not become an authoritative Continue action.
7. **Visibility persistence** — hide/show persists through Core and survives reload.
8. **Local sign-out** — Languages local sign-out does not falsely claim to terminate Account/French/Japanese sessions.
9. **Account switching** — Account A data is never visible after switching to Account B.
10. **Cancellation/retry** — cancelling Google or abandoning a callback returns to a recoverable signed-out state.
11. **Long-session refresh** — an authenticated session survives normal token refresh without losing dashboard access.
12. **Cross-device** — the same Account can load the persisted dashboard from a second real browser/device.
13. **Physical mobile** — at least one real Android or iOS browser completes sign-in, dashboard load and Continue navigation.

## Cross-product verification method

Core persistence is the source of truth for the P12 publish check.

Expected steady-state rows:

- one latest `french / french` snapshot for the test Account;
- one latest `japanese / japanese` snapshot for the test Account;
- separate Hub enrollment rows controlling only visibility.

Revision may increase as a product republishes. A newer product snapshot may replace an older one; Core must reject conflicting same-timestamp payloads and must not let an older snapshot overwrite a newer one.

## Hub-side stale-action defect found during burn-in

The P12 code audit found that stale projections were already excluded from the top-level Continue hero, but a stale individual language card could still expose its old product-supplied next-action route and label.

The shell patch changes only presentation safety:

- fresh cards may use the product-supplied next action;
- stale cards show **Open language** and route only to the product root;
- the stale next-action route/label is never presented as authoritative;
- the Hub still does not recompute a replacement action.

This is covered by a shell regression test.

## Defect-only policy

During P12:

- fix concrete failures exposed by production evidence;
- add narrowly scoped regression tests for each defect;
- do not perform visual redesign;
- do not migrate product authority into Languages;
- do not introduce speculative features;
- do not reset French/Japanese compatibility baselines while their repository heads are actively moving unless the changed files have been reviewed and their native CI is green.

## Exit criteria

P12 passes only when:

- public burn-in remains green;
- French and Japanese producer fixes are deployed;
- both real producer snapshots exist and are fresh in Core;
- authenticated Languages reads those snapshots successfully;
- visibility round-trip succeeds and restores state;
- Account isolation/cancellation/sign-out behavior is verified;
- second-device and physical-mobile smoke tests pass;
- every discovered production defect has a regression test or explicit operational guard.

Only then should the next product-development phase begin.
