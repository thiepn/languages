import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {PHASE22_AUTHORING,compilePinnedSourceIntake} from "../apps/learner/src/source-intake.ts";
import {PHASE23_FRENCH_AUTHORING} from "../apps/learner/src/phase23-french-authoring.ts";
import {PHASE24_JAPANESE_AUTHORING} from "../apps/learner/src/phase24-japanese-authoring.ts";
import {validateLessonBundleV1} from "../packages/content-schema/src/lesson-v1.ts";
import {framesFor,evaluateExercise,checkpointId,serializeDemoCheckpoint,parseDemoCheckpoint} from "../apps/learner/src/lesson-model.ts";
import {createLessonPlayerState,reduceLessonPlayer,activeAttempt} from "../apps/learner/src/lesson-player.ts";
const read=p=>JSON.parse(readFileSync(fileURLToPath(new URL("../contracts/"+p,import.meta.url)),"utf8"));
const originals=["phase02-source-lessons","phase15-source-lessons","phase17-cross-source-lessons","phase18-next-source-lessons"].flatMap(p=>read("fixtures/"+p+".json").bundles);
const receipts=read("phase16-source-evidence.json").originalSourceQuotes;
const all=[...PHASE22_AUTHORING,...PHASE23_FRENCH_AUTHORING,...PHASE24_JAPANESE_AUTHORING];

test("15 editorial lessons compile using original Phase 22 compiler and all six new Japanese A1 candidates are distinct",()=>{
 const result=compilePinnedSourceIntake(originals,all);
 assert.deepEqual(result.issues,[]);
 assert.equal(result.candidates.length,15);
 assert.equal(PHASE22_AUTHORING.length,3);
 assert.equal(PHASE23_FRENCH_AUTHORING.length,6);
 assert.equal(PHASE24_JAPANESE_AUTHORING.length,6);
 const japanese=result.candidates.filter(b=>b.lesson.contentVersion==="phase24-japanese-source-authored-internal-v1");
 assert.equal(japanese.length,6);
 assert.equal(new Set(japanese.map(b=>b.lesson.id)).size,6);
 assert.equal(japanese.reduce((n,b)=>n+b.exercises.length,0),30);
 const used=new Set(originals.flatMap(b=>b.exercises.map(e=>e.id)));
 for(const bundle of japanese){
  assert.deepEqual(validateLessonBundleV1(bundle),[]);
  assert.equal(bundle.lesson.languageId,"ja");
  assert.equal(bundle.lesson.publication,"internal-fixture");
  assert.equal(bundle.lesson.steps.filter(s=>s.type==="explain").length,3);
  assert.equal(framesFor(bundle).length,10);
  assert.deepEqual(bundle.exercises.map(e=>e.kind),["choice","cloze","reading","choice","free-production"]);
  assert.ok(bundle.lesson.sources.every(s=>s.repository==="thiepn/japanese"&&
    s.revision==="1e3667ebdcb0cd50491c126b948c11f47414decb"&&
    s.editorialReview==="pending"&&!s.redistributionVerified));
  for(const e of bundle.exercises){
   assert.ok(!used.has(e.id));used.add(e.id);
   assert.equal(e.evidence.mayScheduleReview,false);
   assert.equal(e.evidence.mayAssertProficiency,false);
  }
  const [guided,cloze,reading,choice,writing]=bundle.exercises;
  assert.equal(guided.sourceComparison.first.targetText,bundle.lesson.steps[0].examples[0].targetText);
  assert.equal(cloze.normalization,"japanese-terminal-punctuation");
  assert.equal(evaluateExercise(cloze,cloze.acceptedAnswers[0]).kind,"correct");
  assert.equal(evaluateExercise(cloze,"きょうは").kind,"incorrect");
  assert.equal(evaluateExercise(reading,reading.acceptedAnswers[0]).kind,"correct");
  assert.equal(evaluateExercise(choice,choice.acceptedAnswers[0]).kind,"correct");
  assert.equal(evaluateExercise(writing,"Independent Japanese dialogue for another addressee").kind,"ungraded");
 }
});

test("Japanese kana/kanji source labels retain original quoted context and unchanged source meanings",()=>{
 const r=compilePinnedSourceIntake(originals,PHASE24_JAPANESE_AUTHORING);
 assert.deepEqual(r.issues,[]);
 for(const [i,spec] of PHASE24_JAPANESE_AUTHORING.entries()){
  const bundle=r.candidates[i];
  for(const row of spec.encounters){
   const sourceLesson=originals.find(b=>b.lesson.id===row.lessonId);
   const original=sourceLesson.lesson.steps.flatMap(s=>s.type==="encounter"?s.examples:[]).find(e=>e.targetText===row.quote);
   assert.ok(original,row.quote);
   assert.ok(receipts[row.sourceId]?.includes(row.quote));
   assert.ok(bundle.lesson.steps[0].examples.some(e=>e.targetText===original.targetText&&e.meaning===original.meaning));
  }
  const cloze=bundle.exercises.find(e=>e.kind==="cloze");
  assert.equal(cloze.before+cloze.acceptedAnswers[0]+cloze.after,spec.japaneseExpansion.cloze.quote);
  assert.ok(spec.transferSituation.length>70&&spec.japaneseExpansion.grammarExplanation.length>80);
 }
});

