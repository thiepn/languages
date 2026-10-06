import {describe,expect,it} from "vitest";
import {
  ACCOUNT_SUPABASE_URL,
  buildAccountEntryUrl,
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

  it("accepts only fresh pending-login state",()=>{
    const now=1_800_000;
    const raw=JSON.stringify({started:now-30_000,returnTo:"/"});
    expect(readPendingLanguagesLogin(raw,now)).toEqual({started:now-30_000,returnTo:"/"});
    expect(readPendingLanguagesLogin(raw,now+10*60*1000+1)).toBeNull();
    expect(readPendingLanguagesLogin(JSON.stringify({started:now-1,returnTo:"https://evil.test"}),now)).toBeNull();
  });

  it("accepts only an exact code callback with no fragment or extra fields",()=>{
    expect(readLanguagesCallback(new URLSearchParams({code:"one-use-code"}),"")).toEqual({code:"one-use-code"});
    expect(readLanguagesCallback(new URLSearchParams({code:"one-use-code",extra:"x"}),"")).toBeNull();
    expect(readLanguagesCallback(new URLSearchParams("code=one&code=two"),"")).toBeNull();
    expect(readLanguagesCallback(new URLSearchParams({code:"one-use-code"}),"#access_token=x")).toBeNull();
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
