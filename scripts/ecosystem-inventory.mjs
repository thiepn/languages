#!/usr/bin/env node
/** E0: derive source-owned capability counts from adjacent, explicit checkouts.
 * Read-only: does not connect to Account/Core, interpret learner data, write
 * project files or promote a source to officially certified material.
 * Run on Node 24 with sibling checkouts or --chinese/--french/--japanese paths.
 */
import {readFile,writeFile} from "node:fs/promises";
import {resolve,dirname,join} from "node:path";
import {fileURLToPath,pathToFileURL} from "node:url";
import {spawnSync} from "node:child_process";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const flag=(name,otherwise)=>process.argv.find(x=>x.startsWith("--"+name+"="))?.slice(name.length+3)??otherwise;
const checkout=(name)=>resolve(flag(name,join(root,"..",name)));
const arr=value=>Array.isArray(value)?value:[];
const count=(value)=>arr(value).length;
const src=(base,path)=>import(pathToFileURL(join(base,path)).href);
async function json(base,path){return JSON.parse(await readFile(join(base,path),"utf8"));}
function sha(dir){const run=spawnSync("git",["-C",dir,"rev-parse","HEAD"],{encoding:"utf8",timeout:5000});
 return run.status===0?run.stdout.trim():null;}
async function chinese(base){
 const [lessons,pathways,transfers,writing]=await Promise.all([
  src(base,"src/demo-lessons.mjs"),src(base,"src/pathway-course.mjs"),
  src(base,"src/p45-course.mjs"),src(base,"src/p43-course.mjs")
 ]);
 const demo=lessons.DEMO_LESSONS;
 const original=arr(demo).filter(x=>x.approval==="DEMO_ONLY"&&x.officialHskLevel===null);
 const transfer=arr(pathways.PATHWAY_MISSIONS).filter(x=>pathways.pathwayIndependentTransfer?.(x));
 return {
  unitKind:"character-centred editorial demonstrations",
  counts:{characterLessons:count(demo),reviewTaskKinds:6,pathwayMissions:count(pathways.PATHWAY_MISSIONS),
   independentContextChallenges:transfer.length,p45TransferCases:count(transfers.P45_TRANSFERS),
   p43WritingJourneys:count(writing.P43_UNITS)},
  contracts:{nativeStudyState:"src/study.mjs",localState:"src/study-storage.mjs",
   reviewAuthority:"uncalibrated original demonstration scheduler",
   writingPrivacy:"P43 in-tab drafts; not Hub-synchronizable",
   officialHskContent:false,rights:"original editorial demonstrations, not official HSK"},
  checks:{sourceQualifiedDemo:original.length===count(demo),uniqueLessonIds:new Set(arr(demo).map(x=>x.id)).size===count(demo),
   uniquePathwayIds:new Set(arr(pathways.PATHWAY_MISSIONS).map(x=>x.id)).size===count(pathways.PATHWAY_MISSIONS)},
  evidenceLimit:"No human Mandarin qualification, HSK membership, native-audio coverage or external production readiness inferred."
 };
}
async function french(base){
 const [course,material,a1,listening]=await Promise.all([
  src(base,"app/src/core/unified/u22-course.ts"),src(base,"app/src/core/unified/u22-material.ts"),
  src(base,"app/src/core/unified/u7-a1-course.ts"),src(base,"app/src/core/unified/u7-listening.ts")
 ]);
 const units=arr(course.ORIGINAL_FRENCH_U22_COURSE),a1Units=arr(a1.A1_COMPLETE_UNITS);
 return {
  unitKind:"full original lessons plus independent transfer scenarios",
  counts:{courseAndTransferRecords:count(units),connectedReadingRecords:count(material.ORIGINAL_U22_CONNECTED_READINGS),
   a1FullLessons:count(a1Units),originalA1ListeningQuestions:a1Units.reduce((n,u)=>n+count(listening.listeningQuestions(u)),0),
   changedContextSpeaking:a1Units.filter(u=>Boolean(listening.originalA1ConversationTransfer(u.id))).length,
   independentMisunderstandingRepairs:a1Units.filter(u=>Boolean(listening.originalA1ConversationRepair?.(u.id))).length},
  contracts:{reviewAuthority:"app/src/core/learner/repository.ts + scheduler.ts",
   lessonRegistry:"app/src/core/unified/u23-registry.ts",
   lexicalLink:"app/src/core/unified/u40-lexical-bridge.ts",
   hubStatus:"existing French read-model producer, production publication separate"},
  checks:{uniqueCourseIds:new Set(units.map(x=>x.id)).size===units.length,
   originalRights:units.every(x=>x.source?.source==="original"&&x.source?.rights==="original-owned")},
  evidenceLimit:"Open speech remains ungraded; real human acoustic and full linguistic coverage not inferred."
 };
}
async function japanese(base){
 const [core,lex,language,course]=await Promise.all([
  json(base,"content/seed/jp-core.json"),json(base,"content/seed/jp-c1-lexicon.json"),
  json(base,"content/seed/jp-c1-language.json"),json(base,"content/seed/jp-c1-course.json")
 ]);
 const assembled=(key)=>[...arr(core[key]),...arr((key==="lexemes"||key==="senses")?lex[key]:
    (key==="grammar"||key==="sentences"||key==="lexicalChunks")?language[key]:course[key])];
 const keys=["lexemes","senses","grammar","sentences","lexicalChunks","canDos","courseUnits","readingTexts","productiveTasks"];
 const counts=Object.fromEntries(keys.map(k=>[k,assembled(k).length]));
 const unique=keys.every(k=>new Set(assembled(k).map(x=>x.id)).size===counts[k]);
 let e11=0,update=0;
 try {const p=await src(base,"apps/web/src/study/e11PracticalTransfer.ts");
  e11=count(p.E11_TRANSFER);update=count(p.E11_SOURCE_UPDATES);
 } catch {/* Content seed inventory remains valid without optional TS runtime imports. */}
 return {
  unitKind:"canonical Can-do-linked units and connected texts",
  counts:{...counts,e11PracticalCases:e11||null,e11LaterNotices:update||null},
  contracts:{learnerEvidence:"packages/learner-engine/src/index.ts",
   reviewAuthority:"packages/scheduler/src/index.ts",
   contentAuthority:"apps/web/src/coreContent.ts, base seed plus three C1 overlays",
   hubStatus:"P8 producer exists; authenticated cross-device acceptance still pending"},
  checks:{uniqueCanonicalIds:unique,assembledAllFourSources:true},
  evidenceLimit:"Advanced engine does not prove complete C1/C2 vocabulary, native speech, or external proficiency."
 };
}
async function inspect(name,fn){
 const dir=checkout(name);
 try {return {repo:"thiepn/"+name,checkout:dir,head:sha(dir),status:"source-derived",
   ...await fn(dir)};}
 catch(error){return {repo:"thiepn/"+name,checkout:dir,head:sha(dir),
  status:"unavailable",reason:String(error instanceof Error?error.message:error).slice(0,350),
  counts:null,checks:null};}
}
function selfTest(){
 const list=[{id:"a"},{id:"b"}];
 if(count(list)!==2||count(null)!==0||new Set(list.map(x=>x.id)).size!==2)throw Error("INVENTORY_HELPER_FAILED");
 process.stdout.write(JSON.stringify({schema:"thiepn-ecosystem-e0-self-test",status:"PASS"})+"\n");
}
if(process.argv.includes("--self-test"))selfTest();
else {
 const languages=await Promise.all([inspect("chinese",chinese),inspect("french",french),inspect("japanese",japanese)]);
 const result={schema:"thiepn-language-ecosystem-source-inventory",schemaVersion:1,
  generatedAt:new Date().toISOString(),languagePlatformHead:sha(root),
  sourceAuthority:"independent original application",readOnly:true,
  languages,hub:{repo:"thiepn/languages",chineseP8:"design-only; no producer publication or Account changes",
   sharedWrites:false},limitations:["Not a CEFR/HSK/JLPT certification",
   "Counts represent different unit kinds", "Human language review is separate from source validation"]};
 const out=flag("out","");
 if(out)await writeFile(resolve(out),JSON.stringify(result,null,2)+"\n","utf8");
 process.stdout.write(JSON.stringify(result,null,2)+"\n");
 if(process.argv.includes("--strict")&&languages.some(x=>x.status!=="source-derived"||Object.values(x.checks??{}).some(y=>y===false)))
  process.exitCode=1;
}
