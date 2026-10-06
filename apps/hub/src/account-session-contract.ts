export const ACCOUNT_SUPABASE_URL = "https://hycegznamzjhwinegaai.supabase.co";
export const ACCOUNT_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_1rZzRPzfLMaAH5pIgCwIjA_19UPMIsR";
export const LANGUAGES_ORIGIN = "https://languages.thiepn.dev";
export const LANGUAGES_CALLBACK_PATH = "/auth/callback/";
export const LANGUAGES_CALLBACK_URL = `${LANGUAGES_ORIGIN}${LANGUAGES_CALLBACK_PATH}`;
export const LANGUAGES_ACCOUNT_URL = "https://account.thiepn.dev/";
export const LANGUAGES_ACCOUNT_ORIGIN = "https://account.thiepn.dev";
export const LANGUAGES_CORE_URL = "https://thiepn-core-gateway.thiepn.workers.dev";
export const LANGUAGES_SSO_STORAGE_KEY = "thiepn:languages-sso:v1";
export const LANGUAGES_OAUTH_CLIENT_ID = "00000000-0000-4000-8000-000000000000";

export type LanguagesIdentity =
  | { readonly status: "checking" }
  | { readonly status: "signed-out" }
  | { readonly status: "unavailable"; readonly code: string }
  | {
      readonly status: "signed-in";
      readonly id: string;
      readonly label: string;
    };

export type LanguagesSsoProbeResult =
  | "signed-in"
  | "disconnected"
  | "signed-out"
  | "unavailable";

interface ProbeMessage {
  type?: unknown;
  clientId?: unknown;
  signedIn?: unknown;
  eligible?: unknown;
}

export function interpretLanguagesSsoProbeMessage(
  value: unknown,
): LanguagesSsoProbeResult | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const row = value as ProbeMessage;
  if (
    row.type !== "thiepn:sso-probe:v1" ||
    row.clientId !== LANGUAGES_OAUTH_CLIENT_ID ||
    typeof row.signedIn !== "boolean" ||
    typeof row.eligible !== "boolean"
  ) return null;
  if (!row.signedIn) return "signed-out";
  return row.eligible ? "signed-in" : "disconnected";
}
