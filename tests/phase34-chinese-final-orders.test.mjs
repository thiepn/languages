import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {compilePinnedSourceIntake,PHASE22_AUTHORING} from "../apps/learner/src/source-intake.ts";
import {PHASE23_FRENCH_AUTHORING} from "../apps/learner/src/phase23-french-authoring.ts";
import {PHASE24_JAPANESE_AUTHORING} from "../apps/learner/src/phase24-japanese-authoring.ts";
import {PHASE25_CHINESE_AUTHORING} from "../apps/learner/src/phase25-chinese-authoring.ts";
import {PHASE26_CHINESE_DEPTH} from "../apps/learner/src/phase26-chinese-depth.ts";
import {PHASE27_CHINESE_TRANSFER} from "../apps/learner/src/phase27-chinese-transfer.ts";
import {PHASE28_CHINESE_SEQUENCES} from "../apps/learner/src/phase28-chinese-sequences.ts";
import {PHASE29_CHINESE_CONVERSATIONS} from "../apps/learner/src/phase29-chinese-conversations.ts";
import {PHASE30_ENRICHED_PERSPECTIVES} from "../apps/learner/src/phase30-revision-overlay.ts";
import {PHASE31_CHINESE_HANDOFFS} from "../apps/learner/src/phase31-chinese-handoffs.ts";
import {PHASE32_CHINESE_NEGOTIATIONS} from "../apps/learner/src/phase32-chinese-negotiations.ts";
import {PHASE33_CHINESE_COUNTERFACTUALS} from "../apps/learner/src/phase33-chinese-counterfactuals.ts";
import {PHASE34_CHINESE_FINAL_ORDERS} from "../apps/learner/src/phase34-chinese-final-orders.ts";
import {validateLessonBundleV1} from "../packages/content-schema/src/lesson-v1.ts";
import {evaluateExercise,framesFor,checkpointId,serializeDemoCheckpoint,parseDemoCheckpoint,revealExercise} from "../apps/learner/src/lesson-model.ts";
import {activeAttempt,createLessonPlayerState,reduceLessonPlayer,mayAdvance} from "../apps/learner/src/lesson-player.ts";

const read=p=>JSON.parse(readFileSync(fileURLToPath(new URL("../contracts/"+p,import.meta.url)),"utf8"));
const originals=["phase02-source-lessons","phase15-source-lessons","phase17-cross-source-lessons","phase18-next-source-lessons"].flatMap(p=>read("fixtures/"+p+".json").bundles);
const whitelist=read("phase16-source-evidence.json").originalSourceQuotes;
const pinyin=read("phase25-chinese-readings.json");
const predecessor=[...PHASE22_AUTHORING,...PHASE23_FRENCH_AUTHORING,...PHASE24_JAPANESE_AUTHORING,
 ...PHASE25_CHINESE_AUTHORING,...PHASE26_CHINESE_DEPTH,...PHASE27_CHINESE_TRANSFER,
 ...PHASE28_CHINESE_SEQUENCES,...PHASE29_CHINESE_CONVERSATIONS,...PHASE30_ENRICHED_PERSPECTIVES,
 ...PHASE31_CHINESE_HANDOFFS,...PHASE32_CHINESE_NEGOTIATIONS,...PHASE33_CHINESE_COUNTERFACTUALS];
const compile=(specs=PHASE34_CHINESE_FINAL_ORDERS,bundles=originals)=>
 compilePinnedSourceIntake(bundles,specs);
const orderKey=(tokens,order)=>order.map(q=>tokens.indexOf(q)).join(",");

