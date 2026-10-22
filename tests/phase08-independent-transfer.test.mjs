import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {validateLessonBundleV1} from "../packages/content-schema/src/lesson-v1.ts";
import {evaluateExercise,revealExercise,framesFor,parseDemoCheckpoint,serializeDemoCheckpoint,checkpointId} from "../apps/learner/src/lesson-model.ts";
import {activeFrame,activeAttempt,createLessonPlayerState,reduceLessonPlayer,mayAdvance} from "../apps/learner/src/lesson-player.ts";

const raw=JSON.parse(readFileSync(fileURLToPath(new URL("../contracts/fixtures/phase02-source-lessons.json",import.meta.url)),"utf8"));
const bundles=raw.bundles;
const byLanguage=Object.fromEntries(bundles.map(b=>[b.lesson.languageId,b]));
const languages=["fr","ja","zh"];
const entry=(lang,part)=>byLanguage[lang].exercises.find(e=>e.id===lang+"-p08-situated-"+part);
const copy=v=>JSON.parse(JSON.stringify(v));

test("20 source-pinned frames and eight independent transfer tasks per language stay internal",()=>{
 for(const lang of languages){
  const bundle=byLanguage[lang],frames=framesFor(bundle);
  assert.deepEqual(validateLessonBundleV1(bundle),[]);
  assert.equal(frames.length,20);
  assert.equal(frames.filter(f=>f.stage==="independent").length,8);
  assert.deepEqual(frames.slice(15,18).map(f=>f.exercise.kind),["cloze","ordering","reading"]);
  assert.ok(bundle.lesson.contentVersion.includes("-p08"));
  assert.equal(bundle.lesson.publication,"internal-fixture");
  assert.ok(bundle.lesson.sources.every(s=>s.editorialReview==="pending"&&!s.redistributionVerified));
  assert.ok(bundle.exercises.every(e=>e.evidence.mayScheduleReview===false&&e.evidence.mayAssertProficiency===false));
 }
});

test("new independent authored source forms are exact and do not invent translations or synonyms",()=>{
 for(const [l,correct,wrong] of [["fr","est","suis"],["ja","おはようございます","こんばんは"],["zh","茶","好吃"]]){
  const cloze=entry(l,"cloze");
  assert.equal(evaluateExercise(cloze,correct).kind,"correct");
  assert.equal(evaluateExercise(cloze,wrong).kind,"incorrect");
  assert.equal(cloze.purpose,"independent");
  assert.equal(cloze.evidence.independent,true);
  const order=entry(l,"ordering");
  assert.equal(evaluateExercise(order,order.acceptedAnswers[0]).kind,"correct");
  assert.equal(evaluateExercise(order,order.acceptedAnswers[0].split(",").reverse().join(",")).kind,"incorrect");
  assert.equal(revealExercise(order).kind,"revealed");
  const reading=entry(l,"reading");
  assert.equal(evaluateExercise(reading,reading.acceptedAnswers[0]).kind,"correct");
  assert.equal(evaluateExercise(reading,reading.options.find(o=>o!==reading.acceptedAnswers[0])).kind,"incorrect");
  assert.ok(reading.passage.length>20);
 }
});

test("each remediation source aid must point to unchanged encountered original text and meaning",()=>{
 for(const lang of languages){
  const b=byLanguage[lang];
  const examples=b.lesson.steps.find(s=>s.type==="encounter").examples;
  for(const ex of b.exercises.filter(e=>e.sourceAid)){
   const aid=ex.sourceAid;
   assert.ok(examples.some(x=>x.targetText===aid.targetText&&x.meaning===aid.meaning));
   assert.ok(aid.cue.length>30);
   assert.ok(ex.sourceIds.length>0);
  }
  const invalid=copy(b);
  invalid.exercises.find(e=>e.kind==="cloze"&&e.id.includes("p08")).sourceAid.targetText="invented unsourced text";
  assert.ok(validateLessonBundleV1(invalid).some(i=>i.code==="source-aid"));
  const mismatch=copy(b);
  mismatch.exercises.find(e=>e.id===lang+"-p08-situated-reading").sourceAid.meaning="fabricated translation";
  assert.ok(validateLessonBundleV1(mismatch).some(i=>i.code==="source-aid"));
 }
});

test("source-specific error correction stays distinct from answer credit and separate from reveal",()=>{
 for(const lang of languages){
  const ex=entry(lang,"reading");
  const wrong=ex.misconceptions[0];
  const result=evaluateExercise(ex,wrong.answer);
  assert.equal(result.kind,"incorrect");
  assert.equal(result.explanation,wrong.feedback);
  assert.equal(ex.acceptedAnswers.includes(wrong.answer),false);
  const revealed=revealExercise(ex);
  assert.equal(revealed.kind,"revealed");
  assert.equal(revealed.expected[0],ex.acceptedAnswers[0]);
  assert.equal(evaluateExercise(ex,ex.acceptedAnswers[0]).kind,"correct");
 }
});

test("same Phase 05 reducer handles independent repair and completion without grade events",()=>{
 for(const lang of languages){
  const b=byLanguage[lang];
  let state=createLessonPlayerState(b,15);
  const first=activeFrame(state).exercise;
  state=reduceLessonPlayer(state,{type:"draft",value:first.acceptedAnswers[0]});
  state=reduceLessonPlayer(state,{type:"submit"});
  assert.equal(activeAttempt(state).outcome.kind,"correct");
  for(let i=0;i<3;i++){
   if(i>0){
     const ex=activeFrame(state).exercise;
     state=reduceLessonPlayer(state,{type:"draft",value:ex.acceptedAnswers[0]});
     state=reduceLessonPlayer(state,{type:"submit"});
   }
   assert.equal(mayAdvance(state),true);
   state=reduceLessonPlayer(state,{type:"next"});
  }
  assert.equal(state.index,18);
  assert.equal(activeFrame(state).stage,"independent");
  assert.equal(activeFrame(state).exercise.id,lang+"-p09-context-composition");
  const positions=serializeDemoCheckpoint({[checkpointId(b)]:state.index},bundles);
  assert.ok(!/acceptedAnswers|responseText|grade|correct|accountId/.test(positions));
  const restored=parseDemoCheckpoint(positions,bundles)[checkpointId(b)];
  assert.equal(restored,18);
  assert.deepEqual(createLessonPlayerState(b,restored).attempts,{});
  const previous=copy(b);
  previous.lesson.contentVersion=previous.lesson.contentVersion.replace("-p08","");
  assert.deepEqual(parseDemoCheckpoint(positions,[previous]),{});
 }
});