test("Japanese original player retains ungraded independent writing across learner-controlled revision",()=>{
 const {candidates,issues}=compilePinnedSourceIntake(originals,PHASE24_JAPANESE_AUTHORING);
 assert.deepEqual(issues,[]);
 for(const bundle of candidates){
  const at=framesFor(bundle).findIndex(f=>f.exercise?.kind==="free-production");
  assert.ok(at>0);
  let state=createLessonPlayerState(bundle,at);
  state=reduceLessonPlayer(state,{type:"draft",value:"自分の名前で挨拶を書きます。"});
  state=reduceLessonPlayer(state,{type:"submit"});
  assert.equal(activeAttempt(state).outcome?.kind,"ungraded");
  state=reduceLessonPlayer(state,{type:"revise"});
  state=reduceLessonPlayer(state,{type:"draft",value:"違う場面で丁寧に書き直します。"});
  state=reduceLessonPlayer(state,{type:"submit"});
  assert.equal(activeAttempt(state).outcome?.kind,"ungraded");
  assert.equal(activeAttempt(state).submissions,2);
 }
});

test("Japanese source/rights drift, fabricated kana, cloze tampering, duplicate IDs and language substitution fail closed",()=>{
 const mutations=[
  items=>{items.find(b=>b.lesson.id==="ja:cf-a1-01-01:shared-pilot").lesson.sources[0].revision="0".repeat(40);},
  items=>{items.find(b=>b.lesson.id==="ja:cf-a1-01-02:shared-pilot").lesson.sources[0].redistributionVerified=true;},
  items=>{items.find(b=>b.lesson.id==="ja:cf-a1-01-03:shared-pilot").lesson.sources[0].editorialReview="approved";},
  items=>{items.find(b=>b.lesson.id==="ja:cf-a1-01-03:shared-pilot").lesson.sources[0].rights="review-required";},
  items=>{items.find(b=>b.lesson.id==="ja:cf-a1-01-02:shared-pilot").lesson.sources[0].originalEntityId="fabricated-entity";},
  items=>{items.find(b=>b.lesson.id==="ja:cf-a1-01-01:shared-pilot").lesson.sources[0].path="apps/web/src/study/fabricated.ts";},
  items=>{items.find(b=>b.lesson.id==="ja:cf-a1-01-01:shared-pilot").lesson.steps.find(s=>s.type==="encounter").examples[0].targetText="朝：架空の挨拶。";}
 ];
 for(const mutate of mutations){
  const changed=structuredClone(originals);mutate(changed);
  assert.ok(compilePinnedSourceIntake(changed,PHASE24_JAPANESE_AUTHORING).issues.length>0);
 }
 const text=structuredClone(PHASE24_JAPANESE_AUTHORING);
 text[1].encounters[0].quote="夜：架空の挨拶。";
 assert.ok(compilePinnedSourceIntake(originals,text).issues.some(i=>i.id===text[1].id));
 const cloze=structuredClone(PHASE24_JAPANESE_AUTHORING);
 cloze[3].japaneseExpansion.cloze.answer="でございます";
 assert.ok(compilePinnedSourceIntake(originals,cloze).issues.some(i=>i.issue==="INVALID_JAPANESE_SOURCE_EXERCISES"));
 const lang=structuredClone(PHASE24_JAPANESE_AUTHORING);
 lang[2].languageId="fr";
 assert.ok(compilePinnedSourceIntake(originals,lang).issues.length>0);
 const duplicates=compilePinnedSourceIntake(originals,[PHASE24_JAPANESE_AUTHORING[0],PHASE24_JAPANESE_AUTHORING[0]]);
 assert.ok(duplicates.issues.some(i=>i.issue==="DUPLICATE_OR_EXISTING_LESSON"));
});

test("original 12 lessons, 126 exercises and version-scoped checkpoints remain unchanged and separate from new Japanese drafts",()=>{
 assert.equal(originals.length,12);
 assert.equal(originals.reduce((n,b)=>n+b.exercises.length,0),126);
 const positions=Object.fromEntries(originals.map((b,i)=>[checkpointId(b),Math.min(i,framesFor(b).length)]));
 const serialized=serializeDemoCheckpoint(positions,originals);
 assert.deepEqual(parseDemoCheckpoint(serialized,originals),positions);
 const {candidates}=compilePinnedSourceIntake(originals,all);
 assert.ok(candidates.every(c=>!Object.hasOwn(positions,checkpointId(c))));
 assert.doesNotMatch(serialized,/"(?:grade|proficiency|fsrs|draft|writing|userId)":/);
});