test("all 53 predecessor editorial candidates and original 12/126 canonical bundles remain identical",()=>{
 const older=compile(predecessor),newer=compile([...predecessor,...PHASE34_CHINESE_FINAL_ORDERS]);
 assert.deepEqual(older.issues,[]);assert.deepEqual(newer.issues,[]);
 assert.equal(older.candidates.length,53);assert.equal(newer.candidates.length,57);
 assert.deepEqual(newer.candidates.slice(0,53),older.candidates);
 assert.equal(originals.length,12);
 assert.equal(originals.reduce((n,b)=>n+b.exercises.length,0),126);
 const oldIds=new Set([...originals,...older.candidates].flatMap(b=>b.exercises.map(e=>e.id)));
 for(const b of newer.candidates.slice(53)){
  assert.equal(b.lesson.languageId,"zh");
  assert.equal(b.lesson.contentVersion,"phase34-chinese-source-authored-internal-v1");
  assert.equal(b.lesson.publication,"internal-fixture");
  assert.deepEqual(validateLessonBundleV1(b),[]);
  assert.equal(b.exercises.length,48);
  assert.equal(framesFor(b).length,53);
  assert.equal(b.exercises.filter(e=>e.kind==="free-production").length,12);
  for(const e of b.exercises){
   assert.ok(!oldIds.has(e.id),"new original-engine exercise ID "+e.id);
   oldIds.add(e.id);
   assert.equal(e.evidence.mayScheduleReview,false);
   assert.equal(e.evidence.mayAssertProficiency,false);
  }
  assert.ok(b.lesson.sources.every(src=>src.repository===pinyin.sourceRepository&&
    src.path===pinyin.sourcePath&&src.revision===pinyin.sourceRevision&&
    src.rights==="review-required"&&src.editorialReview==="pending"&&
    src.redistributionVerified===false));
 }
 assert.equal(newer.candidates.slice(53).reduce((n,b)=>n+b.exercises.length,0),192);
});

test("exact source Hanzi, source ID, meaning and tone-marked Pinyin remain pinned, never fabricated source dialogue",()=>{
 const r=compile();assert.deepEqual(r.issues,[]);
 for(let i=0;i<4;i++){
  const b=r.candidates[i],spec=PHASE34_CHINESE_FINAL_ORDERS[i];
  const previous=PHASE33_CHINESE_COUNTERFACTUALS[i];
  assert.deepEqual(b.exercises.slice(0,44).map(e=>e.id),compile([previous]).candidates[0].exercises.map(e=>e.id).map(x=>x.replace(previous.id,spec.id)));
  const examples=b.lesson.steps[0].examples;
  for(const entry of spec.encounters){
   const example=examples.find(e=>e.targetText===entry.quote);
   assert.ok(example);
   assert.ok(whitelist[entry.sourceId].includes(entry.quote));
   assert.equal(example.reading,pinyin.readings[entry.sourceId][entry.quote]);
  }
  const selected=spec.chineseSixthTransfer.exactPinyin;
  assert.equal(pinyin.readings[selected.sourceId][selected.quote],selected.reading);
  assert.ok(examples.some(e=>e.targetText!==selected.quote&&e.reading===selected.sourceMisreading));
  assert.equal(b.plugin.languageId,"zh");
 }
});

test("the sixth authentic three-item order rejects every ONE of the five formerly valid situations, with five independent corrections",()=>{
 const {candidates,issues}=compile();assert.deepEqual(issues,[]);
 for(let i=0;i<candidates.length;i++){
  const spec=PHASE34_CHINESE_FINAL_ORDERS[i],f=spec.chineseSixthTransfer,
   tokens=spec.chineseSequence.order.tokens;
  const allPrevious=[
   spec.chineseSequence.order.expected,spec.chineseConversation.reversedSequence.expected,
   spec.chineseRevision.thirdSequence.expected,spec.chineseRoleHandoff.fourthSequence.expected,
   spec.chineseNegotiation.fifthSequence.expected
  ];
  const sixth=f.sixthSequence.expected;
  const keys=[...allPrevious,sixth].map(o=>orderKey(tokens,o));
  assert.equal(new Set(keys).size,6);
  const e=candidates[i].exercises.find(e=>e.id.endsWith(":independent-sixth-permutation"));
  assert.equal(e.kind,"ordering");
  assert.deepEqual(e.tokens,tokens);
  assert.deepEqual(e.acceptedAnswers,[keys[5]]);
  assert.equal(evaluateExercise(e,keys[5]).kind,"correct");
  for(let j=0;j<5;j++){
   const out=evaluateExercise(e,keys[j]);
   assert.equal(out.kind,"incorrect");
   assert.equal(out.explanation,f.sixthSequence.previousFeedback[j]);
  }
  assert.deepEqual(revealExercise(e).expected,[sixth.join(" ")]);
 }
});

