#!/usr/bin/env node
/**
 * Phase 01 immutable ownership/source manifest validation.
 * Purely read-only. Does not contact GitHub, inspect personal data,
 * run a deployment, install dependencies, or mutate any application.
 *
 * node scripts/check-phase01-architecture.mjs --check
 * node scripts/check-phase01-architecture.mjs --self-test
 */
import {readFileSync, existsSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {dirname, resolve, join, sep} from "node:path";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const input=resolve(root,"contracts/phase01-source-ownership.json");
const SUPPORTED=["thiepn/languages","thiepn/french","thiepn/japanese","thiepn/chinese"];
const VALID_DECISIONS=new Set(["reuse","adapt","migrate","preserve","replace-after-parity"]);
const VALID_MODES=new Set(["legacy-authoritative","platform-contract"]);
const VALID_INTENTS=new Set(["reuse","adapt","migrate","replace"]);
const SHA=/^[a-f0-9]{40}$/;
const safePath=(p)=>typeof p==="string"&&p.length>0&&!p.startsWith("/")&&!p.includes("\\")&&!p.split("/").some(s=>s==="."||s===".."||!s);
const fail=(why)=>{throw new Error("PHASE01_OWNERSHIP_INVALID: "+why);};
const unique=(list)=>new Set(list).size===list.length;
const read=()=>JSON.parse(readFileSync(input,"utf8"));

export function validateOwnership(doc,{checkLocal=true}={}){
 if(!doc||doc.schema!=="thiepn.languages.phase01.ownership-inventory"||doc.schemaVersion!==1)fail("schema/version");
 if(doc.primaryRepository!=="thiepn/languages")fail("primary authority");
 if(doc.snapshotDate!=="2026-10-22"||typeof doc.scope!=="string")fail("snapshot metadata");
 if(!Array.isArray(doc.sources)||doc.sources.length!==4||!unique(doc.sources.map(x=>x.repo)))fail("four source repositories");
 if(!SUPPORTED.every(repo=>doc.sources.some(s=>s.repo===repo&&SHA.test(s.mainSha)&&s.snapshotKind==="immutable-ref")))fail("repository SHA snapshot");
 const byRepo=new Map(doc.sources.map(x=>[x.repo,x.mainSha]));
 if(!doc.currentAuthority||!SUPPORTED.every(repo=>typeof doc.currentAuthority[repo]==="string"&&doc.currentAuthority[repo].length>10))fail("legacy authority declarations");
 const future=doc.futureAuthorities;
 if(!future||!["learnerApp","courseAuthoring","lessonRuntime","exerciseRuntime","learnerEvidence","memoryScheduling"].every(k=>future[k]==="thiepn/languages"))fail("single future learning authority");
 if(!/read-only/.test(future.hub??""))fail("Hub write boundary");
 if(!Array.isArray(doc.openBranches)||doc.openBranches.length<8)fail("source branch inventory");
 if(!unique(doc.openBranches.map(x=>x.repo+"#"+x.pr)))fail("duplicate PR records");
 const branchRefs=new Map(SUPPORTED.map(repo=>[repo,new Set([byRepo.get(repo)])]));
 for(const pr of doc.openBranches){
  if(!SUPPORTED.includes(pr.repo)||!Number.isSafeInteger(pr.pr)||pr.pr<1||!SHA.test(pr.head))fail("invalid PR source");
  if(!["open","draft"].includes(pr.state)||typeof pr.classification!=="string"||typeof pr.note!=="string")fail("PR state");
  branchRefs.get(pr.repo).add(pr.head);
 }
 for(const [repo,pr] of [["thiepn/languages",27],["thiepn/languages",29],["thiepn/french",79],["thiepn/japanese",103],["thiepn/chinese",91],["thiepn/chinese",93]]){
  if(!doc.openBranches.some(x=>x.repo===repo&&x.pr===pr))fail("missing critical PR "+repo+"#"+pr);
 }
 if(!Array.isArray(doc.capabilities)||doc.capabilities.length<9||!unique(doc.capabilities.map(x=>x.id)))fail("capability count/IDs");
 for(const cap of doc.capabilities){
  if(typeof cap.id!=="string"||!cap.id||cap.futureOwner!=="thiepn/languages"||
     !VALID_MODES.has(cap.currentMode)||!VALID_INTENTS.has(cap.migrationIntent)||!safePath(cap.targetPath))fail("ownership of "+cap.id);
  if(!Array.isArray(cap.sources)||!cap.sources.length)fail("empty source list "+cap.id);
  for(const src of cap.sources){
   if(!SUPPORTED.includes(src.repo)||!safePath(src.path)||!SHA.test(src.ref)||!VALID_DECISIONS.has(src.decision)||
      typeof src.detail!=="string"||!branchRefs.get(src.repo).has(src.ref))fail("untraceable capability source "+cap.id);
   if(src.repo==="thiepn/languages"&&src.ref===byRepo.get(src.repo)&&checkLocal&&!existsSync(join(root,src.path)))fail("missing platform path "+src.path);
  }
 }
 if(!doc.preservation||doc.preservation.length<8||doc.preservation.some(v=>typeof v!=="string"||v.length<25))fail("preservation rules");
 const preserve=doc.preservation.join(" ").toLowerCase();
 for(const token of ["learner","rights","study","hub","source","production","private","migration"]){
  if(!preserve.includes(token))fail("missing preservation topic "+token);
 }
 if(!doc.phase02Handoff||!doc.phase02Handoff.requiredInputs?.length||!doc.phase02Handoff.blockedUntil?.length)fail("Phase 02 handoff");
 const protectedPaths=["AGENTS.md","docs/ARCHITECTURE.md","packages/content-schema/src/index.ts","packages/adapter-sdk/src/index.ts","packages/scheduler/src/index.ts"];
 if(checkLocal&&!protectedPaths.every(p=>safePath(p)&&existsSync(join(root,p))))fail("shared foundation is unavailable");
 return {schema:doc.schema,status:"PASS",sources:doc.sources.length,capabilities:doc.capabilities.length,openBranches:doc.openBranches.length,mode:"offline-snapshot-only"};
}
function expectRejected(doc,mutate){
 const changed=structuredClone(doc);mutate(changed);
 try{validateOwnership(changed,{checkLocal:false});}catch(e){
  if(String(e).includes("PHASE01_OWNERSHIP_INVALID"))return;
  throw e;
 }
 throw new Error("PHASE01_SELF_TEST_FAILED: unsafe mutation accepted");
}
function selfTest(doc){
 validateOwnership(doc);
 expectRejected(doc,x=>{x.sources[0].mainSha="not-a-sha";});
 expectRejected(doc,x=>{x.capabilities[0].futureOwner="thiepn/french";});
 expectRejected(doc,x=>{x.futureAuthorities.hub="study and enrollment write authority";});
 expectRejected(doc,x=>{x.capabilities[0].sources[0].ref="ffffffffffffffffffffffffffffffffffffffff";});
 expectRejected(doc,x=>{x.openBranches.push({...x.openBranches[0]});});
 return {status:"PASS",negativeCases:5,localFilesVerified:true};
}
const flags=process.argv.slice(2);
if(flags.length!==1||!["--check","--self-test"].includes(flags[0])){
 process.stderr.write("Usage: node scripts/check-phase01-architecture.mjs --check|--self-test\n");
 process.exitCode=2;
}else{
 try{
  const result=flags[0]==="--self-test"?selfTest(read()):validateOwnership(read());
  process.stdout.write(JSON.stringify(result)+"\n");
 }catch(error){
  process.stderr.write(String(error instanceof Error?error.message:error)+"\n");
  process.exitCode=1;
 }
}
