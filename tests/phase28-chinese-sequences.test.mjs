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
import {validateLessonBundleV1} from "../packages/content-schema/src/lesson-v1.ts";
import {framesFor,evaluateExercise,revealExercise,checkpointId,serializeDemoCheckpoint,parseDemoCheckpoint} from "../apps/learner/src/lesson-model.ts";
import {createLessonPlayerState,reduceLessonPlayer,activeAttempt} from "../apps/learner/src/lesson-player.ts";
const read=p=>JSON.parse(readFileSync(fileURLToPath(new URL("../contracts/"+p,import.meta.url)),"utf8"));
const originals=["phase02-source-lessons","phase15-source-lessons","phase17-cross-source-lessons","phase18-next-source-lessons"].flatMap(p=>read("fixtures/"+p+".json").bundles);
const quotes=read("phase16-source-evidence.json").originalSourceQuotes;
const pinned=read("phase25-chinese-readings.json");
const prior=[...PHASE22_AUTHORING,...PHASE23_FRENCH_AUTHORING,...PHASE24_JAPANESE_AUTHORING,
 ...PHASE25_CHINESE_AUTHORING,...PHASE26_CHINESE_DEPTH,...PHASE27_CHINESE_TRANSFER];
const all=[...prior,...PHASE28_CHINESE_SEQUENCES];
const compiled=()=>compilePinnedSourceIntake(originals,all);

test("four independently authored Phase 28 Chinese source sequences add 60 activities without changing 29 prior candidates",()=>{
 const before=compilePinnedSourceIntake(originals,prior);
 const after=compiled();
 assert.deepEqual(before.issues,[]);assert.deepEqual(after.issues,[]);
 assert.equal(PHASE28_CHINESE_SEQUENCES.length,4);
 assert.equal(before.candidates.length,29);
 assert.equal(after.candidates.length,33);
 assert.deepEqual(after.candidates.slice(0,29),before.candidates);
 const oldIds=new Set([...originals,...before.candidates].flatMap(b=>b.exercises.map(e=>e.id)));
 for(const bundle of after.candidates.slice(29)){
  assert.equal(bundle.lesson.languageId,"zh");
  assert.equal(bundle.lesson.contentVersion,"phase28-chinese-source-authored-internal-v1");
  assert.equal(bundle.lesson.publication,"internal-fixture");
  assert.deepEqual(validateLessonBundleV1(bundle),[]);
  assert.equal(bundle.exercises.length,15);
  assert.equal(framesFor(bundle).length,20);
  assert.equal(bundle.exercises.filter(e=>e.kind==="free-production").length,4);
  assert.ok(bundle.lesson.sources.every(s=>s.repository==="thiepn/chinese"&&
    s.revision===pinned.sourceRevision&&s.rights==="review-required"&&
    s.editorialReview==="pending"&&!s.redistributionVerified));
  for(const e of bundle.exercises){
   assert.equal(oldIds.has(e.id),false,e.id);oldIds.add(e.id);
   assert.equal(e.evidence.mayScheduleReview,false);
   assert.equal(e.evidence.mayAssertProficiency,false);
  }
 }
 assert.equal(after.candidates.slice(29).reduce((n,b)=>n+b.exercises.length,0),60);
});

test("three unchanged original source expressions are ordered by the authored context, with targeted failure feedback and readable reveal",()=>{
 const {candidates,issues}=compilePinnedSourceIntake(originals,PHASE28_CHINESE_SEQUENCES);
 assert.deepEqual(issues,[]);
 for(const [i,b] of candidates.entries()){
  const spec=PHASE28_CHINESE_SEQUENCES[i],o=spec.chineseSequence.order;
  const e=b.exercises.find(e=>e.id.endsWith(":independent-sequence"));
  assert.ok(e&&e.kind==="ordering");
  assert.deepEqual(e.tokens,o.tokens);
  assert.deepEqual(new Set(o.tokens),new Set(spec.encounters.map(x=>x.quote)));
  const indexes=seq=>seq.map(q=>o.tokens.indexOf(q)).join(",");
  const correct=indexes(o.expected),wrong=indexes(o.misconception);
  assert.deepEqual(e.acceptedAnswers,[correct]);
  assert.equal(e.misconceptions[0].answer,wrong);
  assert.equal(evaluateExercise(e,correct).kind,"correct");
  const result=evaluateExercise(e,wrong);
  assert.equal(result.kind,"incorrect");
  assert.equal(result.explanation,o.feedback);
  assert.deepEqual(revealExercise(e).expected,[o.expected.join(" ")]);
  assert.deepEqual(new Set(e.sourceIds),new Set(spec.encounters.map(x=>x.sourceId)));
  for(const entry of spec.encounters){
   assert.ok(quotes[entry.sourceId].includes(entry.quote));
   const source=originals.find(b=>b.lesson.id===entry.lessonId);
   const original=source.lesson.steps.flatMap(s=>s.type==="encounter"?s.examples:[])
     .find(e=>e.targetText===entry.quote);
   assert.equal(original.reading,pinned.readings[entry.sourceId][entry.quote]);
   assert.ok(b.lesson.steps[0].examples.some(e=>e.targetText===original.targetText&&e.meaning===original.meaning&&e.reading===original.reading));
  }
 }
});