test("the independent contextual reading rejects both other original excerpts with their own feedback and displays all authentic Pinyin",()=>{
 const {candidates,issues}=compile();assert.deepEqual(issues,[]);
 for(let i=0;i<candidates.length;i++){
  const spec=PHASE34_CHINESE_FINAL_ORDERS[i].chineseSixthTransfer.decision;
  const b=candidates[i],e=b.exercises.find(x=>x.id.endsWith(":independent-final-context"));
  assert.equal(e.kind,"reading");
  assert.ok(e.passage.includes("not original source dialogue"));
  assert.deepEqual(e.acceptedAnswers,[spec.correctQuote]);
  assert.equal(evaluateExercise(e,spec.correctQuote).kind,"correct");
  for(let j=0;j<2;j++){
   const outcome=evaluateExercise(e,spec.wrongQuotes[j]);
   assert.equal(outcome.kind,"incorrect");
   assert.equal(outcome.explanation,spec.feedback[j]);
  }
  for(const original of b.lesson.steps[0].examples)
   assert.ok(e.passage.includes(original.targetText+" — "+original.reading));
 }
});

test("tone-marked written Pinyin is exact source recall, not audio synthesis, with source-word and unmarked feedback",()=>{
 const {candidates,issues}=compile();assert.deepEqual(issues,[]);
 for(let i=0;i<candidates.length;i++){
  const authored=PHASE34_CHINESE_FINAL_ORDERS[i].chineseSixthTransfer.exactPinyin;
  const e=candidates[i].exercises.find(x=>x.id.endsWith(":independent-attested-pinyin-transfer"));
  assert.equal(e.kind,"typed");
  assert.equal(e.normalization,"pinyin-tone-marked");
  assert.deepEqual(e.acceptedAnswers,[authored.reading]);
  assert.equal(e.sourceAid.targetText,authored.quote);
  assert.equal(evaluateExercise(e,authored.reading).kind,"correct");
  const other=evaluateExercise(e,authored.sourceMisreading);
  assert.equal(other.kind,"incorrect");
  assert.equal(other.explanation,authored.sourceFeedback);
  const unmarked=authored.reading.normalize("NFD").replace(/[\u0300-\u036f]/gu,"").normalize("NFC");
  const wrongly=evaluateExercise(e,unmarked);
  assert.equal(wrongly.kind,"incorrect");
  assert.equal(wrongly.explanation,authored.unmarkedFeedback);
  assert.equal(e.evidence.mayScheduleReview,false);
 }
});

test("all twelve independent original-player writing opportunities retain first-draft comparison and lossless page-memory restore without any grade",()=>{
 const {candidates,issues}=compile();assert.deepEqual(issues,[]);
 for(const b of candidates){
  const frames=framesFor(b),writing=frames.filter(x=>x.exercise?.kind==="free-production");
  assert.equal(writing.length,12);
  for(const frame of writing){
   let state=createLessonPlayerState(b,frames.findIndex(x=>x.id===frame.id));
   const first="第一稿：原文由第一人说。",second="第二稿：听者更换而原文不变。";
   state=reduceLessonPlayer(state,{type:"draft",value:first});
   state=reduceLessonPlayer(state,{type:"submit"});
   assert.equal(activeAttempt(state).outcome.kind,"ungraded");
   state=reduceLessonPlayer(state,{type:"revise"});
   state=reduceLessonPlayer(state,{type:"draft",value:second});
   state=reduceLessonPlayer(state,{type:"submit"});
   assert.equal(activeAttempt(state).outcome.kind,"ungraded");
   assert.equal(activeAttempt(state).firstSubmittedDraft,first);
   state=reduceLessonPlayer(state,{type:"restore-first-draft"});
   assert.equal(activeAttempt(state).draft,first);
   assert.equal(activeAttempt(state).outcome,undefined);
   assert.equal(mayAdvance(state),false);
   state=reduceLessonPlayer(state,{type:"submit"});
   assert.equal(activeAttempt(state).outcome.kind,"ungraded");
   assert.equal(activeAttempt(state).submissions,3);
   assert.equal(activeAttempt(state).firstSubmittedDraft,first);
   assert.deepEqual(reduceLessonPlayer(state,{type:"reset"}).attempts,{});
  }
 }
});

