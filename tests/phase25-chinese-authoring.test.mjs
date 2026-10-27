import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {PHASE22_AUTHORING,compilePinnedSourceIntake} from "../apps/learner/src/source-intake.ts";
import {PHASE23_FRENCH_AUTHORING} from "../apps/learner/src/phase23-french-authoring.ts";
import {PHASE24_JAPANESE_AUTHORING} from "../apps/learner/src/phase24-japanese-authoring.ts";
import {PHASE25_CHINESE_AUTHORING} from "../apps/learner/src/phase25-chinese-authoring.ts";
import {validateLessonBundleV1} from "../packages/content-schema/src/lesson-v1.ts";
import {framesFor,evaluateExercise,checkpointId,serializeDemoCheckpoint,parseDemoCheckpoint} from "../apps/learner/src/lesson-model.ts";
import {createLessonPlayerState,reduceLessonPlayer,activeAttempt} from "../apps/learner/src/lesson-player.ts";
const read=p=>JSON.parse(readFileSync(fileURLToPath(new URL("../contracts/"+p,import.meta.url)),"utf8"));
const originals=["phase02-source-lessons","phase15-source-lessons","phase17-cross-source-lessons","phase18-next-source-lessons"].flatMap(p=>read("fixtures/"+p+".json").bundles);
const quotes=read("phase16-source-evidence.json").originalSourceQuotes;
const full=[...PHASE22_AUTHORING,...PHASE23_FRENCH_AUTHORING,...PHASE24_JAPANESE_AUTHORING,...PHASE25_CHINESE_AUTHORING];

