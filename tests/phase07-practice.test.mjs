import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {validateLessonBundleV1} from "../packages/content-schema/src/lesson-v1.ts";
import {evaluateExercise,framesFor,checkpointId,parseDemoCheckpoint,serializeDemoCheckpoint} from "../apps/learner/src/lesson-model.ts";
import {createLessonPlayerState,reduceLessonPlayer,activeAttempt,activeFrame,mayAdvance} from "../apps/learner/src/lesson-player.ts";

const data=JSON.parse(readFileSync(fileURLToPath(new URL("../contracts/fixtures/phase02-source-lessons.json",import.meta.url)),"utf8"));
const byLang=Object.fromEntries(data.bundles.map(b=>[b.lesson.languageId,b]));
const owned=lang=>byLang[lang];
const exercise=(l,id)=>owned(l).exercises.find(e=>e.id===id);
const clone=x=>JSON.parse(JSON.stringify(x));

test("three pinned lessons each have twenty-two activities and ten independent tasks",()=>{
 for(const l of ["fr","ja","zh"]){
  const b=owned(l),frames=framesFor(b);
  assert.deepEqual(validateLessonBundleV1(b),[]);
  assert.equal(frames.length,22);
  assert.equal(frames.filter(f=>f.stage==="guided").length,8);
  assert.equal(frames.filter(f=>f.stage==="independent").length,10);
  assert.ok(b.lesson.contentVersion.includes("-p07"));
  assert.equal(b.lesson.publication,"internal-fixture");
  assert.ok(b.lesson.sources.every(s=>s.editorialReview==="pending"&&!s.redistributionVerified));
  assert.ok(b.exercises.every(e=>e.evidence.mayScheduleReview===false&&e.evidence.mayAssertProficiency===false));
  assert.equal(exercise(l,l+"-p07-context-reading").purpose,"guided");
  assert.equal(exercise(l,l+"-p07-transfer-cloze").purpose,"independent");
  assert.equal(exercise(l,l+"-p07-transfer-reading").purpose,"independent");
 }
});

test("new independent cloze tasks check original forms, not guessed synonyms",()=>{
 for(const [l,right,wrong] of [["fr","à","a"],["ja","おやすみなさい","こんばんは"],["zh","你","你们"]]){
  const e=exercise(l,l+"-p07-transfer-cloze");
  assert.equal(evaluateExercise(e,right).kind,"correct");
  assert.equal(evaluateExercise(e,wrong).kind,"incorrect");
  assert.ok(e.before.trim().length>0&&e.after.trim().length>0);
  assert.equal(e.evidence.independent,true);
 }
});

test("targeted source misconceptions produce different explanations without adding answer variants",()=>{
 const samples=[
  ["fr","fr-a1-01-choice","Salut, madame.","formal encounter"],
  ["fr","fr-p04-context-choice","Au revoir, madame.","evening arrival"],
  ["ja","ja-a1-choice","こんばんは。","8 a.m."],
  ["ja","ja-p04-context-choice","こんばんは。","before sleep"],
  ["zh","zh-ni-hao-choice","好吃","greeting"],
  ["zh","zh-p04-pinyin","ni hao","Tone marks"]
 ];
 for(const [l,id,wrong,text] of samples){
  const e=exercise(l,id),result=evaluateExercise(e,wrong);
  assert.equal(result.kind,"incorrect");
  assert.ok(result.explanation.includes(text),id+": "+result.explanation);
  assert.equal(e.misconceptions.some(m=>m.answer===wrong),true);
  assert.equal(evaluateExercise(e,e.acceptedAnswers[0]).kind,"correct");
  assert.equal(e.acceptedAnswers.includes(wrong),false);
 }
});

test("unreviewed plausible variants remain rejected",()=>{
 for(const [l,id,variant] of [
  ["fr","fr-p07-transfer-cloze","a"],
  ["fr","fr-p04-apostrophe","Je m'appelle Ines."],
  ["ja","ja-p07-transfer-cloze","おやすみ"],
  ["ja","ja-p04-evening-arrival","こんばんわ"],
  ["zh","zh-p07-transfer-cloze","您"],
  ["zh","zh-p04-pinyin","ni hao"]
 ])assert.equal(evaluateExercise(exercise(l,id),variant).kind,"incorrect",id);
});

test("invalid or colliding misconception feedback fails closed",()=>{
 const b=clone(owned("fr"));
 b.exercises.find(e=>e.id==="fr-a1-01-choice").misconceptions=[{answer:"Bonjour, madame.",feedback:"Incorrect"}];
 assert.ok(validateLessonBundleV1(b).some(x=>x.code==="misconception-collision"));
 const c=clone(owned("ja"));
 c.exercises.find(e=>e.kind==="free-production").misconceptions=[{answer:"wrong",feedback:"Not scored"}];
 assert.ok(validateLessonBundleV1(c).some(x=>x.code==="misconception-collision"));
 const d=clone(owned("zh"));
 d.exercises.find(e=>e.id==="zh-ni-hao-choice").misconceptions=[{answer:"好吃",feedback:""}];
 assert.ok(validateLessonBundleV1(d).some(x=>x.code==="misconception-contract"));
});

test("independent tasks reuse reducer and tab checkpoint cannot store grades or answers",()=>{
 for(const l of ["fr","ja","zh"]){
  let state=createLessonPlayerState(owned(l),13);
  assert.equal(activeFrame(state).exercise.kind,"cloze");
  state=reduceLessonPlayer(state,{type:"draft",value:activeFrame(state).exercise.acceptedAnswers[0]});
  state=reduceLessonPlayer(state,{type:"submit"});
  assert.equal(activeAttempt(state).outcome.kind,"correct");
  assert.equal(mayAdvance(state),true);
  state=reduceLessonPlayer(state,{type:"next"});
  assert.equal(activeFrame(state).exercise.kind,"reading");
  state=reduceLessonPlayer(state,{type:"draft",value:activeFrame(state).exercise.acceptedAnswers[0]});
  state=reduceLessonPlayer(state,{type:"submit"});
  state=reduceLessonPlayer(state,{type:"next"});
  assert.equal(activeFrame(state).stage,"independent");
  assert.equal(activeFrame(state).exercise.id,l+"-p08-situated-cloze");
  const output=serializeDemoCheckpoint({[checkpointId(owned(l))]:state.index},Object.values(byLang));
  assert.ok(!/acceptedAnswers|correct|account|grade|responseText/.test(output));
  const restored=parseDemoCheckpoint(output,Object.values(byLang));
  const fresh=createLessonPlayerState(owned(l),restored[checkpointId(owned(l))]);
  assert.equal(fresh.index,15);
  assert.deepEqual(fresh.attempts,{});
 }
});
