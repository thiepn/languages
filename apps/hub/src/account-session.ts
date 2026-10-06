import {
  createThiepnAccountSession,
  type ThiepnIdentity,
} from "@thiepn/account-session";
import {
  ACCOUNT_SUPABASE_PUBLISHABLE_KEY,
  ACCOUNT_SUPABASE_URL,
  interpretLanguagesSsoProbeMessage,
  LANGUAGES_ACCOUNT_ORIGIN,
  LANGUAGES_ACCOUNT_URL,
  LANGUAGES_CALLBACK_PATH,
  LANGUAGES_CALLBACK_URL,
  LANGUAGES_CORE_URL,
  LANGUAGES_OAUTH_CLIENT_ID,
  LANGUAGES_SSO_STORAGE_KEY,
  type LanguagesIdentity,
  type LanguagesSsoProbeResult,
} from "./account-session-contract";

type Listener = (identity: LanguagesIdentity) => void;
const PROBE_TIMEOUT_MS = 2500;

export interface ProductionLanguagesAccountSession {
  readonly accountUrl: string;
  readonly coreBaseUrl: string;
  readonly callbackPath: string;
  identity(): LanguagesIdentity;
  initialize(): Promise<LanguagesIdentity>;
  verify(): Promise<LanguagesIdentity>;
  getAccessToken(): Promise<string | null>;
  signIn(): Promise<void>;
  switchAccount(): Promise<void>;
  signOut(): Promise<LanguagesIdentity>;
  subscribe(listener: Listener): () => void;
}

function mapIdentity(identity: ThiepnIdentity): LanguagesIdentity {
  if (identity.status === "signed-in") {
    return {
      status: "signed-in",
      id: identity.id,
      label: identity.email ?? "THIEPN member",
    };
  }
  if (identity.status === "unavailable") {
    return { status: "unavailable", code: identity.code };
  }
  return { status: "signed-out" };
}

export function createProductionLanguagesAccountSession(): ProductionLanguagesAccountSession {
  if (globalThis.location?.origin !== new URL(LANGUAGES_ORIGIN).origin) {
    throw new Error("LANGUAGES_PRODUCTION_ORIGIN_REQUIRED");
  }

  const account = createThiepnAccountSession({
    issuer: ACCOUNT_SUPABASE_URL,
    publishableKey: ACCOUNT_SUPABASE_PUBLISHABLE_KEY,
    clientId: LANGUAGES_OAUTH_CLIENT_ID,
    redirectUri: LANGUAGES_CALLBACK_URL,
    scopes: ["openid", "email", "profile", "offline_access"],
    storageKey: LANGUAGES_SSO_STORAGE_KEY,
    authPolicy: "required",
  });

  let current: LanguagesIdentity = { status: "checking" };
  let busy = false;
  const listeners = new Set<Listener>();

  const publish = (next: LanguagesIdentity) => {
    current = next;
    for (const listener of listeners) listener(next);
    return next;
  };

  account.subscribe(identity => {
    if (!busy || identity.status !== "signed-out") {
      publish(mapIdentity(identity));
    }
  });

  async function probeAccountSession(): Promise<LanguagesSsoProbeResult> {
    return await new Promise(resolve => {
      const iframe = globalThis.document.createElement("iframe");
      iframe.hidden = true;
      iframe.tabIndex = -1;
      iframe.setAttribute("aria-hidden", "true");
      iframe.setAttribute("sandbox", "allow-scripts allow-same-origin");
      iframe.referrerPolicy = "origin";
      iframe.src =
        `${LANGUAGES_ACCOUNT_ORIGIN}/sso/probe?client_id=${encodeURIComponent(LANGUAGES_OAUTH_CLIENT_ID)}`;

      let settled = false;
      const finish = (result: LanguagesSsoProbeResult) => {
        if (settled) return;
        settled = true;
        globalThis.clearTimeout(timer);
        globalThis.removeEventListener("message", onMessage);
        iframe.remove();
        resolve(result);
      };
      const onMessage = (event: MessageEvent) => {
        if (event.origin !== LANGUAGES_ACCOUNT_ORIGIN) return;
        if (event.source !== iframe.contentWindow) return;
        const result = interpretLanguagesSsoProbeMessage(event.data);
        if (result) finish(result);
      };
      const timer = globalThis.setTimeout(
        () => finish("unavailable"),
        PROBE_TIMEOUT_MS,
      );
      globalThis.addEventListener("message", onMessage);
      globalThis.document.body.append(iframe);
    });
  }

  async function beginAuthorization(): Promise<void> {
    if (busy) return;
    busy = true;
    publish({ status: "checking" });
    try {
      const url = await account.authorizationUrl();
      globalThis.location.assign(url);
    } catch {
      busy = false;
      publish({ status: "unavailable", code: "LOGIN_START_FAILED" });
      throw new Error("LOGIN_START_FAILED");
    }
  }

  async function verify(): Promise<LanguagesIdentity> {
    publish({ status: "checking" });
    const result = mapIdentity(await account.verify());
    return publish(result);
  }

  async function completeCallback(): Promise<LanguagesIdentity> {
    busy = true;
    publish({ status: "checking" });
    const result = mapIdentity(await account.completeCallback(globalThis.location));
    globalThis.history.replaceState(null, "", LANGUAGES_CALLBACK_PATH);
    busy = false;
    return publish(result);
  }

  async function initialize(): Promise<LanguagesIdentity> {
    if (globalThis.location.pathname === LANGUAGES_CALLBACK_PATH) {
      const result = await completeCallback();
      if (result.status === "signed-in") {
        globalThis.location.replace("/");
      }
      return result;
    }

    const verified = await verify();
    if (verified.status !== "signed-out") return verified;
    if (globalThis.navigator?.onLine === false) return verified;

    const probe = await probeAccountSession();
    if (probe === "signed-in") {
      await beginAuthorization();
      return current;
    }
    return verified;
  }

  async function signOut(): Promise<LanguagesIdentity> {
    if (busy) return current;
    busy = true;
    account.signOutLocal();
    busy = false;
    return publish({ status: "signed-out" });
  }

  globalThis.addEventListener("pageshow", event => {
    if (event.persisted && !busy) void verify();
  });
  globalThis.document.addEventListener("visibilitychange", () => {
    if (
      !globalThis.document.hidden &&
      !busy &&
      globalThis.navigator.onLine
    ) {
      void verify();
    }
  });

  return Object.freeze({
    accountUrl: LANGUAGES_ACCOUNT_URL,
    coreBaseUrl: LANGUAGES_CORE_URL,
    callbackPath: LANGUAGES_CALLBACK_PATH,
    identity: () => current,
    initialize,
    verify,
    getAccessToken: () => account.getAccessToken(),
    signIn: beginAuthorization,
    switchAccount: beginAuthorization,
    signOut,
    subscribe(listener: Listener) {
      listeners.add(listener);
      listener(current);
      return () => listeners.delete(listener);
    },
  });
}

const browserApi = Object.freeze({
  version: "0.12.0",
  contractVersion: "first-party-sso-v1",
  createProductionLanguagesAccountSession,
});

(globalThis as typeof globalThis & {
  THIEPN_LANGUAGES_ACCOUNT_SESSION?: typeof browserApi;
}).THIEPN_LANGUAGES_ACCOUNT_SESSION = browserApi;
