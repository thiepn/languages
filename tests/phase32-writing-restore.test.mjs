import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {compilePinnedSourceIntake} from "../apps/learner/src/source-intake.ts";
import {PHASE32_CHINESE_NEGOTIATIONS} from "../apps/learner/src/phase32-chinese-negotiations.ts";
import {activeAttempt,activeFrame,createLessonPlayerState,reduceLessonPlayer,mayAdvance} from "../apps/learner/src/lesson-player.ts";
import {framesFor,checkpointId,serializeDemoCheckpoint,parseDemoCheckpoint} from "../apps/learner/src/lesson-model.ts";

const read=p=>JSON.parse(readFileSync(fileURLToPath(new URL("../contracts/"+p,import.meta.url)),"utf8"));
const originals=["phase02-source-lessons","phase15-source-lessons","phase17-cross-source-lessons","phase18-next-source-lessons"].flatMap(p=>read("fixtures/"+p+".json").bundles);
const result=compilePinnedSourceIntake(originals,PHASE32_CHINESE_NEGOTIATIONS);

test("restore first draft is a real but deliberately ungraded, page-memory-only action on all nine Phase 32 Chinese writing tasks",()=>{
 assert.deepEqual(result.issues,[]);
 assert.equal(result.candidates.length,4);
 for(const bundle of result.candidates){
  const frames=framesFor(bundle);
  const writing=frames.filter(f=>f.exercise?.kind==="free-production");
  assert.equal(writing.length,9);
  for(const frame of writing){
   let p=createLessonPlayerState(bundle,frames.findIndex(f=>f.id===frame.id));
   const first="第一稿：这次由第一位学生讲话。";
   const later="第二稿：访客现在讲话，听者发生变化。";
   const third="第三稿：明确区分原文和我的新对话。";
   assert.equal(reduceLessonPlayer(p,{type:"restore-first-draft"}),p);
   p=reduceLessonPlayer(p,{type:"draft",value:first});
   assert.equal(reduceLessonPlayer(p,{type:"restore-first-draft"}),p);
   p=reduceLessonPlayer(p,{type:"submit"});
   assert.equal(activeAttempt(p).outcome?.kind,"ungraded");
   assert.equal(reduceLessonPlayer(p,{type:"restore-first-draft"}),p);
   p=reduceLessonPlayer(p,{type:"revise"});
   p=reduceLessonPlayer(p,{type:"draft",value:later});
   p=reduceLessonPlayer(p,{type:"submit"});
   assert.equal(activeAttempt(p).outcome?.kind,"ungraded");
   assert.equal(activeAttempt(p).firstSubmittedDraft,first);
   assert.equal(activeAttempt(p).submissions,2);
   assert.equal(mayAdvance(p),true);
   const restored=reduceLessonPlayer(p,{type:"restore-first-draft"});
   assert.equal(activeAttempt(restored).outcome,undefined);
   assert.equal(activeAttempt(restored).draft,first);
   assert.equal(activeAttempt(restored).firstSubmittedDraft,first);
   assert.equal(activeAttempt(restored).submissions,2);
   assert.equal(mayAdvance(restored),false);
   assert.equal(reduceLessonPlayer(restored,{type:"restore-first-draft"}),restored);
   p=reduceLessonPlayer(restored,{type:"draft",value:third});
   p=reduceLessonPlayer(p,{type:"submit"});
   assert.equal(activeAttempt(p).outcome?.kind,"ungraded");
   assert.equal(activeAttempt(p).firstSubmittedDraft,first);
   assert.equal(activeAttempt(p).draft,third);
   assert.equal(activeAttempt(p).submissions,3);
   assert.deepEqual(reduceLessonPlayer(p,{type:"load",bundle,restoredIndex:p.index}).attempts,{});
   assert.deepEqual(reduceLessonPlayer(p,{type:"reset"}).attempts,{});
  }
 }
});

test("restore action never accepts arbitrary source exercise, foreign state, or attempts to bypass the original player",()=>{
 assert.deepEqual(result.issues,[]);
 const b=result.candidates[0],frames=framesFor(b);
 for(const type of ["choice","reading","typed","ordering","cloze"]){
  const i=frames.findIndex(f=>f.exercise?.kind===type);
  if(i<0)continue;
  let p=createLessonPlayerState(b,i);
  assert.equal(reduceLessonPlayer(p,{type:"restore-first-draft"}),p);
  p=reduceLessonPlayer(p,{type:"draft",value:"wrong answer"});
  p=reduceLessonPlayer(p,{type:"submit"});
  assert.equal(activeAttempt(p).firstSubmittedDraft,undefined);
  assert.equal(reduceLessonPlayer(p,{type:"restore-first-draft"}),p);
 }
 assert.equal(reduceLessonPlayer(createLessonPlayerState(b),{type:"restore-first-draft"}).index,0);
 const originalPositions=Object.fromEntries(originals.map((b,i)=>[checkpointId(b),i]));
 const saved=serializeDemoCheckpoint(originalPositions,originals);
 assert.deepEqual(parseDemoCheckpoint(saved,originals),originalPositions);
 assert.doesNotMatch(saved,/firstSubmittedDraft|draft|restore|outcome|submissions|fsrs|grade|userId/);
});
