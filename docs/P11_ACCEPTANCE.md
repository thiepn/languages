# P11 — Production Account Session Adapter, Live Deployment & Browser/Device Qualification

Status: **implementation complete; Core Gateway deployed successfully; production activation now blocked by Languages GitHub Pages setup and final Auth redirect/live-user evidence**

## Objective

Activate the P10 Languages shell on its canonical origin with a real THIEPN Account session and the production Core P9 dashboard API, without creating a cross-origin token bridge or a second identity authority.

## Production identity contract

Languages uses the existing THIEPN Account Supabase project as identity authority:

- issuer: `https://hycegznamzjhwinegaai.supabase.co`
- browser SDK: `@supabase/supabase-js@2.117.2`
- flow: PKCE
- provider: Google
- storage: Languages-origin local storage under `thiepn:languages-auth:v1`
- callback: `https://languages.thiepn.dev/auth/callback/`
- Account entry: `https://account.thiepn.dev/languages/entry`
- Core API: `https://thiepn-core-gateway.thiepn.workers.dev`

The Account repository owns the tokenless entry route. Account receives only the provider authorization URL. The PKCE verifier and all Languages access/refresh tokens remain on the Languages origin.

After callback, Languages exchanges the one-use code and verifies the resulting user with `auth.getUser()`. The browser bearer token is used only for the authenticated Core dashboard client; Core independently validates the token against Account before deriving the owner UUID.

Local Languages sign-out uses `signOut({scope:"local"})`; it does not claim to terminate Account or other product sessions.

## Callback hardening

A callback is accepted only when:

- query keys are exactly `code` and `flow`;
- there is no URL fragment;
- the code is non-empty, bounded and contains no control/whitespace characters;
- `flow` is exactly 64 lowercase hexadecimal characters;
- matching pending state exists in tab-local session storage;
- pending state is no older than 10 minutes;
- return target is exactly `/`.

Pending callback state is consumed before code exchange.

## Production build

`pnpm build:hub` now bundles the official Supabase browser client through Vite and emits:

- `dist/hub/index.html`
- `dist/hub/auth/callback/index.html`
- `dist/hub/vendor/account-session.js`
- existing P8/P9/P10 browser artifacts
- `dist/hub/hub-build.json`

The build rejects server-only credential markers during the production workflow.

## Deployment

`.github/workflows/deploy-pages.yml` is the production gate.

It requires GitHub Pages to be enabled with the exact custom domain:

- `languages.thiepn.dev`

The workflow refuses to deploy to a repository Pages URL or a different hostname because the production Account adapter is origin-pinned.

Before deployment, a separate dependency preflight now also requires:

- the deployed Account `release.json` to identify the real canonical Account release;
- live Core `/health`, `/ready` and `/version` endpoints;
- a successful CORS preflight for `https://languages.thiepn.dev`;
- the Languages dashboard route to reject a deliberately invalid bearer with 401/403 rather than being absent or publicly readable.

After deployment it verifies `release.json` against the exact release SHA.

## Live qualification

The post-deployment workflow performs fresh-context checks in Chromium, Firefox and WebKit plus a Chromium mobile viewport.

Automated live evidence covers:

1. canonical HTTPS shell returns 2xx;
2. fresh browser renders signed-out production state without runtime errors;
3. desktop has no horizontal overflow;
4. mobile 390×844 layout has no horizontal overflow and exposes the sign-in action;
5. Sign in produces the tokenless Account entry, pinned issuer, Google provider, S256 PKCE, account chooser, exact Languages callback and 256-bit flow nonce;
6. live Account accepts the generated Languages entry and renders Continue with Google;
7. Core `/v1/languages/dashboard` is reachable cross-origin and rejects an invalid bearer token with 401/403 rather than a CORS/network failure;
8. an already-loaded shell survives transition to offline mode;
9. the canonical callback route is a real 2xx page and rejects an unpaired callback into a recovery state.

## What automated qualification cannot prove

The repository workflow does not possess a real user's Google credentials or physical devices. Therefore these remain explicit manual acceptance items rather than fabricated evidence:

- successful Google consent/code exchange with the production user;
- Account A -> Languages, account switch A -> B, and cancellation behavior;
- authenticated French/Japanese P9 data on two independent physical devices;
- real Android/iOS browser lifecycle behavior outside browser-engine emulation;
- Supabase redirect allowlist acceptance for the exact callback if the provider configuration has not yet been changed.

## Current production evidence — 2026-10-06

Confirmed:

- Account `/languages/entry` is merged and the corresponding Account production deployment completed successfully.
- Languages P11 source CI passes on `main`.
- The exact P11 production build passes, including the bundled Account adapter and credential-leak gate.
- The Core `languages_dashboard_p9` database migration is applied and its three `gateway.languages_*` RPCs exist.

Still blocked:

- Core Gateway is deployed successfully at `https://thiepn-core-gateway.thiepn.workers.dev` and its production `/health`, `/ready` and `/version` smoke checks pass;
- the Languages deployment preflight receives GitHub Pages HTTP 404, meaning Pages is not yet enabled for `thiepn/languages`;
- the exact Supabase Auth redirect allowlist entry cannot be verified or changed through the connected Supabase tooling;
- real Google sign-in and physical-device acceptance cannot be certified before the public origin and Core API are live.

The scheduled consumer compatibility watch is also reporting French/Japanese repository drift while those products continue to evolve. That watch is intentionally strict and is not being weakened or auto-baselined during active consumer changes.

## Production prerequisites

P11 is live only when all are true:

1. Account PR containing `/languages/entry` is deployed;
2. Account Supabase Auth redirect allowlist includes exactly `https://languages.thiepn.dev/auth/callback/`;
3. THIEPN Core P9 migration and Gateway routes are deployed;
4. the deployed Core Worker endpoint `https://thiepn-core-gateway.thiepn.workers.dev` passes the production smoke and Languages CORS/auth preflight;
5. GitHub Pages is enabled for `thiepn/languages` with custom domain `languages.thiepn.dev`;
6. DNS for `languages.thiepn.dev` resolves to the Pages site;
7. the Deploy Languages workflow passes through live qualification.

## Next phase

**P12 — Authenticated Production Burn-In, Cross-Product Publish Verification & Defect-Only Hardening**

P12 should use a real signed-in test account to confirm French and Japanese publish fresh P8 projections into Core, verify cross-device visibility/Continue behavior over time, and fix only defects uncovered by production use.
