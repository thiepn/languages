import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {PHASE22_AUTHORING,compilePinnedSourceIntake} from "../apps/learner/src/source-intake.ts";
import {PHASE23_FRENCH_AUTHORING} from "../apps/learner/src/phase23-french-authoring.ts";
import {PHASE24_JAPANESE_AUTHORING} from "../apps/learner/src/phase24-japanese-authoring.ts";
import {PHASE25_CHINESE_AUTHORING} from "../apps/learner/src/phase25-chinese-authoring.ts";
import {PHASE26_CHINESE_DEPTH} from "../apps/learner/src/phase26-chinese-depth.ts";
import {validateLessonBundleV1} from "../packages/content-schema/src/lesson-v1.ts";
import {framesFor,evaluateExercise,checkpointId,serializeDemoCheckpoint,parseDemoCheckpoint} from "../apps/learner/src/lesson-model.ts";
import {createLessonPlayerState,reduceLessonPlayer,activeAttempt} from "../apps/learner/src/lesson-player.ts";
const read=p=>JSON.parse(readFileSync(fileURLToPath(new URL("../contracts/"+p,import.meta.url)),"utf8"));
const originals=["phase02-source-lessons","phase15-source-lessons","phase17-cross-source-lessons","phase18-next-source-lessons"].flatMap(p=>read("fixtures/"+p+".json").bundles);
const old=[...PHASE22_AUTHORING,...PHASE23_FRENCH_AUTHORING,...PHASE24_JAPANESE_AUTHORING,...PHASE25_CHINESE_AUTHORING];
const all=[...old,...PHASE26_CHINESE_DEPTH];
const originalQuotes=read("phase16-source-evidence.json").originalSourceQuotes;
const readings=read("phase25-chinese-readings.json").readings;