test("changed-role reading corrects wrong source evidence rather than awarding a grade",()=>{
 const {candidates,issues}=compilePinnedSourceIntake(originals,PHASE28_CHINESE_SEQUENCES);
 assert.deepEqual(issues,[]);
 for(const [i,b] of candidates.entries()){
  const s=PHASE28_CHINESE_SEQUENCES[i].chineseSequence.shiftedReading;
  const ex=b.exercises.find(e=>e.id.endsWith(":independent-shifted-reading"));
  assert.ok(ex&&ex.kind==="reading");
  assert.ok(ex.passage.startsWith("New authored follow-up, not a source dialogue:"));
  assert.ok(ex.passage.includes("Three original Chinese snippets with verified written Pinyin:"));
  assert.equal(ex.sourceAid.targetText,s.correctQuote);
  assert.equal(evaluateExercise(ex,s.correctQuote).kind,"correct");
  assert.equal(evaluateExercise(ex,s.wrongQuote).kind,"incorrect");
  assert.equal(evaluateExercise(ex,s.wrongQuote).explanation,s.feedback);
  for(const example of b.lesson.steps[0].examples)
   assert.ok(ex.passage.includes(example.targetText+" — "+example.reading));
 }
});

test("four independently authored ungraded dialogues run on the original Phase 05 player and stay revision-only",()=>{
 const {candidates,issues}=compilePinnedSourceIntake(originals,PHASE28_CHINESE_SEQUENCES);
 assert.deepEqual(issues,[]);
 for(const b of candidates){
  const frames=framesFor(b).filter(f=>f.exercise?.kind==="free-production");
  assert.equal(frames.length,4);
  for(const frame of frames){
   const idx=framesFor(b).findIndex(f=>f.id===frame.id);
   let player=createLessonPlayerState(b,idx);
   player=reduceLessonPlayer(player,{type:"draft",value:"新情境中的第一段中文练习。"});
   player=reduceLessonPlayer(player,{type:"submit"});
   assert.equal(activeAttempt(player).outcome?.kind,"ungraded");
   player=reduceLessonPlayer(player,{type:"revise"});
   player=reduceLessonPlayer(player,{type:"draft",value:"换一位听者之后重新写对话。"});
   player=reduceLessonPlayer(player,{type:"submit"});
   assert.equal(activeAttempt(player).outcome?.kind,"ungraded");
   assert.equal(activeAttempt(player).submissions,2);
   assert.equal(activeAttempt(player).outcome?.rubric.length,3);
  }
 }
});

test("reject fabricated tokens, duplicate or colliding orders, unpinned Pinyin, permission drift and invalid independent tasks",()=>{
 const mutations=[
  a=>{a[0].chineseSequence.order.tokens[0]="新的伪造来源";},
  a=>{a[0].chineseSequence.order.tokens[0]=a[0].chineseSequence.order.tokens[1];},
  a=>{a[1].chineseSequence.order.expected[0]=a[1].chineseSequence.order.expected[1];},
  a=>{a[2].chineseSequence.order.misconception=[...a[2].chineseSequence.order.expected];},
  a=>{a[3].chineseSequence.order.feedback="";},
  a=>{a[0].chineseSequence.shiftedReading.correctQuote="编造的一句话。";},
  a=>{a[0].chineseSequence.shiftedReading.wrongQuote=a[0].chineseSequence.shiftedReading.correctQuote;},
  a=>{a[1].chineseSequence.independentDialogue.criteria[2]="";},
  a=>{a[2].chineseExpansion.tone.reading="Ni xihuan he cha ma?";},
  a=>{a[3].languageId="fr";}
 ];
 for(const mutate of mutations){
  const edited=structuredClone(PHASE28_CHINESE_SEQUENCES);mutate(edited);
  assert.ok(compilePinnedSourceIntake(originals,edited).issues.length>0);
 }
 const dirtyOriginal=[
  list=>{list.find(b=>b.lesson.id==="zh:wo:shared-pilot").lesson.sources[0].rights="original-owned";},
  list=>{list.find(b=>b.lesson.id==="zh:shi:shared-pilot").lesson.sources[0].redistributionVerified=true;},
  list=>{list.find(b=>b.lesson.id==="zh:ni-hao:shared-pilot").lesson.sources[0].revision="0".repeat(40);},
  list=>{list.find(b=>b.lesson.id==="zh:ni-hao:shared-pilot").lesson.steps.find(s=>s.type==="encounter").examples[0].reading="ni hao";}
 ];
 for(const mutate of dirtyOriginal){
  const copies=structuredClone(originals);mutate(copies);
  assert.ok(compilePinnedSourceIntake(copies,PHASE28_CHINESE_SEQUENCES).issues.length>0);
 }
 const collision=compilePinnedSourceIntake(originals,[PHASE28_CHINESE_SEQUENCES[0],PHASE28_CHINESE_SEQUENCES[0]]);
 assert.ok(collision.issues.some(issue=>issue.issue==="DUPLICATE_OR_EXISTING_LESSON"));
});

test("original 12 lessons, 126 exercise IDs and version-scoped checkpoint-only storage remain authoritative",()=>{
 assert.equal(originals.length,12);
 assert.equal(originals.reduce((n,b)=>n+b.exercises.length,0),126);
 const positions=Object.fromEntries(originals.map((b,i)=>[checkpointId(b),Math.min(i,framesFor(b).length)]));
 const state=serializeDemoCheckpoint(positions,originals);
 assert.deepEqual(parseDemoCheckpoint(state,originals),positions);
 const {candidates,issues}=compiled();assert.deepEqual(issues,[]);
 assert.ok(candidates.every(b=>!Object.hasOwn(positions,checkpointId(b))));
 assert.doesNotMatch(state,/"(?:draft|writing|userId|fsrs|officialHskLevel|grade|proficiency|publication|tone|approval)":/);
});
