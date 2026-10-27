import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {PHASE22_AUTHORING,compilePinnedSourceIntake} from "../apps/learner/src/source-intake.ts";
import {PHASE23_FRENCH_AUTHORING} from "../apps/learner/src/phase23-french-authoring.ts";
import {PHASE24_JAPANESE_AUTHORING} from "../apps/learner/src/phase24-japanese-authoring.ts";
import {PHASE25_CHINESE_AUTHORING} from "../apps/learner/src/phase25-chinese-authoring.ts";
import {PHASE26_CHINESE_DEPTH} from "../apps/learner/src/phase26-chinese-depth.ts";
import {PHASE27_CHINESE_TRANSFER} from "../apps/learner/src/phase27-chinese-transfer.ts";
import {validateLessonBundleV1} from "../packages/content-schema/src/lesson-v1.ts";
import {framesFor,evaluateExercise,checkpointId,serializeDemoCheckpoint,parseDemoCheckpoint} from "../apps/learner/src/lesson-model.ts";
import {createLessonPlayerState,reduceLessonPlayer,activeAttempt} from "../apps/learner/src/lesson-player.ts";
const read=p=>JSON.parse(readFileSync(fileURLToPath(new URL("../contracts/"+p,import.meta.url)),"utf8"));
const originals=["phase02-source-lessons","phase15-source-lessons","phase17-cross-source-lessons","phase18-next-source-lessons"].flatMap(p=>read("fixtures/"+p+".json").bundles);
const previous=[...PHASE22_AUTHORING,...PHASE23_FRENCH_AUTHORING,...PHASE24_JAPANESE_AUTHORING,...PHASE25_CHINESE_AUTHORING,...PHASE26_CHINESE_DEPTH];
const originalQuotes=read("phase16-source-evidence.json").originalSourceQuotes,readings=read("phase25-chinese-readings.json").readings;
const compiled=()=>compilePinnedSourceIntake(originals,[...previous,...PHASE27_CHINESE_TRANSFER]);

test("four 12-exercise independent transfer lessons preserve all 25 older candidates, twelve canonical lessons and original IDs",()=>{
 const older=compilePinnedSourceIntake(originals,previous),now=compiled();
 assert.deepEqual(older.issues,[]);assert.deepEqual(now.issues,[]);
 assert.equal(older.candidates.length,25);assert.equal(now.candidates.length,29);
 assert.deepEqual(now.candidates.slice(0,25),older.candidates);
 assert.equal(PHASE27_CHINESE_TRANSFER.length,4);
 assert.equal(originals.length,12);
 assert.equal(originals.reduce((n,b)=>n+b.exercises.length,0),126);
 const used=new Set([...originals,...older.candidates].flatMap(b=>b.exercises.map(e=>e.id)));
 for(const b of now.candidates.slice(25)){
  assert.equal(b.lesson.contentVersion,"phase27-chinese-source-authored-internal-v1");
  assert.deepEqual(validateLessonBundleV1(b),[]);
  assert.equal(b.lesson.publication,"internal-fixture");
  assert.equal(b.lesson.languageId,"zh");
  assert.equal(b.exercises.length,12);
  assert.equal(framesFor(b).length,17);
  assert.equal(b.exercises.filter(e=>e.kind==="free-production").length,3);
  assert.ok(b.lesson.sources.every(s=>s.repository==="thiepn/chinese"&&
    s.revision==="9688e7354142b7127fd5f6eb69b03b595a437008"&&s.rights==="review-required"&&
    s.editorialReview==="pending"&&!s.redistributionVerified));
  for(const e of b.exercises){
   assert.equal(used.has(e.id),false);used.add(e.id);
   assert.equal(e.evidence.mayScheduleReview,false);
   assert.equal(e.evidence.mayAssertProficiency,false);
  }
 }
 assert.equal(now.candidates.slice(25).reduce((n,b)=>n+b.exercises.length,0),48);
});

test("source-verified Hanzi and tone-marked Pinyin feed exact written reconstruction, corrected reading and provenance",()=>{
 const {candidates,issues}=compilePinnedSourceIntake(originals,PHASE27_CHINESE_TRANSFER);
 assert.deepEqual(issues,[]);
 for(const [i,spec] of PHASE27_CHINESE_TRANSFER.entries()){
  const bundle=candidates[i];
  const rec=spec.chineseReconstruction;
  for(const entry of spec.encounters){
   const original=originals.find(b=>b.lesson.id===entry.lessonId);
   const example=original.lesson.steps.flatMap(s=>s.type==="encounter"?s.examples:[])
     .find(e=>e.targetText===entry.quote);
   assert.ok(originalQuotes[entry.sourceId].includes(entry.quote));
   assert.equal(example.reading,readings[entry.sourceId][entry.quote]);
   assert.ok(bundle.lesson.steps[0].examples.some(e=>e.targetText===example.targetText&&e.meaning===example.meaning&&e.reading===example.reading));
  }
  const guided=bundle.exercises.find(e=>e.id.endsWith(":guided-reconstruct"));
  const reading=bundle.exercises.find(e=>e.id.endsWith(":independent-role-switch"));
  assert.equal(guided.kind,"typed");
  assert.equal(guided.normalization,"unicode-nfc");
  assert.deepEqual(guided.acceptedAnswers,[rec.reconstruct.quote]);
  assert.equal(guided.sourceAid.targetText,rec.reconstruct.quote);
  assert.equal(evaluateExercise(guided,rec.reconstruct.quote).kind,"correct");
  assert.equal(evaluateExercise(guided,rec.reconstruct.wrongQuote).kind,"incorrect");
  assert.equal(evaluateExercise(guided,rec.reconstruct.wrongQuote).explanation,rec.reconstruct.feedback);
  assert.equal(reading.kind,"reading");
  assert.ok(reading.passage.includes("New changed-role context (not an original source conversation):"));
  assert.ok(reading.passage.includes("Original source snippets and pinned written Pinyin:"));
  assert.equal(reading.sourceAid.targetText,rec.changedContext.correctQuote);
  assert.equal(evaluateExercise(reading,rec.changedContext.correctQuote).kind,"correct");
  assert.equal(evaluateExercise(reading,rec.changedContext.wrongQuote).explanation,rec.changedContext.feedback);
  const tone=bundle.exercises.find(e=>e.id.endsWith(":independent-tone"));
  assert.equal(tone.acceptedAnswers[0],spec.chineseExpansion.tone.reading);
  assert.equal(evaluateExercise(tone,tone.acceptedAnswers[0]).kind,"correct");
  assert.equal(evaluateExercise(tone,tone.acceptedAnswers[0].normalize("NFD").replace(/[\u0300-\u036f]/gu,"")).kind,"incorrect");
 }
});

