import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {
  activeFrame,activeAttempt,createLessonPlayerState,hasUnsubmittedWriting,reduceLessonPlayer
} from "../apps/learner/src/lesson-player.ts";

const raw=JSON.parse(readFileSync(fileURLToPath(new URL("../contracts/fixtures/phase02-source-lessons.json",import.meta.url)),"utf8"));
const originals=raw.bundles;

test("detects unsent authored writing at any activity, not only active activity",()=>{
 for(const bundle of originals){
   const start=createLessonPlayerState(bundle,18);
   assert.equal(activeFrame(start).exercise.kind,"free-production");
   assert.equal(hasUnsubmittedWriting(start),false);
   const text="Private draft / "+bundle.lesson.languageId;
   const typed=reduceLessonPlayer(start,{type:"draft",value:text});
   assert.equal(hasUnsubmittedWriting(typed),true);
   const back=reduceLessonPlayer(typed,{type:"previous"});
   assert.equal(back.index,17);
   assert.equal(hasUnsubmittedWriting(back),true);
   assert.equal(hasUnsubmittedWriting(reduceLessonPlayer(typed,{type:"reset"})),false);
   assert.equal(hasUnsubmittedWriting(reduceLessonPlayer(typed,{type:"load",bundle,restoredIndex:18})),false);
   assert.equal(hasUnsubmittedWriting(reduceLessonPlayer(start,{type:"draft",value:" \n  "})),false);
 }
});

test("submitted writing does not need a discard prompt until learner elects to revise",()=>{
 for(const bundle of originals){
   let state=createLessonPlayerState(bundle,18);
   state=reduceLessonPlayer(state,{type:"draft",value:"My unsaved source-based composition"});
   state=reduceLessonPlayer(state,{type:"submit"});
   assert.equal(activeAttempt(state).outcome.kind,"ungraded");
   assert.equal(hasUnsubmittedWriting(state),false);
   state=reduceLessonPlayer(state,{type:"revise"});
   assert.equal(activeAttempt(state).outcome,undefined);
   assert.equal(hasUnsubmittedWriting(state),true);
 }
});

test("typed drill drafts and other exercise outcomes never trigger authored-writing guard",()=>{
 for(const bundle of originals){
   const choice=createLessonPlayerState(bundle,3);
   const attempt=reduceLessonPlayer(choice,{type:"draft",value:"incorrect selection"});
   assert.equal(hasUnsubmittedWriting(attempt),false);
   const evaluated=reduceLessonPlayer(attempt,{type:"submit"});
   assert.equal(hasUnsubmittedWriting(evaluated),false);
 }
});
