import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {PHASE22_AUTHORING,compilePinnedSourceIntake} from "../apps/learner/src/source-intake.ts";
import {PHASE23_FRENCH_AUTHORING} from "../apps/learner/src/phase23-french-authoring.ts";
import {validateLessonBundleV1} from "../packages/content-schema/src/lesson-v1.ts";
import {framesFor,evaluateExercise,checkpointId,serializeDemoCheckpoint,parseDemoCheckpoint} from "../apps/learner/src/lesson-model.ts";
import {createLessonPlayerState,reduceLessonPlayer,activeAttempt} from "../apps/learner/src/lesson-player.ts";
const read=p=>JSON.parse(readFileSync(fileURLToPath(new URL("../contracts/"+p,import.meta.url)),"utf8"));
const originals=["phase02-source-lessons","phase15-source-lessons","phase17-cross-source-lessons","phase18-next-source-lessons"].flatMap(p=>read("fixtures/"+p+".json").bundles);
const quotes=read("phase16-source-evidence.json").originalSourceQuotes;

test("six substantive French A1 source-authored lessons extend but never replace existing Phase 22 intake",()=>{
 assert.equal(PHASE22_AUTHORING.length,3);
 assert.equal(PHASE23_FRENCH_AUTHORING.length,6);
 const res=compilePinnedSourceIntake(originals,[...PHASE22_AUTHORING,...PHASE23_FRENCH_AUTHORING]);
 assert.deepEqual(res.issues,[]);
 assert.equal(res.candidates.length,9);
 const french=res.candidates.filter(b=>b.lesson.contentVersion==="phase23-french-source-authored-internal-v1");
 assert.equal(french.length,6);
 assert.equal(new Set(french.map(b=>b.lesson.id)).size,6);
 assert.equal(french.reduce((n,b)=>n+b.exercises.length,0),30);
 const originalExerciseIDs=new Set(originals.flatMap(b=>b.exercises.map(x=>x.id)));
 for(const candidate of french){
  assert.deepEqual(validateLessonBundleV1(candidate),[]);
  assert.equal(candidate.lesson.languageId,"fr");
  assert.equal(candidate.lesson.publication,"internal-fixture");
  assert.equal(candidate.lesson.steps.filter(s=>s.type==="explain").length,3);
  assert.equal(framesFor(candidate).length,10);
  assert.deepEqual(candidate.exercises.map(e=>e.kind),["choice","cloze","reading","choice","free-production"]);
  for(const exercise of candidate.exercises){
   assert.equal(originalExerciseIDs.has(exercise.id),false);
   assert.equal(exercise.evidence.mayScheduleReview,false);
   assert.equal(exercise.evidence.mayAssertProficiency,false);
  }
  assert.ok(candidate.lesson.sources.every(s=>s.repository==="thiepn/french"&&
   s.editorialReview==="pending"&&s.redistributionVerified===false));
  const [choice,cloze,reading,situation,writing]=candidate.exercises;
  assert.equal(choice.sourceComparison.first.targetText,candidate.lesson.steps[0].examples[0].targetText);
  assert.equal(evaluateExercise(cloze,cloze.acceptedAnswers[0]).kind,"correct");
  assert.equal(evaluateExercise(cloze,"incorrect French form").kind,"incorrect");
  assert.equal(evaluateExercise(reading,reading.acceptedAnswers[0]).kind,"correct");
  assert.equal(evaluateExercise(situation,situation.acceptedAnswers[0]).kind,"correct");
  assert.equal(evaluateExercise(writing,"Independently authored dialogue in new context").kind,"ungraded");
 }
});
test("exact source quotes, unaltered meanings and original source revision carry through every French encounter",()=>{
 const res=compilePinnedSourceIntake(originals,PHASE23_FRENCH_AUTHORING);
 assert.deepEqual(res.issues,[]);
 for(const [i,spec] of PHASE23_FRENCH_AUTHORING.entries()){
  const lesson=res.candidates[i];
  for(const item of spec.encounters){
   const original=originals.find(b=>b.lesson.id===item.lessonId);
   const source=original.lesson.sources.find(s=>s.id===item.sourceId);
   const example=original.lesson.steps.flatMap(s=>s.type==="encounter"?s.examples:[]).find(e=>e.targetText===item.quote);
   assert.equal(source.revision,"3fb5c720cfeceaf682ce53c897701b489b7eaf6f");
   assert.ok(quotes[item.sourceId].includes(item.quote));
   assert.ok(lesson.lesson.steps[0].examples.some(e=>e.targetText===item.quote&&e.meaning===example.meaning));
  }
  const cloze=lesson.exercises.find(e=>e.kind==="cloze");
  assert.equal(cloze.before+cloze.acceptedAnswers[0]+cloze.after,spec.frenchExpansion.cloze.quote);
 }
});
test("learner correction through the existing reducer stays ungraded across all six new dialogue prompts",()=>{
 const res=compilePinnedSourceIntake(originals,PHASE23_FRENCH_AUTHORING);
 for(const bundle of res.candidates){
  const i=framesFor(bundle).findIndex(frame=>frame.exercise?.kind==="free-production");
  assert.ok(i>0);
  let player=createLessonPlayerState(bundle,i);
  player=reduceLessonPlayer(player,{type:"draft",value:"Initial learner dialogue"});
  player=reduceLessonPlayer(player,{type:"submit"});
  assert.equal(activeAttempt(player).outcome?.kind,"ungraded");
  player=reduceLessonPlayer(player,{type:"revise"});
  player=reduceLessonPlayer(player,{type:"draft",value:"Changed listener and original response"});
  player=reduceLessonPlayer(player,{type:"submit"});
  assert.equal(activeAttempt(player).outcome?.kind,"ungraded");
  assert.equal(activeAttempt(player).submissions,2);
 }
});
test("rights, source SHA, editorial status, fake source text and wrong cloze fail closed",()=>{
 for(const change of [
  arr=>{arr.find(b=>b.lesson.id==="fr:a1-01:shared-pilot").lesson.sources[0].redistributionVerified=true;},
  arr=>{arr.find(b=>b.lesson.id==="fr:a1-02:shared-pilot").lesson.sources[0].revision="0".repeat(40);},
  arr=>{arr.find(b=>b.lesson.id==="fr:a1-03:shared-pilot").lesson.sources[0].editorialReview="approved";},
  arr=>{arr.find(b=>b.lesson.id==="fr:a1-01:shared-pilot").lesson.steps.find(s=>s.type==="encounter").examples[0].targetText="Fabricated original quotation";}
 ]){
  const modified=structuredClone(originals);change(modified);
  assert.ok(compilePinnedSourceIntake(modified,PHASE23_FRENCH_AUTHORING).issues.length>0);
 }
 const misquoted=structuredClone(PHASE23_FRENCH_AUTHORING);
 misquoted[4].encounters[0].quote="Le livre est magique.";
 assert.ok(compilePinnedSourceIntake(originals,misquoted).issues.some(e=>e.id===misquoted[4].id));
 const cloze=structuredClone(PHASE23_FRENCH_AUTHORING);
 cloze[2].frenchExpansion.cloze.answer="avez";
 assert.ok(compilePinnedSourceIntake(originals,cloze).issues.some(e=>e.issue==="INVALID_FRENCH_SOURCE_EXERCISES"));
 const duplicate=compilePinnedSourceIntake(originals,[PHASE23_FRENCH_AUTHORING[0],PHASE23_FRENCH_AUTHORING[0]]);
 assert.ok(duplicate.issues.some(e=>e.issue==="DUPLICATE_OR_EXISTING_LESSON"));
});
test("original 12 lessons, 126 exercises and checkpoint serialization are untouched",()=>{
 assert.equal(originals.length,12);
 assert.equal(originals.reduce((n,b)=>n+b.exercises.length,0),126);
 const positions=Object.fromEntries(originals.map((b,i)=>[checkpointId(b),Math.min(i,framesFor(b).length)]));
 const encoded=serializeDemoCheckpoint(positions,originals);
 assert.deepEqual(parseDemoCheckpoint(encoded,originals),positions);
 const candidates=compilePinnedSourceIntake(originals,[...PHASE22_AUTHORING,...PHASE23_FRENCH_AUTHORING]).candidates;
 assert.ok(candidates.every(b=>!Object.hasOwn(positions,checkpointId(b))));
 assert.doesNotMatch(encoded,/"(?:draft|grade|score|writing|fsrs|userId)":/);
});