test("Phase 26 adds four 9-exercise Chinese source-owned reading/repair/rewrite lessons without changing 21 previous candidates",()=>{
 const before=compilePinnedSourceIntake(originals,old);
 const after=compilePinnedSourceIntake(originals,all);
 assert.deepEqual(before.issues,[]);
 assert.deepEqual(after.issues,[]);
 assert.equal(before.candidates.length,21);
 assert.equal(after.candidates.length,25);
 assert.deepEqual(after.candidates.slice(0,21),before.candidates);
 assert.equal(PHASE26_CHINESE_DEPTH.length,4);
 const depth=after.candidates.slice(21);
 assert.equal(depth.reduce((sum,b)=>sum+b.exercises.length,0),36);
 assert.equal(new Set(depth.map(b=>b.lesson.id)).size,4);
 const existingIds=new Set([...originals,...before.candidates].flatMap(b=>b.exercises.map(e=>e.id)));
 for(const bundle of depth){
  assert.deepEqual(validateLessonBundleV1(bundle),[]);
  assert.equal(bundle.lesson.contentVersion,"phase26-chinese-source-authored-internal-v1");
  assert.equal(bundle.lesson.languageId,"zh");
  assert.equal(bundle.lesson.publication,"internal-fixture");
  assert.equal(framesFor(bundle).length,14);
  assert.equal(bundle.exercises.length,9);
  assert.deepEqual(bundle.exercises.map(e=>e.kind).filter(x=>x==="free-production"),["free-production","free-production"]);
  assert.ok(bundle.lesson.sources.every(s=>s.repository==="thiepn/chinese"&&
    s.revision==="9688e7354142b7127fd5f6eb69b03b595a437008"&&
    s.rights==="review-required"&&s.editorialReview==="pending"&&!s.redistributionVerified));
  for(const ex of bundle.exercises){
   assert.ok(!existingIds.has(ex.id));
   existingIds.add(ex.id);
   assert.equal(ex.evidence.mayScheduleReview,false);
   assert.equal(ex.evidence.mayAssertProficiency,false);
  }
 }
});
test("source-specific wrong answers give their own observed corrective feedback and independently cite original source expressions",()=>{
 const result=compilePinnedSourceIntake(originals,PHASE26_CHINESE_DEPTH);
 assert.deepEqual(result.issues,[]);
 for(const [i,b] of result.candidates.entries()){
  const spec=PHASE26_CHINESE_DEPTH[i];
  const guided=b.exercises.find(e=>e.id.endsWith(":guided-repair"));
  const reading=b.exercises.find(e=>e.id.endsWith(":independent-context-reading"));
  for(const [exercise,repair] of [[guided,spec.chineseDepth.guidedRepair],[reading,spec.chineseDepth.readingRepair]]){
   assert.ok(exercise);
   assert.equal(evaluateExercise(exercise,repair.wrongQuote).kind,"incorrect");
   assert.equal(evaluateExercise(exercise,repair.wrongQuote).explanation,repair.feedback);
   assert.equal(evaluateExercise(exercise,repair.correctQuote).kind,"correct");
   assert.equal(exercise.sourceAid.targetText,repair.correctQuote);
   assert.ok(exercise.sourceComparison===undefined||exercise.sourceComparison.first.targetText===repair.correctQuote);
   const original=b.lesson.steps[0].examples.find(e=>e.targetText===repair.correctQuote);
   assert.equal(exercise.sourceAid.meaning,original.meaning);
   assert.ok(b.lesson.sourceIds.every(id=>originalQuotes[id]));
  }
  assert.ok(reading.passage.includes("New practice situation (not a source transcript):"));
  assert.ok(reading.passage.includes("Original source excerpts:"));
  for(const encounter of spec.encounters){
   assert.ok(originalQuotes[encounter.sourceId].includes(encounter.quote));
   const r=readings[encounter.sourceId]?.[encounter.quote];
   assert.ok(r&&reading.passage.includes(r),encounter.quote);
  }
 }
});
test("original player supports two distinct learner-authored Chinese dialogues with independent revision and no grades",()=>{
 const compiled=compilePinnedSourceIntake(originals,PHASE26_CHINESE_DEPTH);
 assert.deepEqual(compiled.issues,[]);
 for(const bundle of compiled.candidates){
  const writingFrames=framesFor(bundle).filter(f=>f.exercise?.kind==="free-production");
  assert.equal(writingFrames.length,2);
  for(const frame of writingFrames){
   const idx=framesFor(bundle).findIndex(f=>f.id===frame.id);
   let player=createLessonPlayerState(bundle,idx);
   player=reduceLessonPlayer(player,{type:"draft",value:"你好。我是学生。"});
   player=reduceLessonPlayer(player,{type:"submit"});
   assert.equal(activeAttempt(player).outcome?.kind,"ungraded");
   player=reduceLessonPlayer(player,{type:"revise"});
   player=reduceLessonPlayer(player,{type:"draft",value:"我修改了对话，考虑另一位读者。"});
   player=reduceLessonPlayer(player,{type:"submit"});
   assert.equal(activeAttempt(player).outcome?.kind,"ungraded");
   assert.equal(activeAttempt(player).submissions,2);
   assert.equal(activeAttempt(player).outcome?.rubric.length,3);
  }
 }
});
test("source drift, fabricated Hanzi or Pinyin, wrong-answer collisions and invented repair sources fail closed",()=>{
 const tests=[
   list=>{list[0].chineseDepth.guidedRepair.correctQuote="无来源";},
   list=>{list[1].chineseDepth.guidedRepair.wrongQuote=list[1].chineseDepth.guidedRepair.correctQuote;},
   list=>{list[2].chineseDepth.readingRepair.wrongQuote="自编句子";},
   list=>{list[3].chineseDepth.writingTransfer.criteria[0]="";},
   list=>{list[0].chineseExpansion.tone.reading="ni hao";},
   list=>{list[2].chineseDepth.readingRepair.correctQuote="你们之后";},
   list=>{list[2].languageId="fr";}
 ];
 for(const change of tests){
  const changed=structuredClone(PHASE26_CHINESE_DEPTH);change(changed);
  assert.ok(compilePinnedSourceIntake(originals,changed).issues.length>0);
 }
 for(const change of [
  arr=>{arr.find(b=>b.lesson.id==="zh:ni-hao:shared-pilot").lesson.sources[0].revision="0".repeat(40);},
  arr=>{arr.find(b=>b.lesson.id==="zh:shi:shared-pilot").lesson.sources[0].redistributionVerified=true;},
  arr=>{arr.find(b=>b.lesson.id==="zh:wo:shared-pilot").lesson.sources[0].rights="original-owned";},
  arr=>{arr.find(b=>b.lesson.id==="zh:ni-hao:shared-pilot").lesson.steps.find(s=>s.type==="encounter").examples[0].reading="ni hao";}
 ]){
  const altered=structuredClone(originals);change(altered);
  assert.ok(compilePinnedSourceIntake(altered,PHASE26_CHINESE_DEPTH).issues.length>0);
 }
 const duplicate=compilePinnedSourceIntake(originals,[PHASE26_CHINESE_DEPTH[0],PHASE26_CHINESE_DEPTH[0]]);
 assert.ok(duplicate.issues.some(e=>e.issue==="DUPLICATE_OR_EXISTING_LESSON"));
});
test("existing 12 original lessons, 126 original exercises and checkpoint-only serialization are unchanged",()=>{
 assert.equal(originals.length,12);
 assert.equal(originals.reduce((n,b)=>n+b.exercises.length,0),126);
 const positions=Object.fromEntries(originals.map((b,i)=>[checkpointId(b),Math.min(i,framesFor(b).length)]));
 const saved=serializeDemoCheckpoint(positions,originals);
 assert.deepEqual(parseDemoCheckpoint(saved,originals),positions);
 const {candidates,issues}=compilePinnedSourceIntake(originals,all);
 assert.deepEqual(issues,[]);
 assert.ok(candidates.every(b=>!Object.hasOwn(positions,checkpointId(b))));
 assert.doesNotMatch(saved,/"(?:draft|writing|userId|fsrs|officialHsk|grade|proficiency)":/);
});
