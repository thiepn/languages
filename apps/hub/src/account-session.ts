import {createThiepnAccountSession, type ThiepnIdentity} from "@thiepn/account-session";
import {
  ACCOUNT_SUPABASE_PUBLISHABLE_KEY,
  ACCOUNT_SUPABASE_URL,
  LANGUAGES_ACCOUNT_URL,
  LANGUAGES_CALLBACK_PATH,
  LANGUAGES_CALLBACK_URL,
  LANGUAGES_CORE_URL,
  LANGUAGES_ORIGIN,
  LANGUAGES_FIRST_PARTY_CLIENT_ID,
  LANGUAGES_SSO_STORAGE_KEY,
  type LanguagesIdentity,
} from "./account-session-contract";

type Listener=(identity:LanguagesIdentity)=>void;
const ACCOUNT_ORIGIN="https://account.thiepn.dev";
const PROBE_TYPE="thiepn:sso-probe:v1";
const OPT_OUT_KEY="thiepn:languages-sso:manual-signout:v1";
const PROBE_INTERVAL_MS=30_000;

export interface ProductionLanguagesAccountSession {
  readonly accountUrl:string;
  readonly coreBaseUrl:string;
  readonly callbackPath:string;
  identity():LanguagesIdentity;
  initialize():Promise<LanguagesIdentity>;
  verify():Promise<LanguagesIdentity>;
  getAccessToken():Promise<string|null>;
  signIn():Promise<void>;
  switchAccount():Promise<void>;
  signOut():Promise<LanguagesIdentity>;
  subscribe(listener:Listener):()=>void;
}

export function eligibleLanguagesSsoProbe(value:unknown):boolean|null{
  if(!value||typeof value!=="object"||Array.isArray(value))return null;
  const message=value as Record<string,unknown>;
  if(message.type!==PROBE_TYPE||message.clientId!==LANGUAGES_FIRST_PARTY_CLIENT_ID||
    typeof message.signedIn!=="boolean"||typeof message.eligible!=="boolean")return null;
  return message.signedIn&&message.eligible;
}

/** The cross-origin probe never sends tokens or profile information. Browsers can
 * block embedded Account storage; when that happens, the explicit top-level
 * OAuth authorization still works. */
export function probeLanguagesAccountSession(timeoutMs=2500):Promise<boolean|null>{
  return new Promise(resolve=>{
    const iframe=document.createElement("iframe");
    iframe.hidden=true;
    iframe.tabIndex=-1;
    iframe.setAttribute("aria-hidden","true");
    iframe.setAttribute("sandbox","allow-scripts allow-same-origin");
    iframe.referrerPolicy="origin";
    iframe.src=`${ACCOUNT_ORIGIN}/sso/probe?client_id=${encodeURIComponent(LANGUAGES_FIRST_PARTY_CLIENT_ID)}`;
    let settled=false;
    const finish=(value:boolean|null)=>{
      if(settled)return;
      settled=true;
      clearTimeout(timer);
      globalThis.removeEventListener("message",handleMessage);
      iframe.remove();
      resolve(value);
    };
    const handleMessage=(event:MessageEvent)=>{
      if(event.origin!==ACCOUNT_ORIGIN||event.source!==iframe.contentWindow)return;
      const result=eligibleLanguagesSsoProbe(event.data);
      if(result!==null)finish(result);
    };
    const timer=globalThis.setTimeout(()=>finish(null),timeoutMs);
    globalThis.addEventListener("message",handleMessage);
    document.body.append(iframe);
  });
}

function toIdentity(value:ThiepnIdentity):LanguagesIdentity{
  if(value.status==="signed-in")return{
    status:"signed-in",
    id:value.id,
    label:value.email??"THIEPN member",
  };
  return value;
}

