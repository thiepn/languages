import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {admitInternalPilot,editorialPreflight,sourceCoverage} from "../apps/learner/src/source-coverage.ts";
import {validateLessonBundleV1} from "../packages/content-schema/src/lesson-v1.ts";
import {framesFor,evaluateExercise,checkpointId,parseDemoCheckpoint,serializeDemoCheckpoint} from "../apps/learner/src/lesson-model.ts";
import {createLessonPlayerState,reduceLessonPlayer,activeFrame,activeAttempt} from "../apps/learner/src/lesson-player.ts";
const file=name=>JSON.parse(readFileSync(fileURLToPath(new URL("../contracts/fixtures/"+name,import.meta.url)),"utf8"));
const original=file("phase02-source-lessons.json").bundles;
const additional=file("phase15-source-lessons.json").bundles;
const copy=x=>structuredClone(x);
const byLang=Object.fromEntries(additional.map(b=>[b.lesson.languageId,b]));
test("three independently owned next lessons have source pins and actual substantive framed practice",()=>{
 assert.deepEqual(additional.map(b=>b.lesson.languageId),["fr","ja","zh"]);
 for(const b of additional){
  assert.deepEqual(validateLessonBundleV1(b),[]);
  assert.equal(admitInternalPilot(b).length,1);
  assert.equal(framesFor(b).length,14);
  assert.equal(b.lesson.prerequisiteLessonIds.length,1);
  assert.equal(original.find(x=>x.lesson.languageId===b.lesson.languageId).lesson.id,b.lesson.prerequisiteLessonIds[0]);
  assert.equal(framesFor(b).filter(x=>x.stage==="guided").length,5);
  assert.equal(framesFor(b).filter(x=>x.stage==="independent").length,5);
  assert.equal(b.exercises.filter(x=>x.kind==="free-production").length,1);
  assert.ok(b.exercises.every(x=>x.evidence.mayScheduleReview===false&&x.evidence.mayAssertProficiency===false));
  assert.equal(b.lesson.publication,"internal-fixture");
  assert.ok(b.lesson.sources.every(x=>!x.redistributionVerified&&x.editorialReview==="pending"));
  assert.equal(editorialPreflight(b).readyForSeparateReview,false);
  assert.ok(sourceCoverage(b)[0].guided.length>=5&&sourceCoverage(b)[0].independent.length>=5);
 }
 assert.equal(original.every(b=>framesFor(b).length===22),true);
});
test("French contrasts six être forms, role, place and nationality without grading production",()=>{
 const b=byLang.fr,find=s=>b.exercises.find(x=>x.id==="fr-p15-"+s);
 assert.equal(evaluateExercise(find("suis-guided"),"suis").kind,"correct");
 assert.equal(evaluateExercise(find("suis-guided"),"est").kind,"incorrect");
 assert.equal(evaluateExercise(find("vous-guided"),"sommes").kind,"incorrect");
 assert.equal(evaluateExercise(find("agreement-guided"),"Elle est française.").kind,"correct");
 assert.equal(evaluateExercise(find("agreement-guided"),"Elle est français.").kind,"incorrect");
 assert.equal(evaluateExercise(find("role-independent"),"Je suis professeur.").kind,"correct");
 assert.equal(evaluateExercise(find("role-independent"),"Je suis un professeur.").kind,"incorrect");
 assert.equal(evaluateExercise(find("writing-independent"),"original sentences").kind,"ungraded");
});
test("Japanese distinguishes thanking, attracting attention, acknowledgment and a free authored exchange",()=>{
 const b=byLang.ja,find=s=>b.exercises.find(x=>x.id==="ja-p15-"+s);
 assert.equal(evaluateExercise(find("thanks-guided"),"ありがとうございます。").kind,"correct");
 assert.equal(evaluateExercise(find("attention-independent"),"すみません。").kind,"correct");
 assert.equal(evaluateExercise(find("attention-independent"),"ありがとうございます。").kind,"incorrect");
 assert.equal(evaluateExercise(find("reply-independent"),"どういたしまして。").kind,"correct");
 assert.equal(evaluateExercise(find("sequence-independent"),"1,0").kind,"correct");
 assert.equal(evaluateExercise(find("sequence-independent"),"0,1").kind,"incorrect");
 assert.equal(evaluateExercise(find("writing-independent"),"独立した文章").kind,"ungraded");
});
test("Chinese original 我, 我们, 我的 remain distinct and Pinyin tone marks are not silently dropped",()=>{
 const b=byLang.zh,find=s=>b.exercises.find(x=>x.id==="zh-p15-"+s);
 assert.equal(evaluateExercise(find("pronoun-guided"),"我").kind,"correct");
 assert.equal(evaluateExercise(find("pronoun-guided"),"我们").kind,"incorrect");
 assert.equal(evaluateExercise(find("pinyin-guided"),"wǒ").kind,"correct");
 assert.equal(evaluateExercise(find("pinyin-guided"),"wo").kind,"incorrect");
 assert.equal(evaluateExercise(find("ownership-independent"),"我的").kind,"correct");
 assert.equal(evaluateExercise(find("ownership-independent"),"我们").kind,"incorrect");
 assert.equal(evaluateExercise(find("identity-independent"),"是").kind,"correct");
 assert.equal(evaluateExercise(find("identity-independent"),"们").kind,"incorrect");
 assert.equal(evaluateExercise(find("writing-independent"),"我的 ...").kind,"ungraded");
});
test("new admission rejects fake revisions, ownership changes, unapproved publishing and malformed lessons",()=>{
 for(const b of additional){
  const modifications=[
   x=>{x.lesson.sources[0].revision="0".repeat(40);},
   x=>{x.lesson.sources[0].originalEntityId="fake-entity";},
   x=>{x.lesson.sources[0].redistributionVerified=true;},
   x=>{x.lesson.sources[0].editorialReview="approved";},
   x=>{x.lesson.publication="public";},
   x=>{x.lesson.sources[0].rights=x.lesson.languageId==="zh"?"original-owned":"review-required";},
   x=>{x.exercises.pop();}
  ];
  for(const modify of modifications){const candidate=copy(b);modify(candidate);assert.throws(()=>admitInternalPilot(candidate));}
 }
});
test("original/new lesson checkpoint identity is distinct and carries no answers or learner evidence",()=>{
 const all=[...original,...additional];
 for(const lang of ["fr","ja","zh"]){
  const old=original.find(b=>b.lesson.languageId===lang),next=byLang[lang];
  assert.notEqual(checkpointId(old),checkpointId(next));
  const encoded=serializeDemoCheckpoint({[checkpointId(old)]:19,[checkpointId(next)]:6},all);
  assert.equal(parseDemoCheckpoint(encoded,all)[checkpointId(old)],19);
  assert.equal(parseDemoCheckpoint(encoded,all)[checkpointId(next)],6);
  assert.ok(!/"(answer|grade|userId|fsrs|score)":/i.test(encoded));
  let state=createLessonPlayerState(next,8);
  const ex=activeFrame(state).exercise;
  if(ex.kind!=="free-production"){
   state=reduceLessonPlayer(state,{type:"draft",value:ex.acceptedAnswers[0]});
   state=reduceLessonPlayer(state,{type:"submit"});
   assert.equal(activeAttempt(state).outcome.kind,"correct");
   assert.equal(state.attempts[ex.id].submissions,1);
   assert.ok(!JSON.stringify(state).includes("StudyEvents"));
  }
 }
});
