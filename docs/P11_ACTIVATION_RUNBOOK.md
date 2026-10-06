# P11 Production Activation Runbook

This is the one-time production activation sequence for THIEPN Languages.

Do the steps in order. Do not weaken the repository gates to make a deployment appear green.

## 1. Activate the existing Core Gateway

Repository: `thiepn/core`

The P9 database migration is already applied. The missing production component is the public Worker/Gateway.

In GitHub:

1. Open **Settings → Environments → production**.
2. Confirm the existing Gateway deployment secrets are configured:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Under **Settings → Secrets and variables → Actions → Variables**, set:
   - `CORE_DEPLOY_ENABLED=true`
   - `CORE_GATEWAY_URL=https://thiepn-core-gateway.thiepn.workers.dev`
4. Run **Actions → Deploy Gateway → Run workflow** from `main`.
5. Require the workflow's remote `/health`, `/ready` and `/version` smoke checks to pass.

Do not put any server-only secret into the Languages repository or browser bundle.

## 2. Confirm the deployed Core Worker

The Core Worker must serve:

- `https://thiepn-core-gateway.thiepn.workers.dev/health`
- `https://thiepn-core-gateway.thiepn.workers.dev/ready`
- `https://thiepn-core-gateway.thiepn.workers.dev/version`
- `https://thiepn-core-gateway.thiepn.workers.dev/v1/languages/dashboard`

The dashboard route must require an Account bearer token and its CORS policy must allow exactly the reviewed browser origins, including `https://languages.thiepn.dev`.

A future `api.thiepn.dev` custom domain is optional infrastructure polish and is not a P11 activation dependency.

## 3. Configure the Account Auth callback

Project: **THIEPN Account** (`hycegznamzjhwinegaai`)

In Supabase Auth URL/redirect configuration, add the exact production callback:

`https://languages.thiepn.dev/auth/callback/`

Do not replace this with a broad wildcard.

The public publishable key remains browser-safe; never copy a secret/service-role key into Languages.

## 4. Enable GitHub Pages for Languages

Repository: `thiepn/languages`

In **Settings → Pages**:

1. Set **Build and deployment → Source → GitHub Actions**.
2. Set **Custom domain** to:
   - `languages.thiepn.dev`
3. Complete the DNS verification GitHub requests.
4. Enable HTTPS once GitHub makes the option available.

The P11 workflow intentionally refuses the default `github.io` repository URL.

## 5. Run the Languages production workflow

Run:

**Actions → Deploy Languages → Run workflow**

Expected gate order:

1. Pages preflight
2. Account/Core dependency preflight
3. exact production build
4. Pages deployment
5. deployed SHA verification
6. Chromium/Firefox/WebKit live qualification
7. 390×844 mobile qualification
8. Account tokenless-entry/PKCE contract check
9. Core CORS + invalid-bearer check
10. exact PKCE callback recovery and offline-shell checks

Any failure is a failed P11 activation. Do not mark the phase complete by skipping a gate.

## 6. Manual signed-in acceptance

After the automated workflow is green, use a real test account.

Verify:

- fresh signed-out Languages → Account → Google → Languages callback;
- authenticated dashboard load;
- French publishes a fresh P8/P9 projection;
- Japanese publishes a fresh P8/P9 projection;
- visibility changes survive reload;
- Languages local sign-out does not falsely claim to sign out Account or other apps;
- account switch A → B does not expose A's dashboard;
- cancellation/retry returns to a recoverable state;
- second real device sees the same persisted Hub projection.

Record physical Android/iOS checks separately. Browser emulation is not physical-device evidence.

## 7. P11 completion rule

P11 is complete only when:

- Core Gateway production deployment is green;
- Account callback allowlist is confirmed;
- Languages Pages/custom-domain deployment is green;
- the full automated live qualification is green;
- a real signed-in cross-device smoke has been performed.

Only then begin P12 production burn-in.
