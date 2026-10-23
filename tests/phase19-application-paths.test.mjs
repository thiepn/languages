import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {APPLICATION_PATHS,resolveApplicationStep,auditApplicationPaths} from "../apps/learner/src/application-paths.ts";
import {framesFor,checkpointId,serializeDemoCheckpoint,parseDemoCheckpoint} from "../apps/learner/src/lesson-model.ts";
const read=p=>JSON.parse(readFileSync(fileURLToPath(new URL("../contracts/"+p,import.meta.url)),"utf8"));
const bundles=[read("fixtures/phase02-source-lessons.json"),read("fixtures/phase15-source-lessons.json"),read("fixtures/phase17-cross-source-lessons.json"),read("fixtures/phase18-next-source-lessons.json")].flatMap(b=>b.bundles);
test("six source-validated practical paths reuse existing independent lessons without creating exercise IDs",()=>{
 assert.equal(APPLICATION_PATHS.length,6);
 assert.deepEqual(auditApplicationPaths(bundles),[]);
 assert.deepEqual(APPLICATION_PATHS.map(p=>p.languageId),["fr","fr","ja","ja","zh","zh"]);
 assert.equal(bundles.length,12);
 assert.equal(bundles.reduce((n,b)=>n+b.exercises.length,0),126);
 for(const path of APPLICATION_PATHS){
  assert.equal(path.steps.length,3);
  for(const step of path.steps){
   const found=resolveApplicationStep(bundles,step);
   assert.ok(found);
   assert.equal(found.exercise.purpose,"independent");
   assert.equal(framesFor(found.bundle)[found.frameIndex].exercise.id,step.exerciseId);
   assert.ok(found.bundle.lesson.sources.every(s=>!s.redistributionVerified&&s.editorialReview==="pending"));
  }
  assert.equal(resolveApplicationStep(bundles,path.steps[2]).exercise.kind,"free-production");
 }
});
test("French applied sequences distinguish role/name from source-owned articles and object reference",()=>{
 const paths=APPLICATION_PATHS.filter(p=>p.languageId==="fr");
 assert.deepEqual(paths[0].steps.map(s=>s.exerciseId),["fr-p18-article","fr-p18-definite","fr-p18-write"]);
 assert.deepEqual(paths[1].steps.map(s=>s.exerciseId),["fr-p17-name","fr-p17-etre","fr-p18-write"]);
});
test("Japanese applied sequences keep first-meeting practice separate from assistance and goodwill",()=>{
 const paths=APPLICATION_PATHS.filter(p=>p.languageId==="ja");
 assert.deepEqual(paths[0].steps.map(s=>s.exerciseId),["ja-p18-familiar","ja-p18-recall","ja-p18-write"]);
 assert.deepEqual(paths[1].steps.map(s=>s.exerciseId),["ja-p17-thank","ja-p18-goodwill","ja-p17-compose"]);
});
test("Chinese applied sequences bridge original pronoun identity with teacher-identity and ungraded writing",()=>{
 const paths=APPLICATION_PATHS.filter(p=>p.languageId==="zh");
 assert.deepEqual(paths[0].steps.map(s=>s.exerciseId),["zh-p17-speaker","zh-p18-link","zh-p18-write"]);
 assert.deepEqual(paths[1].steps.map(s=>s.exerciseId),["zh-p18-also","zh-p18-pinyin","zh-p18-write"]);
});
test("unreviewed or unsourced exercise references never open or qualify",()=>{
 const a=APPLICATION_PATHS[0].steps[0];
 assert.equal(resolveApplicationStep(bundles,{...a,exerciseId:"new-unreviewed"}),undefined);
 assert.equal(resolveApplicationStep(bundles,{...a,sourceId:"wrong-source"}),undefined);
 assert.ok(auditApplicationPaths(bundles.filter(b=>b.lesson.languageId!=="fr")).length>0);
 const missing=structuredClone(bundles);
 missing.find(b=>b.lesson.id===a.lessonId).lesson.steps[0].examples=[];
 assert.ok(auditApplicationPaths(missing).some(x=>x.problem==="unverified-original-quote"));
});
test("all original content versions and 12 frame-only checkpoints survive applied navigation",()=>{
 const checkpoints=Object.fromEntries(bundles.map((b,i)=>[checkpointId(b),Math.min(i+1,framesFor(b).length)]));
 const raw=serializeDemoCheckpoint(checkpoints,bundles);
 const decoded=parseDemoCheckpoint(raw,bundles);
 for(const [i,b] of bundles.entries())assert.equal(decoded[checkpointId(b)],Math.min(i+1,framesFor(b).length));
 assert.equal(Object.keys(decoded).length,12);
 assert.ok(!raw.includes("answer")&&!raw.includes("grade")&&!raw.includes("fsrs"));
});
