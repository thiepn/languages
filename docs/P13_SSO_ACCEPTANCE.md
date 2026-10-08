# P13 — Seamless First-Party Account SSO

## Invariant

THIEPN Languages does not call Google OAuth directly. It is an OAuth 2.1 public client of canonical THIEPN Account.

- Issuer: `https://hycegznamzjhwinegaai.supabase.co`.
- Client: `c4522235-beb3-4f48-94fb-e274e92b7c84`.
- Callback: `https://languages.thiepn.dev/auth/callback/`.
- Flow: Authorization Code + PKCE S256 + single-use state; OAuth access/refresh tokens remain only on the Languages origin.
- App-specific session namespace: `thiepn:languages-sso:v1`.
- Core Gateway continues to validate the access token and derive the canonical owner UUID; the Account browser does not receive Languages tokens.

## Entry behavior

1. On navigation, Languages remains in its checking state while verifying its existing app-local OAuth session.
2. If no app session exists and automatic attach has not been explicitly suppressed, a bounded, origin-checked iframe probe asks Account only if its current login is eligible for Languages.
3. An existing Account login can trigger authorization automatically. Account approves the registered basic-identity scope and redirects to Languages; Google is not shown again.
4. A signed-out Account, deliberate Account disconnect, unsupported third-party browser storage, or network outage does not cause a redirect loop. Languages shows the explicit **Continue with THIEPN Account** action.
5. That explicit action always goes to the OAuth authorization endpoint. Its top-level Account route can reuse an existing login even where embedded probing is unavailable.
6. Signing out of Languages clears only its own app credentials and suppresses automatic reconnect until the user explicitly signs in again.
7. Sensitive grants and cross-app data permissions remain separate. A successful login is not consent for cloud sync or unrelated products.

## Qualification

The production CI and live qualification must verify that Languages creates `/auth/v1/oauth/authorize` requests with exact registered client, callback, PKCE S256 and state, and no `provider=google` or account-picker prompt. Legacy `/languages/entry` remains compatibility-only, not the canonical session flow.

Automated checks cannot prove an authenticated Google account remains logged in through browser-specific storage restrictions. Manual tests must cover:

- Account login first, then Languages (same tab and different tab): no second Google prompt.
- Languages login first, then Account and Library: same Account owner UUID.
- Account A, app-session sign-out, reconnect, and explicit Account switch to B.
- A deliberately disconnected Languages app does not silently reconnect.
- Android Chrome, Samsung Internet, iOS Safari, private browsing, offline/resume, refresh-token rotation and two-tab concurrency.
- Browser policies that block the iframe: explicit top-level sign-in still works.

The release must not be described as universally invisible or as federated across unrelated browsers/devices; private sessions and blocked storage require interaction.