test("wrong original source, incorrect Pinyin, a duplicated sixth order, and rights/locale tampering fail closed",()=>{
 const cases=[
  a=>{a[0].chineseSixthTransfer.decision.correctQuote="杜撰原文";},
  a=>{a[1].chineseSixthTransfer.decision.wrongQuotes[1]=a[1].chineseSixthTransfer.decision.correctQuote;},
  a=>{a[2].chineseSixthTransfer.decision.feedback[1]="bad";},
  a=>{a[3].chineseSixthTransfer.sixthSequence.expected=[...a[3].chineseSequence.order.expected];},
  a=>{a[0].chineseSixthTransfer.sixthSequence.expected=[...a[0].chineseConversation.reversedSequence.expected];},
  a=>{a[1].chineseSixthTransfer.sixthSequence.expected=[...a[1].chineseRevision.thirdSequence.expected];},
  a=>{a[2].chineseSixthTransfer.sixthSequence.expected=[...a[2].chineseRoleHandoff.fourthSequence.expected];},
  a=>{a[3].chineseSixthTransfer.sixthSequence.expected=[...a[3].chineseNegotiation.fifthSequence.expected];},
  a=>{a[0].chineseSixthTransfer.sixthSequence.expected[0]=a[0].chineseSixthTransfer.sixthSequence.expected[1];},
  a=>{a[1].chineseSixthTransfer.sixthSequence.previousFeedback[2]="";},
  a=>{a[2].chineseSixthTransfer.exactPinyin.reading="bu shi";},
  a=>{a[3].chineseSixthTransfer.exactPinyin.sourceId="zh-invented";},
  a=>{a[0].chineseSixthTransfer.exactPinyin.sourceMisreading="wo men";},
  a=>{a[1].chineseSixthTransfer.writing.criteria[0]="";},
  a=>{a[2].languageId="ja";},
  a=>{delete a[3].chineseCounterfactual;}
 ];
 for(const mutate of cases){
  const cloned=structuredClone(PHASE34_CHINESE_FINAL_ORDERS);mutate(cloned);
  assert.ok(compile(cloned).issues.length);
 }
 for(const mutate of [
  a=>{a.find(b=>b.lesson.id==="zh:wo:shared-pilot").lesson.sources[0].redistributionVerified=true;},
  a=>{a.find(b=>b.lesson.id==="zh:ni-hao:shared-pilot").lesson.sources[0].editorialReview="approved";},
  a=>{a.find(b=>b.lesson.id==="zh:shi:shared-pilot").lesson.sources[0].revision="0000000000000000000000000000000000000000";},
  a=>{a.find(b=>b.lesson.id==="zh:ni-hao:shared-pilot").lesson.steps.find(s=>s.type==="encounter").examples[0].reading="impossible";}
 ]){
  const changed=structuredClone(originals);mutate(changed);assert.ok(compile(PHASE34_CHINESE_FINAL_ORDERS,changed).issues.length);
 }
});

test("canonical source checkpoint serialisation excludes all unpublished transfer tasks and every learner-written response",()=>{
 const {candidates,issues}=compile();assert.deepEqual(issues,[]);
 const positions=Object.fromEntries(originals.map((b,i)=>[checkpointId(b),Math.min(i,framesFor(b).length)]));
 const serial=serializeDemoCheckpoint(positions,originals);
 assert.deepEqual(parseDemoCheckpoint(serial,originals),positions);
 assert.ok(candidates.every(c=>!Object.hasOwn(positions,checkpointId(c))));
 assert.doesNotMatch(serial,/firstSubmittedDraft|dialogue|draft|sourceMisreading|tone|fsrs|reviewGrade|proficiency/);
});