test("three distinct original player independent dialogue frames support revision with explicit no-grade boundaries",()=>{
 const {candidates,issues}=compilePinnedSourceIntake(originals,PHASE27_CHINESE_TRANSFER);
 assert.deepEqual(issues,[]);
 for(const bundle of candidates){
  const frames=framesFor(bundle);
  const written=frames.filter(frame=>frame.exercise?.kind==="free-production");
  assert.equal(written.length,3);
  for(const frame of written){
   let player=createLessonPlayerState(bundle,frames.findIndex(f=>f.id===frame.id));
   player=reduceLessonPlayer(player,{type:"draft",value:"第一位发言者：你好。我是学生。"});
   player=reduceLessonPlayer(player,{type:"submit"});
   assert.equal(activeAttempt(player).outcome?.kind,"ungraded");
   player=reduceLessonPlayer(player,{type:"revise"});
   player=reduceLessonPlayer(player,{type:"draft",value:"换一位听者，我重新写一段独立对话。"});
   player=reduceLessonPlayer(player,{type:"submit"});
   assert.equal(activeAttempt(player).outcome?.kind,"ungraded");
   assert.equal(activeAttempt(player).submissions,2);
   assert.equal(activeAttempt(player).outcome?.rubric.length,3);
  }
 }
});

test("invented source text, wrong-language authoring, false permissions, wrong-answer collision and tampered reading fail closed",()=>{
 const mutations=[
  x=>{x[0].chineseReconstruction.reconstruct.quote="无来源的词语";},
  x=>{x[1].chineseReconstruction.reconstruct.sourceId="zh-hao-demo";},
  x=>{x[1].chineseReconstruction.reconstruct.wrongQuote=x[1].chineseReconstruction.reconstruct.quote;},
  x=>{x[2].chineseReconstruction.changedContext.wrongQuote=x[2].chineseReconstruction.changedContext.correctQuote;},
  x=>{x[3].chineseReconstruction.changedContext.correctQuote="伪造来源";},
  x=>{x[0].chineseReconstruction.independentDialogue.criteria[0]="";},
  x=>{x[1].chineseExpansion.tone.reading="Ta shi laoshi";},
  x=>{x[2].languageId="ja";}
 ];
 for(const change of mutations){
  const changed=structuredClone(PHASE27_CHINESE_TRANSFER);change(changed);
  assert.ok(compilePinnedSourceIntake(originals,changed).issues.length);
 }
 for(const mutate of [
  rows=>{rows.find(b=>b.lesson.id==="zh:ni-hao:shared-pilot").lesson.sources[0].rights="original-owned";},
  rows=>{rows.find(b=>b.lesson.id==="zh:shi:shared-pilot").lesson.sources[0].redistributionVerified=true;},
  rows=>{rows.find(b=>b.lesson.id==="zh:wo:shared-pilot").lesson.sources[0].revision="0".repeat(40);},
  rows=>{rows.find(b=>b.lesson.id==="zh:wo:shared-pilot").lesson.steps.find(s=>s.type==="encounter").examples[0].reading="wo";}
 ]){
  const changed=structuredClone(originals);mutate(changed);
  assert.ok(compilePinnedSourceIntake(changed,PHASE27_CHINESE_TRANSFER).issues.length);
 }
 const duplicate=compilePinnedSourceIntake(originals,[PHASE27_CHINESE_TRANSFER[0],PHASE27_CHINESE_TRANSFER[0]]);
 assert.ok(duplicate.issues.some(i=>i.issue==="DUPLICATE_OR_EXISTING_LESSON"));
});

test("canonical checkpoints cannot absorb drafts, tones, authority, source rights or editorial candidate progress",()=>{
 const positions=Object.fromEntries(originals.map((b,i)=>[checkpointId(b),Math.min(i,framesFor(b).length)]));
 const serialized=serializeDemoCheckpoint(positions,originals);
 assert.deepEqual(parseDemoCheckpoint(serialized,originals),positions);
 const {candidates,issues}=compiled();assert.deepEqual(issues,[]);
 assert.ok(candidates.every(b=>!Object.hasOwn(positions,checkpointId(b))));
 assert.doesNotMatch(serialized,/"(?:draft|writing|userId|fsrs|officialHskLevel|grade|proficiency|publication|tone|approval)":/);
});
