export const ACCOUNT_SUPABASE_URL = "https://hycegznamzjhwinegaai.supabase.co";
export const ACCOUNT_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_1rZzRPzfLMaAH5pIgCwIjA_19UPMIsR";
export const LANGUAGES_ORIGIN = "https://languages.thiepn.dev";
export const LANGUAGES_CALLBACK_PATH = "/auth/callback/";
export const LANGUAGES_CALLBACK_URL = `${LANGUAGES_ORIGIN}${LANGUAGES_CALLBACK_PATH}`;
export const LANGUAGES_ACCOUNT_ENTRY_URL = "https://account.thiepn.dev/languages/entry";
export const LANGUAGES_ACCOUNT_URL = "https://account.thiepn.dev/";
export const LANGUAGES_CORE_URL = "https://api.thiepn.dev";
export const LANGUAGES_AUTH_STORAGE_KEY = "thiepn:languages-auth:v1";
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
  readonly flow: string;
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

export function createFlowNonce(
  randomValues: Uint8Array = crypto.getRandomValues(new Uint8Array(32)),
): string {
  if (!(randomValues instanceof Uint8Array) || randomValues.length !== 32) {
    throw new Error("INVALID_FLOW_RANDOMNESS");
  }
  return Array.from(randomValues, byte => byte.toString(16).padStart(2, "0")).join("");
}

export function readPendingLanguagesLogin(
  raw: string | null,
  flow: string | null,
  now = Date.now(),
): PendingLanguagesLogin | null {
  try {
    if (
      !raw ||
      raw.length > 1024 ||
      !flow ||
      !/^[a-f0-9]{64}$/.test(flow)
    ) return null;
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value)) return null;
    const row = value as Record<string, unknown>;
    if (
      row.flow !== flow ||
      row.returnTo !== "/" ||
      !Number.isFinite(row.started) ||
      typeof row.started !== "number" ||
      now < row.started ||
      now - row.started > 10 * 60 * 1000
    ) return null;
    return { flow, started: row.started, returnTo: "/" };
  } catch {
    return null;
  }
}

export function readLanguagesCallback(
  query: URLSearchParams,
  fragment: string,
): { readonly code: string; readonly flow: string } | null {
  if (fragment || [...query.keys()].sort().join(",") !== "code,flow") return null;
  const code = query.get("code");
  const flow = query.get("flow");
  if (
    !code ||
    code.length > 2048 ||
    /[\s\x00-\x1f\x7f]/.test(code) ||
    !flow ||
    !/^[a-f0-9]{64}$/.test(flow)
  ) return null;
  return { code, flow };
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
