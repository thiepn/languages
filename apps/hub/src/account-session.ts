import { createClient } from "@supabase/supabase-js";
import {
  ACCOUNT_SUPABASE_PUBLISHABLE_KEY,
  ACCOUNT_SUPABASE_URL,
  buildAccountEntryUrl,
  LANGUAGES_ACCOUNT_URL,
  LANGUAGES_AUTH_STORAGE_KEY,
  LANGUAGES_CALLBACK_PATH,
  LANGUAGES_CALLBACK_URL,
  LANGUAGES_CORE_URL,
  LANGUAGES_LOGIN_STORAGE_KEY,
  LANGUAGES_ORIGIN,
  readLanguagesCallback,
  readPendingLanguagesLogin,
  validAccountId,
  type LanguagesIdentity,
} from "./account-session-contract";

type Listener = (identity: LanguagesIdentity) => void;

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

export function createProductionLanguagesAccountSession(): ProductionLanguagesAccountSession {
  if (globalThis.location?.origin !== LANGUAGES_ORIGIN) {
    throw new Error("LANGUAGES_PRODUCTION_ORIGIN_REQUIRED");
  }

  const client = createClient(
    ACCOUNT_SUPABASE_URL,
    ACCOUNT_SUPABASE_PUBLISHABLE_KEY,
    {
      global: {
        fetch: async (input, init) => {
          const signals = init?.signal ? [init.signal] : [];
          return fetch(input, {
            ...init,
            signal: AbortSignal.any([...signals, AbortSignal.timeout(8000)]),
          });
        },
      },
      auth: {
        storageKey: LANGUAGES_AUTH_STORAGE_KEY,
        flowType: "pkce",
        detectSessionInUrl: false,
        persistSession: true,
        autoRefreshToken: true,
      },
    },
  );

  let current: LanguagesIdentity = { status: "checking" };
  let generation = 0;
  let busy = false;
  const listeners = new Set<Listener>();

  const publish = (next: LanguagesIdentity) => {
    current = next;
    for (const listener of listeners) listener(next);
    return next;
  };

  const unavailable = (code: string) =>
    publish({ status: "unavailable", code });

  async function verify(): Promise<LanguagesIdentity> {
    const epoch = ++generation;
    publish({ status: "checking" });
    try {
      const { data: sessionData, error: sessionError } =
        await client.auth.getSession();
      if (sessionError) throw sessionError;
      const session = sessionData.session;
      if (!session) {
        if (epoch === generation) return publish({ status: "signed-out" });
        return current;
      }

      const { data: userData, error: userError } = await client.auth.getUser();
      if (epoch !== generation) return current;
      if (
        userError ||
        !userData.user ||
        !validAccountId(userData.user.id) ||
        userData.user.id !== session.user.id
      ) {
        return unavailable("ACCOUNT_IDENTITY_UNVERIFIED");
      }

      return publish({
        status: "signed-in",
        id: userData.user.id,
        label: userData.user.email ?? "THIEPN member",
      });
    } catch {
      if (epoch !== generation) return current;
      return unavailable("ACCOUNT_SESSION_UNAVAILABLE");
    }
  }

  async function completeCallback(): Promise<LanguagesIdentity> {
    const query = new URLSearchParams(globalThis.location.search);
    const fragment = globalThis.location.hash;
    const callback = readLanguagesCallback(query, fragment);

    globalThis.history.replaceState(null, "", LANGUAGES_CALLBACK_PATH);

    let pending = null;
    try {
      pending = readPendingLanguagesLogin(
        globalThis.sessionStorage.getItem(LANGUAGES_LOGIN_STORAGE_KEY),
      );
      globalThis.sessionStorage.removeItem(LANGUAGES_LOGIN_STORAGE_KEY);
    } catch {
      return unavailable("LOGIN_STORAGE_UNAVAILABLE");
    }

    if (!pending || !callback) {
      return unavailable("LOGIN_CALLBACK_INVALID");
    }

    busy = true;
    publish({ status: "checking" });
    try {
      const { error } = await client.auth.exchangeCodeForSession(callback.code);
      if (error) throw error;
      busy = false;
      return await verify();
    } catch {
      busy = false;
      return unavailable("LOGIN_CODE_EXCHANGE_FAILED");
    }
  }

  async function beginSignIn(switching: boolean): Promise<void> {
    if (busy) return;
    busy = true;
    ++generation;
    publish({ status: "checking" });

    try {
      globalThis.localStorage.setItem(`${LANGUAGES_AUTH_STORAGE_KEY}:probe`, "1");
      globalThis.localStorage.removeItem(`${LANGUAGES_AUTH_STORAGE_KEY}:probe`);

      if (switching) {
        const { error } = await client.auth.signOut({ scope: "local" });
        if (error) throw error;
      }

      globalThis.sessionStorage.setItem(
        LANGUAGES_LOGIN_STORAGE_KEY,
        JSON.stringify({ started: Date.now(), returnTo: "/" }),
      );

      const { data, error } = await client.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: LANGUAGES_CALLBACK_URL,
          skipBrowserRedirect: true,
          queryParams: { prompt: "select_account" },
        },
      });
      if (error || !data.url) throw new Error("LOGIN_START_FAILED");

      globalThis.location.assign(buildAccountEntryUrl(data.url));
    } catch {
      busy = false;
      unavailable("LOGIN_START_FAILED");
      throw new Error("LOGIN_START_FAILED");
    }
  }

  async function signOut(): Promise<LanguagesIdentity> {
    if (busy) return current;
    busy = true;
    ++generation;
    publish({ status: "checking" });
    try {
      const { error } = await client.auth.signOut({ scope: "local" });
      if (error) throw error;
      busy = false;
      return publish({ status: "signed-out" });
    } catch {
      busy = false;
      return unavailable("LOCAL_SIGN_OUT_FAILED");
    }
  }

  async function getAccessToken(): Promise<string | null> {
    if (current.status !== "signed-in") return null;
    try {
      const { data, error } = await client.auth.getSession();
      if (
        error ||
        !data.session ||
        data.session.user.id !== current.id ||
        !data.session.access_token
      ) {
        publish({ status: "signed-out" });
        return null;
      }
      return data.session.access_token;
    } catch {
      return null;
    }
  }

  async function initialize(): Promise<LanguagesIdentity> {
    if (globalThis.location.pathname === LANGUAGES_CALLBACK_PATH) {
      const result = await completeCallback();
      if (result.status === "signed-in") {
        globalThis.location.replace("/");
      }
      return result;
    }
    return verify();
  }

  client.auth.onAuthStateChange(event => {
    if (event === "INITIAL_SESSION" || busy) return;
    queueMicrotask(() => {
      if (!busy && globalThis.location.pathname !== LANGUAGES_CALLBACK_PATH) {
        void verify();
      }
    });
  });

  globalThis.addEventListener("pageshow", event => {
    if (event.persisted && !busy) void verify();
  });
  globalThis.document.addEventListener("visibilitychange", () => {
    if (!globalThis.document.hidden && !busy && globalThis.navigator.onLine) {
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
    getAccessToken,
    signIn: () => beginSignIn(false),
    switchAccount: () => beginSignIn(true),
    signOut,
    subscribe(listener: Listener) {
      listeners.add(listener);
      listener(current);
      return () => listeners.delete(listener);
    },
  });
}

const browserApi = Object.freeze({
  version: "0.11.0",
  contractVersion: "p11-account-session-v1",
  createProductionLanguagesAccountSession,
});

(globalThis as typeof globalThis & {
  THIEPN_LANGUAGES_ACCOUNT_SESSION?: typeof browserApi;
}).THIEPN_LANGUAGES_ACCOUNT_SESSION = browserApi;
