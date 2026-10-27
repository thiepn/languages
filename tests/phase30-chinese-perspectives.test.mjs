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
import {PHASE28_CHINESE_SEQUENCES} from "../apps/learner/src/phase28-chinese-sequences.ts";
import {PHASE29_CHINESE_CONVERSATIONS} from "../apps/learner/src/phase29-chinese-conversations.ts";
import {PHASE30_CHINESE_PERSPECTIVES} from "../apps/learner/src/phase30-chinese-perspectives.ts";
import {validateLessonBundleV1} from "../packages/content-schema/src/lesson-v1.ts";
import {framesFor,evaluateExercise,checkpointId,serializeDemoCheckpoint,parseDemoCheckpoint} from "../apps/learner/src/lesson-model.ts";
import {createLessonPlayerState,reduceLessonPlayer,activeAttempt} from "../apps/learner/src/lesson-player.ts";
const read=p=>JSON.parse(readFileSync(fileURLToPath(new URL("../contracts/"+p,import.meta.url)),"utf8"));
const originals=["phase02-source-lessons","phase15-source-lessons","phase17-cross-source-lessons","phase18-next-source-lessons"].flatMap(n=>read("fixtures/"+n+".json").bundles);
const old=[...PHASE22_AUTHORING,...PHASE23_FRENCH_AUTHORING,...PHASE24_JAPANESE_AUTHORING,...PHASE25_CHINESE_AUTHORING,...PHASE26_CHINESE_DEPTH,...PHASE27_CHINESE_TRANSFER,...PHASE28_CHINESE_SEQUENCES,...PHASE29_CHINESE_CONVERSATIONS];
const phase30=PHASE30_CHINESE_PERSPECTIVES;
const pin=read("phase25-chinese-readings.json"),quotes=read("phase16-source-evidence.json").originalSourceQuotes;
const build=(spec=phase30,bundles=originals)=>compilePinnedSourceIntake(bundles,spec);
test("Phase 30 retains 37 exact original candidate bundles, adds four 23-activity Chinese lessons and keeps canonical 12/126",()=>{
 const prev=build(old),now=build([...old,...phase30]);
 assert.deepEqual(prev.issues,[]);assert.deepEqual(now.issues,[]);
 assert.equal(prev.candidates.length,37);assert.equal(now.candidates.length,41);
 assert.deepEqual(now.candidates.slice(0,37),prev.candidates);
 assert.equal(originals.length,12);
 assert.equal(originals.reduce((n,b)=>n+b.exercises.length,0),126);
 assert.equal(phase30.length,4);
 const ids=new Set([...originals,...prev.candidates].flatMap(b=>b.exercises.map(e=>e.id)));
 for(const b of now.candidates.slice(37)){
  assert.equal(b.lesson.languageId,"zh");
  assert.equal(b.lesson.publication,"internal-fixture");
  assert.equal(b.lesson.contentVersion,"phase30-chinese-source-authored-internal-v1");
  assert.deepEqual(validateLessonBundleV1(b),[]);
  assert.equal(b.exercises.length,23);
  assert.equal(framesFor(b).length,28);
  assert.equal(b.exercises.filter(e=>e.kind==="free-production").length,6);
  assert.ok(b.lesson.sources.every(s=>s.repository===pin.sourceRepository&&
   s.path===pin.sourcePath&&s.revision===pin.sourceRevision&&s.editorialReview==="pending"&&
   s.rights==="review-required"&&!s.redistributionVerified));
  for(const ex of b.exercises){
   assert.ok(!ids.has(ex.id),ex.id);ids.add(ex.id);
   assert.equal(ex.evidence.mayScheduleReview,false);
   assert.equal(ex.evidence.mayAssertProficiency,false);
  }
 }
 assert.equal(now.candidates.slice(37).reduce((n,b)=>n+b.exercises.length,0),92);
});
test("original Hanzi, Pinyin manifest, exact source IDs and independent second tone exercise are source-attested",()=>{
 const {issues,candidates}=build();assert.deepEqual(issues,[]);
 for(const [i,b] of candidates.entries()){
  const spec=phase30[i];
  for(const ref of spec.encounters){
   assert.ok(quotes[ref.sourceId].includes(ref.quote));
   const origin=originals.find(l=>l.lesson.id===ref.lessonId);
   const ex=origin.lesson.steps.flatMap(x=>x.type==="encounter"?x.examples:[]).find(x=>x.targetText===ref.quote);
   assert.equal(ex.reading,pin.readings[ref.sourceId][ref.quote]);
   assert.ok(b.lesson.steps[0].examples.some(x=>x.targetText===ex.targetText&&x.reading===ex.reading&&x.meaning===ex.meaning));
  }
  const p=spec.chinesePerspective.secondPinyin,ex=b.exercises.find(e=>e.id.endsWith(":independent-second-pinyin"));
  assert.equal(ex.kind,"typed");assert.equal(ex.normalization,"pinyin-tone-marked");
  assert.deepEqual(ex.acceptedAnswers,[p.reading]);
  assert.equal(ex.sourceAid.targetText,p.quote);
  assert.equal(pin.readings[p.sourceId][p.quote],p.reading);
  assert.notEqual(spec.chineseExpansion.tone.quote,p.quote);
  assert.equal(evaluateExercise(ex,p.reading).kind,"correct");
  assert.equal(evaluateExercise(ex,p.reading.normalize("NFD").replace(/[\u0300-\u036f]/gu,"")).kind,"incorrect");
 }
});
test("changed listener and changed-purpose reading have exact source-specific failure explanation and source aid",()=>{
 const {issues,candidates}=build();assert.deepEqual(issues,[]);
 for(const [i,b] of candidates.entries()){
  const p=phase30[i].chinesePerspective;
  for(const [id,v] of [[":guided-final-repair",p.changedListener],[":independent-after-switch-reading",p.laterReading]]){
   const ex=b.exercises.find(e=>e.id.endsWith(id));
   assert.ok(ex);
   assert.equal(evaluateExercise(ex,v.correctQuote).kind,"correct");
   const result=evaluateExercise(ex,v.wrongQuote);
   assert.equal(result.kind,"incorrect");assert.equal(result.explanation,v.feedback);
   assert.equal(ex.sourceAid.targetText,v.correctQuote);
   if(ex.kind==="reading"){
    assert.ok(ex.passage.startsWith("New independent scene with a changed listener (not a source transcript):"));
    for(const source of b.lesson.steps[0].examples)
     assert.ok(ex.passage.includes(source.targetText+" — "+source.reading));
   }
  }
 }
});
test("all six ungraded independent dialogues preserve original player submission/revision authority",()=>{
 const {issues,candidates}=build();assert.deepEqual(issues,[]);
 for(const b of candidates){
  const frames=framesFor(b);
  const production=frames.filter(f=>f.exercise?.kind==="free-production");
  assert.equal(production.length,6);
  for(const f of production){
   let player=createLessonPlayerState(b,frames.findIndex(x=>x.id===f.id));
   player=reduceLessonPlayer(player,{type:"draft",value:"新说话人：我和我们重新安排说话顺序。"});
   player=reduceLessonPlayer(player,{type:"submit"});
   assert.equal(activeAttempt(player).outcome?.kind,"ungraded");
   player=reduceLessonPlayer(player,{type:"revise"});
   player=reduceLessonPlayer(player,{type:"draft",value:"换个听者重新写一篇练习，不冒充原文。"});
   player=reduceLessonPlayer(player,{type:"submit"});
   assert.equal(activeAttempt(player).outcome?.kind,"ungraded");
   assert.equal(activeAttempt(player).submissions,2);
   assert.equal(activeAttempt(player).outcome?.rubric.length,3);
  }
 }
});
test("wrong source, source permissions, wrong Pinyin, answer collisions and invented scenarios fail closed",()=>{
 const mutations=[
  x=>{x[0].chinesePerspective.changedListener.correctQuote="不存在的来源";},
  x=>{x[0].chinesePerspective.changedListener.wrongQuote=x[0].chinesePerspective.changedListener.correctQuote;},
  x=>{x[1].chinesePerspective.laterReading.wrongQuote=x[1].chinesePerspective.laterReading.correctQuote;},
  x=>{x[1].chinesePerspective.laterReading.feedback="";},
  x=>{x[2].chinesePerspective.secondPinyin.reading="bu shi";},
  x=>{x[2].chinesePerspective.secondPinyin.sourceId="zh-wo-demo";},
  x=>{x[3].chinesePerspective.secondPinyin.quote=x[3].chineseExpansion.tone.quote;},
  x=>{x[3].chinesePerspective.sixthDialogue.criteria[2]="";},
  x=>{x[0].languageId="fr";}
 ];
 for(const fn of mutations){const clone=structuredClone(phase30);fn(clone);assert.ok(build(clone).issues.length);}
 for(const fn of [
  a=>{a.find(b=>b.lesson.id==="zh:wo:shared-pilot").lesson.sources[0].rights="original-owned";},
  a=>{a.find(b=>b.lesson.id==="zh:shi:shared-pilot").lesson.sources[0].redistributionVerified=true;},
  a=>{a.find(b=>b.lesson.id==="zh:ni-hao:shared-pilot").lesson.sources[0].revision="0".repeat(40);},
  a=>{a.find(b=>b.lesson.id==="zh:ni-hao:shared-pilot").lesson.steps.find(s=>s.type==="encounter").examples[0].reading="ni hao";}
 ]){
  const altered=structuredClone(originals);fn(altered);assert.ok(build(phase30,altered).issues.length);
 }
 assert.ok(build([phase30[0],phase30[0]]).issues.some(i=>i.issue==="DUPLICATE_OR_EXISTING_LESSON"));
});
test("candidate writing never mutates original checkpoint-only persistence or native Chinese learning",()=>{
 const positions=Object.fromEntries(originals.map((b,i)=>[checkpointId(b),Math.min(i,framesFor(b).length)]));
 const value=serializeDemoCheckpoint(positions,originals);
 assert.deepEqual(parseDemoCheckpoint(value,originals),positions);
 assert.ok(build([...old,...phase30]).candidates.every(b=>!Object.hasOwn(positions,checkpointId(b))));
 assert.doesNotMatch(value,/"(?:draft|writing|userId|fsrs|officialHskLevel|grade|proficiency|publication|tone|approval)":/);
});
