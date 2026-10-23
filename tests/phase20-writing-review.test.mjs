import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {APPLICATION_PATHS,APPLICATION_REVIEWS,auditApplicationPaths} from "../apps/learner/src/application-paths.ts";
import {checkpointId,framesFor,serializeDemoCheckpoint,parseDemoCheckpoint,evaluateExercise} from "../apps/learner/src/lesson-model.ts";
const read=p=>JSON.parse(readFileSync(fileURLToPath(new URL("../contracts/"+p,import.meta.url)),"utf8"));
const bundles=["phase02-source-lessons","phase15-source-lessons","phase17-cross-source-lessons","phase18-next-source-lessons"].flatMap(p=>read("fixtures/"+p+".json").bundles);
const original=read("phase16-source-evidence.json").originalSourceQuotes;
test("each of six writing paths has three distinct original-source-backed review criteria",()=>{
 assert.equal(APPLICATION_PATHS.length,6);
 assert.deepEqual(auditApplicationPaths(bundles),[]);
 for(const path of APPLICATION_PATHS){
  const guide=APPLICATION_REVIEWS[path.id];
  assert.equal(guide.criteria.length,3);
  assert.equal(new Set(guide.criteria.map(c=>c.sourceId+"|"+c.quote)).size,3);
  for(const item of guide.criteria){
   assert.ok(path.steps.some(step=>step.sourceId===item.sourceId));
   assert.ok(original[item.sourceId].includes(item.quote));
   assert.ok(item.prompt.length>20);
  }
 }
});
test("repeated revision of independent writing still remains ungraded with zero scheduling authority",()=>{
 for(const path of APPLICATION_PATHS){
  const finalStep=path.steps.at(-1);
  const writing=bundles.flatMap(b=>b.exercises).find(e=>e.id===finalStep.exerciseId);
  assert.equal(writing.kind,"free-production");
  assert.equal(evaluateExercise(writing,"Draft before revision").kind,"ungraded");
  assert.equal(evaluateExercise(writing,"Changed writing after source review").kind,"ungraded");
  assert.equal(writing.evidence.mayScheduleReview,false);
  assert.equal(writing.evidence.mayAssertProficiency,false);
 }
});
test("source withdrawal or rights drift blocks review-guide admission, not only lesson playback",()=>{
 for(const path of APPLICATION_PATHS){
  const updated=structuredClone(bundles);
  const sourceId=APPLICATION_REVIEWS[path.id].criteria[0].sourceId;
  for(const bundle of updated)for(const src of bundle.lesson.sources)
    if(src.id===sourceId)src.redistributionVerified=true;
  assert.ok(auditApplicationPaths(updated).some(issue=>issue.pathId===path.id));
 }
});
test("all twelve original lesson IDs, versions, exercises and frame-only checkpoints remain intact",()=>{
 assert.equal(bundles.length,12);
 assert.equal(bundles.reduce((n,b)=>n+b.exercises.length,0),126);
 const data=Object.fromEntries(bundles.map((b,i)=>[checkpointId(b),Math.min(i+1,framesFor(b).length)]));
 const serialized=serializeDemoCheckpoint(data,bundles);
 assert.deepEqual(parseDemoCheckpoint(serialized,bundles),data);
 assert.ok(!serialized.includes("answer")&&!serialized.includes("writing")&&!serialized.includes("grade"));
});