test("six new substantive source-pinned Chinese lessons compile beside all 15 prior candidates, never into canonical catalog",()=>{
 assert.equal(PHASE25_CHINESE_AUTHORING.length,6);
 const intake=compilePinnedSourceIntake(originals,full);
 assert.deepEqual(intake.issues,[]);
 assert.equal(intake.candidates.length,21);
 const chinese=intake.candidates.filter(x=>x.lesson.contentVersion==="phase25-chinese-source-authored-internal-v1");
 assert.equal(chinese.length,6);
 assert.equal(new Set(chinese.map(x=>x.lesson.id)).size,6);
 assert.equal(chinese.reduce((n,x)=>n+x.exercises.length,0),36);
 const oldIds=new Set(originals.flatMap(x=>x.exercises.map(e=>e.id)));
 for(const bundle of chinese){
  assert.deepEqual(validateLessonBundleV1(bundle),[]);
  assert.equal(bundle.lesson.publication,"internal-fixture");
  assert.equal(bundle.lesson.languageId,"zh");
  assert.equal(bundle.lesson.steps.filter(s=>s.type==="explain").length,3);
  assert.equal(framesFor(bundle).length,11);
  assert.deepEqual(bundle.exercises.map(e=>e.kind),["choice",bundle.lesson.id.match(/greeting-addressee|possession-and-role|affirm-negate-also/)?"typed":"cloze","reading","choice","typed","free-production"]);
  assert.ok(bundle.lesson.sources.every(s=>s.repository==="thiepn/chinese"&&
    s.revision==="9688e7354142b7127fd5f6eb69b03b595a437008"&&
    s.rights==="review-required"&&s.editorialReview==="pending"&&!s.redistributionVerified));
  for(const exercise of bundle.exercises){
   assert.equal(oldIds.has(exercise.id),false);
   assert.equal(exercise.evidence.mayScheduleReview,false);
   assert.equal(exercise.evidence.mayAssertProficiency,false);
  }
  const [recognition,cloze,reading,situation,tone,writing]=bundle.exercises;
  assert.ok(recognition.sourceComparison);
  assert.equal(evaluateExercise(recognition,recognition.acceptedAnswers[0]).kind,"correct");
  assert.equal(evaluateExercise(cloze,cloze.acceptedAnswers[0]).kind,"correct");
  assert.equal(evaluateExercise(reading,reading.acceptedAnswers[0]).kind,"correct");
  assert.equal(evaluateExercise(situation,situation.acceptedAnswers[0]).kind,"correct");
  assert.equal(tone.normalization,"pinyin-tone-marked");
  assert.equal(tone.evidence.classification,"formative-recall");
  assert.equal(evaluateExercise(tone,tone.acceptedAnswers[0]).kind,"correct");
  assert.equal(evaluateExercise(tone,tone.acceptedAnswers[0].normalize("NFD").replace(/[\u0300-\u036f]/gu,"")).kind,"incorrect");
  assert.ok(reading.reading.includes("ǐ")||reading.reading.includes("ǎ")||reading.reading.includes("ì"));
  assert.equal(evaluateExercise(writing,"Learner-authored Mandarin exchange in a different context").kind,"ungraded");
 }
});
test("every Chinese encounter retains its original Hanzi, original tone-marked reading and original source meaning",()=>{
 const built=compilePinnedSourceIntake(originals,PHASE25_CHINESE_AUTHORING);
 assert.deepEqual(built.issues,[]);
 for(const [i,spec] of PHASE25_CHINESE_AUTHORING.entries()){
  const bundle=built.candidates[i];
  for(const encounter of spec.encounters){
   const source=originals.find(b=>b.lesson.id===encounter.lessonId);
   const original=source.lesson.steps.flatMap(s=>s.type==="encounter"?s.examples:[])
     .find(ex=>ex.targetText===encounter.quote);
   assert.ok(original?.reading,encounter.quote);
   assert.ok(quotes[encounter.sourceId]?.includes(encounter.quote));
   const inserted=bundle.lesson.steps[0].examples.find(ex=>ex.targetText===encounter.quote);
   assert.equal(inserted.meaning,original.meaning);
   assert.equal(inserted.reading,original.reading);
  }
  const [{},cloze,reading,,tone]=bundle.exercises;
  if(cloze.kind==="cloze")assert.equal(cloze.before+cloze.acceptedAnswers[0]+cloze.after,spec.chineseExpansion.cloze.quote);
  else{
   assert.equal(cloze.kind,"typed");
   assert.deepEqual(cloze.acceptedAnswers,[spec.chineseExpansion.cloze.quote]);
  }
  assert.equal(cloze.sourceAid.targetText,spec.chineseExpansion.cloze.quote);
  assert.equal(tone.sourceAid.targetText,spec.chineseExpansion.tone.quote);
  assert.equal(tone.acceptedAnswers[0],spec.chineseExpansion.tone.reading);
  assert.ok(reading.reading.includes(" · "));
 }
});
test("real Phase 05 reducer preserves first draft and ungraded self-revision across six Chinese original dialogue tasks",()=>{
 const res=compilePinnedSourceIntake(originals,PHASE25_CHINESE_AUTHORING);
 assert.deepEqual(res.issues,[]);
 for(const bundle of res.candidates){
  const idx=framesFor(bundle).findIndex(x=>x.exercise?.kind==="free-production");
  assert.ok(idx>0);
  let player=createLessonPlayerState(bundle,idx);
  player=reduceLessonPlayer(player,{type:"draft",value:"我写的第一段话。"});
  player=reduceLessonPlayer(player,{type:"submit"});
  assert.equal(activeAttempt(player).outcome?.kind,"ungraded");
  player=reduceLessonPlayer(player,{type:"revise"});
  player=reduceLessonPlayer(player,{type:"draft",value:"我修改自己的练习。"});
  player=reduceLessonPlayer(player,{type:"submit"});
  assert.equal(activeAttempt(player).outcome?.kind,"ungraded");
  assert.equal(activeAttempt(player).submissions,2);
 }
});
test("rights, location, source receipts, tone marks and HSK claims cannot be laundered through candidate intake",()=>{
 const mutations=[
  x=>{x.find(b=>b.lesson.id==="zh:wo:shared-pilot").lesson.sources[0].revision="0".repeat(40);},
  x=>{x.find(b=>b.lesson.id==="zh:ni-hao:shared-pilot").lesson.sources[0].rights="original-owned";},
  x=>{x.find(b=>b.lesson.id==="zh:shi:shared-pilot").lesson.sources[0].redistributionVerified=true;},
  x=>{x.find(b=>b.lesson.id==="zh:shi:shared-pilot").lesson.sources[0].editorialReview="approved";},
  x=>{x.find(b=>b.lesson.id==="zh:ni-hao:shared-pilot").lesson.sources[0].path="src/unapproved-replacement.mjs";},
  x=>{x.find(b=>b.lesson.id==="zh:wo:shared-pilot").lesson.sources[0].originalEntityId="fabricated";},
  x=>{x.find(b=>b.lesson.id==="zh:ni-hao:shared-pilot").lesson.steps.find(s=>s.type==="encounter").examples[0].reading="ni hao";},
  x=>{x.find(b=>b.lesson.id==="zh:shi:shared-pilot").lesson.publication="public";}
 ];
 for(const mutation of mutations){
  const modified=structuredClone(originals);mutation(modified);
  assert.ok(compilePinnedSourceIntake(modified,PHASE25_CHINESE_AUTHORING).issues.length>0);
 }
 const edited=structuredClone(PHASE25_CHINESE_AUTHORING);
 edited[0].chineseExpansion.tone.reading="ni hao";
 assert.ok(compilePinnedSourceIntake(originals,edited).issues.some(i=>i.issue==="INVALID_CHINESE_TONE_SOURCE"));
 const invent=structuredClone(PHASE25_CHINESE_AUTHORING);
 invent[4].encounters[1].quote="没有来源的对话。";
 assert.ok(compilePinnedSourceIntake(originals,invent).issues.some(i=>i.id===invent[4].id));
 const lang=structuredClone(PHASE25_CHINESE_AUTHORING);
 lang[0].languageId="ja";
 assert.ok(compilePinnedSourceIntake(originals,lang).issues.length>0);
 const repeated=compilePinnedSourceIntake(originals,[PHASE25_CHINESE_AUTHORING[0],PHASE25_CHINESE_AUTHORING[0]]);
 assert.ok(repeated.issues.some(i=>i.issue==="DUPLICATE_OR_EXISTING_LESSON"));
});
test("12 original source lessons and 126 activities still own their original version-scoped checkpoints",()=>{
 assert.equal(originals.length,12);
 assert.equal(originals.reduce((n,x)=>n+x.exercises.length,0),126);
 const positions=Object.fromEntries(originals.map((b,i)=>[checkpointId(b),Math.min(i,framesFor(b).length)]));
 const encoded=serializeDemoCheckpoint(positions,originals);
 assert.deepEqual(parseDemoCheckpoint(encoded,originals),positions);
 const candidates=compilePinnedSourceIntake(originals,full).candidates;
 assert.equal(candidates.length,21);
 assert.ok(candidates.every(c=>!Object.hasOwn(positions,checkpointId(c))));
 assert.doesNotMatch(encoded,/"(?:mastery|grade|proficiency|officialHskLevel|fsrs|draft|writing|userId)":/);
});