export function createProductionLanguagesAccountSession():ProductionLanguagesAccountSession{
  if(globalThis.location?.origin!==LANGUAGES_ORIGIN){
    throw new Error("LANGUAGES_PRODUCTION_ORIGIN_REQUIRED");
  }

  const oauth=createThiepnAccountSession({
    issuer:ACCOUNT_SUPABASE_URL,
    publishableKey:ACCOUNT_SUPABASE_PUBLISHABLE_KEY,
    clientId:LANGUAGES_FIRST_PARTY_CLIENT_ID,
    redirectUri:LANGUAGES_CALLBACK_URL,
    storageKey:LANGUAGES_SSO_STORAGE_KEY,
    scopes:["openid","email","profile","offline_access"],
    authPolicy:"guest-first",
  });

  let current:LanguagesIdentity={status:"checking"};
  let generation=0;
  let busy=false;
  let lastProbeAt=0;
  const listeners=new Set<Listener>();
  const publish=(next:LanguagesIdentity)=>{
    current=next;
    for(const listener of listeners)listener(next);
    return next;
  };
  const isOptedOut=()=>{
    try{return localStorage.getItem(OPT_OUT_KEY)==="1";}catch{return false;}
  };
  const suppressAutoSignIn=()=>{
    try{localStorage.setItem(OPT_OUT_KEY,"1");}catch{}
  };
  const clearAutoSignInSuppression=()=>{
    try{localStorage.removeItem(OPT_OUT_KEY);}catch{}
  };

  async function verify():Promise<LanguagesIdentity>{
    const epoch=++generation;
    publish({status:"checking"});
    const result=toIdentity(await oauth.verify());
    return epoch===generation?publish(result):current;
  }

  async function startAuthorization():Promise<void>{
    if(busy)return;
    busy=true;
    ++generation;
    publish({status:"checking"});
    try{
      // PKCE state/verifier never leaves the Languages origin. The only
      // cross-origin navigation is the standards-based OAuth authorization.
      const url=await oauth.authorizationUrl();
      globalThis.location.assign(url);
    }catch{
      busy=false;
      publish({status:"unavailable",code:"ACCOUNT_AUTHORIZATION_UNAVAILABLE"});
      throw new Error("ACCOUNT_AUTHORIZATION_UNAVAILABLE");
    }
  }

  async function initialize():Promise<LanguagesIdentity>{
    if(globalThis.location.pathname===LANGUAGES_CALLBACK_PATH){
      const result=publish(toIdentity(await oauth.completeCallback(globalThis.location)));
      globalThis.history.replaceState(null,"",LANGUAGES_CALLBACK_PATH);
      if(result.status==="signed-in"){
        clearAutoSignInSuppression();
        globalThis.location.replace("/");
      }
      return result;
    }

    if(busy)return current;
    const identity=await verify();
    if(identity.status!=="signed-out"||isOptedOut()||!navigator.onLine)return identity;
    if(Date.now()-lastProbeAt<PROBE_INTERVAL_MS)return identity;

    lastProbeAt=Date.now();
    const result=await probeLanguagesAccountSession();
    if(result===true){
      try{
        await startAuthorization();
        return current;
      }catch{return current;}
    }
    return identity;
  }

  const onResume=()=>{
    if(!busy&&navigator.onLine&&globalThis.location.pathname!==LANGUAGES_CALLBACK_PATH){
      void initialize().catch(()=>publish({status:"unavailable",code:"ACCOUNT_SESSION_UNAVAILABLE"}));
    }
  };
  globalThis.addEventListener("pageshow",event=>{if(event.persisted)onResume();});
  globalThis.addEventListener("focus",onResume);
  globalThis.addEventListener("online",onResume);
  globalThis.document.addEventListener("visibilitychange",()=>{
    if(!globalThis.document.hidden)onResume();
  });

  return Object.freeze({
    accountUrl:LANGUAGES_ACCOUNT_URL,
    coreBaseUrl:LANGUAGES_CORE_URL,
    callbackPath:LANGUAGES_CALLBACK_PATH,
    identity:()=>current,
    initialize,
    verify,
    getAccessToken:async()=>{
      if(current.status!=="signed-in")return null;
      try{
        return await oauth.getAccessToken();
      }catch{return null;}
    },
    signIn:async()=>{
      clearAutoSignInSuppression();
      await startAuthorization();
    },
    switchAccount:async()=>{
      // A local token clear cannot change the upstream Account identity.
      // Explicitly require a canonical Account sign-out before switching.
      oauth.signOutLocal();
      suppressAutoSignIn();
      publish({status:"signed-out"});
      globalThis.location.assign(`${ACCOUNT_ORIGIN}/security`);
    },
    signOut:async()=>{
      if(busy)return current;
      busy=true;
      ++generation;
      suppressAutoSignIn();
      const result=publish(toIdentity(oauth.signOutLocal()));
      busy=false;
      return result;
    },
    subscribe(listener:Listener){
      listeners.add(listener);
      listener(current);
      return()=>listeners.delete(listener);
    },
  });
}

const browserApi=Object.freeze({
  version:"0.13.0",
  contractVersion:"p13-first-party-oauth-sso-v1",
  createProductionLanguagesAccountSession,
});

(globalThis as typeof globalThis & {
  THIEPN_LANGUAGES_ACCOUNT_SESSION?:typeof browserApi;
}).THIEPN_LANGUAGES_ACCOUNT_SESSION=browserApi;
