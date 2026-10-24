import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {validateLessonBundleV1} from "../packages/content-schema/src/lesson-v1.ts";
import {evaluateExercise,framesFor,checkpointId,serializeDemoCheckpoint} from "../apps/learner/src/lesson-model.ts";
import {createLessonPlayerState,reduceLessonPlayer,activeFrame,activeAttempt,mayAdvance} from "../apps/learner/src/lesson-player.ts";

const raw=JSON.parse(readFileSync(fileURLToPath(new URL("../contracts/fixtures/phase02-source-lessons.json",import.meta.url)),"utf8"));
const byLanguage=Object.fromEntries(raw.bundles.map(b=>[b.lesson.languageId,b]));
const copy=x=>JSON.parse(JSON.stringify(x));

test("21 substantive comparisons are independently traceable to exact source Encounter text and meaning",()=>{
 for(const lang of ["fr","ja","zh"]){
  const b=byLanguage[lang],frames=framesFor(b);
  assert.equal(frames.length,22);
  assert.equal(frames.filter(f=>f.stage==="independent").length,10);
  assert.deepEqual(validateLessonBundleV1(b),[]);
  assert.ok(b.lesson.contentVersion.includes("-p12"));
  const originals=b.lesson.steps.find(s=>s.type==="encounter").examples;
  const comparisons=b.exercises.filter(e=>e.sourceComparison&&!e.id.includes("-p13-"));
  assert.equal(comparisons.length,7);
  for(const exercise of comparisons){
   const {first,second,cue}=exercise.sourceComparison;
   assert.notEqual(first.targetText,second.targetText);
   assert.ok(cue.length>45);
   assert.ok(originals.some(ex=>ex.targetText===first.targetText&&ex.meaning===first.meaning));
   assert.ok(originals.some(ex=>ex.targetText===second.targetText&&ex.meaning===second.meaning));
   assert.ok(exercise.sourceIds.length>0);
   assert.equal(exercise.evidence.mayScheduleReview,false);
   assert.equal(exercise.evidence.mayAssertProficiency,false);
  }
  assert.ok(b.lesson.sources.every(s=>!s.redistributionVerified&&s.editorialReview==="pending"));
  assert.equal(b.lesson.publication,"internal-fixture");
 }
});

test("source comparison validator fails closed on invented text, meaning, identical pair or empty cue",()=>{
 for(const lang of ["fr","ja","zh"]){
  const b=byLanguage[lang];
  const id=b.exercises.find(e=>e.sourceComparison).id;
  for(const [label,damage] of [
    ["invented text",e=>{e.sourceComparison.first.targetText="fabricated expression";}],
    ["fabricated meaning",e=>{e.sourceComparison.second.meaning="not the original meaning";}],
    ["duplicated pair",e=>{e.sourceComparison.second={...e.sourceComparison.first};}],
    ["missing cue",e=>{e.sourceComparison.cue="";}],
  ]){
   const changed=copy(b),e=changed.exercises.find(e=>e.id===id);
   damage(e);
   assert.ok(validateLessonBundleV1(changed).some(issue=>issue.code==="source-comparison"),lang+" "+label);
  }
 }
});

test("twelve authored additional wrong-answer repairs remain incorrect and never broaden accepted forms",()=>{
 const cases=[
  ["fr","fr-a1-01-choice","À bientôt, madame."],
  ["fr","fr-p04-context-choice","Salut !"],
  ["fr","fr-p07-transfer-reading","Salut, Inès."],
  ["fr","fr-p08-situated-reading","Bonjour !"],
  ["ja","ja-a1-choice","おやすみなさい。"],
  ["ja","ja-p04-context-choice","こんにちは。"],
  ["ja","ja-p07-transfer-reading","おやすみなさい。"],
  ["ja","ja-p08-situated-reading","こんにちは。"],
  ["zh","zh-ni-hao-choice","你们"],
  ["zh","zh-p04-context-choice","你们"],
  ["zh","zh-p07-transfer-reading","好吃"],
  ["zh","zh-p08-situated-reading","你好"]
 ];
 for(const [lang,id,wrong] of cases){
  const e=byLanguage[lang].exercises.find(e=>e.id===id);
  const m=e.misconceptions.find(m=>m.answer===wrong);
  assert.ok(m&&m.feedback.length>50,id);
  assert.ok(e.options.includes(wrong)&&!e.acceptedAnswers.includes(wrong),id);
  assert.equal(evaluateExercise(e,wrong).kind,"incorrect");
  assert.equal(evaluateExercise(e,wrong).explanation,m.feedback);
  assert.equal(evaluateExercise(e,e.acceptedAnswers[0]).kind,"correct");
 }
});

test("new source comparisons do not change reducer, answer authority or tab-only saved checkpoint",()=>{
 for(const b of raw.bundles){
  let s=createLessonPlayerState(b,3);
  const exercise=activeFrame(s).exercise;
  assert.ok(exercise.sourceComparison);
  const wrong=exercise.options.find(v=>!exercise.acceptedAnswers.includes(v));
  s=reduceLessonPlayer(s,{type:"draft",value:wrong});
  s=reduceLessonPlayer(s,{type:"submit"});
  assert.equal(activeAttempt(s).outcome.kind,"incorrect");
  assert.equal(mayAdvance(s),false);
  const before=JSON.stringify(s);
  assert.ok(!before.includes("FSRS"));
  s=reduceLessonPlayer(s,{type:"retry"});
  assert.equal(activeAttempt(s).outcome,undefined);
  const expected=exercise.acceptedAnswers[0];
  s=reduceLessonPlayer(s,{type:"draft",value:expected});
  s=reduceLessonPlayer(s,{type:"submit"});
  assert.equal(activeAttempt(s).outcome.kind,"correct");
  const saved=serializeDemoCheckpoint({[checkpointId(b)]:s.index},raw.bundles);
  assert.ok(!/answer|misconception|comparison|grade|credential/i.test(saved));
 }
});
