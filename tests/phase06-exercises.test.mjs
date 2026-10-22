import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {validateLessonBundleV1} from "../packages/content-schema/src/lesson-v1.ts";
import {evaluateExercise,revealExercise,framesFor,parseOrderingDraft,checkpointId,parseDemoCheckpoint,serializeDemoCheckpoint} from "../apps/learner/src/lesson-model.ts";
import {createLessonPlayerState,reduceLessonPlayer,activeFrame,activeAttempt,mayAdvance} from "../apps/learner/src/lesson-player.ts";

const data=JSON.parse(readFileSync(fileURLToPath(new URL("../contracts/fixtures/phase02-source-lessons.json",import.meta.url)),"utf8"));
const langs=Object.fromEntries(data.bundles.map(b=>[b.lesson.languageId,b]));
const find=(l,k)=>langs[l].exercises.find(e=>e.kind===k);
const clone=x=>JSON.parse(JSON.stringify(x));
const fails=(bundle,code)=>{
 const errors=validateLessonBundleV1(bundle);
 assert.ok(errors.some(e=>e.code===code),JSON.stringify(errors));
};

test("three original-source extended courses share the same 16-frame contract with independent transfer",()=>{
 for(const lang of ["fr","ja","zh"]){
  const b=langs[lang];
  assert.deepEqual(validateLessonBundleV1(b),[]);
  assert.deepEqual(b.exercises.filter(e=>e.id.includes("-p06-")&&["cloze","ordering","reading"].includes(e.kind)).map(e=>e.kind),["cloze","ordering","reading"]);
  assert.equal(framesFor(b).length,16);
  assert.equal(framesFor(b).filter(f=>f.stage==="independent").length,4);
  assert.ok(b.lesson.contentVersion.includes("-p06"));
  assert.equal(b.lesson.publication,"internal-fixture");
  assert.ok(b.lesson.sources.every(s=>s.editorialReview==="pending"&&!s.redistributionVerified));
  assert.ok(b.exercises.every(e=>e.evidence.mayScheduleReview===false&&e.evidence.mayAssertProficiency===false));
 }
});

test("cloze checks authored, source-linked forms without inferring pronunciation or synonyms",()=>{
 const cases=[["fr","appelle","appelles"],["ja","こんばんは","おやすみなさい"],["zh","好吃","你好"]];
 for(const [l,good,bad] of cases){
  const e=find(l,"cloze");
  assert.equal(evaluateExercise(e,good).kind,"correct");
  assert.equal(evaluateExercise(e,bad).kind,"incorrect");
  assert.ok(e.before&&e.after);
  assert.ok(langs[l].plugin.capabilities.includes("cloze"));
 }
});

test("ordering accepts only the exact authored permutation and reveals readable source tokens",()=>{
 for(const l of ["fr","ja","zh"]){
  const e=find(l,"ordering");
  assert.equal(evaluateExercise(e,e.acceptedAnswers[0]).kind,"correct");
  assert.equal(evaluateExercise(e,[...e.acceptedAnswers[0].split(",")].reverse().join(",")).kind,"incorrect");
  assert.deepEqual(parseOrderingDraft(e.acceptedAnswers[0],e.tokens.length),e.acceptedAnswers[0].split(",").map(Number));
  assert.deepEqual(parseOrderingDraft("0,0",e.tokens.length),[]);
  assert.deepEqual(parseOrderingDraft("0,999",e.tokens.length),[]);
  const revealed=revealExercise(e);
  assert.equal(revealed.kind,"revealed");
  assert.equal(revealed.expected[0],e.acceptedAnswers[0].split(",").map(i=>e.tokens[Number(i)]).join(" "));
  assert.notEqual(revealed.expected[0],e.acceptedAnswers[0]);
 }
});

test("contextual reading requires source passage and exact supported recognition",()=>{
 for(const l of ["fr","ja","zh"]){
  const e=find(l,"reading");
  assert.ok(e.passage.length>25&&e.question.length>15);
  assert.equal(evaluateExercise(e,e.acceptedAnswers[0]).kind,"correct");
  assert.equal(evaluateExercise(e,e.options.find(s=>s!==e.acceptedAnswers[0])).kind,"incorrect");
  assert.equal(e.evidence.mayAssertProficiency,false);
 }
});

test("validator rejects ambiguous, malformed or unsupported advanced exercises",()=>{
 const x=clone(langs.fr),e=find("fr","cloze");
 x.exercises.find(y=>y.id===e.id).before="";
 fails(x,"cloze-contract");
 const y=clone(langs.ja);
 y.plugin.capabilities=y.plugin.capabilities.filter(s=>s!=="ordering");
 fails(y,"ordering-contract");
 const z=clone(langs.zh);
 z.exercises.find(e=>e.kind==="ordering").acceptedAnswers=["0,0,1"];
 fails(z,"ordering-contract");
 const other=clone(langs.fr);
 other.exercises.find(e=>e.kind==="reading").acceptedAnswers=["not-an-option"];
 fails(other,"choice-options");
 const missing=clone(langs.zh);
 missing.exercises.find(e=>e.kind==="reading").passage="";
 fails(missing,"reading-contract");
 const missingCapability=clone(langs.fr);
 missingCapability.plugin.capabilities=missingCapability.plugin.capabilities.filter(x=>x!=="cloze");
 fails(missingCapability,"cloze-contract");
});

test("same Phase 05 reducer handles all three new types without grade/schedule effects",()=>{
 for(const l of ["fr","ja","zh"]){
  let state=createLessonPlayerState(langs[l],7);
  for(const kind of ["cloze","ordering","reading"]){
    const ex=activeFrame(state).exercise;
    assert.equal(ex.kind,kind);
    assert.equal(mayAdvance(state),false);
    state=reduceLessonPlayer(state,{type:"draft",value:ex.acceptedAnswers[0]});
    state=reduceLessonPlayer(state,{type:"submit"});
    assert.equal(activeAttempt(state).outcome.kind,"correct");
    assert.equal(mayAdvance(state),true);
    state=reduceLessonPlayer(state,{type:"next"});
  }
  assert.equal(activeFrame(state).exercise.purpose,"guided");
  const guided=activeFrame(state).exercise;
  state=reduceLessonPlayer(state,{type:"draft",value:guided.acceptedAnswers[0]});
  state=reduceLessonPlayer(state,{type:"submit"});
  assert.equal(activeAttempt(state).outcome.kind,"correct");
  state=reduceLessonPlayer(state,{type:"next"});
  assert.equal(activeFrame(state).exercise.purpose,"independent");
  const serialized=serializeDemoCheckpoint({[checkpointId(langs[l])]:state.index},Object.values(langs));
  assert.ok(!serialized.includes("correct"));
  assert.ok(!serialized.includes("acceptedAnswers"));
  assert.ok(!serialized.includes("grade"));
  const restoredIndex=parseDemoCheckpoint(serialized,Object.values(langs))[checkpointId(langs[l])];
  const recovery=createLessonPlayerState(langs[l],restoredIndex);
  assert.equal(recovery.index,11);
  assert.deepEqual(recovery.attempts,{});
  assert.equal(activeAttempt(recovery).outcome,undefined);
 }
});
