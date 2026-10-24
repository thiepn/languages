import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {LESSON_FOLLOW_UPS,APPLICATION_FOLLOW_UPS,auditSourceFollowUps} from "../apps/learner/src/source-followups.ts";
import {APPLICATION_PATHS} from "../apps/learner/src/application-paths.ts";
import {createLessonPlayerState,reduceLessonPlayer,activeAttempt} from "../apps/learner/src/lesson-player.ts";
import {framesFor,checkpointId,serializeDemoCheckpoint,parseDemoCheckpoint} from "../apps/learner/src/lesson-model.ts";
const read=p=>JSON.parse(readFileSync(fileURLToPath(new URL("../contracts/"+p,import.meta.url)),"utf8"));
const bundles=["phase02-source-lessons","phase15-source-lessons","phase17-cross-source-lessons","phase18-next-source-lessons"].flatMap(p=>read("fixtures/"+p+".json").bundles);
const receipts=read("phase16-source-evidence.json").originalSourceQuotes;

test("all 12 lesson and six application correction routes cite encountered, receipt-backed original text",()=>{
 assert.equal(LESSON_FOLLOW_UPS.length,12);
 assert.equal(APPLICATION_FOLLOW_UPS.length,6);
 assert.deepEqual(auditSourceFollowUps(bundles,APPLICATION_PATHS),[]);
 for(const entry of [...LESSON_FOLLOW_UPS,...APPLICATION_FOLLOW_UPS]){
  assert.equal(entry.focuses.length,2);
  for(const focus of entry.focuses)assert.ok(receipts[focus.sourceId].includes(focus.quote));
 }
});
test("revise and resubmit through original player stays ungraded and never changes review evidence",()=>{
 for(const bundle of bundles){
  const frameIndex=framesFor(bundle).findIndex(f=>f.exercise?.kind==="free-production");
  assert.ok(frameIndex>=0,bundle.lesson.id);
  let state=createLessonPlayerState(bundle,frameIndex);
  state=reduceLessonPlayer(state,{type:"draft",value:"My independently written first response"});
  state=reduceLessonPlayer(state,{type:"submit"});
  assert.equal(activeAttempt(state).outcome?.kind,"ungraded");
  state=reduceLessonPlayer(state,{type:"revise"});
  assert.equal(activeAttempt(state).outcome,undefined);
  state=reduceLessonPlayer(state,{type:"draft",value:"A new independently written response for the changed situation"});
  state=reduceLessonPlayer(state,{type:"submit"});
  assert.equal(activeAttempt(state).outcome?.kind,"ungraded");
  assert.equal(framesFor(bundle)[frameIndex].exercise.evidence.mayScheduleReview,false);
  assert.equal(framesFor(bundle)[frameIndex].exercise.evidence.mayAssertProficiency,false);
  assert.equal(state.attempts[framesFor(bundle)[frameIndex].id].submissions,2);
 }
});
test("rights/source withdrawal and fabricated encounter variants fail closed for lesson and application",()=>{
 const changed=structuredClone(bundles);
 const first=LESSON_FOLLOW_UPS[0].focuses[0];
 const owner=changed.find(b=>b.lesson.id===LESSON_FOLLOW_UPS[0].ownerId);
 owner.lesson.steps.find(s=>s.type==="encounter"&&s.examples.some(e=>e.targetText===first.quote)).examples
   .find(e=>e.targetText===first.quote).targetText="Invented replacement quotation";
 assert.ok(auditSourceFollowUps(changed,APPLICATION_PATHS).some(x=>x.ownerId===LESSON_FOLLOW_UPS[0].ownerId));
 const other=structuredClone(bundles);
 const app=APPLICATION_FOLLOW_UPS[0];
 for(const b of other)for(const s of b.lesson.sources)if(s.id===app.focuses[0].sourceId)s.redistributionVerified=true;
 assert.ok(auditSourceFollowUps(other,APPLICATION_PATHS).some(x=>x.ownerId===app.ownerId));
});
test("Phase 21 adds no lesson, exercise, checkpoint or persisted learner answer",()=>{
 assert.equal(bundles.length,12);
 assert.equal(bundles.reduce((n,b)=>n+b.exercises.length,0),126);
 const before=Object.fromEntries(bundles.map((b,i)=>[checkpointId(b),Math.min(i,framesFor(b).length)]));
 const after=serializeDemoCheckpoint(before,bundles);
 assert.deepEqual(parseDemoCheckpoint(after,bundles),before);
 assert.doesNotMatch(after,/draft|source-followup|answer|grading/i);
});
