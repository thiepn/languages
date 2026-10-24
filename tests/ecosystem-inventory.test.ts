import {describe,expect,it} from "vitest";
import {execFileSync} from "node:child_process";
import {fileURLToPath} from "node:url";
import {inspectChineseEcosystemPreflight} from "../languages/chinese/preflight.js";

describe("E0 multi-repository inventory and Chinese P8 preparation",()=>{
 it("has a runnable offline source-inventory self-test",()=>{
  const path=fileURLToPath(new URL("../scripts/ecosystem-inventory.mjs",import.meta.url));
  const output=JSON.parse(execFileSync(process.execPath,[path,"--self-test"],{encoding:"utf8"}));
  expect(output.status).toBe("PASS");
 });
 it("holds Chinese publication even with complete verified local demonstration coverage",()=>{
  const r=inspectChineseEcosystemPreflight({
   lessonCount:428,pathwayMissionCount:36,ungradedTransferCount:36,
   demonstrationQualified:true,historicalIdsPreserved:true
  });
  expect(r.publishAllowed).toBe(false);
  expect(r.officialHskClaim).toBe(false);
  expect(r.issues).toContain("ACCOUNT_AUTHORIZATION_NOT_INTEGRATED");
  expect(r.issues).toContain("CHINESE_OWNER_SCOPED_P8_PRODUCER_NOT_VERIFIED");
 });
 it("rejects source drift and unsupported count claims",()=>{
  const r=inspectChineseEcosystemPreflight({
   lessonCount:428,pathwayMissionCount:36,ungradedTransferCount:99,
   demonstrationQualified:false,historicalIdsPreserved:false
  });
  expect(r.issues).toContain("HISTORICAL_LESSON_ID_DRIFT");
  expect(r.issues).toContain("UNQUALIFIED_ORIGINAL_DEMO_SOURCE");
  expect(r.issues).toContain("UNSCORED_TRANSFER_EXCEEDS_SOURCE_MISSIONS");
 });
});
