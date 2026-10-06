import {describe,expect,it} from "vitest";
import {
  ACCOUNT_SUPABASE_URL,
  buildAccountEntryUrl,
  createFlowNonce,
  LANGUAGES_ACCOUNT_ENTRY_URL,
  readLanguagesCallback,
  readPendingLanguagesLogin,
  validAccountId
} from "../apps/hub/src/account-session-contract";

describe("P11 Account session boundary",()=>{
  it("validates canonical Account UUIDs",()=>{
    expect(validAccountId("123e4567-e89b-42d3-a456-426614174000")).toBe(true);
    expect(validAccountId("not-a-user")).toBe(false);
  });

  it("creates exactly 256-bit hexadecimal flow nonces",()=>{
    const bytes=new Uint8Array(32);
    bytes[0]=0x0f;
    bytes[31]=0xff;
    const flow=createFlowNonce(bytes);
    expect(flow).toHaveLength(64);
    expect(flow.startsWith("0f")).toBe(true);
    expect(flow.endsWith("ff")).toBe(true);
    expect(()=>createFlowNonce(new Uint8Array(31))).toThrow("INVALID_FLOW_RANDOMNESS");
  });

  it("accepts only fresh matching pending-login state",()=>{
    const now=1_800_000;
    const flow="a".repeat(64);
    const raw=JSON.stringify({flow,started:now-30_000,returnTo:"/"});
    expect(readPendingLanguagesLogin(raw,flow,now)).toEqual({flow,started:now-30_000,returnTo:"/"});
    expect(readPendingLanguagesLogin(raw,"b".repeat(64),now)).toBeNull();
    expect(readPendingLanguagesLogin(raw,flow,now+10*60*1000+1)).toBeNull();
    expect(readPendingLanguagesLogin(JSON.stringify({flow,started:now-1,returnTo:"https://evil.test"}),flow,now)).toBeNull();
  });

  it("accepts only an exact code+flow callback with no fragment",()=>{
    const flow="c".repeat(64);
    expect(readLanguagesCallback(new URLSearchParams({code:"one-use-code",flow}),"")).toEqual({code:"one-use-code",flow});
    expect(readLanguagesCallback(new URLSearchParams({code:"one-use-code",flow,extra:"x"}),"")).toBeNull();
    expect(readLanguagesCallback(new URLSearchParams({code:"one-use-code",flow}),"#access_token=x")).toBeNull();
  });

  it("wraps only the pinned Account authorization endpoint in the tokenless Account entry",()=>{
    const authorize=new URL("/auth/v1/authorize",ACCOUNT_SUPABASE_URL);
    authorize.searchParams.set("provider","google");
    const entry=new URL(buildAccountEntryUrl(authorize.href));
    expect(entry.origin+entry.pathname).toBe(LANGUAGES_ACCOUNT_ENTRY_URL);
    expect(entry.searchParams.get("request")).toBe(authorize.href);
    expect(()=>buildAccountEntryUrl("https://evil.test/auth/v1/authorize")).toThrow("INVALID_AUTHORIZATION_URL");
  });
});
