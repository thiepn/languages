export const ACCOUNT_SUPABASE_URL = "https://hycegznamzjhwinegaai.supabase.co";
export const ACCOUNT_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_1rZzRPzfLMaAH5pIgCwIjA_19UPMIsR";
export const LANGUAGES_ORIGIN = "https://languages.thiepn.dev";
export const LANGUAGES_CALLBACK_PATH = "/auth/callback/";
export const LANGUAGES_CALLBACK_URL = `${LANGUAGES_ORIGIN}${LANGUAGES_CALLBACK_PATH}`;
export const LANGUAGES_ACCOUNT_ENTRY_URL = "https://account.thiepn.dev/languages/entry";
export const LANGUAGES_ACCOUNT_URL = "https://account.thiepn.dev/";
export const LANGUAGES_CORE_URL = "https://thiepn-core-gateway.thiepn.workers.dev";
export const LANGUAGES_AUTH_STORAGE_KEY = "thiepn:languages-auth:v1"; // Legacy Google bridge; no longer used by the P13 runtime.
export const LANGUAGES_FIRST_PARTY_CLIENT_ID = "c4522235-beb3-4f48-94fb-e274e92b7c84";
export const LANGUAGES_SSO_STORAGE_KEY = "thiepn:languages-sso:v1";
export const LANGUAGES_LOGIN_STORAGE_KEY = "thiepn:languages-login:v1";

export type LanguagesIdentity =
  | { readonly status: "checking" }
  | { readonly status: "signed-out" }
  | { readonly status: "unavailable"; readonly code: string }
  | {
      readonly status: "signed-in";
      readonly id: string;
      readonly label: string;
    };

export interface PendingLanguagesLogin {
  readonly started: number;
  readonly returnTo: "/";
}

export function validAccountId(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value,
    )
  );
}

export function readPendingLanguagesLogin(
  raw: string | null,
  now = Date.now(),
): PendingLanguagesLogin | null {
  try {
    if (!raw || raw.length > 1024) return null;
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value)) return null;
    const row = value as Record<string, unknown>;
    if (
      row.returnTo !== "/" ||
      !Number.isFinite(row.started) ||
      typeof row.started !== "number" ||
      now < row.started ||
      now - row.started > 10 * 60 * 1000
    ) return null;
    return { started: row.started, returnTo: "/" };
  } catch {
    return null;
  }
}

export function readLanguagesCallback(
  query: URLSearchParams,
  fragment: string,
): { readonly code: string } | null {
  if (
    fragment ||
    [...query.keys()].join(",") !== "code" ||
    query.getAll("code").length !== 1
  ) return null;
  const code = query.get("code");
  if (
    !code ||
    code.length > 2048 ||
    /[\s\x00-\x1f\x7f]/.test(code)
  ) return null;
  return { code };
}

export function buildAccountEntryUrl(authorizationUrl: string): string {
  const authorization = new URL(authorizationUrl);
  if (
    authorization.origin !== ACCOUNT_SUPABASE_URL ||
    authorization.pathname !== "/auth/v1/authorize" ||
    authorization.username ||
    authorization.password ||
    authorization.hash
  ) throw new Error("INVALID_AUTHORIZATION_URL");
  const entry = new URL(LANGUAGES_ACCOUNT_ENTRY_URL);
  entry.searchParams.set("request", authorization.href);
  return entry.href;
}
