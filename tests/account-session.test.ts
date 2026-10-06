import {describe,expect,it} from "vitest";
import {
  ACCOUNT_SUPABASE_URL,
  interpretLanguagesSsoProbeMessage,
  LANGUAGES_ACCOUNT_ORIGIN,
  LANGUAGES_CALLBACK_URL,
  LANGUAGES_OAUTH_CLIENT_ID,
} from "../apps/hub/src/account-session-contract";

describe("THIEPN Account first-party SSO boundary",()=>{
  it("pins a real public Languages OAuth client before release",()=>{
    expect(LANGUAGES_OAUTH_CLIENT_ID).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    expect(LANGUAGES_OAUTH_CLIENT_ID).not.toBe(
      "00000000-0000-4000-8000-000000000000",
    );
    expect(ACCOUNT_SUPABASE_URL).toBe(
      "https://hycegznamzjhwinegaai.supabase.co",
    );
    expect(LANGUAGES_CALLBACK_URL).toBe(
      "https://languages.thiepn.dev/auth/callback/",
    );
  });

  it("accepts only the exact Account probe response for Languages",()=>{
    expect(interpretLanguagesSsoProbeMessage({
      type:"thiepn:sso-probe:v1",
      clientId:LANGUAGES_OAUTH_CLIENT_ID,
      signedIn:true,
      eligible:true,
    })).toBe("signed-in");
    expect(interpretLanguagesSsoProbeMessage({
      type:"thiepn:sso-probe:v1",
      clientId:LANGUAGES_OAUTH_CLIENT_ID,
      signedIn:true,
      eligible:false,
    })).toBe("disconnected");
    expect(interpretLanguagesSsoProbeMessage({
      type:"thiepn:sso-probe:v1",
      clientId:LANGUAGES_OAUTH_CLIENT_ID,
      signedIn:false,
      eligible:true,
    })).toBe("signed-out");
    expect(interpretLanguagesSsoProbeMessage({
      type:"thiepn:sso-probe:v1",
      clientId:"11111111-1111-4111-8111-111111111111",
      signedIn:true,
      eligible:true,
    })).toBeNull();
    expect(LANGUAGES_ACCOUNT_ORIGIN).toBe("https://account.thiepn.dev");
  });

  it("contains no direct Google provider login in the production adapter",async()=>{
    const source=await import("node:fs/promises").then(fs=>
      fs.readFile("apps/hub/src/account-session.ts","utf8"),
    );
    expect(source).not.toContain('provider: "google"');
    expect(source).not.toContain("signInWithOAuth");
    expect(source).not.toContain("/languages/entry");
    expect(source).toContain("createThiepnAccountSession");
    expect(source).toContain("/sso/probe?client_id=");
  });
});
