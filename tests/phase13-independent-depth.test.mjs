import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {validateLessonBundleV1} from "../packages/content-schema/src/lesson-v1.ts";
import {evaluateExercise,framesFor,checkpointId,parseDemoCheckpoint,serializeDemoCheckpoint} from "../apps/learner/src/lesson-model.ts";
import {activeAttempt,activeFrame,createLessonPlayerState,reduceLessonPlayer,mayAdvance,isLessonComplete} from "../apps/learner/src/lesson-player.ts";
const source=JSON.parse(readFileSync(fileURLToPath(new URL("../contracts/fixtures/phase02-source-lessons.json",import.meta.url)),"utf8"));
const bundles=Object.fromEntries(source.bundles.map(b=>[b.lesson.languageId,b]));
const own=(l,s)=>bundles[l].exercises.find(e=>e.id===l+"-p13-"+s);

test("three unchanged source identities now teach 22 frames, ten independent tasks and two distinct new transfers",()=>{
 for(const lang of ["fr","ja","zh"]){
  const b=bundles[lang];
  assert.deepEqual(validateLessonBundleV1(b),[]);
  assert.equal(framesFor(b).length,22);
  assert.equal(framesFor(b).filter(f=>f.stage==="independent").length,10);
  assert.equal(framesFor(b)[19].exercise.id,b.lesson.steps.find(s=>s.type==="independent").exerciseIds.at(-2));
  assert.equal(framesFor(b)[20].exercise.id,b.lesson.steps.find(s=>s.type==="independent").exerciseIds.at(-1));
  assert.equal(framesFor(b)[21].stage,"reflect");
  assert.ok(b.lesson.contentVersion.endsWith("-p13"));
  assert.ok(b.lesson.sources.every(s=>s.editorialReview==="pending"&&!s.redistributionVerified));
  assert.equal(b.lesson.publication,"internal-fixture");
  const extras=b.exercises.filter(e=>e.id.startsWith(lang+"-p13-"));
  assert.equal(extras.length,2);
  assert.ok(extras.every(e=>e.purpose==="independent"&&e.evidence.independent===true&&
    !e.evidence.mayScheduleReview&&!e.evidence.mayAssertProficiency&&e.grading==="exact"));
  const originals=b.lesson.steps.find(s=>s.type==="encounter").examples;
  for(const ex of extras){
   assert.ok(ex.sourceIds.every(id=>b.lesson.sources.some(s=>s.id===id)));
   assert.ok(originals.some(x=>x.targetText===ex.sourceAid.targetText&&x.meaning===ex.sourceAid.meaning));
   if(ex.sourceComparison)for(const side of [ex.sourceComparison.first,ex.sourceComparison.second])
     assert.ok(originals.some(x=>x.targetText===side.targetText&&x.meaning===side.meaning));
  }
 }
});

test("French independently distinguishes être occupation from naming a person",()=>{
 const cloze=own("fr","independent-etre"),reading=own("fr","identity-role-reading");
 assert.equal(evaluateExercise(cloze,"suis").kind,"correct");
 assert.equal(evaluateExercise(cloze,"appelle").kind,"incorrect");
 assert.equal(evaluateExercise(reading,"Je suis étudiant.").kind,"correct");
 assert.equal(evaluateExercise(reading,"Je m’appelle Inès.").kind,"incorrect");
 assert.ok(evaluateExercise(reading,"Je m’appelle Inès.").explanation.includes("name"));
 const examples=bundles.fr.lesson.steps.find(s=>s.type==="encounter").examples;
 assert.ok(examples.some(e=>e.targetText==="Je suis étudiant."&&e.meaning==="I am a student."));
 assert.ok(examples.some(e=>e.targetText==="Je m’appelle Inès."&&e.meaning==="My name is Inès."));
});

test("Japanese practices the missing daytime independent expression and a three-situation ordering",()=>{
 const shop=own("ja","shop-afternoon"),timeline=own("ja","social-timeline");
 assert.equal(evaluateExercise(shop,"こんにちは。").kind,"correct");
 assert.equal(evaluateExercise(shop,"こんばんは。").kind,"incorrect");
 assert.equal(evaluateExercise(timeline,"1,2,0").kind,"correct");
 assert.equal(evaluateExercise(timeline,"1,0,2").kind,"incorrect");
 assert.equal(timeline.tokens.length,3);
 assert.ok(timeline.sourceComparison.cue.includes("evening"));
});

test("Mandarin distinguishes tone-marked plural from greeting, and sentence question from statement",()=>{
 const plural=own("zh","plural-pinyin"),reading=own("zh","question-statement");
 assert.equal(evaluateExercise(plural,"nǐmen").kind,"correct");
 assert.equal(evaluateExercise(plural,"ni men").kind,"incorrect");
 assert.equal(evaluateExercise(plural,"nǐ hǎo").kind,"incorrect");
 assert.equal(evaluateExercise(reading,reading.acceptedAnswers[0]).kind,"correct");
 for(const option of reading.options.filter(v=>v!==reading.acceptedAnswers[0])){
  assert.equal(evaluateExercise(reading,option).kind,"incorrect");
  assert.ok(reading.misconceptions.some(x=>x.answer===option));
 }
 assert.deepEqual(reading.sourceIds,["zh-ni-demo","zh-hao-demo"]);
});

test("Phase 05 reducer continues through all 22 stages without storing a grade",()=>{
 for(const lang of ["fr","ja","zh"]){
  const b=bundles[lang];
  let state=createLessonPlayerState(b,19);
  for(let i=0;i<2;i++){
   const ex=activeFrame(state).exercise;
   state=reduceLessonPlayer(state,{type:"draft",value:ex.acceptedAnswers[0]});
   state=reduceLessonPlayer(state,{type:"submit"});
   assert.equal(activeAttempt(state).outcome.kind,"correct");
   assert.equal(mayAdvance(state),true);
   state=reduceLessonPlayer(state,{type:"next"});
  }
  assert.equal(activeFrame(state).stage,"reflect");
  state=reduceLessonPlayer(state,{type:"next"});
  assert.equal(isLessonComplete(state),true);
  assert.equal(state.index,22);
  const serialized=serializeDemoCheckpoint({[checkpointId(b)]:state.index},source.bundles);
  assert.ok(!/answer|submissions|grade|pinyin|sourceComparison/i.test(serialized));
  const old=JSON.parse(JSON.stringify(b));
  old.lesson.contentVersion=old.lesson.contentVersion.replace("-p13","");
  assert.deepEqual(parseDemoCheckpoint(serialized,[old]),{});
 }
});
