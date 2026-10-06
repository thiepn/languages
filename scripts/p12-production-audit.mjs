const LANGUAGES_ORIGIN = "https://languages.thiepn.dev";
const ACCOUNT_ORIGIN = "https://account.thiepn.dev";
const CORE_ORIGIN = "https://thiepn-core-gateway.thiepn.workers.dev";
const SUPABASE_ORIGIN = "https://hycegznamzjhwinegaai.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_1rZzRPzfLMaAH5pIgCwIjA_19UPMIsR";

const token = (process.env.THIEPN_P12_ACCESS_TOKEN ?? "").trim();
const expectedApps = (process.env.THIEPN_P12_EXPECT_APPS ?? "")
  .split(",")
  .map(value => value.trim())
  .filter(Boolean);
const maxAgeHours = Number(process.env.THIEPN_P12_MAX_AGE_HOURS ?? "24");
const visibilityApp = (process.env.THIEPN_P12_VISIBILITY_APP ?? "").trim();

function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

async function json(url, init = {}, accepted = [200]) {
  const response = await fetch(url, {
    redirect: "follow",
    ...init,
    signal: AbortSignal.timeout(12000),
  });
  let body = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }
  invariant(
    accepted.includes(response.status),
    `${url} returned HTTP ${response.status}`,
  );
  return { response, body };
}

async function dashboard(accessToken) {
  const { body } = await json(
    `${CORE_ORIGIN}/v1/languages/dashboard`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Origin: LANGUAGES_ORIGIN,
      },
    },
    [200],
  );
  invariant(body?.ok === true, "Core dashboard response is not successful");
  const data = body.data;
  invariant(data?.schema === "thiepn-language-dashboard", "Unexpected dashboard schema");
  invariant(data?.schemaVersion === 1, "Unexpected dashboard schemaVersion");
  invariant(data?.contractVersion === "p9-dashboard-v1", "Unexpected dashboard contract");
  invariant(Array.isArray(data.enrollments), "Dashboard enrollments missing");
  invariant(Array.isArray(data.snapshots), "Dashboard snapshots missing");
  return data;
}

function safeSnapshotSummary(row) {
  const generatedAt = row?.snapshot?.generatedAt ?? null;
  const ageMs = generatedAt ? Date.now() - Date.parse(generatedAt) : Number.POSITIVE_INFINITY;
  return {
    appId: row?.appId ?? null,
    languageId: row?.languageId ?? null,
    revision: row?.revision ?? null,
    generatedAt,
    storedAt: row?.storedAt ?? null,
    fresh: Number.isFinite(ageMs) && ageMs >= 0 && ageMs <= maxAgeHours * 60 * 60 * 1000,
  };
}

async function setVisibility(accessToken, appId, languageId, visible) {
  const { body } = await json(
    `${CORE_ORIGIN}/v1/languages/enrollments/${encodeURIComponent(appId)}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Origin: LANGUAGES_ORIGIN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ languageId, visible }),
    },
    [200],
  );
  invariant(body?.ok === true, "Visibility update failed");
  return body.data;
}

const evidence = {
  schema: "thiepn-languages-p12-production-audit",
  version: 1,
  checkedAt: new Date().toISOString(),
  public: {},
  authenticated: token ? { status: "running" } : { status: "skipped" },
};

const languagesRelease = await json(`${LANGUAGES_ORIGIN}/release.json`);
invariant(languagesRelease.body?.product === "THIEPN Languages", "Languages product marker mismatch");
invariant(languagesRelease.body?.canonicalOrigin === LANGUAGES_ORIGIN, "Languages canonical origin mismatch");
evidence.public.languages = {
  commit: languagesRelease.body.commit,
  version: languagesRelease.body.version,
};

const accountRelease = await json(`${ACCOUNT_ORIGIN}/release.json`);
invariant(accountRelease.body?.product === "THIEPN Account", "Account product marker mismatch");
invariant(accountRelease.body?.serviceMode === "real", "Account is not in real service mode");
invariant(accountRelease.body?.canonicalOrigin === ACCOUNT_ORIGIN, "Account canonical origin mismatch");
evidence.public.account = {
  commit: accountRelease.body.commit,
  version: accountRelease.body.version,
};

for (const endpoint of ["health", "ready", "version"]) {
  const result = await json(`${CORE_ORIGIN}/${endpoint}`);
  evidence.public[`core_${endpoint}`] = { ok: Boolean(result.body) };
}

const invalid = await json(
  `${CORE_ORIGIN}/v1/languages/dashboard`,
  {
    headers: {
      Authorization: "Bearer invalid-p12-audit",
      Origin: LANGUAGES_ORIGIN,
    },
  },
  [401, 403],
);
const allowOrigin = invalid.response.headers.get("access-control-allow-origin");
invariant(
  allowOrigin === LANGUAGES_ORIGIN,
  `Core CORS origin mismatch: ${allowOrigin ?? "missing"}`,
);
evidence.public.coreAuthBoundary = {
  invalidBearerStatus: invalid.response.status,
  allowOrigin,
};

if (token) {
  const verified = await json(
    `${SUPABASE_ORIGIN}/auth/v1/user`,
    {
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${token}`,
      },
    },
    [200],
  );
  invariant(Boolean(verified.body?.id), "Account bearer could not be verified");

  let data = await dashboard(token);
  const summaries = data.snapshots.map(safeSnapshotSummary);

  for (const appId of expectedApps) {
    const snapshot = summaries.find(row => row.appId === appId);
    invariant(snapshot, `Expected ${appId} snapshot is missing`);
    invariant(snapshot.fresh, `${appId} snapshot is older than ${maxAgeHours} hours`);
  }

  if (visibilityApp) {
    const enrollment = data.enrollments.find(row => row.appId === visibilityApp);
    invariant(enrollment, `Visibility enrollment missing for ${visibilityApp}`);
    const original = Boolean(enrollment.visible);
    const languageId = enrollment.languageId;
    let toggled = false;
    try {
      await setVisibility(token, visibilityApp, languageId, !original);
      toggled = true;
      data = await dashboard(token);
      invariant(
        data.enrollments.some(
          row =>
            row.appId === visibilityApp &&
            row.languageId === languageId &&
            row.visible === !original,
        ),
        "Visibility toggle did not persist",
      );
    } finally {
      if (toggled) {
        await setVisibility(token, visibilityApp, languageId, original);
        const restored = await dashboard(token);
        invariant(
          restored.enrollments.some(
            row =>
              row.appId === visibilityApp &&
              row.languageId === languageId &&
              row.visible === original,
          ),
          "Visibility state could not be restored",
        );
        data = restored;
      }
    }
  }

  evidence.authenticated = {
    status: "passed",
    accountVerified: true,
    expectedApps,
    maxAgeHours,
    snapshots: summaries,
    enrollments: data.enrollments.map(row => ({
      appId: row.appId,
      languageId: row.languageId,
      visible: row.visible,
    })),
    visibilityRoundTrip: visibilityApp || null,
  };
}

console.log(JSON.stringify(evidence, null, 2));
